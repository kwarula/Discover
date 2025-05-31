export interface Transport {
  id: string;
  type: 'bodaboda' | 'tuktuk';
  driverName: string;
  driverPhone: string;
  driverRating: number;
  driverPhoto?: string;
  vehicleNumber: string;
  location: {
    lat: number;
    lng: number;
  };
  distance: string; // e.g., "0.5 km"
  estimatedArrival: string; // e.g., "2 mins"
  fare: {
    amount: number;
    currency: string;
    estimate?: string; // e.g., "KES 100-150"
  };
  isAvailable: boolean;
  lastUpdated: Date;
}

export interface TransportRequest {
  type?: 'bodaboda' | 'tuktuk' | 'any';
  userLocation?: {
    lat: number;
    lng: number;
  };
  destination?: string;
  maxDistance?: number; // in kilometers
}

export interface TransportResponse {
  transports: Transport[];
  userLocation?: {
    lat: number;
    lng: number;
  };
  searchRadius: number;
  timestamp: Date;
}
