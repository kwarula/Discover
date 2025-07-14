import { corsHeaders } from '../_shared/cors.ts';

const OPENWEATHER_API_KEY = '90882e305649a3ac664ec4808842922f';
const DIANI_COORDINATES = { lat: -4.3167, lng: 39.5667 };

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  icon: string;
}

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  icon: string;
}

// Weather condition mapping to emojis
const getWeatherIcon = (condition: string, isDay: boolean = true): string => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('clear')) return isDay ? '☀️' : '🌙';
  if (conditionLower.includes('cloud')) {
    if (conditionLower.includes('few') || conditionLower.includes('scattered')) return '⛅';
    return '☁️';
  }
  if (conditionLower.includes('rain')) {
    if (conditionLower.includes('light')) return '🌦️';
    if (conditionLower.includes('heavy')) return '🌧️';
    return '🌧️';
  }
  if (conditionLower.includes('thunder')) return '⛈️';
  if (conditionLower.includes('snow')) return '❄️';
  if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️';
  
  return isDay ? '☀️' : '🌙';
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.pathname.split('/').pop();

    if (endpoint === 'current') {
      // Get current weather
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${DIANI_COORDINATES.lat}&lon=${DIANI_COORDINATES.lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Get UV Index data
      const uvResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/uvi?lat=${DIANI_COORDINATES.lat}&lon=${DIANI_COORDINATES.lng}&appid=${OPENWEATHER_API_KEY}`
      );
      
      let uvIndex = 7; // Default fallback
      if (uvResponse.ok) {
        const uvData = await uvResponse.json();
        uvIndex = Math.round(uvData.value || 7);
      }

      const currentHour = new Date().getHours();
      const isDay = currentHour >= 6 && currentHour < 18;

      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description.replace(/\b\w/g, (l: string) => l.toUpperCase()),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        uvIndex,
        icon: getWeatherIcon(data.weather[0].main, isDay),
      };

      return new Response(JSON.stringify(weatherData), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });

    } else if (endpoint === 'forecast') {
      // Get 5-day forecast
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${DIANI_COORDINATES.lat}&lon=${DIANI_COORDINATES.lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Group forecasts by day and get min/max temperatures
      const dailyForecasts: { [key: string]: { temps: number[]; conditions: string[] } } = {};
      
      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        if (!dailyForecasts[dayKey]) {
          dailyForecasts[dayKey] = { temps: [], conditions: [] };
        }
        
        dailyForecasts[dayKey].temps.push(item.main.temp);
        dailyForecasts[dayKey].conditions.push(item.weather[0].main);
      });

      // Convert to the expected format
      const forecast: ForecastDay[] = Object.entries(dailyForecasts)
        .slice(0, 5)
        .map(([day, data]) => ({
          day,
          high: Math.round(Math.max(...data.temps)),
          low: Math.round(Math.min(...data.temps)),
          icon: getWeatherIcon(data.conditions[0], true),
        }));

      return new Response(JSON.stringify(forecast), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });

    } else {
      return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

  } catch (error) {
    console.error('Weather function error:', error);
    
    // Return mock data as fallback
    const mockWeatherData: WeatherData = {
      temperature: 28,
      condition: 'Partly Cloudy',
      humidity: 75,
      windSpeed: 12,
      uvIndex: 8,
      icon: '⛅',
    };

    const mockForecast: ForecastDay[] = [
      { day: 'Mon', high: 30, low: 24, icon: '☀️' },
      { day: 'Tue', high: 29, low: 23, icon: '⛅' },
      { day: 'Wed', high: 28, low: 25, icon: '🌦️' },
      { day: 'Thu', high: 31, low: 24, icon: '☀️' },
      { day: 'Fri', high: 29, low: 23, icon: '⛅' },
    ];

    const endpoint = new URL(req.url).pathname.split('/').pop();
    const fallbackData = endpoint === 'forecast' ? mockForecast : mockWeatherData;

    return new Response(JSON.stringify(fallbackData), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});