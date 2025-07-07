<template>
  <div class="chart-wrapper">
    <Line :data="chartData" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

defineProps<{ chartData: any }>()

const options = {
  responsive: true,
  maintainAspectRatio: false
}
</script>

<style scoped>
.chart-wrapper {
  height: 300px;
}
</style>
