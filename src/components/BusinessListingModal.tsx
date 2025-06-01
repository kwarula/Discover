import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Building2, Search, ArrowLeft } from 'lucide-react';
import { businessCategories } from '@/data/businessCategories';
import { useAppContext } from '@/contexts/AppContext';
import { CategoryFields, BusinessListing, Field, DocumentField } from '@/types/business';
import { categoryFields } from '@/data/categoryFields';
import { FileUpload } from '@/components/FileUpload';
import { LocationPicker } from '@/components/LocationPicker';
import { cn } from '@/lib/utils';

interface BusinessListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormStep = 'category' | 'contact' | 'business' | 'documents' | 'confirm';

interface BusinessListingFormState {
  email: string;
  firstName: string;
  lastName: string;
  selectedBusinessCategory: string;
  position: string;
  businessDetails: {
    [key: string]: any;
  };
  uploadedDocuments: {
    [key: string]: File | null;
  };
}

export const BusinessListingModal: React.FC<BusinessListingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isLoggedIn, userProfile } = useAppContext();
  const [currentStep, setCurrentStep] = useState<FormStep>('category');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [formData, setFormData] = useState<BusinessListingFormState>({
    email: '',
    firstName: '',
    lastName: '',
    selectedBusinessCategory: '',
    position: 'Owner',
    businessDetails: {},
    uploadedDocuments: {},
  });

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('category');
      setCategorySearch('');
      if (isLoggedIn && userProfile) {
        const [firstName = '', lastName = ''] = userProfile.username.split(' ');
        setFormData(prev => ({
          ...prev,
          firstName,
          lastName,
        }));
      }
    }
  }, [isOpen, isLoggedIn, userProfile]);

  const filteredCategories = categorySearch
    ? businessCategories.filter(cat => 
        cat.toLowerCase().includes(categorySearch.toLowerCase())
      )
    : businessCategories;

  const handleCategorySelect = (category: string) => {
    setFormData(prev => ({ ...prev, selectedBusinessCategory: category }));
    setCategorySearch('');
    setCurrentStep(isLoggedIn ? 'business' : 'contact');
  };

  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      businessDetails: {
        ...prev.businessDetails,
        [name]: value
      }
    }));
  };

  const handleMultiSelectToggle = (fieldName: string, option: string) => {
    setFormData(prev => {
      const currentValues = prev.businessDetails[fieldName] || [];
      const newValues = currentValues.includes(option)
        ? currentValues.filter(v => v !== option)
        : [...currentValues, option];
      
      return {
        ...prev,
        businessDetails: {
          ...prev.businessDetails,
          [fieldName]: newValues
        }
      };
    });
  };

  const handleDocumentChange = (docName: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      uploadedDocuments: {
        ...prev.uploadedDocuments,
        [docName]: file
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 'contact') {
      if (!formData.email || !formData.firstName || !formData.lastName) {
        toast({
          title: "All fields required",
          description: "Please fill in all the fields to continue.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep('business');
      return;
    }

    if (currentStep === 'business') {
      if (!formData.selectedBusinessCategory || !formData.position) {
        toast({
          title: "All fields required",
          description: "Please select both category and position.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep('documents');
      return;
    }

    if (currentStep === 'documents') {
      setCurrentStep('confirm');
      return;
    }

    // Final submission
    setIsSubmitting(true);
    try {
      const businessListing: BusinessListing = {
        category: formData.selectedBusinessCategory,
        contactInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.businessDetails.phoneNumber || '',
          whatsappNumber: formData.businessDetails.whatsappNumber,
        },
        businessInfo: {
          ...formData.businessDetails,
        },
        documents: formData.uploadedDocuments,
        verificationStatus: 'pending',
        submittedAt: new Date(),
      };

      // Send to webhook
      const response = await fetch('https://n8n.zaidicreatorlab.com/webhook-test/add-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessListing),
      });

      if (!response.ok) {
        throw new Error('Failed to submit listing');
      }

      toast({
        title: "Submission successful!",
        description: "We'll review your listing and contact you soon.",
      });
      onClose();
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        selectedBusinessCategory: '',
        position: 'Owner',
        businessDetails: {},
        uploadedDocuments: {},
      });
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCategoryFields = (category: string) => {
    const fields = categoryFields[category]?.fields || [];
    
    return (
      <div className="space-y-4">
        {fields.map((field: Field) => {
          switch (field.type) {
            case 'select':
              return (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Select
                    value={formData.businessDetails[field.name] || ''}
                    onValueChange={(value) => handleFieldChange(field.name, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
              
            case 'multiselect':
              return (
                <div key={field.name} className="space-y-2">
                  <Label>{field.label}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {field.options?.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleMultiSelectToggle(field.name, option)}
                        className={cn(
                          "px-3 py-2 text-sm rounded-lg border transition-all duration-200",
                          formData.businessDetails[field.name]?.includes(option)
                            ? "bg-diani-teal-500 text-white border-diani-teal-500"
                            : "bg-white text-diani-sand-700 border-diani-sand-300 hover:border-diani-teal-500"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              );

            case 'location':
              return (
                <div key={field.name} className="space-y-2">
                  <Label>{field.label}</Label>
                  <LocationPicker
                    value={formData.businessDetails.location}
                    onChange={(location) => handleFieldChange('location', location)}
                    required={field.required}
                  />
                </div>
              );

            default:
              return (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    type={field.type}
                    value={formData.businessDetails[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                </div>
              );
          }
        })}
      </div>
    );
  };

  const renderDocumentFields = (category: string) => {
    const documents = categoryFields[category]?.documents || [];
    
    return (
      <div className="space-y-4">
        {documents.map((doc: DocumentField) => (
          <div key={doc.name} className="space-y-2">
            <Label htmlFor={doc.name}>{doc.label}</Label>
            <FileUpload
              id={doc.name}
              accept={doc.accept}
              maxSize={doc.maxSize}
              required={doc.required}
              description={doc.description}
              value={formData.uploadedDocuments[doc.name]}
              onChange={(file) => handleDocumentChange(doc.name, file)}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'category':
        return (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-diani-sand-400" />
              <Input
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search business categories..."
                className="pl-9"
                autoFocus
              />
            </div>
            <div className="max-h-[50vh] overflow-y-auto space-y-1 rounded-lg">
              {filteredCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className="w-full text-left px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-diani-sand-100 focus:outline-none focus:ring-2 focus:ring-diani-teal-500"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
              />
            </div>
          </div>
        );

      case 'business':
        return (
          <div className="space-y-6">
            <div className="bg-diani-teal-50 px-4 py-3 rounded-lg">
              <div className="text-xs text-diani-teal-600">Selected Category</div>
              <div className="text-diani-teal-700 font-medium">{formData.selectedBusinessCategory}</div>
            </div>
            
            {renderCategoryFields(formData.selectedBusinessCategory)}
          </div>
        );
        
      case 'documents':
        return (
          <div className="space-y-6">
            <div className="bg-diani-sand-50 rounded-lg p-4">
              <h4 className="font-medium text-diani-sand-900 mb-2">Required Documents</h4>
              <p className="text-sm text-diani-sand-600">
                Please provide clear, readable copies of all required documents.
              </p>
            </div>
            
            {renderDocumentFields(formData.selectedBusinessCategory)}
          </div>
        );

      case 'confirm':
        return (
          <div className="space-y-4">
            <div className="bg-diani-sand-50 rounded-xl p-4 space-y-3">
              <h4 className="font-medium text-diani-sand-900">Review Your Information</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-diani-sand-600">Name:</span> {formData.firstName} {formData.lastName}</p>
                <p><span className="text-diani-sand-600">Email:</span> {formData.email}</p>
                <p><span className="text-diani-sand-600">Business Category:</span> {formData.selectedBusinessCategory}</p>
                <p><span className="text-diani-sand-600">Position:</span> {formData.position}</p>
              </div>
            </div>
            <div className="bg-diani-teal-50 rounded-xl p-4 space-y-2">
              <h4 className="font-medium text-diani-teal-700">Next Steps:</h4>
              <ul className="text-sm text-diani-teal-600 space-y-1">
                <li>• Our team will review your submission</li>
                <li>• You'll receive setup instructions via email</li>
                <li>• Premium listing features will be available</li>
              </ul>
            </div>
          </div>
        );
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'category':
        return 'Choose Your Business Category';
      case 'contact':
        return 'Your Contact Information';
      case 'business':
        return 'Business Details';
      case 'documents':
        return 'Upload Documents';
      case 'confirm':
        return 'Review & Submit';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] mx-auto bg-white rounded-3xl p-4 sm:p-6 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-diani-teal-500" />
            {getStepTitle()}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-1 py-4 space-y-6 custom-scrollbar">
            {renderStep()}
          </div>

          <div className="flex-shrink-0 flex flex-col gap-3 pt-4 mt-auto border-t border-gray-100">
            {currentStep !== 'category' && (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-diani-teal-500 to-diani-teal-600 hover:from-diani-teal-600 hover:to-diani-teal-700 text-white rounded-full py-2.5 sm:py-3 font-medium transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Processing...</span>
                  </div>
                ) : currentStep === 'confirm' ? (
                  'Submit Listing'
                ) : (
                  'Continue'
                )}
              </Button>
            )}

            {currentStep !== 'category' && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setCurrentStep(prev => {
                  if (prev === 'confirm') return 'documents';
                  if (prev === 'documents') return 'business';
                  if (prev === 'business') return isLoggedIn ? 'category' : 'contact';
                  return 'category';
                })}
                className="text-diani-sand-600 hover:text-diani-teal-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};