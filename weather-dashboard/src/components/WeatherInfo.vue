<template>
  <div v-if="weather && weather.main" class="weather-container">
    <div class="main-weather-card">
      <div class="weather-content">

        <div class="main-info">
          <div class="location">
            <h2>{{ weather.name }}, {{ weather.sys?.country || '?' }}</h2>
          </div>
          
          <div class="temperature">
            <img 
              v-if="weather.weather[0].icon" 
              :src="getWeatherIconUrl(weather.weather[0].icon)" 
              :alt="weather.weather[0].description"
              class="weather-icon"
            />
            <span class="temp-value">{{ Math.round(weather.main.temp) }}°C</span>
          </div>
          
          <div class="condition">
            <p class="condition-text capitalize">{{ weather.weather[0].description }}</p>
            <p class="feels-like">Feels like {{ Math.round(weather.main.feels_like) }}°C</p>
          </div>
        </div>

        <div class="weather-details">
          <div class="detail-card">
            <div class="detail-icon">💧</div>
            <div class="detail-content">
              <span class="detail-label">Humidity</span>
              <span class="detail-value">{{ weather.main.humidity }}<span class="unit"> %</span></span>
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-icon">💨</div>
            <div class="detail-content">
              <span class="detail-label">Wind Speed</span>
              <span class="detail-value">{{ weather.wind?.speed || 0 }}<span class="unit"> m/s</span></span>
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-icon">🌡️</div>
            <div class="detail-content">
              <span class="detail-label">Pressure</span>
              <span class="detail-value">{{ weather.main.pressure }}<span class="unit"> hPa</span></span>
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-icon">👁️</div>
            <div class="detail-content">
              <span class="detail-label">Visibility</span>
              <span class="detail-value">{{ weather.visibility ? Math.round(weather.visibility / 1000) : 10 }}<span class="unit"> km</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WeatherData } from '../types/weather'

defineProps<{
  weather: WeatherData | null
}>()

const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}
</script>

<style scoped>
.weather-container {
  margin-top: 1.5rem;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.main-weather-card {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  padding: 2.5rem;
  border-radius: 20px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-height: 220px;
}

.weather-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13rem;
  min-height: 220px;
}

.main-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  min-width: 280px;
  max-width: 320px;
  justify-content: center;
}

.location h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.temperature {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.weather-icon {
  width: 80px;
  height: 80px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.temp-value {
  font-size: 4rem;
  font-weight: 400;
  color: #2c3e50;
  line-height: 1;
}

.condition {
  text-align: center;
}

.condition-text {
  font-size: 1.2rem;
  color: #546e7a;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.capitalize {
  text-transform: capitalize;
}

.feels-like {
  font-size: 1rem;
  color: #78909c;
  margin: 0;
}

.weather-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  flex: 1;
  max-width: 450px;
  align-content: center;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.detail-card {
  background: rgba(255, 255, 255, 0.2);
  padding: 1rem 3.5rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.3rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  backdrop-filter: blur(10px);
  min-height: 100px;
  min-width: 160px;
}

.detail-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.6);
}

.detail-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.detail-label {
  font-size: 0.95rem;
  color: #78909c;
  font-weight: 500;
}

.detail-value {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
}

.unit {
  font-size: 0.9rem;
  font-weight: 400;
  color: #78909c;
}

@media (max-width: 768px) {
  .weather-content {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
  
  .main-info {
    align-items: center;
    text-align: center;
    min-width: unset;
  }
  
  .condition {
    text-align: center;
  }
  
  .location h2 {
    text-align: center;
  }
  
  .weather-details {
    max-width: 100%;
    width: 100%;
  }
  
  .main-weather-card {
    padding: 1.5rem;
  }
  
  .temp-value {
    font-size: 3rem;
  }
  
  .weather-icon {
    width: 60px;
    height: 60px;
  }
  
  .detail-card {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .weather-details {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
  
  .detail-card {
    padding: 1rem;
  }
  
  .detail-icon {
    font-size: 1.5rem;
  }
  
  .detail-value {
    font-size: 1.1rem;
  }
  
  .weather-icon {
    width: 50px;
    height: 50px;
  }
  
  .temp-value {
    font-size: 2.5rem;
  }
}
</style>