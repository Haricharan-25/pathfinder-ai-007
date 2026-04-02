import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CareerInputPanelProps {
  onGenerate: (career: string, level: string) => void;
  isLoading: boolean;
}

const levels = ["Beginner", "Intermediate", "Advanced"] as const;

const quickPicks = [
  "Frontend Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Java Developer",
  "ML Engineer",
];

const CareerInputPanel = ({ onGenerate, isLoading }: CareerInputPanelProps) => {
  const [career, setCareer] = useState("");
  const [level, setLevel] = useState<string>("Beginner");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (career.trim()) onGenerate(career.trim(), level);
  };

  return (
    <div className="rounded-2xl glass-card glass-border p-6 shadow-card">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
          <Rocket className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-display text-base font-semibold text-foreground">Career Goal</h2>
          <p className="text-xs text-muted-foreground">What do you want to become?</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            placeholder="e.g. Java Developer, Data Scientist..."
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            className="h-11 bg-muted/50 border-border/60 text-foreground placeholder:text-muted-foreground/60 rounded-xl focus:border-primary/40 focus:ring-primary/20 transition-all pr-10"
          />
          {career.trim() && (
            <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Skill Level
          </label>
          <div className="flex gap-1.5 p-1 rounded-xl bg-muted/50">
            {levels.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  level === l
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={!career.trim() || isLoading}
          className="w-full h-11 gradient-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-40 shadow-glow"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 animate-pulse-glow" />
              Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate Roadmap
            </span>
          )}
        </Button>
      </form>

      <div className="mt-4 pt-4 border-t border-border/30">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2">Quick picks</p>
        <div className="flex flex-wrap gap-1.5">
          {quickPicks.map((s) => (
            <button
              key={s}
              onClick={() => setCareer(s)}
              className="rounded-lg bg-muted/60 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerInputPanel;
