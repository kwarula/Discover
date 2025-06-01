import { CategoryFields } from '@/types/business';

export const categoryFields: CategoryFields = {
  // Previous categories...

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
  }
};