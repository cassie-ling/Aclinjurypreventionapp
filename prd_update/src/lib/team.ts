import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { DEFAULT_TEAM_WEEKLY_GOAL_MINUTES } from "./config";
import { weekKey } from "./week";

export type Role = "athlete" | "coach";

// Stored in the athlete's PRIVATE user doc (users/{uid}.membership).
export interface Membership {
  teamId: string;
  role: Role;
  anonId: string; // random id used for participation counts, never shown to anyone
  displayName: string;
  shareActivity: boolean; // opt in: teammates and coach can see completed routines
  leaderboardOptIn: boolean;
}

export interface TeamDoc {
  name: string;
  coachUid: string;
  weeklyGoalMinutes: number;
  allowLeaderboard: boolean;
  sharedRoutineId: string | null;
  sharedAt: number | null;
}

export interface ActivityItem {
  id: string;
  uid: string;
  displayName: string;
  routineTitle: string;
  minutes: number;
  completedAt: number;
  kudosFrom: string[];
}

export interface LeaderboardRow {
  uid: string;
  displayName: string;
  minutes: number;
}

// No 0/O/1/I so codes are easy to read aloud in a locker room.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCode(length = 6) {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

function randomId() {
  return crypto.randomUUID();
}

export function normalizeCode(input: string) {
  return input.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export async function createTeam(uid: string, name: string, displayName: string): Promise<Membership> {
  let code = randomCode();
  for (let i = 0; i < 5; i++) {
    const existing = await getDoc(doc(db, "teams", code));
    if (!existing.exists()) break;
    code = randomCode();
  }
  const team: TeamDoc & { createdAt: unknown } = {
    name: name.trim(),
    coachUid: uid,
    weeklyGoalMinutes: DEFAULT_TEAM_WEEKLY_GOAL_MINUTES,
    allowLeaderboard: false,
    sharedRoutineId: null,
    sharedAt: null,
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(db, "teams", code), team);
  const membership: Membership = {
    teamId: code,
    role: "coach",
    anonId: randomId(),
    displayName: displayName.trim(),
    shareActivity: false,
    leaderboardOptIn: false,
  };
  await setDoc(doc(db, "users", uid), { membership }, { merge: true });
  return membership;
}

export async function joinTeam(
  uid: string,
  rawCode: string,
  displayName: string,
  shareActivity: boolean
): Promise<Membership> {
  const code = normalizeCode(rawCode);
  const teamSnap = await getDoc(doc(db, "teams", code));
  if (!teamSnap.exists()) throw new Error("We could not find a team with that code. Check it and try again.");
  // The member doc holds NO name and no minutes, only that someone joined.
  await setDoc(doc(db, "teams", code, "members", uid), { joinedAt: serverTimestamp() });
  const membership: Membership = {
    teamId: code,
    role: "athlete",
    anonId: randomId(),
    displayName: displayName.trim(),
    shareActivity,
    leaderboardOptIn: false,
  };
  await setDoc(doc(db, "users", uid), { membership }, { merge: true });
  return membership;
}

// Leaving removes the athlete from team views. Personal history stays on their own account.
export async function leaveTeam(uid: string, m: Membership) {
  if (m.role === "athlete") {
    const mine = async (path: string) => {
      const snap = await getDocs(query(collection(db, "teams", m.teamId, path), where("uid", "==", uid)));
      const batch = writeBatch(db);
      snap.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    };
    await mine("activity");
    await mine("leaderboard");
    await deleteDoc(doc(db, "teams", m.teamId, "members", uid));
  }
  await updateDoc(doc(db, "users", uid), { membership: null });
}

export async function updateMembership(uid: string, m: Membership, patch: Partial<Membership>) {
  const next = { ...m, ...patch };
  await updateDoc(doc(db, "users", uid), { membership: next });
  // Turning either sharing option off removes what was already shared.
  if (m.role === "athlete") {
    if (m.shareActivity && patch.shareActivity === false) {
      const snap = await getDocs(query(collection(db, "teams", m.teamId, "activity"), where("uid", "==", uid)));
      const batch = writeBatch(db);
      snap.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
    if (m.leaderboardOptIn && patch.leaderboardOptIn === false) {
      const snap = await getDocs(query(collection(db, "teams", m.teamId, "leaderboard"), where("uid", "==", uid)));
      const batch = writeBatch(db);
      snap.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  }
  return next;
}

export async function updateTeam(teamId: string, patch: Partial<TeamDoc>) {
  await updateDoc(doc(db, "teams", teamId), patch);
}

// Called when an athlete finishes a routine while on a team.
export async function logTeamSession(
  uid: string,
  m: Membership,
  routineTitle: string,
  minutes: number
) {
  if (m.role !== "athlete") return;
  const wk = weekKey();
  // 1. Anonymous aggregate: minutes and a random per-membership id. No name, no uid.
  await setDoc(
    doc(db, "teams", m.teamId, "weeks", wk),
    { totalMinutes: increment(minutes), sessionCount: increment(1), activeIds: arrayUnion(m.anonId) },
    { merge: true }
  );
  // 2. Named activity, only if the athlete opted in.
  if (m.shareActivity) {
    const ref = doc(collection(db, "teams", m.teamId, "activity"));
    await setDoc(ref, {
      uid,
      displayName: m.displayName || "A teammate",
      routineTitle,
      minutes,
      completedAt: Date.now(),
      kudosFrom: [],
    });
  }
  // 3. Leaderboard, only if the athlete opted in (and the coach allows it, enforced in the UI).
  if (m.leaderboardOptIn) {
    await setDoc(
      doc(db, "teams", m.teamId, "leaderboard", `${wk}_${uid}`),
      { uid, weekKey: wk, displayName: m.displayName || "A teammate", minutes: increment(minutes) },
      { merge: true }
    );
  }
}

export async function sendKudos(teamId: string, activityId: string, uid: string, give: boolean) {
  await updateDoc(doc(db, "teams", teamId, "activity", activityId), {
    kudosFrom: give ? arrayUnion(uid) : arrayRemove(uid),
  });
}
