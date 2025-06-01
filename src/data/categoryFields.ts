import { CategoryFields } from '@/types/business';

export const categoryFields: CategoryFields = {
  'Accommodation': {
    fields: [
      {
        name: 'businessName',
        label: 'Business Name',
        type: 'text',
        required: true,
        placeholder: 'Enter business name',
        validation: {
          pattern: '^[a-zA-Z0-9\\s\\-&\']{2,50}$',
          message: 'Business name must be between 2-50 characters'
        }
      },
      {
        name: 'registrationNumber',
        label: 'Business Registration Number',
        type: 'text',
        required: true,
        placeholder: 'e.g., BN2024/001',
        validation: {
          pattern: '^[A-Z0-9/\\-]{5,20}$',
          message: 'Enter a valid registration number'
        }
      },
      {
        name: 'accommodationType',
        label: 'Accommodation Type',
        type: 'select',
        required: true,
        options: [
          'Hotel',
          'Guest House',
          'Villa',
          'Cottage',
          'Boutique Resort',
          'Beach House',
          'Serviced Apartment'
        ]
      },
      {
        name: 'priceRange',
        label: 'Price Range (KES)',
        type: 'select',
        required: true,
        options: [
          'Budget (Under 5,000)',
          'Mid-range (5,000-15,000)',
          'Luxury (Above 15,000)'
        ]
      },
      {
        name: 'location',
        label: 'Property Location',
        type: 'location',
        required: true,
        placeholder: 'Select location on map'
      },
      {
        name: 'numberOfRooms',
        label: 'Number of Rooms',
        type: 'number',
        required: true,
        validation: {
          min: 1,
          message: 'Must have at least one room'
        }
      },
      {
        name: 'facilities',
        label: 'Available Facilities',
        type: 'multiselect',
        required: true,
        options: [
          'WiFi',
          'Swimming Pool',
          'Restaurant',
          'Bar',
          'Room Service',
          'Beach Access',
          'Airport Shuttle',
          'Parking',
          'Air Conditioning',
          'Garden',
          'Security'
        ]
      },
      {
        name: 'phoneNumber',
        label: 'Business Phone',
        type: 'tel',
        required: true,
        placeholder: '+254 XXX XXX XXX',
        validation: {
          pattern: '^\\+254[0-9]{9}$',
          message: 'Enter a valid Kenyan phone number'
        }
      },
      {
        name: 'whatsappNumber',
        label: 'WhatsApp Number (Optional)',
        type: 'tel',
        required: false,
        placeholder: '+254 XXX XXX XXX',
        validation: {
          pattern: '^\\+254[0-9]{9}$',
          message: 'Enter a valid Kenyan phone number'
        }
      }
    ],
    documents: [
      {
        name: 'businessLicense',
        label: 'Business License',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 5,
        description: 'Upload a valid business license or permit'
      },
      {
        name: 'taxCertificate',
        label: 'Tax Compliance Certificate',
        required: true,
        accept: '.pdf',
        maxSize: 2,
        description: 'Current KRA tax compliance certificate'
      },
      {
        name: 'insuranceCertificate',
        label: 'Insurance Certificate',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 3,
        description: 'Public liability insurance certificate'
      },
      {
        name: 'propertyPhotos',
        label: 'Property Photos',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 10,
        description: 'Upload at least 5 high-quality photos of your property'
      }
    ]
  },
  'Airport Transfers': {
    fields: [
      {
        name: 'businessName',
        label: 'Business Name',
        type: 'text',
        required: true,
        placeholder: 'Enter business name',
        validation: {
          pattern: '^[a-zA-Z0-9\\s\\-&\']{2,50}$',
          message: 'Business name must be between 2-50 characters'
        }
      },
      {
        name: 'registrationNumber',
        label: 'Business Registration Number',
        type: 'text',
        required: true,
        placeholder: 'e.g., BN2024/001',
        validation: {
          pattern: '^[A-Z0-9/\\-]{5,20}$',
          message: 'Enter a valid registration number'
        }
      },
      {
        name: 'vehicleTypes',
        label: 'Vehicle Types Available',
        type: 'multiselect',
        required: true,
        options: [
          'Sedan',
          'SUV',
          'Van',
          'Luxury Car',
          'Minibus'
        ]
      },
      {
        name: 'serviceAreas',
        label: 'Service Areas',
        type: 'multiselect',
        required: true,
        options: [
          'Diani - Moi Airport',
          'Diani - JKIA',
          'Diani - Mombasa',
          'Diani - Malindi',
          'Custom Routes'
        ]
      },
      {
        name: 'operatingHours',
        label: 'Operating Hours',
        type: 'text',
        required: true,
        placeholder: 'e.g., 24/7 or 6AM - 10PM'
      },
      {
        name: 'phoneNumber',
        label: 'Business Phone',
        type: 'tel',
        required: true,
        placeholder: '+254 XXX XXX XXX',
        validation: {
          pattern: '^\\+254[0-9]{9}$',
          message: 'Enter a valid Kenyan phone number'
        }
      },
      {
        name: 'whatsappNumber',
        label: 'WhatsApp Number (Optional)',
        type: 'tel',
        required: false,
        placeholder: '+254 XXX XXX XXX',
        validation: {
          pattern: '^\\+254[0-9]{9}$',
          message: 'Enter a valid Kenyan phone number'
        }
      }
    ],
    documents: [
      {
        name: 'businessLicense',
        label: 'Business License',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 5,
        description: 'Upload a valid business license or permit'
      },
      {
        name: 'insuranceCertificate',
        label: 'Vehicle Insurance',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 3,
        description: 'Commercial vehicle insurance certificate'
      },
      {
        name: 'driverLicenses',
        label: 'Driver Licenses',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 5,
        description: 'Valid licenses for all drivers'
      },
      {
        name: 'vehiclePhotos',
        label: 'Vehicle Photos',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 10,
        description: 'Clear photos of all available vehicles'
      }
    ]
  },
  'Auto Services': {
    fields: [
      {
        name: 'businessName',
        label: 'Business Name',
        type: 'text',
        required: true,
        placeholder: 'Enter business name',
        validation: {
          pattern: '^[a-zA-Z0-9\\s\\-&\']{2,50}$',
          message: 'Business name must be between 2-50 characters'
        }
      },
      {
        name: 'registrationNumber',
        label: 'Business Registration Number',
        type: 'text',
        required: true,
        placeholder: 'e.g., BN2024/001',
        validation: {
          pattern: '^[A-Z0-9/\\-]{5,20}$',
          message: 'Enter a valid registration number'
        }
      },
      {
        name: 'serviceTypes',
        label: 'Services Offered',
        type: 'multiselect',
        required: true,
        options: [
          'General Repairs',
          'Body Work',
          'Paint Job',
          'Tire Services',
          'Oil Change',
          'AC Service',
          'Engine Repair',
          'Electrical Systems',
          'Car Wash',
          'Diagnostics'
        ]
      },
      {
        name: 'location',
        label: 'Workshop Location',
        type: 'location',
        required: true,
        placeholder: 'Select location on map'
      },
      {
        name: 'specializations',
        label: 'Brand Specializations',
        type: 'multiselect',
        required: false,
        options: [
          'Toyota',
          'Nissan',
          'Mazda',
          'Subaru',
          'Mercedes',
          'BMW',
          'All Brands'
        ]
      },
      {
        name: 'operatingHours',
        label: 'Operating Hours',
        type: 'text',
        required: true,
        placeholder: 'e.g., Mon-Sat 8AM - 6PM'
      },
      {
        name: 'phoneNumber',
        label: 'Business Phone',
        type: 'tel',
        required: true,
        placeholder: '+254 XXX XXX XXX',
        validation: {
          pattern: '^\\+254[0-9]{9}$',
          message: 'Enter a valid Kenyan phone number'
        }
      },
      {
        name: 'whatsappNumber',
        label: 'WhatsApp Number (Optional)',
        type: 'tel',
        required: false,
        placeholder: '+254 XXX XXX XXX',
        validation: {
          pattern: '^\\+254[0-9]{9}$',
          message: 'Enter a valid Kenyan phone number'
        }
      }
    ],
    documents: [
      {
        name: 'businessLicense',
        label: 'Business License',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 5,
        description: 'Upload a valid business license or permit'
      },
      {
        name: 'certifications',
        label: 'Technical Certifications',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 5,
        description: 'Relevant technical certifications for your services'
      },
      {
        name: 'workshopPhotos',
        label: 'Workshop Photos',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 10,
        description: 'Photos of your workshop and equipment'
      },
      {
        name: 'insuranceCertificate',
        label: 'Insurance Certificate',
        required: false,
        accept: '.pdf',
        maxSize: 2,
        description: 'Business liability insurance (recommended)'
      }
    ]
  }
};