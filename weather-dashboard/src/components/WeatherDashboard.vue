<template>
  
  <div class="dashboard">
    <h1>Weather Dashboard</h1>
    
    <div class="search">
      <input 
        v-model="city" 
        placeholder="Enter city name" 
        @keyup.enter="fetchWeather" 
      />
      <button @click="fetchWeather">Search</button>
    </div>

    <!-- v-if directive in Vue.js is used for conditional rendering of elements  -->
    <div v-if="weather && weather.main" class="weather-info">
      <h2>{{ weather.name }}</h2>
      <p><strong>Temperature:</strong> {{ weather.main.temp }}°C</p>
      <p><strong>Feels like:</strong> {{ weather.main.feels_like }}°C</p>
      <p><strong>Condition:</strong> {{ weather.weather[0].description }}</p>
      <p><strong>Humidity:</strong> {{ weather.main.humidity }}%</p>
    </div>

    <div v-if="forecast.length" class="analytics-container">
      <h2>5-Day Forecast Analytics</h2>
      <div class="charts-grid">
        <div class="chart-card">
          <h3>Temperature Trend</h3>
          <vue-apex-charts
            type="area"
            height="250"
            :options="temperatureChartOptions"
            :series="temperatureSeries"
          />
        </div>

        <div class="chart-card">
          <h3>Humidity Levels</h3>
          <vue-apex-charts
            type="bar"
            height="250"
            :options="humidityChartOptions"
            :series="humiditySeries"
          />
        </div>

        <div class="chart-card">
          <h3>Precipitation</h3>
          <vue-apex-charts
            type="line"
            height="250"
            :options="precipitationChartOptions"
            :series="precipitationSeries"
          />
        </div>
      </div>
    </div>

    <div v-else-if="errorMessage" class="error">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import VueApexCharts from 'vue3-apexcharts'

interface WeatherData {
  name: string
  main: {
    temp: number
    feels_like: number
    humidity: number
  }
  weather: Array<{
    description: string
  }>
}

interface ForecastItem {
  dt_txt: string
  main: {
    temp: number
    humidity: number
  }
  rain?: {
    '3h': number
  }
}

interface DailyData {
  day: string
  temp: number
  humidity: number
  precipitation: number
}

interface ChartSeries {
  name: string
  data: number[]
}

const city = ref('')
const weather = ref<WeatherData | null>(null)
const forecast = ref<ForecastItem[]>([])
const errorMessage = ref('')

const fetchWeather = async () => {
  errorMessage.value = ''
  weather.value = null
  forecast.value = []

  if (!city.value) {
    errorMessage.value = 'Please enter a city name.'
    return
  }

  try {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY

    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}&units=metric`
    )
    weather.value = weatherRes.data

    const forecastRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city.value}&appid=${apiKey}&units=metric`
    )

    //console.log(forecastRes.data)

    forecast.value = forecastRes.data.list.filter((entry: ForecastItem) => 
      entry.dt_txt.includes('12:00:00')
    ).slice(0, 5)

    //console.log(forecast.value)

  } catch (error: any) {
    errorMessage.value = 'Failed to fetch weather data.'
    console.error(error)
  }
}

// const formatDate = (dt: string): string => {
//   const date = new Date(dt)
//   return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
// }

// const formatDateTime = (dt: string): string => {
//   const date = new Date(dt)
//   return date.toLocaleDateString(undefined, { 
//     month: 'short', 
//     day: 'numeric', 
//     hour: '2-digit'
//   })
// }

// doesnt need to get parameters, returns array of daily data
const getDailyData = (): DailyData[] => {
  if (!forecast.value.length) return []
  
  const dailyData: DailyData[] = []
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  forecast.value.forEach((item: ForecastItem) => {
    const date = new Date(item.dt_txt)
    const dayName = dayNames[date.getDay()]

    // console.log("debugging")
    // console.log(item.main.humidity)
    
    dailyData.push({
      day: dayName,
      temp: Math.round(item.main.temp),
      humidity: item.main.humidity,
      precipitation: item.rain ? item.rain['3h'] || 0 : 0
    })
  })
  
  // console.log(dailyData)
  return dailyData
}

const temperatureSeries = computed((): ChartSeries[] => {
  const dailyData = getDailyData()
  
  return [{
    name: 'Temperature',
    data: dailyData.map(item => item.temp)
  }]
})

const temperatureChartOptions = computed(() => ({
  chart: {
    id: 'temperature-chart',
    type: 'area',
    sparkline: {
      enabled: false
    },
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
      stops: [0, 90, 100]
    }
  },
  colors: ['#3b82f6'],
  grid: {
    show: false
  },
  xaxis: {
    categories: getDailyData().map(item => item.day),
    labels: {
      style: {
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    show: false
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: (val: number) => `${val}°C`
    }
  }
}))

const humiditySeries = computed((): ChartSeries[] => {
  const dailyData = getDailyData()
  
  return [{
    name: 'Humidity',
    data: dailyData.map(item => item.humidity)
  }]
})

const humidityChartOptions = computed(() => ({
  chart: {
    id: 'humidity-chart',
    type: 'bar',
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      dataLabels: {
        position: 'center'
      }
    }
  },
  dataLabels: {
    enabled: true,
    style: {
      colors: ['#fff'],
      fontSize: '12px',
      fontWeight: 'bold'
    }
  },
  colors: ['#3b82f6'],
  grid: {
    show: false
  },
  xaxis: {
    categories: getDailyData().map(item => item.day),
    labels: {
      style: {
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    show: false,
    min: 0,
    max: 100
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: (val: number) => `${val}%`
    }
  }
}))

const precipitationSeries = computed((): ChartSeries[] => {
  const dailyData = getDailyData()
  
  return [{
    name: 'Precipitation',
    data: dailyData.map(item => item.precipitation)
  }]
})

const precipitationChartOptions = computed(() => ({
  chart: {
    id: 'precipitation-chart',
    type: 'line',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  colors: ['#3b82f6'],
  grid: {
    show: false
  },
  xaxis: {
    categories: getDailyData().map(item => item.day),
    labels: {
      style: {
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    show: false,
    min: 0
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: (val: number) => `${val}mm`
    }
  }
}))
</script>

<style scoped>
.dashboard {
  width: 100%;
  max-width: 100vw;
  margin: auto;
  text-align: center;
  padding: 2rem;
  font-family: Arial, sans-serif;
  background-color: #d6f5ff;
  color: #4d4d4d;
  border-radius: 25px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  overflow-x: hidden;
}

.search {
  margin-bottom: 1rem;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
  width: 70%;
  max-width: 300px;
  margin-right: 0.5rem;
  border: 1px solid rgb(202, 238, 253);
  border-radius: 9px;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.weather-info,
.forecast,
.analytics-container {
  margin-top: 1.5rem;
  background: #eefafe;
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid #ddd;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.analytics-container h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
  width: 100%;
  box-sizing: border-box;
}

.chart-card {
  background: #d4e6f8;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 320px;
  box-sizing: border-box;
  overflow: hidden;
}

.chart-card h3 {
  margin: 0 0 1rem 0;
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
}

@media (max-width: 1400px) {
  .dashboard {
    padding: 1.5rem;
  }
  
  .charts-grid {
    gap: 1.5rem;
  }
  
  .chart-card {
    padding: 1.2rem;
    min-height: 300px;
  }
}

@media (max-width: 1200px) {
  .dashboard {
    padding: 1rem;
  }
  
  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .chart-card {
    padding: 1rem;
    min-height: 280px;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 0.8rem;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .chart-card {
    padding: 1rem;
    min-height: 260px;
  }
  
  .chart-card h3 {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .dashboard {
    padding: 0.5rem;
    border-radius: 15px;
  }
  
  .analytics-container {
    padding: 1rem;
  }
  
  .charts-grid {
    gap: 0.8rem;
  }
  
  .chart-card {
    padding: 0.8rem;
    min-height: 240px;
  }
}

.forecast-grid {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.forecast-card {
  flex: 1 1 100px;
  min-width: 100px;
  background-color: #e3f2fd;
  border-radius: 8px;
  padding: 0.5rem;
}

.error {
  color: #f44336;
  margin-top: 1rem;
}
</style>