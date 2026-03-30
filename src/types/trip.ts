export interface PricingOption {
  label: string;
  price: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  overnight?: string;
  distance?: string;
  altitude?: string;
}

export interface TripDeparture {
  id: string;
  startDate: string;
  endDate: string;
  availableSeats: number;
  bookedSeats: number;
  status: 'available' | 'filling_fast' | 'sold_out' | 'cancelled';
}

export interface TripCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  region: string;
  order: number;
  coverImage?: string;
  isActive: boolean;
}

export interface Trip {
  id: string;
  categoryId: string;
  category?: string; // Fallback or direct category
  trip_categories?: TripCategory[];
  title: string;
  displayTitle?: string;
  slug: string;
  tagline: string;
  description: string;
  durationDays: number;
  durationNights: number;
  maxAltitudeFt: number;
  difficulty: 'beginner' | 'moderate' | 'advanced' | 'expert';
  season: string;
  region: string;
  route: string;
  startLocation: string;
  endLocation: string;
  totalDistance: string;
  terrain: string;
  bestFor: string;
  rating: number;
  reviewCount: number;
  highlights: string[];
  pricing: PricingOption[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  departures: TripDeparture[];
  isFeatured: boolean;
  isActive: boolean;
  coverImage: string;
  galleryImages: string[];
  keywords?: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  trip: string;
  rating: number;
  location: string;
  review: string;
  avatar?: string;
}

export interface Enquiry {
  id?: string;
  name: string;
  email: string;
  phone: string;
  interestedTrip: string;
  groupSize: string;
  message: string;
  status?: 'new' | 'contacted' | 'converted' | 'closed';
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Guideline {
  title: string;
  description: string;
  items?: string[];
}
