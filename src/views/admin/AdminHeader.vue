<template>
  <div class="bg-light border-bottom px-4 py-2 d-flex justify-content-between align-items-center" style="margin-left: 240px;">
    <h5 class="mb-0">Quản trị hệ thống</h5>
    <div>
      <button class="btn btn-outline-secondary btn-sm me-2" @click="goHome">
        <i class="bi bi-house"></i> Về trang chính
      </button>
      <button class="btn btn-outline-danger btn-sm" @click="logout">
        <i class="bi bi-box-arrow-right"></i> Đăng xuất
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'

const router = useRouter()
const auth = useAuthStore()

const logout = () => {
  auth.logout()
  router.push('/login')
}

const goHome = () => {
  router.push('/')
}
</script>
