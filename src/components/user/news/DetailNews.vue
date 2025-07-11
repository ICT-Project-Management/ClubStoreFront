<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/vi'

const props = defineProps<{
  news: any | null
}>()

const formatDate = (date: string) => {
  return dayjs(date).locale('vi').format('DD [thg] MM, YYYY')
}
</script>

<template>
  <div class="container" style="padding-top: 20px; padding-bottom: 60px">
    <div v-if="news" class="mx-auto" style="max-width: 850px">
      <h1 class="fw-bold mb-3 text-center">{{ news.title }}</h1>

      <p class="text-muted text-center fst-italic mb-4">
        🕒 Đăng ngày {{ formatDate(news.created_at) }}
      </p>

      <div class="text-center mb-4">
        <img
          v-if="news.image"
          :src="news.image.url_img"
          class="img-fluid rounded shadow"
          alt="Ảnh đại diện"
          style="max-height: 400px; object-fit: cover"
        />
      </div>

      <h5 class="text-dark fw-semibold mb-3">{{ news.description }}</h5>

      <div
        class="news-content p-4 bg-light border rounded"
        style="line-height: 1.8; font-size: 1rem"
        v-html="news.content"
      ></div>
    </div>

    <div v-else class="text-center py-5 text-muted">
      <div class="spinner-border text-primary mb-3" role="status"></div>
      <p>Chọn một tin tức để xem chi tiết</p>
    </div>
  </div>
</template>

<style>
.news-content img {
  max-width: 100% !important;
  height: auto !important;
  display: block;
  margin: 16px auto;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
