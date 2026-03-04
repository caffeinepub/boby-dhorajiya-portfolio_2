import { AvailabilityBadge } from "@/components/shared/AvailabilityBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateContact } from "@/hooks/useQueries";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Invalid email address";
  }
  if (!form.message.trim()) errors.message = "Message is required";
  else if (form.message.trim().length < 10)
    errors.message = "Message must be at least 10 characters";
  return errors;
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const { mutateAsync: createContact, isPending } = useCreateContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    try {
      await createContact({
        id: BigInt(Date.now()),
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        createdAt: BigInt(Date.now()) * 1_000_000n,
      });
      setSubmitted(true);
      toast.success("Message sent! I'll get back to you soon.");
    } catch (err) {
      console.error("Failed to send contact message:", err);
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="min-h-screen pt-24 pb-20 relative">
      <div className="absolute inset-0 bg-dots opacity-15 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4">
        <PageHeader
          title="Get in Touch"
          subtitle="Have a project in mind or want to discuss security consulting? I'd love to hear from you."
          badge="Contact"
        />

        <div className="grid lg:grid-cols-5 gap-10 max-w-4xl mx-auto">
          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Availability */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan" />
                Availability
              </h3>
              <AvailabilityBadge className="mb-3" />
              <p className="text-sm text-muted-foreground">
                Monday – Saturday, 9:00 AM – 8:00 PM IST. Quick responses during
                business hours.
              </p>
            </div>

            {/* Contact info */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan" />
                Let's Talk
              </h3>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-cyan" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="text-foreground">
                    bobydhorajiya8@gmail.com
                  </div>
                </div>
              </div>
            </div>

            {/* What to expect */}
            <div className="p-5 rounded-xl border border-primary/20 bg-primary/5">
              <h3 className="font-display font-semibold text-cyan mb-3 text-sm">
                What to Expect
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  "Reply within 24 hours",
                  "Free initial consultation",
                  "Detailed project estimate",
                  "NDA available on request",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex items-center justify-center p-12 rounded-xl border border-primary/20 bg-primary/5 text-center"
                data-ocid="contact.success_state"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-cyan/15 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-cyan" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Message Sent!
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Thanks for reaching out. I'll get back to you within 24
                    hours.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", message: "" });
                    }}
                    className="border-border hover:border-primary/40"
                  >
                    Send Another Message
                  </Button>
                </div>
              </motion.div>
            ) : (
              <form
                onSubmit={(e) => {
                  void handleSubmit(e);
                }}
                className="p-6 rounded-xl border border-border bg-card space-y-5"
                noValidate
              >
                <h3 className="font-display font-semibold text-foreground text-lg">
                  Send a Message
                </h3>

                {/* Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-sm text-muted-foreground"
                  >
                    Your Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Priya Sharma"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={`bg-background border-input focus:border-primary/50 ${errors.name ? "border-destructive" : ""}`}
                    data-ocid="contact.name_input"
                  />
                  {errors.name && (
                    <div
                      className="flex items-center gap-1.5 text-xs text-destructive"
                      data-ocid="contact.name_error"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-sm text-muted-foreground"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="priya@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`bg-background border-input focus:border-primary/50 ${errors.email ? "border-destructive" : ""}`}
                    data-ocid="contact.email_input"
                  />
                  {errors.email && (
                    <div
                      className="flex items-center gap-1.5 text-xs text-destructive"
                      data-ocid="contact.email_error"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="message"
                    className="text-sm text-muted-foreground"
                  >
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project, timeline, and any specific security requirements..."
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={5}
                    className={`bg-background border-input focus:border-primary/50 resize-none ${errors.message ? "border-destructive" : ""}`}
                    data-ocid="contact.message_textarea"
                  />
                  {errors.message && (
                    <div
                      className="flex items-center gap-1.5 text-xs text-destructive"
                      data-ocid="contact.message_error"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.message}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan font-semibold"
                  data-ocid="contact.submit_button"
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
