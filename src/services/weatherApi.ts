interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  icon: string;
}

export type { WeatherData };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Get current weather data from Supabase Edge Function
export const getWeatherData = async (): Promise<WeatherData> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/weather/current`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return getMockWeatherData();
  }
};

// Get 5-day forecast from Supabase Edge Function
export const getForecast = async (): Promise<Array<{ day: string; high: number; low: number; icon: string }>> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/weather/forecast`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
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