<template>
  <div class="container mt-5" style="max-width: 700px">
    <h3 class="mb-4 text-primary">🧥 Thêm chi tiết quần áo</h3>
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <div class="mb-3">
        <label class="form-label">Sản phẩm</label>
        <select v-model="form.products_clothes_id" class="form-select" required>
          <option disabled value="">-- Chọn sản phẩm --</option>
          <option v-for="item in productClothes" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Màu sắc</label>
        <select v-model="form.color_id" class="form-select" required>
          <option disabled value="">-- Chọn màu sắc --</option>
          <option v-for="color in colors" :key="color.id" :value="color.id">
            {{ color.name }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Size</label>
        <select v-model="form.size_id" class="form-select" required>
          <option disabled value="">-- Chọn size --</option>
          <option v-for="size in sizes" :key="size.id" :value="size.id">
            {{ size.name }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Số lượng kho</label>
        <input type="number" v-model="form.stock" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Ảnh sản phẩm</label>
        <input type="file" accept="image/*" class="form-control" @change="handleFileChange" required />
        <div v-if="preview" class="mt-2 text-center">
          <img :src="preview" class="rounded" style="width: 120px; height: 120px; object-fit: cover" />
        </div>
      </div>

      <button type="submit" class="btn btn-outline-primary w-100">Thêm chi tiết</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllClothes, fetchAddDetailClothes } from '../../../services/admin/productAdminService'
import { useToast } from 'vue-toastification'
const toast = useToast()
const router = useRouter()

const form = ref({
  products_clothes_id: '',
  size_id: '',
  color_id: '',
  stock: 0,
  image: null as File | null,
})

const preview = ref<string | null>(null)

const productClothes = ref<{ id: number; name: string }[]>([])

onMounted(async () => {
  const res = await getAllClothes()
  productClothes.value = res.data
})

const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  form.value.image = file ?? null
  preview.value = file ? URL.createObjectURL(file) : null
}

const handleSubmit = async () => {
  const formData = new FormData()
  for (const key in form.value) {
    const value = form.value[key as keyof typeof form.value]
    if (value !== null) {
      formData.append(key, value as any)
    }
  }

  try {
    await fetchAddDetailClothes(formData)
    toast.success('Thêm chi tiết thành công!')
    router.push('/admin/products')
  } catch (err) {
    toast.error('Lỗi khi thêm chi tiết !')
    console.error(err)
  }
}

const colors = [
  { id: 1, name: 'Black' },
  { id: 2, name: 'White' },
  { id: 3, name: 'Red' },
  { id: 4, name: 'Green' },
  { id: 5, name: 'Blue' },
  { id: 29, name: 'Sky Blue' },
  { id: 50, name: 'Dark Violet' },
    { id: 6, name: 'Yellow' },
    { id: 7, name: 'Cyan' },
    { id: 8, name: 'Magenta' },
    { id: 9, name: 'Gray' },
    { id: 10, name: 'Maroon' },
    { id: 11, name: 'Olive' },
    { id: 12, name: 'Navy' },
]

const sizes = [
  { id: 1, name: 'XS' },
  { id: 2, name: 'S' },
  { id: 3, name: 'M' },
  { id: 4, name: 'L' },
  { id: 5, name: 'XL' },
  { id: 6, name: 'XXL' },
  { id: 7, name: 'XXXL' },
  { id: 8, name: 'One Size' },
  { id: 9, name: 'Size 36 (Shoes)' },
  { id: 10, name: 'Size 37 (Shoes)' },
  { id: 11, name: 'Size 38 (Shoes)' },
  { id: 12, name: 'Size 39 (Shoes)' },
  { id: 13, name: 'Size 40 (Shoes)' },
  { id: 14, name: 'Size 41 (Shoes)' },
  { id: 15, name: 'Size 42 (Shoes)' },
]
</script>
