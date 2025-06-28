import { MessageFeedback, FeedbackResponse } from '@/types';

// Use Supabase edge function for feedback
const FEEDBACK_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/feedback`;

export const feedbackService = {
  async submitFeedback(feedback: MessageFeedback): Promise<FeedbackResponse> {
    try {
      console.log('Submitting feedback to Supabase:', feedback);
      
      const response = await fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messageId: feedback.messageId,
          userId: feedback.userId,
          feedbackType: feedback.feedbackType,
          rating: feedback.rating,
          comment: feedback.comment,
          timestamp: feedback.timestamp.toISOString()
        }),
      });

      if (!response.ok) {
        console.warn(`Feedback endpoint returned ${response.status}, storing locally`);
        // Store locally as fallback
        await this.storeFeedbackLocally(feedback);
        return {
          success: true,
          message: 'Feedback saved locally and will be synced later'
        };
      }

      let data;
      try {
        data = await response.json();
      } catch {
        // If response isn't JSON, that's okay for feedback
        data = { message: 'Feedback received' };
      }
      
      return {
        success: true,
        message: data.message || 'Thank you for your feedback!'
      };
    } catch (error) {
      console.error('Feedback submission error:', error);
      
      // Always store locally as fallback
      try {
        await this.storeFeedbackLocally(feedback);
      } catch (storageError) {
        console.error('Failed to store feedback locally:', storageError);
      }
      
      return {
        success: true, // Return success since we stored locally
        message: 'Feedback saved locally and will be synced when online'
      };
    }
  },

  // Store feedback locally as fallback
  async storeFeedbackLocally(feedback: MessageFeedback): Promise<void> {
    try {
      const existingFeedback = JSON.parse(localStorage.getItem('diani-feedback') || '[]');
      existingFeedback.push({
        ...feedback,
        timestamp: feedback.timestamp.toISOString() // Convert Date to string for storage
      });
      
      // Keep only last 50 feedback items to prevent storage bloat
      if (existingFeedback.length > 50) {
        existingFeedback.splice(0, existingFeedback.length - 50);
      }
      
      localStorage.setItem('diani-feedback', JSON.stringify(existingFeedback));
    } catch (error) {
      console.error('Error storing feedback locally:', error);
    }
  },

  // Get locally stored feedback (for potential sync later)
  async getLocalFeedback(): Promise<MessageFeedback[]> {
    try {
      const stored = localStorage.getItem('diani-feedback');
      if (!stored) return [];
      
      const feedback = JSON.parse(stored);
      return feedback.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp) // Convert string back to Date
      }));
    } catch (error) {
      console.error('Error retrieving local feedback:', error);
      return [];
    }
  },

  // Clear local feedback after successful sync
  async clearLocalFeedback(): Promise<void> {
    try {
      localStorage.removeItem('diani-feedback');
    } catch (error) {
      console.error('Error clearing local feedback:', error);
    }
  }
};