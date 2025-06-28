import { MessageFeedback, FeedbackResponse } from '@/types';

const FEEDBACK_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/feedback`;

export const feedbackService = {
  async submitFeedback(feedback: MessageFeedback): Promise<FeedbackResponse> {
    try {
      const response = await fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || 'Feedback submitted successfully'
      };
    } catch (error) {
      console.error('Feedback submission error:', error);
      return {
        success: false,
        message: 'Failed to submit feedback. Please try again.'
      };
    }
  },

  // Store feedback locally as fallback
  async storeFeedbackLocally(feedback: MessageFeedback): Promise<void> {
    try {
      const existingFeedback = JSON.parse(localStorage.getItem('diani-feedback') || '[]');
      existingFeedback.push(feedback);
      
      // Keep only last 50 feedback items to prevent storage bloat
      if (existingFeedback.length > 50) {
        existingFeedback.splice(0, existingFeedback.length - 50);
      }
      
      localStorage.setItem('diani-feedback', JSON.stringify(existingFeedback));
    } catch (error) {
      console.error('Error storing feedback locally:', error);
    }
  }
};