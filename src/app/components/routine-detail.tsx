import { Heart, Clock, Zap, Play, ChevronLeft } from "lucide-react";
import { useApp, type Routine } from "./app-context";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface RoutineDetailProps {
  routine: Routine;
  onBack: () => void;
  onStart: () => void;
}

export function RoutineDetail({ routine, onBack, onStart }: RoutineDetailProps) {
  const { toggleFavorite, isFavorite } = useApp();
  const fav = isFavorite(routine.id);

  const difficultyColor =
    routine.difficulty === "Beginner"
      ? "bg-green-100 text-green-700"
      : routine.difficulty === "Intermediate"
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="pb-24">
      {/* Hero Image */}
      <div className="relative">
        <ImageWithFallback
          src={routine.image}
          alt={routine.title}
          className="w-full h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => toggleFavorite(routine.id)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
        >
          <Heart
            className={`w-5 h-5 ${
              fav ? "fill-primary text-primary" : "text-gray-500"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="px-5 -mt-6 relative">
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex gap-2 mb-3">
            <span className={`px-2.5 py-0.5 rounded-full text-[12px] ${difficultyColor}`}>
              {routine.difficulty}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[12px] bg-muted text-muted-foreground">
              {routine.category}
            </span>
          </div>
          <h1 className="mb-2">{routine.title}</h1>
          <p className="text-muted-foreground text-[14px] mb-4">
            {routine.description}
          </p>
          <div className="flex items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span className="text-[14px]">{routine.duration} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span className="text-[14px]">{routine.exercises.length} exercises</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="px-5 mt-6">
        <h3 className="mb-3">Exercises</h3>
        <div className="space-y-2">
          {routine.exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className="bg-card rounded-xl p-4 border border-border flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-[13px] text-primary" style={{ fontWeight: 600 }}>
                  {index + 1}
                </span>
              </div>
              <div className="flex-1">
                <p style={{ fontWeight: 500 }}>{exercise.name}</p>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  {exercise.description}
                </p>
                <p className="text-[13px] text-primary mt-1">
                  {exercise.duration}s
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="fixed bottom-20 left-0 right-0 px-5 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent">
        <button
          onClick={onStart}
          className="w-full bg-primary text-primary-foreground py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
        >
          <Play className="w-5 h-5" />
          <span>Start Routine</span>
        </button>
      </div>
    </div>
  );
}
