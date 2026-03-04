import { PageHeader } from "@/components/shared/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetAllTestimonials } from "@/hooks/useQueries";
import { Quote, Star, Users } from "lucide-react";
import { motion } from "motion/react";
import type { Testimonial } from "../backend.d";

const defaultTestimonials: Testimonial[] = [
  {
    id: 1n,
    name: "Priya Sharma",
    role: "Product Manager",
    company: "FinTech Innovations",
    content:
      "Boby delivered a Flutter app that exceeded our security requirements. The implementation of biometric auth and encrypted storage was flawless. Our auditors were impressed.",
    avatarUrl: "",
    rating: 5n,
    sortOrder: 1n,
  },
  {
    id: 2n,
    name: "Marcus Johnson",
    role: "CTO",
    company: "HealthTrack App",
    content:
      "Best React Native developer I've worked with. Clean architecture, zero security vulnerabilities found in our pentest, and delivered two weeks ahead of schedule.",
    avatarUrl: "",
    rating: 5n,
    sortOrder: 2n,
  },
  {
    id: 3n,
    name: "Anita Patel",
    role: "Founder",
    company: "SecureVault",
    content:
      "Boby rebuilt our legacy Android app in Flutter with enterprise-grade security. The performance improvement was dramatic and our users love the new UI.",
    avatarUrl: "",
    rating: 5n,
    sortOrder: 3n,
  },
  {
    id: 4n,
    name: "David Chen",
    role: "Lead Developer",
    company: "EdTech Solutions",
    content:
      "Exceptional cross-platform development skills. The app runs beautifully on both iOS and Android with perfect parity. Security audit came back clean.",
    avatarUrl: "",
    rating: 5n,
    sortOrder: 4n,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: { testimonial: Testimonial; index: number }) {
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:glow-cyan transition-all duration-300 group flex flex-col"
    >
      {/* Quote icon */}
      <Quote className="w-8 h-8 text-primary/30 mb-4 group-hover:text-primary/50 transition-colors" />

      {/* Rating */}
      <StarRating rating={Number(testimonial.rating)} />

      {/* Content */}
      <p className="text-sm text-muted-foreground leading-relaxed mt-4 flex-1 italic">
        "{testimonial.content}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border">
        <Avatar className="w-9 h-9">
          {testimonial.avatarUrl && (
            <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
          )}
          <AvatarFallback className="bg-primary/15 text-cyan text-xs font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-display font-semibold text-sm text-foreground">
            {testimonial.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {testimonial.role} · {testimonial.company}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const { data: testimonials = [] } = useGetAllTestimonials();
  const displayTestimonials =
    testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <div className="min-h-screen pt-24 pb-20 relative">
      <div className="absolute inset-0 bg-dots opacity-15 pointer-events-none" />
      <div className="container mx-auto px-4">
        <PageHeader
          title="Client Testimonials"
          subtitle="Don't just take my word for it — hear from the clients I've worked with."
          badge="Social Proof"
        />

        {displayTestimonials.length === 0 ? (
          <div
            className="text-center py-16"
            data-ocid="testimonials.empty_state"
          >
            <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No testimonials yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {displayTestimonials
              .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder))
              .map((t, i) => (
                <TestimonialCard
                  key={t.id.toString()}
                  testimonial={t}
                  index={i}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
