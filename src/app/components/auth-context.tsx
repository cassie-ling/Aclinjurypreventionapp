import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { deleteField, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import {
  emptyProfile,
  profileFromDoc,
  type UserProfile,
} from "../../lib/profile";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  authReady: boolean;
  profileReady: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  sendReset: (email: string) => Promise<void>;
  saveProfile: (profile: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profileReady, setProfileReady] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setProfileReady(true);
      return;
    }

    setProfileReady(false);
    return onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        setProfile(
          snap.exists()
            ? profileFromDoc(snap.data() as Record<string, unknown>, user.email)
            : emptyProfile(user.email ?? "")
        );
        setProfileReady(true);
      },
      () => {
        setProfile(emptyProfile(user.email ?? ""));
        setProfileReady(true);
      }
    );
  }, [user]);

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email.trim(), password);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const sendReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const saveProfile = async (next: UserProfile) => {
    if (!user) throw new Error("Sign in before saving your profile.");
    const payload: Record<string, unknown> = {
      email: user.email ?? next.email,
      birthYear: next.birthYear,
      gender: next.gender,
      primarySports: next.primarySports,
      otherSport: next.primarySports.includes("Other") ? next.otherSport.trim() : "",
      emailUpdates: next.emailUpdates,
      allowNotifications: next.allowNotifications,
      phone: deleteField(),
      age: deleteField(),
      textUpdates: deleteField(),
      profileComplete: true,
      updatedAt: serverTimestamp(),
    };
    if (!profile?.profileComplete) {
      payload.createdAt = serverTimestamp();
    }
    await setDoc(doc(db, "users", user.uid), payload, { merge: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        authReady,
        profileReady,
        signUp,
        signIn,
        signOutUser,
        sendReset,
        saveProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
