import { FirebaseError } from "firebase/app";

export const SPORTS = [
  "Soccer",
  "Basketball",
  "Volleyball",
  "Football",
  "Lacrosse",
  "Gymnastics",
  "Cheerleading",
  "Skiing",
  "Snowboarding",
  "Field hockey",
  "Softball",
  "Tennis",
  "Dance",
  "Rugby",
  "Track and field",
  "Other",
] as const;

export const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"] as const;

export interface UserProfile {
  email: string;
  birthYear: number | null;
  gender: string;
  primarySports: string[];
  otherSport: string;
  emailUpdates: boolean;
  allowNotifications: boolean;
  profileComplete: boolean;
}

export function emptyProfile(email: string): UserProfile {
  return {
    email,
    birthYear: null,
    gender: "",
    primarySports: [],
    otherSport: "",
    emailUpdates: false,
    allowNotifications: false,
    profileComplete: false,
  };
}

export function profileFromDoc(
  data: Record<string, unknown>,
  email: string | null
): UserProfile {
  return {
    email: email ?? String(data.email ?? ""),
    birthYear: typeof data.birthYear === "number" ? data.birthYear : null,
    gender: normalizeGender(String(data.gender ?? "")),
    primarySports: Array.isArray(data.primarySports)
      ? data.primarySports.map(String)
      : [],
    otherSport: String(data.otherSport ?? ""),
    emailUpdates: data.emailUpdates === true,
    allowNotifications: data.allowNotifications === true,
    profileComplete: data.profileComplete === true,
  };
}

function normalizeGender(value: string) {
  if (value === "Male" || value === "Man") return "Male";
  if (value === "Female" || value === "Woman") return "Female";
  if (GENDERS.includes(value as (typeof GENDERS)[number])) return value;
  return "";
}

export function authErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        return "Enter a valid email address.";
      case "auth/email-already-in-use":
        return "An account with that email already exists. Log in instead.";
      case "auth/weak-password":
        return "Use a password of at least 6 characters.";
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Email or password is incorrect.";
      case "auth/too-many-requests":
        return "Too many attempts. Wait a moment and try again.";
      case "permission-denied":
        return "Firestore is still blocking this save. In the Firebase console, open Firestore → Rules, paste the contents of firestore.rules, and publish.";
      default:
        return error.message;
    }
  }
  return "Something went wrong. Try again.";
}
