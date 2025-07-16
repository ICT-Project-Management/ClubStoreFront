<template>
  <div class="register-wrapper">
    <div class="form-container row g-0 shadow-lg">
      <div class="col-md-6 d-none d-md-block position-relative">
        <div class="logo-overlay h-100 w-100 d-flex align-items-center justify-content-center">
          <img src="../../assets/Manchester_City_FC_logo.svg" alt="Logo" class="logo-blur" />
        </div>
      </div>

      <div class="col-md-6 bg-white p-5">
        <div class="mb-3 text-end">
          <LangSwitcher />
        </div>

        <h3 class="text-center text-primary mb-4"> {{ $t('register.title') }}</h3>

        <form @submit.prevent="handleRegister" enctype="multipart/form-data">
          <div class="row g-3">
            <template v-for="[key, label] in Object.entries(fieldLabels)" :key="key">
              <div v-if="key === 'password' || key === 'confirmPassword'" class="col-md-6 position-relative">
                <label class="form-label fw-semibold">{{ $t(label) }}</label>
                <div class="input-group">
                  <input
                    :type="showPassword[key as 'password' | 'confirmPassword'] ? 'text' : 'password'"
                    class="form-control"
                    v-model="form[key as keyof typeof form]"
                    :placeholder="$t(label)"
                    required
                  />
                  <span
                    class="input-group-text"
                    style="cursor: pointer"
                    @click="togglePassword(key as 'password' | 'confirmPassword')"
                  >
                    <i :class="showPassword[key as 'password' | 'confirmPassword'] ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </span>
                </div>
              </div>

              <div v-else-if="key === 'address'" class="col-12">
                <label class="form-label fw-semibold">{{ $t(label) }}</label>
                <textarea
                  class="form-control"
                  rows="3"
                  v-model="form[key]"
                  :placeholder="$t(label)"
                  required
                ></textarea>
              </div>

              <div v-else class="col-md-6">
                <label class="form-label fw-semibold">{{ $t(label) }}</label>
                <input
                  :type="key === 'email' ? 'email' : 'text'"
                  class="form-control"
                  v-model="form[key as keyof typeof form]"
                  :placeholder="$t(label)"
                  required
                />
              </div>
            </template>

            <div class="col-12">
              <label class="form-label fw-semibold">{{ $t('register.avatar') }}</label>
              <input type="file" class="form-control" accept="image/*" @change="handleFileChange" />
              <div v-if="preview" class="mt-2 text-center">
                <img :src="preview" class="rounded-circle" style="width: 80px; height: 80px; object-fit: cover;" />
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100 mt-4">{{ $t('register.submit') }}</button>

          <p class="text-center mt-3">
            {{ $t('register.already_have_account') }}
            <router-link to="/login" class="text-decoration-none fw-semibold text-primary">
              {{ $t('register.login_link') }}
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
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../store/auth'
import LangSwitcher from '../../lang/LangSwitcher.vue'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const auth = useAuthStore()

// Form state
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
const showPassword = ref({
  password: false,
  confirmPassword: false,
})

// Field labels mapped to i18n keys
const fieldLabels: Record<string, string> = {
  name: 'register.name',
  email: 'register.email',
  password: 'register.password',
  confirmPassword: 'register.confirm_password',
  phone: 'register.phone',
  city: 'register.city',
  provine: 'register.provine',
  house_code: 'register.house_code',
  address: 'register.address',
}

// Toggle password visibility
const togglePassword = (field: 'password' | 'confirmPassword') => {
  showPassword.value[field] = !showPassword.value[field]
}

// Preview avatar
const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  form.value.avatar = file ?? null
  preview.value = file ? URL.createObjectURL(file) : null
}

// Submit form
const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    toast.warning(t('register.password_mismatch'))
    return
  }

  const formData = new FormData()
  for (const key in form.value) {
    const value = form.value[key as keyof typeof form.value]
    if (value !== null) {
      const actualKey = key === 'confirmPassword' ? 'password_confirmation' : key
      formData.append(actualKey, value as any)
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
      toast.error(t('register.failed'))
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
