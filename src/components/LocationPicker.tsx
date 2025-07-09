import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Location {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface LocationPickerProps {
  value: Location | undefined;
  onChange: (location: Location) => void;
  required?: boolean;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  required
}) => {
  const [address, setAddress] = useState(value?.address || '');
  const [showMap, setShowMap] = useState(false);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    onChange({ address: newAddress });
  };

  const handleMapClick = () => {
    setShowMap(true);
    // In production, this would integrate with Mapbox or similar
    // For now, we'll just use the address input
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-diani-sand-400" />
        <Input
          value={address}
          onChange={handleAddressChange}
          placeholder="Enter business location"
          className="pl-9"
          required={required}
        />
      </div>
      <button
        type="button"
        onClick={handleMapClick}
        className="text-sm text-diani-teal-600 hover:text-diani-teal-700"
      >
        Pick location on map
      </button>
    </div>
  );
};