import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Flag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { MessageFeedback as MessageFeedbackType } from '@/types';
import { feedbackService } from '@/services/feedbackService';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface MessageFeedbackProps {
  messageId: string;
  userId: string;
  className?: string;
}

export const MessageFeedback: React.FC<MessageFeedbackProps> = ({
  messageId,
  userId,
  className
}) => {
  const isMobile = useIsMobile();
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickFeedback = async (type: 'helpful' | 'not_helpful') => {
    setSelectedFeedback(type);
    
    const feedback: MessageFeedbackType = {
      messageId,
      userId,
      feedbackType: type,
      timestamp: new Date()
    };

    setIsSubmitting(true);
    try {
      const result = await feedbackService.submitFeedback(feedback);
      
      // Always show success since service handles fallbacks
      toast({
        title: "Thank you!",
        description: result.message || "Your feedback helps us improve.",
      });
    } catch (error) {
      console.error('Feedback submission failed:', error);
      toast({
        title: "Feedback saved",
        description: "We'll sync this when you're back online.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDetailedFeedback = () => {
    setShowDetailedFeedback(true);
  };

  const submitDetailedFeedback = async () => {
    if (!selectedFeedback) return;

    const feedback: MessageFeedbackType = {
      messageId,
      userId,
      feedbackType: selectedFeedback as any,
      rating: rating || undefined,
      comment: comment.trim() || undefined,
      timestamp: new Date()
    };

    setIsSubmitting(true);
    try {
      const result = await feedbackService.submitFeedback(feedback);
      
      toast({
        title: "Thank you for the detailed feedback!",
        description: result.message || "This helps us provide better recommendations.",
      });
      
      setShowDetailedFeedback(false);
      setComment('');
      setRating(0);
    } catch (error) {
      console.error('Detailed feedback submission failed:', error);
      toast({
        title: "Feedback saved",
        description: "We'll sync this when you're back online.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={cn(
        "flex items-center mt-3 pt-3 border-t border-white/10",
        isMobile ? "flex-col gap-2" : "gap-2",
        className
      )}>
        <div className={cn(
          "flex items-center",
          isMobile ? "w-full justify-center gap-3" : "gap-1"
        )}>
          <Button
            variant="ghost"
            size={isMobile ? "default" : "sm"}
            onClick={() => handleQuickFeedback('helpful')}
            disabled={isSubmitting}
            className={cn(
              isMobile 
                ? "h-9 px-4 text-sm hover:bg-green-50 hover:text-green-700 transition-colors flex-1 min-w-[100px]" 
                : "h-7 px-2 text-xs hover:bg-green-50 hover:text-green-700 transition-colors",
              selectedFeedback === 'helpful' && "bg-green-50 text-green-700",
              isMobile && "rounded-lg"
            )}
          >
            <ThumbsUp size={isMobile ? 16 : 12} className={isMobile ? "mr-2" : "mr-1"} />
            Helpful
          </Button>
          
          <Button
            variant="ghost"
            size={isMobile ? "default" : "sm"}
            onClick={() => handleQuickFeedback('not_helpful')}
            disabled={isSubmitting}
            className={cn(
              isMobile 
                ? "h-9 px-4 text-sm hover:bg-red-50 hover:text-red-700 transition-colors flex-1 min-w-[100px]" 
                : "h-7 px-2 text-xs hover:bg-red-50 hover:text-red-700 transition-colors",
              selectedFeedback === 'not_helpful' && "bg-red-50 text-red-700",
              isMobile && "rounded-lg"
            )}
          >
            <ThumbsDown size={isMobile ? 16 : 12} className={isMobile ? "mr-2" : "mr-1"} />
            {isMobile ? "Not helpful" : "Not helpful"}
          </Button>
        </div>

        {isMobile ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDetailedFeedback}
            className="h-8 px-3 text-xs hover:bg-orange-50 hover:text-orange-700 transition-colors rounded-lg"
          >
            <Flag size={14} className="mr-1" />
            Report issue
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDetailedFeedback}
            className="h-7 px-2 text-xs hover:bg-orange-50 hover:text-orange-700 transition-colors"
          >
            <Flag size={12} className="mr-1" />
            Report
          </Button>
        )}
      </div>

      {/* Detailed Feedback Modal */}
      <Dialog open={showDetailedFeedback} onOpenChange={setShowDetailedFeedback}>
        <DialogContent className={cn(
          isMobile 
            ? "w-[95vw] max-w-[95vw] mx-auto rounded-2xl" 
            : "sm:max-w-[425px]"
        )}>
          <DialogHeader>
            <DialogTitle>Provide Detailed Feedback</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Feedback Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">What's the issue?</label>
              <div className={cn(
                isMobile ? "grid grid-cols-1 gap-2" : "grid grid-cols-2 gap-2"
              )}>
                {[
                  { value: 'inaccurate', label: 'Inaccurate info' },
                  { value: 'inappropriate', label: 'Inappropriate' },
                  { value: 'not_helpful', label: 'Not helpful' },
                  { value: 'helpful', label: 'Actually helpful' }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedFeedback === option.value ? "default" : "outline"}
                    size={isMobile ? "default" : "sm"}
                    onClick={() => setSelectedFeedback(option.value)}
                    className={isMobile ? "text-sm h-10" : "text-xs"}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Rate this response (optional)</label>
              <div className={cn(
                "flex gap-1",
                isMobile && "justify-center"
              )}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={cn(
                      "hover:scale-110 transition-transform",
                      isMobile ? "p-2" : "p-1"
                    )}
                  >
                    <Star
                      size={isMobile ? 24 : 20}
                      className={cn(
                        "transition-colors",
                        star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional comments (optional)</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us more about your experience..."
                className={isMobile ? "min-h-[100px] text-base" : "min-h-[80px]"}
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={submitDetailedFeedback}
              disabled={!selectedFeedback || isSubmitting}
              className={cn(
                "w-full",
                isMobile && "h-12 text-base"
              )}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};