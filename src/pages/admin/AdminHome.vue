<template>
  <div>
    <h3 class="mb-4">{{ $t('dashboard.welcome') }}</h3>

    <!-- Thống kê -->
    <div class="row g-4 mb-4">
      <div class="col-md-3" v-for="stat in stats" :key="stat.label">
        <div class="card shadow-sm text-center p-3">
          <div class="fs-2 text-primary mb-2">
            <i :class="stat.icon"></i>
          </div>
          <h5>{{ stat.label }}</h5>
          <p class="fw-bold fs-4">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- Biểu đồ -->
    <div class="row g-4 mb-4">
      <div class="col-md-6">
        <div class="card shadow-sm p-3">
          <h5 class="mb-3">{{ $t('dashboard.monthly_revenue') }}</h5>
          <BarChart :chart-data="revenueData" />
        </div>
      </div>
      <div class="col-md-6">
        <div class="card shadow-sm p-3">
          <h5 class="mb-3">{{ $t('dashboard.monthly_orders') }}</h5>
          <LineChart :chart-data="orderData" />
        </div>
      </div>
    </div>

    <!-- Đơn hàng gần đây -->
    <div class="card shadow-sm p-3">
      <h5 class="mb-3">{{ $t('dashboard.recent_orders') }}</h5>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>{{ $t('dashboard.id') }}</th>
            <th>{{ $t('dashboard.customer') }}</th>
            <th>{{ $t('dashboard.date') }}</th>
            <th>{{ $t('dashboard.total') }}</th>
            <th>{{ $t('dashboard.status') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in recentOrders" :key="order.id">
            <td>#{{ order.id }}</td>
            <td>{{ order.user?.name || 'Khách hàng' }}</td>
            <td>{{ new Date(order.created_at || order.date).toLocaleDateString() }}</td>
            <td>{{ formatPrice(order.total_price || 0) }}</td>
            <td>
              <span :class="['badge', getStatusClass(order.status)]">{{ getStatusName(order.status) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../store/auth'
import { useI18n } from 'vue-i18n'
import BarChart from '../../charts/BarChart.vue'
import LineChart from '../../charts/LineChart.vue'

const auth = useAuthStore()
const { t } = useI18n()
const API = import.meta.env.VITE_API_BASE_URL

const formatPrice = (val: number) => new Intl.NumberFormat('vi-VN').format(val) + '₫'

const totalUsers = ref(0)
const totalOrders = ref(0)
const totalProducts = ref(0)
const totalRevenue = ref(0)
const recentOrders = ref<any[]>([])

const stats = computed(() => [
  { label: t('dashboard.users'), value: totalUsers.value, icon: 'bi bi-people' },
  { label: t('dashboard.orders'), value: totalOrders.value, icon: 'bi bi-bag-check' },
  { label: t('dashboard.products'), value: totalProducts.value, icon: 'bi bi-box' },
  { label: t('dashboard.revenue'), value: formatPrice(totalRevenue.value), icon: 'bi bi-currency-dollar' },
])

const chartData = ref({ labels: [], revenue: [], orders: [] })

const loadData = async () => {
  try {
    const headers = { Authorization: `Bearer ${auth.token}` }
    const res = await axios.get(`${API}/dashboard/stats`, { headers })
    
    const data = res.data

    totalUsers.value = data.total_users || 0
    totalOrders.value = data.total_orders || 0
    totalProducts.value = data.total_products || 0
    totalRevenue.value = data.total_revenue || 0
    recentOrders.value = data.recent_orders || []

    chartData.value = data.chart || { labels: [], revenue: [], orders: [] }
  } catch(e) { console.error('Load Error') }
}

onMounted(loadData)

const revenueData = computed(() => ({
  labels: chartData.value.labels,
  datasets: [
    {
      label: 'Doanh thu (VNĐ)',
      backgroundColor: '#0d6efd',
      data: chartData.value.revenue,
    },
  ],
}))

const orderData = computed(() => ({
  labels: chartData.value.labels,
  datasets: [
    {
      label: 'Số đơn hàng',
      borderColor: '#198754',
      data: chartData.value.orders,
      fill: false,
      tension: 0.4,
    },
  ],
}))

const getStatusName = (status: string) => {
  if (status === 'Đã giao' || status === 'completed') return t('dashboard.delivered')
  if (status === 'Đang xử lý' || status === 'pending') return t('dashboard.processing')
  if (status === 'Đã hủy' || status === 'cancelled') return t('dashboard.cancelled')
  return status
}

const getStatusClass = (status: string) => {
  if (status === 'Đã giao' || status === 'completed') return 'bg-success'
  if (status === 'Đang xử lý' || status === 'pending') return 'bg-warning text-dark'
  if (status === 'Đã hủy' || status === 'cancelled') return 'bg-danger'
  return 'bg-secondary'
}
</script>

<style scoped>
.card {
  border-left: 5px solid #0d6efd;
  transition: transform 0.2s;
}
.card:hover {
  transform: scale(1.02);
}
</style>
