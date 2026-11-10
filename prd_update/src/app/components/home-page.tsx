import { useApp, routines, MILESTONES } from "./app-context";
import { useTeam } from "./team-context";
import { RoutineCard } from "./routine-card";
import { WeeklyRing, weeklyCaption } from "./weekly-ring";
import { Sparkles, Trophy, Users } from "lucide-react";
import type { Routine } from "./app-context";
import { recommendRoutineId, type Questionnaire } from "../../lib/questionnaire";

interface HomePageProps {
  onSelectRoutine: (routine: Routine) => void;
  onOpenTeam: () => void;
  questionnaire: Questionnaire;
}

export function HomePage({ onSelectRoutine, onOpenTeam, questionnaire }: HomePageProps) {
  const { favorites, totalMinutes, milestones, settings, minutesThisWeek, completedRoutines } = useApp();
  const { membership, team, week } = useTeam();
  const favRoutines = routines.filter((r) => favorites.includes(r.id));
  const earned = MILESTONES.filter((m) => milestones.includes(m.id));
  const latest = earned[earned.length - 1];

  const rec = questionnaire.completed && !questionnaire.skipped ? recommendRoutineId(questionnaire) : null;
  const recRoutine = rec ? routines.find((r) => r.id === rec.routineId) : null;
  const sharedRoutine = team?.sharedRoutineId ? routines.find((r) => r.id === team.sharedRoutineId) : null;

  return (
    <div className="pb-6">
      <div className="pl-5 pr-16 pt-6 pb-4">
        <p className="text-muted-foreground text-[14px]">Dashboard</p>
        <h1>Protect Her Play</h1>
      </div>

      {/* Weekly ring (optional) */}
      {settings.weeklyGoalEnabled ? (
        <div className="px-5 mb-4">
          <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
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
      ) : (
        <div className="px-5 mb-4">
          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <p className="text-[13px] text-muted-foreground">Total minutes</p>
            <p className="text-2xl" style={{ fontWeight: 700 }}>{totalMinutes}</p>
          </div>
        </div>
      )}

      {/* Team goal (if on a team) */}
      {membership && team && (
        <div className="px-5 mb-4">
          <button
            type="button"
            onClick={onOpenTeam}
            className="w-full text-left bg-card rounded-xl p-4 border border-border shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-[13px] text-muted-foreground">{team.name}</span>
            </div>
            <p className="text-[14px]">
              Team goal: {week.totalMinutes} of {team.weeklyGoalMinutes} minutes this week
            </p>
            <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min(100, (week.totalMinutes / Math.max(1, team.weeklyGoalMinutes)) * 100)}%` }}
              />
            </div>
          </button>
        </div>
      )}

      {/* Coach's pick */}
      {sharedRoutine && (
        <div className="px-5 mb-4">
          <h3 className="mb-2">Today's warm-up</h3>
          <RoutineCard routine={sharedRoutine} onTap={onSelectRoutine} compact />
        </div>
      )}

      {/* Latest milestone */}
      <div className="px-5 mb-6">
        <div className="bg-card rounded-xl p-4 border border-primary/20 shadow-sm flex items-center gap-3">
          <Trophy className="w-4 h-4 shrink-0 text-primary" />
          {latest ? (
            <p className="text-[14px]">
              <span className="mr-1" aria-hidden>{latest.icon}</span>
              Latest milestone: <span style={{ fontWeight: 600 }}>{latest.title}</span>
            </p>
          ) : (
            <p className="text-[14px] text-muted-foreground">Finish a routine to earn your first milestone.</p>
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
              No favorites yet. Head to the Exercises tab and tap the heart on routines you want easy access to.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {favRoutines.map((routine) => (
              <RoutineCard key={routine.id} routine={routine} onTap={onSelectRoutine} compact />
            ))}
          </div>
        )}
      </div>

      {/* Where to start */}
      <div className="px-5 mt-6">
        <h3 className="mb-1">{recRoutine ? "Here's where to start" : "Suggested for you"}</h3>
        {rec && <p className="text-[13px] text-muted-foreground mb-3">{rec.reason}</p>}
        <div className="space-y-4">
          {(recRoutine ? [recRoutine] : routines.slice(0, 3)).map((routine) => (
            <RoutineCard key={routine.id} routine={routine} onTap={onSelectRoutine} />
          ))}
        </div>
      </div>
    </div>
  );
}
