<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { newsService } from '../../../services/newsService'
import Paginate from '../../../layouts/paginate/Paginate.vue'
import NewsOnWeek from './NewsOnWeek.vue'
import DetailNews from './DetailNews.vue'
import Header from '../../../layouts/header/Header.vue'
import Footer from '../../../layouts/footer/Footer.vue'
import { useRoute } from 'vue-router'
const route = useRoute()    
const newsList = ref<any[]>([])
const meta = ref({ current_page: 1, last_page: 1 })
const filters = ref({ page: 1 })
const selectedNews = ref<any | null>(null)

const fetchAllNews = async () => {
  const res = await newsService.fetchAllNews({ page: filters.value.page })
  newsList.value = res.data
  meta.value = { current_page: res.current_page, last_page: res.last_page }

  const idFromQuery = route.query.id
  if (idFromQuery) {
    selectedNews.value = await newsService.fetchNewsById(Number(idFromQuery))
  } else if (res.data.length > 0) {
    selectedNews.value = res.data[0]
  }
}

const handlePageChange = (page: number) => {
  filters.value.page = page
  fetchAllNews()
}

const selectNews = async (item: any) => {
  const detail = await newsService.fetchNewsById(item.id)
  selectedNews.value = detail
}

const viewDetail = async (id: number) => {
  const detail = await newsService.fetchNewsById(id)
  selectedNews.value = detail
}

onMounted(fetchAllNews)
</script>

<template>
    <Header />
  <div class="container-fluid mt-3" style="position: relative; padding-top: 60px;">
    <div class="row">
      <div class="col-lg-3 mb-3 mb-lg-0">
        <div class="bg-white border p-3 shadow-sm rounded h-100">
            <h5 class="fw-bold text-dark mb-3 border-bottom pb-2">Tất cả tin tức</h5>

            <div class="news-list overflow-auto" style="max-height: 70vh;">
            <div
                v-for="item in newsList"
                :key="item.id"
                class="mb-3 d-flex gap-2 align-items-start hover-effect"
                @click="selectNews(item)"
                style="cursor: pointer;"
            >
                <img
                :src="item.image?.url_img"
                class="rounded"
                style="width: 60px; height: 45px; object-fit: cover;"
                />
                <div>
                <p class="mb-1 text-truncate fw-semibold">{{ item.title }}</p>
                <small class="text-muted d-block">
                    🕒 {{ new Date(item.created_at).toLocaleDateString('vi-VN') }}
                </small>
                </div>
            </div>

            <div v-if="newsList.length === 0" class="text-muted text-center py-3">
                Không có tin tức nào.
            </div>
            </div>

            <Paginate
            class="mt-3"
            :currentPage="meta.current_page"
            :lastPage="meta.last_page"
            @change-page="handlePageChange"
            />
        </div>
        </div>

      <div class="col-lg-6 mb-3 mb-lg-0">
        <DetailNews :news="selectedNews" />
      </div>
      <div class="col-lg-3">
        <NewsOnWeek @click-news="viewDetail" />
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.hover-card:hover {
  background-color: #f8f9fa;
  transition: background-color 0.2s ease;
}
.hover-effect:hover {
  background-color: #f8f9fa;
  border-radius: 5px;
  transition: background-color 0.2s ease;
}
</style>
