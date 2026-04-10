import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Map, Sparkles, Zap, Target, BarChart3, Moon, Sun, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/integrations/supabase/client";
import { Roadmap, StepProgress } from "@/types/roadmap";
import { loadProgress, saveProgress, getCareerKey } from "@/lib/storage";
import CareerInputPanel from "@/components/CareerInputPanel";
import ProgressTracker from "@/components/ProgressTracker";
import RoadmapDisplay from "@/components/RoadmapDisplay";
import SkeletonRoadmap from "@/components/SkeletonRoadmap";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

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
  const { user, signOut } = useAuth();
  const { toggle } = useTheme();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  const handleToggleTheme = () => {
    toggle();
    setIsDark(!isDark);
  };

  const handleGenerate = useCallback(async (career: string, level: string) => {
    setIsLoading(true);
    setRoadmap(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-roadmap", {
        body: { career, skillLevel: level },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      const key = getCareerKey(career, level);
      setCurrentKey(key);
      setRoadmap(data as Roadmap);
      setProgress(loadProgress(key));
      toast({ title: "Roadmap generated", description: `Your ${career} roadmap is ready.` });
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

  const exportRoadmap = () => {
    if (!roadmap) return;
    const content = [
      roadmap.title,
      `Total estimated: ${roadmap.totalWeeks} weeks\n`,
      "SKILL GAP ANALYSIS:", roadmap.skillGapAnalysis + "\n",
      "INDUSTRY BENCHMARK:", roadmap.industryBenchmark + "\n",
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
    toast({ title: "Exported", description: "Roadmap exported as text file." });
  };

  const showDashboard = roadmap || isLoading;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-14 px-6 mx-auto max-w-6xl">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Map className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">
              PathFinder<span className="text-primary">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleTheme}
              className="h-9 w-9 text-muted-foreground hover:text-foreground transition-colors"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Auth buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground hidden sm:inline truncate max-w-[120px]">
                  {user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate("/auth")} className="gap-1.5 text-xs">
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </Button>
            )}

            {roadmap && (
              <Button onClick={exportRoadmap} variant="outline" size="sm" className="gap-1.5 text-xs">
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-6 py-10">
        <AnimatePresence mode="wait">
          {!showDashboard ? (
            <motion.div key="hero" {...fade} exit={{ opacity: 0, y: -12 }} className="max-w-2xl mx-auto text-center py-16">
              <motion.div {...fade} transition={{ delay: 0.05 }} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 mb-6">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Powered by AI</span>
              </motion.div>

              <motion.h2 {...fade} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-4">
                Build Your Career <span className="text-primary">Roadmap</span>
              </motion.h2>

              <motion.p {...fade} transition={{ delay: 0.15 }} className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-lg mx-auto">
                Enter your dream tech role and get a personalized, step-by-step learning path with resources and timelines.
              </motion.p>

              <motion.div {...fade} transition={{ delay: 0.2 }} className="max-w-md mx-auto mb-16">
                <CareerInputPanel onGenerate={handleGenerate} isLoading={isLoading} />
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {features.map((f, i) => (
                  <motion.div
                    key={f.title}
                    {...fade}
                    transition={{ delay: 0.25 + i * 0.05 }}
                    className="rounded-xl border border-border p-5 text-left hover:border-primary/30 transition-colors duration-200"
                  >
                    <f.icon className="h-5 w-5 text-primary mb-3" />
                    <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="dashboard" {...fade} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 xl:col-span-3 space-y-4">
                <CareerInputPanel onGenerate={handleGenerate} isLoading={isLoading} />
                {roadmap && (
                  <ProgressTracker completed={completedCount} total={roadmap.steps.length} totalWeeks={roadmap.totalWeeks} />
                )}
              </div>
              <div className="lg:col-span-8 xl:col-span-9">
                {isLoading && !roadmap ? (
                  <SkeletonRoadmap />
                ) : roadmap ? (
                  <motion.div {...fade}>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold tracking-tight text-foreground">{roadmap.title}</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Estimated <span className="text-primary font-medium">{roadmap.totalWeeks} weeks</span> · {roadmap.steps.length} steps
                      </p>
                    </div>
                    <RoadmapDisplay
                      steps={roadmap.steps}
                      progress={progress}
                      onToggle={handleToggle}
                      skillGapAnalysis={roadmap.skillGapAnalysis}
                      industryBenchmark={roadmap.industryBenchmark}
                    />
                  </motion.div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-border py-6 mt-16">
        <div className="container mx-auto max-w-6xl px-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">© 2026 PathFinderAI</p>
          <p className="text-xs text-muted-foreground">Built with AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
