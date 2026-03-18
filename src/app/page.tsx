import { HeroSlider } from "@/components/sections/home/HeroSlider";
import { FeaturedTrips } from "@/components/sections/home/FeaturedTrips";
import GallerySection from "@/components/sections/home/GallerySection";
import { HowItWorks } from "@/components/sections/home/HowItWorks";
import { StatsBanner } from "@/components/sections/home/StatsBanner";
import { TestimonialsSection } from "@/components/sections/home/TestimonialsSection";
import { CTABanner } from "@/components/sections/home/CTABanner";
import {
  getHeroSlides,
  getStats,
  getHowItWorks,
  getTestimonials,
  getFeaturedTrips,
} from "@/lib/data/queries";

export default async function HomePage() {
  // Fetch all homepage data in parallel from Supabase
  const [heroSlides, stats, howItWorks, testimonials, featuredTrips] =
    await Promise.all([
      getHeroSlides(),
      getStats(),
      getHowItWorks(),
      getTestimonials(),
      getFeaturedTrips(),
    ]);

  return (
    <>
      <HeroSlider dbSlides={heroSlides} />
      <FeaturedTrips dbTrips={featuredTrips} />
      <GallerySection />
      <HowItWorks dbSteps={howItWorks} />
      <StatsBanner dbStats={stats} />
      <TestimonialsSection dbTestimonials={testimonials} />
      <CTABanner />
    </>
  );
}
