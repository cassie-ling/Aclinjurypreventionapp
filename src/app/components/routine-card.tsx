import { Heart, Clock, Zap } from "lucide-react";
import { useApp, type Routine } from "./app-context";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface RoutineCardProps {
  routine: Routine;
  onTap: (routine: Routine) => void;
  compact?: boolean;
}

export function RoutineCard({ routine, onTap, compact }: RoutineCardProps) {
  const { toggleFavorite, isFavorite } = useApp();
  const fav = isFavorite(routine.id);

  const difficultyColor =
    routine.difficulty === "Beginner"
      ? "bg-green-100 text-green-700"
      : routine.difficulty === "Intermediate"
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  if (compact) {
    return (
      <button
        onClick={() => onTap(routine)}
        className="flex items-center gap-3 bg-card rounded-xl p-3 shadow-sm border border-border w-full text-left"
      >
        <ImageWithFallback
          src={routine.image}
          alt={routine.title}
          className="w-16 h-16 rounded-lg object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="truncate">{routine.title}</p>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[13px]">{routine.duration} min</span>
            <span className="text-[13px]">·</span>
            <span className="text-[13px]">{routine.category}</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(routine.id);
          }}
          className="p-2 shrink-0"
        >
          <Heart
            className={`w-5 h-5 ${
              fav ? "fill-primary text-primary" : "text-muted-foreground"
            }`}
          />
        </button>
      </button>
    );
  }

  return (
    <button
      onClick={() => onTap(routine)}
      className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden w-full text-left"
    >
      <div className="relative">
        <ImageWithFallback
          src={routine.image}
          alt={routine.title}
          className="w-full h-40 object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(routine.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
        >
          <Heart
            className={`w-5 h-5 ${
              fav ? "fill-primary text-primary" : "text-gray-500"
            }`}
          />
        </button>
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[12px] ${difficultyColor}`}>
            {routine.difficulty}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[12px] bg-white/90 text-gray-700">
            {routine.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="mb-1">{routine.title}</h3>
        <p className="text-muted-foreground text-[14px] line-clamp-2 mb-3">
          {routine.description}
        </p>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span className="text-[13px]">{routine.duration} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            <span className="text-[13px]">{routine.exercises.length} exercises</span>
          </div>
        </div>
      </div>
    </button>
  );
}
