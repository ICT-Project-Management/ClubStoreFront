<template>
  <div class="forgot-password-wrapper">
    <div class="form-container shadow p-5 bg-white rounded">
      <h3 class="text-center text-primary mb-4">🔑 {{ $t('fogot_password.title') }}</h3>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label fw-semibold">{{ $t('fogot_password.email') }}</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            :placeholder="$t('fogot_password.description')"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary w-100">{{ $t('fogot_password.submit') }}</button>
      </form>

      <div class="text-center mt-3">
        <router-link to="/login" class="text-decoration-none text-secondary">← {{ $t('fogot_password.back') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
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
      toast.success(t('fogot_password.success') || 'Password reset link sent successfully.')
      email.value = ''
    } else {
      toast.warning(data.message || 'Email don not exist or not registered.')
    }
  } catch (error) {
    toast.error(t('fogot_password.error') || 'An error occurred while sending the reset link.')
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
