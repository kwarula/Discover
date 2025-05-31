// Hotel Card Types
export interface HotelCardProps {
  id: string;
  name: string;
  rating: number;
  price: string;
  location: string;
  image: string;
  amenities: string[];
  description: string;
  currency?: string;
  pricePerNight?: number;
  onClick?: () => void;
  onViewDetails?: () => void;
  onCheckAvailability?: () => void;
}

// Activity Card Types
export interface ActivityCardProps {
  id: string;
  name: string;
  category: string;
  duration: string;
  groupSize: string;
  location: string;
  image: string;
  price: string;
  difficulty?: 'Easy' | 'Moderate' | 'Challenging';
  highlights: string[];
  availability: string;
  currency?: string;
  priceValue?: number;
  onClick?: () => void;
  onBookNow?: () => void;
  onLearnMore?: () => void;
}

// Restaurant Card Types
export interface RestaurantCardProps {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceLevel: 1 | 2 | 3 | 4;
  location: string;
  image: string;
  hours: string;
  phone?: string;
  specialties: string[];
  onClick?: () => void;
  onViewMenu?: () => void;
  onCall?: () => void;
}

// Common types
export interface CardImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export interface CardErrorState {
  hasError: boolean;
  errorMessage?: string;
}

// Constants
export const AMENITY_ICONS = {
  wifi: 'Wifi',
  parking: 'Car',
  breakfast: 'Coffee',
  family: 'Users',
  pool: 'Waves',
  gym: 'Dumbbell',
  spa: 'Sparkles',
  restaurant: 'Utensils',
  bar: 'Wine',
  'air conditioning': 'Wind',
  'pet friendly': 'PawPrint',
  'beach access': 'Umbrella',
} as const;

export const DIFFICULTY_STYLES = {
  Easy: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  Moderate: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
  Challenging: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
  },
} as const;

export type AmenityType = keyof typeof AMENITY_ICONS;
export type DifficultyType = keyof typeof DIFFICULTY_STYLES;
