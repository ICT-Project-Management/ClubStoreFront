<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { newsService } from '../../../services/newsService'
import { useToast } from 'vue-toastification'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjs.locale('vi')
dayjs.extend(relativeTime)

const emit = defineEmits(['click-news']) 

const toast = useToast()
const latestNews = ref<any[]>([])

const fetchLatestNews = async () => {
  try {
    latestNews.value = await newsService.fetchNewNews()
  } catch (err) {
    toast.error('Không thể tải tin mới!')
  }
}

const timeFromNow = (date: string) => {
  return dayjs(date).fromNow()
}

const handleClickNews = (item: any) => {
  emit('click-news', item.id)
}

const handleNewsPage = () => {
  emit('click-news', 'all')
}

onMounted(fetchLatestNews)
</script>

<template>
  <div class="latest-sidebar d-none d-lg-block">
    <div class="position-sticky top-0">
      <h5 class="fw-bold text-dark mb-3 border-bottom pb-2">Tin tức mới</h5>

      <div
        v-for="item in latestNews"
        :key="item.id"
        class="card mb-3 shadow-sm hover-card"
        style="cursor: pointer;"
        @click="handleClickNews(item)"
      >
        <div class="row g-0">
          <div class="col-4">
            <img :src="item.image?.url_img" class="img-fluid rounded-start" style="height: 100%; object-fit: cover;" />
          </div>
          <div class="col-8">
            <div class="card-body p-2">
              <h6 class="card-title text-truncate mb-1">{{ item.title }}</h6>
              <p class="card-text text-muted small text-truncate">{{ item.description }}</p>
              <p class="text-muted small mb-0">🕒 {{ timeFromNow(item.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-end mt-3">
        <button class="btn btn-outline-info btn-sm" @click="handleNewsPage">
          Xem thêm tin tức
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.latest-sidebar {
  position: fixed;
  top: 64px;
  right: 0;
  width: 300px;
  height: 62vh;
  background: #fff;
  padding: 1rem;
  border-left: 1px solid #dee2e6;
  z-index: 1000;
  box-shadow: -2px 0 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.news-scroll {
  overflow-y: auto;
  flex-grow: 1;
  padding-right: 4px;
}

.news-card {
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.news-card:hover {
  background-color: #f1f5f9;
  border-radius: 6px;
}
</style>