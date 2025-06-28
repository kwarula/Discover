import React, { useState } from 'react';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { FilterOptions, SortOptions } from '@/types';

interface ContentFilterProps {
  contentType: 'hotels' | 'restaurants' | 'activities';
  onFilterChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOptions) => void;
  className?: string;
}

export const ContentFilter: React.FC<ContentFilterProps> = ({
  contentType,
  onFilterChange,
  onSortChange,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sort, setSort] = useState<SortOptions>({ field: 'rating', direction: 'desc' });

  const priceRanges = {
    hotels: { min: 0, max: 50000, step: 1000 },
    restaurants: { min: 0, max: 5000, step: 100 },
    activities: { min: 0, max: 10000, step: 500 }
  };

  const amenitiesOptions = {
    hotels: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Beach Access', 'Gym', 'Bar', 'Parking'],
    restaurants: ['Outdoor Seating', 'Live Music', 'Ocean View', 'Vegetarian Options', 'Bar', 'Delivery'],
    activities: ['Equipment Included', 'Professional Guide', 'Transportation', 'Lunch Included', 'Photos Included']
  };

  const cuisineOptions = ['Seafood', 'International', 'Local', 'Italian', 'Indian', 'Chinese', 'Continental'];
  const difficultyOptions = ['Easy', 'Moderate', 'Challenging'];

  const handlePriceRangeChange = (values: number[]) => {
    const newFilters = {
      ...filters,
      priceRange: { min: values[0], max: values[1] }
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (values: number[]) => {
    const newFilters = {
      ...filters,
      rating: { min: values[0] }
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAmenityToggle = (amenity: string) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    
    const newFilters = {
      ...filters,
      amenities: newAmenities
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCuisineToggle = (cuisine: string) => {
    const currentCuisines = filters.cuisine || [];
    const newCuisines = currentCuisines.includes(cuisine)
      ? currentCuisines.filter(c => c !== cuisine)
      : [...currentCuisines, cuisine];
    
    const newFilters = {
      ...filters,
      cuisine: newCuisines
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (field: string, direction: string) => {
    const newSort = { field: field as any, direction: direction as any };
    setSort(newSort);
    onSortChange(newSort);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof FilterOptions];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) return true;
    return false;
  }).length;

  return (
    <>
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="h-8 px-3 text-xs"
        >
          <Filter size={14} className="mr-1" />
          Filter
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-diani-teal-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>

        <Select
          value={`${sort.field}-${sort.direction}`}
          onValueChange={(value) => {
            const [field, direction] = value.split('-');
            handleSortChange(field, direction);
          }}
        >
          <SelectTrigger className="h-8 w-auto text-xs">
            <SlidersHorizontal size={14} className="mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating-desc">Highest Rated</SelectItem>
            <SelectItem value="rating-asc">Lowest Rated</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="distance-asc">Nearest First</SelectItem>
            <SelectItem value="popularity-desc">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Filter {contentType}
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear all
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Price Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Price Range (KES)</label>
              <div className="px-2">
                <Slider
                  value={[
                    filters.priceRange?.min || priceRanges[contentType].min,
                    filters.priceRange?.max || priceRanges[contentType].max
                  ]}
                  onValueChange={handlePriceRangeChange}
                  max={priceRanges[contentType].max}
                  min={priceRanges[contentType].min}
                  step={priceRanges[contentType].step}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>KES {filters.priceRange?.min || priceRanges[contentType].min}</span>
                  <span>KES {filters.priceRange?.max || priceRanges[contentType].max}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Minimum Rating</label>
              <div className="px-2">
                <Slider
                  value={[filters.rating?.min || 0]}
                  onValueChange={handleRatingChange}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Any rating</span>
                  <span>{filters.rating?.min || 0}+ stars</span>
                </div>
              </div>
            </div>

            {/* Amenities/Features */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                {contentType === 'hotels' ? 'Amenities' : 
                 contentType === 'restaurants' ? 'Features' : 'Includes'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {amenitiesOptions[contentType].map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={filters.amenities?.includes(amenity) || false}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                    />
                    <label htmlFor={amenity} className="text-xs cursor-pointer">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Cuisine (Restaurants only) */}
            {contentType === 'restaurants' && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Cuisine Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {cuisineOptions.map((cuisine) => (
                    <div key={cuisine} className="flex items-center space-x-2">
                      <Checkbox
                        id={cuisine}
                        checked={filters.cuisine?.includes(cuisine) || false}
                        onCheckedChange={() => handleCuisineToggle(cuisine)}
                      />
                      <label htmlFor={cuisine} className="text-xs cursor-pointer">
                        {cuisine}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty (Activities only) */}
            {contentType === 'activities' && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Difficulty Level</label>
                <div className="flex gap-2">
                  {difficultyOptions.map((difficulty) => (
                    <div key={difficulty} className="flex items-center space-x-2">
                      <Checkbox
                        id={difficulty}
                        checked={filters.difficulty?.includes(difficulty) || false}
                        onCheckedChange={() => {
                          const currentDifficulties = filters.difficulty || [];
                          const newDifficulties = currentDifficulties.includes(difficulty)
                            ? currentDifficulties.filter(d => d !== difficulty)
                            : [...currentDifficulties, difficulty];
                          
                          const newFilters = {
                            ...filters,
                            difficulty: newDifficulties
                          };
                          setFilters(newFilters);
                          onFilterChange(newFilters);
                        }}
                      />
                      <label htmlFor={difficulty} className="text-xs cursor-pointer">
                        {difficulty}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};