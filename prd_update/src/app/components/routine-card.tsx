import { Heart, Clock, Zap } from "lucide-react";
import { useApp, type Routine } from "./app-context";

interface RoutineCardProps {
  routine: Routine;
  onTap: (routine: Routine) => void;
  compact?: boolean;
}

export function RoutineCard({ routine, onTap, compact }: RoutineCardProps) {
  const { toggleFavorite, isFavorite } = useApp();
  const fav = isFavorite(routine.id);
  const visibleExerciseCount = routine.exercises.filter(
    (exercise) => exercise.name.trim().toLowerCase() !== "rest"
  ).length;

  if (compact) {
    return (
      <div className="flex items-center gap-0 bg-card rounded-xl shadow-sm border border-border w-full min-w-0">
        <button
          type="button"
          onClick={() => onTap(routine)}
          className="flex flex-1 items-center gap-3 p-3 min-w-0 text-left"
        >
          <div
            className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 text-base font-semibold tabular-nums"
            aria-hidden
          >
            {routine.title.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate">{routine.title}</p>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[13px]">{routine.duration} min</span>
              <span className="text-[13px]">·</span>
              <span className="text-[13px] truncate">{routine.category}</span>
            </div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => toggleFavorite(routine.id)}
          className="p-3 pr-3 shrink-0 self-stretch flex items-center"
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-5 h-5 ${
              fav ? "fill-primary text-primary" : "text-muted-foreground"
            }`}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border w-full relative">
      <button
        type="button"
        onClick={() => onTap(routine)}
        className="w-full text-left p-4 pr-14"
      >
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[12px] bg-muted text-foreground mb-2">
          {routine.category}
        </span>
        <h3 className="mb-1">{routine.title}</h3>
        <p className="text-muted-foreground text-[14px] line-clamp-2 mb-3">
          {routine.description}
        </p>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 shrink-0" />
            <span className="text-[13px]">{routine.duration} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 shrink-0" />
            <span className="text-[13px]">{visibleExerciseCount} exercises</span>
          </div>
        </div>
      </button>
      <button
        type="button"
        onClick={() => toggleFavorite(routine.id)}
        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted/80"
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={`w-5 h-5 ${
            fav ? "fill-primary text-primary" : "text-muted-foreground"
          }`}
        />
      </button>
    </div>
  );
}
