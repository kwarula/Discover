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
      console.warn(
        `Failed to format currency using Intl.NumberFormat.
        Amount: ${amount}, Currency: ${currency}, Language: ${language}. Error:`,
        error
      );
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
    // Regex to capture value and common units, allowing for variations in spacing and decimal format.
    // It also captures optional "approx." prefix.
    const distanceRegex = /^(?:approx\.\s*)?([\d.,]+)\s*(km|kilometers|kilometer|m|meters|metre|miles|mile)\b/i;
    const match = distance.match(distanceRegex);

    if (match) {
      const valueStr = match[1].replace(',', '.'); // Normalize decimal separator to period
      const value = parseFloat(valueStr);
      const unit = match[2].toLowerCase(); // Normalize unit to lowercase

      if (!isNaN(value)) {
        // Normalize units to a standard key for translation if necessary
        let unitKey = unit;
        if (unit === 'kilometers' || unit === 'kilometer') unitKey = 'km';
        if (unit === 'meters' || unit === 'metre') unitKey = 'm';
        if (unit === 'miles') unitKey = 'mile';

        return t('common.distance', { value: value.toLocaleString(language), unit: unitKey });
      }
    }

    console.warn(`Could not parse distance string: "${distance}". Returning original.`);
    return distance;
  }, [t, language]);

  // Format time duration
  const formatDuration = useCallback((duration: string) => {
    // Try to parse formats like "1h 30m", "1hr 30min", "1 hour 30 minutes", "1h", "30m"
    const generalDurationRegex = /(?:(\d+)\s*(?:h|hr|hours?))?\s*(?:(\d+)\s*(?:m|min|minutes?))?/i;
    const generalMatch = duration.match(generalDurationRegex);

    if (generalMatch && (generalMatch[1] || generalMatch[2])) {
      const hours = generalMatch[1];
      const minutes = generalMatch[2];

      if (hours && minutes) {
        return t('common.duration.hoursAndMinutes', { hours, minutes });
      } else if (hours) {
        return t('common.duration.hours', { hours });
      } else if (minutes) {
        return t('common.duration.minutes', { minutes });
      }
    }

    // Try to parse format like "1:30" (interpreted as 1 hour 30 minutes)
    const timeFormatRegex = /^(\d{1,2}):(\d{2})$/;
    const timeMatch = duration.match(timeFormatRegex);

    if (timeMatch) {
      const hours = timeMatch[1];
      const minutes = timeMatch[2];
      // Ensure minutes are less than 60 if we interpret it this way strictly
      if (parseInt(minutes, 10) < 60) {
        return t('common.duration.hoursAndMinutes', { hours, minutes });
      }
    }
    
    console.warn(`Could not parse duration string: "${duration}". Returning original.`);
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
