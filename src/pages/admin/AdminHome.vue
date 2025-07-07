<template>
  <div>
    <h3 class="mb-4">🎉 Chào mừng bạn đến trang quản trị!</h3>

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
          <h5 class="mb-3">📊 Doanh thu theo tháng</h5>
          <BarChart :chart-data="revenueData" />
        </div>
      </div>
      <div class="col-md-6">
        <div class="card shadow-sm p-3">
          <h5 class="mb-3">📈 Đơn hàng mỗi tháng</h5>
          <LineChart :chart-data="orderData" />
        </div>
      </div>
    </div>

    <!-- Đơn hàng gần đây -->
    <div class="card shadow-sm p-3">
      <h5 class="mb-3">🧾 Đơn hàng gần đây</h5>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Ngày</th>
            <th>Tổng</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in recentOrders" :key="order.id">
            <td>#{{ order.id }}</td>
            <td>{{ order.customer }}</td>
            <td>{{ order.date }}</td>
            <td>{{ order.total }}</td>
            <td>
              <span :class="['badge', getStatusClass(order.status)]">{{ order.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import BarChart from '../../charts/BarChart.vue'
import LineChart from '../../charts/LineChart.vue'

const stats = [
  { label: 'Người dùng', value: 128, icon: 'bi bi-people' },
  { label: 'Đơn hàng', value: 56, icon: 'bi bi-bag-check' },
  { label: 'Sản phẩm', value: 42, icon: 'bi bi-box' },
  { label: 'Doanh thu', value: '52.000.000₫', icon: 'bi bi-currency-dollar' },
]

// Dữ liệu biểu đồ (giả lập)
const revenueData = {
  labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
  datasets: [
    {
      label: 'Doanh thu (VNĐ)',
      backgroundColor: '#0d6efd',
      data: [10, 15, 8, 18, 20, 25],
    },
  ],
}

const orderData = {
  labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
  datasets: [
    {
      label: 'Số đơn hàng',
      borderColor: '#198754',
      data: [5, 12, 8, 14, 10, 18],
      fill: false,
      tension: 0.4,
    },
  ],
}

const recentOrders = [
  { id: 1001, customer: 'Nguyễn Văn A', date: '2025-06-30', total: '1.200.000₫', status: 'Đã giao' },
  { id: 1002, customer: 'Trần Thị B', date: '2025-06-29', total: '850.000₫', status: 'Đang xử lý' },
  { id: 1003, customer: 'Lê C', date: '2025-06-28', total: '2.100.000₫', status: 'Đã hủy' },
]

const getStatusClass = (status: string) => {
  if (status === 'Đã giao') return 'bg-success'
  if (status === 'Đang xử lý') return 'bg-warning text-dark'
  if (status === 'Đã hủy') return 'bg-danger'
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
