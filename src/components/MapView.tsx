import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';

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

export const MapView: React.FC<MapViewProps> = ({ 
  locations, 
  center = { lat: -4.3167, lng: 39.5667 }, // Diani Beach coordinates
  zoom = 13 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // In production, this would initialize a real map (Google Maps, Mapbox, etc.)
    // For now, we'll create a placeholder with location markers
    if (mapRef.current && !mapInstanceRef.current) {
      // Simulate map initialization
      mapInstanceRef.current = true;
    }
  }, []);

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'hotel': return 'bg-purple-500';
      case 'restaurant': return 'bg-orange-500';
      case 'beach': return 'bg-blue-500';
      case 'activity': return 'bg-green-500';
      default: return 'bg-gray-500';
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

  return (
    <div className="glass rounded-2xl overflow-hidden shadow-lg">
      {/* Map Container */}
      <div 
        ref={mapRef}
        className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200"
      >
        {/* Placeholder map background */}
        <div className="absolute inset-0 opacity-50">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Location markers */}
        {locations.map((location, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-scale-in"
            style={{
              left: `${20 + (index * 25) % 60}%`,
              top: `${30 + (index * 20) % 40}%`,
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className="relative group">
              <div className={`w-10 h-10 ${getMarkerColor(location.type)} rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform cursor-pointer`}>
                <span className="text-lg">{getMarkerIcon(location.type)}</span>
              </div>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="glass px-2 py-1 rounded text-xs text-diani-sand-800 whitespace-nowrap">
                  {location.name}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Map controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <button className="glass w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/80 transition-colors">
            <span className="text-lg">+</span>
          </button>
          <button className="glass w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/80 transition-colors">
            <span className="text-lg">−</span>
          </button>
        </div>

        {/* Current location indicator */}
        <div className="absolute bottom-4 left-4">
          <button className="glass px-3 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-white/80 transition-colors">
            <Navigation size={16} className="text-diani-teal-600" />
            <span className="text-diani-sand-700">My Location</span>
          </button>
        </div>
      </div>

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
            >
              <div className={`w-6 h-6 ${getMarkerColor(location.type)} rounded-full flex items-center justify-center text-white text-xs`}>
                {index + 1}
              </div>
              <span className="text-sm text-diani-sand-700 flex-1">{location.name}</span>
              <button className="text-xs text-diani-teal-600 hover:text-diani-teal-700">
                Directions
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
