import { motion } from "framer-motion";
import { TrendingUp, Target, Clock, Trophy } from "lucide-react";

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
      className="rounded-2xl glass-card glass-border p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-base font-semibold text-foreground">Progress</h3>
        {pct === 100 && <Trophy className="h-5 w-5 text-warning" />}
      </div>

      {/* Circular progress */}
      <div className="flex justify-center mb-5">
        <div className="relative h-32 w-32">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" className="stroke-muted" strokeWidth="6" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none"
              className="stroke-primary"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 264" }}
              animate={{ strokeDasharray: `${pct * 2.64} 264` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-bold text-foreground">{pct}%</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Complete</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <span className="text-muted-foreground">Steps</span>
          <span className="ml-auto font-display font-semibold text-foreground">{completed}/{total}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
            <Clock className="h-4 w-4 text-warning" />
          </div>
          <span className="text-muted-foreground">Remaining</span>
          <span className="ml-auto font-display font-semibold text-foreground">{weeksRemaining}w</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <span className="text-muted-foreground">Status</span>
          <span className={`ml-auto font-display font-semibold ${pct === 100 ? "text-success" : pct > 50 ? "text-primary" : "text-foreground"}`}>
            {pct === 100 ? "Complete! 🎉" : pct > 50 ? "On Track" : "Getting Started"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressTracker;
