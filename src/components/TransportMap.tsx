import React, { useEffect, useRef } from 'react';
import { Transport } from '@/types/transport';
import { MapPin, Navigation } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface TransportMapProps {
  transports: Transport[];
  userLocation?: { lat: number; lng: number };
  onTransportSelect?: (transport: Transport) => void;
  selectedTransport?: Transport | null;
}

// Set Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

export const TransportMap: React.FC<TransportMapProps> = ({
  transports,
  userLocation,
  onTransportSelect,
  selectedTransport
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || !mapboxgl.accessToken) {
      console.warn('Mapbox access token not found or map container not ready');
      return;
    }

    // Initialize map centered on Diani Beach or user location
    const defaultCenter = userLocation || { lat: -4.3167, lng: 39.5667 };
    
    mapInstanceRef.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [defaultCenter.lng, defaultCenter.lat],
      zoom: 14,
    });

    // Add navigation controls
    mapInstanceRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add user location marker if available
    if (userLocation) {
      // Create user marker element
      const userMarkerElement = document.createElement('div');
      userMarkerElement.style.cssText = `
        width: 20px;
        height: 20px;
        background-color: #3B82F6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      `;

      userMarkerRef.current = new mapboxgl.Marker(userMarkerElement)
        .setLngLat([userLocation.lng, userLocation.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 15 })
            .setHTML('<div style="font-weight: 500; color: #374151;">Your Location</div>')
        )
        .addTo(mapInstanceRef.current);
    }

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }
      
      // Cleanup map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing transport markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add transport markers
    transports.forEach(transport => {
      const isSelected = selectedTransport?.id === transport.id;
      const markerColor = transport.type === 'bodaboda' ? '#FB923C' : '#EAB308';
      const markerIcon = transport.type === 'bodaboda' ? '🏍️' : '🛺';

      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.style.cssText = `
        width: 40px;
        height: 40px;
        background-color: ${markerColor};
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s;
        ${isSelected ? 'transform: scale(1.2); z-index: 1000;' : ''}
      `;
      markerElement.innerHTML = markerIcon;
      markerElement.title = `${transport.driverName} - ${transport.vehicleNumber}`;

      // Add click handler
      markerElement.addEventListener('click', () => {
        if (onTransportSelect) {
          onTransportSelect(transport);
        }
      });

      // Add hover effect
      markerElement.addEventListener('mouseenter', () => {
        if (!isSelected) {
          markerElement.style.transform = 'scale(1.1)';
        }
      });
      markerElement.addEventListener('mouseleave', () => {
        if (!isSelected) {
          markerElement.style.transform = 'scale(1)';
        }
      });

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([transport.location.lng, transport.location.lat])
        .addTo(mapInstanceRef.current!);

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (transports.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      if (userLocation) {
        bounds.extend([userLocation.lng, userLocation.lat]);
      }
      transports.forEach(transport => {
        bounds.extend([transport.location.lng, transport.location.lat]);
      });
      mapInstanceRef.current.fitBounds(bounds, { padding: 50 });
    }
  }, [transports, selectedTransport, onTransportSelect]);

  if (!mapboxgl.accessToken) {
    return (
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg">
        <div className="h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          <div className="text-center p-4">
            <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-blue-700">
              Mapbox access token required to display transport map
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 glass rounded-lg p-3 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs">
              🏍️
            </div>
            <span className="text-diani-sand-700">Bodaboda</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs">
              🛺
            </div>
            <span className="text-diani-sand-700">Tuktuk</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <span className="text-diani-sand-700">You</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected Transport Info */}
      {selectedTransport && (
        <div className="absolute top-4 left-4 right-4 glass rounded-lg p-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {selectedTransport.type === 'bodaboda' ? '🏍️' : '🛺'}
              </span>
              <div>
                <p className="font-semibold text-diani-sand-800">
                  {selectedTransport.driverName}
                </p>
                <p className="text-sm text-diani-sand-600">
                  {selectedTransport.distance} • {selectedTransport.estimatedArrival}
                </p>
              </div>
            </div>
            <p className="font-semibold text-diani-teal-700">
              {selectedTransport.fare.estimate || `${selectedTransport.fare.currency} ${selectedTransport.fare.amount}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};