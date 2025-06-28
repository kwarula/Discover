// Translation service for multi-language support
// In production, this would connect to a real translation API like Google Translate

import { useState, useEffect, useCallback } from 'react';

interface Translations {
  [key: string]: {
    [lang: string]: string;
  };
}

const commonPhrases: Translations = {
  'welcome': {
    'en': "Ready to explore Diani? Tell me what you're looking for—best beaches, top restaurants, hidden gems.",
    'sw': "Uko tayari kugundua Diani? Niambie unachokitafuta—fukwe bora, mikahawa ya juu, siri za mahali.",
    'fr': "Prêt à explorer Diani? Dites-moi ce que vous cherchez—meilleures plages, restaurants, joyaux cachés.",
    'de': "Bereit, Diani zu erkunden? Sagen Sie mir, was Sie suchen—beste Strände, Restaurants, versteckte Schätze.",
    'it': "Pronti a esplorare Diani? Dimmi cosa stai cercando—migliori spiagge, ristoranti, gemme nascoste.",
    'es': "¿Listo para explorar Diani? Dime qué buscas—mejores playas, restaurantes, joyas ocultas.",
  },
  'askAnything': {
    'en': "Ask me anything about Diani Beach...",
    'sw': "Niulize chochote kuhusu Diani Beach...",
    'fr': "Demandez-moi n'importe quoi sur Diani Beach...",
    'de': "Fragen Sie mich alles über Diani Beach...",
    'it': "Chiedimi qualsiasi cosa su Diani Beach...",
    'es': "Pregúntame cualquier cosa sobre Diani Beach...",
  },
  'bestBeaches': {
    'en': "What are the best beaches in Diani?",
    'sw': "Ni fukwe zipi bora zaidi Diani?",
    'fr': "Quelles sont les meilleures plages de Diani?",
    'de': "Was sind die besten Strände in Diani?",
    'it': "Quali sono le migliori spiagge di Diani?",
    'es': "¿Cuáles son las mejores playas en Diani?",
  },
  'restaurants': {
    'en': "Where can I find good restaurants?",
    'sw': "Naweza kupata mikahawa mizuri wapi?",
    'fr': "Où puis-je trouver de bons restaurants?",
    'de': "Wo finde ich gute Restaurants?",
    'it': "Dove posso trovare buoni ristoranti?",
    'es': "¿Dónde puedo encontrar buenos restaurantes?",
  },
  'activities': {
    'en': "What activities are available?",
    'sw': "Ni shughuli zipi zinapatikana?",
    'fr': "Quelles activités sont disponibles?",
    'de': "Welche Aktivitäten sind verfügbar?",
    'it': "Quali attività sono disponibili?",
    'es': "¿Qué actividades están disponibles?",
  },
  'hiddenGems': {
    'en': "Show me hidden gems in Diani",
    'sw': "Nionyeshe siri za Diani",
    'fr': "Montrez-moi les joyaux cachés de Diani",
    'de': "Zeigen Sie mir versteckte Schätze in Diani",
    'it': "Mostrami le gemme nascoste di Diani",
    'es': "Muéstrame las joyas ocultas de Diani",
  },
  // Card-specific translations
  'common.rating': {
    'en': "{rating} / {maxRating}",
    'sw': "{rating} / {maxRating}",
    'fr': "{rating} / {maxRating}",
    'de': "{rating} / {maxRating}",
    'it': "{rating} / {maxRating}",
    'es': "{rating} / {maxRating}",
  },
  'common.distance': {
    'en': "{value} {unit}",
    'sw': "{value} {unit}",
    'fr': "{value} {unit}",
    'de': "{value} {unit}",
    'it': "{value} {unit}",
    'es': "{value} {unit}",
  },
  'common.duration.hours': {
    'en': "{hours} hours",
    'sw': "Saa {hours}",
    'fr': "{hours} heures",
    'de': "{hours} Stunden",
    'it': "{hours} ore",
    'es': "{hours} horas",
  },
  'common.duration.minutes': {
    'en': "{minutes} minutes",
    'sw': "Dakika {minutes}",
    'fr': "{minutes} minutes",
    'de': "{minutes} Minuten",
    'it': "{minutes} minuti",
    'es': "{minutes} minutos",
  },
  'common.duration.hoursAndMinutes': {
    'en': "{hours}h {minutes}m",
    'sw': "Saa {hours} dakika {minutes}",
    'fr': "{hours}h {minutes}m",
    'de': "{hours}h {minutes}m",
    'it': "{hours}h {minutes}m",
    'es': "{hours}h {minutes}m",
  },
  'common.more': {
    'en': "+{count} more",
    'sw': "+{count} zaidi",
    'fr': "+{count} de plus",
    'de': "+{count} mehr",
    'it': "+{count} altri",
    'es': "+{count} más",
  },
  // Card actions
  'cards.actions.viewDetails': {
    'en': "View Details",
    'sw': "Tazama Maelezo",
    'fr': "Voir les détails",
    'de': "Details anzeigen",
    'it': "Vedi dettagli",
    'es': "Ver detalles",
  },
  'cards.actions.checkAvailability': {
    'en': "Check Availability",
    'sw': "Angalia Upatikanaji",
    'fr': "Vérifier la disponibilité",
    'de': "Verfügbarkeit prüfen",
    'it': "Verifica disponibilità",
    'es': "Verificar disponibilidad",
  },
  'cards.actions.bookNow': {
    'en': "Book Now",
    'sw': "Weka Nafasi Sasa",
    'fr': "Réserver maintenant",
    'de': "Jetzt buchen",
    'it': "Prenota ora",
    'es': "Reservar ahora",
  },
  'cards.actions.learnMore': {
    'en': "Learn More",
    'sw': "Jifunze Zaidi",
    'fr': "En savoir plus",
    'de': "Mehr erfahren",
    'it': "Scopri di più",
    'es': "Saber más",
  },
  'cards.actions.viewMenu': {
    'en': "View Menu",
    'sw': "Tazama Menyu",
    'fr': "Voir le menu",
    'de': "Menü anzeigen",
    'it': "Vedi menu",
    'es': "Ver menú",
  },
  'cards.actions.call': {
    'en': "Call",
    'sw': "Piga simu",
    'fr': "Appeler",
    'de': "Anrufen",
    'it': "Chiama",
    'es': "Llamar",
  },
  'cards.status.unavailable': {
    'en': "Unavailable",
    'sw': "Haipatikani",
    'fr': "Indisponible",
    'de': "Nicht verfügbar",
    'it': "Non disponibile",
    'es': "No disponible",
  },
  'cards.status.imageUnavailable': {
    'en': "Image unavailable",
    'sw': "Picha haipatikani",
    'fr': "Image non disponible",
    'de': "Bild nicht verfügbar",
    'it': "Immagine non disponibile",
    'es': "Imagen no disponible",
  },
  // Restaurant specific
  'cards.restaurant.popularDishes': {
    'en': "Popular dishes:",
    'sw': "Vyakula maarufu:",
    'fr': "Plats populaires:",
    'de': "Beliebte Gerichte:",
    'it': "Piatti popolari:",
    'es': "Platos populares:",
  },
  'cards.restaurant.priceLevel.budget': {
    'en': "Budget-friendly",
    'sw': "Bei nafuu",
    'fr': "Économique",
    'de': "Preiswert",
    'it': "Economico",
    'es': "Económico",
  },
  'cards.restaurant.priceLevel.moderate': {
    'en': "Moderate",
    'sw': "Wastani",
    'fr': "Modéré",
    'de': "Mittelklasse",
    'it': "Moderato",
    'es': "Moderado",
  },
  'cards.restaurant.priceLevel.upscale': {
    'en': "Upscale",
    'sw': "Ya hali ya juu",
    'fr': "Haut de gamme",
    'de': "Gehoben",
    'it': "Di lusso",
    'es': "De lujo",
  },
  'cards.restaurant.priceLevel.fine': {
    'en': "Fine dining",
    'sw': "Chakula cha kifahari",
    'fr': "Gastronomique",
    'de': "Gehobene Küche",
    'it': "Alta cucina",
    'es': "Alta cocina",
  },
  // Activity specific
  'cards.activity.highlights': {
    'en': "Highlights:",
    'sw': "Mambo makuu:",
    'fr': "Points forts:",
    'de': "Highlights:",
    'it': "Punti salienti:",
    'es': "Destacados:",
  },
  'cards.activity.difficulty.easy': {
    'en': "Easy",
    'sw': "Rahisi",
    'fr': "Facile",
    'de': "Einfach",
    'it': "Facile",
    'es': "Fácil",
  },
  'cards.activity.difficulty.moderate': {
    'en': "Moderate",
    'sw': "Wastani",
    'fr': "Modéré",
    'de': "Mittel",
    'it': "Moderato",
    'es': "Moderado",
  },
  'cards.activity.difficulty.challenging': {
    'en': "Challenging",
    'sw': "Changamoto",
    'fr': "Difficile",
    'de': "Anspruchsvoll",
    'it': "Impegnativo",
    'es': "Desafiante",
  },
  // Hotel specific
  'cards.hotel.amenities': {
    'en': "Amenities:",
    'sw': "Huduma:",
    'fr': "Équipements:",
    'de': "Annehmlichkeiten:",
    'it': "Servizi:",
    'es': "Servicios:",
  },
  // Transport specific
  'cards.transport.arrivesIn': {
    'en': "Arrives in",
    'sw': "Atafika baada ya",
    'fr': "Arrive dans",
    'de': "Ankunft in",
    'it': "Arriva tra",
    'es': "Llega en",
  },
  'cards.transport.callDriver': {
    'en': "Call Driver",
    'sw': "Mpigie Dereva",
    'fr': "Appeler le chauffeur",
    'de': "Fahrer anrufen",
    'it': "Chiama autista",
    'es': "Llamar conductor",
  },
};

export const translate = (key: string, lang: string = 'en', params?: Record<string, any>): string => {
  let translation = commonPhrases[key]?.[lang] || commonPhrases[key]?.['en'] || key;
  
  // Replace parameters in translation
  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      translation = translation.replace(`{${paramKey}}`, String(value));
    });
  }
  
  return translation;
};

// Mock translation function for dynamic content
export const translateText = async (text: string, targetLang: string): Promise<string> => {
  // In production, this would call a real translation API
  // For now, we'll return the original text with a language indicator
  if (targetLang === 'en') return text;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Add language indicator for demo purposes
  const langIndicators: { [key: string]: string } = {
    'sw': '[SW]',
    'fr': '[FR]',
    'de': '[DE]',
    'it': '[IT]',
    'es': '[ES]',
  };
  
  return `${langIndicators[targetLang] || ''} ${text}`;
};

export const getCurrentLanguage = (): string => {
  return localStorage.getItem('diani-language-code') || 'en';
};

// React hook for translations
export const useTranslation = () => {
  const [language, setLanguage] = useState(getCurrentLanguage());

  useEffect(() => {
    const handleStorageChange = () => {
      setLanguage(getCurrentLanguage());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const t = useCallback((key: string, params?: Record<string, any>) => {
    return translate(key, language, params);
  }, [language]);

  return { t, language };
};
