<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold">Quản lý sản phẩm</h4>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" @click="goToAdd('clothes')">
          ➕ Thêm sản phẩm quần áo
        </button>
        <button class="btn btn-outline-success" @click="goToAdd('present')">
          🎁 Thêm sản phẩm quà lưu niệm
        </button>
      </div>
    </div>

    <!-- Quần áo -->
    <h5 class="text-primary mb-3">Sản phẩm quần áo</h5>
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
                title="Màu"
            ></div>
            📏 {{ item.size?.name }} |
            📦 {{ item.stock }} cái
            </div>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-primary" @click="edit('clothes', item.product_clothes.id)">Sửa</button>
          <button class="btn btn-sm btn-outline-danger" @click="remove(item.id, 'clothes')">Xóa</button>
        </div>
      </div>
    </div>

    <!-- Quà lưu niệm -->
    <h5 class="text-success mb-3">  Sản phẩm quà lưu niệm</h5>
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
              📦 {{ item.stock }} cái |
              🧱 {{ item.product_present.metarial }}
            </div>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-primary" @click="edit('present', item.product_present.id)">Sửa</button>
          <button class="btn btn-sm btn-outline-danger" @click="remove(item.id, 'present')">Xóa</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchClothes, fetchPresents } from '../../../services/productService'
import axios from 'axios'

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
  if (!confirm('Bạn có chắc chắn muốn xóa không?')) return
  try {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/detail-${type}/${id}`)
    await loadData()
  } catch (err) {
    console.error('Xóa thất bại:', err)
    alert('Xóa thất bại')
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
