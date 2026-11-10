import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { weekKey } from "../../lib/week";
import {
  createTeam,
  joinTeam,
  leaveTeam,
  logTeamSession,
  sendKudos,
  updateMembership,
  updateTeam,
  type ActivityItem,
  type LeaderboardRow,
  type Membership,
  type TeamDoc,
} from "../../lib/team";
import { authErrorMessage } from "../../lib/profile";

export interface WeekStats {
  totalMinutes: number;
  sessionCount: number;
  activeCount: number; // distinct anonymous ids that trained this week
}

interface TeamContextType {
  uid: string;
  membership: Membership | null;
  team: TeamDoc | null;
  memberCount: number;
  week: WeekStats;
  activity: ActivityItem[];
  leaderboard: LeaderboardRow[];
  error: string | null;
  create: (name: string, displayName: string) => Promise<void>;
  join: (code: string, displayName: string, shareActivity: boolean) => Promise<void>;
  leave: () => Promise<void>;
  setShareActivity: (on: boolean) => Promise<void>;
  setLeaderboardOptIn: (on: boolean) => Promise<void>;
  setTeamGoal: (minutes: number) => Promise<void>;
  setAllowLeaderboard: (on: boolean) => Promise<void>;
  shareRoutine: (routineId: string | null) => Promise<void>;
  giveKudos: (activityId: string, give: boolean) => Promise<void>;
  logSession: (routineTitle: string, minutes: number) => Promise<void>;
}

const TeamContext = createContext<TeamContextType | null>(null);

const emptyWeek: WeekStats = { totalMinutes: 0, sessionCount: 0, activeCount: 0 };

export function TeamProvider({ uid, children }: { uid: string; children: React.ReactNode }) {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [team, setTeam] = useState<TeamDoc | null>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [week, setWeek] = useState<WeekStats>(emptyWeek);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Membership lives in the athlete's private user doc.
  useEffect(() => {
    return onSnapshot(
      doc(db, "users", uid),
      (snap) => {
        const m = (snap.data() as { membership?: Membership | null } | undefined)?.membership;
        setMembership(m && m.teamId ? m : null);
      },
      () => setMembership(null)
    );
  }, [uid]);

  const teamId = membership?.teamId ?? null;
  const wk = weekKey();

  useEffect(() => {
    if (!teamId) {
      setTeam(null);
      setMemberCount(0);
      setWeek(emptyWeek);
      setActivity([]);
      setLeaderboard([]);
      return;
    }
    const fail = (e: unknown) => setError(authErrorMessage(e));
    const unsubs = [
      onSnapshot(doc(db, "teams", teamId), (s) => setTeam(s.exists() ? (s.data() as TeamDoc) : null), fail),
      onSnapshot(collection(db, "teams", teamId, "members"), (s) => setMemberCount(s.size), fail),
      onSnapshot(
        doc(db, "teams", teamId, "weeks", wk),
        (s) => {
          const d = s.data() as { totalMinutes?: number; sessionCount?: number; activeIds?: string[] } | undefined;
          setWeek({
            totalMinutes: d?.totalMinutes ?? 0,
            sessionCount: d?.sessionCount ?? 0,
            activeCount: d?.activeIds?.length ?? 0,
          });
        },
        fail
      ),
      onSnapshot(
        query(collection(db, "teams", teamId, "activity"), orderBy("completedAt", "desc"), limit(20)),
        (s) =>
          setActivity(
            s.docs.map((d) => {
              const x = d.data() as Omit<ActivityItem, "id">;
              return { ...x, id: d.id, kudosFrom: Array.isArray(x.kudosFrom) ? x.kudosFrom : [] };
            })
          ),
        fail
      ),
      onSnapshot(
        query(collection(db, "teams", teamId, "leaderboard"), where("weekKey", "==", wk)),
        (s) =>
          setLeaderboard(
            s.docs
              .map((d) => d.data() as LeaderboardRow)
              .sort((a, b) => b.minutes - a.minutes)
          ),
        fail
      ),
    ];
    return () => unsubs.forEach((u) => u());
  }, [teamId, wk]);

  const guard = useCallback(async (fn: () => Promise<void>) => {
    setError(null);
    try {
      await fn();
    } catch (e) {
      const msg = e instanceof Error && !("code" in e) ? e.message : authErrorMessage(e);
      setError(msg);
      throw e;
    }
  }, []);

  const value = useMemo<TeamContextType>(
    () => ({
      uid,
      membership,
      team,
      memberCount,
      week,
      activity,
      leaderboard,
      error,
      create: (name, displayName) =>
        guard(async () => {
          await createTeam(uid, name, displayName);
        }),
      join: (code, displayName, shareActivity) =>
        guard(async () => {
          await joinTeam(uid, code, displayName, shareActivity);
        }),
      leave: () =>
        guard(async () => {
          if (membership) await leaveTeam(uid, membership);
        }),
      setShareActivity: (on) =>
        guard(async () => {
          if (membership) await updateMembership(uid, membership, { shareActivity: on });
        }),
      setLeaderboardOptIn: (on) =>
        guard(async () => {
          if (membership) await updateMembership(uid, membership, { leaderboardOptIn: on });
        }),
      setTeamGoal: (minutes) =>
        guard(async () => {
          if (teamId) await updateTeam(teamId, { weeklyGoalMinutes: minutes });
        }),
      setAllowLeaderboard: (on) =>
        guard(async () => {
          if (teamId) await updateTeam(teamId, { allowLeaderboard: on });
        }),
      shareRoutine: (routineId) =>
        guard(async () => {
          if (teamId) await updateTeam(teamId, { sharedRoutineId: routineId, sharedAt: routineId ? Date.now() : null });
        }),
      giveKudos: (activityId, give) =>
        guard(async () => {
          if (teamId) await sendKudos(teamId, activityId, uid, give);
        }),
      logSession: async (routineTitle, minutes) => {
        // Team logging must never block or break a personal workout.
        if (!membership) return;
        try {
          await logTeamSession(uid, membership, routineTitle, minutes);
        } catch (e) {
          setError(authErrorMessage(e));
        }
      },
    }),
    [uid, membership, team, memberCount, week, activity, leaderboard, error, teamId, guard]
  );

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used within TeamProvider");
  return ctx;
}
