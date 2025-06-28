import React, { useState, useEffect } from 'react';

const loadingMessages = [
  // Local flavor / Beach vibe
  "Checking tide schedules… one sec.",
  "Asking the locals…",
  "Googling where to get the best samaki fry.",
  "Looking for hidden gems behind the palm trees…",
  "One moment… chasing a monkey off the keyboard.",
  "Scanning for the freshest coconut.",
  "Snorkeling through the data…",
  "Loading with sunscreen ☀️",
  "Tuning into the Diani vibe…",
  
  // AI + Fun
  "Consulting with the Diani Oracle…",
  "Running a quick beach simulation…",
  "Rerouting through coconut fiber…",
  "Fetching results from a beach bar…",
  "Summoning Swahili hospitality protocols…",
  "Diving into local recommendations…",
  "Surfing through the best spots…",
  "Collecting wisdom from beach elders…",
  "Filtering through palm tree whispers…",
  "Brewing the perfect response…"
];

export const TypingIndicator: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Rotate messages every 2.5 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => 
        (prevIndex + 1) % loadingMessages.length
      );
    }, 2500);

    // Add a subtle fade effect when changing messages
    const fadeInterval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 150);
    }, 2500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(fadeInterval);
    };
  }, []);

  return (
    <div className="flex justify-start mb-4 animate-fade-in">
      <div className="glass bg-gradient-to-br from-white/90 to-white/70 text-diani-sand-800 px-5 py-4 rounded-2xl rounded-bl-md shadow-lg border border-white/50 max-w-[75%]">
        <div className="flex items-center gap-3">
          {/* Animated dots */}
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-diani-teal-600 rounded-full animate-typing"></div>
            <div className="w-2 h-2 bg-diani-teal-600 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-diani-teal-600 rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></div>
          </div>
          
          {/* Dynamic message with fade transition */}
          <span 
            className={`text-sm text-diani-sand-700 transition-opacity duration-150 ${
              isVisible ? 'opacity-100' : 'opacity-70'
            }`}
          >
            {loadingMessages[currentMessageIndex]}
          </span>
        </div>
        
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer opacity-30 rounded-2xl"></div>
      </div>
    </div>
  );
};