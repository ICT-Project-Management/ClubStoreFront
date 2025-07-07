<template>
  <div class="login-wrapper">
    <div class="form-container row g-0 shadow-lg">
      <div class="col-md-6 d-none d-md-block position-relative">
        <div class="logo-overlay h-100 w-100 d-flex align-items-center justify-content-center">
          <img src="../../assets/vue.svg" alt="Logo" class="logo-blur" />
        </div>
      </div>
      <div class="col-md-6 bg-white p-5">
        <h3 class="text-center text-primary mb-4">🔐 Đăng nhập</h3>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label fw-semibold">Email</label>
            <input v-model="form.email" type="email" class="form-control" placeholder="Nhập email" required />
          </div>

          <div class="mb-3 position-relative">
            <label class="form-label fw-semibold">Mật khẩu</label>
            <div class="input-group">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                v-model="form.password"
                placeholder="Nhập mật khẩu"
                required
              />
              <span class="input-group-text" style="cursor: pointer" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </span>
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100 mt-3">Đăng nhập</button>

          <p class="text-center mt-3">
            Chưa có tài khoản?
            <router-link to="/register" class="text-decoration-none fw-semibold text-primary">Đăng ký</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useToast } from 'vue-toastification'
const toast = useToast()
const form = ref({
  email: '',
  password: '',
})
const showPassword = ref(false)

const router = useRouter()
const auth = useAuthStore()

const handleLogin = async () => {
  try {
    await auth.login(form.value)

    const roles = auth.user?.roles || []
    const isAdmin = roles.some((r: any) => r.name === 'admin')

    router.push(isAdmin ? '/admin' : '/')
  } catch (err) {
    toast.error('Đăng nhập thất bại! Kiểm tra email và mật khẩu.')
    console.error(err)
  }
}
</script>

<style scoped>
.login-wrapper {
  background: linear-gradient(to right, #ffffff, #f3fbff);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.form-container {
  width: 100%;
  max-width: 800px;
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

.logo-overlay {
  background: #e0f0ff;
  position: relative;
}

.logo-blur {
  opacity: 0.08;
  width: 280px;
  height: 280px;
  object-fit: contain;
}
</style>
