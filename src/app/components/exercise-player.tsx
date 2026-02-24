import { useState, useEffect, useRef, useCallback } from "react";
import { X, Play, Pause, SkipForward, Check, ChevronLeft } from "lucide-react";
import { useApp, type Routine } from "./app-context";
import { motion } from "motion/react";

interface ExercisePlayerProps {
  routine: Routine;
  onClose: () => void;
}

export function ExercisePlayer({ routine, onClose }: ExercisePlayerProps) {
  const { addMinutes, markRoutineCompleted } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(routine.exercises[0].duration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [totalSecondsSpent, setTotalSecondsSpent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const exercise = routine.exercises[currentIndex];

  const totalExerciseTime = routine.exercises.reduce((sum, e) => sum + e.duration, 0);
  const elapsedExerciseTime = routine.exercises
    .slice(0, currentIndex)
    .reduce((sum, e) => sum + e.duration, 0) + (exercise.duration - timeLeft);
  const overallProgress = elapsedExerciseTime / totalExerciseTime;

  const finishRoutine = useCallback(() => {
    setIsPlaying(false);
    setIsComplete(true);
    const minutesSpent = Math.max(1, Math.round(totalSecondsSpent / 60));
    addMinutes(minutesSpent);
    markRoutineCompleted(routine.id);
  }, [totalSecondsSpent, addMinutes, markRoutineCompleted, routine.id]);

  const goToNext = useCallback(() => {
    if (currentIndex < routine.exercises.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setTimeLeft(routine.exercises[nextIndex].duration);
    } else {
      finishRoutine();
    }
  }, [currentIndex, routine.exercises, finishRoutine]);

  useEffect(() => {
    if (isPlaying && !isComplete) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            goToNext();
            return 0;
          }
          return prev - 1;
        });
        setTotalSecondsSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isComplete, goToNext]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = ((exercise.duration - timeLeft) / exercise.duration) * 100;

  if (isComplete) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-6"
        >
          <Check className="w-12 h-12 text-white" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="mb-2">Nice work!</h1>
          <p className="text-muted-foreground mb-2">
            Every minute helps protect your knees.
          </p>
          <p className="text-primary mb-8">
            +{Math.max(1, Math.round(totalSecondsSpent / 60))} minutes added
          </p>
          <button
            onClick={onClose}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-full"
          >
            Done
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button onClick={onClose} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <p className="text-[13px] text-muted-foreground">
            {currentIndex + 1} of {routine.exercises.length}
          </p>
        </div>
        <button onClick={onClose} className="p-2 -mr-2">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Overall Progress Bar */}
      <div className="h-1 bg-muted">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${overallProgress * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Exercise Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm text-center"
        >
          <h2 className="mb-2">{exercise.name}</h2>
          <p className="text-muted-foreground text-[14px] mb-8">
            {exercise.description}
          </p>

          {/* Timer Circle */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="6"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - progressPercent / 100)}`}
                style={{ transition: "stroke-dashoffset 0.3s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl tabular-nums tracking-tight" style={{ fontWeight: 600 }}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-[13px] text-muted-foreground mt-1">remaining</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-card rounded-xl p-4 text-left border border-border">
            <p className="text-[13px] text-muted-foreground mb-2">Instructions</p>
            <ul className="space-y-1.5">
              {exercise.instructions.map((instruction, i) => (
                <li key={i} className="flex items-start gap-2 text-[14px]">
                  <span className="text-primary mt-0.5 shrink-0">•</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="px-6 pb-8 pt-4">
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={goToNext}
            className="w-12 h-12 rounded-full bg-muted flex items-center justify-center"
          >
            <SkipForward className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7 ml-0.5" />
            )}
          </button>
          <div className="w-12" /> {/* Spacer for balance */}
        </div>
      </div>
    </div>
  );
}
