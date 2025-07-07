<template>
  <div class="container mt-5" style="max-width: 600px">
    <h3 class="mb-4 text-primary">🧥 Thêm sản phẩm quần áo</h3>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label class="form-label">Tên sản phẩm</label>
        <input v-model="form.name" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Số lượng</label>
        <input v-model="form.quantity" type="number" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Giá</label>
        <input v-model="form.price" type="number" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Loại sản phẩm</label>
        <select v-model="form.product_id" class="form-select" required>
          <option disabled value="">-- Chọn loại sản phẩm --</option>
          <option v-for="product in clothesProducts" :key="product.id" :value="product.id">
            {{ product.name }}
          </option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary w-100">Thêm sản phẩm</button>

      <div class="text-end mt-3">
        <router-link to="/admin/products/add-detail-clothes" class="btn btn-outline-secondary btn-sm">
          ➕ Thêm chi tiết quần áo
        </router-link>
        <router-link to="/admin/products" class="btn btn-outline-secondary btn-sm ms-2">
          🏠 Quay lại danh sách sản phẩm
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getProducts, fetchAddClothes } from '../../../services/admin/productAdminService'
import { useToast } from 'vue-toastification'
const toast = useToast()
const form = ref({
  name: '',
  quantity: 0,
  price: 0,
  product_id: ''
})

interface Product {
  id: number
  name: string
  type: string
}

const clothesProducts = ref<Product[]>([])

onMounted(async () => {
  try {
    const res = await getProducts()
    clothesProducts.value = res.data.filter((p: Product) => p.type === 'clothes')
  } catch (err) {
    toast.warning('Không thể tải danh sách sản phẩm quần áo!')
    console.error(err)
  }
})

const handleSubmit = async () => {
  try {
    await fetchAddClothes(form.value)
    toast.success(' Thêm quần áo thành công!')
    form.value = {
      name: '',
      quantity: 0,
      price: 0,
      product_id: ''
    }
  } catch (err) {
    toast.error('Lỗi khi thêm quần áo!')
    console.error(err)
  }
}
</script>
