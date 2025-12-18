"use client";
import { motion, AnimatePresence } from "framer-motion";
import InlineWidget from "@calcom/embed-react";
import { useState } from "react";
import { Send, Calendar, X, Mail, User, MessageSquare } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const contactMethods = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/natnaelalemseged",
    icon: "in",
  },
  {
    label: "GitHub",
    href: "https://github.com/natnaelalemseged",
    icon: "{ }",
  },
  {
    label: "Email",
    href: "mailto:natnaelalemseged@gmail.com",
    icon: "@",
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function Contact() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      toast.error("Contact form is not configured. Please add the access key.", {
        duration: 5000,
        position: "bottom-center",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Contact Form Submission from ${formData.name}`,
          from_name: "Portfolio Contact Form",
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Message sent successfully! I'll get back to you soon.", {
          duration: 5000,
          position: "bottom-center",
          style: {
            background: "#00ff99",
            color: "#0d0d0d",
            fontWeight: "600",
          },
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(result.message || "Form submission failed");
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Failed to send message. Please try again or email me directly.", {
        duration: 5000,
        position: "bottom-center",
        style: {
          background: "#ff4444",
          color: "#ffffff",
          fontWeight: "600",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Toaster />
      <section
        id="contact"
        className="relative isolate overflow-hidden bg-[#050505] py-16 px-2 sm:px-4 md:px-6 text-white"
        style={{
          backgroundImage: "url('/Ethereal Metallic Figure.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/25" aria-hidden="true" />

        {/* Decorative blur orbs */}
        <span className="pointer-events-none absolute -top-16 left-4 h-48 w-48 rounded-full bg-[#00ff99]/25 blur-[80px]" />
        <span className="pointer-events-none absolute -bottom-12 right-2 h-40 w-40 rounded-full bg-[#22d3ee]/20 blur-[80px]" />

        <div className="relative mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            {!showCalendar ? (
              // Default View: Text/Links + Contact Form
              <motion.div
                key="contact-form"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95 }}
                variants={containerVariants}
                className="grid gap-10 md:grid-cols-2 items-start"
              >
                {/* LEFT COLUMN: Text + Quick Links */}
                <div className="space-y-6 md:space-y-8 md:max-w-lg lg:max-w-xl">
                  <span className="inline-flex items-center rounded-full border border-[#00ff99]/30 bg-[#00ff99]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-[#00ff99]">
                    Connect
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                    Let's build something <br className="hidden sm:block" /> remarkable together
                  </h2>
                  <p className="text-base md:text-lg text-gray-400">
                    Book a quick call to discuss your project, timeline, or any challenges. I usually respond within a few hours.
                  </p>

                  <div className="flex flex-wrap gap-3 md:gap-4">
                    {contactMethods.map((method) => (
                      <a
                        key={method.label}
                        href={method.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 md:px-5 md:py-3 text-sm font-semibold text-white transition hover:border-[#00ff99]/60 hover:bg-[#00ff99]/10"
                      >
                        <span className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full border border-[#00ff99]/40 bg-[#00ff99]/15 text-sm font-bold text-[#00ff99] transition group-hover:border-[#00ff99] group-hover:bg-[#00ff99]/25">
                          {method.icon}
                        </span>
                        {method.label}
                      </a>
                    ))}
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => setShowCalendar(true)}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-[#00ff99] text-[#0d0d0d] rounded-full hover:bg-white transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <Calendar size={20} />
                      Book a call
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN: Contact Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f0f]/50 p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
                    <h3 className="text-xl md:text-2xl font-semibold text-[#00ff99] mb-2">
                      Send a Message
                    </h3>
                    <p className="text-sm text-gray-400 mb-6">
                      Fill out the form below and I'll get back to you soon
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Honeypot Spam Protection */}
                      <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                          <User className="inline w-4 h-4 mr-2" />
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff99] focus:border-transparent transition"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                          <Mail className="inline w-4 h-4 mr-2" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff99] focus:border-transparent transition"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                          <MessageSquare className="inline w-4 h-4 mr-2" />
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff99] focus:border-transparent transition resize-none"
                          placeholder="Tell me about your project..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-6 py-3 bg-[#00ff99] text-black font-semibold rounded-xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send size={18} />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </motion.div>

              </motion.div>
            ) : (
              // Calendar View: Full Section
              <motion.div
                key="calendar-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="max-w-4xl mx-auto"
              >
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f0f]/50 p-4 md:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
                  {/* Header with Back Button */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-semibold text-[#00ff99]">
                        Schedule a Call
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Pick a time that works for you — 15 minute discovery call
                      </p>
                    </div>
                    <button
                      onClick={() => setShowCalendar(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-[#00ff99]/60 transition text-sm font-semibold"
                    >
                      <X size={18} />
                      <span className="hidden sm:inline">Back</span>
                    </button>
                  </div>

                  {/* Calendar Widget */}
                  <div className="rounded-2xl overflow-hidden border border-white/5">
                    <InlineWidget
                      calLink="natnael-alemseged-astaw-b9o7g9/15min"
                      config={{ theme: "dark" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom decorative blob */}
        <div className="pointer-events-none absolute -bottom-8 left-1/2 hidden h-36 w-36 -translate-x-1/2 rounded-full bg-[#00ff99]/10 blur-[80px] md:block" />
      </section>
    </>
  );
}