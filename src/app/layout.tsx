import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getAllTrips } from "@/lib/data/queries";
import { defaultTrips } from "@/lib/data/trips";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-nav",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "K2K Adventurez — India's Premier Adventure Travel Company",
    template: "%s | K2K Adventurez",
  },
  description:
    "Unforgettable Royal Enfield motorcycle expeditions through Ladakh, Kashmir, Spiti & beyond. Curated itineraries, premium service, pure adventure.",
  keywords: [
    "Ladakh bike trip",
    "Royal Enfield expedition",
    "motorcycle tour India",
    "Leh Ladakh trip",
    "Spiti Valley ride",
    "adventure travel India",
    "K2K Adventurez",
  ],
  openGraph: {
    title: "K2K Adventurez — Ride The Impossible",
    description:
      "Unforgettable Royal Enfield expeditions through India's most extraordinary terrains.",
    url: "https://k2kadventurez.com",
    siteName: "K2K Adventurez",
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let trips: any[] = [];
  const rawTrips = await getAllTrips();
  if (!rawTrips || rawTrips.length === 0) {
    trips = defaultTrips;
  } else {
    trips = rawTrips;
  }
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-charcoal">
        <Navbar trips={trips} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
