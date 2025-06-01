import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Mail, Sparkles } from 'lucide-react';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: 'App Store' | 'Google Play';
}

export const StoreModal: React.FC<StoreModalProps> = ({
  isOpen,
  onClose,
  storeName,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Thank you for your interest!",
        description: `We'll notify you as soon as the ${storeName} app is available.`,
      });
      setEmail('');
      onClose();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-diani-sand-50 to-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-diani-teal-500" />
            Get Priority Access
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Icon and Description */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-diani-teal-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-8 w-8 text-diani-teal-600" />
            </div>
            <p className="text-diani-sand-700">
              Be among the first to experience Discover Diani on {storeName}. 
              Sign up for exclusive early access and special perks!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white border-diani-sand-200 focus:border-diani-teal-500 focus:ring-diani-teal-500"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-diani-teal-500 to-diani-teal-600 hover:from-diani-teal-600 hover:to-diani-teal-700 text-white rounded-full font-medium transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Submitting...</span>
                </div>
              ) : (
                'Get Early Access'
              )}
            </Button>
          </form>

          {/* Benefits */}
          <div className="bg-diani-teal-50 rounded-xl p-4 space-y-2">
            <h4 className="font-medium text-diani-teal-700">Early Access Benefits:</h4>
            <ul className="text-sm text-diani-teal-600 space-y-1">
              <li>• Priority access to new features</li>
              <li>• Exclusive in-app rewards</li>
              <li>• Special launch day offers</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};