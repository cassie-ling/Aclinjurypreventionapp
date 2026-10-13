import { useState } from "react";
import { useAuth } from "./auth-context";
import { authErrorMessage } from "../../lib/profile";

type Mode = "login" | "signup" | "forgot";

const fieldClass =
  "mt-1 w-full px-3 py-2.5 bg-card border border-border rounded-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";

export function AuthPage() {
  const { signIn, signUp, sendReset } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
    setNotice("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }

    if (mode !== "forgot" && password.length < 6) {
      setError("Use a password of at least 6 characters.");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
      } else if (mode === "signup") {
        await signUp(email, password);
      } else {
        await sendReset(email);
        setNotice("Check your email for a link to reset your password.");
      }
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const title =
    mode === "login" ? "Log in" : mode === "signup" ? "Create account" : "Reset password";

  return (
    <div className="flex-1 overflow-y-auto px-5 pt-10 pb-8">
      <p className="text-muted-foreground text-[14px]">Protect Her Play</p>
      <h1>{title}</h1>
      <p className="text-muted-foreground text-[14px] mt-1 mb-6">
        {mode === "forgot"
          ? "We’ll email you a link to choose a new password."
          : "Sign in to save your profile and training progress."}
      </p>

      <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-4">
        <label className="block mb-4">
          <span className="text-[13px] text-muted-foreground">Email</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="Ex. you@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
          />
        </label>

        {mode !== "forgot" && (
          <label className="block mb-4">
            <span className="text-[13px] text-muted-foreground">Password</span>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={`${fieldClass} mt-0 pr-16`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-primary"
              >
                {showPassword ? "Hide" : "View"}
              </button>
            </div>
          </label>
        )}

        {mode === "signup" && (
          <label className="block mb-4">
            <span className="text-[13px] text-muted-foreground">Confirm password</span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={fieldClass}
            />
          </label>
        )}

        {error && <p className="text-destructive text-[13px] mb-3">{error}</p>}
        {notice && <p className="text-primary text-[13px] mb-3">{notice}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-60"
        >
          {submitting
            ? "Please wait…"
            : mode === "login"
              ? "Log in"
              : mode === "signup"
                ? "Create account"
                : "Send reset email"}
        </button>
      </form>

      <div className="mt-4 text-center text-[14px]">
        {mode === "login" && (
          <>
            <button type="button" onClick={() => switchMode("forgot")} className="text-primary">
              Forgot password?
            </button>
            <p className="text-muted-foreground mt-3">
              New here?{" "}
              <button type="button" onClick={() => switchMode("signup")} className="text-primary">
                Create an account
              </button>
            </p>
          </>
        )}
        {mode === "signup" && (
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <button type="button" onClick={() => switchMode("login")} className="text-primary">
              Log in
            </button>
          </p>
        )}
        {mode === "forgot" && (
          <button type="button" onClick={() => switchMode("login")} className="text-primary">
            Back to log in
          </button>
        )}
      </div>
    </div>
  );
}
