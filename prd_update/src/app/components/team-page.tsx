import { useState } from "react";
import { Heart, Copy } from "lucide-react";
import { useApp, routines, type Routine } from "./app-context";
import { useTeam } from "./team-context";
import { WeeklyRing } from "./weekly-ring";

const fieldClass =
  "mt-1 w-full px-3 py-2.5 bg-background border border-border rounded-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";

function Check({
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
    <label className="flex items-start gap-3 py-2 min-h-11">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 w-5 h-5 accent-primary" />
      <span>
        <span className="block text-[14px]">{label}</span>
        {hint && <span className="block text-[12px] text-muted-foreground">{hint}</span>}
      </span>
    </label>
  );
}

function Header({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="pl-5 pr-16 pt-6 pb-4">
      <h1>{title}</h1>
      <p className="text-muted-foreground text-[14px] mt-1">{sub}</p>
    </div>
  );
}

// ---------- not on a team ----------
function JoinOrCreate({ locked }: { locked: boolean }) {
  const { join, create, error } = useTeam();
  const [mode, setMode] = useState<"choose" | "join" | "coach">("choose");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [share, setShare] = useState(false);
  const [busy, setBusy] = useState(false);

  if (locked) {
    return (
      <div className="px-5">
        <div className="bg-card rounded-xl p-5 border border-border">
          <h3 className="mb-1">Teams need a parent or guardian</h3>
          <p className="text-[14px] text-muted-foreground">
            Everything else in the app works on your own. To use teams, ask a parent or guardian to help set it up.
          </p>
        </div>
      </div>
    );
  }

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch {
      /* error text comes from team context */
    } finally {
      setBusy(false);
    }
  };

  if (mode === "choose") {
    return (
      <div className="px-5 space-y-3">
        <p className="text-[14px] text-muted-foreground">
          Teams are optional. Join with a code from your coach to add your minutes to a shared team goal.
        </p>
        <button onClick={() => setMode("join")} className="w-full min-h-11 py-3 rounded-xl bg-primary text-primary-foreground">
          Join a team with a code
        </button>
        <button onClick={() => setMode("coach")} className="w-full min-h-11 py-3 rounded-xl border border-border bg-card text-primary">
          I'm a coach
        </button>
      </div>
    );
  }

  return (
    <div className="px-5">
      <div className="bg-card rounded-2xl border border-border p-4">
        {mode === "join" ? (
          <>
            <label className="block mb-3">
              <span className="text-[13px] text-muted-foreground">Team code</span>
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ex. K7M2QX" autoCapitalize="characters" className={fieldClass} />
            </label>
            <label className="block mb-3">
              <span className="text-[13px] text-muted-foreground">First name or nickname (only shown if you share activity)</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Maya" className={fieldClass} />
            </label>
            <Check
              label="Share my completed routines with my team"
              hint="Teammates can send you kudos and your coach can see them. You can change this any time. If off, you still add to the team total without your name."
              checked={share}
              onChange={setShare}
            />
            {error && <p className="text-destructive text-[13px] my-2">{error}</p>}
            <button
              disabled={busy || !code.trim() || (share && !name.trim())}
              onClick={() => run(() => join(code, name, share))}
              className="w-full mt-2 min-h-11 py-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
            >
              {busy ? "Joining…" : "Join team"}
            </button>
          </>
        ) : (
          <>
            <label className="block mb-3">
              <span className="text-[13px] text-muted-foreground">Team name</span>
              <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Ex. Lincoln U16 Girls" className={fieldClass} />
            </label>
            {error && <p className="text-destructive text-[13px] my-2">{error}</p>}
            <button
              disabled={busy || !teamName.trim()}
              onClick={() => run(() => create(teamName, "Coach"))}
              className="w-full mt-2 min-h-11 py-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
            >
              {busy ? "Creating…" : "Create team"}
            </button>
          </>
        )}
        <button onClick={() => setMode("choose")} className="w-full mt-2 min-h-11 text-[14px] text-muted-foreground">
          Back
        </button>
      </div>
    </div>
  );
}

// ---------- shared team summary (athlete + coach) ----------
function TeamSummary() {
  const { team, week, memberCount } = useTeam();
  if (!team) return null;
  const participation = memberCount > 0 ? Math.round((week.activeCount / memberCount) * 100) : 0;
  return (
    <div className="px-5 mb-4">
      <div className="bg-card rounded-2xl p-4 border border-border">
        <WeeklyRing
          value={week.totalMinutes}
          goal={team.weeklyGoalMinutes}
          size={110}
          title="Team goal this week"
          caption={`${participation}% of the team trained this week. Together, every minute adds up.`}
        />
      </div>
    </div>
  );
}

function ActivityFeed({ canKudos }: { canKudos: boolean }) {
  const { activity, giveKudos, uid } = useTeam();
  const { settings } = useApp();
  if (settings.kudosMuted) return null;
  return (
    <div className="px-5 mb-4">
      <h3 className="mb-2">Team activity</h3>
      {activity.length === 0 ? (
        <p className="text-[13px] text-muted-foreground">
          Completed routines from teammates who chose to share will show up here.
        </p>
      ) : (
        <div className="space-y-2">
          {activity.map((a) => {
            const mine = a.uid === uid;
            const gave = a.kudosFrom.includes(uid);
            return (
              <div key={a.id} className="bg-card rounded-xl p-3 border border-border flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] truncate">
                    <span style={{ fontWeight: 600 }}>{mine ? "You" : a.displayName}</span> finished {a.routineTitle}
                  </p>
                  <p className="text-[12px] text-muted-foreground">{a.minutes} min</p>
                </div>
                {canKudos && !mine ? (
                  <button
                    onClick={() => void giveKudos(a.id, !gave).catch(() => {})}
                    aria-label={gave ? "Remove kudos" : "Send kudos"}
                    className="shrink-0 min-h-11 min-w-11 flex items-center justify-center gap-1 text-[13px]"
                  >
                    <Heart className={`w-5 h-5 ${gave ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    {a.kudosFrom.length > 0 && <span>{a.kudosFrom.length}</span>}
                  </button>
                ) : (
                  a.kudosFrom.length > 0 && (
                    <span className="text-[13px] flex items-center gap-1 text-primary shrink-0">
                      <Heart className="w-4 h-4 fill-primary" /> {a.kudosFrom.length}
                    </span>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------- athlete view ----------
function AthleteView({ onSelectRoutine }: { onSelectRoutine: (r: Routine) => void }) {
  const { membership, team, leaderboard, setShareActivity, setLeaderboardOptIn, leave, error, uid } = useTeam();
  const [confirmLeave, setConfirmLeave] = useState(false);
  if (!membership || !team) return null;
  const shared = team.sharedRoutineId ? routines.find((r) => r.id === team.sharedRoutineId) : null;

  return (
    <>
      <Header title={team.name} sub="Your team" />
      <TeamSummary />

      {shared && (
        <div className="px-5 mb-4">
          <h3 className="mb-2">Today's warm-up from your coach</h3>
          <button
            onClick={() => onSelectRoutine(shared)}
            className="w-full text-left bg-card rounded-xl p-4 border border-primary/30"
          >
            <p style={{ fontWeight: 600 }}>{shared.title}</p>
            <p className="text-[13px] text-muted-foreground">{shared.duration} min</p>
          </button>
        </div>
      )}

      <ActivityFeed canKudos={membership.shareActivity} />

      {/* Leaderboard: team goal is the default; individual view is opt-in AND coach-enabled */}
      {team.allowLeaderboard && (
        <div className="px-5 mb-4">
          <h3 className="mb-2">Minutes contributed (optional)</h3>
          <div className="bg-card rounded-xl p-3 border border-border">
            <Check
              label="Show me on the team list"
              hint="Off by default. Ranked by minutes this week, never by days in a row."
              checked={membership.leaderboardOptIn}
              onChange={(v) => void setLeaderboardOptIn(v).catch(() => {})}
            />
            {membership.leaderboardOptIn && (
              <ol className="mt-2 space-y-1">
                {leaderboard.length === 0 && <li className="text-[13px] text-muted-foreground">No one has shown up yet this week.</li>}
                {leaderboard.map((row, i) => (
                  <li key={row.uid} className="flex justify-between text-[14px]">
                    <span>{i + 1}. {row.uid === uid ? "You" : row.displayName}</span>
                    <span className="text-muted-foreground">{row.minutes} min</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}

      <div className="px-5 mb-4">
        <h3 className="mb-2">Your sharing</h3>
        <div className="bg-card rounded-xl p-3 border border-border">
          <Check
            label="Share my completed routines with my team"
            hint="Teammates and your coach can see them and send kudos. Turning this off removes what you already shared."
            checked={membership.shareActivity}
            onChange={(v) => void setShareActivity(v).catch(() => {})}
          />
        </div>
      </div>

      {error && <p className="px-5 text-destructive text-[13px] mb-2">{error}</p>}

      <div className="px-5">
        {confirmLeave ? (
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-[14px] mb-3">
              Leave this team? Your own minutes and milestones stay with you. Anything you shared with the team is removed.
            </p>
            <div className="flex gap-2">
              <button onClick={() => void leave().catch(() => {})} className="flex-1 min-h-11 rounded-xl bg-primary text-primary-foreground">
                Leave team
              </button>
              <button onClick={() => setConfirmLeave(false)} className="flex-1 min-h-11 rounded-xl border border-border">
                Stay
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setConfirmLeave(true)} className="min-h-11 text-[14px] text-muted-foreground">
            Leave team
          </button>
        )}
      </div>
    </>
  );
}

// ---------- coach view: aggregate only ----------
function CoachView() {
  const { membership, team, setTeamGoal, setAllowLeaderboard, shareRoutine, error, memberCount } = useTeam();
  const [goalText, setGoalText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  if (!membership || !team) return null;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(membership.teamId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <>
      <Header title={team.name} sub="Coach dashboard" />

      <div className="px-5 mb-4">
        <div className="bg-card rounded-2xl p-4 border border-border flex items-center justify-between">
          <div>
            <p className="text-[13px] text-muted-foreground">Join code ({memberCount} joined)</p>
            <p className="text-2xl tracking-widest tabular-nums" style={{ fontWeight: 700 }}>{membership.teamId}</p>
          </div>
          <button onClick={copyCode} className="min-h-11 px-3 rounded-xl border border-border flex items-center gap-1.5 text-[14px]">
            <Copy className="w-4 h-4" /> {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <TeamSummary />

      <div className="px-5 mb-4">
        <p className="text-[12px] text-muted-foreground">
          You see team totals only. Individual activity appears in the feed below only for athletes who chose to share it.
        </p>
      </div>

      <div className="px-5 mb-4">
        <h3 className="mb-2">Team weekly goal (minutes)</h3>
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={10}
            value={goalText ?? String(team.weeklyGoalMinutes)}
            onChange={(e) => setGoalText(e.target.value)}
            className={fieldClass + " mt-0"}
          />
          <button
            onClick={() => {
              const n = Math.round(Number(goalText ?? team.weeklyGoalMinutes));
              if (Number.isFinite(n) && n >= 10) void setTeamGoal(n).then(() => setGoalText(null)).catch(() => {});
            }}
            className="min-h-11 px-4 rounded-xl bg-primary text-primary-foreground"
          >
            Save
          </button>
        </div>
      </div>

      <div className="px-5 mb-4">
        <h3 className="mb-2">Today's warm-up</h3>
        <select
          value={team.sharedRoutineId ?? ""}
          onChange={(e) => void shareRoutine(e.target.value || null).catch(() => {})}
          className={fieldClass + " mt-0"}
        >
          <option value="">None</option>
          {routines.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title} ({r.duration} min)
            </option>
          ))}
        </select>
      </div>

      <div className="px-5 mb-4">
        <div className="bg-card rounded-xl p-3 border border-border">
          <Check
            label="Let athletes opt in to a minutes list"
            hint="Off by default. Athletes still choose for themselves whether to appear."
            checked={team.allowLeaderboard}
            onChange={(v) => void setAllowLeaderboard(v).catch(() => {})}
          />
        </div>
      </div>

      <ActivityFeed canKudos={false} />

      {error && <p className="px-5 text-destructive text-[13px] mb-2">{error}</p>}
    </>
  );
}

export function TeamPage({
  onSelectRoutine,
  teamsLocked,
}: {
  onSelectRoutine: (r: Routine) => void;
  teamsLocked: boolean;
}) {
  const { membership } = useTeam();
  return (
    <div className="pb-6">
      {!membership ? (
        <>
          <Header title="Team" sub="Train together, no pressure" />
          <JoinOrCreate locked={teamsLocked} />
        </>
      ) : membership.role === "coach" ? (
        <CoachView />
      ) : (
        <AthleteView onSelectRoutine={onSelectRoutine} />
      )}
    </div>
  );
}
