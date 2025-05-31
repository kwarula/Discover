import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';
import { Mail, RefreshCw, ExternalLink } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerificationSuccess: () => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  onVerificationSuccess
}) => {
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);

    try {
      const response = await authService.resendVerificationCode(email);
      
      if (response.success) {
        toast({
          title: "Verification email sent!",
          description: response.message,
        });
      } else {
        toast({
          title: "Failed to resend",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Resend error",
        description: "Failed to resend verification email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleOpenEmail = () => {
    // Try to open the user's default email client
    window.location.href = `mailto:${email}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-diani-sand-50 border-diani-sand-200 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold font-sohne text-diani-sand-900 text-center">
            Check Your Email
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Email Icon and Info */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-diani-teal-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-8 w-8 text-diani-teal-600" />
            </div>
            <div className="space-y-2">
              <p className="text-diani-sand-700">
                We've sent a verification link to:
              </p>
              <p className="font-medium text-diani-sand-900 break-all">{email}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-diani-teal-50 border border-diani-teal-200 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-diani-sand-900">Next steps:</h3>
            <ol className="text-sm text-diani-sand-700 space-y-1 list-decimal list-inside">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the verification link in the email</li>
              <li>You'll be automatically signed in</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleOpenEmail}
              className="w-full bg-diani-teal-500 hover:bg-diani-teal-700 text-white rounded-full py-3 font-medium transition-all duration-200"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Email App
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full border-diani-sand-300 text-diani-sand-700 hover:bg-diani-sand-100 rounded-full py-3 font-medium transition-all duration-200"
            >
              {isResending ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resend Verification Email
                </>
              )}
            </Button>
          </div>

          {/* Help Text */}
          <div className="bg-diani-sand-100 rounded-lg p-3 text-center">
            <p className="text-xs text-diani-sand-600">
              The verification link will expire in 24 hours.
              <br />
              If you don't see the email, check your spam folder.
            </p>
          </div>

          {/* Close Button */}
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="w-full text-diani-sand-600 hover:text-diani-sand-800 hover:bg-diani-sand-100 rounded-full py-2"
          >
            I'll verify later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
