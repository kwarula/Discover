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
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Building2, Search, ArrowLeft, AlertCircle } from 'lucide-react';
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

interface FormErrors {
  [key: string]: string;
}

export const BusinessListingModal: React.FC<BusinessListingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isLoggedIn, userProfile } = useAppContext();
  const [currentStep, setCurrentStep] = useState<FormStep>('category');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const initialFormData: BusinessListingFormState = {
    email: '',
    firstName: '',
    lastName: '',
    selectedBusinessCategory: '',
    position: 'Owner',
    businessDetails: {},
    uploadedDocuments: {},
  };
  const [formData, setFormData] = useState<BusinessListingFormState>(initialFormData);

  const resetForm = () => {
    setFormErrors({});
    setCurrentStep('category');
    setCategorySearch('');
    let newFormData = { ...initialFormData };
    if (isLoggedIn && userProfile) {
      const [firstName = '', lastName = ''] = userProfile.username ? userProfile.username.split(' ') : ['', ''];
      newFormData = {
        ...newFormData,
        email: userProfile.email || '',
        firstName,
        lastName,
      };
    }
    setFormData(newFormData);
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isLoggedIn, userProfile]); // Added isLoggedIn & userProfile because resetForm depends on them

  const filteredCategories = categorySearch
    ? businessCategories.filter(cat => 
        cat.toLowerCase().includes(categorySearch.toLowerCase())
      )
    : businessCategories;

  const handleCategorySelect = (category: string) => {
    setFormData(prev => ({
      ...prev,
      selectedBusinessCategory: category,
      businessDetails: {},
      uploadedDocuments: {}
    }));
    setFormErrors({});
    setCategorySearch('');
    setCurrentStep(isLoggedIn ? 'business' : 'contact');
  };

  const handleInputChange = (step: 'contact' | 'business', fieldName: string, value: any) => {
    if (step === 'contact') {
      setFormData(prev => ({ ...prev, [fieldName]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        businessDetails: { ...prev.businessDetails, [fieldName]: value },
      }));
    }
    if (formErrors[fieldName]) {
      setFormErrors(prev => { const newErrors = { ...prev }; delete newErrors[fieldName]; return newErrors; });
    }
  };

  const handleMultiSelectToggle = (fieldName: string, option: string) => {
    setFormData(prev => {
      const currentValues = prev.businessDetails[fieldName] || [];
      const newValues = currentValues.includes(option)
        ? currentValues.filter((v: string) => v !== option)
        : [...currentValues, option];
      return { ...prev, businessDetails: { ...prev.businessDetails, [fieldName]: newValues }};
    });
    if (formErrors[fieldName]) {
      setFormErrors(prev => { const newErrors = { ...prev }; delete newErrors[fieldName]; return newErrors; });
    }
  };

  const handleDocumentChange = (docName: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      uploadedDocuments: { ...prev.uploadedDocuments, [docName]: file }
    }));
    if (formErrors[docName]) {
      setFormErrors(prev => { const newErrors = { ...prev }; delete newErrors[docName]; return newErrors; });
    }
  };

  const validateField = (fieldConfig: Field | DocumentField, value: any): string => {
    if (fieldConfig.required && (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0))) {
      return `${fieldConfig.label} is required.`;
    }
    if (value === undefined || value === null || value === '') return '';
    if ('type' in fieldConfig) {
        const f = fieldConfig as Field;
        switch (f.type) {
        case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return `Invalid email format for ${f.label}.`;
            break;
        case 'tel':
            if (!/^[0-9\s+\-()]*$/.test(value)) return `Invalid phone number format for ${f.label}.`;
            if (f.validation?.pattern && !new RegExp(f.validation.pattern).test(value)) return f.validation.message || `Invalid format for ${f.label}.`;
            break;
        case 'number':
            if (isNaN(Number(value))) return `${f.label} must be a number.`;
            if (f.validation?.min !== undefined && Number(value) < f.validation.min) return `${f.label} must be at least ${f.validation.min}.`;
            if (f.validation?.max !== undefined && Number(value) > f.validation.max) return `${f.label} must be no more than ${f.validation.max}.`;
            break;
        case 'text': case 'textarea':
            if (f.validation?.min !== undefined && String(value).length < f.validation.min) return `${f.label} must be at least ${f.validation.min} characters.`;
            if (f.validation?.max !== undefined && String(value).length > f.validation.max) return `${f.label} must be no more than ${f.validation.max} characters.`;
            if (f.validation?.pattern && !new RegExp(f.validation.pattern).test(value)) return f.validation.message || `Invalid format for ${f.label}.`;
            break;
        }
    }
    return '';
  };

  const validateStep = (): boolean => {
    const errors: FormErrors = {};
    if (currentStep === 'contact') {
      (['firstName', 'lastName', 'email'] as const).forEach(key => {
        const cfg = { name: key, label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), type: key === 'email' ? 'email' : 'text', required: true } as Field;
        const error = validateField(cfg, formData[key]);
        if (error) errors[key] = error;
      });
    } else if (currentStep === 'business') {
      (categoryFields[formData.selectedBusinessCategory]?.fields || []).forEach(field => {
        const error = validateField(field, formData.businessDetails[field.name]);
        if (error) errors[field.name] = error;
      });
    } else if (currentStep === 'documents') {
      (categoryFields[formData.selectedBusinessCategory]?.documents || []).forEach(docField => {
        const error = validateField(docField, formData.uploadedDocuments[docField.name]);
        if (error) errors[docField.name] = error;
      });
    }
    setFormErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    if (!isValid) toast({ title: "Validation Errors", description: "Please correct the errors.", variant: "destructive" });
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    if (currentStep === 'contact') setCurrentStep('business');
    else if (currentStep === 'business') setCurrentStep('documents');
    else if (currentStep === 'documents') setCurrentStep('confirm');
    else if (currentStep === 'confirm') {
      setIsSubmitting(true);
      try {
        const documentMetadata: { [key: string]: any } = {};
        Object.entries(formData.uploadedDocuments).forEach(([key, file]) => {
          if (file instanceof File) documentMetadata[key] = { name: file.name, type: file.type, size: file.size };
          else documentMetadata[key] = null;
        });

        const businessListingPayload = {
          category: formData.selectedBusinessCategory,
          contactInfo: { firstName: formData.firstName, lastName: formData.lastName, email: formData.email, phoneNumber: formData.businessDetails.phoneNumber || '', whatsappNumber: formData.businessDetails.whatsappNumber },
          businessInfo: { ...formData.businessDetails, name: formData.businessDetails.businessName || formData.businessDetails.name || 'N/A', category: formData.selectedBusinessCategory, position: formData.position },
          documents: documentMetadata,
          verificationStatus: 'pending',
          submittedAt: new Date().toISOString(),
        };

        const webhookUrl = "https://hook.eu2.make.com/tw7lu3g6xku7y5kqt30yxpf27gj8vlud";
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(businessListingPayload),
        });

        if (!response.ok) {
          let errorBody = 'Webhook error'; try { errorBody = await response.text(); } catch (_) {}
          throw new Error(`Webhook: ${response.status} ${response.statusText}. ${errorBody}`);
        }

        toast({ title: "Submission Successful!", description: "Your listing is sent for review." });
        resetForm();
        onClose();
      } catch (error) {
        console.error("Submission error:", error);
        toast({ title: "Submission Failed", description: error instanceof Error ? error.message : "Unknown error.", variant: "destructive" });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderCategoryFields = (category: string) => {
    const fields = categoryFields[category]?.fields || [];
    return (
      <div className="space-y-4">
        {fields.map((field: Field) => {
          const error = formErrors[field.name];
          const errorId = `${field.name}-error`;
          return (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className={error ? 'text-red-500' : ''}>{field.label}{field.required && "*"}</Label>
              { field.type === 'select' ? (
                  <Select value={formData.businessDetails[field.name] || ''} onValueChange={(value) => handleInputChange('business', field.name, value)}>
                    <SelectTrigger id={field.name} className={error ? 'border-red-500' : ''} aria-describedby={error ? errorId : undefined}>
                      <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>{field.options?.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                  </Select>
              ) : field.type === 'multiselect' ? (
                <>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${error ? 'border border-red-500 rounded-lg p-2' : ''}`} role="group" aria-labelledby={`${field.name}-label`}>
                     <Label id={`${field.name}-label`} className="sr-only">{field.label}</Label>
                    {field.options?.map(option => (
                      <button key={option} type="button" onClick={() => handleMultiSelectToggle(field.name, option)} aria-pressed={(formData.businessDetails[field.name] || []).includes(option)}
                        className={cn("px-3 py-2 text-sm rounded-lg border transition-all duration-200", (formData.businessDetails[field.name] || []).includes(option) ? "bg-diani-teal-500 text-white border-diani-teal-500" : "bg-white text-diani-sand-700 border-diani-sand-300 hover:border-diani-teal-500")}>
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              ) : field.type === 'location' ? (
                  <LocationPicker value={formData.businessDetails[field.name]} onChange={(loc) => handleInputChange('business', field.name, loc)} required={field.required} aria-describedby={error ? errorId : undefined} />
              ) : field.type === 'textarea' ? (
                  <Textarea id={field.name} value={formData.businessDetails[field.name] || ''} onChange={(e) => handleInputChange('business', field.name, e.target.value)} placeholder={field.placeholder} required={field.required} className={error ? 'border-red-500' : ''} aria-describedby={error ? errorId : undefined} />
              ) : (
                  <Input id={field.name} type={field.type} value={formData.businessDetails[field.name] || ''} onChange={(e) => handleInputChange('business', field.name, e.target.value)} placeholder={field.placeholder} required={field.required} className={error ? 'border-red-500' : ''} aria-describedby={error ? errorId : undefined} />
              )}
              {error && <p id={errorId} role="alert" className="text-sm text-red-500 flex items-center mt-1"><AlertCircle className="h-4 w-4 mr-1" /> {error}</p>}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDocumentFields = (category: string) => {
    const documents = categoryFields[category]?.documents || [];
    return (
      <div className="space-y-4">
        {documents.map((doc: DocumentField) => {
          const error = formErrors[doc.name];
          const errorId = `${doc.name}-error`;
          return (
            <div key={doc.name} className="space-y-2">
              <Label htmlFor={doc.name} className={error ? 'text-red-500' : ''}>{doc.label}{doc.required && "*"}</Label>
              <FileUpload id={doc.name} accept={doc.accept} maxSize={doc.maxSize} required={doc.required} description={doc.description} value={formData.uploadedDocuments[doc.name]} onChange={(file) => handleDocumentChange(doc.name, file)} className={error ? 'border-red-500' : ''} aria-describedby={error ? errorId : undefined} />
              {error && <p id={errorId} role="alert" className="text-sm text-red-500 flex items-center mt-1"><AlertCircle className="h-4 w-4 mr-1" /> {error}</p>}
            </div>
          );
        })}
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'category':
        return (
          <div className="space-y-4">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-diani-sand-400" /><Input value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)} placeholder="Search business categories..." className="pl-9" autoFocus /></div>
            <div className="max-h-[50vh] overflow-y-auto space-y-1 rounded-lg custom-scrollbar">{filteredCategories.map(c => <button key={c} type="button" onClick={() => handleCategorySelect(c)} className="w-full text-left px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-diani-sand-100 focus:outline-none focus:ring-2 focus:ring-diani-teal-500">{c}</button>)}</div>
          </div>);
      case 'contact':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label htmlFor="firstName" className={formErrors.firstName ? 'text-red-500' : ''}>First Name*</Label><Input id="firstName" value={formData.firstName} onChange={e => handleInputChange('contact', 'firstName', e.target.value)} placeholder="John" className={formErrors.firstName ? 'border-red-500' : ''} aria-describedby={formErrors.firstName ? 'firstName-error' : undefined} />{formErrors.firstName && <p id="firstName-error" role="alert" className="text-sm text-red-500 flex items-center mt-1"><AlertCircle className="h-4 w-4 mr-1" />{formErrors.firstName}</p>}</div>
              <div><Label htmlFor="lastName" className={formErrors.lastName ? 'text-red-500' : ''}>Last Name*</Label><Input id="lastName" value={formData.lastName} onChange={e => handleInputChange('contact', 'lastName', e.target.value)} placeholder="Doe" className={formErrors.lastName ? 'border-red-500' : ''} aria-describedby={formErrors.lastName ? 'lastName-error' : undefined} />{formErrors.lastName && <p id="lastName-error" role="alert" className="text-sm text-red-500 flex items-center mt-1"><AlertCircle className="h-4 w-4 mr-1" />{formErrors.lastName}</p>}</div>
            </div>
            <div><Label htmlFor="email" className={formErrors.email ? 'text-red-500' : ''}>Email Address*</Label><Input id="email" type="email" value={formData.email} onChange={e => handleInputChange('contact', 'email', e.target.value)} placeholder="your@email.com" className={formErrors.email ? 'border-red-500' : ''} aria-describedby={formErrors.email ? 'email-error' : undefined} />{formErrors.email && <p id="email-error" role="alert" className="text-sm text-red-500 flex items-center mt-1"><AlertCircle className="h-4 w-4 mr-1" />{formErrors.email}</p>}</div>
          </div>);
      case 'business':
        return (<div className="space-y-6"><div className="bg-diani-teal-50 px-4 py-3 rounded-lg"><div className="text-xs text-diani-teal-600">Selected Category</div><div className="text-diani-teal-700 font-medium">{formData.selectedBusinessCategory}</div></div>{renderCategoryFields(formData.selectedBusinessCategory)}</div>);
      case 'documents':
        return (<div className="space-y-6"><div className="bg-diani-sand-50 rounded-lg p-4"><h4 className="font-medium text-diani-sand-900 mb-2">Required Documents</h4><p className="text-sm text-diani-sand-600">Please provide clear, readable copies of all required documents. File types: PDF, JPG, PNG. Max size: 5MB.</p></div>{renderDocumentFields(formData.selectedBusinessCategory)}</div>);
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
              {Object.values(formData.uploadedDocuments).some(file => file) && (
                <div className="mt-3 pt-3 border-t border-diani-sand-200">
                  <h5 className="text-sm font-medium text-diani-sand-700 mb-1">Uploaded Documents:</h5>
                  <ul className="list-disc list-inside text-xs text-diani-sand-600 space-y-0.5">
                    {Object.entries(formData.uploadedDocuments).map(([docName, file]) => file ? <li key={docName}>{(categoryFields[formData.selectedBusinessCategory]?.documents.find(d => d.name === docName)?.label || docName)}: {file.name}</li> : null)}
                  </ul>
                </div>
              )}
            </div>
            <div className="bg-diani-teal-50 rounded-xl p-4 space-y-2">
              <h4 className="font-medium text-diani-teal-700">Next Steps:</h4>
              <ul className="text-sm text-diani-teal-600 list-disc list-inside ml-1 space-y-1"><li>Our team will review your submission.</li><li>You'll receive setup instructions via email.</li><li>Premium listing features will be available upon approval.</li></ul>
            </div>
          </div>);
      default: return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'category': return 'Choose Your Business Category';
      case 'contact': return 'Your Contact Information';
      case 'business': return 'Business Details';
      case 'documents': return 'Upload Documents';
      case 'confirm': return 'Review & Submit';
      default: return 'Business Listing';
    }
  };

  const handleDialogClose = (open: boolean) => { if (!open) onClose(); };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] mx-auto bg-white rounded-3xl p-4 sm:p-6 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0"><DialogTitle className="text-xl sm:text-2xl font-bold text-center flex items-center justify-center gap-2"><Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-diani-teal-500" />{getStepTitle()}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-1 py-4 space-y-6 custom-scrollbar">{renderStep()}</div>
          <div className="flex-shrink-0 flex flex-col gap-3 pt-4 mt-auto border-t border-gray-100">
            {currentStep !== 'category' && (
              <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-diani-teal-500 to-diani-teal-600 hover:from-diani-teal-600 hover:to-diani-teal-700 text-white rounded-full py-2.5 sm:py-3 font-medium transition-all duration-200">
                {isSubmitting ? <div className="flex items-center justify-center gap-2"><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /><span>Processing...</span></div> : currentStep === 'confirm' ? 'Submit Listing' : 'Continue'}
              </Button>
            )}
            {currentStep !== 'category' && (
              <Button type="button" variant="ghost" onClick={() => { setFormErrors({}); setCurrentStep(prev => { if (prev === 'confirm') return 'documents'; if (prev === 'documents') return 'business'; if (prev === 'business') return isLoggedIn ? 'category' : 'contact'; if (prev === 'contact') return 'category'; return 'category';})}} className="text-diani-sand-600 hover:text-diani-teal-700">
                <ArrowLeft className="h-4 w-4 mr-2" />Back
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};