import React from 'react';
import { ArrowLeft, Phone, MapPin, AlertTriangle, Heart, Clock, DollarSign, Wifi, Car, Plane, Shield, Utensils, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const InfoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-diani-teal-50 via-coral-sunset-50 to-diani-sand-50">
      {/* Header */}
      <header className="glass-static border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-diani-sand-700 hover:text-diani-teal-700 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
          <img 
            src="/discover_diani_website_logo.png" 
            alt="Discover Diani Logo" 
            className="h-8 w-auto"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-diani-sand-900 mb-4">
            Essential Diani Information
          </h1>
          <p className="text-lg text-diani-sand-700 max-w-2xl mx-auto">
            Everything you need to know for a safe and enjoyable stay in Diani Beach, Kenya.
            This information is available offline for your convenience.
          </p>
        </div>

        <div className="grid gap-6 md:gap-8">
          {/* Emergency Contacts */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-800">Police Emergency</h4>
                  <p className="flex items-center gap-2 text-red-700">
                    <Phone size={16} />
                    <span className="font-mono">999 or 112</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-800">Medical Emergency</h4>
                  <p className="flex items-center gap-2 text-red-700">
                    <Phone size={16} />
                    <span className="font-mono">999 or 112</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-800">Diani Beach Hospital</h4>
                  <p className="flex items-center gap-2 text-red-700">
                    <Phone size={16} />
                    <span className="font-mono">+254 40 320 2104</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-800">Tourist Police</h4>
                  <p className="flex items-center gap-2 text-red-700">
                    <Phone size={16} />
                    <span className="font-mono">+254 20 341 6000</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transportation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-diani-sand-900">
                <Car className="h-5 w-5" />
                Transportation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-diani-sand-800 mb-3">Local Transport</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-medium text-diani-sand-700">Tuk-tuk (Auto-rickshaw)</h5>
                    <p className="text-sm text-diani-sand-600">
                      • Short distances: KES 50-200<br/>
                      • Always negotiate fare before starting<br/>
                      • Available 24/7 along main roads
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-diani-sand-700">Bodaboda (Motorcycle taxi)</h5>
                    <p className="text-sm text-diani-sand-600">
                      • Short distances: KES 50-150<br/>
                      • Helmet should be provided<br/>
                      • Faster but less safe than tuk-tuk
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-diani-sand-700">Matatu (Shared minibus)</h5>
                    <p className="text-sm text-diani-sand-600">
                      • To Ukunda: KES 30-50<br/>
                      • To Mombasa: KES 100-150<br/>
                      • Fixed routes, very affordable
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-diani-sand-700">Taxi Services</h5>
                    <p className="text-sm text-diani-sand-600">
                      • Airport transfers: KES 2,000-3,500<br/>
                      • Uber/Bolt available in some areas<br/>
                      • Hotel taxis more expensive
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold text-diani-sand-800 mb-3">Airport Information</h4>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-diani-sand-700">Ukunda Airstrip (UKA)</h5>
                    <p className="text-sm text-diani-sand-600">
                      • 10 minutes from Diani Beach<br/>
                      • Domestic flights only<br/>
                      • Taxi to beach: KES 500-800
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-diani-sand-700">Moi International Airport (MBA)</h5>
                    <p className="text-sm text-diani-sand-600">
                      • 45-60 minutes from Diani Beach<br/>
                      • International and domestic flights<br/>
                      • Taxi to beach: KES 2,500-3,500
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Currency & Money */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-diani-sand-900">
                <DollarSign className="h-5 w-5" />
                Currency & Money
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Currency</h4>
                  <p className="text-sm text-diani-sand-600">
                    • Kenyan Shilling (KES)<br/>
                    • 1 USD ≈ 150 KES (rates vary)<br/>
                    • Coins: 1, 5, 10, 20, 40 KES<br/>
                    • Notes: 50, 100, 200, 500, 1000 KES
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">ATMs & Banking</h4>
                  <p className="text-sm text-diani-sand-600">
                    • ATMs available at major hotels<br/>
                    • Barclays, KCB, Equity Bank ATMs<br/>
                    • Withdrawal fees: KES 35-50<br/>
                    • Daily limit: KES 40,000-100,000
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Mobile Money</h4>
                  <p className="text-sm text-diani-sand-600">
                    • M-Pesa widely accepted<br/>
                    • Airtel Money also available<br/>
                    • Many shops accept mobile payments<br/>
                    • Convenient for small purchases
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Credit Cards</h4>
                  <p className="text-sm text-diani-sand-600">
                    • Accepted at hotels and restaurants<br/>
                    • Visa and Mastercard preferred<br/>
                    • Small shops prefer cash<br/>
                    • Notify bank before travel
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-diani-sand-900">
                <Shield className="h-5 w-5" />
                Safety & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Beach Safety</h4>
                  <ul className="text-sm text-diani-sand-600 space-y-1">
                    <li>• Swim only in designated areas</li>
                    <li>• Be aware of strong currents</li>
                    <li>• Don't swim alone, especially at night</li>
                    <li>• Watch for sea urchins in rocky areas</li>
                    <li>• Use reef-safe sunscreen</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Personal Security</h4>
                  <ul className="text-sm text-diani-sand-600 space-y-1">
                    <li>• Don't display expensive items</li>
                    <li>• Use hotel safes for valuables</li>
                    <li>• Avoid walking alone at night</li>
                    <li>• Be cautious with beach vendors</li>
                    <li>• Keep copies of important documents</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Health Precautions</h4>
                  <ul className="text-sm text-diani-sand-600 space-y-1">
                    <li>• Drink bottled or filtered water</li>
                    <li>• Use mosquito repellent (malaria risk)</li>
                    <li>• Eat at reputable establishments</li>
                    <li>• Carry hand sanitizer</li>
                    <li>• Have travel insurance</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Scam Awareness</h4>
                  <ul className="text-sm text-diani-sand-600 space-y-1">
                    <li>• Fake tour operators</li>
                    <li>• Overpriced "special deals"</li>
                    <li>• Gem/jewelry scams</li>
                    <li>• Fake charity requests</li>
                    <li>• Always verify credentials</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Local Customs & Etiquette */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-diani-sand-900">
                <Heart className="h-5 w-5" />
                Local Customs & Etiquette
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Greetings</h4>
                  <ul className="text-sm text-diani-sand-600 space-y-1">
                    <li>• "Jambo" (Hello) - universal greeting</li>
                    <li>• "Asante" (Thank you)</li>
                    <li>• "Karibu" (Welcome/You're welcome)</li>
                    <li>• Handshakes are common</li>
                    <li>• Respect for elders is important</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Dress Code</h4>
                  <ul className="text-sm text-diani-sand-600 space-y-1">
                    <li>• Modest dress away from beach</li>
                    <li>• Cover shoulders in religious sites</li>
                    <li>• Swimwear only at beach/pool</li>
                    <li>• Light, breathable fabrics recommended</li>
                    <li>• Respect local sensibilities</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Tipping</h4>
                  <ul className="text-sm text-diani-sand-600 space-y-1">
                    <li>• Restaurants: 10-15% if no service charge</li>
                    <li>• Hotel staff: KES 100-500 per day</li>
                    <li>• Tour guides: KES 500-1,000 per day</li>
                    <li>• Taxi drivers: Round up fare</li>
                    <li>• Tipping is appreciated but not mandatory</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Photography</h4>
                  <ul className="text-sm text-diani-sand-600 space-y-1">
                    <li>• Ask permission before photographing people</li>
                    <li>• Some may request payment</li>
                    <li>• Avoid military/government buildings</li>
                    <li>• Respect privacy in local communities</li>
                    <li>• Beach photography generally okay</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Useful Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-diani-sand-900">
                <Clock className="h-5 w-5" />
                Useful Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Time Zone</h4>
                  <p className="text-sm text-diani-sand-600">
                    East Africa Time (EAT)<br/>
                    UTC+3 (no daylight saving)
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Language</h4>
                  <p className="text-sm text-diani-sand-600">
                    Official: English & Swahili<br/>
                    Most tourism staff speak English
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Electricity</h4>
                  <p className="text-sm text-diani-sand-600">
                    240V, 50Hz<br/>
                    Type G plugs (3-pin UK style)
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Internet</h4>
                  <p className="text-sm text-diani-sand-600">
                    WiFi available at most hotels<br/>
                    Mobile data widely available
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather & Best Times */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-diani-sand-900">
                <Activity className="h-5 w-5" />
                Weather & Best Times to Visit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Dry Seasons (Best)</h4>
                  <p className="text-sm text-diani-sand-600">
                    <strong>December - March:</strong> Hot & dry (26-32°C)<br/>
                    <strong>July - October:</strong> Cooler & dry (24-28°C)<br/>
                    Perfect for beach activities and water sports
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Rainy Seasons</h4>
                  <p className="text-sm text-diani-sand-600">
                    <strong>April - June:</strong> Long rains<br/>
                    <strong>November:</strong> Short rains<br/>
                    Lower prices, fewer crowds, lush vegetation
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">What to Pack</h4>
                  <ul className="text-sm text-diani-sand-600 space-y-1">
                    <li>• Light, breathable clothing</li>
                    <li>• Sunscreen (SPF 30+)</li>
                    <li>• Insect repellent</li>
                    <li>• Comfortable walking shoes</li>
                    <li>• Light rain jacket</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Activities by Season</h4>
                  <ul className="text-sm text-diani-sand-600 space-y-1">
                    <li>• Kite surfing: June - September</li>
                    <li>• Diving: October - March</li>
                    <li>• Whale watching: July - September</li>
                    <li>• Dhow sailing: Year-round</li>
                    <li>• Beach activities: Year-round</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-diani-sand-900">
                <MapPin className="h-5 w-5" />
                Important Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Shopping Centers</h4>
                  <ul className="text-sm text-diani-sand-600 space-y-1">
                    <li>• Diani Beach Shopping Centre</li>
                    <li>• Nakumatt Diani (supermarket)</li>
                    <li>• Ukunda Market (local goods)</li>
                    <li>• Various beach craft markets</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Medical Facilities</h4>
                  <ul className="text-sm text-diani-sand-600 space-y-1">
                    <li>• Diani Beach Hospital</li>
                    <li>• Msambweni District Hospital</li>
                    <li>• Various private clinics</li>
                    <li>• Pharmacies in shopping centers</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Banks & ATMs</h4>
                  <ul className="text-sm text-diani-sand-600 space-y-1">
                    <li>• Barclays Bank Diani</li>
                    <li>• KCB Bank Ukunda</li>
                    <li>• Equity Bank branches</li>
                    <li>• ATMs at major hotels</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-diani-sand-800">Religious Sites</h4>
                  <ul className="text-sm text-diani-sand-600 space-y-1">
                    <li>• Various churches (Christian)</li>
                    <li>• Mosques (Islamic)</li>
                    <li>• Hindu temples</li>
                    <li>• All welcome visitors respectfully</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <div className="bg-diani-teal-50 border border-diani-teal-200 rounded-lg p-6">
            <h3 className="font-semibold text-diani-teal-800 mb-2">
              📱 Available Offline
            </h3>
            <p className="text-sm text-diani-teal-700">
              This information is cached on your device and available even without internet connection.
              For real-time updates and personalized recommendations, use our AI chat when online.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InfoPage;