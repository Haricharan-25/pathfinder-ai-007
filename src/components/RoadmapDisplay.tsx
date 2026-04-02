import { motion } from "framer-motion";
import { CheckCircle2, Circle, ExternalLink, Play, BookOpen, GraduationCap, Clock, Brain, BarChart3 } from "lucide-react";
import { RoadmapStep, StepProgress } from "@/types/roadmap";

interface RoadmapStepCardProps {
  step: RoadmapStep;
  index: number;
  isCompleted: boolean;
  onToggle: (stepId: number) => void;
  totalSteps: number;
}

const typeIcons = {
  video: Play,
  docs: BookOpen,
  course: GraduationCap,
};

const RoadmapStepCard = ({ step, index, isCompleted, onToggle, totalSteps }: RoadmapStepCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, ease: "easeOut" }}
      className="relative"
    >
      {/* Connector line */}
      {index < totalSteps - 1 && (
        <div className="absolute left-[19px] top-[52px] bottom-[-12px] w-px bg-border/40" />
      )}

      <div className={`group relative rounded-2xl glass-border p-5 transition-all duration-300 ${
        isCompleted
          ? "glass-card border-primary/20 shadow-glow"
          : "glass-card hover:border-primary/15 hover:shadow-card"
      }`}>
        <div className="flex gap-4">
          {/* Step indicator */}
          <div className="flex flex-col items-center pt-0.5">
            <button
              onClick={() => onToggle(step.id)}
              className="relative transition-transform hover:scale-110 z-10"
            >
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CheckCircle2 className="h-7 w-7 text-primary drop-shadow-[0_0_8px_hsl(168,80%,48%,0.4)]" />
                </motion.div>
              ) : (
                <div className="relative">
                  <Circle className="h-7 w-7 text-muted-foreground/40 group-hover:text-primary/50 transition-colors" />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-muted-foreground/60 font-display">
                    {step.id}
                  </span>
                </div>
              )}
            </button>
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4 className={`font-display font-semibold leading-snug ${isCompleted ? "text-primary" : "text-foreground"}`}>
                {step.title}
              </h4>
              <span className="flex shrink-0 items-center gap-1 rounded-lg bg-muted/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                <Clock className="h-3 w-3" />
                {step.estimatedHours}h
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{step.description}</p>

            {/* Skills */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {step.skills.map((skill) => (
                <span key={skill} className="rounded-lg bg-secondary/80 px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
                  {skill}
                </span>
              ))}
            </div>

            {/* Resources */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {step.resources.map((res, i) => {
                const Icon = typeIcons[res.type] || BookOpen;
                return (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all group/link"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                    <span className="truncate">{res.title}</span>
                    <ExternalLink className="ml-auto h-3 w-3 shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface RoadmapDisplayProps {
  steps: RoadmapStep[];
  progress: StepProgress;
  onToggle: (stepId: number) => void;
  skillGapAnalysis: string;
  industryBenchmark: string;
}

const RoadmapDisplay = ({ steps, progress, onToggle, skillGapAnalysis, industryBenchmark }: RoadmapDisplayProps) => {
  return (
    <div className="space-y-5">
      {/* Analysis cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl glass-card glass-border p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <h4 className="font-display text-sm font-semibold text-foreground">Skill Gap Analysis</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{skillGapAnalysis}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="rounded-2xl glass-card glass-border p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
              <BarChart3 className="h-4 w-4 text-accent" />
            </div>
            <h4 className="font-display text-sm font-semibold text-foreground">Industry Benchmark</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{industryBenchmark}</p>
        </motion.div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, i) => (
          <RoadmapStepCard
            key={step.id}
            step={step}
            index={i}
            isCompleted={!!progress[step.id]}
            onToggle={onToggle}
            totalSteps={steps.length}
          />
        ))}
      </div>
    </div>
  );
};

export default RoadmapDisplay;
