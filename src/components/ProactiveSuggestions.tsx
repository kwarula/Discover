import React from 'react';
import { Suggestion } from '@/types';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface ProactiveSuggestionsProps {
  suggestions: Suggestion[];
  onSelectSuggestion: (query: string) => void;
  className?: string;
}

export const ProactiveSuggestions: React.FC<ProactiveSuggestionsProps> = ({
  suggestions,
  onSelectSuggestion,
  className
}) => {
  if (!suggestions.length) return null;

  return (
    <div className={cn("space-y-2 animate-fade-in", className)}>
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((suggestion) => {
          const Icon = Icons[suggestion.icon];
          return (
            <button
              key={suggestion.id}
              onClick={() => onSelectSuggestion(suggestion.query)}
              className={cn(
                "glass px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover-lift",
                "flex items-center gap-2",
                suggestion.priority === 'high' 
                  ? "bg-diani-teal-500 text-white hover:bg-diani-teal-600"
                  : "text-diani-sand-700 hover:text-diani-teal-700 hover:bg-white/80"
              )}
            >
              <Icon size={16} />
              <span className="truncate">{suggestion.text}</span>
            </button>
          )}
        )}
      </div>
    </div>
  );
};