import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsCallerAdmin } from "@/hooks/useQueries";
import { getUrlParameter, storeSessionParameter } from "@/utils/urlParams";
import { useNavigate } from "@tanstack/react-router";
import { Code2, Loader2, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

// Read the admin token from all possible URL sources and persist to sessionStorage
// so useActor can find it when creating the authenticated actor after II login.
function persistAdminTokenFromUrl(): void {
  const TOKEN_KEY = "caffeineAdminToken";

  // Check regular query string (?caffeineAdminToken=...)
  const queryToken = new URLSearchParams(window.location.search).get(TOKEN_KEY);
  if (queryToken) {
    storeSessionParameter(TOKEN_KEY, queryToken);
    return;
  }

  // Check hash query string (#/path?caffeineAdminToken=...)
  const hash = window.location.hash;
  const qIdx = hash.indexOf("?");
  if (qIdx !== -1) {
    const hashParams = new URLSearchParams(hash.substring(qIdx + 1));
    const hashToken = hashParams.get(TOKEN_KEY);
    if (hashToken) {
      storeSessionParameter(TOKEN_KEY, hashToken);
      return;
    }
  }

  // Also try getUrlParameter as a catch-all (handles edge cases)
  const fallbackToken = getUrlParameter(TOKEN_KEY);
  if (fallbackToken) {
    storeSessionParameter(TOKEN_KEY, fallbackToken);
  }
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isLoggingIn, isLoginSuccess, isInitializing, identity } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();

  // On mount, capture admin token from URL into sessionStorage so useActor
  // can use it when creating the authenticated actor after login completes.
  useEffect(() => {
    persistAdminTokenFromUrl();
  }, []);

  useEffect(() => {
    if (isLoginSuccess && isAdmin === true) {
      void navigate({ to: "/admin/dashboard" });
    }
  }, [isLoginSuccess, isAdmin, navigate]);

  useEffect(() => {
    if (identity && isAdmin === true) {
      void navigate({ to: "/admin/dashboard" });
    }
  }, [identity, isAdmin, navigate]);

  const isAccessDenied = isLoginSuccess && isAdmin === false && !checkingAdmin;

  const handleLogin = () => {
    // Re-run token persistence in case the user arrived late or refreshed
    persistAdminTokenFromUrl();
    login();
  };

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
              Sign in with Internet Identity to access the admin panel
            </p>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/15 mb-6">
            <Shield className="w-4 h-4 text-cyan shrink-0" />
            <p className="text-xs text-muted-foreground">
              Secured with Internet Identity — decentralized authentication
            </p>
          </div>

          {/* Access denied message */}
          {isAccessDenied && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 mb-5 text-sm text-destructive space-y-2"
              data-ocid="admin.error_state"
            >
              <p className="font-semibold">Access denied.</p>
              <p>
                To get admin access after every new build, follow these steps:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>
                  Go to your <strong>Caffeine dashboard</strong>
                </li>
                <li>
                  Click the <strong>preview/open link</strong> for this project
                  (do NOT type the URL manually)
                </li>
                <li>
                  Navigate to <strong>/admin</strong> from that link
                </li>
                <li>
                  Click <strong>Login with Internet Identity</strong>
                </li>
              </ol>
              <p className="text-xs mt-1 text-destructive/80">
                The Caffeine dashboard link includes your admin token, which
                registers your identity as admin on first login after each new
                deployment.
              </p>
            </motion.div>
          )}

          {/* Login Button */}
          {isInitializing ? (
            <div
              className="flex justify-center py-3"
              data-ocid="admin.loading_state"
            >
              <Loader2 className="w-6 h-6 text-cyan animate-spin" />
            </div>
          ) : (
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn || checkingAdmin}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan font-semibold h-11"
              data-ocid="admin.primary_button"
            >
              {isLoggingIn || checkingAdmin ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {checkingAdmin ? "Verifying..." : "Connecting..."}
                </>
              ) : (
                "Login with Internet Identity"
              )}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
