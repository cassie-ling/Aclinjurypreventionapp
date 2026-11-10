import { useApp, routines, MILESTONES } from "./app-context";
import { WeeklyRing, weeklyCaption } from "./weekly-ring";
import { Target, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

export function ProgressPage() {
  const {
    totalMinutes,
    milestones,
    completedRoutines,
    sessions,
    favorites,
    settings,
    minutesThisWeek,
    minutesLastWeek,
  } = useApp();

  const earnedCount = MILESTONES.filter((m) => milestones.includes(m.id)).length;
  const nextMinuteMilestone = MILESTONES.find(
    (m) => m.minutesRequired !== undefined && !milestones.includes(m.id)
  );
  const progressToNext = nextMinuteMilestone
    ? Math.min(100, (totalMinutes / nextMinuteMilestone.minutesRequired!) * 100)
    : 100;

  const favRoutines = routines.filter((r) => favorites.includes(r.id));

  const routineCounts: Record<string, number> = {};
  completedRoutines.forEach((id) => {
    routineCounts[id] = (routineCounts[id] || 0) + 1;
  });
  const mostDone = Object.entries(routineCounts).sort(([, a], [, b]) => b - a);

  // Descriptive only. No judgement about up or down.
  const trend =
    sessions.length === 0
      ? null
      : `Last week: ${minutesLastWeek} min. This week so far: ${minutesThisWeek} min.`;

  return (
    <div className="pb-6">
      <div className="pl-5 pr-16 pt-6 pb-4">
        <h1>Your Progress</h1>
        <p className="text-muted-foreground text-[14px] mt-1">Every minute counts toward protecting your knees</p>
      </div>

      {settings.weeklyGoalEnabled && (
        <div className="px-5 mb-4">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <WeeklyRing
              value={minutesThisWeek}
              goal={settings.weeklyGoalMinutes}
              caption={weeklyCaption({
                minutes: minutesThisWeek,
                goal: settings.weeklyGoalMinutes,
                everTrained: completedRoutines.length > 0,
              })}
            />
          </div>
        </div>
      )}

      <div className="px-5 mb-6">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/10">
          <div className="text-center">
            <p className="text-5xl text-primary" style={{ fontWeight: 700 }}>{totalMinutes}</p>
            <p className="text-muted-foreground text-[14px] mt-1">total minutes exercised</p>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center">
              <p className="text-[12px] text-muted-foreground">This week</p>
              <p className="text-xl" style={{ fontWeight: 600 }}>{minutesThisWeek}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-[12px] text-muted-foreground">
                <Target className="w-3.5 h-3.5 text-accent" /> Sessions
              </div>
              <p className="text-xl" style={{ fontWeight: 600 }}>{completedRoutines.length}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-[12px] text-muted-foreground">
                <TrendingUp className="w-3.5 h-3.5 text-primary" /> Milestones
              </div>
              <p className="text-xl" style={{ fontWeight: 600 }}>{earnedCount}/{MILESTONES.length}</p>
            </div>
          </div>
          {trend && <p className="text-[13px] text-muted-foreground text-center mt-4">{trend}</p>}
        </div>
      </div>

      {nextMinuteMilestone && (
        <div className="px-5 mb-6">
          <h3 className="mb-3">Next Milestone</h3>
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl opacity-40">{nextMinuteMilestone.icon}</span>
              <div className="flex-1">
                <p style={{ fontWeight: 500 }}>{nextMinuteMilestone.title}</p>
                <p className="text-[13px] text-muted-foreground">{nextMinuteMilestone.description}</p>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <p className="text-[13px] text-muted-foreground mt-2">
              {totalMinutes} / {nextMinuteMilestone.minutesRequired} minutes
            </p>
          </div>
        </div>
      )}

      <div className="px-5 mb-6">
        <h3 className="mb-1">Milestones</h3>
        <p className="text-[12px] text-muted-foreground mb-3">Once earned, they are yours for good.</p>
        <div className="grid grid-cols-3 gap-3">
          {MILESTONES.map((m) => {
            const earned = milestones.includes(m.id);
            return (
              <div
                key={m.id}
                className={`bg-card rounded-xl p-3 border text-center ${
                  earned ? "border-primary/30 shadow-sm" : "border-border opacity-40"
                }`}
              >
                <span className="text-2xl block mb-1" aria-hidden>{m.icon}</span>
                <p className="text-[12px]" style={{ fontWeight: 500 }}>{m.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{m.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {mostDone.length > 0 && (
        <div className="px-5 mb-6">
          <h3 className="mb-3">Most Completed</h3>
          <div className="space-y-2">
            {mostDone.slice(0, 5).map(([id, count]) => {
              const routine = routines.find((r) => r.id === id);
              if (!routine) return null;
              return (
                <div key={id} className="bg-card rounded-xl p-3 border border-border flex items-center justify-between">
                  <div>
                    <p className="text-[14px]" style={{ fontWeight: 500 }}>{routine.title}</p>
                    <p className="text-[13px] text-muted-foreground">{routine.duration} min · {routine.category}</p>
                  </div>
                  <div className="bg-primary/10 rounded-full px-3 py-1">
                    <span className="text-[13px] text-primary" style={{ fontWeight: 600 }}>{count}x</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {favRoutines.length > 0 && (
        <div className="px-5">
          <h3 className="mb-3">Your Favorites</h3>
          <div className="space-y-2">
            {favRoutines.map((routine) => (
              <div key={routine.id} className="bg-card rounded-xl p-3 border border-border flex items-center gap-3">
                <span className="text-primary">💖</span>
                <div>
                  <p className="text-[14px]" style={{ fontWeight: 500 }}>{routine.title}</p>
                  <p className="text-[13px] text-muted-foreground">{routine.duration} min · {routine.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalMinutes === 0 && (
        <div className="px-5 mt-6">
          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <p className="text-4xl mb-3">🌟</p>
            <p className="text-muted-foreground text-[14px]">
              Start your first routine to see your progress here. Every minute counts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
