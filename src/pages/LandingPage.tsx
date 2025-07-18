import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/LanguageSelector';
import { MessageCircle, Search, MapPin, Phone, Calendar, Apple, PlayCircle, Building2 } from 'lucide-react';
import { StoreModal } from '@/components/StoreModal';
import { BusinessListingModal } from '@/components/BusinessListingModal';
import { InfiniteSlider } from '@/components/ui/infinite-slider';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<'App Store' | 'Google Play'>('App Store');
  const [businessModalOpen, setBusinessModalOpen] = useState(false);

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
              <div className="relative mx-auto max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-3xl">
                <div className="absolute inset-0 bg-gradient-to-r from-diani-teal-500 to-coral-sunset-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
                <video
                  src="https://res.cloudinary.com/doprdld4l/video/upload/v1751125990/xwgvs6glimc6uxdbuioc.mov"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="relative z-10 w-full h-auto rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500 max-w-full"
                  poster="/Screenshot 2025-06-28 at 18.30.09.png"
                >
                  <source src="https://res.cloudinary.com/doprdld4l/video/upload/v1751125990/xwgvs6glimc6uxdbuioc.mov" type="video/mp4" />
                  {/* Fallback for browsers that don't support video */}
                  <img
                    src="/Screenshot 2025-06-28 at 18.30.09.png"
                    alt="Discover Diani Chat Interface"
                    className="w-full h-auto rounded-3xl shadow-2xl"
                  />
                </video>
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
          
          {/* Partner logos infinite slider */}
          <div className="opacity-80">
            <InfiniteSlider gap={48} duration={20} reverse className="w-full">
              <img
                src="https://res.cloudinary.com/doprdld4l/image/upload/v1751030563/logo_ws5qgw.png"
                alt="Partner logo"
                className="h-[80px] w-auto filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
              />
              <img
                src="https://res.cloudinary.com/doprdld4l/image/upload/v1751030562/logo_1_ydzo6h.png"
                alt="Partner logo"
                className="h-[80px] w-auto filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
              />
              <img
                src="https://res.cloudinary.com/doprdld4l/image/upload/v1751030562/bp_logo_y3ayle.png"
                alt="Partner logo"
                className="h-[80px] w-auto filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
              />
              <img
                src="https://res.cloudinary.com/doprdld4l/image/upload/v1751030596/leonardos514082_kxl07z.png"
                alt="Partner logo"
                className="h-[80px] w-auto filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
              />
              <img
                src="https://res.cloudinary.com/doprdld4l/image/upload/v1751030595/diani-bikes-logo_qq4vqk.png"
                alt="Partner logo"
                className="h-[80px] w-auto filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
              />
              <img
                src="https://res.cloudinary.com/doprdld4l/image/upload/v1751030597/saltys-logo_asoah4.png"
                alt="Partner logo"
                className="h-[80px] w-auto filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
              />
            </InfiniteSlider>
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

      {/* Business Listing CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-diani-teal-500 to-diani-teal-700">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="bg-white/10 rounded-3xl p-6 sm:p-8 md:p-12 backdrop-blur-sm border border-white/20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Own a Business in Diani?
            </h2>
            <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join hundreds of local businesses reaching thousands of travelers. 
              Get featured in AI-powered recommendations and boost your visibility.
            </p>
            <Button
              onClick={() => setBusinessModalOpen(true)}
              size="lg"
              className="w-full sm:w-auto bg-white text-diani-teal-700 hover:bg-diani-sand-50 px-4 sm:px-8 py-3 sm:py-6 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              List Your Business
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
                <Link to="/info" className="hover:text-diani-teal-300 transition-colors">Essential Info</Link>
                <span className="text-diani-sand-500">•</span>
                <a href="#" className="hover:text-diani-teal-300 transition-colors">Terms</a>
                <span className="text-diani-sand-500">•</span>
                <a href="#" className="hover:text-diani-teal-300 transition-colors">Privacy</a>
                <span className="text-diani-sand-500">•</span>
                <a href="#" className="hover:text-diani-teal-300 transition-colors">Contact</a>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-diani-sand-400">
                Powered by <a href="https://zaidilabstudio.com/" target="_blank" rel="noopener noreferrer" className="text-coral-sunset-300 font-semibold hover:text-coral-sunset-200 transition-colors">ZaidiLab</a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <StoreModal
        isOpen={storeModalOpen}
        onClose={() => setStoreModalOpen(false)}
        storeName={selectedStore}
      />
      <BusinessListingModal
        isOpen={businessModalOpen}
        onClose={() => setBusinessModalOpen(false)}
      />
    </div>
  );
};

export default LandingPage;