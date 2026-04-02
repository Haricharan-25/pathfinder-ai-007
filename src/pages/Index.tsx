import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Map, Sparkles, ArrowRight, Zap, Target, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Roadmap, StepProgress } from "@/types/roadmap";
import { loadProgress, saveProgress, getCareerKey } from "@/lib/storage";
import CareerInputPanel from "@/components/CareerInputPanel";
import ProgressTracker from "@/components/ProgressTracker";
import RoadmapDisplay from "@/components/RoadmapDisplay";

const features = [
  { icon: Zap, title: "AI-Powered", desc: "Dynamic roadmaps tailored to your goals" },
  { icon: Target, title: "Skill Gap Analysis", desc: "Understand where you stand today" },
  { icon: BarChart3, title: "Industry Benchmarks", desc: "Compare with market standards" },
];

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
      {/* Ambient glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16 px-6 mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <Map className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground tracking-tight">
                PathFinder<span className="text-gradient">AI</span>
              </h1>
            </div>
          </div>
          {roadmap && (
            <Button onClick={exportPDF} variant="outline" size="sm" className="gap-2 glass-border glass-card hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all">
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      </header>

      <main className="relative container mx-auto max-w-7xl px-6 py-8">
        <AnimatePresence mode="wait">
          {!roadmap ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-8"
            >
              {/* Hero Section */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 rounded-full glass-card glass-border px-4 py-1.5 mb-6"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Powered by AI</span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight leading-tight"
                >
                  Build Your Career
                  <br />
                  <span className="text-gradient">Roadmap in Seconds</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed"
                >
                  Enter your dream tech role and get a personalized, step-by-step learning path with resources, timelines, and skill gap analysis.
                </motion.p>
              </div>

              {/* Input Panel - Centered */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="max-w-lg mx-auto mb-16"
              >
                <CareerInputPanel onGenerate={handleGenerate} isLoading={isLoading} />
              </motion.div>

              {/* Feature Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
              >
                {features.map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="group rounded-xl glass-card glass-border p-5 hover:border-primary/20 transition-all hover:shadow-glow"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display text-sm font-semibold text-foreground mb-1">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Sidebar */}
              <div className="lg:col-span-4 xl:col-span-3 space-y-4">
                <CareerInputPanel onGenerate={handleGenerate} isLoading={isLoading} />
                <ProgressTracker
                  completed={completedCount}
                  total={roadmap.steps.length}
                  totalWeeks={roadmap.totalWeeks}
                />
              </div>

              {/* Main area */}
              <div className="lg:col-span-8 xl:col-span-9">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">{roadmap.title}</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Estimated <span className="text-primary font-medium">{roadmap.totalWeeks} weeks</span> · {roadmap.steps.length} steps
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/30 py-6 mt-12">
        <div className="container mx-auto max-w-7xl px-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground/60">© 2026 PathFinderAI. All rights reserved.</p>
          <p className="text-xs text-muted-foreground/40">Built with AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
