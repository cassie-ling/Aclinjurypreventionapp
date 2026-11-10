import { useState, type ReactNode } from "react";
import { Home, Dumbbell, BookOpen, BarChart3, Users } from "lucide-react";
import { AppProvider, type Routine } from "./components/app-context";
import { AuthProvider, useAuth } from "./components/auth-context";
import { TeamProvider } from "./components/team-context";
import { AuthPage } from "./components/auth-page";
import { HomePage } from "./components/home-page";
import { ExercisesPage } from "./components/exercises-page";
import { ResearchPage } from "./components/research-page";
import { TeamPage } from "./components/team-page";
import { SettingsPage, AccountMenu } from "./components/settings-page";
import { QuestionnaireIntro } from "./components/questionnaire-page";
import { ProgressPage } from "./components/progress-page";
import { RoutineDetail } from "./components/routine-detail";
import { ExercisePlayer } from "./components/exercise-player";
import { motion, AnimatePresence } from "motion/react";
import {
  isUnder13,
  loadQuestionnaire,
  saveQuestionnaire,
  type Questionnaire,
} from "../lib/questionnaire";

type Tab = "home" | "exercises" | "team" | "research" | "progress";

const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "exercises", label: "Exercises", icon: Dumbbell },
  { id: "progress", label: "Progress", icon: BarChart3 },
  { id: "team", label: "Team", icon: Users },
  { id: "research", label: "Learn", icon: BookOpen },
];

function AppContent({
  questionnaire,
  onSaveQuestionnaire,
}: {
  questionnaire: Questionnaire;
  onSaveQuestionnaire: (q: Questionnaire) => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleClosePlayer = () => {
    setIsPlaying(false);
    setSelectedRoutine(null);
  };

  return (
    <div className="relative flex min-h-screen flex-1 flex-col">
      <AnimatePresence>
        {isPlaying && selectedRoutine && (
          <ExercisePlayer routine={selectedRoutine} onClose={handleClosePlayer} />
        )}
      </AnimatePresence>

      {selectedRoutine && !isPlaying ? (
        <div className="flex-1 overflow-y-auto">
          <RoutineDetail
            routine={selectedRoutine}
            onBack={() => setSelectedRoutine(null)}
            onStart={() => setIsPlaying(true)}
          />
        </div>
      ) : showSettings && !isPlaying ? (
        <SettingsPage
          onBack={() => setShowSettings(false)}
          questionnaire={questionnaire}
          onSaveQuestionnaire={onSaveQuestionnaire}
        />
      ) : !isPlaying ? (
        <>
          <AccountMenu onOpenSettings={() => setShowSettings(true)} />
          <div className="flex-1 overflow-y-auto pb-20">
            {activeTab === "home" && (
              <HomePage
                onSelectRoutine={setSelectedRoutine}
                onOpenTeam={() => setActiveTab("team")}
                questionnaire={questionnaire}
              />
            )}
            {activeTab === "exercises" && <ExercisesPage onSelectRoutine={setSelectedRoutine} />}
            {activeTab === "team" && (
              <TeamPage onSelectRoutine={setSelectedRoutine} teamsLocked={isUnder13(questionnaire)} />
            )}
            {activeTab === "research" && <ResearchPage />}
            {activeTab === "progress" && <ProgressPage />}
          </div>

          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur-lg border-t border-border z-40">
            <div className="flex items-center justify-around px-1 py-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex flex-col items-center gap-0.5 px-3 py-1.5 min-h-11 relative"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-[11px] ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="h-[env(safe-area-inset-bottom,0px)]" />
          </div>
        </>
      ) : null}
    </div>
  );
}

// Questionnaire answers are read and written on this device only.
function SignedInApp({ uid }: { uid: string }) {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>(() => loadQuestionnaire(uid));

  const save = (q: Questionnaire) => {
    saveQuestionnaire(uid, q);
    setQuestionnaire(q);
  };

  if (!questionnaire.completed) {
    return (
      <QuestionnaireIntro
        initial={questionnaire}
        onSave={save}
        onSkip={() => save({ ...questionnaire, completed: true, skipped: true })}
      />
    );
  }

  return (
    <AppProvider uid={uid}>
      <TeamProvider uid={uid}>
        <AppContent questionnaire={questionnaire} onSaveQuestionnaire={save} />
      </TeamProvider>
    </AppProvider>
  );
}

function AppShell() {
  const { user, authReady } = useAuth();

  let content: ReactNode;
  if (!authReady) {
    content = (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-[14px]">Loading…</div>
    );
  } else if (!user) {
    content = <AuthPage />;
  } else {
    content = <SignedInApp key={user.uid} uid={user.uid} />;
  }

  return (
    <motion.div className="w-full min-h-screen max-w-md bg-background relative flex flex-col shadow-xl border-x border-border overflow-x-hidden">
      {content}
    </motion.div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <motion.div className="min-h-screen w-full flex justify-center bg-zinc-200/80">
        <AppShell />
      </motion.div>
    </AuthProvider>
  );
}
