import { useState } from "react";
import { ChevronLeft, LogOut, User } from "lucide-react";
import { useAuth } from "./auth-context";
import { useApp } from "./app-context";
import { QuestionnaireForm } from "./questionnaire-page";
import type { Questionnaire } from "../../lib/questionnaire";

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 py-3 border-b border-border last:border-b-0 min-h-11">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-5 h-5 accent-primary"
      />
      <span>
        <span className="block text-[15px]">{label}</span>
        {hint && <span className="block text-[12px] text-muted-foreground">{hint}</span>}
      </span>
    </label>
  );
}

export function SettingsPage({
  onBack,
  questionnaire,
  onSaveQuestionnaire,
}: {
  onBack: () => void;
  questionnaire: Questionnaire;
  onSaveQuestionnaire: (q: Questionnaire) => void;
}) {
  const { user, signOutUser } = useAuth();
  const { settings, updateSettings } = useApp();
  const [editingQ, setEditingQ] = useState(false);
  const [goalText, setGoalText] = useState(String(settings.weeklyGoalMinutes));

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center gap-1 rounded-full border border-border bg-card px-3 py-2 text-primary shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-8 pt-5">
        <h1>Settings</h1>

        <h3 className="mt-5 mb-2">Weekly goal</h3>
        <div className="rounded-2xl border border-border bg-card px-4">
          <Toggle
            label="Use a weekly goal"
            hint="One flexible target for the week. Turn it off any time."
            checked={settings.weeklyGoalEnabled}
            onChange={(v) => updateSettings({ weeklyGoalEnabled: v })}
          />
          {settings.weeklyGoalEnabled && (
            <label className="block py-3">
              <span className="text-[13px] text-muted-foreground">Minutes per week</span>
              <input
                type="number"
                inputMode="numeric"
                min={5}
                max={300}
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                onBlur={() => {
                  const n = Math.round(Number(goalText));
                  if (Number.isFinite(n) && n >= 5 && n <= 300) updateSettings({ weeklyGoalMinutes: n });
                  else setGoalText(String(settings.weeklyGoalMinutes));
                }}
                className="mt-1 w-full px-3 py-2.5 bg-background border border-border rounded-xl"
              />
            </label>
          )}
        </div>

        <h3 className="mt-5 mb-2">Team</h3>
        <div className="rounded-2xl border border-border bg-card px-4">
          <Toggle
            label="Mute kudos and the team activity feed"
            hint="You can still contribute to your team's totals."
            checked={settings.kudosMuted}
            onChange={(v) => updateSettings({ kudosMuted: v })}
          />
        </div>

        <h3 className="mt-5 mb-2">Your answers</h3>
        {editingQ ? (
          <QuestionnaireForm
            initial={questionnaire}
            submitLabel="Save"
            onSave={(q) => {
              onSaveQuestionnaire(q);
              setEditingQ(false);
            }}
            onSkip={() => setEditingQ(false)}
          />
        ) : (
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="text-[14px] text-muted-foreground">
              Stored only on this device and used to suggest routines.
            </p>
            <button type="button" onClick={() => setEditingQ(true)} className="mt-2 min-h-11 text-primary text-[14px]">
              {questionnaire.completed && !questionnaire.skipped ? "Edit my answers" : "Answer the questions"}
            </button>
          </div>
        )}

        <h3 className="mt-5 mb-2">Account</h3>
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-[14px]">{user?.isAnonymous ? "Using the app without an email account" : user?.email}</p>
          {user?.isAnonymous && (
            <p className="text-[12px] text-muted-foreground mt-1">
              Your progress is tied to this device. Sign out and you will not be able to get it back.
            </p>
          )}
          <button
            type="button"
            onClick={() => void signOutUser()}
            className="mt-3 inline-flex min-h-11 items-center gap-2 text-primary text-[14px]"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export function AccountMenu({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <div className="pointer-events-none fixed top-3 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4">
      <div className="relative flex justify-end">
        <button
          type="button"
          aria-label="Settings"
          onClick={onOpenSettings}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm"
        >
          <User className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
