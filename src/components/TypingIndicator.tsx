
import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4 animate-fade-in">
      <div className="glass bg-gradient-to-br from-white/90 to-white/70 text-diani-sand-800 px-5 py-4 rounded-2xl rounded-bl-md shadow-lg border border-white/50 max-w-[75%]">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-diani-teal-600 rounded-full animate-typing"></div>
            <div className="w-2 h-2 bg-diani-teal-600 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-diani-teal-600 rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="text-sm text-diani-sand-600 ml-2">Diani AI is thinking...</span>
        </div>
      </div>
    </div>
  );
};
