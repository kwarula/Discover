import React, { useEffect, useRef } from 'react';
import { Transport } from '@/types/transport';
import { MapPin, Navigation } from 'lucide-react';

interface TransportMapProps {
  transports: Transport[];
  userLocation?: { lat: number; lng: number };
  onTransportSelect?: (transport: Transport) => void;
  selectedTransport?: Transport | null;
}

export const TransportMap: React.FC<TransportMapProps> = ({
  transports,
  userLocation,
  onTransportSelect,
  selectedTransport
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Initialize map centered on Diani Beach
    const defaultCenter = userLocation || { lat: -4.3167, lng: 39.5667 };
    
    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 14,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ],
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false
    });

    // Add user location marker if available
    if (userLocation) {
      userMarkerRef.current = new google.maps.Marker({
        position: userLocation,
        map: mapInstanceRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#3B82F6',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2
        },
        title: 'Your Location'
      });

      // Add pulsing circle around user location
      new google.maps.Circle({
        map: mapInstanceRef.current,
        center: userLocation,
        radius: 100,
        fillColor: '#3B82F6',
        fillOpacity: 0.1,
        strokeColor: '#3B82F6',
        strokeOpacity: 0.3,
        strokeWeight: 1
      });
    }

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }
    };
  }, [userLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing transport markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add transport markers
    transports.forEach(transport => {
      const icon = transport.type === 'bodaboda' 
        ? {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#FB923C" stroke="#FFFFFF" stroke-width="2"/>
                <text x="20" y="26" font-size="20" text-anchor="middle" fill="white">🏍️</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20)
          }
        : {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#EAB308" stroke="#FFFFFF" stroke-width="2"/>
                <text x="20" y="26" font-size="20" text-anchor="middle" fill="white">🛺</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20)
          };

      const marker = new google.maps.Marker({
        position: transport.location,
        map: mapInstanceRef.current,
        icon,
        title: `${transport.driverName} - ${transport.vehicleNumber}`,
        animation: selectedTransport?.id === transport.id 
          ? google.maps.Animation.BOUNCE 
          : undefined
      });

      marker.addListener('click', () => {
        if (onTransportSelect) {
          onTransportSelect(transport);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (transports.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      if (userLocation) {
        bounds.extend(userLocation);
      }
      transports.forEach(transport => {
        bounds.extend(transport.location);
      });
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [transports, selectedTransport, onTransportSelect]);

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
