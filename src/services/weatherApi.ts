interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  icon: string;
}

// Mock weather data for Diani Beach
// In production, this would connect to a real weather API
export const getWeatherData = async (): Promise<WeatherData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate realistic weather for Diani Beach
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
    humidity: Math.floor(Math.random() * 20) + 60, // 60-80%
    windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
    uvIndex: Math.floor(Math.random() * 4) + 7, // 7-11 (high)
    icon: randomCondition.icon,
  };
};

export const getForecast = async (): Promise<Array<{ day: string; high: number; low: number; icon: string }>> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const icons = ['☀️', '⛅', '☁️', '🌦️'];
  
  return days.map(day => ({
    day,
    high: Math.floor(Math.random() * 4) + 28,
    low: Math.floor(Math.random() * 3) + 23,
    icon: icons[Math.floor(Math.random() * icons.length)],
  }));
};
