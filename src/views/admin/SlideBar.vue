<template>
  <div class="p-4">
    <h5 class="text-primary fw-bold mb-4">📊 {{ $t('admin_bar.dashboard') }}</h5>
    <ul class="nav flex-column">
      <li class="nav-item mb-2" v-for="item in navItems" :key="item.path">
        <router-link
          :to="item.path"
          class="nav-link d-flex align-items-center p-2 rounded text-dark"
          active-class="active"
        >
          <i :class="item.icon + ' me-2'"></i>
          {{ item.label }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

const navItems = computed(() => [
  { path: '/admin/home', label: t('admin_bar.goHome'), icon: 'bi bi-house-door' },
  { path: '/admin/users', label: t('admin_bar.users'), icon: 'bi bi-people' },
  { path: '/admin/products', label: t('admin_bar.products'), icon: 'bi bi-box-seam' },
  { path: '/admin/orders', label: t('admin_bar.orders'), icon: 'bi bi-receipt' },
  { path: '/admin/news', label: t('admin_bar.news'), icon: 'bi bi-newspaper' },
])
</script>

<style scoped>
.nav-link {
  transition: background-color 0.2s ease;
}
.nav-link:hover {
  background-color: #e0f0ff;
}
.nav-link.active {
  background-color: #0d6efd;
  color: white !important;
}
.nav-link.active i {
  color: white !important;
}
</style>
