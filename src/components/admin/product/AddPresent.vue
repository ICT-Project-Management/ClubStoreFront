<template>
  <div class="container mt-5" style="max-width: 600px">
    <h3 class="mb-4 text-success">🎁 Thêm quà lưu niệm</h3>
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
        <label class="form-label">Chất liệu</label>
        <input v-model="form.metarial" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Cân nặng</label>
        <input v-model="form.weight" type="number" step="0.01" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Loại sản phẩm</label>
        <select v-model="form.product_id" class="form-select" required>
          <option disabled value="">-- Chọn loại quà lưu niệm --</option>
          <option v-for="product in presentProducts" :key="product.id" :value="product.id">
            {{ product.name }}
          </option>
        </select>
      </div>

      <button type="submit" class="btn btn-success w-100">Thêm quà lưu niệm</button>

      <div class="text-end mt-3">
        <router-link to="/admin/products/add-detail-present" class="btn btn-outline-secondary btn-sm">
          ➕ Thêm chi tiết quà tặng
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
import { getProducts, fetchAddPresent } from '../../../services/admin/productAdminService'
import { useToast } from 'vue-toastification'
const toast = useToast()
const form = ref({
  name: '',
  quantity: 0,
  price: 0,
  metarial: '',
  weight: 0,
  product_id: '',
})
interface Product {
  id: number
  name: string
  type: string
}

const presentProducts = ref<Product[]>([])



onMounted(async () => {
  const res = await getProducts()
  presentProducts.value = res.data.filter((p: any) => p.type === 'present')
})

const handleSubmit = async () => {
  try {
    await fetchAddPresent(form.value)
    toast.success('Thêm quà lưu niệm thành công!')
    form.value = {
      name: '',
      quantity: 0,
      price: 0,
      metarial: '',
      weight: 0,
      product_id: '',
    }
  } catch (err) {
    toast.error('Lỗi khi thêm quà lưu niệm!')
    console.error(err)
  }
}
</script>
