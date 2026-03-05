import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsCallerAdmin } from "@/hooks/useQueries";
import {
  getSessionParameter,
  getUrlParameter,
  storeSessionParameter,
} from "@/utils/urlParams";
import { useNavigate } from "@tanstack/react-router";
import { Code2, Key, Loader2, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

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

  const TOKEN_KEY = "caffeineAdminToken";

  // Initialise field from sessionStorage (already captured at app root) or URL
  const [adminToken, setAdminToken] = useState<string>(() => {
    return getSessionParameter(TOKEN_KEY) ?? getUrlParameter(TOKEN_KEY) ?? "";
  });

  // On mount, capture admin token from URL into sessionStorage so useActor
  // can use it when creating the authenticated actor after login completes.
  useEffect(() => {
    persistAdminTokenFromUrl();
    // Sync field value with whatever was captured
    const stored = getSessionParameter(TOKEN_KEY);
    if (stored) setAdminToken(stored);
  }, []);

  // Keep sessionStorage in sync when the user types in the field
  const handleTokenChange = (value: string) => {
    setAdminToken(value);
    if (value.trim()) {
      storeSessionParameter(TOKEN_KEY, value.trim());
    }
  };

  // Redirect to dashboard whenever we have a confirmed admin — covers both
  // fresh login (isLoginSuccess) and page-reload with saved identity.
  useEffect(() => {
    if (isAdmin === true && !checkingAdmin) {
      void navigate({ to: "/admin/dashboard" });
    }
  }, [isAdmin, checkingAdmin, navigate]);

  // isAccessDenied: user went through login AND we finished checking AND they're not admin
  const isAccessDenied =
    (isLoginSuccess || !!identity) &&
    isAdmin === false &&
    !checkingAdmin &&
    !isInitializing;

  const handleLogin = () => {
    // Persist whatever token the user has entered (or what was captured from URL)
    persistAdminTokenFromUrl();
    if (adminToken.trim()) {
      storeSessionParameter(TOKEN_KEY, adminToken.trim());
    }
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

          {/* Admin Token field */}
          <div className="mb-5 space-y-1.5">
            <Label
              htmlFor="admin-token"
              className="text-sm text-muted-foreground flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5 text-cyan" />
              Admin Token
            </Label>
            <Input
              id="admin-token"
              type="password"
              placeholder="Paste your admin token here"
              value={adminToken}
              onChange={(e) => handleTokenChange(e.target.value)}
              className="bg-background/50 border-border focus:border-cyan/50 text-sm"
              data-ocid="admin.token.input"
            />
            <p className="text-xs text-muted-foreground/60">
              Find this in the Caffeine dashboard under your project settings.
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
