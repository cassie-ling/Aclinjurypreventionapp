import { motion } from "motion/react";

interface WeeklyRingProps {
  value: number;
  goal: number;
  title?: string;
  size?: number;
  // Shown under the ring. Always neutral: an empty ring is not a failure state.
  caption: string;
}

export function WeeklyRing({ value, goal, title = "This week", size = 120, caption }: WeeklyRingProps) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = goal > 0 ? Math.min(1, value / goal) : 0;
  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" role="img" aria-label={`${value} of ${goal} minutes`}>
          <circle cx="60" cy="60" r={r} fill="none" stroke="var(--muted)" strokeWidth="10" />
          <motion.circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c * (1 - pct) }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl tabular-nums" style={{ fontWeight: 700 }}>{value}</span>
          <span className="text-[11px] text-muted-foreground">of {goal} min</span>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-[13px] text-muted-foreground">{title}</p>
        <p className="text-[14px] mt-1">{caption}</p>
      </div>
    </div>
  );
}

// Neutral, encouraging copy only. No "missed", no "streak".
export function weeklyCaption(opts: { minutes: number; goal: number; everTrained: boolean }) {
  if (opts.minutes >= opts.goal) return "You reached your goal this week. Nice work!";
  if (opts.minutes > 0) return "Every minute counts. Go at your own pace.";
  return opts.everTrained ? "Welcome back. A fresh week, whenever you are ready." : "A fresh week. Start whenever you are ready.";
}
