import { renderHook } from '@testing-library/react-hooks'; // For testing hooks
import { useCardLocalization } from './useCardLocalization';
import { useTranslation } from '@/services/translationService';

// Mock translationService
jest.mock('@/services/translationService', () => ({
  useTranslation: jest.fn(),
  // Mock other exports from translationService if useCardLocalization uses them directly
}));

const mockUseTranslation = useTranslation as jest.Mock;

// Mock console.warn
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

describe('useCardLocalization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation for useTranslation
    mockUseTranslation.mockReturnValue({
      t: (key: string, options?: any) => {
        if (options) {
          // Simple way to check if options are passed, e.g. for distance "common.distance {"value":"10","unit":"km"}"
          return `${key} ${JSON.stringify(options)}`;
        }
        return key;
      },
      language: 'en',
    });
  });

  afterAll(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('formatCurrency', () => {
    it('should format currency correctly for supported locale/currency', () => {
      const { result } = renderHook(() => useCardLocalization());
      // KES is generally supported. Assuming 'en' locale.
      // Intl.NumberFormat output can be tricky due to non-breaking spaces, etc.
      // Let's check if it contains the amount and currency code.
      const formatted = result.current.formatCurrency(12345, 'KES');
      expect(formatted).toMatch(/KES\s*12,345/); // Regex to handle potential non-breaking spaces
    });

    it('should use fallback and log warning for unsupported currency', () => {
      const originalNumberFormat = Intl.NumberFormat;
      // @ts-ignore
      Intl.NumberFormat = jest.fn((locale, options) => {
        if (options.currency === 'XYZ') {
          throw new Error('Unsupported currency');
        }
        return originalNumberFormat(locale, options);
      });

      const { result } = renderHook(() => useCardLocalization());
      const amount = 6789;
      const currency = 'XYZ'; // Unsupported currency
      const formatted = result.current.formatCurrency(amount, currency);

      expect(formatted).toBe(`${currency} ${amount.toLocaleString('en')}`); // 'en' from mockUseTranslation
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to format currency using Intl.NumberFormat.'),
        expect.any(Error)
      );

      Intl.NumberFormat = originalNumberFormat; // Restore original
    });
  });

  describe('formatDistance', () => {
    it.each([
      ['10 km', 'common.distance {"value":"10","unit":"km"}'],
      ['5.5miles', 'common.distance {"value":"5.5","unit":"mile"}'], // 'miles' normalized to 'mile'
      ['approx. 200m', 'common.distance {"value":"200","unit":"m"}'],
      ['1,234.5 kilometers', 'common.distance {"value":"1,234.5","unit":"km"}'],
    ])('should format "%s" correctly', (input, expectedOutput) => {
      mockUseTranslation.mockReturnValue({
        t: (key: string, options?: any) => `${key} ${JSON.stringify(options)}`,
        language: 'en', // for toLocaleString
      });
      const { result } = renderHook(() => useCardLocalization());
      expect(result.current.formatDistance(input)).toBe(expectedOutput);
    });

    it('should return original string and log warning for unparsable distance', () => {
      const { result } = renderHook(() => useCardLocalization());
      const invalidDistance = "very far away";
      expect(result.current.formatDistance(invalidDistance)).toBe(invalidDistance);
      expect(consoleWarnSpy).toHaveBeenCalledWith(`Could not parse distance string: "${invalidDistance}". Returning original.`);
    });
  });

  describe('formatDuration', () => {
    it.each([
      ['2h 30m', 'common.duration.hoursAndMinutes {"hours":"2","minutes":"30"}'],
      ['1hr 20min', 'common.duration.hoursAndMinutes {"hours":"1","minutes":"20"}'],
      ['3 hours 15 minutes', 'common.duration.hoursAndMinutes {"hours":"3","minutes":"15"}'],
      ['5h', 'common.duration.hours {"hours":"5"}'],
      ['45m', 'common.duration.minutes {"minutes":"45"}'],
      ['1:30', 'common.duration.hoursAndMinutes {"hours":"1","minutes":"30"}'],
      ['0:45', 'common.duration.hoursAndMinutes {"hours":"0","minutes":"45"}'], // Assuming 0 hours is fine
      ['12:00', 'common.duration.hoursAndMinutes {"hours":"12","minutes":"00"}'],
    ])('should format "%s" correctly', (input, expectedOutput) => {
      const { result } = renderHook(() => useCardLocalization());
      expect(result.current.formatDuration(input)).toBe(expectedOutput);
    });

    it('should return original string and log warning for unparsable duration', () => {
      const { result } = renderHook(() => useCardLocalization());
      const invalidDuration = "a long time";
      expect(result.current.formatDuration(invalidDuration)).toBe(invalidDuration);
      expect(consoleWarnSpy).toHaveBeenCalledWith(`Could not parse duration string: "${invalidDuration}". Returning original.`);
    });

     it('should correctly parse duration with only minutes using general regex', () => {
        const { result } = renderHook(() => useCardLocalization());
        expect(result.current.formatDuration("30min")).toBe('common.duration.minutes {"minutes":"30"}');
    });

    it('should correctly parse duration with only hours using general regex', () => {
        const { result } = renderHook(() => useCardLocalization());
        expect(result.current.formatDuration("2hr")).toBe('common.duration.hours {"hours":"2"}');
    });

    it('should ignore H:MM if minutes >= 60', () => {
      const { result } = renderHook(() => useCardLocalization());
      const invalidTimeFormat = "1:70";
      expect(result.current.formatDuration(invalidTimeFormat)).toBe(invalidTimeFormat);
      expect(consoleWarnSpy).toHaveBeenCalledWith(`Could not parse duration string: "${invalidTimeFormat}". Returning original.`);
    });
  });

  describe('formatRating', () => {
    it('should format rating correctly', () => {
      const { result } = renderHook(() => useCardLocalization());
      // Example: t('common.rating', { rating: "4.5", maxRating: 5 })
      // Our mock t will return: "common.rating {\"rating\":\"4.5\",\"maxRating\":5}"
      expect(result.current.formatRating(4.5)).toBe('common.rating {"rating":"4.5","maxRating":5}');
      expect(result.current.formatRating(3, 10)).toBe('common.rating {"rating":"3.0","maxRating":10}');
    });
  });

  describe('getPriceLevelLabel', () => {
    it('should return correct label for price level', () => {
      const { result } = renderHook(() => useCardLocalization());
      expect(result.current.getPriceLevelLabel(1)).toBe('cards.restaurant.priceLevel.budget');
      expect(result.current.getPriceLevelLabel(4)).toBe('cards.restaurant.priceLevel.fine');
      expect(result.current.getPriceLevelLabel(5)).toBe(''); // Test out of bounds
    });
  });

  describe('getDifficultyLabel', () => {
     it('should return correct label for difficulty', () => {
      const { result } = renderHook(() => useCardLocalization());
      expect(result.current.getDifficultyLabel('Easy')).toBe('cards.activity.difficulty.easy');
      expect(result.current.getDifficultyLabel('Moderate')).toBe('cards.activity.difficulty.moderate');
      expect(result.current.getDifficultyLabel('Unknown')).toBe('Unknown'); // Test fallback
    });
  });
});
