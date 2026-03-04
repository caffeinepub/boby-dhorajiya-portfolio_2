import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsCallerAdmin } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { Code2, Loader2, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isLoggingIn, isLoginSuccess, isInitializing, identity } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();

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
              className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 mb-5 text-sm text-destructive"
              data-ocid="admin.error_state"
            >
              Access denied. Your account does not have admin permissions.
              Please contact the site owner to grant admin access.
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
