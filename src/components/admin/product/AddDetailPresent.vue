<template>
  <div class="container mt-5" style="max-width: 600px">
    <h3 class="mb-4 text-primary">🎁 Thêm chi tiết sản phẩm quà lưu niệm</h3>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label class="form-label">Chọn sản phẩm</label>
        <select v-model="form.products_presents_id" class="form-select" required>
          <option disabled value="">-- Chọn sản phẩm --</option>
          <option
            v-for="product in presentProducts"
            :key="product.id"
            :value="product.id"
          >
            {{ product.name }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Tồn kho</label>
        <input v-model="form.stock" type="number" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Ảnh sản phẩm</label>
        <input type="file" class="form-control" accept="image/*" @change="handleFileChange" />
        <div v-if="preview" class="mt-2 text-center">
          <img :src="preview" style="width: 100px; height: 100px; object-fit: cover;" class="rounded shadow" />
        </div>
      </div>

      <button type="submit" class="btn btn-outline-success w-100">Thêm chi tiết</button>
      <div class="text-end mt-3">
        <router-link to="/admin/products" class="btn btn-outline-secondary btn-sm">
          Quay lại danh sách sản phẩm
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { getAllPresents } from '../../../services/admin/productAdminService'
import { useAuthStore } from '../../../store/auth'
import { useToast } from 'vue-toastification'
const toast = useToast()
const auth = useAuthStore()

const form = ref({
  products_presents_id: '',
  stock: 0,
  image: null as File | null,
})

const preview = ref<string | null>(null)
const presentProducts = ref<{ id: number; name: string; type: string }[]>([])

onMounted(async () => {
  const res = await getAllPresents()
  presentProducts.value = res.data
})

const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  form.value.image = file ?? null
  preview.value = file ? URL.createObjectURL(file) : null
}

const handleSubmit = async () => {
  const formData = new FormData()
  formData.append('products_presents_id', form.value.products_presents_id.toString())
  formData.append('stock', form.value.stock.toString())
  if (form.value.image) {
    formData.append('image', form.value.image)
  }

  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/detail-present`, formData, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    toast.success('✅ Thêm chi tiết thành công!')
    form.value = {
      products_presents_id: '',
      stock: 0,
      image: null as File | null,
    }
  } catch (err) {
    console.error(err)
    toast.error('❌ Lỗi khi thêm chi tiết!')
  }
}
</script>
