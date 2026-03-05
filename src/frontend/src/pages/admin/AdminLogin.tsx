import * as adminAuth from "@/hooks/useAdminAuth";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useNavigate } from "@tanstack/react-router";
import { Code2, Eye, EyeOff, Loader2, Lock, Mail, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

type Step = "credentials" | "identity" | "done";

export default function AdminLogin() {
  const navigate = useNavigate();
  const {
    login: iiLogin,
    isLoggingIn,
    isLoginError,
    loginError,
    identity,
  } = useInternetIdentity();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("credentials");

  // Once II login succeeds and identity is set, mark admin auth and redirect
  useEffect(() => {
    if (
      step === "identity" &&
      identity &&
      !identity.getPrincipal().isAnonymous()
    ) {
      adminAuth.login(email, password); // store session flag
      setStep("done");
      void navigate({ to: "/admin/dashboard" });
    }
  }, [identity, step, navigate, email, password]);

  // Handle II login error
  useEffect(() => {
    if (step === "identity" && isLoginError && loginError) {
      setError("Internet Identity login failed. Please try again.");
      setStep("credentials");
      setLoading(false);
    }
  }, [isLoginError, loginError, step]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Small delay for UX
    await new Promise((r) => setTimeout(r, 300));

    const valid =
      email.trim().toLowerCase() === "bobydhorajiya@gmail.com" &&
      password === "Admin@9201";

    if (!valid) {
      setLoading(false);
      setError("Incorrect email or password. Please try again.");
      return;
    }

    // Credentials correct — now trigger Internet Identity login
    // so we get a real principal that can be registered as admin in the backend
    setStep("identity");
    setLoading(false);
    iiLogin();
  };

  const isProcessing = loading || isLoggingIn || step === "identity";

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/8 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm mx-4"
      >
        <div className="p-8 rounded-2xl border border-border bg-card shadow-2xl glow-cyan">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-4 glow-cyan">
              <Code2 className="w-7 h-7 text-cyan" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-1">
              Admin Login
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              Sign in to manage your portfolio
            </p>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/15 mb-6">
            <Shield className="w-4 h-4 text-cyan shrink-0" />
            <p className="text-xs text-muted-foreground">
              {step === "identity"
                ? "Verifying identity — please approve the popup..."
                : "Admin access only — unauthorized access is not permitted"}
            </p>
          </div>

          {step === "identity" ? (
            <div
              className="flex flex-col items-center gap-4 py-6"
              data-ocid="admin.loading_state"
            >
              <Loader2 className="w-8 h-8 animate-spin text-cyan" />
              <p className="text-sm text-muted-foreground text-center">
                A verification popup has appeared. Please approve it to
                continue.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStep("credentials");
                  setError(null);
                }}
                className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
              >
                Cancel and go back
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-medium text-muted-foreground mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    data-ocid="admin.email.input"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-medium text-muted-foreground mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    data-ocid="admin.password.input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive"
                  data-ocid="admin.error_state"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                data-ocid="admin.submit_button"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
