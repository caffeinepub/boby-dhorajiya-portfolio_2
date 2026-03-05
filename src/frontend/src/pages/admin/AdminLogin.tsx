import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsCallerAdmin } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { Code2, Loader2, LogIn, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    login,
    isLoggingIn,
    isLoginError,
    loginError: iiLoginError,
    identity,
    isInitializing,
  } = useInternetIdentity();

  // Backend admin check — runs once identity is available
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();

  // Redirect to dashboard once admin is confirmed
  useEffect(() => {
    if (identity && !checkingAdmin && isAdmin === true) {
      void navigate({ to: "/admin/dashboard" });
    }
  }, [identity, isAdmin, checkingAdmin, navigate]);

  // Show helpful error when identity is set but not admin
  useEffect(() => {
    if (identity && !checkingAdmin && isAdmin === false) {
      setLoginError(
        "This Internet Identity is not registered as admin. Open the app from the Caffeine dashboard link to register as admin, then try again.",
      );
    }
  }, [identity, isAdmin, checkingAdmin]);

  // Show II login errors
  useEffect(() => {
    if (isLoginError && iiLoginError) {
      setLoginError(iiLoginError.message || "Login failed. Please try again.");
    }
  }, [isLoginError, iiLoginError]);

  const handleLogin = () => {
    setLoginError(null);
    login();
  };

  const isVerifying = !!identity && (checkingAdmin || isAdmin === undefined);
  const showSpinner = isInitializing || isLoggingIn || isVerifying;

  const spinnerLabel = isVerifying
    ? "Verifying admin access..."
    : isLoggingIn
      ? "Opening Internet Identity..."
      : "Initializing...";

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
              Admin Access
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              {showSpinner
                ? spinnerLabel
                : "Sign in with Internet Identity to continue"}
            </p>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/15 mb-6">
            <Shield className="w-4 h-4 text-cyan shrink-0" />
            <p className="text-xs text-muted-foreground">
              Secured with Internet Identity — only the registered admin can
              access this panel
            </p>
          </div>

          {/* Error */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 mb-5 text-sm text-destructive"
              data-ocid="admin.error_state"
            >
              <p className="font-semibold">Access denied.</p>
              <p className="mt-1 text-xs whitespace-pre-line">{loginError}</p>
            </motion.div>
          )}

          {/* Spinner / Login button */}
          {showSpinner ? (
            <div
              className="flex flex-col items-center gap-3 py-4"
              data-ocid="admin.loading_state"
            >
              <Loader2 className="w-6 h-6 text-cyan animate-spin" />
              <p className="text-xs text-muted-foreground">{spinnerLabel}</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              data-ocid="admin.primary_button"
            >
              <LogIn className="w-4 h-4" />
              Login with Internet Identity
            </button>
          )}

          <p className="text-xs text-muted-foreground/50 text-center mt-4">
            Only the registered admin identity can access this panel
          </p>
        </div>
      </motion.div>
    </div>
  );
}
