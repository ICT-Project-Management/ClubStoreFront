<template>
  <div class="wrapper d-flex flex-column min-vh-100">
    <Header />

    <div class="container-fluid mt-5 pt-4">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3">
          <div class="card shadow-sm">
            <div class="card-header bg-primary text-white text-center fw-bold">
              👤 Tài khoản của tôi
            </div>
            <ul class="list-group list-group-flush">
              <li
                class="list-group-item"
                v-for="item in menu"
                :key="item.key"
                :class="{ active: current === item.key }"
                style="cursor: pointer"
                @click="current = item.key"
              >
                <i :class="item.icon" class="me-2"></i>{{ item.label }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Nội dung chính -->
        <div class="col-md-9">
          <div class="card shadow-sm p-4">
            <component :is="currentComponent" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Header from '../../layouts/header/Header.vue'
import Profile from './Profile.vue'
// import Orders from './Orders.vue'
// import Address from './Address.vue'
import OrderHistory from './orders/OrderHistory.vue'
import OrderPending from './orders/OrderPending.vue'

const current = ref('profile')

const menu = [
  { key: 'profile', label: 'Hồ sơ cá nhân', icon: 'bi bi-person' },
  { key: 'orders', label: 'Đơn hàng', icon: 'bi bi-bag-check' },
  { key: 'address', label: 'Địa chỉ', icon: 'bi bi-geo-alt' },
  { key: 'history', label: 'Lịch sử đơn', icon: 'bi bi-clock-history' },
]

const currentComponent = computed(() => {
  switch (current.value) {
    case 'profile':
      return Profile
    case 'orders':
      return OrderPending
    case 'address':
      return "Address"
    case 'history':
      return OrderHistory
  }
})
</script>

<style scoped>
.list-group-item.active {
  background-color: #0d6efd;
  color: white;
  font-weight: bold;
}
</style>
