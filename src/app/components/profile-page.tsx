import { useState } from "react";
import { ChevronLeft, LogOut, Pencil, User, X } from "lucide-react";
import { useAuth } from "./auth-context";
import { ProfileForm } from "./profile-form";
import type { UserProfile } from "../../lib/profile";

function sportsLabel(profile: UserProfile) {
  const names = profile.primarySports.filter((sport) => sport !== "Other");
  if (profile.primarySports.includes("Other")) {
    names.push(profile.otherSport.trim() || "Other");
  }
  return names.join(", ");
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border py-3.5">
      <p className="text-[13px]" style={{ fontWeight: 700 }}>
        {label}
      </p>
      <p className="mt-1 text-[16px]">{value || "—"}</p>
    </div>
  );
}

export function PersonalInfoPage({ onBack }: { onBack: () => void }) {
  const { user, profile, saveProfile, sendReset } = useAuth();
  const [editing, setEditing] = useState(false);

  if (!user || !profile) return null;

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
        <div className="flex-1" />
        {editing ? (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 shadow-sm"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-primary-foreground shadow-sm"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8 pt-5">
        <h1>Personal information</h1>
        <p className="mb-4 mt-1 text-[14px] text-muted-foreground">
          {editing ? "Update your details, then save." : "Your account details"}
        </p>

        {editing ? (
          <ProfileForm
            key="edit"
            initial={profile}
            submitLabel="Save"
            onSubmit={async (next) => {
              await saveProfile(next);
              setEditing(false);
            }}
            onResetPassword={() => sendReset(user.email ?? profile.email)}
          />
        ) : (
          <div className="rounded-2xl border border-border bg-card px-4">
            <InfoRow label="Email" value={profile.email} />
            <InfoRow label="Birth year" value={profile.birthYear ? String(profile.birthYear) : ""} />
            <InfoRow label="Gender" value={profile.gender} />
            <InfoRow label="Primary sports" value={sportsLabel(profile)} />
            <InfoRow label="Email updates" value={profile.emailUpdates ? "On" : "Off"} />
            <InfoRow label="Notifications" value={profile.allowNotifications ? "On" : "Off"} />
          </div>
        )}
      </div>
    </div>
  );
}

export function AccountMenu({ onOpenProfile }: { onOpenProfile: () => void }) {
  const { signOutUser } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close account menu"
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="pointer-events-none fixed top-3 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4">
        <div className="relative flex justify-end">
          <button
            type="button"
            aria-label="Account menu"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm"
          >
            <User className="h-5 w-5" />
          </button>
          {open && (
            <div className="pointer-events-auto absolute right-0 top-12 w-60 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenProfile();
                }}
                className="flex min-h-12 w-full items-center gap-3 px-4 py-3 text-left"
              >
                <User className="h-4 w-4 text-primary" />
                Personal information
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  void signOutUser();
                }}
                className="flex min-h-12 w-full items-center gap-3 border-t border-border px-4 py-3 text-left"
              >
                <LogOut className="h-4 w-4 text-primary" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function ProfileSetup() {
  const { user, profile, saveProfile, signOutUser } = useAuth();

  if (!user || !profile) return null;

  return (
    <div className="flex-1 overflow-y-auto px-5 pt-10 pb-8">
      <p className="text-muted-foreground text-[14px]">Protect Her Play</p>
      <h1>Your profile</h1>
      <p className="text-muted-foreground text-[14px] mt-1 mb-6">
        Add a few details so your training stays with this account.
      </p>
      <ProfileForm initial={profile} submitLabel="Continue" onSubmit={saveProfile} />
      <button
        type="button"
        onClick={() => signOutUser()}
        className="mt-4 min-h-11 text-[14px] text-muted-foreground"
      >
        Sign out
      </button>
    </div>
  );
}
