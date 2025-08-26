<template>
  <WeatherDashboard />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import WeatherDashboard from './components/WeatherDashboard.vue'

export default defineComponent({
  components: {
    WeatherDashboard
  }
})
</script>
