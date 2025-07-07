<template>
  <div class="container mt-5 pt-5">
    <div class="card shadow">
      <div class="card-header text-center bg-info text-white">
        <h4>Thông tin cá nhân</h4>
      </div>
      <div class="card-body row">
        <!-- Avatar -->
        <div class="col-md-4 text-center">
          <img
            :src="form.avatarPreview || user?.avatar"
            alt="Avatar"
            class="rounded-circle mb-3"
            style="width: 180px; height: 180px; object-fit: cover;"
          />
          <input type="file" @change="handleFileChange" class="form-control" />
        </div>

        <!-- Form thông tin -->
        <div class="col-md-8">
          <form @submit.prevent="updateProfile">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Họ tên</label>
                <input v-model="form.name" type="text" class="form-control" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Email</label>
                <input v-model="form.email" type="email" class="form-control" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Số điện thoại</label>
                <input v-model="form.phone" type="text" class="form-control" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Thành phố</label>
                <input v-model="form.city" type="text" class="form-control" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Tỉnh</label>
                <input v-model="form.provine" type="text" class="form-control" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Số nhà</label>
                <input v-model="form.house_code" type="text" class="form-control" />
              </div>
              <div class="col-12 mb-3">
                <label class="form-label">Địa chỉ cụ thể</label>
                <input v-model="form.address" type="text" class="form-control" />
              </div>
            </div>
            <div class="text-end">
              <button type="submit" class="btn btn-outline-primary">✅ Cập nhật</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../store/auth'
import { useToast } from 'vue-toastification'

const toast = useToast()
const API = import.meta.env.VITE_API_BASE_URL
const auth = useAuthStore()

const user = ref<any>(null)
const form = ref<any>({
  name: '', email: '', phone: '',
  city: '', provine: '', house_code: '', address: '',
  avatar: null, avatarPreview: ''
})

onMounted(fetchUserProfile)

async function fetchUserProfile() {
  const res = await fetch(`${API}/user/profile`, {
    headers: { Authorization: `Bearer ${auth.token}` }
  })
  const data = await res.json()
  user.value = data
  form.value = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    city: data.address?.city,
    provine: data.address?.provine,
    house_code: data.address?.house_code,
    address: data.address?.address,
    avatar: null,
    avatarPreview: ''
  }
}

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    form.value.avatar = file
    form.value.avatarPreview = URL.createObjectURL(file)
  }
}

async function updateProfile() {
  const formData = new FormData()
  for (const key in form.value) {
    const val = form.value[key]
    if (val !== null && val !== '') formData.append(key, val)
  }

  const res = await fetch(`${API}/user/profile`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${auth.token}` },
    body: formData
  })
  const result = await res.json()

  if (res.ok) {
    toast.success('Cập nhật thông tin thành công!')
    user.value = result.user
    form.value.avatarPreview = ''
  } else {
    alert('❌ Lỗi: ' + result.message)
  }
}
</script>
