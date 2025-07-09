interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  icon: string;
}

export type { WeatherData };

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const DIANI_COORDINATES = { lat: -4.3167, lng: 39.5667 };

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

// Get current weather data from OpenWeather API
export const getWeatherData = async (): Promise<WeatherData> => {
  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeather API key not found, using mock data');
    return getMockWeatherData();
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${DIANI_COORDINATES.lat}&lon=${DIANI_COORDINATES.lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Get UV Index data (requires separate API call)
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

    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description.replace(/\b\w/g, (l: string) => l.toUpperCase()),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      uvIndex,
      icon: getWeatherIcon(data.weather[0].main, isDay),
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return getMockWeatherData();
  }
};

// Get 5-day forecast from OpenWeather API
export const getForecast = async (): Promise<Array<{ day: string; high: number; low: number; icon: string }>> => {
  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeather API key not found, using mock data');
    return getMockForecast();
  }

  try {
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
    const forecast = Object.entries(dailyForecasts)
      .slice(0, 5)
      .map(([day, data]) => ({
        day,
        high: Math.round(Math.max(...data.temps)),
        low: Math.round(Math.min(...data.temps)),
        icon: getWeatherIcon(data.conditions[0], true),
      }));

    return forecast;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return getMockForecast();
  }
};

// Fallback mock data for when API is unavailable
const getMockWeatherData = (): WeatherData => {
  const conditions = [
    { condition: 'Sunny', icon: '☀️', temp: [26, 32] },
    { condition: 'Partly Cloudy', icon: '⛅', temp: [25, 30] },
    { condition: 'Cloudy', icon: '☁️', temp: [24, 28] },
    { condition: 'Light Rain', icon: '🌦️', temp: [23, 27] },
  ];
  
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const temperature = Math.floor(Math.random() * (randomCondition.temp[1] - randomCondition.temp[0] + 1)) + randomCondition.temp[0];
  
  return {
    temperature,
    condition: randomCondition.condition,
    humidity: Math.floor(Math.random() * 20) + 60,
    windSpeed: Math.floor(Math.random() * 15) + 5,
    uvIndex: Math.floor(Math.random() * 4) + 7,
    icon: randomCondition.icon,
  };
};

const getMockForecast = (): Array<{ day: string; high: number; low: number; icon: string }> => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const icons = ['☀️', '⛅', '☁️', '🌦️'];
  
  return days.map(day => ({
    day,
    high: Math.floor(Math.random() * 4) + 28,
    low: Math.floor(Math.random() * 3) + 23,
    icon: icons[Math.floor(Math.random() * icons.length)],
  }));
};