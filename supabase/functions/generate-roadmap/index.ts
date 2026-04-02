import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { career, skillLevel } = await req.json();
    
    if (!career || typeof career !== "string" || career.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Career goal is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const level = ["Beginner", "Intermediate", "Advanced"].includes(skillLevel) ? skillLevel : "Beginner";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a career roadmap expert. Generate a structured learning roadmap as JSON.

RULES:
- Return ONLY a valid JSON object, no markdown, no code fences
- The roadmap must be tailored to the specific career: "${career.trim()}"
- Adjust complexity for skill level: "${level}"
- For Beginner: include fundamentals, basics, more steps (8-12)
- For Intermediate: skip basics, focus on practical skills (6-10 steps)
- For Advanced: focus on advanced topics, specialization (5-8 steps)
- Each step must have unique, specific resources (real URLs)
- Include estimated time for each step
- Include a skill gap analysis
- Include total estimated weeks

JSON FORMAT:
{
  "title": "Roadmap title",
  "totalWeeks": number,
  "skillGapAnalysis": "Brief analysis of what skills are needed and current gaps based on level",
  "industryBenchmark": "What the industry expects for this role",
  "steps": [
    {
      "id": number,
      "title": "Step title",
      "description": "What you'll learn and why",
      "estimatedHours": number,
      "resources": [
        { "title": "Resource name", "url": "https://...", "type": "video|docs|course" }
      ],
      "skills": ["skill1", "skill2"]
    }
  ]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a detailed, personalized learning roadmap for someone who wants to become a "${career.trim()}" at the "${level}" level. Make it specific, actionable, and different from any generic roadmap.` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    
    // Strip markdown code fences if present
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const roadmap = JSON.parse(content);

    return new Response(JSON.stringify(roadmap), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-roadmap error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
