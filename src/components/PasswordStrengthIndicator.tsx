import React from 'react';
import { validatePassword } from '@/services/authService';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  className = ''
}) => {
  const validation = validatePassword(password);
  
  const requirements = [
    { text: 'At least 8 characters', test: password.length >= 8 },
    { text: 'One uppercase letter', test: /[A-Z]/.test(password) },
    { text: 'One lowercase letter', test: /[a-z]/.test(password) },
    { text: 'One number', test: /\d/.test(password) },
    { text: 'One special character', test: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
  ];

  const strengthScore = requirements.filter(req => req.test).length;
  const strengthLevel = strengthScore <= 2 ? 'weak' : strengthScore <= 4 ? 'medium' : 'strong';
  
  const strengthColors = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500'
  };

  const strengthLabels = {
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong'
  };

  if (!password) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-diani-sand-700">Password Strength</span>
          <span className={`text-sm font-medium ${
            strengthLevel === 'weak' ? 'text-red-600' :
            strengthLevel === 'medium' ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {strengthLabels[strengthLevel]}
          </span>
        </div>
        <div className="w-full bg-diani-sand-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${strengthColors[strengthLevel]}`}
            style={{ width: `${(strengthScore / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-1">
        {requirements.map((requirement, index) => (
          <div key={index} className="flex items-center space-x-2">
            {requirement.test ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-400" />
            )}
            <span className={`text-sm ${
              requirement.test ? 'text-green-700' : 'text-diani-sand-600'
            }`}>
              {requirement.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
