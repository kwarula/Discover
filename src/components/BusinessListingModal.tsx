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

interface BusinessListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormStep = 'category' | 'contact' | 'business' | 'confirm';

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  businessCategory: string;
  position: string;
}

export const BusinessListingModal: React.FC<BusinessListingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isLoggedIn, userProfile } = useAppContext();
  const [currentStep, setCurrentStep] = useState<FormStep>('category');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    businessCategory: '',
    position: 'Owner',
  });

  // Reset form when modal opens
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
    setFormData(prev => ({ ...prev, businessCategory: category }));
    setCategorySearch('');
    setCurrentStep(isLoggedIn ? 'business' : 'contact');
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
      if (!formData.businessCategory || !formData.position) {
        toast({
          title: "All fields required",
          description: "Please select both category and position.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep('confirm');
      return;
    }

    // Final submission
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Submission successful!",
        description: "We'll review your listing and contact you soon.",
      });
      onClose();
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        businessCategory: '',
        position: 'Owner',
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="space-y-4">
            <div className="bg-diani-teal-50 px-3 py-2 rounded-lg">
              <div className="text-xs text-diani-teal-600">Selected Category</div>
              <div className="text-diani-teal-700 font-medium">{formData.businessCategory}</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Your Position</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Marketing Lead">Marketing Lead</SelectItem>
                  <SelectItem value="Staff Member">Staff Member</SelectItem>
                  <SelectItem value="Consultant">Consultant</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                <p><span className="text-diani-sand-600">Business Category:</span> {formData.businessCategory}</p>
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
      case 'confirm':
        return 'Review & Submit';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Building2 className="h-6 w-6 text-diani-teal-500" />
            {getStepTitle()}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}

          <div className="flex flex-col gap-3">
            {currentStep !== 'category' && (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-diani-teal-500 to-diani-teal-600 hover:from-diani-teal-600 hover:to-diani-teal-700 text-white rounded-full py-3 font-medium transition-all duration-200"
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
                  if (prev === 'confirm') return 'business';
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