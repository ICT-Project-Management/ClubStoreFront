<template>
  <div class="wrapper d-flex flex-column min-vh-100">
    <Header />

    <main class="flex-grow-1">
      <div class="container mt-5 pt-5">
        <h3 class="text-center mb-4">❤️ Danh sách yêu thích</h3>

        <div v-if="favorites.length" class="row">
          <div v-for="item in favorites" :key="item.id" class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm border-0">
              <img
                v-if="item.product_clothes"
                :src="item.product_clothes.detail_clothes?.[0]?.image?.url_img"
                class="card-img-top"
                alt="clothes"
                style="height: 250px; object-fit: cover;"
              />
              <img
                v-else-if="item.product_present"
                :src="item.product_present.detail_present?.[0]?.image?.url_img"
                class="card-img-top"
                alt="present"
                style="height: 250px; object-fit: cover;"
              />

              <div class="card-body d-flex flex-column">
                <h5 class="card-title fw-bold">
                  {{ item.product_clothes?.name || item.product_present?.name }}
                </h5>
                <p class="text-danger fw-bold fs-5">
                  {{ formatPrice(item.product_clothes?.price || item.product_present?.price || 0) }}₫
                </p>
                <div class="mt-auto d-flex justify-content-between">
                  <button class="btn btn-outline-danger" @click="removeFavorite(item.id)">
                    <i class="bi bi-heartbreak"></i> Xoá
                  </button>
                  <button class="btn btn-primary" @click="viewDetail(item)">
                    <i class="bi bi-eye"></i> Xem ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center mt-5">
          <h4 class="text-muted">Bạn chưa yêu thích sản phẩm nào 😢</h4>
          <button class="btn btn-outline-primary mt-3" @click="$router.push('/')">⬅️ Khám phá sản phẩm</button>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import Header from '../../layouts/header/Header.vue'
import Footer from '../../layouts/footer/Footer.vue'
import { useToast } from 'vue-toastification'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()
const API = import.meta.env.VITE_API_BASE_URL

const favorites = ref<any[]>([])

const fetchFavorites = async () => {
  try {
    const res = await axios.get(`${API}/favorites`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    favorites.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const removeFavorite = async (id: number) => {
  if (confirm('Xoá khỏi danh sách yêu thích?')) {
    try {
      await axios.delete(`${API}/favorites/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      })
      toast.success('Đã xoá!')
      fetchFavorites()
    } catch (err) {
      toast.error('Có lỗi xảy ra!')
    }
  }
}

const viewDetail = (item: any) => {
  if (item.product_clothes) {
    router.push(`/clothes/${item.product_clothes.id}`)
  } else if (item.product_present) {
    router.push(`/presents/${item.product_present.id}`)
  }
}

const formatPrice = (val: number) =>
  new Intl.NumberFormat('vi-VN').format(val)

onMounted(fetchFavorites)
</script>
