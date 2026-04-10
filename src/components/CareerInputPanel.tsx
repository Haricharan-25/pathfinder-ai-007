import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CareerInputPanelProps {
  onGenerate: (career: string, level: string) => void;
  isLoading: boolean;
}

const levels = ["Beginner", "Intermediate", "Advanced"] as const;

const quickPicks = ["Frontend Developer", "Data Scientist", "DevOps Engineer", "Java Developer", "ML Engineer"];

const CareerInputPanel = ({ onGenerate, isLoading }: CareerInputPanelProps) => {
  const [career, setCareer] = useState("");
  const [level, setLevel] = useState<string>("Beginner");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (career.trim()) onGenerate(career.trim(), level);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold text-foreground mb-1">Career Goal</h2>
      <p className="text-xs text-muted-foreground mb-4">What do you want to become?</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="e.g. Java Developer, Data Scientist..."
          value={career}
          onChange={(e) => setCareer(e.target.value)}
          className="h-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
        />

        {/* Skill level toggle */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Skill Level</label>
          <div className="flex gap-1 p-1 rounded-lg bg-secondary">
            {levels.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors duration-200 ${
                  level === l
                    ? "bg-primary text-primary-foreground shadow-sm"
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
          className="w-full h-10 text-sm font-medium transition-all duration-200 hover:scale-[1.01]"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 animate-pulse" />
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

      {/* Quick picks */}
      <div className="mt-4 pt-3 border-t border-border">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Quick picks</p>
        <div className="flex flex-wrap gap-1.5">
          {quickPicks.map((s) => (
            <button
              key={s}
              onClick={() => setCareer(s)}
              className="rounded-md bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors duration-200"
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
