
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MapPin, Utensils, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceInput } from './VoiceInput';
import { translate, getCurrentLanguage } from '@/services/translationService';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const quickSuggestions = [
    { icon: MapPin, text: "Best beaches", query: translate('bestBeaches', currentLang) },
    { icon: Utensils, text: "Restaurants", query: translate('restaurants', currentLang) },
    { icon: Activity, text: "Activities", query: translate('activities', currentLang) },
    { icon: Sparkles, text: "Hidden gems", query: translate('hiddenGems', currentLang) },
  ];

  // Update language when it changes
  useEffect(() => {
    const checkLanguage = () => {
      const lang = getCurrentLanguage();
      if (lang !== currentLang) {
        setCurrentLang(lang);
      }
    };
    
    // Check for language changes
    const interval = setInterval(checkLanguage, 1000);
    return () => clearInterval(interval);
  }, [currentLang]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (query: string) => {
    setMessage(query);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const handleVoiceTranscript = (transcript: string) => {
    setMessage(transcript);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 3 * 24; // 3 lines * line-height
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  }, [message]);

  return (
    <div className="space-y-3">
      {/* Quick Suggestions */}
      {showSuggestions && message.length === 0 && (
        <div className="flex flex-wrap gap-2 justify-center animate-fade-in">
          {quickSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion.query)}
              className="glass px-4 py-2 rounded-full text-sm font-medium text-diani-sand-700 hover:text-diani-teal-700 hover:bg-white/80 transition-all duration-200 flex items-center gap-2 hover-lift"
              disabled={disabled}
            >
              <suggestion.icon size={16} />
              {suggestion.text}
            </button>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="glass rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 min-h-[64px] flex items-center p-2">
        <form onSubmit={handleSubmit} className="flex w-full items-end gap-3">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setShowSuggestions(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder={translate('askAnything', currentLang)}
            disabled={disabled}
            className={cn(
              "flex-1 bg-transparent border-0 px-4 py-3 text-base leading-6 font-inter text-diani-sand-800 placeholder-diani-sand-500 resize-none outline-none min-h-[40px] max-h-[72px] overflow-y-auto",
              disabled && "opacity-50"
            )}
            aria-label="Chat message input"
            rows={1}
          />
          <VoiceInput onTranscript={handleVoiceTranscript} disabled={disabled} />
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className={cn(
              "bg-gradient-to-br from-diani-teal-500 to-diani-teal-700 text-white rounded-full p-3 font-medium text-sm transition-all duration-200 min-w-[48px] min-h-[48px] flex items-center justify-center shadow-lg",
              message.trim() && !disabled
                ? "hover:from-diani-teal-600 hover:to-diani-teal-800 hover:scale-105 active:scale-95 pulse-animation"
                : "opacity-50 cursor-not-allowed"
            )}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
