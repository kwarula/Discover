import { CategoryFields } from '@/types/business';

export const categoryFields: CategoryFields = {
  "Gas Supplier": {
    fields: [
      {
        name: "businessName",
        label: "Business Name",
        type: "text",
        required: true,
        placeholder: "Enter your business name"
      },
      {
        name: "registrationNumber",
        label: "Business Registration Number",
        type: "text",
        required: true,
        placeholder: "Enter registration number"
      },
      {
        name: "location",
        label: "Business Location",
        type: "location",
        required: true
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        type: "tel",
        required: true,
        placeholder: "+254 XXX XXX XXX"
      },
      {
        name: "whatsappNumber",
        label: "WhatsApp Number (Optional)",
        type: "tel",
        required: false,
        placeholder: "+254 XXX XXX XXX"
      },
      {
        name: "operatingHours",
        label: "Operating Hours",
        type: "text",
        required: true,
        placeholder: "e.g., Mon-Sat: 8AM-6PM"
      },
      {
        name: "gasTypes",
        label: "Types of Gas Available",
        type: "multiselect",
        required: true,
        options: [
          "LPG",
          "Natural Gas",
          "Industrial Gas",
          "Medical Gas",
          "Cooking Gas"
        ]
      },
      {
        name: "cylinderSizes",
        label: "Cylinder Sizes Available",
        type: "multiselect",
        required: true,
        options: [
          "6kg",
          "13kg",
          "22.5kg",
          "50kg",
          "Industrial Size"
        ]
      },
      {
        name: "services",
        label: "Services Offered",
        type: "multiselect",
        required: true,
        options: [
          "Gas Delivery",
          "Cylinder Exchange",
          "Installation",
          "Maintenance",
          "Emergency Refill",
          "Safety Inspection"
        ]
      },
      {
        name: "paymentMethods",
        label: "Accepted Payment Methods",
        type: "multiselect",
        required: true,
        options: [
          "Cash",
          "M-Pesa",
          "Bank Transfer",
          "Credit Card",
          "Debit Card"
        ]
      }
    ],
    documents: [
      {
        name: "businessLicense",
        label: "Business License",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload a valid business license"
      },
      {
        name: "energyRegulatoryLicense",
        label: "Energy Regulatory License",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload your ERC license"
      },
      {
        name: "safetyCompliance",
        label: "Safety Compliance Certificate",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload safety compliance documentation"
      },
      {
        name: "insuranceCertificate",
        label: "Insurance Certificate",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload business insurance certificate"
      }
    ]
  },

  "Gift Shop": {
    fields: [
      {
        name: "businessName",
        label: "Shop Name",
        type: "text",
        required: true,
        placeholder: "Enter your shop name"
      },
      {
        name: "registrationNumber",
        label: "Business Registration Number",
        type: "text",
        required: true,
        placeholder: "Enter registration number"
      },
      {
        name: "location",
        label: "Shop Location",
        type: "location",
        required: true
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        type: "tel",
        required: true,
        placeholder: "+254 XXX XXX XXX"
      },
      {
        name: "whatsappNumber",
        label: "WhatsApp Number (Optional)",
        type: "tel",
        required: false,
        placeholder: "+254 XXX XXX XXX"
      },
      {
        name: "operatingHours",
        label: "Operating Hours",
        type: "text",
        required: true,
        placeholder: "e.g., Mon-Sun: 9AM-7PM"
      },
      {
        name: "productCategories",
        label: "Product Categories",
        type: "multiselect",
        required: true,
        options: [
          "Local Crafts",
          "Souvenirs",
          "Beach Accessories",
          "Home Decor",
          "Jewelry",
          "Art & Paintings",
          "Traditional Items",
          "Fashion Accessories"
        ]
      },
      {
        name: "specialServices",
        label: "Special Services",
        type: "multiselect",
        required: false,
        options: [
          "Gift Wrapping",
          "Custom Orders",
          "Shipping",
          "Corporate Gifts",
          "Personalization",
          "Gift Cards"
        ]
      },
      {
        name: "priceRange",
        label: "Price Range",
        type: "select",
        required: true,
        options: [
          "Budget (Under 1000 KES)",
          "Mid-range (1000-5000 KES)",
          "Premium (5000+ KES)"
        ]
      },
      {
        name: "paymentMethods",
        label: "Accepted Payment Methods",
        type: "multiselect",
        required: true,
        options: [
          "Cash",
          "M-Pesa",
          "Bank Transfer",
          "Credit Card",
          "Debit Card"
        ]
      }
    ],
    documents: [
      {
        name: "businessLicense",
        label: "Business License",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload a valid business license"
      },
      {
        name: "taxCompliance",
        label: "Tax Compliance Certificate",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload current tax compliance certificate"
      }
    ]
  },

  "Grocery Store": {
    fields: [
      {
        name: "businessName",
        label: "Store Name",
        type: "text",
        required: true,
        placeholder: "Enter your store name"
      },
      {
        name: "registrationNumber",
        label: "Business Registration Number",
        type: "text",
        required: true,
        placeholder: "Enter registration number"
      },
      {
        name: "location",
        label: "Store Location",
        type: "location",
        required: true
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        type: "tel",
        required: true,
        placeholder: "+254 XXX XXX XXX"
      },
      {
        name: "whatsappNumber",
        label: "WhatsApp Number (Optional)",
        type: "tel",
        required: false,
        placeholder: "+254 XXX XXX XXX"
      },
      {
        name: "operatingHours",
        label: "Operating Hours",
        type: "text",
        required: true,
        placeholder: "e.g., Mon-Sun: 7AM-9PM"
      },
      {
        name: "storeType",
        label: "Store Type",
        type: "select",
        required: true,
        options: [
          "Mini Market",
          "Convenience Store",
          "Specialty Grocery",
          "Organic Store",
          "General Store"
        ]
      },
      {
        name: "productCategories",
        label: "Product Categories",
        type: "multiselect",
        required: true,
        options: [
          "Fresh Produce",
          "Dairy & Eggs",
          "Meat & Seafood",
          "Bakery",
          "Beverages",
          "Snacks",
          "Household Items",
          "Personal Care",
          "Baby Products",
          "Pet Supplies"
        ]
      },
      {
        name: "specialFeatures",
        label: "Special Features",
        type: "multiselect",
        required: false,
        options: [
          "Home Delivery",
          "Fresh Food Counter",
          "Organic Section",
          "International Products",
          "Bulk Shopping",
          "Ready-to-eat Meals"
        ]
      },
      {
        name: "paymentMethods",
        label: "Accepted Payment Methods",
        type: "multiselect",
        required: true,
        options: [
          "Cash",
          "M-Pesa",
          "Bank Transfer",
          "Credit Card",
          "Debit Card"
        ]
      }
    ],
    documents: [
      {
        name: "businessLicense",
        label: "Business License",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload a valid business license"
      },
      {
        name: "healthCertificate",
        label: "Health Certificate",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload current health inspection certificate"
      },
      {
        name: "foodHandlingLicense",
        label: "Food Handling License",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload food handling license"
      },
      {
        name: "taxCompliance",
        label: "Tax Compliance Certificate",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload current tax compliance certificate"
      }
    ]
  },

  "Guest House": {
    fields: [
      {
        name: "businessName",
        label: "Guest House Name",
        type: "text",
        required: true,
        placeholder: "Enter your guest house name"
      },
      {
        name: "registrationNumber",
        label: "Business Registration Number",
        type: "text",
        required: true,
        placeholder: "Enter registration number"
      },
      {
        name: "location",
        label: "Property Location",
        type: "location",
        required: true
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        type: "tel",
        required: true,
        placeholder: "+254 XXX XXX XXX"
      },
      {
        name: "whatsappNumber",
        label: "WhatsApp Number (Optional)",
        type: "tel",
        required: false,
        placeholder: "+254 XXX XXX XXX"
      },
      {
        name: "numberOfRooms",
        label: "Number of Rooms",
        type: "number",
        required: true,
        placeholder: "Enter total number of rooms"
      },
      {
        name: "roomTypes",
        label: "Room Types Available",
        type: "multiselect",
        required: true,
        options: [
          "Single Room",
          "Double Room",
          "Twin Room",
          "Family Room",
          "Suite",
          "Dormitory"
        ]
      },
      {
        name: "facilities",
        label: "Facilities & Amenities",
        type: "multiselect",
        required: true,
        options: [
          "Free Wi-Fi",
          "Air Conditioning",
          "Hot Water",
          "TV",
          "Kitchen Access",
          "Parking",
          "Garden",
          "Security",
          "Laundry Service",
          "Airport Pickup"
        ]
      },
      {
        name: "mealOptions",
        label: "Meal Options",
        type: "multiselect",
        required: false,
        options: [
          "Breakfast Included",
          "Lunch Available",
          "Dinner Available",
          "Self-catering",
          "Special Diet Options"
        ]
      },
      {
        name: "priceRange",
        label: "Price Range (Per Night)",
        type: "select",
        required: true,
        options: [
          "Budget (Under 3000 KES)",
          "Mid-range (3000-7000 KES)",
          "Premium (7000+ KES)"
        ]
      },
      {
        name: "checkInOut",
        label: "Check-in/Check-out Times",
        type: "text",
        required: true,
        placeholder: "e.g., Check-in: 2PM, Check-out: 11AM"
      }
    ],
    documents: [
      {
        name: "businessLicense",
        label: "Business License",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload a valid business license"
      },
      {
        name: "tourismLicense",
        label: "Tourism Regulatory Authority License",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload your TRA license"
      },
      {
        name: "fireInspection",
        label: "Fire Safety Certificate",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload current fire safety certificate"
      },
      {
        name: "healthCertificate",
        label: "Public Health Certificate",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload health inspection certificate"
      }
    ]
  },

  "Hair Salon": {
    fields: [
      {
        name: "businessName",
        label: "Salon Name",
        type: "text",
        required: true,
        placeholder: "Enter your salon name"
      },
      {
        name: "registrationNumber",
        label: "Business Registration Number",
        type: "text",
        required: true,
        placeholder: "Enter registration number"
      },
      {
        name: "location",
        label: "Salon Location",
        type: "location",
        required: true
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        type: "tel",
        required: true,
        placeholder: "+254 XXX XXX XXX"
      },
      {
        name: "whatsappNumber",
        label: "WhatsApp Number (Optional)",
        type: "tel",
        required: false,
        placeholder: "+254 XXX XXX XXX"
      },
      {
        name: "operatingHours",
        label: "Operating Hours",
        type: "text",
        required: true,
        placeholder: "e.g., Mon-Sun: 9AM-7PM"
      },
      {
        name: "services",
        label: "Services Offered",
        type: "multiselect",
        required: true,
        options: [
          "Haircut",
          "Hair Coloring",
          "Hair Treatment",
          "Braiding",
          "Weaving",
          "Dreadlocks",
          "Manicure",
          "Pedicure",
          "Facial",
          "Makeup",
          "Massage",
          "Waxing"
        ]
      },
      {
        name: "specialties",
        label: "Specialties",
        type: "multiselect",
        required: false,
        options: [
          "Natural Hair",
          "Wedding Services",
          "Kids Hair",
          "Men's Grooming",
          "Hair Extensions",
          "Ethnic Hair"
        ]
      },
      {
        name: "facilities",
        label: "Salon Facilities",
        type: "multiselect",
        required: true,
        options: [
          "Air Conditioning",
          "Wi-Fi",
          "TV",
          "Waiting Area",
          "Refreshments",
          "Parking"
        ]
      },
      {
        name: "paymentMethods",
        label: "Accepted Payment Methods",
        type: "multiselect",
        required: true,
        options: [
          "Cash",
          "M-Pesa",
          "Bank Transfer",
          "Credit Card",
          "Debit Card"
        ]
      }
    ],
    documents: [
      {
        name: "businessLicense",
        label: "Business License",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload a valid business license"
      },
      {
        name: "healthCertificate",
        label: "Health Certificate",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload current health certificate"
      },
      {
        name: "staffCertifications",
        label: "Staff Certifications",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload beautician/stylist certifications"
      }
    ]
  },

  "Hardware Shop": {
    fields: [
      {
        name: "businessName",
        label: "Shop Name",
        type: "text",
        required: true,
        placeholder: "Enter your shop name"
      },
      {
        name: "registrationNumber",
        label: "Business Registration Number",
        type: "text",
        required: true,
        placeholder: "Enter registration number"
      },
      {
        name: "location",
        label: "Shop Location",
        type: "location",
        required: true
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        type: "tel",
        required: true,
        placeholder: "+254 XXX XXX XXX"
      },
      {
        name: "whatsappNumber",
        label: "WhatsApp Number (Optional)",
        type: "tel",
        required: false,
        placeholder: "+254 XXX XXX XXX"
      },
      {
        name: "operatingHours",
        label: "Operating Hours",
        type: "text",
        required: true,
        placeholder: "e.g., Mon-Sat: 8AM-6PM"
      },
      {
        name: "productCategories",
        label: "Product Categories",
        type: "multiselect",
        required: true,
        options: [
          "Building Materials",
          "Tools",
          "Plumbing",
          "Electrical",
          "Paint & Supplies",
          "Garden & Outdoor",
          "Safety Equipment",
          "Locks & Security",
          "Bathroom Fixtures",
          "Kitchen Hardware"
        ]
      },
      {
        name: "services",
        label: "Additional Services",
        type: "multiselect",
        required: false,
        options: [
          "Delivery",
          "Installation",
          "Tool Rental",
          "Paint Mixing",
          "Key Cutting",
          "Custom Orders",
          "Technical Advice"
        ]
      },
      {
        name: "specialFeatures",
        label: "Special Features",
        type: "multiselect",
        required: false,
        options: [
          "Bulk Pricing",
          "Trade Accounts",
          "Expert Staff",
          "Product Demonstrations",
          "Order Tracking",
          "Returns Accepted"
        ]
      },
      {
        name: "paymentMethods",
        label: "Accepted Payment Methods",
        type: "multiselect",
        required: true,
        options: [
          "Cash",
          "M-Pesa",
          "Bank Transfer",
          "Credit Card",
          "Debit Card",
          "Purchase Order"
        ]
      }
    ],
    documents: [
      {
        name: "businessLicense",
        label: "Business License",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload a valid business license"
      },
      {
        name: "taxCompliance",
        label: "Tax Compliance Certificate",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload current tax compliance certificate"
      },
      {
        name: "insuranceCertificate",
        label: "Insurance Certificate",
        required: true,
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSize: 5,
        description: "Upload business insurance certificate"
      }
    ]
  }
};