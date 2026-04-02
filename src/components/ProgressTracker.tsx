import { motion } from "framer-motion";
import { TrendingUp, Target, Clock } from "lucide-react";

interface ProgressTrackerProps {
  completed: number;
  total: number;
  totalWeeks: number;
}

const ProgressTracker = ({ completed, total, totalWeeks }: ProgressTrackerProps) => {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const weeksRemaining = total > 0 ? Math.round(totalWeeks * (1 - completed / total)) : totalWeeks;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-xl border border-border bg-card p-6 shadow-card"
    >
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">Progress</h3>

      {/* Circular progress */}
      <div className="flex justify-center mb-4">
        <div className="relative h-28 w-28">
          <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" className="stroke-muted" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              className="stroke-primary transition-all duration-700"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${pct * 2.64} 264`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold text-foreground">{pct}%</span>
            <span className="text-xs text-muted-foreground">Complete</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Target className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Steps:</span>
          <span className="ml-auto font-medium text-foreground">{completed}/{total}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-warning" />
          <span className="text-muted-foreground">Est. remaining:</span>
          <span className="ml-auto font-medium text-foreground">{weeksRemaining} weeks</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-success" />
          <span className="text-muted-foreground">Status:</span>
          <span className={`ml-auto font-medium ${pct === 100 ? "text-success" : "text-foreground"}`}>
            {pct === 100 ? "🎉 Complete!" : pct > 50 ? "On Track" : "Getting Started"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressTracker;
