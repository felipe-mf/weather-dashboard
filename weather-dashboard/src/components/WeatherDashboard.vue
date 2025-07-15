<template>
  
  <div class="dashboard">
    <h1>Weather Dashboard</h1>
    <h3>Real time weather insights</h3>
      
    <div class="search">
      <input 
        v-model="city" 
        placeholder="Enter city name" 
        @keyup.enter="fetchWeather" 
      />
      <button @click="fetchWeather">Search</button>
    </div>

    <template v-if="!errorMessage">
      <WeatherInfo :weather="weather" />
      <WeatherForecast :forecast="forecast" />
    </template>

    <div v-else class="error">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import WeatherInfo from './WeatherInfo.vue'
import WeatherForecast from './WeatherForecast.vue'
import type { WeatherData, ForecastItem } from '../types/weather'

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
    console.log(weatherRes.data)


    const forecastRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city.value}&appid=${apiKey}&units=metric`
    )

    // console.log(forecastRes.data)

    forecast.value = forecastRes.data.list.filter((entry: ForecastItem) => 
      entry.dt_txt.includes('12:00:00')
    ).slice(0, 5)

    //console.log(forecast.value)

  } catch (error: any) {
    errorMessage.value = 'Invalid city name.'
    console.error(error)
  }
}

</script>

<style scoped>

.dashboard {
  text-align: center;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #cee4fa 0%, #2998ed 100%);
  min-height: 100vh;
  color: white;
  border-radius: 0;
  box-sizing: border-box;
  overflow-x: hidden;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.dashboard h1 {
  font-size: 3rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  line-height: 1.2;
}
.dashboard h3 {
  font-size: 1.2rem;
  font-weight: 300;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
  opacity: 0.8;
}

.search {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search input {
  padding: 0.9rem 1.5rem;
  font-size: 1rem;
  width: 300px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  outline: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search input:focus {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.search input::placeholder {
  color: #999;
}

.search button {
  padding: 0.8rem 1rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.search button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.error {
  color: #fe0808;
  margin-top: 1rem;
  padding: 1rem;
  font-size: 1.1rem;
}

@media (max-width: 1400px) {
  .dashboard {
    padding: 1.5rem;
  }
}

@media (max-width: 1200px) {
  .dashboard {
    padding: 1rem;
  }
  
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }
  
  .dashboard h1 {
    font-size: 2.5rem;
  }
  
  .search {
    flex-direction: column;
    gap: 1rem;
  }
  
  .search input {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .dashboard {
    padding: 0.5rem;
  }
  
  .dashboard h1 {
    font-size: 2rem;
  }
  
  .forecast {
    padding: 1.5rem;
  }
}
</style>