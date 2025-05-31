import React, { useState } from 'react';
import { Plus, X, MapPin, Utensils, Activity, Hotel, Car, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onActionClick: (action: string) => void;
}

const actions = [
  { icon: Car, label: 'Transport', query: 'Find me a bodaboda or tuktuk nearby', color: 'bg-yellow-500' },
  { icon: MapPin, label: 'Beaches', query: 'Show me the best beaches in Diani', color: 'bg-blue-500' },
  { icon: Hotel, label: 'Hotels', query: 'Find hotels near the beach', color: 'bg-purple-500' },
  { icon: Utensils, label: 'Dining', query: 'Recommend restaurants for dinner', color: 'bg-orange-500' },
  { icon: Activity, label: 'Activities', query: 'What activities can I do today?', color: 'bg-green-500' },
  { icon: Info, label: 'Local Tips', query: 'Give me insider tips for Diani', color: 'bg-indigo-500' },
];

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onActionClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleActionClick = (query: string) => {
    onActionClick(query);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {/* Action buttons */}
      <div className={cn(
        "absolute bottom-16 right-0 space-y-3 transition-all duration-300",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        {actions.map((action, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-3 transition-all duration-300",
              isOpen ? "translate-x-0" : "translate-x-full"
            )}
            style={{ transitionDelay: isOpen ? `${index * 50}ms` : '0ms' }}
          >
            <span className="glass px-3 py-1 rounded-full text-sm font-medium text-diani-sand-800 whitespace-nowrap">
              {action.label}
            </span>
            <button
              onClick={() => handleActionClick(action.query)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform",
                action.color
              )}
            >
              <action.icon size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full bg-gradient-to-br from-diani-teal-500 to-diani-teal-700 text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110",
          isOpen && "rotate-45"
        )}
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  );
};
