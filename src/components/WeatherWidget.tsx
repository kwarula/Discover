import React, { useState, useEffect } from 'react';
import { Cloud, Sun, Wind, Droplets, AlertTriangle } from 'lucide-react';
import { getWeatherData, getForecast } from '@/services/weatherApi';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const [weatherData, forecastData] = await Promise.all([
          getWeatherData(),
          getForecast()
        ]);
        setWeather(weatherData);
        setForecast(forecastData);
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather every 5 minutes
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glass rounded-2xl px-4 py-2 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full"></div>
          <div className="space-y-1">
            <div className="h-4 w-20 bg-white/20 rounded"></div>
            <div className="h-3 w-16 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const getUVIndexColor = (index: number) => {
    if (index <= 2) return 'text-green-500';
    if (index <= 5) return 'text-yellow-500';
    if (index <= 7) return 'text-orange-500';
    if (index <= 10) return 'text-red-500';
    return 'text-purple-500';
  };

  const getUVIndexLabel = (index: number) => {
    if (index <= 2) return 'Low';
    if (index <= 5) return 'Moderate';
    if (index <= 7) return 'High';
    if (index <= 10) return 'Very High';
    return 'Extreme';
  };

  return (
    <div 
      className={cn(
        "glass rounded-2xl transition-all duration-300 cursor-pointer hover-lift",
        isExpanded ? (
          isMobile 
            ? "fixed inset-x-2 top-16 z-50 shadow-xl max-w-sm mx-auto" 
            : "absolute right-4 top-16 z-50 shadow-xl"
        ) : ""
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className={`px-3 sm:px-4 py-2 ${isMobile && !isExpanded ? 'px-2' : ''}`}>
        <div className={`flex items-center ${isMobile && !isExpanded ? 'gap-2' : 'gap-3'}`}>
          <span className={`${isMobile && !isExpanded ? 'text-2xl' : 'text-3xl'}`}>{weather.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-diani-sand-800 ${
                isMobile && !isExpanded ? 'text-lg' : 'text-xl'
              }`}>
                {weather.temperature}°C
              </span>
              {(!isMobile || isExpanded) && (
                <span className="text-sm text-diani-sand-600">
                  {weather.condition}
                </span>
              )}
            </div>
            {(!isMobile || isExpanded) && (
              <div className="text-xs text-diani-sand-500">
                Diani Beach
              </div>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-white/20 px-4 py-3 space-y-3 animate-fade-in">
          {/* Current conditions */}
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Droplets size={14} className="text-blue-500" />
              <span className="text-diani-sand-700">{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind size={14} className="text-gray-500" />
              <span className="text-diani-sand-700">{weather.windSpeed} km/h</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertTriangle size={14} className={getUVIndexColor(weather.uvIndex)} />
              <span className="text-diani-sand-700">UV {weather.uvIndex}</span>
            </div>
          </div>

          {/* UV Index warning */}
          <div className={cn(
            "text-xs px-2 py-1 rounded-lg",
            weather.uvIndex > 7 ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
          )}>
            UV Index: {getUVIndexLabel(weather.uvIndex)} - {weather.uvIndex > 7 ? "Use sunscreen!" : "Enjoy the beach!"}
          </div>

          {/* 5-day forecast */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-diani-sand-600 mb-2">5-Day Forecast</div>
            <div className={`grid gap-2 ${
              isMobile ? 'grid-cols-3 sm:grid-cols-5' : 'grid-cols-5'
            }`}>
              {forecast.slice(0, isMobile ? 3 : 5).map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-diani-sand-500">{day.day}</div>
                  <div className="text-lg my-1">{day.icon}</div>
                  <div className="text-xs">
                    <span className="text-diani-sand-700">{day.high}°</span>
                    <span className="text-diani-sand-400 ml-1">{day.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Beach conditions */}
          <div className="text-xs text-center text-diani-sand-500 pt-2 border-t border-white/20">
            Perfect beach weather! 🏖️
          </div>
        </div>
      )}
    </div>
  );
};
