export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  clouds: {
    all: number;
  };
  weather: Array<{
    description: string;
  }>;
}

export interface ForecastItem {
  dt_txt: string;
  main: {
    temp: number;
    humidity: number;
  };
  rain?: {
    "3h": number;
  };
}

export interface DailyData {
  day: string;
  temp: number;
  humidity: number;
  precipitation: number;
}

export interface ChartSeries {
  name: string;
  data: number[];
}
