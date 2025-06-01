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
  },
  'Bakery': {
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
        name: 'location',
        label: 'Shop Location',
        type: 'location',
        required: true,
        placeholder: 'Select location on map'
      },
      {
        name: 'specialties',
        label: 'Specialties',
        type: 'multiselect',
        required: true,
        options: [
          'Bread',
          'Pastries',
          'Cakes',
          'Cookies',
          'Gluten-Free',
          'Vegan Options',
          'Custom Orders'
        ]
      },
      {
        name: 'operatingHours',
        label: 'Operating Hours',
        type: 'text',
        required: true,
        placeholder: 'e.g., Mon-Sat 6AM - 7PM'
      },
      {
        name: 'facilities',
        label: 'Facilities',
        type: 'multiselect',
        required: true,
        options: [
          'Seating Area',
          'Air Conditioning',
          'WiFi',
          'Parking',
          'Delivery Service',
          'Custom Orders'
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
        name: 'healthCertificate',
        label: 'Health Certificate',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 3,
        description: 'Food handling and health certification'
      },
      {
        name: 'shopPhotos',
        label: 'Shop & Product Photos',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 10,
        description: 'Photos of your bakery and products (min. 5 photos)'
      }
    ]
  },
  'Barbershop': {
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
        name: 'location',
        label: 'Shop Location',
        type: 'location',
        required: true,
        placeholder: 'Select location on map'
      },
      {
        name: 'services',
        label: 'Services Offered',
        type: 'multiselect',
        required: true,
        options: [
          'Haircut',
          'Beard Trim',
          'Shave',
          'Hair Coloring',
          'Hair Treatment',
          'Facial',
          'Head Massage',
          'Kids Haircut'
        ]
      },
      {
        name: 'operatingHours',
        label: 'Operating Hours',
        type: 'text',
        required: true,
        placeholder: 'e.g., Mon-Sun 8AM - 8PM'
      },
      {
        name: 'facilities',
        label: 'Facilities',
        type: 'multiselect',
        required: true,
        options: [
          'Air Conditioning',
          'WiFi',
          'TV',
          'Waiting Area',
          'Card Payment',
          'Mobile Payment'
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
        name: 'certifications',
        label: 'Professional Certifications',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 5,
        description: 'Barber certifications and training documents'
      },
      {
        name: 'shopPhotos',
        label: 'Shop Photos',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 10,
        description: 'Photos of your barbershop and work samples'
      }
    ]
  },
  'Bars & Lounges': {
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
        name: 'location',
        label: 'Establishment Location',
        type: 'location',
        required: true,
        placeholder: 'Select location on map'
      },
      {
        name: 'type',
        label: 'Establishment Type',
        type: 'select',
        required: true,
        options: [
          'Beach Bar',
          'Cocktail Bar',
          'Sports Bar',
          'Lounge',
          'Rooftop Bar',
          'Pub'
        ]
      },
      {
        name: 'specialties',
        label: 'Specialties',
        type: 'multiselect',
        required: true,
        options: [
          'Cocktails',
          'Local Beer',
          'Craft Beer',
          'Wine Selection',
          'Bar Food',
          'Live Music',
          'DJ Nights',
          'Sports Screening'
        ]
      },
      {
        name: 'operatingHours',
        label: 'Operating Hours',
        type: 'text',
        required: true,
        placeholder: 'e.g., Mon-Sun 4PM - 2AM'
      },
      {
        name: 'facilities',
        label: 'Facilities',
        type: 'multiselect',
        required: true,
        options: [
          'Air Conditioning',
          'Outdoor Seating',
          'Dance Floor',
          'Pool Table',
          'Smoking Area',
          'Private Rooms',
          'Card Payment',
          'Parking'
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
        name: 'liquorLicense',
        label: 'Liquor License',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 3,
        description: 'Valid liquor license'
      },
      {
        name: 'healthCertificate',
        label: 'Health Certificate',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 3,
        description: 'Food handling certification (if serving food)'
      },
      {
        name: 'establishmentPhotos',
        label: 'Establishment Photos',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 10,
        description: 'Photos of your bar/lounge (min. 5 photos)'
      }
    ]
  },
  'Beach Equipment Rentals': {
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
        name: 'location',
        label: 'Rental Location',
        type: 'location',
        required: true,
        placeholder: 'Select location on map'
      },
      {
        name: 'equipment',
        label: 'Available Equipment',
        type: 'multiselect',
        required: true,
        options: [
          'Beach Chairs',
          'Umbrellas',
          'Beach Beds',
          'Snorkeling Gear',
          'Surfboards',
          'Stand-up Paddleboards',
          'Beach Games',
          'Water Sports Equipment'
        ]
      },
      {
        name: 'operatingHours',
        label: 'Operating Hours',
        type: 'text',
        required: true,
        placeholder: 'e.g., Daily 7AM - 6PM'
      },
      {
        name: 'paymentMethods',
        label: 'Payment Methods',
        type: 'multiselect',
        required: true,
        options: [
          'Cash',
          'M-Pesa',
          'Card Payment',
          'Bank Transfer',
          'Advance Booking'
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
        name: 'beachPermit',
        label: 'Beach Operation Permit',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 3,
        description: 'Permission to operate on the beach'
      },
      {
        name: 'insuranceCertificate',
        label: 'Insurance Certificate',
        required: true,
        accept: '.pdf',
        maxSize: 2,
        description: 'Public liability insurance'
      },
      {
        name: 'equipmentPhotos',
        label: 'Equipment Photos',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 10,
        description: 'Photos of your rental equipment'
      }
    ]
  },
  'Boat Tours': {
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
        name: 'location',
        label: 'Departure Point',
        type: 'location',
        required: true,
        placeholder: 'Select location on map'
      },
      {
        name: 'tourTypes',
        label: 'Tour Types',
        type: 'multiselect',
        required: true,
        options: [
          'Dolphin Watching',
          'Snorkeling Trips',
          'Sunset Cruises',
          'Fishing Trips',
          'Island Hopping',
          'Glass Bottom Boat',
          'Private Charters',
          'Dinner Cruises'
        ]
      },
      {
        name: 'boatDetails',
        label: 'Boat Details',
        type: 'multiselect',
        required: true,
        options: [
          'Traditional Dhow',
          'Speed Boat',
          'Glass Bottom Boat',
          'Luxury Yacht',
          'Fishing Boat'
        ]
      },
      {
        name: 'operatingHours',
        label: 'Operating Hours',
        type: 'text',
        required: true,
        placeholder: 'e.g., Daily 6AM - 6PM'
      },
      {
        name: 'facilities',
        label: 'Onboard Facilities',
        type: 'multiselect',
        required: true,
        options: [
          'Life Jackets',
          'Snorkeling Gear',
          'Refreshments',
          'Toilet',
          'Shade/Cover',
          'First Aid Kit',
          'Music System'
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
        name: 'marineOperationLicense',
        label: 'Marine Operation License',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 3,
        description: 'License to operate marine vessels'
      },
      {
        name: 'boatRegistration',
        label: 'Boat Registration',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 3,
        description: 'Registration documents for all vessels'
      },
      {
        name: 'insuranceCertificate',
        label: 'Insurance Certificate',
        required: true,
        accept: '.pdf',
        maxSize: 2,
        description: 'Marine insurance and public liability'
      },
      {
        name: 'crewCertifications',
        label: 'Crew Certifications',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 5,
        description: 'Certifications for captain and crew'
      },
      {
        name: 'boatPhotos',
        label: 'Boat Photos',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 10,
        description: 'Photos of your boats and facilities'
      
      }
    ]
  },
  'Butchery': {
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
        name: 'location',
        label: 'Shop Location',
        type: 'location',
        required: true,
        placeholder: 'Select location on map'
      },
      {
        name: 'meatTypes',
        label: 'Meat Types',
        type: 'multiselect',
        required: true,
        options: [
          'Beef',
          'Goat',
          'Lamb',
          'Chicken',
          'Camel',
          'Fish',
          'Specialty Cuts'
        ]
      },
      {
        name: 'services',
        label: 'Services',
        type: 'multiselect',
        required: true,
        options: [
          'Custom Cuts',
          'Marination',
          'Packaging',
          'Delivery',
          'Bulk Orders',
          'Special Orders'
        ]
      },
      {
        name: 'operatingHours',
        label: 'Operating Hours',
        type: 'text',
        required: true,
        placeholder: 'e.g., Mon-Sun 7AM - 7PM'
      },
      {
        name: 'facilities',
        label: 'Facilities',
        type: 'multiselect',
        required: true,
        options: [
          'Cold Storage',
          'Display Counter',
          'Packaging Area',
          'Processing Area',
          'Card Payment',
          'Parking'
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
        name: 'healthCertificate',
        label: 'Health Certificate',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 3,
        description: 'Food handling and health certification'
      },
      {
        name: 'meatLicense',
        label: 'Meat Trading License',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 3,
        description: 'License to handle and sell meat products'
      },
      {
        name: 'shopPhotos',
        label: 'Shop Photos',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 10,
        description: 'Photos of your butchery and facilities'
      }
    ]
  },
  'Car Hire': {
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
        name: 'location',
        label: 'Office Location',
        type: 'location',
        required: true,
        placeholder: 'Select location on map'
      },
      {
        name: 'fleetTypes',
        label: 'Available Vehicles',
        type: 'multiselect',
        required: true,
        options: [
          'Economy Cars',
          'SUVs',
          'Luxury Cars',
          'Vans',
          'Minibuses',
          'Off-road Vehicles',
          'With Driver',
          'Self-drive'
        ]
      },
      {
        name: 'services',
        label: 'Additional Services',
        type: 'multiselect',
        required: true,
        options: [
          'Airport Pickup',
          'Hotel Delivery',
          'GPS Navigation',
          'Child Seats',
          'Roadside Assistance',
          'Long-term Rental',
          'Insurance Coverage'
        ]
      },
      {
        name: 'operatingHours',
        label: 'Operating Hours',
        type: 'text',
        required: true,
        placeholder: 'e.g., 24/7 or 8AM - 8PM'
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
        name: 'insuranceCertificates',
        label: 'Vehicle Insurance Certificates',
        required: true,
        accept: '.pdf',
        maxSize: 10,
        description: 'Insurance certificates for all vehicles'
      },
      {
        name: 'vehicleRegistrations',
        label: 'Vehicle Registration Documents',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 10,
        description: 'Registration documents for all vehicles'
      },
      {
        name: 'fleetPhotos',
        label: 'Fleet Photos',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 15,
        description: 'Clear photos of all available vehicles'
      }
    ]
  },
  'Car Wash': {
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
        name: 'location',
        label: 'Car Wash Location',
        type: 'location',
        required: true,
        placeholder: 'Select location on map'
      },
      {
        name: 'services',
        label: 'Services Offered',
        type: 'multiselect',
        required: true,
        options: [
          'Exterior Wash',
          'Interior Cleaning',
          'Full Detailing',
          'Engine Wash',
          'Waxing',
          'Polishing',
          'Carpet Cleaning',
          'Leather Treatment'
        ]
      },
      {
        name: 'vehicleTypes',
        label: 'Vehicle Types Serviced',
        type: 'multiselect',
        required: true,
        options: [
          'Cars',
          'SUVs',
          'Vans',
          'Motorcycles',
          'Trucks',
          'Boats'
        ]
      },
      {
        name: 'operatingHours',
        label: 'Operating Hours',
        type: 'text',
        required: true,
        placeholder: 'e.g., Mon-Sun 7AM - 7PM'
      },
      {
        name: 'facilities',
        label: 'Facilities',
        type: 'multiselect',
        required: true,
        options: [
          'Waiting Area',
          'Refreshments',
          'WiFi',
          'Covered Area',
          'Mobile Service',
          'Card Payment'
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
        name: 'environmentalCertificate',
        label: 'Environmental Compliance',
        required: true,
        accept: '.pdf',
        maxSize: 3,
        description: 'Environmental compliance certificate'
      },
      {
        name: 'facilityPhotos',
        label: 'Facility Photos',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 10,
        description: 'Photos of your car wash facility'
      }
    ]
  },
  'Chiropractor': {
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
        name: 'practitionerName',
        label: 'Practitioner Name',
        type: 'text',
        required: true,
        placeholder: 'Full name of chiropractor'
      },
      {
        name: 'location',
        label: 'Practice Location',
        type: 'location',
        required: true,
        placeholder: 'Select location on map'
      },
      {
        name: 'specializations',
        label: 'Specializations',
        type: 'multiselect',
        required: true,
        options: [
          'Sports Injuries',
          'Back Pain',
          'Neck Pain',
          'Joint Problems',
          'Pediatric Care',
          'Pregnancy Care',
          'Rehabilitation'
        ]
      },
      {
        name: 'services',
        label: 'Services Offered',
        type: 'multiselect',
        required: true,
        options: [
          'Spinal Adjustment',
          'Massage Therapy',
          'Physical Therapy',
          'Exercise Programs',
          'Nutritional Counseling',
          'X-ray Services'
        ]
      },
      {
        name: 'operatingHours',
        label: 'Operating Hours',
        type: 'text',
        required: true,
        placeholder: 'e.g., Mon-Fri 9AM - 5PM'
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
        name: 'practitionerLicense',
        label: 'Practitioner License',
        required: true,
        accept: '.pdf',
        maxSize: 3,
        description: 'Valid chiropractic license'
      },
      {
        name: 'qualifications',
        label: 'Professional Qualifications',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 5,
        description: 'Certificates and qualifications'
      },
      {
        name: 'insuranceCertificate',
        label: 'Professional Insurance',
        required: true,
        accept: '.pdf',
        maxSize: 2,
        description: 'Professional liability insurance'
      },
      {
        name: 'clinicPhotos',
        label: 'Clinic Photos',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 10,
        description: 'Photos of your clinic and facilities'
      }
    ]
  },
  'Clothing Shop': {
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
        name: 'location',
        label: 'Shop Location',
        type: 'location',
        required: true,
        placeholder: 'Select location on map'
      },
      {
        name: 'clothingTypes',
        label: 'Clothing Categories',
        type: 'multiselect',
        required: true,
        options: [
          'Men\'s Wear',
          'Women\'s Wear',
          'Children\'s Wear',
          'Beach Wear',
          'Sportswear',
          'Traditional Wear',
          'Accessories',
          'Shoes'
        ]
      },
      {
        name: 'specialties',
        label: 'Specialties',
        type: 'multiselect',
        required: true,
        options: [
          'Designer Brands',
          'Local Designs',
          'Custom Tailoring',
          'Plus Size',
          'Swimwear',
          'African Fashion',
          'Formal Wear'
        ]
      },
      {
        name: 'services',
        label: 'Additional Services',
        type: 'multiselect',
        required: true,
        options: [
          'Alterations',
          'Personal Shopping',
          'Custom Orders',
          'Delivery',
          'Gift Wrapping',
          'Layaway'
        ]
      },
      {
        name: 'operatingHours',
        label: 'Operating Hours',
        type: 'text',
        required: true,
        placeholder: 'e.g., Mon-Sat 9AM - 7PM'
      },
      {
        name: 'facilities',
        label: 'Facilities',
        type: 'multiselect',
        required: true,
        options: [
          'Fitting Rooms',
          'Air Conditioning',
          'Mirror Wall',
          'Card Payment',
          'Parking',
          'WiFi'
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
        name: 'shopPhotos',
        label: 'Shop Photos',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 10,
        description: 'Photos of your shop and displays'
      },
      {
        name: 'productCatalog',
        label: 'Product Catalog (Optional)',
        required: false,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 15,
        description: 'Catalog of your clothing collection'
      }
    ]
  },
  'Coffee Shop': {
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
        name: 'location',
        label: 'Shop Location',
        type: 'location',
        required: true,
        placeholder: 'Select location on map'
      },
      {
        name: 'beverages',
        label: 'Beverage Menu',
        type: 'multiselect',
        required: true,
        options: [
          'Espresso',
          'Cappuccino',
          'Latte',
          'Cold Brew',
          'Tea Selection',
          'Fresh Juices',
          'Smoothies',
          'Specialty Coffee'
        ]
      },
      {
        name: 'foodItems',
        label: 'Food Menu',
        type: 'multiselect',
        required: true,
        options: [
          'Pastries',
          'Sandwiches',
          'Cakes',
          'Breakfast Items',
          'Light Meals',
          'Vegan Options',
          'Gluten-free Options'
        ]
      },
      {
        name: 'facilities',
        label: 'Facilities',
        type: 'multiselect',
        required: true,
        options: [
          'Indoor Seating',
          'Outdoor Seating',
          'Air Conditioning',
          'WiFi',
          'Power Outlets',
          'Restrooms',
          'Parking'
        ]
      },
      {
        name: 'services',
        label: 'Additional Services',
        type: 'multiselect',
        required: true,
        options: [
          'Takeaway',
          'Delivery',
          'Event Catering',
          'Coffee Beans Retail',
          'Private Events',
          'Loyalty Program'
        ]
      },
      {
        name: 'operatingHours',
        label: 'Operating Hours',
        type: 'text',
        required: true,
        placeholder: 'e.g., Mon-Sun 7AM - 8PM'
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
        name: 'healthCertificate',
        label: 'Health Certificate',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 3,
        description: 'Food handling and health certification'
      },
      {
        name: 'menuPhotos',
        label: 'Menu & Product Photos',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 10,
        description: 'Photos of your menu items and products'
      },
      {
        name: 'cafePhotos',
        label: 'Café Photos',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 10,
        description: 'Photos of your café interior and exterior'
      }
    ]
  },
  'Computer Repairs': {
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
        name: 'location',
        label: 'Shop Location',
        type: 'location',
        required: true,
        placeholder: 'Select location on map'
      },
      {
        name: 'services',
        label: 'Services Offered',
        type: 'multiselect',
        required: true,
        options: [
          'Hardware Repairs',
          'Software Installation',
          'Virus Removal',
          'Data Recovery',
          'Network Setup',
          'Screen Replacement',
          'Laptop Repairs',
          'Desktop Repairs'
        ]
      },
      {
        name: 'specializations',
        label: 'Brand Specializations',
        type: 'multiselect',
        required: true,
        options: [
          'Apple',
          'Dell',
          'HP',
          'Lenovo',
          'Acer',
          'ASUS',
          'Samsung',
          'All Brands'
        ]
      },
      {
        name: 'additionalServices',
        label: 'Additional Services',
        type: 'multiselect',
        required: true,
        options: [
          'On-site Service',
          'Remote Support',
          'Parts Sales',
          'Maintenance Plans',
          'IT Consulting',
          'Training'
        ]
      },
      {
        name: 'operatingHours',
        label: 'Operating Hours',
        type: 'text',
        required: true,
        placeholder: 'e.g., Mon-Sat 9AM - 6PM'
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
        name: 'technicalCertifications',
        label: 'Technical Certifications',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 10,
        description: 'Relevant technical certifications'
      },
      {
        name: 'workshopPhotos',
        label: 'Workshop Photos',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 10,
        description: 'Photos of your repair facility'
      }
    ]
  },
  'Construction Services': {
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
        name: 'location',
        label: 'Office Location',
        type: 'location',
        required: true,
        placeholder: 'Select location on map'
      },
      {
        name: 'services',
        label: 'Services Offered',
        type: 'multiselect',
        required: true,
        options: [
          'New Construction',
          'Renovations',
          'Home Extensions',
          'Commercial Buildings',
          'Interior Finishing',
          'Roofing',
          'Foundation Work',
          'Project Management'
        ]
      },
      {
        name: 'specializations',
        label: 'Specializations',
        type: 'multiselect',
        required: true,
        options: [
          'Residential',
          'Commercial',
          'Industrial',
          'Beach Properties',
          'Eco-friendly Construction',
          'Luxury Homes',
          'Hotels & Resorts'
        ]
      },
      {
        name: 'equipment',
        label: 'Available Equipment',
        type: 'multiselect',
        required: true,
        options: [
          'Heavy Machinery',
          'Concrete Equipment',
          'Scaffolding',
          'Power Tools',
          'Transport Vehicles',
          'Safety Equipment'
        ]
      },
      {
        name: 'operatingHours',
        label: 'Operating Hours',
        type: 'text',
        required: true,
        placeholder: 'e.g., Mon-Sat 8AM - 5PM'
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
        name: 'contractorLicense',
        label: 'Contractor License',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 3,
        description: 'Valid contractor license'
      },
      {
        name: 'insuranceCertificates',
        label: 'Insurance Certificates',
        required: true,
        accept: '.pdf',
        maxSize: 5,
        description: 'Liability and workers compensation insurance'
      },
      {
        name: 'safetyCompliance',
        label: 'Safety Compliance',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 3,
        description: 'Safety certifications and compliance documents'
      },
      {
        name: 'projectPhotos',
        label: 'Project Portfolio',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 15,
        description: 'Photos of completed projects'
      }
    ]
  },
  'Courier Services': {
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
        name: 'location',
        label: 'Office Location',
        type: 'location',
        required: true,
        placeholder: 'Select location on map'
      },
      {
        name: 'services',
        label: 'Services Offered',
        type: 'multiselect',
        required: true,
        options: [
          'Local Delivery',
          'National Delivery',
          'International Shipping',
          'Express Delivery',
          'Same Day Delivery',
          'Document Delivery',
          'Package Delivery',
          'Bulk Shipping'
        ]
      },
      {
        name: 'deliveryTypes',
        label: 'Delivery Types',
        type: 'multiselect',
        required: true,
        options: [
          'Motorcycle',
          'Car',
          'Van',
          'Truck',
          'Bicycle'
        ]
      },
      {
        name: 'serviceAreas',
        label: 'Service Areas',
        type: 'multiselect',
        required: true,
        options: [
          'Diani Area',
          'South Coast',
          'Mombasa',
          'Nairobi',
          'Nationwide',
          'International'
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
        name: 'transportLicenses',
        label: 'Transport Licenses',
        required: true,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 5,
        description: 'Vehicle and transport licenses'
      },
      {
        name: 'insuranceCertificates',
        label: 'Insurance Certificates',
        required: true,
        accept: '.pdf',
        maxSize: 3,
        description: 'Cargo and liability insurance'
      },
      {
        name: 'vehiclePhotos',
        label: 'Vehicle Photos',
        required: true,
        accept: '.jpg,.jpeg,.png',
        maxSize: 10,
        description: 'Photos of your delivery vehicles'
      }
    ]
  }
};