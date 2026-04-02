import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CareerInputPanelProps {
  onGenerate: (career: string, level: string) => void;
  isLoading: boolean;
}

const levels = ["Beginner", "Intermediate", "Advanced"] as const;

const CareerInputPanel = ({ onGenerate, isLoading }: CareerInputPanelProps) => {
  const [career, setCareer] = useState("");
  const [level, setLevel] = useState<string>("Beginner");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (career.trim()) onGenerate(career.trim(), level);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-6 shadow-card"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
          <Rocket className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Career Goal</h2>
          <p className="text-sm text-muted-foreground">Enter your dream tech role</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="e.g. Java Developer, Data Scientist, DevOps Engineer..."
          value={career}
          onChange={(e) => setCareer(e.target.value)}
          className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-muted-foreground">Skill Level</label>
          <div className="flex gap-2">
            {levels.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  level === l
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "bg-muted text-muted-foreground hover:text-foreground"
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
          className="w-full gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 animate-pulse-glow" />
              Generating Roadmap...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate Roadmap
            </span>
          )}
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {["Frontend Developer", "Data Scientist", "DevOps Engineer", "Java Developer", "ML Engineer"].map((s) => (
          <button
            key={s}
            onClick={() => setCareer(s)}
            className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default CareerInputPanel;
