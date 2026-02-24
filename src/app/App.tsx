import { useState } from "react";
import { Home, Dumbbell, BookOpen, BarChart3 } from "lucide-react";
import { AppProvider, type Routine } from "./components/app-context";
import { HomePage } from "./components/home-page";
import { ExercisesPage } from "./components/exercises-page";
import { ResearchPage } from "./components/research-page";
import { ProgressPage } from "./components/progress-page";
import { RoutineDetail } from "./components/routine-detail";
import { ExercisePlayer } from "./components/exercise-player";
import { motion, AnimatePresence } from "motion/react";

type Tab = "home" | "exercises" | "research" | "progress";

const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "exercises", label: "Exercises", icon: Dumbbell },
  { id: "research", label: "Learn", icon: BookOpen },
  { id: "progress", label: "Progress", icon: BarChart3 },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectRoutine = (routine: Routine) => {
    setSelectedRoutine(routine);
  };

  const handleStartRoutine = () => {
    setIsPlaying(true);
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
    setSelectedRoutine(null);
  };

  const handleBackFromDetail = () => {
    setSelectedRoutine(null);
  };

  return (
    <div className="w-full min-h-screen max-w-md mx-auto bg-background relative flex flex-col">
      {/* Exercise Player (fullscreen overlay) */}
      <AnimatePresence>
        {isPlaying && selectedRoutine && (
          <ExercisePlayer routine={selectedRoutine} onClose={handleClosePlayer} />
        )}
      </AnimatePresence>

      {/* Routine Detail */}
      {selectedRoutine && !isPlaying ? (
        <div className="flex-1 overflow-y-auto">
          <RoutineDetail
            routine={selectedRoutine}
            onBack={handleBackFromDetail}
            onStart={handleStartRoutine}
          />
        </div>
      ) : !isPlaying ? (
        <>
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto pb-20">
            {activeTab === "home" && (
              <HomePage onSelectRoutine={handleSelectRoutine} />
            )}
            {activeTab === "exercises" && (
              <ExercisesPage onSelectRoutine={handleSelectRoutine} />
            )}
            {activeTab === "research" && <ResearchPage />}
            {activeTab === "progress" && <ProgressPage />}
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur-lg border-t border-border z-40">
            <div className="flex items-center justify-around px-2 py-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex flex-col items-center gap-0.5 px-4 py-1.5 relative"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`text-[11px] ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Safe area spacer for iOS */}
            <div className="h-[env(safe-area-inset-bottom,0px)]" />
          </div>
        </>
      ) : null}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
