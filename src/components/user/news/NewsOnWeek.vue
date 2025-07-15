<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { newsService } from '../../../services/newsService'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'

const weeklyNews = ref<any[]>([])

const emit = defineEmits<{
  (e: 'click-news', id: number): void
}>()

const fetchWeeklyNews = async () => {
  weeklyNews.value = await newsService.fetchNewsOnWeek()
}

const formatDate = (date: string) => {
  return dayjs(date).locale('vi').format('DD/MM/YYYY')
}

const onClick = (id: number) => {
  emit('click-news', id)
}

onMounted(fetchWeeklyNews)
</script>

<template>
  <div class="bg-white border p-3 shadow-sm rounded">
    <h5 class="fw-bold text-dark mb-3 border-bottom pb-2">Tin trong tuần</h5>
    <div v-if="weeklyNews.length > 0">
      <table class="table table-sm table-hover align-middle">
        <tbody>
          <tr
            v-for="item in weeklyNews"
            :key="item.id"
            style="cursor: pointer"
            @click="onClick(item.id)"
          >
            <td style="width: 65px">
              <img
                :src="item.image?.url_img"
                alt="img"
                class="rounded"
                style="width: 60px; height: 45px; object-fit: cover;"
              />
            </td>
            <td class="text-truncate-title">
                <div class="fw-semibold">{{ item.title }}</div>
                <small class="text-muted">{{ formatDate(item.created_at) }}</small><br>
                <small>{{ item.description }}</small>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-muted text-center py-3">
      Không có tin tức trong tuần.
    </div>
  </div>
</template>

<style scoped>
.table-hover tbody tr:hover {
  background-color: #f1f5f9;
}
</style>
