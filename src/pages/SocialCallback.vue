<script setup lang="ts">
import { useAuthStore } from '../store/auth'
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()


onMounted(async () => {
  const token = route.query.token as string
  if (!token) return router.push('/login')

  await auth.setTokenAndFetchUser(token)

  const isAdmin = auth.user?.roles?.some((r: any) => r.name === 'admin')
  router.push(isAdmin ? '/admin' : '/')
})
</script>

<template>
  <div class="text-center mt-5"> Đang xử lý đăng nhập Google/Facebook...</div>
</template>
