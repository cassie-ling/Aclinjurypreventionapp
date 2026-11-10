// The onboarding questionnaire is stored ONLY on this device (localStorage).
// It is never sent to Firestore and never shown to coaches (PRD: Data Storage and Privacy).
import { SPORTS } from "./profile";

export const AGE_BANDS = ["Under 13", "13 to 15", "16 to 18", "19 or older"] as const;
export const GENDER_OPTIONS = ["Girl / woman", "Boy / man", "Non-binary", "Another way", "Prefer not to say"] as const;
export const TRAINING_HOURS = ["Under 3 hours", "3 to 8 hours", "More than 8 hours"] as const;

export interface Questionnaire {
  completed: boolean; // true once answered OR skipped, so we do not ask again
  skipped: boolean;
  ageBand: string;
  gender: string; // optional
  sports: string[];
  hoursPerWeek: string;
}

export function emptyQuestionnaire(): Questionnaire {
  return { completed: false, skipped: false, ageBand: "", gender: "", sports: [], hoursPerWeek: "" };
}

const key = (uid: string) => `php-questionnaire-${uid}`;

export function loadQuestionnaire(uid: string): Questionnaire {
  try {
    const raw = localStorage.getItem(key(uid));
    if (!raw) return emptyQuestionnaire();
    const p = JSON.parse(raw) as Partial<Questionnaire>;
    return {
      completed: p.completed === true,
      skipped: p.skipped === true,
      ageBand: String(p.ageBand ?? ""),
      gender: String(p.gender ?? ""),
      sports: Array.isArray(p.sports) ? p.sports.map(String) : [],
      hoursPerWeek: String(p.hoursPerWeek ?? ""),
    };
  } catch {
    return emptyQuestionnaire();
  }
}

export function saveQuestionnaire(uid: string, q: Questionnaire) {
  try {
    localStorage.setItem(key(uid), JSON.stringify(q));
  } catch {
    /* storage unavailable: personalization just will not persist */
  }
}

export function isUnder13(q: Questionnaire) {
  return q.ageBand === "Under 13";
}

export { SPORTS };

// "Here's where to start", never a risk score.
export function recommendRoutineId(q: Questionnaire): { routineId: string; reason: string } {
  if (q.hoursPerWeek === "More than 8 hours") {
    return {
      routineId: "r3",
      reason: "You train a lot, so the full 20 minute routine fits a busy week.",
    };
  }
  if (q.hoursPerWeek === "3 to 8 hours") {
    return {
      routineId: "r2",
      reason: "A 10 minute routine fits easily before practice.",
    };
  }
  return {
    routineId: "r1",
    reason: "A short 5 minute routine is an easy way to begin.",
  };
}
