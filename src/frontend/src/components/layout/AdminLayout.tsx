import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsCallerAdmin } from "@/hooks/useQueries";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Briefcase,
  ChevronRight,
  Code2,
  FolderOpen,
  HelpCircle,
  LayoutDashboard,
  Link2,
  Loader2,
  LogOut,
  Mail,
  Menu,
  Settings,
  Tag,
  Users,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const adminNavLinks = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Projects", to: "/admin/projects", icon: FolderOpen },
  { label: "Categories", to: "/admin/categories", icon: Tag },
  { label: "Skills", to: "/admin/skills", icon: Zap },
  { label: "Experience", to: "/admin/experience", icon: Briefcase },
  { label: "Services", to: "/admin/services", icon: Settings },
  { label: "Testimonials", to: "/admin/testimonials", icon: Users },
  { label: "Blog", to: "/admin/blog", icon: BookOpen },
  { label: "Social Links", to: "/admin/social-links", icon: Link2 },
  { label: "Leads", to: "/admin/leads", icon: Mail },
  { label: "SEO", to: "/admin/seo", icon: Settings },
  { label: "Help Guide", to: "/admin/help", icon: HelpCircle },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Google = email gate (frontend only)
  const {
    isLoggedIn: isGoogleLoggedIn,
    userEmail,
    logout: googleLogout,
    isInitializing: googleInitializing,
  } = useGoogleAuth();

  // Internet Identity = real ICP principal (needed for backend auth)
  const {
    identity,
    isInitializing: iiInitializing,
    clear: clearII,
  } = useInternetIdentity();

  // Backend admin check — valid only after II identity is set and actor is initialized
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();

  useEffect(() => {
    // Wait while either auth system is still initializing
    if (googleInitializing || iiInitializing) return;

    // Google email gate: if not Google-logged-in, go to login
    if (!isGoogleLoggedIn) {
      void navigate({ to: "/admin/login" });
      return;
    }

    // Google OK but II hasn't completed yet — AdminLogin handles triggering II
    // Don't redirect; just wait here (AdminLayout's loader covers this)
    if (!identity) return;

    // Both done — wait for admin check
    if (checkingAdmin || isAdmin === undefined) return;

    // Confirmed not admin
    if (isAdmin === false) {
      void navigate({ to: "/admin/login" });
    }
  }, [
    isGoogleLoggedIn,
    identity,
    isAdmin,
    googleInitializing,
    iiInitializing,
    checkingAdmin,
    navigate,
  ]);

  // Show spinner while any auth or admin check is pending
  const stillLoading =
    googleInitializing ||
    iiInitializing ||
    !isGoogleLoggedIn ||
    !identity ||
    checkingAdmin ||
    isAdmin === undefined;

  if (stillLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan" />
      </div>
    );
  }

  const handleLogout = () => {
    googleLogout();
    clearII();
    void navigate({ to: "/admin/login" });
  };

  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-sidebar-primary/20 border border-sidebar-primary/30 flex items-center justify-center">
            <Code2 className="w-3.5 h-3.5 text-cyan" />
          </div>
          {sidebarOpen && (
            <span className="font-display font-bold text-sm text-gradient">
              Admin Panel
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {adminNavLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setMobileSidebarOpen(false)}
                  data-ocid={`admin.nav.${link.label.toLowerCase().replace(/\s+/g, "_")}_link`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    active
                      ? "text-cyan bg-sidebar-primary/15 shadow-sm"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${active ? "text-cyan" : ""}`}
                  />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 truncate">{link.label}</span>
                      {active && <ChevronRight className="w-3 h-3 text-cyan" />}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 text-sm"
          data-ocid="admin.logout_button"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {sidebarOpen && "Logout"}
        </Button>
        {sidebarOpen && (
          <p className="text-xs text-sidebar-foreground/40 mt-2 px-2 truncate">
            {userEmail ?? "Boby Dhorajiya"}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-navy flex">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border overflow-hidden shrink-0"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: overlay dismissal
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          role="presentation"
        />
      )}

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -240 }}
        animate={{ x: mobileSidebarOpen ? 0 : -240 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full z-50 w-60 bg-sidebar border-r border-sidebar-border lg:hidden flex flex-col"
      >
        <SidebarContent />
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card/50 flex items-center px-4 gap-4 shrink-0">
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5"
          >
            {sidebarOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>

          <Separator orientation="vertical" className="h-6 hidden lg:block" />

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-foreground font-medium">
              {adminNavLinks.find((l) => isActive(l.to))?.label ?? "Admin"}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-cyan transition-colors"
              target="_blank"
            >
              View Site ↗
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
