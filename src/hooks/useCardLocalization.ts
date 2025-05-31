import { useCallback } from 'react';
import { useTranslation } from '@/services/translationService';

export const useCardLocalization = () => {
  const { t, language } = useTranslation();

  // Format currency based on locale
  const formatCurrency = useCallback((amount: number, currency: string = 'KES') => {
    try {
      return new Intl.NumberFormat(language, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (error) {
      // Fallback for unsupported currencies
      return `${currency} ${amount.toLocaleString(language)}`;
    }
  }, [language]);

  // Format rating text
  const formatRating = useCallback((rating: number, maxRating: number = 5) => {
    return t('common.rating', { rating: rating.toFixed(1), maxRating });
  }, [t]);

  // Format distance
  const formatDistance = useCallback((distance: string) => {
    // Extract number and unit from distance string
    const match = distance.match(/^([\d.]+)\s*(.+)$/);
    if (match) {
      const [, value, unit] = match;
      return t('common.distance', { value, unit });
    }
    return distance;
  }, [t]);

  // Format time duration
  const formatDuration = useCallback((duration: string) => {
    // Handle common duration formats
    const hourMatch = duration.match(/(\d+)\s*h(?:ours?)?/i);
    const minMatch = duration.match(/(\d+)\s*m(?:ins?|inutes?)?/i);
    
    if (hourMatch && minMatch) {
      return t('common.duration.hoursAndMinutes', { 
        hours: hourMatch[1], 
        minutes: minMatch[1] 
      });
    } else if (hourMatch) {
      return t('common.duration.hours', { hours: hourMatch[1] });
    } else if (minMatch) {
      return t('common.duration.minutes', { minutes: minMatch[1] });
    }
    
    return duration;
  }, [t]);

  // Get localized text for common card elements
  const cardTexts = {
    viewDetails: t('cards.actions.viewDetails'),
    checkAvailability: t('cards.actions.checkAvailability'),
    bookNow: t('cards.actions.bookNow'),
    learnMore: t('cards.actions.learnMore'),
    viewMenu: t('cards.actions.viewMenu'),
    call: t('cards.actions.call'),
    unavailable: t('cards.status.unavailable'),
    imageUnavailable: t('cards.status.imageUnavailable'),
    popularDishes: t('cards.restaurant.popularDishes'),
    highlights: t('cards.activity.highlights'),
    amenities: t('cards.hotel.amenities'),
    more: t('common.more'),
    arrivesIn: t('cards.transport.arrivesIn'),
    callDriver: t('cards.transport.callDriver'),
  };

  // Get price level labels
  const getPriceLevelLabel = useCallback((level: number) => {
    const labels = {
      1: t('cards.restaurant.priceLevel.budget'),
      2: t('cards.restaurant.priceLevel.moderate'),
      3: t('cards.restaurant.priceLevel.upscale'),
      4: t('cards.restaurant.priceLevel.fine'),
    };
    return labels[level as keyof typeof labels] || '';
  }, [t]);

  // Get difficulty labels
  const getDifficultyLabel = useCallback((difficulty: string) => {
    const labels = {
      'Easy': t('cards.activity.difficulty.easy'),
      'Moderate': t('cards.activity.difficulty.moderate'),
      'Challenging': t('cards.activity.difficulty.challenging'),
    };
    return labels[difficulty as keyof typeof labels] || difficulty;
  }, [t]);

  return {
    formatCurrency,
    formatRating,
    formatDistance,
    formatDuration,
    cardTexts,
    getPriceLevelLabel,
    getDifficultyLabel,
    language,
  };
};
