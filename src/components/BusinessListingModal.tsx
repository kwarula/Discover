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
import { Building2, Search } from 'lucide-react';
import { businessCategories } from '@/data/businessCategories';
import { useAppContext } from '@/contexts/AppContext';

interface BusinessListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormStep = 'contact' | 'business' | 'confirm';

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
  const [currentStep, setCurrentStep] = useState<FormStep>('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategorySearch, setShowCategorySearch] = useState(true);
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
      setCurrentStep(isLoggedIn ? 'business' : 'contact');
      setShowCategorySearch(true);
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
    setShowCategorySearch(false); // Hide the category search after selection
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
            <div className="space-y-2">
              <Label htmlFor="category">Business Category</Label>
              {showCategorySearch ? (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-diani-sand-400" />
                    <Input
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      placeholder="Search categories..."
                      className="pl-9"
                    />
                  </div>
                  <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                    {filteredCategories.map((category) => (
                      <div
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className="px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-diani-sand-100"
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between bg-diani-teal-50 px-3 py-2 rounded-lg">
                  <span className="text-diani-teal-700">{formData.businessCategory}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCategorySearch(true)}
                    className="text-diani-teal-600 hover:text-diani-teal-700"
                  >
                    Change
                  </Button>
                </div>
              )}
            </div>
            {!showCategorySearch && (
              <div className="space-y-2 animate-fade-in">
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
            )}
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Building2 className="h-6 w-6 text-diani-teal-500" />
            List Your Business
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || (currentStep === 'business' && showCategorySearch)}
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

            {currentStep !== 'contact' && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setCurrentStep(currentStep === 'confirm' ? 'business' : 'contact')}
                className="text-diani-sand-600 hover:text-diani-teal-700"
              >
                Back
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};