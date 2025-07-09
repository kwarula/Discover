import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';

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

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  required
}) => {
  const [address, setAddress] = useState(value?.address || '');
  const [showMap, setShowMap] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(value?.coordinates);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // Update address state when value prop changes
  useEffect(() => {
    if (value?.address) {
      setAddress(value.address);
    }
  }, [value?.address]);

  // Update selectedCoords state when value prop changes
  useEffect(() => {
    if (value?.coordinates) {
      setSelectedCoords(value.coordinates);
      // If map is already initialized and marker exists, update marker position
      if (mapInstanceRef.current && markerRef.current) {
        markerRef.current.setLngLat([value.coordinates.lng, value.coordinates.lat]);
        mapInstanceRef.current.setCenter([value.coordinates.lng, value.coordinates.lat]);
      }
    }
  }, [value?.coordinates]);


  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    // Only call onChange if coordinates are not being actively selected via map
    // Or, always call and let parent decide, for now, let's keep it simple
    onChange({ address: newAddress, coordinates: selectedCoords });
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  const handleConfirmLocation = () => {
    if (selectedCoords) {
      onChange({ address: address, coordinates: selectedCoords });
    }
    setShowMap(false);
  };

  // Reverse geocode coordinates to address
  const reverseGeocode = async (coords: { lat: number; lng: number }) => {
    if (!mapboxgl.accessToken) return;
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.lng},${coords.lat}.json?access_token=${mapboxgl.accessToken}&limit=1`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const newAddress = data.features[0].place_name;
        setAddress(newAddress);
        // Also update the parent form immediately with the new address and existing coords
        onChange({ address: newAddress, coordinates: coords });
      } else {
        // If no address found, keep existing address or clear it, based on desired UX
        // For now, we keep the potentially manually entered or previous address.
        // onChange({ address: address, coordinates: coords }); // or setAddress('')
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Fallback to onChange with current address and new coords if geocoding fails
      onChange({ address: address, coordinates: coords });
    }
  };

  useEffect(() => {
    if (showMap && mapContainerRef.current && !mapInstanceRef.current && mapboxgl.accessToken) {
      const initialLng = selectedCoords?.lng || value?.coordinates?.lng || 39.5667; // Diani
      const initialLat = selectedCoords?.lat || value?.coordinates?.lat || -4.3167; // Diani
      const initialZoom = (selectedCoords?.lng || value?.coordinates?.lng) ? 15 : 13;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [initialLng, initialLat],
        zoom: initialZoom,
      });
      mapInstanceRef.current = map;

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Place initial marker if coordinates exist
      if (initialLng && initialLat) {
        const marker = new mapboxgl.Marker({ draggable: true })
          .setLngLat([initialLng, initialLat])
          .addTo(map);
        markerRef.current = marker;

        marker.on('dragend', () => {
          const lngLat = marker.getLngLat();
          const newCoords = { lat: lngLat.lat, lng: lngLat.lng };
          setSelectedCoords(newCoords);
          reverseGeocode(newCoords);
        });
      }

      map.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        const newCoords = { lat, lng };
        setSelectedCoords(newCoords);
        reverseGeocode(newCoords); // Call reverse geocoding on map click

        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
        } else {
          const newMarker = new mapboxgl.Marker({ draggable: true })
            .setLngLat([lng, lat])
            .addTo(mapInstanceRef.current!);
          markerRef.current = newMarker;

          newMarker.on('dragend', () => {
            const newLngLat = newMarker.getLngLat();
            const draggedCoords = { lat: newLngLat.lat, lng: newLngLat.lng };
            setSelectedCoords(draggedCoords);
            reverseGeocode(draggedCoords); // Call reverse geocoding on marker drag end
          });
        }
      });

      return () => { // Cleanup
        map.remove();
        mapInstanceRef.current = null;
        if (markerRef.current) {
          // Marker is implicitly removed with map, but good to nullify
          markerRef.current = null;
        }
      };
    } else if (!showMap && mapInstanceRef.current) {
        // This case handles if showMap is toggled off externally or by confirm
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        if (markerRef.current) {
          markerRef.current = null;
        }
    }
  }, [showMap]); // Rerun effect if showMap changes

  // Effect to call onChange when selectedCoords changes internally
  useEffect(() => {
    if (selectedCoords) {
       // This will be handled by confirm button or address change for now.
       // We might want to call onChange here if we want live updates without reverse geocoding step.
       // For now, confirmation is explicit via "Confirm Location" or implicitly if address changes.
    }
  }, [selectedCoords, onChange, address]);


  return (
    <div className="space-y-2">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-diani-sand-400" />
        <Input
          value={address}
          onChange={handleAddressChange}
          placeholder="Enter business location or pick on map"
          className="pl-9"
          required={required}
        />
      </div>

      {!mapboxgl.accessToken && (
        <p className="text-xs text-red-500">
          Mapbox access token is not configured. Map functionality is disabled.
        </p>
      )}

      {mapboxgl.accessToken && (
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleMap}
            className="text-sm text-diani-teal-600 hover:text-diani-teal-700"
        >
            <MapPin className="mr-2 h-4 w-4" />
            {showMap ? 'Close Map' : 'Pick Location on Map'}
        </Button>
      )}

      {showMap && mapboxgl.accessToken && (
        <div className="space-y-2 pt-2">
          <div
            ref={mapContainerRef}
            className="h-64 w-full rounded-md border" // Added border for visibility
            style={{ minHeight: '250px' }}
          />
          <Button
            type="button"
            onClick={handleConfirmLocation}
            size="sm"
            className="w-full"
            disabled={!selectedCoords}
          >
            Confirm Selected Location
          </Button>
        </div>
      )}
    </div>
  );
};