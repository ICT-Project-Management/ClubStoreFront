<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold">{{ $t('admin.product.manage') }}</h4>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" @click="goToAdd('clothes')">
          {{ $t('admin.product.add_clothes') }}
        </button>
        <button class="btn btn-outline-success" @click="goToAdd('present')">
          {{ $t('admin.product.add_presents') }}
        </button>
      </div>
    </div>

    <!-- Quần áo -->
    <h5 class="text-primary mb-3">{{ $t('admin.product.clothes_list') }}</h5>
    <div class="list-group mb-5">
      <div
        v-for="item in clothes"
        :key="item.id"
        class="list-group-item d-flex align-items-center justify-content-between"
      >
        <div class="d-flex align-items-center gap-3">
          <img
            :src="item.image?.url_img"
            alt="Ảnh"
            class="img-thumb"
          />
          <div>
            <strong>{{ item.product_clothes.name }}</strong>
            <div class="small text-muted d-flex align-items-center gap-2 flex-wrap">
            💰 {{ formatPrice(item.product_clothes.price) }} |
            <div
                class="d-inline-block rounded-circle border border-2"
                :style="{ backgroundColor: item.color?.color_code, width: '16px', height: '16px' }"
                title="{{ $t('admin.product.color') }}"
            ></div>
            📏 {{ item.size?.name }} |
            📦 {{ item.stock }} {{ $t('admin.product.item') }}
            </div>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-primary" @click="edit('clothes', item.product_clothes.id)">{{ $t('admin.product.edit_sp') }}</button>
          <button class="btn btn-sm btn-outline-danger" @click="removeProduct(item.product_clothes.id, 'clothes')">{{ $t('admin.product.delete_sp') }}</button>
          <div class="border-start border-2 border-secondary mx-1"></div>
          <button class="btn btn-sm btn-outline-secondary" @click="remove(item.id, 'clothes')">{{ $t('admin.product.delete_detail') }}</button>
        </div>
      </div>
    </div>

    <!-- Quà lưu niệm -->
    <h5 class="text-success mb-3">  {{ $t('admin.product.presents_list') }}</h5>
    <div class="list-group">
      <div
        v-for="item in presents"
        :key="item.id"
        class="list-group-item d-flex align-items-center justify-content-between"
      >
        <div class="d-flex align-items-center gap-3">
          <img
            :src="item.image?.url_img"
            alt="Ảnh"
            class="img-thumb"
          />
          <div>
            <strong>{{ item.product_present.name }}</strong>
            <div class="small text-muted">
              💰 {{ formatPrice(item.product_present.price) }} |
              📦 {{ item.stock }} {{ $t('admin.product.item') }} |
              🧱 {{ item.product_present.metarial }}
            </div>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-primary" @click="edit('present', item.product_present.id)">{{ $t('admin.product.edit_sp') }}</button>
          <button class="btn btn-sm btn-outline-danger" @click="removeProduct(item.product_present.id, 'presents')">{{ $t('admin.product.delete_sp') }}</button>
          <div class="border-start border-2 border-secondary mx-1"></div>
          <button class="btn btn-sm btn-outline-secondary" @click="remove(item.id, 'present')">{{ $t('admin.product.delete_detail') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { fetchClothes, fetchPresents } from '../../../services/productService'
import { useAuthStore } from '../../../store/auth'
import axios from 'axios'
const auth = useAuthStore()


const router = useRouter()
const clothes = ref<any[]>([])
const presents = ref<any[]>([])

const loadData = async () => {
  try {
    const [resC, resP] = await Promise.all([fetchClothes(), fetchPresents()])
    clothes.value = resC.data || []
    presents.value = resP.data || []
  } catch (err) {
    console.error('Lỗi khi tải dữ liệu:', err)
  }
}

const remove = async (id: number, type: string) => {
  if (!confirm('Bạn có chắc chắn muốn xóa chi tiết này không?')) return
  try {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/detail-${type}/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    await loadData()
  } catch (err) {
    console.error('Xóa thất bại:', err)
    alert('Xóa thất bại')
  }
}

const removeProduct = async (id: number, endpointType: string) => {
  if (!confirm(`Bạn có chắc muốn xóa TOÀN BỘ sản phẩm này?`)) return
  try {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/${endpointType}/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    await loadData()
  } catch (err) {
    console.error('Xóa sản phẩm cốt lõi thất bại:', err)
    alert('Xóa sản phẩm thất bại')
  }
}

const goToAdd = (type: string) => {
  router.push(`/admin/products/add-${type}`)
}

const edit = (type: string, productId: number) => {
  router.push(`/admin/products/${type}/edit/${productId}`)
}

const formatPrice = (price: number) =>
  price.toLocaleString('vi-VN') + '₫'

onMounted(loadData)
</script>

<style scoped>
.img-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
}
.img-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
}
.list-group-item {
  transition: background 0.2s ease;
}
.list-group-item:hover {
  background: #f9fcff;
}
</style>
