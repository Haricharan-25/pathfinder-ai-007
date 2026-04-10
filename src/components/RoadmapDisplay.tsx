import { motion } from "framer-motion";
import { CheckCircle2, Circle, ExternalLink, Play, BookOpen, GraduationCap, Clock, Brain, BarChart3 } from "lucide-react";
import { RoadmapStep, StepProgress } from "@/types/roadmap";

interface RoadmapStepCardProps {
  step: RoadmapStep;
  index: number;
  isCompleted: boolean;
  onToggle: (stepId: number) => void;
}

const typeIcons = { video: Play, docs: BookOpen, course: GraduationCap };

const RoadmapStepCard = ({ step, index, isCompleted, onToggle }: RoadmapStepCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04, duration: 0.3 }}
    className={`rounded-xl border p-5 transition-colors duration-200 ${
      isCompleted ? "border-primary/30 bg-primary/[0.02]" : "border-border bg-card hover:border-primary/20"
    }`}
  >
    <div className="flex gap-3">
      {/* Toggle */}
      <button onClick={() => onToggle(step.id)} className="mt-0.5 shrink-0 transition-transform duration-200 hover:scale-110">
        {isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        ) : (
          <Circle className="h-5 w-5 text-border" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h4 className={`text-sm font-semibold leading-snug ${isCompleted ? "text-primary" : "text-foreground"}`}>
            {step.title}
          </h4>
          <span className="flex shrink-0 items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            <Clock className="h-3 w-3" />
            {step.estimatedHours}h
          </span>
        </div>

        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{step.description}</p>

        {/* Skills */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {step.skills.map((skill) => (
            <span key={skill} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
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
                className="flex items-center gap-2 rounded-md bg-secondary/60 px-3 py-2 text-xs text-muted-foreground hover:text-primary transition-colors duration-200 group"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-primary/50" />
                <span className="truncate">{res.title}</span>
                <ExternalLink className="ml-auto h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  </motion.div>
);

interface RoadmapDisplayProps {
  steps: RoadmapStep[];
  progress: StepProgress;
  onToggle: (stepId: number) => void;
  skillGapAnalysis: string;
  industryBenchmark: string;
}

const RoadmapDisplay = ({ steps, progress, onToggle, skillGapAnalysis, industryBenchmark }: RoadmapDisplayProps) => (
  <div className="space-y-4">
    {/* Analysis cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-border bg-card p-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">Skill Gap Analysis</h4>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{skillGapAnalysis}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="rounded-xl border border-border bg-card p-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">Industry Benchmark</h4>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{industryBenchmark}</p>
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

export default RoadmapDisplay;
