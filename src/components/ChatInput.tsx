
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
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
    <div className="bg-diani-sand-50 border border-diani-sand-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-200 min-h-[64px] flex items-center p-2">
      <form onSubmit={handleSubmit} className="flex w-full items-end gap-3">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about Diani Beach..."
          disabled={disabled}
          className={cn(
            "flex-1 bg-transparent border-0 px-4 py-3 text-base leading-6 font-inter text-diani-sand-800 placeholder-diani-sand-500 resize-none outline-none min-h-[40px] max-h-[72px] overflow-y-auto",
            disabled && "opacity-50"
          )}
          aria-label="Chat message input"
          rows={1}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={cn(
            "bg-diani-teal-500 text-diani-sand-50 rounded-full p-3 font-medium text-sm transition-all duration-200 min-w-[48px] min-h-[48px] flex items-center justify-center",
            message.trim() && !disabled
              ? "hover:bg-diani-teal-700 active:bg-diani-teal-900 hover:scale-105 active:scale-95"
              : "opacity-50 cursor-not-allowed"
          )}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};
