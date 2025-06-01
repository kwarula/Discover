import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/LanguageSelector';
import { MessageCircle, Search, MapPin, Phone, Calendar, Apple, PlayCircle } from 'lucide-react';
import { StoreModal } from '@/components/StoreModal';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<'App Store' | 'Google Play'>('App Store');

  const handleStartExploring = () => {
    navigate('/chat');
  };

  const handleStoreClick = (store: 'App Store' | 'Google Play') => {
    setSelectedStore(store);
    setStoreModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-diani-teal-50 via-coral-sunset-50 to-diani-sand-50">
      {/* Header */}
      <header className="glass-static border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/discover_diani_website_logo.png" 
              alt="Discover Diani Logo" 
              className="h-10 sm:h-12 w-auto hover:scale-105 transition-transform"
            />
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20">
          <div className="flex flex-col items-center text-center space-y-12">
            {/* Hero Content */}
            <div className="space-y-8 max-w-3xl">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-diani-sand-900 leading-tight">
                  Discover Diani in{' '}
                  <span className="text-diani-teal-500">seconds</span>.{' '}
                  <span className="text-coral-sunset-500">Chat</span>.{' '}
                  <span className="text-diani-teal-700">Find</span>.{' '}
                  <span className="text-coral-sunset-700">Book</span>.
                </h1>
                <p className="text-lg sm:text-xl text-diani-sand-700">
                  Your AI-powered guide to everything in Diani — hotels, food, rides, and more. 
                  Free, fast, and always available.
                </p>
              </div>
              
              {/* App Store Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => handleStoreClick('App Store')}
                  size="lg"
                  className="bg-black hover:bg-gray-800 text-white px-5 py-2 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 h-[52px] sm:h-[56px] w-full sm:w-[180px]"
                >
                  <Apple className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-[10px] opacity-80">Download on the</div>
                    <div className="text-sm font-semibold leading-tight">App Store</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleStoreClick('Google Play')}
                  size="lg"
                  className="bg-black hover:bg-gray-800 text-white px-5 py-2 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 h-[52px] sm:h-[56px] w-full sm:w-[180px]"
                >
                  <PlayCircle className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-[10px] opacity-80">Get it on</div>
                    <div className="text-sm font-semibold leading-tight">Google Play</div>
                  </div>
                </Button>
              </div>

              <Button
                onClick={handleStartExploring}
                size="lg"
                className="bg-diani-teal-500 hover:bg-diani-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mt-8"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Try Web Version
              </Button>

              {/* Screenshot */}
              <div className="relative mx-auto max-w-sm lg:max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-diani-teal-500 to-coral-sunset-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
                <img
                  src="/discover-diani-screenshot.png"
                  alt="Discover Diani Chat Interface"
                  className="relative z-10 w-full h-auto rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-white/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-diani-sand-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-diani-sand-700 max-w-2xl mx-auto">
              Get personalized recommendations in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-diani-teal-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-coral-sunset-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-diani-sand-900 mb-3">Ask</h3>
              <p className="text-diani-sand-700 mb-4">
                "Where can I eat seafood near me?"
              </p>
              <div className="bg-diani-sand-100 rounded-lg p-3 text-sm text-diani-sand-600 italic">
                Natural language questions get instant answers
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-coral-sunset-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-diani-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-diani-sand-900 mb-3">Discover</h3>
              <p className="text-diani-sand-700 mb-4">
                AI assistant shows top picks instantly
              </p>
              <div className="bg-diani-sand-100 rounded-lg p-3 text-sm text-diani-sand-600 italic">
                Curated recommendations with photos & details
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-diani-teal-700 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <div className="flex space-x-1">
                    <MapPin className="h-4 w-4 text-white" />
                    <Phone className="h-4 w-4 text-white" />
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-coral-sunset-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-diani-sand-900 mb-3">Book</h3>
              <p className="text-diani-sand-700 mb-4">
                Get directions, call, or reserve
              </p>
              <div className="bg-diani-sand-100 rounded-lg p-3 text-sm text-diani-sand-600 italic">
                Direct actions to complete your plans
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust/Proof Section */}
      <section className="py-16 bg-gradient-to-r from-diani-teal-500 to-coral-sunset-500">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            Trusted by 2,000+ Diani travelers
          </h3>
          
          {/* Partner logos placeholder */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-80">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/20 rounded-lg p-6 h-16 flex items-center justify-center">
                <div className="text-white/60 font-semibold">Partner {i}</div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Button
              onClick={handleStartExploring}
              size="lg"
              variant="outline"
              className="bg-white text-diani-teal-700 border-white hover:bg-diani-sand-50 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Join Them - Start Exploring
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-diani-sand-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="text-center md:text-left">
              <img 
                src="/discover_diani_website_logo.png" 
                alt="Discover Diani Logo" 
                className="h-8 w-auto mx-auto md:mx-0 mb-4 filter brightness-0 invert"
              />
            </div>
            
            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <a href="#" className="hover:text-diani-teal-300 transition-colors">Terms</a>
                <span className="text-diani-sand-500">•</span>
                <a href="#" className="hover:text-diani-teal-300 transition-colors">Privacy</a>
                <span className="text-diani-sand-500">•</span>
                <a href="#" className="hover:text-diani-teal-300 transition-colors">Contact</a>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-diani-sand-400">
                Powered by <span className="text-coral-sunset-300 font-semibold">ZaidiLab</span>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Store Modal */}
      <StoreModal
        isOpen={storeModalOpen}
        onClose={() => setStoreModalOpen(false)}
        storeName={selectedStore}
      />
    </div>
  );
};

export default LandingPage;