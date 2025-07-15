<template>
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ForecastItem, DailyData, ChartSeries } from '../types/weather'

const props = defineProps<{
  forecast: ForecastItem[]
}>()

const getDailyData = (): DailyData[] => {
  if (!props.forecast.length) return []
  
  const dailyData: DailyData[] = []
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  props.forecast.forEach((item: ForecastItem) => {
    const date = new Date(item.dt_txt)
    const dayName = dayNames[date.getDay()]
    
    dailyData.push({
      day: dayName,
      temp: Math.round(item.main.temp),
      humidity: item.main.humidity,
      precipitation: item.rain ? item.rain['3h'] || 0 : 0
    })
  })
  
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
    theme: 'dark',
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
    theme: 'dark',
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
    theme: 'dark',
    y: {
      formatter: (val: number) => `${val}mm`
    }
  }
}))
</script>

<style scoped>

.analytics-container {
  margin-top: 1.5rem;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid #ddd;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  overflow-x: hidden;
}

.analytics-container h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #64748b;
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
  padding: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 280px;
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
  .charts-grid {
    gap: 1.5rem;
  }
  
  .chart-card {
    padding: 1.2rem;
    min-height: 300px;
  }
}

@media (max-width: 1200px) {
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
</style>
