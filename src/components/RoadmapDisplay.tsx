import { motion } from "framer-motion";
import { CheckCircle2, Circle, ExternalLink, Play, BookOpen, GraduationCap, Clock } from "lucide-react";
import { RoadmapStep, StepProgress } from "@/types/roadmap";

interface RoadmapStepCardProps {
  step: RoadmapStep;
  index: number;
  isCompleted: boolean;
  onToggle: (stepId: number) => void;
}

const typeIcons = {
  video: Play,
  docs: BookOpen,
  course: GraduationCap,
};

const RoadmapStepCard = ({ step, index, isCompleted, onToggle }: RoadmapStepCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`group relative rounded-xl border p-5 transition-all ${
        isCompleted
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-card hover:border-primary/20"
      } shadow-card`}
    >
      {/* Step number line */}
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <button
            onClick={() => onToggle(step.id)}
            className="transition-transform hover:scale-110"
          >
            {isCompleted ? (
              <CheckCircle2 className="h-7 w-7 text-primary" />
            ) : (
              <Circle className="h-7 w-7 text-muted-foreground group-hover:text-primary/60" />
            )}
          </button>
          <div className="mt-2 h-full w-px bg-border" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`font-display font-semibold ${isCompleted ? "text-primary" : "text-foreground"}`}>
              Step {step.id}: {step.title}
            </h4>
            <span className="flex shrink-0 items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {step.estimatedHours}h
            </span>
          </div>

          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{step.description}</p>

          {/* Skills */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {step.skills.map((skill) => (
              <span key={skill} className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                {skill}
              </span>
            ))}
          </div>

          {/* Resources */}
          <div className="space-y-1.5">
            {step.resources.map((res, i) => {
              const Icon = typeIcons[res.type] || BookOpen;
              return (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group/link"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{res.title}</span>
                  <ExternalLink className="ml-auto h-3 w-3 shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </a>
              );
            })}
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
    <div className="space-y-4">
      {/* Analysis cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h4 className="font-display text-sm font-semibold text-primary mb-1">Skill Gap Analysis</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{skillGapAnalysis}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h4 className="font-display text-sm font-semibold text-accent mb-1">Industry Benchmark</h4>
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
          />
        ))}
      </div>
    </div>
  );
};

export default RoadmapDisplay;
