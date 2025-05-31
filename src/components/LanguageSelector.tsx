import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface Language {
  code: string;
  name: string;
  flag: string;
  speechCode: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', speechCode: 'en-US' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪', speechCode: 'sw-KE' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', speechCode: 'fr-FR' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', speechCode: 'de-DE' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', speechCode: 'it-IT' },
  { code: 'es', name: 'Español', flag: '🇪🇸', speechCode: 'es-ES' },
];

interface LanguageSelectorProps {
  onLanguageChange?: (language: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    // Load saved language preference
    const savedLangCode = localStorage.getItem('diani-language-code') || 'en';
    const savedLang = languages.find(lang => lang.code === savedLangCode) || languages[0];
    setSelectedLanguage(savedLang);
  }, []);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    localStorage.setItem('diani-language-code', language.code);
    localStorage.setItem('diani-language', language.speechCode);
    onLanguageChange?.(language);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-diani-sand-700 hover:text-diani-teal-700 hover:bg-white/50 transition-all"
        >
          <Globe size={16} className="mr-2" />
          <span className="text-lg mr-1">{selectedLanguage.flag}</span>
          <span className="hidden sm:inline">{selectedLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageSelect(language)}
            className="cursor-pointer hover:bg-diani-teal-50"
          >
            <span className="text-lg mr-2">{language.flag}</span>
            <span>{language.name}</span>
            {selectedLanguage.code === language.code && (
              <span className="ml-auto text-diani-teal-600">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
