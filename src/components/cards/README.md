# Card Components Documentation

## Overview

This directory contains production-ready card components for the Diani Concierge Chat application. All components are built with TypeScript, React, and Tailwind CSS, featuring:

- ✅ **Full TypeScript support** with proper type definitions
- ✅ **Accessibility (a11y)** with ARIA labels, keyboard navigation, and screen reader support
- ✅ **Internationalization (i18n)** with multi-language support
- ✅ **Responsive design** that works on all screen sizes
- ✅ **Performance optimized** with React.memo and lazy loading
- ✅ **Error handling** with fallback images and loading states
- ✅ **Consistent styling** using Tailwind CSS and design tokens

## Components

### 1. HotelCard

Displays hotel information with amenities, ratings, and pricing.

```tsx
import { HotelCard } from '@/components/cards/HotelCard';

<HotelCard
  id="hotel-1"
  name="Diani Reef Beach Resort"
  rating={4.5}
  price="From KES 15,000/night"
  pricePerNight={15000}
  currency="KES"
  location="Diani Beach Road"
  image="/hotel-image.jpg"
  amenities={['WiFi', 'Pool', 'Spa']}
  description="Luxury beachfront resort..."
  onClick={() => handleClick()}
  onViewDetails={() => handleViewDetails()}
  onCheckAvailability={() => handleCheckAvailability()}
/>
```

### 2. ActivityCard

Shows activity details with difficulty levels, duration, and highlights.

```tsx
import { ActivityCard } from '@/components/cards/ActivityCard';

<ActivityCard
  id="activity-1"
  name="Dolphin Watching Tour"
  category="Water Sports"
  duration="4 hours"
  groupSize="2-8 people"
  location="Wasini Island"
  image="/activity-image.jpg"
  price="KES 3,500/person"
  priceValue={3500}
  currency="KES"
  difficulty="Moderate"
  highlights={['Dolphin spotting', 'Snorkeling']}
  availability="Daily at 8:00 AM"
  onClick={() => handleClick()}
  onBookNow={() => handleBookNow()}
  onLearnMore={() => handleLearnMore()}
/>
```

### 3. RestaurantCard

Displays restaurant information with cuisine type, price level, and specialties.

```tsx
import { RestaurantCard } from '@/components/cards/RestaurantCard';

<RestaurantCard
  id="restaurant-1"
  name="Ali Barbour's Cave"
  cuisine="Seafood"
  rating={4.8}
  priceLevel={3}
  location="Diani Beach"
  image="/restaurant-image.jpg"
  hours="12:00 PM - 11:00 PM"
  phone="+254 123 456 789"
  specialties={['Grilled Lobster', 'Wine Selection']}
  onClick={() => handleClick()}
  onViewMenu={() => handleViewMenu()}
  onCall={() => handleCall()}
/>
```

### 4. TransportCard

Shows available transport options with driver details and real-time availability.

```tsx
import { TransportCard } from '@/components/cards/TransportCard';

<TransportCard
  transport={{
    id: 'transport-1',
    type: 'tuktuk',
    driverName: 'John Kamau',
    driverPhone: '+254 712 345 678',
    vehicleNumber: 'KBZ 123A',
    driverRating: 4.7,
    isAvailable: true,
    location: { lat: -4.3167, lng: 39.5667 },
    distance: '1.2 km',
    estimatedArrival: '5 minutes',
    fare: {
      amount: 200,
      currency: 'KES',
      estimate: 'KES 200-250'
    },
    lastUpdated: new Date()
  }}
  onClick={() => handleClick()}
  onBook={(transport) => handleBook(transport)}
  onCall={(transport) => handleCall(transport)}
/>
```

## Utility Components

### ResponsiveCardGrid

A responsive grid container for cards that automatically adjusts columns based on screen size.

```tsx
import { ResponsiveCardGrid } from '@/components/cards/ResponsiveCardGrid';

<ResponsiveCardGrid>
  <HotelCard {...hotelProps} />
  <ActivityCard {...activityProps} />
  <RestaurantCard {...restaurantProps} />
</ResponsiveCardGrid>
```

### CardImage

A smart image component with lazy loading and error handling.

```tsx
import { CardImage } from '@/components/cards/CardImage';

<CardImage
  src="/image.jpg"
  alt="Description"
  fallbackSrc="/placeholder.jpg"
  className="h-48"
  loading="lazy"
/>
```

### CardSkeleton

Loading skeleton component for cards.

```tsx
import { HotelCardSkeleton } from '@/components/cards/HotelCard';

// Show while loading
{isLoading ? <HotelCardSkeleton /> : <HotelCard {...props} />}
```

## Internationalization

All card components support internationalization through the `useCardLocalization` hook:

```tsx
// The hook automatically detects the current language
// and provides localized text and formatting functions
const { formatCurrency, formatRating, cardTexts } = useCardLocalization();
```

Supported languages:
- English (en)
- Swahili (sw)
- French (fr)
- German (de)
- Italian (it)
- Spanish (es)

## Accessibility Features

1. **Keyboard Navigation**
   - All cards support Tab navigation
   - Enter key triggers onClick handler
   - Focus indicators on interactive elements

2. **Screen Reader Support**
   - Proper ARIA labels on all elements
   - Semantic HTML structure
   - Role attributes for complex elements

3. **Color Contrast**
   - All text meets WCAG AA standards
   - Focus indicators are clearly visible

## Performance Optimizations

1. **React.memo** - All cards are memoized to prevent unnecessary re-renders
2. **Lazy Loading** - Images load only when visible
3. **Optimized Re-renders** - Event handlers use useCallback
4. **CSS-in-JS** - No runtime style calculations

## Responsive Design

Cards automatically adapt to different screen sizes:

- **Mobile** (< 640px): Single column, full width
- **Tablet** (640px - 1024px): 2 columns
- **Desktop** (> 1024px): 3-4 columns

## Error Handling

1. **Image Errors** - Automatic fallback to placeholder
2. **Missing Data** - Graceful degradation with default values
3. **Loading States** - Skeleton loaders while fetching data

## Testing

```tsx
// Example test setup
import { render, screen, fireEvent } from '@testing-library/react';
import { HotelCard } from '@/components/cards/HotelCard';

test('renders hotel card with correct data', () => {
  render(<HotelCard {...mockHotelData} />);
  
  expect(screen.getByText('Hotel Name')).toBeInTheDocument();
  expect(screen.getByLabelText(/rating: 4.5/i)).toBeInTheDocument();
});

test('handles click events', () => {
  const handleClick = jest.fn();
  render(<HotelCard {...mockHotelData} onClick={handleClick} />);
  
  fireEvent.click(screen.getByRole('article'));
  expect(handleClick).toHaveBeenCalled();
});
```

## Best Practices

1. **Always provide unique IDs** for cards to help with React reconciliation
2. **Use semantic props** (e.g., `priceValue` for numeric values)
3. **Handle loading states** with skeleton components
4. **Provide alt text** for all images
5. **Test with keyboard navigation** and screen readers
6. **Use the ResponsiveCardGrid** for consistent layouts

## Examples

See `CardShowcase.tsx` for comprehensive examples of all card components in different states and configurations.

```tsx
import { CardShowcase } from '@/components/cards/CardShowcase';

// View all examples
<CardShowcase />
