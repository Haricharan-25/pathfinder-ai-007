import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Roadmap, StepProgress } from "@/types/roadmap";
import { loadProgress, saveProgress, getCareerKey } from "@/lib/storage";
import CareerInputPanel from "@/components/CareerInputPanel";
import ProgressTracker from "@/components/ProgressTracker";
import RoadmapDisplay from "@/components/RoadmapDisplay";

const Index = () => {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [progress, setProgress] = useState<StepProgress>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentKey, setCurrentKey] = useState("");
  const { toast } = useToast();

  const handleGenerate = useCallback(async (career: string, level: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-roadmap", {
        body: { career, skillLevel: level },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const key = getCareerKey(career, level);
      setCurrentKey(key);
      setRoadmap(data as Roadmap);
      const saved = loadProgress(key);
      setProgress(saved);
      toast({ title: "Roadmap Generated!", description: `Your ${career} roadmap is ready.` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to generate roadmap", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleToggle = useCallback((stepId: number) => {
    setProgress((prev) => {
      const next = { ...prev, [stepId]: !prev[stepId] };
      saveProgress(currentKey, next);
      return next;
    });
  }, [currentKey]);

  const completedCount = Object.values(progress).filter(Boolean).length;

  const exportPDF = () => {
    if (!roadmap) return;
    const content = [
      roadmap.title,
      `Total estimated: ${roadmap.totalWeeks} weeks`,
      "",
      "SKILL GAP ANALYSIS:",
      roadmap.skillGapAnalysis,
      "",
      "INDUSTRY BENCHMARK:",
      roadmap.industryBenchmark,
      "",
      "STEPS:",
      ...roadmap.steps.map((s) =>
        `\n${s.id}. ${s.title} (${s.estimatedHours}h)\n   ${s.description}\n   Skills: ${s.skills.join(", ")}\n   Resources:\n${s.resources.map((r) => `   - ${r.title}: ${r.url}`).join("\n")}`
      ),
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${roadmap.title.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported!", description: "Roadmap exported as text file." });
  };

  return (
    <div className="min-h-screen gradient-surface">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Map className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-display text-xl font-bold text-foreground">
              AI Career <span className="text-gradient">Roadmap</span>
            </h1>
          </div>
          {roadmap && (
            <Button onClick={exportPDF} variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4">
            <CareerInputPanel onGenerate={handleGenerate} isLoading={isLoading} />
            {roadmap && (
              <ProgressTracker
                completed={completedCount}
                total={roadmap.steps.length}
                totalWeeks={roadmap.totalWeeks}
              />
            )}
          </div>

          {/* Main area */}
          <div className="lg:col-span-8 xl:col-span-9">
            {roadmap ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">{roadmap.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      Estimated {roadmap.totalWeeks} weeks · {roadmap.steps.length} steps
                    </p>
                  </div>
                </div>
                <RoadmapDisplay
                  steps={roadmap.steps}
                  progress={progress}
                  onToggle={handleToggle}
                  skillGapAnalysis={roadmap.skillGapAnalysis}
                  industryBenchmark={roadmap.industryBenchmark}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-96 rounded-xl border border-dashed border-border bg-card/30"
              >
                <Map className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="font-display text-lg font-semibold text-muted-foreground">No roadmap yet</h3>
                <p className="text-sm text-muted-foreground/60 mt-1">Enter a career goal and hit generate</p>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
