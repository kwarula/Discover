import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Flag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { MessageFeedback as MessageFeedbackType } from '@/types';
import { feedbackService } from '@/services/feedbackService';
import { toast } from '@/hooks/use-toast';

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
      
      if (result.success) {
        toast({
          title: "Thank you!",
          description: "Your feedback helps us improve.",
        });
      } else {
        // Store locally as fallback
        await feedbackService.storeFeedbackLocally(feedback);
        toast({
          title: "Feedback saved",
          description: "We'll sync this when you're back online.",
        });
      }
    } catch (error) {
      console.error('Feedback error:', error);
      await feedbackService.storeFeedbackLocally(feedback);
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
      
      if (result.success) {
        toast({
          title: "Thank you for the detailed feedback!",
          description: "This helps us provide better recommendations.",
        });
      } else {
        await feedbackService.storeFeedbackLocally(feedback);
        toast({
          title: "Feedback saved",
          description: "We'll sync this when you're back online.",
        });
      }
      
      setShowDetailedFeedback(false);
      setComment('');
      setRating(0);
    } catch (error) {
      console.error('Detailed feedback error:', error);
      await feedbackService.storeFeedbackLocally(feedback);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={cn("flex items-center gap-2 mt-2", className)}>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleQuickFeedback('helpful')}
            disabled={isSubmitting}
            className={cn(
              "h-7 px-2 text-xs hover:bg-green-50 hover:text-green-700 transition-colors",
              selectedFeedback === 'helpful' && "bg-green-50 text-green-700"
            )}
          >
            <ThumbsUp size={12} className="mr-1" />
            Helpful
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleQuickFeedback('not_helpful')}
            disabled={isSubmitting}
            className={cn(
              "h-7 px-2 text-xs hover:bg-red-50 hover:text-red-700 transition-colors",
              selectedFeedback === 'not_helpful' && "bg-red-50 text-red-700"
            )}
          >
            <ThumbsDown size={12} className="mr-1" />
            Not helpful
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDetailedFeedback}
          className="h-7 px-2 text-xs hover:bg-orange-50 hover:text-orange-700 transition-colors"
        >
          <Flag size={12} className="mr-1" />
          Report
        </Button>
      </div>

      {/* Detailed Feedback Modal */}
      <Dialog open={showDetailedFeedback} onOpenChange={setShowDetailedFeedback}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Provide Detailed Feedback</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Feedback Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">What's the issue?</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'inaccurate', label: 'Inaccurate info' },
                  { value: 'inappropriate', label: 'Inappropriate' },
                  { value: 'not_helpful', label: 'Not helpful' },
                  { value: 'helpful', label: 'Actually helpful' }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedFeedback === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFeedback(option.value)}
                    className="text-xs"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Rate this response (optional)</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={20}
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
                className="min-h-[80px]"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={submitDetailedFeedback}
              disabled={!selectedFeedback || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};