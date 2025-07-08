<template>
  <div class="forgot-password-wrapper">
    <div class="form-container shadow p-5 bg-white rounded">
      <h3 class="text-center text-primary mb-4">🔑 Quên mật khẩu</h3>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label fw-semibold">Email</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            placeholder="Nhập email đã đăng ký"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary w-100">Gửi liên kết đặt lại mật khẩu</button>
      </form>

      <div class="text-center mt-3">
        <router-link to="/login" class="text-decoration-none text-secondary">← Quay lại đăng nhập</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const email = ref('')
const toast = useToast()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const handleSubmit = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
    })

    const data = await res.json()

    if (res.status === 200) {
      toast.success(data.message|| 'Have sent reset password link to your email!')
      email.value = ''
    } else {
      toast.warning(data.message || 'Email don not exist or not registered.')
    }
  } catch (error) {
    toast.error('Check your network connection and try again.')
    console.error(error)
  }
}

</script>

<style scoped>
.forgot-password-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fbff;
  padding: 30px;
}

.form-container {
  width: 100%;
  max-width: 500px;
}
</style>
