import { useState } from "react";
import { GENDERS, SPORTS, authErrorMessage, type UserProfile } from "../../lib/profile";

const fieldClass =
  "mt-1 w-full px-3 py-2.5 bg-background border border-border rounded-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";

const currentYear = new Date().getFullYear();

interface ProfileFormProps {
  initial: UserProfile;
  submitLabel: string;
  onSubmit: (profile: UserProfile) => Promise<void>;
  onResetPassword?: () => Promise<void>;
}

export function ProfileForm({
  initial,
  submitLabel,
  onSubmit,
  onResetPassword,
}: ProfileFormProps) {
  const [birthYear, setBirthYear] = useState(initial.birthYear?.toString() ?? "");
  const [gender, setGender] = useState(initial.gender);
  const [sports, setSports] = useState<string[]>(initial.primarySports);
  const [otherSport, setOtherSport] = useState(initial.otherSport);
  const [emailUpdates, setEmailUpdates] = useState(initial.emailUpdates);
  const [allowNotifications, setAllowNotifications] = useState(initial.allowNotifications);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleSport = (sport: string) => {
    setSports((current) =>
      current.includes(sport) ? current.filter((item) => item !== sport) : [...current, sport]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");

    const parsedYear = Number(birthYear);
    if (!Number.isInteger(parsedYear) || parsedYear < 1920 || parsedYear > currentYear) {
      setError(`Enter a birth year between 1920 and ${currentYear}.`);
      return;
    }
    if (!gender) {
      setError("Choose a gender.");
      return;
    }
    if (sports.length === 0) {
      setError("Choose at least one primary sport.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...initial,
        birthYear: parsedYear,
        gender,
        primarySports: sports,
        otherSport: sports.includes("Other") ? otherSport.trim() : "",
        emailUpdates,
        allowNotifications,
        profileComplete: true,
      });
      setNotice("Profile saved.");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async () => {
    if (!onResetPassword) return;
    setError("");
    setNotice("");
    setSubmitting(true);
    try {
      await onResetPassword();
      setNotice("Password reset email sent.");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-4">
      <label className="block mb-4">
        <span className="text-[13px] text-muted-foreground">Email</span>
        <input value={initial.email} disabled placeholder="Ex. you@email.com" className={`${fieldClass} opacity-70`} />
      </label>

      <label className="block mb-4">
        <span className="text-[13px] text-muted-foreground">Birth year</span>
        <input
          type="number"
          inputMode="numeric"
          min={1920}
          max={currentYear}
          placeholder="Ex. 2008"
          value={birthYear}
          onChange={(event) => setBirthYear(event.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="block mb-4">
        <span className="text-[13px] text-muted-foreground">Gender</span>
        <select
          value={gender}
          onChange={(event) => setGender(event.target.value)}
          className={fieldClass}
        >
          <option value="">Select</option>
          {GENDERS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <div className="mb-4">
        <p className="text-[13px] text-muted-foreground mb-2">Primary sports</p>
        <div className="flex flex-wrap gap-2">
          {SPORTS.map((sport) => {
            const selected = sports.includes(sport);
            return (
              <button
                key={sport}
                type="button"
                onClick={() => toggleSport(sport)}
                className={`px-3 py-1.5 rounded-full text-[13px] border ${
                  selected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border"
                }`}
              >
                {sport}
              </button>
            );
          })}
        </div>
        {sports.includes("Other") && (
          <input
            type="text"
            value={otherSport}
            onChange={(event) => setOtherSport(event.target.value)}
            placeholder="Add your sport (optional)"
            className={fieldClass}
          />
        )}
      </div>

      <label className="flex items-center gap-3 mb-3">
        <input
          type="checkbox"
          checked={emailUpdates}
          onChange={(event) => setEmailUpdates(event.target.checked)}
          className="accent-primary"
        />
        <span className="text-[14px]">Email updates</span>
      </label>

      <label className="flex items-start gap-3 mb-4">
        <input
          type="checkbox"
          checked={allowNotifications}
          onChange={(event) => setAllowNotifications(event.target.checked)}
          className="mt-1 accent-primary"
        />
        <span>
          <span className="block text-[14px]">Allow notifications</span>
          <span className="block text-[12px] text-muted-foreground">
            Reminders to train and other updates
          </span>
        </span>
      </label>

      {error && <p className="text-destructive text-[13px] mb-3">{error}</p>}
      {notice && <p className="text-primary text-[13px] mb-3">{notice}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-60"
      >
        {submitting ? "Saving…" : submitLabel}
      </button>

      {onResetPassword && (
        <button
          type="button"
          onClick={handleReset}
          disabled={submitting}
          className="w-full mt-3 text-[14px] text-primary"
        >
          Email me a password reset link
        </button>
      )}
    </form>
  );
}
