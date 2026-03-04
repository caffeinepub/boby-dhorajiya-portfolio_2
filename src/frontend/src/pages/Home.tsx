import { AvailabilityBadge } from "@/components/shared/AvailabilityBadge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Code2,
  Lock,
  MessageSquare,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const techStack = [
  { name: "Flutter", color: "from-blue-400 to-cyan-400", icon: "🦋" },
  { name: "React Native", color: "from-cyan-400 to-blue-500", icon: "⚛️" },
  { name: "Dart", color: "from-blue-500 to-indigo-500", icon: "🎯" },
  { name: "JavaScript", color: "from-yellow-400 to-orange-400", icon: "⚡" },
  { name: "TypeScript", color: "from-blue-400 to-blue-600", icon: "🔷" },
  { name: "Firebase", color: "from-orange-400 to-red-400", icon: "🔥" },
  { name: "REST APIs", color: "from-green-400 to-teal-400", icon: "🔌" },
  { name: "JWT Auth", color: "from-purple-400 to-pink-400", icon: "🔐" },
];

const whyWorkWithMe = [
  {
    icon: Shield,
    title: "Security-First Approach",
    description:
      "Every app is built with enterprise-grade security. Secure API handling, encrypted storage, and authentication best practices are baked in from day one.",
    color: "text-cyan",
    bg: "bg-cyan/10",
  },
  {
    icon: Smartphone,
    title: "Mobile Expertise",
    description:
      "5+ years building production mobile apps with Flutter and React Native. I know the nuances, pitfalls, and performance tricks for each platform.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Code2,
    title: "Clean Architecture",
    description:
      "Scalable, maintainable code following SOLID principles and clean architecture patterns. Your codebase will be easy to extend and hand off.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Zap,
    title: "Performance Optimized",
    description:
      "Apps that launch fast, animate smoothly, and don't drain the battery. Performance profiling is part of every delivery.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
];

const devProcess = [
  {
    step: "01",
    title: "Discovery & Planning",
    desc: "Deep-dive into your requirements, tech stack choices, and security needs. Define architecture before writing a single line of code.",
  },
  {
    step: "02",
    title: "Secure Design",
    desc: "UI/UX wireframes with threat modelling baked in. Auth flows, data encryption, and API security designed upfront.",
  },
  {
    step: "03",
    title: "Agile Development",
    desc: "Iterative sprints with regular demos. Clean commits, code reviews, and continuous integration from day one.",
  },
  {
    step: "04",
    title: "Testing & Hardening",
    desc: "Unit tests, integration tests, security audits, and penetration testing before every release.",
  },
  {
    step: "05",
    title: "Launch & Support",
    desc: "Smooth App Store & Play Store submission. Post-launch monitoring, bug fixes, and feature iterations.",
  },
];

const faqs = [
  {
    q: "What platforms do you develop for?",
    a: "I specialize in cross-platform mobile development using Flutter and React Native, delivering apps for both iOS and Android from a single codebase. I also handle backend integrations and Firebase services.",
  },
  {
    q: "How do you ensure app security?",
    a: "Security is integrated from day one—not bolted on later. I implement secure API communication (HTTPS, certificate pinning), encrypted local storage, biometric authentication, JWT with refresh token rotation, and follow OWASP Mobile Security guidelines.",
  },
  {
    q: "What's your typical project timeline?",
    a: "An MVP typically takes 6–10 weeks depending on complexity. I provide detailed project timelines after discovery, with weekly milestones and demos so you always know where things stand.",
  },
  {
    q: "Do you work on existing codebases?",
    a: "Yes! I'm comfortable jumping into legacy Flutter or React Native projects for feature additions, security audits, performance optimization, or complete refactors.",
  },
  {
    q: "What's your availability and time zone?",
    a: "I'm available Monday–Saturday from 9:00 AM to 8:00 PM IST. I'm responsive on Slack and email, and schedule regular video calls to keep projects moving.",
  },
  {
    q: "Do you offer ongoing maintenance?",
    a: "Yes, I offer monthly retainer packages for ongoing maintenance, feature development, security updates, and OS compatibility as iOS and Android evolve.",
  },
];

export default function Home() {
  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-background to-navy/90 pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-electric/6 blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              <motion.div variants={item}>
                <AvailabilityBadge />
              </motion.div>

              <motion.div variants={item} className="space-y-2">
                <span className="font-mono text-xs text-cyan tracking-widest uppercase opacity-70">
                  Flutter & React Native Developer
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Building{" "}
                  <span className="text-gradient text-glow-cyan">Secure</span>
                  <br />
                  Cross-Platform
                  <br />
                  <span className="text-foreground/90">Mobile Apps</span>
                </h1>
              </motion.div>

              <motion.p
                variants={item}
                className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg"
              >
                I craft production-grade Flutter and React Native applications
                with{" "}
                <span className="text-cyan font-medium">
                  enterprise security
                </span>
                , silky performance, and delightful UX — from concept to App
                Store.
              </motion.p>

              <motion.div variants={item} className="flex flex-wrap gap-3">
                {[
                  "Mobile-First Developer",
                  "Security-Focused",
                  "Cross-Platform Specialist",
                ].map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-cyan border border-primary/20"
                  >
                    {badge}
                  </span>
                ))}
              </motion.div>

              <motion.div variants={item} className="flex flex-wrap gap-3 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan font-semibold"
                  data-ocid="hero.primary_button"
                >
                  <Link to="/projects">
                    View Projects
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-border hover:border-primary/50 hover:bg-primary/5 hover:text-cyan transition-all"
                  data-ocid="hero.secondary_button"
                >
                  <Link to="/contact">
                    <MessageSquare className="mr-2 w-4 h-4" />
                    Contact Me
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                variants={item}
                className="flex items-center gap-6 pt-2 text-sm text-muted-foreground"
              >
                {["5+ Years Experience", "20+ Apps Shipped", "100% Secure"].map(
                  (stat) => (
                    <div key={stat} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan shrink-0" />
                      <span>{stat}</span>
                    </div>
                  ),
                )}
              </motion.div>
            </motion.div>

            {/* Right: Phone mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-72 h-[580px]">
                {/* Glow behind phone */}
                <div className="absolute inset-0 bg-primary/15 rounded-[48px] blur-3xl animate-pulse" />

                {/* Phone frame */}
                <div className="relative w-full h-full rounded-[44px] border-2 border-primary/30 bg-gradient-to-b from-card to-navy overflow-hidden shadow-2xl glow-cyan">
                  {/* Phone header */}
                  <div className="flex justify-center pt-3 pb-2">
                    <div className="w-20 h-5 rounded-full bg-black/60 flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary/60" />
                      <div className="w-6 h-1.5 rounded-full bg-muted" />
                    </div>
                  </div>

                  {/* App screen */}
                  <div className="mx-3 rounded-3xl overflow-hidden h-[480px] bg-gradient-to-b from-navy to-background border border-border/50 p-4 space-y-3">
                    {/* App bar */}
                    <div className="flex items-center justify-between">
                      <div className="w-20 h-3 rounded shimmer" />
                      <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <Lock className="w-3.5 h-3.5 text-cyan" />
                      </div>
                    </div>

                    {/* Greeting card */}
                    <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3">
                      <div className="text-xs text-cyan font-mono mb-1">
                        Secure Session
                      </div>
                      <div className="font-display font-bold text-sm text-foreground">
                        Welcome Back 👋
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        All systems protected
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Auth", val: "✓ JWT", color: "text-cyan" },
                        {
                          label: "Encrypt",
                          val: "AES-256",
                          color: "text-blue-400",
                        },
                        {
                          label: "API",
                          val: "Secure",
                          color: "text-green-400",
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="rounded-xl bg-card/50 border border-border p-2"
                        >
                          <div className={`text-xs font-bold ${s.color}`}>
                            {s.val}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {s.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Feature list */}
                    <div className="space-y-2">
                      {[
                        "Flutter cross-platform",
                        "React Native components",
                        "Secure local storage",
                        "Biometric auth",
                      ].map((f) => (
                        <div
                          key={f}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-card/30 text-xs"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan" />
                          <span className="text-foreground/80">{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom button */}
                    <div className="rounded-2xl bg-primary text-primary-foreground p-3 text-center text-xs font-bold">
                      Built with Flutter 🚀
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground"
          >
            <span className="text-xs">Scroll down</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ─── WHY WORK WITH ME ─────────────────────────────── */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs font-medium text-cyan mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
              Why Choose Me
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Work With Me
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              I bring a rare combination of security expertise, mobile
              craftsmanship, and clean architecture to every project.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyWorkWithMe.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="group p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:glow-cyan transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── DEV PROCESS ─────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-navy/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs font-medium text-cyan mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
              My Process
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              My Development Process
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 hidden md:block" />

            <div className="space-y-6 md:space-y-0 md:grid md:gap-0">
              {devProcess.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex gap-6 p-6 rounded-xl hover:bg-card/50 transition-colors group md:ml-8 border border-transparent hover:border-border"
                >
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center group-hover:glow-cyan-sm transition-all duration-300">
                    <span className="font-mono text-sm font-bold text-cyan">
                      {step.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECURITY-FIRST ──────────────────────────────────── */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs font-medium text-cyan">
                <Shield className="w-3.5 h-3.5" />
                Security Philosophy
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Security-First, Always
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Security isn't a feature you add at the end—it's the foundation.
                Every architecture decision, API design, and data flow is
                evaluated through a security lens before the first line of code
                is written.
              </p>
              <ul className="space-y-3">
                {[
                  "OWASP Mobile Top 10 compliance",
                  "Certificate pinning & TLS enforcement",
                  "AES-256 encrypted local storage",
                  "JWT with refresh token rotation",
                  "Biometric & multi-factor authentication",
                  "Input sanitization & SQL injection prevention",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-cyan/15 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan" />
                    </div>
                    <span className="text-foreground/85">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                {
                  icon: "🔐",
                  title: "Auth Security",
                  desc: "OAuth2, JWT, biometrics, MFA",
                },
                {
                  icon: "🛡️",
                  title: "Data Protection",
                  desc: "AES-256 encryption at rest",
                },
                {
                  icon: "🔒",
                  title: "Secure APIs",
                  desc: "HTTPS, pinning, rate limits",
                },
                {
                  icon: "📱",
                  title: "App Hardening",
                  desc: "Anti-tampering, root detection",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 hover:glow-cyan transition-all duration-300 group"
                >
                  <div className="text-2xl mb-3">{card.icon}</div>
                  <h3 className="font-display font-semibold text-sm text-foreground mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{card.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TECH STACK ──────────────────────────────────────── */}
      <section className="py-20 md:py-24 bg-navy/40 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs font-medium text-cyan mb-4">
              <Code2 className="w-3.5 h-3.5" />
              Tools & Technologies
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tech Stack Overview
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="p-4 rounded-xl border border-border bg-card text-center group hover:border-primary/30 hover:glow-cyan-sm transition-all duration-300"
              >
                <div className="text-2xl mb-2">{tech.icon}</div>
                <div className="font-display font-semibold text-sm text-foreground">
                  {tech.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ──────────────────────────────────────── */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-electric/10 pointer-events-none" />
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              Let's Build Something{" "}
              <span className="text-gradient">Extraordinary</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Have a mobile app idea? Let's turn it into a secure, performant,
              and beautiful reality.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan font-semibold"
              >
                <Link to="/contact">
                  Start a Project
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border hover:border-primary/50 hover:bg-primary/5 hover:text-cyan transition-all"
              >
                <Link to="/projects">See My Work</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-navy/30 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs font-medium text-cyan mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
              FAQ
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <AccordionItem
                    value={`faq-${i}`}
                    className="border border-border rounded-xl px-4 bg-card hover:border-primary/25 transition-colors data-[state=open]:border-primary/30 data-[state=open]:glow-cyan-sm"
                  >
                    <AccordionTrigger className="text-sm font-medium text-foreground hover:text-cyan hover:no-underline py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
