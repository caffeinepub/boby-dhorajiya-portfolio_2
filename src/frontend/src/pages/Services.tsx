import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useGetAllServices } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Settings } from "lucide-react";
import { motion } from "motion/react";
import type { Service } from "../backend.d";

const defaultServices: Service[] = [
  {
    id: 1n,
    title: "Flutter App Development",
    description:
      "Full-cycle Flutter development from ideation to App Store launch. Beautiful UIs, smooth animations, and rock-solid architecture.",
    icon: "🦋",
    sortOrder: 1n,
  },
  {
    id: 2n,
    title: "React Native Development",
    description:
      "Cross-platform React Native apps with native performance. Shared codebase, platform-specific behavior where it counts.",
    icon: "⚛️",
    sortOrder: 2n,
  },
  {
    id: 3n,
    title: "Mobile App Security Audit",
    description:
      "Comprehensive security assessment of your existing mobile app. OWASP compliance, vulnerability scanning, and actionable remediation.",
    icon: "🛡️",
    sortOrder: 3n,
  },
  {
    id: 4n,
    title: "Secure API Integration",
    description:
      "Design and implement secure REST/GraphQL integrations with JWT auth, certificate pinning, and rate limiting.",
    icon: "🔌",
    sortOrder: 4n,
  },
  {
    id: 5n,
    title: "Authentication Systems",
    description:
      "Implement OAuth2, biometric auth, MFA, and secure session management that protects users without friction.",
    icon: "🔐",
    sortOrder: 5n,
  },
  {
    id: 6n,
    title: "App Performance Optimization",
    description:
      "Diagnose and fix performance bottlenecks, reduce app size, improve startup time, and optimize battery consumption.",
    icon: "⚡",
    sortOrder: 6n,
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:glow-cyan transition-all duration-300"
    >
      <div className="text-3xl mb-4">{service.icon || "⚙️"}</div>
      <h3 className="font-display font-semibold text-foreground mb-3 group-hover:text-cyan transition-colors">
        {service.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {service.description}
      </p>
    </motion.div>
  );
}

export default function Services() {
  const { data: services = [] } = useGetAllServices();
  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <div className="min-h-screen pt-24 pb-20 relative">
      <div className="absolute inset-0 bg-dots opacity-15 pointer-events-none" />
      <div className="container mx-auto px-4">
        <PageHeader
          title="Services"
          subtitle="Specialized mobile development and security services tailored to your project's unique needs."
          badge="What I Offer"
        />

        {displayServices.length === 0 ? (
          <div className="text-center py-16" data-ocid="services.empty_state">
            <Settings className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No services listed yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {displayServices
              .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder))
              .map((service, i) => (
                <ServiceCard
                  key={service.id.toString()}
                  service={service}
                  index={i}
                />
              ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center p-10 rounded-2xl border border-primary/20 bg-primary/5 glow-cyan"
        >
          <h3 className="font-display text-2xl font-bold text-foreground mb-3">
            Need a Custom Solution?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Every project is unique. Let's discuss your specific requirements
            and build something tailored to your needs.
          </p>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan"
          >
            <Link to="/contact">
              Get in Touch
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
