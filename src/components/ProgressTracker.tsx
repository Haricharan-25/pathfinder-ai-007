import { motion } from "framer-motion";
import { Target, Clock, TrendingUp, Trophy } from "lucide-react";

interface ProgressTrackerProps {
  completed: number;
  total: number;
  totalWeeks: number;
}

const ProgressTracker = ({ completed, total, totalWeeks }: ProgressTrackerProps) => {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const weeksRemaining = total > 0 ? Math.round(totalWeeks * (1 - completed / total)) : totalWeeks;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Progress</h3>
        {pct === 100 && <Trophy className="h-4 w-4 text-warning" />}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-2xl font-bold text-foreground">{pct}%</span>
          <span className="text-xs text-muted-foreground">{completed}/{total} steps</span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5 text-sm">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Remaining</span>
          <span className="ml-auto font-medium text-foreground">{weeksRemaining}w</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Status</span>
          <span className={`ml-auto font-medium ${pct === 100 ? "text-success" : pct > 50 ? "text-primary" : "text-foreground"}`}>
            {pct === 100 ? "Complete 🎉" : pct > 50 ? "On Track" : "Getting Started"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
