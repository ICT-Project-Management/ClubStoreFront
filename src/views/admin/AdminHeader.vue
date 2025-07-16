<template>
  <div class="bg-light border-bottom px-4 py-2 d-flex justify-content-between align-items-center" style="margin-left: 240px;">
    <h5 class="mb-0">{{ $t('admin_bar.title') }}</h5>
    <div class="d-flex align-items-center">
      <LangSwitcher />
    </div>
    <div>
      <button class="btn btn-outline-secondary btn-sm me-2" @click="goHome">
        <i class="bi bi-house"></i> {{ $t('admin_bar.goHome') }}
      </button>
      <button class="btn btn-outline-danger btn-sm" @click="logout">
        <i class="bi bi-box-arrow-right"></i> {{ $t('admin_bar.logout') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import LangSwitcher from '../../lang/LangSwitcher.vue'
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
