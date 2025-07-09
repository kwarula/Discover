import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Location {
  name: string;
  lat: number;
  lng: number;
  type: 'hotel' | 'restaurant' | 'beach' | 'activity';
}

interface MapViewProps {
  locations: Location[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

// Set Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

export const MapView: React.FC<MapViewProps> = ({ 
  locations, 
  center = { lat: -4.3167, lng: 39.5667 }, // Diani Beach coordinates
  zoom = 13 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || !mapboxgl.accessToken) {
      console.warn('Mapbox access token not found or map container not ready');
      return;
    }

    // Initialize map
    mapInstanceRef.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [center.lng, center.lat],
      zoom: zoom,
    });

    // Add navigation controls
    mapInstanceRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Cleanup map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center.lat, center.lng, zoom]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add location markers
    locations.forEach((location, index) => {
      const markerColor = getMarkerColor(location.type);
      const markerIcon = getMarkerIcon(location.type);

      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.cssText = `
        width: 40px;
        height: 40px;
        background-color: ${markerColor};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s;
      `;
      markerElement.innerHTML = markerIcon;
      markerElement.title = location.name;

      // Add hover effect
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.transform = 'scale(1.1)';
      });
      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.transform = 'scale(1)';
      });

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([location.lng, location.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<div style="font-weight: 500; color: #374151;">${location.name}</div>`)
        )
        .addTo(mapInstanceRef.current!);

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers if there are multiple locations
    if (locations.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      locations.forEach(location => {
        bounds.extend([location.lng, location.lat]);
      });
      mapInstanceRef.current.fitBounds(bounds, { padding: 50 });
    }
  }, [locations]);

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'hotel': return '#8B5CF6';
      case 'restaurant': return '#F97316';
      case 'beach': return '#3B82F6';
      case 'activity': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'hotel': return '🏨';
      case 'restaurant': return '🍽️';
      case 'beach': return '🏖️';
      case 'activity': return '🎯';
      default: return '📍';
    }
  };

  if (!mapboxgl.accessToken) {
    return (
      <div className="glass rounded-2xl overflow-hidden shadow-lg">
        <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          <div className="text-center p-4">
            <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-blue-700">
              Mapbox access token required to display map
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden shadow-lg">
      {/* Map Container */}
      <div 
        ref={mapRef}
        className="h-64 w-full"
        style={{ minHeight: '300px' }}
      />

      {/* Location list */}
      <div className="p-4 space-y-2">
        <h4 className="text-sm font-semibold text-diani-sand-800 mb-2">
          {locations.length} locations found
        </h4>
        <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
          {locations.map((location, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-diani-sand-50 transition-colors cursor-pointer"
              onClick={() => {
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo({
                    center: [location.lng, location.lat],
                    zoom: 15,
                    duration: 1000
                  });
                }
              }}
            >
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: getMarkerColor(location.type) }}
              >
                {index + 1}
              </div>
              <span className="text-sm text-diani-sand-700 flex-1">{location.name}</span>
              <button className="text-xs text-diani-teal-600 hover:text-diani-teal-700">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};