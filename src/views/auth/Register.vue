<template>
  <div class="register-wrapper">
    <div class="form-container row g-0 shadow-lg">
      <div class="col-md-6 d-none d-md-block position-relative">
        <div class="logo-overlay h-100 w-100 d-flex align-items-center justify-content-center">
          <img src="../../assets/vue.svg" alt="Logo" class="logo-blur" />
        </div>
      </div>
      <div class="col-md-6 bg-white p-5">
        <h3 class="text-center text-primary mb-4">🎉 Đăng ký tài khoản</h3>
        <form @submit.prevent="handleRegister" enctype="multipart/form-data">
          <div class="row g-3">
            <template v-for="(label, key) in fieldLabels" :key="key">
              <div v-if="key === 'password' || key === 'confirmPassword'" class="col-md-6 position-relative">
                <label class="form-label fw-semibold">{{ label }}</label>
                <div class="input-group">
                  <input
                    :type="showPassword[key] ? 'text' : 'password'"
                    class="form-control"
                    v-model="form[key as keyof typeof form]"
                    :placeholder="label"
                    required
                  />
                  <span class="input-group-text" style="cursor: pointer" @click="togglePassword(key)">
                    <i :class="showPassword[key] ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </span>
                </div>
              </div>
              <div v-else-if="key === 'address'" class="col-12">
                <label class="form-label fw-semibold">{{ label }}</label>
                <textarea
                  class="form-control"
                  rows="3"
                  v-model="form.address"
                  placeholder="Nhập địa chỉ chi tiết"
                  required
                ></textarea>
              </div>
              <div v-else class="col-md-6">
                <label class="form-label fw-semibold">{{ label }}</label>
                <input
                  :type="key === 'email' ? 'email' : 'text'"
                  class="form-control"
                  v-model="form[key as keyof typeof form]"
                  :placeholder="label"
                  required
                />
              </div>
            </template>
            <div class="col-12">
              <label class="form-label fw-semibold">Ảnh đại diện</label>
              <input
                type="file"
                class="form-control"
                accept="image/*"
                @change="handleFileChange"
              />
              <div v-if="preview" class="mt-2 text-center">
                <img :src="preview" class="rounded-circle" style="width: 80px; height: 80px; object-fit: cover;" />
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100 mt-4">Đăng ký</button>

          <p class="text-center mt-3">
            Đã có tài khoản?
            <router-link to="/login" class="text-decoration-none fw-semibold text-primary">Đăng nhập</router-link>
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
const router = useRouter()
const auth = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  city: '',
  provine: '',
  house_code: '',
  address: '',
  avatar: null as File | null,
})

const preview = ref<string | null>(null)
const showPassword = ref({ password: false, confirmPassword: false })

const togglePassword = (field: 'password' | 'confirmPassword') => {
  showPassword.value[field] = !showPassword.value[field]
}

const fieldLabels: Record<string, string> = {
  name: 'Họ tên',
  email: 'Email',
  password: 'Mật khẩu',
  confirmPassword: 'Xác nhận mật khẩu',
  phone: 'Số điện thoại',
  city: 'Thành phố',
  provine: 'Tỉnh',
  house_code: 'Số nhà',
  address: 'Địa chỉ',
}

const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  form.value.avatar = file ?? null
  preview.value = file ? URL.createObjectURL(file) : null
}

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    toast.warning('Mật khẩu và xác nhận mật khẩu không khớp!')
    return
  }

  const formData = new FormData()
  for (const key in form.value) {
    const value = form.value[key as keyof typeof form.value]
    if (value !== null) {
      formData.append(key === 'confirmPassword' ? 'password_confirmation' : key, value as any)
    }
  }

  try {
    await auth.register(formData)
    router.push('/')
  } catch (err: any) {
    const errors = err.response?.data?.errors
    if (errors) {
      toast.warning('⚠️ ' + Object.values(errors).flat().join('\n'))
    } else {
      toast.error('Đăng ký thất bại!')
      // TODO: use toast for notification
    }
  }
}
</script>

<style scoped>
.register-wrapper {
  background: linear-gradient(to right, #f1faff, #f3fbff);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.form-container {
  width: 100%;
  max-width: 960px;
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
  width: 300px;
  height: 300px;
  object-fit: contain;
}
</style>
