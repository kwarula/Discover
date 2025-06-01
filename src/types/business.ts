// Business listing types
export interface BusinessListing {
  id?: string;
  category: string;
  contactInfo: ContactInfo;
  businessInfo: BusinessInfo;
  documents: Documents;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  submittedAt?: Date;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  whatsappNumber?: string;
  phoneNumber: string;
}

export interface BusinessInfo {
  name?: string;
  registrationNumber?: string;
  officialBusinessName?: string;
  category: string;
  position: string;
  location?: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    }
  };
  operatingHours?: string;
  services?: string[];
  facilities?: string[];
  stage?: string;
  numberOfRooms?: number;
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface Documents {
  businessLicense?: File;
  idDocument?: File;
  passportPhoto?: File;
  additionalDocuments?: File[];
}

// Category-specific field configurations
export interface CategoryFields {
  [key: string]: {
    fields: Field[];
    documents: DocumentField[];
    additionalInfo?: {
      title: string;
      description: string;
    }[];
  };
}

export interface Field {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'select' | 'multiselect' | 'textarea' | 'location';
  required: boolean;
  options?: string[];
  placeholder?: string;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    message?: string;
  };
}

export interface DocumentField {
  name: string;
  label: string;
  required: boolean;
  accept: string;
  maxSize: number; // in MB
  description?: string;
}