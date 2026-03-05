import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsCallerAdmin } from "@/hooks/useQueries";
import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "@tanstack/react-router";
import { Code2, Loader2, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const ALLOWED_EMAIL = "bobydhorajiya@gmail.com";

export default function AdminLogin() {
  const navigate = useNavigate();

  // Step 1: Google email gate
  const {
    isLoggedIn: isGoogleLoggedIn,
    loginWithCredential,
    isInitializing: googleInitializing,
  } = useGoogleAuth();

  // Step 2: Internet Identity for real ICP principal
  const {
    login: iiLogin,
    isLoggingIn: iiLoggingIn,
    isLoginSuccess: iiSuccess,
    identity,
    isInitializing: iiInitializing,
  } = useInternetIdentity();

  // Backend admin check — only meaningful once II identity is set
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();

  const [error, setError] = useState<string | null>(null);

  // Auto-trigger II login once Google validates the email and II isn't active yet
  useEffect(() => {
    if (
      isGoogleLoggedIn &&
      !identity &&
      !iiLoggingIn &&
      !iiInitializing &&
      !googleInitializing
    ) {
      iiLogin();
    }
  }, [
    isGoogleLoggedIn,
    identity,
    iiLoggingIn,
    iiInitializing,
    googleInitializing,
    iiLogin,
  ]);

  // Navigate to dashboard once fully authenticated (Google + II + isAdmin confirmed)
  useEffect(() => {
    if (
      isGoogleLoggedIn &&
      (iiSuccess || !!identity) &&
      isAdmin === true &&
      !checkingAdmin
    ) {
      void navigate({ to: "/admin/dashboard" });
    }
  }, [isGoogleLoggedIn, iiSuccess, identity, isAdmin, checkingAdmin, navigate]);

  const handleGoogleSuccess = useCallback(
    (credentialResponse: CredentialResponse) => {
      setError(null);
      const credential = credentialResponse.credential;
      if (!credential) {
        setError("No credential returned from Google. Please try again.");
        return;
      }
      const granted = loginWithCredential(credential);
      if (!granted) {
        setError(
          `Access restricted to authorized admin only.\nOnly ${ALLOWED_EMAIL} can access this panel.`,
        );
      }
      // After this, the useEffect above will auto-trigger II login
    },
    [loginWithCredential],
  );

  const handleGoogleError = useCallback(() => {
    setError("Google sign-in failed. Please try again.");
  }, []);

  // Determine what UI state we're in
  const isWaitingForII =
    isGoogleLoggedIn && (iiLoggingIn || (!identity && !error));
  const isVerifying =
    isGoogleLoggedIn && !!identity && (checkingAdmin || isAdmin === undefined);
  const showSpinner =
    googleInitializing || iiInitializing || isWaitingForII || isVerifying;
  const showGoogleButton =
    !googleInitializing && !iiInitializing && !isGoogleLoggedIn;

  const spinnerLabel = isVerifying
    ? "Verifying admin access..."
    : isWaitingForII
      ? "Completing authentication..."
      : "Initializing...";

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
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
                : "Sign in with your Google account to continue"}
            </p>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/15 mb-6">
            <Shield className="w-4 h-4 text-cyan shrink-0" />
            <p className="text-xs text-muted-foreground">
              {isWaitingForII
                ? "An Internet Identity popup will appear — approve it to continue"
                : "Secured with Google OAuth + Internet Identity"}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 mb-5 text-sm text-destructive"
              data-ocid="admin.error_state"
            >
              <p className="font-semibold">Access denied.</p>
              <p className="mt-1 text-xs whitespace-pre-line">{error}</p>
            </motion.div>
          )}

          {/* Loading / Google button */}
          {showSpinner ? (
            <div
              className="flex flex-col items-center gap-3 py-4"
              data-ocid="admin.loading_state"
            >
              <Loader2 className="w-6 h-6 text-cyan animate-spin" />
              <p className="text-xs text-muted-foreground">{spinnerLabel}</p>
            </div>
          ) : showGoogleButton ? (
            <div
              className="flex justify-center"
              data-ocid="admin.primary_button"
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_black"
                size="large"
                shape="rectangular"
                text="signin_with"
                useOneTap={false}
              />
            </div>
          ) : null}

          {/* Hint */}
          <p className="text-xs text-muted-foreground/50 text-center mt-4">
            Only {ALLOWED_EMAIL} can access the admin panel
          </p>
        </div>
      </motion.div>
    </div>
  );
}
