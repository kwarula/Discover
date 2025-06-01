import { CategoryFields } from '@/types/business';

export const categoryFields: CategoryFields = {
  'Hotel': {
    fields: [
      {
        name: 'hotelName',
        label: 'Hotel Name',
        type: 'text',
        required: true,
        placeholder: 'Enter hotel name'
      },
      {
        name: 'officialBusinessName',
        label: 'Official Business Name',
        type: 'text',
        required: true,
        placeholder: 'Legal business name'
      },
      {
        name: 'registrationNumber',
        label: 'Hotel Registration Number',
        type: 'text',
        required: true,
        placeholder: 'e.g., HTL/2024/001'
      },
      {
        name: 'category',
        label: 'Hotel Category',
        type: 'select',
        required: true,
        options: ['Budget', 'Mid-range', 'Luxury']
      },
      {
        name: 'location',
        label: 'Hotel Location',
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
        label: 'Facilities Offered',
        type: 'multiselect',
        required: true,
        options: [
          'WiFi',
          'Pool',
          'Restaurant',
          'Bar',
          'Gym',
          'Spa',
          'Conference Room',
          'Beach Access',
          'Room Service',
          'Airport Shuttle'
        ]
      }
    ],
    documents: [
      {
        name: 'businessLicense',
        label: 'Business License',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 5,
        description: 'Upload a valid business license'
      },
      {
        name: 'taxCertificate',
        label: 'Tax Compliance Certificate',
        required: false,
        accept: '.pdf',
        maxSize: 2,
        description: 'KRA PIN certificate (optional)'
      }
    ]
  },
  'Tuktuk Rides': {
    fields: [
      {
        name: 'registrationNumber',
        label: 'Tuktuk Registration Number',
        type: 'text',
        required: true,
        placeholder: 'e.g., KXX 123A'
      },
      {
        name: 'stage',
        label: 'Operating Stage',
        type: 'select',
        required: true,
        options: [
          'Naivas',
          'Carrefour',
          'Diani Bazaar',
          'Diani Beach Road',
          'Other'
        ]
      },
      {
        name: 'operatingHours',
        label: 'Operating Hours',
        type: 'text',
        required: true,
        placeholder: 'e.g., 7AM - 9PM'
      }
    ],
    documents: [
      {
        name: 'idDocument',
        label: 'National ID',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 2,
        description: 'Clear photo of your National ID'
      },
      {
        name: 'passportPhoto',
        label: 'Passport-size Photo',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 1,
        description: 'Recent passport-size photo'
      },
      {
        name: 'vehicleLicense',
        label: 'Vehicle License',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 2,
        description: 'Valid vehicle license'
      }
    ]
  },
  'Massage Therapist': {
    fields: [
      {
        name: 'services',
        label: 'Services Offered',
        type: 'multiselect',
        required: true,
        options: [
          'Swedish Massage',
          'Deep Tissue Massage',
          'Sports Massage',
          'Thai Massage',
          'Hot Stone Massage',
          'Aromatherapy',
          'Reflexology'
        ]
      },
      {
        name: 'serviceArea',
        label: 'Service Area',
        type: 'multiselect',
        required: true,
        options: [
          'Diani Beach',
          'Ukunda',
          'Tiwi',
          'Galu',
          'Mobile Service'
        ]
      },
      {
        name: 'operatingHours',
        label: 'Operating Hours',
        type: 'text',
        required: true,
        placeholder: 'e.g., 9AM - 7PM'
      }
    ],
    documents: [
      {
        name: 'certification',
        label: 'Professional Certification',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 3,
        description: 'Upload your massage therapy certification'
      },
      {
        name: 'idDocument',
        label: 'National ID',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 2,
        description: 'Clear photo of your National ID'
      },
      {
        name: 'passportPhoto',
        label: 'Professional Photo',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 1,
        description: 'Professional photo in work attire'
      }
    ]
  }
};