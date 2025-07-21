<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../../../store/auth'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const message = ref('🔄 Đang xử lý kết quả thanh toán...')
const isSuccess = ref(false)

onMounted(() => {
  // Khôi phục user từ token nếu có
  authStore.fetchUser().then(() => {
    const vnp_ResponseCode = route.query.vnp_ResponseCode
    const vnp_TransactionStatus = route.query.vnp_TransactionStatus

    if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
      toast.success('Thanh toán thành công!')
      message.value = 'Thanh toán thành công!'
      isSuccess.value = true
    } else if (vnp_ResponseCode === 'invalid_signature') {
      toast.error('Sai chữ ký xác thực!')
      message.value = 'Sai chữ ký xác thực!'
    } else {
      toast.error('Thanh toán thất bại!')
      message.value = 'Thanh toán thất bại!'
    }

    setTimeout(() => {
      router.push('/')
    }, 3000)
  }).catch((e) => {
    console.error('Lỗi khi init auth:', e)
  })
})
</script>

<template>
  <div class="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
    <h2 class="mb-3">{{ message }}</h2>
    <p>Bạn sẽ được chuyển về trang chủ sau ít giây.</p>
    <button class="btn btn-primary mt-3" @click="router.push('/')">
      Về trang chủ ngay
    </button>
  </div>
</template>

<style scoped>
h2 {
  font-size: 1.8rem;
  font-weight: bold;
}
</style>
