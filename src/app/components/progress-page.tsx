import { useApp, routines } from "./app-context";
import { Timer, Trophy, Target, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

export function ProgressPage() {
  const { totalMinutes, badges, completedRoutines, favorites } = useApp();

  const earnedBadges = badges.filter((b) => b.earned);
  const nextBadge = badges.find((b) => !b.earned);
  const progressToNext = nextBadge
    ? Math.min(100, (totalMinutes / nextBadge.minutesRequired) * 100)
    : 100;

  const completionCount = completedRoutines.length;
  const favRoutines = routines.filter((r) => favorites.includes(r.id));

  // Count how many times each routine was completed
  const routineCounts: Record<string, number> = {};
  completedRoutines.forEach((id) => {
    routineCounts[id] = (routineCounts[id] || 0) + 1;
  });
  const mostDone = Object.entries(routineCounts).sort(([, a], [, b]) => b - a);

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1>Your Progress</h1>
        <p className="text-muted-foreground text-[14px] mt-1">
          Every minute counts toward protecting your knees
        </p>
      </div>

      {/* Main Stats */}
      <div className="px-5 mb-6">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/10">
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <p className="text-5xl text-primary" style={{ fontWeight: 700 }}>
                {totalMinutes}
              </p>
              <p className="text-muted-foreground text-[14px] mt-1">
                total minutes exercised
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Target className="w-4 h-4 text-accent" />
                <span className="text-[13px] text-muted-foreground">Routines Done</span>
              </div>
              <p className="text-xl" style={{ fontWeight: 600 }}>{completionCount}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-[13px] text-muted-foreground">Badges Earned</span>
              </div>
              <p className="text-xl" style={{ fontWeight: 600 }}>
                {earnedBadges.length}/{badges.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Badge Progress */}
      {nextBadge && (
        <div className="px-5 mb-6">
          <h3 className="mb-3">Next Milestone</h3>
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl opacity-40">{nextBadge.icon}</span>
              <div className="flex-1">
                <p style={{ fontWeight: 500 }}>{nextBadge.title}</p>
                <p className="text-[13px] text-muted-foreground">
                  {nextBadge.description}
                </p>
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
              {totalMinutes} / {nextBadge.minutesRequired} minutes
            </p>
          </div>
        </div>
      )}

      {/* All Badges */}
      <div className="px-5 mb-6">
        <h3 className="mb-3">Badges</h3>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`bg-card rounded-xl p-3 border text-center ${
                badge.earned
                  ? "border-primary/30 shadow-sm"
                  : "border-border opacity-40"
              }`}
            >
              <span className="text-2xl block mb-1">{badge.icon}</span>
              <p className="text-[12px]" style={{ fontWeight: 500 }}>{badge.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {badge.minutesRequired > 0
                  ? `${badge.minutesRequired} min`
                  : "1st routine"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Most Done Routines */}
      {mostDone.length > 0 && (
        <div className="px-5 mb-6">
          <h3 className="mb-3">Most Completed</h3>
          <div className="space-y-2">
            {mostDone.slice(0, 5).map(([id, count]) => {
              const routine = routines.find((r) => r.id === id);
              if (!routine) return null;
              return (
                <div
                  key={id}
                  className="bg-card rounded-xl p-3 border border-border flex items-center justify-between"
                >
                  <div>
                    <p className="text-[14px]" style={{ fontWeight: 500 }}>{routine.title}</p>
                    <p className="text-[13px] text-muted-foreground">
                      {routine.duration} min · {routine.category}
                    </p>
                  </div>
                  <div className="bg-primary/10 rounded-full px-3 py-1">
                    <span className="text-[13px] text-primary" style={{ fontWeight: 600 }}>
                      {count}x
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Favorite Routines */}
      {favRoutines.length > 0 && (
        <div className="px-5">
          <h3 className="mb-3">Your Favorites</h3>
          <div className="space-y-2">
            {favRoutines.map((routine) => (
              <div
                key={routine.id}
                className="bg-card rounded-xl p-3 border border-border flex items-center gap-3"
              >
                <span className="text-primary">💖</span>
                <div>
                  <p className="text-[14px]" style={{ fontWeight: 500 }}>{routine.title}</p>
                  <p className="text-[13px] text-muted-foreground">
                    {routine.duration} min · {routine.difficulty}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {totalMinutes === 0 && (
        <div className="px-5">
          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <p className="text-4xl mb-3">🌟</p>
            <p className="text-muted-foreground text-[14px]">
              Start your first routine to see your progress here! Every minute counts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
