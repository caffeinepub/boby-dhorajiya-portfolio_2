import { useGetActiveSocialLinks } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  Clock,
  Code2,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Twitter,
} from "lucide-react";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Skills", to: "/skills" },
  { label: "Services", to: "/services" },
  { label: "Experience", to: "/experience" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

const PLATFORM_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  website: Globe,
};

export function Footer() {
  const { data: socialLinks = [] } = useGetActiveSocialLinks();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-navy/50 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="relative container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Code2 className="w-4 h-4 text-cyan" />
              </div>
              <span className="font-display font-bold text-lg text-gradient">
                Boby Dhorajiya
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Mobile App Developer specializing in Flutter & React Native.
              Building secure, cross-platform applications that users love.
            </p>
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-cyan" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyan animate-ping opacity-50" />
              </div>
              <Clock className="w-3.5 h-3.5 text-cyan" />
              <span className="text-cyan font-medium text-xs">
                Available: 9:00 AM – 8:00 PM
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">
              Quick Links
            </h3>
            <ul className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-cyan transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">
              Connect
            </h3>
            <div className="flex flex-wrap gap-3 mb-4">
              {socialLinks.length > 0 ? (
                socialLinks.map((link) => {
                  const Icon =
                    PLATFORM_ICONS[link.platform.toLowerCase()] || ExternalLink;
                  return (
                    <a
                      key={link.id.toString()}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-muted-foreground hover:text-cyan hover:border-primary/40 hover:bg-primary/20 transition-all duration-200"
                      aria-label={link.platform}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })
              ) : (
                <>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-muted-foreground hover:text-cyan hover:border-primary/40 hover:bg-primary/20 transition-all duration-200"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-muted-foreground hover:text-cyan hover:border-primary/40 hover:bg-primary/20 transition-all duration-200"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for freelance & full-time opportunities
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {year} Boby Dhorajiya. All rights reserved.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-cyan transition-colors duration-200"
          >
            Built with ♥ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
