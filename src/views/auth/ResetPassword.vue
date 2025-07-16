<template>
  <div class="reset-wrapper">
    <div class="form-container shadow p-5 bg-white rounded">
      <div class="mb-3 text-end">
        <LangSwitcher />
      </div>
      <h3 class="text-center text-primary mb-4">🔒 {{ $t('reset_password.title') }}</h3>

      <form @submit.prevent="handleReset">
        <input type="hidden" v-model="form.token" />

        <div class="mb-3">
          <label class="form-label fw-semibold">Email</label>
          <input v-model="form.email" type="email" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">{{ $t('reset_password.new_password') }}</label>
          <input v-model="form.password" type="password" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">{{ $t('reset_password.confirm_new_password') }}</label>
          <input v-model="form.password_confirmation" type="password" class="form-control" required />
        </div>

        <button type="submit" class="btn btn-success w-100">{{ $t('reset_password.submit') }}</button>
      </form>

      <div class="text-center mt-3">
        <router-link to="/login" class="text-decoration-none text-secondary">← {{ $t('fogot_password.back') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import LangSwitcher from '../../lang/LangSwitcher.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const form = ref({
  token: '',
  email: '',
  password: '',
  password_confirmation: ''
})

onMounted(() => {
  form.value.token = route.params.token as string || ''
  form.value.email = route.query.email as string || ''
})

const handleReset = async () => {
  if (form.value.password !== form.value.password_confirmation) {
    toast.warning('⚠️ Please ensure passwords match.')
    return
  }

  try {
    const res = await fetch(`${API_BASE_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })

    const data = await res.json()

    if (res.status === 200) {
      toast.success(t('reset_password.success') || 'Password reset successfully!')
      router.push('/login')
    } else {
      toast.warning(data.message || 'Password reset failed. Please check your token and email.')
    }
  } catch (error) {
    toast.error(t('reset_password.error') || 'An error occurred while resetting the password.')
    console.error(error)
  }
}
</script>

<style scoped>
.reset-wrapper {
  min-height: 100vh;
  background: #f7fbff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.form-container {
  width: 100%;
  max-width: 500px;
}
</style>
