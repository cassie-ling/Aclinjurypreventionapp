import { useApp, routines } from "./app-context";
import { RoutineCard } from "./routine-card";
import { Sparkles, Timer, Trophy } from "lucide-react";
import type { Routine } from "./app-context";

interface HomePageProps {
  onSelectRoutine: (routine: Routine) => void;
}

export function HomePage({ onSelectRoutine }: HomePageProps) {
  const { favorites, totalMinutes, badges } = useApp();
  const earnedBadges = badges.filter((b) => b.earned);
  const favRoutines = routines.filter((r) => favorites.includes(r.id));

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <p className="text-muted-foreground text-[14px]">Dashboard</p>
        <h1>Protect Her Play</h1>
      </div>

      {/* Total minutes + latest badge (same row) */}
      <div className="px-5 grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Timer className="w-4 h-4 shrink-0 text-primary" />
            <span className="text-[13px] text-muted-foreground truncate">Total Minutes</span>
          </div>
          <p className="text-2xl" style={{ fontWeight: 700 }}>
            {totalMinutes}
          </p>
        </div>
        <div className="bg-card from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20 shadow-sm min-w-0 flex flex-col justify-center">
          {earnedBadges.length > 0 ? (
            <>
              <div className="flex items-center gap-1.5 mb-1">
                <Trophy className="w-3.5 h-3.5 shrink-0 text-primary" />
                <span className="text-[13px] text-muted-foreground truncate">Latest Badge</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-2xl shrink-0" aria-hidden>
                  {earnedBadges[earnedBadges.length - 1].icon}
                </span>
                <p className="text-[14px] leading-tight line-clamp-2" style={{ fontWeight: 600 }}>
                  {earnedBadges[earnedBadges.length - 1].title}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 mb-1">
                <Trophy className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                <span className="text-[13px] text-muted-foreground truncate">Latest Badge</span>
              </div>
              <p className="text-[13px] text-muted-foreground leading-snug">
                Complete routines to earn your first badge.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Favorites */}
      <div className="px-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3>Your Favorites</h3>
        </div>
        {favRoutines.length === 0 ? (
          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <p className="text-4xl mb-3">💖</p>
            <p className="text-muted-foreground text-[14px]">
              No favorites yet! Head to the Exercises tab and tap the heart on routines you love.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {favRoutines.map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                onTap={onSelectRoutine}
                compact
              />
            ))}
          </div>
        )}
      </div>

      {/* Suggested */}
      <div className="px-5 mt-6">
        <h3 className="mb-3">Suggested For You</h3>
        <div className="space-y-4">
          {routines.slice(0, 3).map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onTap={onSelectRoutine}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
