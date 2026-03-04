import { PageHeader } from "@/components/shared/PageHeader";
import { Award, Code2, Heart, Shield, Smartphone, Target } from "lucide-react";
import { motion } from "motion/react";

const values = [
  {
    icon: Shield,
    title: "Security Above All",
    desc: "Security isn't a feature—it's the foundation. I treat every data point as sensitive and every API call as a potential attack vector.",
    color: "text-cyan",
    bg: "bg-cyan/10",
  },
  {
    icon: Code2,
    title: "Craft & Quality",
    desc: "Clean, readable, well-documented code that your future self and teammates will appreciate. No hacks, no shortcuts, no tech debt.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Thinking",
    desc: "Every pixel, interaction, and API call is designed for mobile constraints first—performance, battery life, and offline resilience.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Heart,
    title: "User-Centric Design",
    desc: "Technology should feel invisible. I build apps that users love, not just apps that work.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
  {
    icon: Target,
    title: "Precision & Focus",
    desc: "Scope creep is the enemy of quality. I define clear goals, execute with precision, and deliver what was promised.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    icon: Award,
    title: "Continuous Learning",
    desc: "The mobile ecosystem evolves fast. I stay current with Flutter, React Native, and security best practices.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
];

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4">
        <PageHeader
          title="About Boby Dhorajiya"
          subtitle="Mobile App Developer, Security Engineer, Cross-Platform Specialist"
          badge="About Me"
        />

        {/* Main story */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-5 text-base text-muted-foreground leading-relaxed"
          >
            <p>
              I'm{" "}
              <span className="text-cyan font-semibold">Boby Dhorajiya</span>, a
              Mobile App Developer based in India with a relentless focus on two
              things: building beautiful cross-platform apps and keeping them
              absolutely secure.
            </p>
            <p>
              My journey started with a simple question:{" "}
              <em className="text-foreground/80">
                "Why do so many apps feel insecure?"
              </em>{" "}
              That curiosity drove me deep into mobile security—studying OWASP
              guidelines, reverse engineering apps to find vulnerabilities, and
              learning exactly how attackers think.
            </p>
            <p>
              Today, I apply that security-first mindset to every Flutter and
              React Native project. Before I write a single widget or component,
              I've already mapped out the authentication flow, encrypted the
              sensitive data stores, and hardened the API communication layer.
            </p>
            <p>
              I specialize in apps that handle what matters most: financial
              data, health records, personal communications. If your app needs
              to be both{" "}
              <span className="text-cyan font-medium">
                trusted and delightful
              </span>
              , you've found the right developer.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "5+", label: "Years Experience" },
                { value: "20+", label: "Apps Shipped" },
                { value: "100%", label: "Client Satisfaction" },
                { value: "0", label: "Security Breaches" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-5 rounded-xl border border-border bg-card text-center hover:border-primary/30 hover:glow-cyan-sm transition-all duration-300"
                >
                  <div className="font-display text-3xl font-bold text-gradient mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Philosophy card */}
            <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 glow-cyan">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-cyan" />
                <span className="font-display font-semibold text-cyan text-sm">
                  Security Philosophy
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "Security is not a product, but a process. It's not something
                you bolt on—it's something you build in from the very first line
                of architecture."
              </p>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Core Values & Principles
            </h2>
            <p className="text-muted-foreground">
              What drives every decision I make
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 hover:glow-cyan transition-all duration-300 group"
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${v.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-5 h-5 ${v.color}`} />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {v.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
