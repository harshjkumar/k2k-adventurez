import Link from "next/link";
import { Instagram, Youtube, Facebook, Twitter } from "lucide-react";

const adventureLinks = [
  { label: "Leh Ladakh", href: "/trips" },
  { label: "Spiti Valley", href: "/trips" },
  { label: "Manali - Rohtang", href: "/trips" },
  { label: "Rajasthan Desert", href: "/trips" },
  { label: "All Trips", href: "/trips" },
];

const companyLinks = [
  { label: "About K2K", href: "/about" },
  { label: "Why Choose Us", href: "/why-us" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blogs" },
  { label: "Partner With Us", href: "/contact" },
];

const supportLinks = [
  { label: "FAQs", href: "/faq" },
  { label: "Travel Guidelines", href: "/guidelines" },
  { label: "Cancellation Policy", href: "/policies/cancellation" },
  { label: "Privacy Policy", href: "/policies/privacy" },
  { label: "Contact Us", href: "/contact" },
];

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/k2kadventurez", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/@k2kadventurez", label: "YouTube" },
  { icon: Facebook, href: "https://facebook.com/k2kadventurez", label: "Facebook" },
  { icon: Twitter, href: "https://x.com/k2kadventurez", label: "Twitter" },
];

function FooterLinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-accent mb-6">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-warm-gray hover:text-white transition-colors duration-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      {/* Big CTA text */}
      <div className="border-b border-charcoal-lighter">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <Link href="/contact" className="group block">
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-semibold text-white/90 group-hover:text-accent transition-colors duration-500 tracking-tight leading-none">
              BEGIN YOUR
              <br />
              JOURNEY NOW
            </h2>
          </Link>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="font-serif text-2xl font-semibold tracking-wide text-white uppercase">
                K2K
              </span>
              <span className="font-serif text-xl font-light italic text-accent ml-0.5">
                adventurez
              </span>
            </Link>
            <p className="text-sm text-warm-gray leading-relaxed max-w-sm mb-8">
              A passionate travel company dedicated to creating unforgettable travel
              experiences. We turn travel dreams into unforgettable memories.
            </p>
            <div className="space-y-2 text-sm text-warm-gray">
              <p>📍 A-190, Arjan Garh, South Delhi – 110047</p>
              <p>📞 +91 9899157292</p>
              <p>✉️ info@k2kadventurez.com</p>
            </div>

            {/* Social icons */}
            <div className="flex gap-4 mt-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-charcoal-lighter flex items-center justify-center text-warm-gray hover:text-accent hover:border-accent transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <FooterLinkColumn title="Adventures" links={adventureLinks} />
          <FooterLinkColumn title="Company" links={companyLinks} />
          <FooterLinkColumn title="Support" links={supportLinks} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-charcoal-lighter">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-warm-gray">
            © 2026 K2K Adventurez. All rights reserved. Ride responsibly.
          </p>
          <div className="flex gap-6 text-xs text-warm-gray">
            <Link href="/policies/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/policies/cancellation" className="hover:text-white transition-colors">
              Cancellation Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
