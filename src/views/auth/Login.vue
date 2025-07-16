<template>
  <div class="login-wrapper">
    <div class="form-container row g-0 shadow-lg">
      <div class="col-md-6 d-none d-md-block position-relative">
        <div class="logo-overlay h-100 w-100 d-flex align-items-center justify-content-center">
          <img src="../../assets/vue.svg" alt="Logo" class="logo-blur" />
        </div>
      </div>

      <div class="col-md-6 bg-white p-5">
    
        <div class="mb-3 text-end">
          <LangSwitcher />
        </div>

        <h3 class="text-center text-primary mb-4">{{ $t('login.title') }}</h3>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label fw-semibold">{{ $t('login.email') }}</label>
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              :placeholder="$t('login.email')"
              required
            />
          </div>

          <div class="mb-3 position-relative">
            <label class="form-label fw-semibold">{{ $t('login.password') }}</label>
            <div class="input-group">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                v-model="form.password"
                :placeholder="$t('login.password')"
                required
              />
              <span class="input-group-text" style="cursor: pointer" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </span>
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100 mt-3">
            {{ $t('login.login_button') }}
          </button>

          <div class="text-end mt-2">
            <router-link to="/forgot-password" class="text-decoration-none text-primary">
              {{ $t('login.forgot') }}
            </router-link>
          </div>

          <div class="text-center mt-3">
            <p class="mb-1">{{ $t('login.or_login_with') }}</p>
            <div class="d-flex justify-content-center gap-3">
              <button type="button" class="btn btn-outline-danger w-50" @click="loginWithGoogle">
                <i class="bi bi-google me-2"></i> {{ $t('login.google') }}
              </button>
              <button type="button" class="btn btn-outline-primary w-50" @click="loginWithFacebook">
                <i class="bi bi-facebook me-2"></i> {{ $t('login.facebook') }}
              </button>
            </div>
          </div>

          <p class="text-center mt-3">
            {{ $t('login.no_account') }}
            <router-link to="/register" class="text-decoration-none fw-semibold text-primary">
              {{ $t('login.register') }}
            </router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../store/auth'
import { useToast } from 'vue-toastification'
import LangSwitcher from '../../lang/LangSwitcher.vue'

const toast = useToast()
const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()

const form = ref({
  email: '',
  password: '',
})
const showPassword = ref(false)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const handleLogin = async () => {
  try {
    await auth.login(form.value)
    const roles = auth.user?.roles || []
    const isAdmin = roles.some((r: any) => r.name === 'admin')
    router.push(isAdmin ? '/admin' : '/')
  } catch (err) {
    toast.error(t('login.error'))
    console.error(err)
  }
}

const loginWithGoogle = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/google/redirect`, { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  } catch (error) {
    toast.error(t('login.google_error'))
    console.error(error)
  }
}

const loginWithFacebook = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/facebook/redirect`, { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  } catch (error) {
    toast.error(t('login.facebook_error'))
    console.error(error)
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
