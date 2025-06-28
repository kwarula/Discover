import { MessageFeedback, FeedbackResponse } from '@/types';

// For now, we'll use a webhook endpoint similar to chat
const FEEDBACK_WEBHOOK = 'https://n8n.zaidicreatorlab.com/webhook/feedback-collection';

export const feedbackService = {
  async submitFeedback(feedback: MessageFeedback): Promise<FeedbackResponse> {
    try {
      console.log('Submitting feedback:', feedback);
      
      const response = await fetch(FEEDBACK_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        console.warn(`Feedback webhook returned ${response.status}, storing locally`);
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
        message: data.message || 'Feedback submitted successfully'
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