import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useTheme } from "../../app/providers/ThemeProvider";
import { useAuth } from "../AuthProvider";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function LoginModal({
  open,
  onClose,
}: LoginModalProps): JSX.Element | null{
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("om@example.com");
  const [password, setPassword] = useState("StrongPassword123");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const authenticatedUser = await signIn({
        email,
        password,
      });

      console.log("Authenticated User:", authenticatedUser);

      onClose();

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.error?.message ||
          err?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 backdrop-blur-xl px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card text-card-foreground premium-shadow">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted text-foreground transition hover:scale-105"
          aria-label="Close login modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-8 pb-8 pt-10">
          <div className="mb-6">
            <div className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Welcome back
            </div>

            <h2 className="font-display text-4xl leading-tight">
              Sign in to ServeSphere
            </h2>

            <p className="mt-3 text-sm text-muted-foreground">
              Use your restaurant account to continue.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="om@example.com"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 pr-12 outline-none transition focus:border-primary"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition hover:bg-black/5 dark:hover:bg-white/10"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:border-primary hover:text-primary"
              >
                {theme === "dark"
                  ? "Switch to light"
                  : "Switch to dark"}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:translate-y-[-1px] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}