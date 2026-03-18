"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

const sections = [
  {
    title: "1. Booking Confirmation",
    content: [
      "Your trip will be confirmed once the required advance payment is received at the time of booking. The booking amount may vary depending on the selected tour package, travel season, and availability.",
      "The remaining balance must be paid at least 30 days before the departure date to secure your reservation.",
    ],
  },
  {
    title: "2. Cancellation by Traveller",
    content: [
      "If you need to cancel your booking, please notify us immediately by email at info@k2kadventurez.com.",
    ],
    table: [
      { period: "30+ days before departure", refund: "75% Refund" },
      { period: "29–15 days before departure", refund: "40% Refund" },
      { period: "Less than 15 days before departure", refund: "No Refund" },
    ],
    notes: [
      "The initial booking amount is non-refundable. GST charged on any transaction will not be refundable.",
      "Refunds will be processed within 7–14 working days from the date of cancellation approval.",
    ],
  },
  {
    title: "No-Show Policy",
    content: [
      "If a traveler fails to appear for the trip or does not join the tour on the scheduled departure date without prior notice, it will be considered a \"No-Show\". In such cases, no refund will be applicable and the full tour cost will be charged.",
    ],
  },
  {
    title: "Unused Services Policy",
    content: [
      "No refund will be provided for unused services such as accommodation, meals, transportation, sightseeing, or activities that are included in the tour package but not utilized by the traveler for any reason.",
    ],
  },
  {
    title: "Traveler Responsibilities",
    content: [
      "Travelers are responsible for carrying all necessary valid identification documents and travel essentials required for the trip. The company will not be responsible for issues arising due to missing or incorrect travel documents.",
    ],
  },
  {
    title: "Code of Conduct",
    content: [
      "All travelers are expected to behave responsibly and respectfully towards fellow travelers, guides, local communities, and the environment. The company reserves the right to remove any traveler from the trip without refund if their behavior is deemed unsafe, disruptive, or inappropriate.",
    ],
  },
  {
    title: "3. Changes or Cancellation by the Company",
    content: [
      "We make every effort to organize and operate all trips according to the planned itinerary. However, due to the nature of adventure travel and circumstances beyond our control, changes may occasionally become necessary.",
      "In such situations, we reserve the right to modify the itinerary, change travel arrangements, offer alternative dates, or cancel the trip if required. We will always try to inform travelers as early as possible.",
      "Any additional expenses arising from these changes must be borne by the traveler. Refunds will not be applicable in cases involving unavoidable circumstances or Force Majeure events.",
    ],
  },
  {
    title: "Force Majeure",
    content: [
      "Force Majeure refers to unexpected events beyond the control of the company that may affect travel operations. These events may include natural disasters such as earthquakes, floods, storms, fires, landslides, or droughts, as well as accidents, strikes, civil unrest, riots, acts of terrorism, war, government regulations, visa or permit delays, and other similar circumstances.",
      "In such cases, the company cannot be held responsible for disruptions or cancellations caused by these events.",
    ],
  },
  {
    title: "4. Price Adjustments",
    content: [
      "Tour prices are based on current costs at the time of booking. If there are changes in government taxes, fuel prices, permit charges, or entry fees for monuments or attractions, the additional cost may be charged to the traveler.",
    ],
  },
  {
    title: "5. Legal Jurisdiction",
    content: [
      "Any disputes, claims, or legal matters related to the services provided by the company will be subject to the exclusive jurisdiction of the courts in Delhi, India.",
    ],
  },
];

export function CancellationPolicyClient() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative h-[45vh] min-h-[350px] w-full overflow-hidden">
        <Image src="/images/trips/1.webp" alt="Cancellation Policy" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
          <motion.div {...fadeUp}>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-white">
              Booking & Cancellation Policy
            </h1>
            <p className="mt-6 max-w-xl text-white/70 text-sm md:text-base mx-auto">
              Please read our booking and cancellation policies carefully before
              confirming your expedition.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Policy Sections ──────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-16">
          {sections.map((s, i) => (
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
              <div className="space-y-4">
                {s.content.map((p, j) => (
                  <p key={j} className="text-sm text-charcoal/60 leading.relaxed">{p}</p>
                ))}
              </div>

              {s.table && (
                <div className="mt-6 border border-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-stone-50">
                        <th className="px-6 py-3 text-left font-nav text-[10px] uppercase tracking-widest text-charcoal/60">
                          Cancellation Period
                        </th>
                        <th className="px-6 py-3 text-left font-nav text-[10px] uppercase tracking-widest text-charcoal/60">
                          Refund
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.table.map((row) => (
                        <tr key={row.period} className="border-t border-gray-100">
                          <td className="px-6 py-4 text-charcoal/70">{row.period}</td>
                          <td className="px-6 py-4 font-medium text-charcoal">
                            {row.refund}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {s.notes && (
                <div className="mt-4 space-y-2">
                  {s.notes.map((n, k) => (
                    <p key={k} className="text-xs text-charcoal/50 italic">{n}</p>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
