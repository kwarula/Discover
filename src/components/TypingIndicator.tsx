
import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-6">
      <div className="bg-gradient-to-br from-diani-teal-500 to-diani-teal-700 text-diani-sand-50 px-4 py-3 rounded-2xl rounded-bl-md max-w-[75%] shadow-sm">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-diani-sand-50 rounded-full animate-typing"></div>
          <div className="w-2 h-2 bg-diani-sand-50 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-diani-sand-50 rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <div className="text-xs mt-2 opacity-75 text-diani-sand-100">
          Diani AI is thinking...
        </div>
      </div>
    </div>
  );
};
