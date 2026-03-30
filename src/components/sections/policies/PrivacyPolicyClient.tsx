"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

const policySections = [
  {
    title: "Information We Collect",
    subsections: [
      {
        subtitle: "Personal Information",
        content: "When you book a tour, submit an inquiry, or contact us through our website, we may collect the following personal details:",
        items: ["Name", "Email address", "Phone number", "Address", "Travel preferences", "Identification details required for permits or bookings"],
        note: "This information is collected only when you voluntarily provide it to us.",
      },
      {
        subtitle: "Non-Personal Information",
        content: "We may also collect certain non-personal information automatically when you visit our website, such as:",
        items: ["Browser type", "Device information", "IP address", "Pages visited on our website", "Time spent on pages"],
        note: "This information helps us improve our website and services.",
      },
    ],
  },
  {
    title: "How We Use Your Information",
    content: "The information we collect may be used for the following purposes:",
    items: [
      "To process tour bookings and travel arrangements",
      "To respond to your inquiries or requests",
      "To provide customer support",
      "To improve our website and services",
      "To send travel updates, offers, or promotional information (if you choose to receive them)",
    ],
    note: "We do not sell, rent, or trade your personal information to third parties.",
  },
  {
    title: "Sharing of Information",
    content: "We may share your information with trusted service providers only when necessary to operate your travel arrangements. These may include:",
    items: [
      "Hotels and accommodation providers",
      "Transport operators",
      "Local tour guides",
      "Government authorities for permits and documentation",
    ],
    note: "All such partners are required to maintain the confidentiality of your information.",
  },
  {
    title: "Data Security",
    content: "We take appropriate security measures to protect your personal information from unauthorized access, misuse, or disclosure. While we strive to use commercially acceptable means to protect your data, no method of internet transmission is completely secure.",
  },
  {
    title: "Cookies Policy",
    content: "Our website may use cookies to improve user experience and analyze website traffic. Cookies help us understand visitor behavior and optimize website performance. You can choose to disable cookies through your browser settings if you prefer.",
  },
  {
    title: "Your Privacy Rights",
    content: "You have the right to request access, correction, or deletion of your personal information stored with us. If you wish to make such a request, please contact us using the details below.",
  },
  {
    title: "Updates to This Policy",
    content: "K2K Adventurez may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date.",
  },
  {
    title: "Contact Us",
    content: "If you have any questions or concerns about this Privacy Policy, please contact us:",
    items: ["Email: info@k2kadventurez.com", "Phone: +91 99999 99999", "Website: www.k2kadventurez.com"],
  },
];

export function PrivacyPolicyClient() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative h-[45vh] min-h-[350px] w-full overflow-hidden">
        <Image src="/images/trips/5.webp" alt="Privacy Policy" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
          <motion.div {...fadeUp}>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-white">
              Privacy Policy
            </h1>
            <p className="mt-6 max-w-xl text-white/70 text-sm md:text-base mx-auto">
              At K2K Adventurez, we respect your privacy and are committed to
              protecting the personal information you share with us.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Intro ────────────────────────────────────────── */}
      <section className="py-16 bg-stone-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <motion.p {...fadeUp} className="text-sm text-charcoal/60 leading-relaxed">
            This Privacy Policy explains how we collect, use, and safeguard your
            information when you visit our website or use our travel services.
          </motion.p>
        </div>
      </section>

      {/* ── Policy Sections ──────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-16">
          {policySections.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i, duration: 0.6 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl font-light text-charcoal mb-6">
                {s.title}
              </h2>

              {s.content && (
                <p className="text-sm text-charcoal/60 leading-relaxed mb-4">
                  {s.content}
                </p>
              )}

              {s.items && (
                <ul className="space-y-2 mb-4">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-charcoal/60">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {s.note && (
                <p className="text-xs text-charcoal/50 italic border-l-2 border-accent/20 pl-4">
                  {s.note}
                </p>
              )}

              {"subsections" in s &&
                s.subsections?.map((sub) => (
                  <div key={sub.subtitle} className="mt-8 pl-6 border-l-2 border-gray-100">
                    <h3 className="font-serif text-xl font-light text-charcoal mb-3">
                      {sub.subtitle}
                    </h3>
                    <p className="text-sm text-charcoal/60 leading-relaxed mb-3">
                      {sub.content}
                    </p>
                    {sub.items && (
                      <ul className="space-y-2 mb-3">
                        {sub.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-charcoal/60">
                            <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {sub.note && (
                      <p className="text-xs text-charcoal/50 italic">{sub.note}</p>
                    )}
                  </div>
                ))}
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
