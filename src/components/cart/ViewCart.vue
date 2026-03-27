<template>
  <div class="wrapper d-flex flex-column min-vh-100">
    <Header />

    <main class="flex-grow-1">
      <div class="container mt-5 pt-5">
        <h3 class="text-center mb-4">🛒 Giỏ hàng của bạn</h3>

        <!-- Quần áo -->
        <div v-if="clothes.length">
          <h5 class="mb-3">👕 Sản phẩm quần áo</h5>
          <table class="table table-bordered align-middle text-center">
            <thead class="table-primary">
              <tr>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Màu</th>
                <th>Size</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tạm tính</th>
                <th>Xoá</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in clothes" :key="item.id">
                <td><img :src="item.detail_clothes.image.url_img" style="width: 60px; height: 60px; object-fit: cover;" /></td>
                <td>{{ item.detail_clothes.product_clothes.name }}</td>
                <td>{{ item.detail_clothes.color.name }}</td>
                <td>{{ item.detail_clothes.size.name }}</td>
                <td>{{ formatPrice(item.detail_clothes.product_clothes.price) }}₫</td>
                <td>
                  <div class="d-flex justify-content-center align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-secondary" style="width: 28px;" @click="updateQty(item.id, item.quantity - 1, 'clothes')">-</button>
                    <span>{{ item.quantity }}</span>
                    <button class="btn btn-sm btn-outline-secondary" style="width: 28px;" @click="updateQty(item.id, item.quantity + 1, 'clothes')">+</button>
                  </div>
                </td>
                <td>{{ formatPrice(item.detail_clothes.product_clothes.price * item.quantity) }}₫</td>
                <td>
                  <button class="btn btn-sm btn-danger" @click="deleteClothesItem(item.id)">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Quà lưu niệm -->
        <div v-if="presents.length">
          <h5 class="mb-3 mt-5">🎁 Quà lưu niệm</h5>
          <table class="table table-bordered align-middle text-center">
            <thead class="table-success">
              <tr>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Chất liệu</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tạm tính</th>
                <th>Xoá</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in presents" :key="item.id">
                <td><img :src="item.detail_present.image.url_img" style="width: 60px; height: 60px; object-fit: cover;" /></td>
                <td>{{ item.detail_present.product_present.name }}</td>
                <td>{{ item.detail_present.product_present.metarial }}</td>
                <td>{{ formatPrice(item.detail_present.product_present.price) }}₫</td>
                <td>
                  <div class="d-flex justify-content-center align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-secondary" style="width: 28px;" @click="updateQty(item.id, item.quantity - 1, 'presents')">-</button>
                    <span>{{ item.quantity }}</span>
                    <button class="btn btn-sm btn-outline-secondary" style="width: 28px;" @click="updateQty(item.id, item.quantity + 1, 'presents')">+</button>
                  </div>
                </td>
                <td>{{ formatPrice(item.detail_present.product_present.price * item.quantity) }}₫</td>
                <td>
                  <button class="btn btn-sm btn-danger" @click="deletePresentItem(item.id)">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tổng cộng và hành động -->
        <div v-if="clothes.length || presents.length">
          <div class="text-end mt-4">
            <h5>
              Tổng cộng:
              <span class="text-danger fw-bold">{{ formatPrice(totalPrice) }}₫</span>
            </h5>
          </div>
          <div class="text-center mt-4">
            <button class="btn btn-outline-primary me-2" @click="goHome">⬅️ Tiếp tục mua sắm</button>
            <button class="btn btn-outline-success" @click="router.push('/order/index')">🛒 Đặt hàng</button>
          </div>
        </div>

        <!-- Trống -->
        <div v-if="!clothes.length && !presents.length" class="text-center mt-5">
          <h4 class="text-muted">Giỏ hàng của bạn đang trống 😢</h4>
          <p class="text-muted">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm!</p>
          <button class="btn btn-outline-primary" @click="goHome">⬅️ Quay về trang chủ</button>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useCartStore } from '../../store/cart'
import { useAuthStore } from '../../store/auth'
import { useRouter } from 'vue-router'
import Header from '../../layouts/header/Header.vue'
import Footer from '../../layouts/footer/Footer.vue'
import { useToast } from 'vue-toastification'
const toast = useToast()
const API = import.meta.env.VITE_API_BASE_URL
const cartStore = useCartStore()
const auth = useAuthStore()
const router = useRouter()

onMounted(async () => {
  await cartStore.fetchCart(auth.user?.id)
})

const clothes = computed(() => cartStore.clothes)
const presents = computed(() => cartStore.presents)

const formatPrice = (val: number) =>
  new Intl.NumberFormat('vi-VN').format(val)

const totalPrice = computed(() => {
  const clothesTotal = clothes.value.reduce((acc, item) => acc + item.detail_clothes.product_clothes.price * item.quantity, 0)
  const presentsTotal = presents.value.reduce((acc, item) => acc + item.detail_present.product_present.price * item.quantity, 0)
  return clothesTotal + presentsTotal
})

const goHome = () => router.push('/')

const deleteClothesItem = async (id: number) => {
  if (confirm('Bạn có chắc muốn xoá sản phẩm quần áo này khỏi giỏ?')) {
    await fetch(`${API}/cart/clothes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    })
    toast.success('Sản phẩm quần áo đã được xoá khỏi giỏ hàng!')
    await cartStore.fetchCart(auth.user?.id)
  }
}

const deletePresentItem = async (id: number) => {
  if (confirm('Bạn có chắc muốn xoá quà lưu niệm này khỏi giỏ?')) {
    await fetch(`${API}/cart/presents/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    })
    toast.success('Quà lưu niệm đã được xoá khỏi giỏ hàng!')
    await cartStore.fetchCart(auth.user?.id)
  }
}

const updateQty = async (id: number, quantity: number, type: string) => {
  if (quantity < 1) {
    if (type === 'clothes') deleteClothesItem(id)
    else deletePresentItem(id)
    return
  }
  try {
    const res = await fetch(`${API}/cart/${type}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({ quantity })
    })
    if (!res.ok) throw new Error('Update failed')
    await cartStore.fetchCart(auth.user?.id)
  } catch (err) {
    toast.error('Cập nhật số lượng thất bại!')
  }
}

</script>
