<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { newsService } from '../../../services/newsService'
import Paginate from '../../../layouts/paginate/Paginate.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()

const newsList = ref<any[]>([])
const meta = ref({ current_page: 1, last_page: 1 })
const filters = ref({ title: '', page: 1 })

const fetchNews = async () => {
  const data = await newsService.fetchAllNews(filters.value)
  newsList.value = data.data
  meta.value.current_page = data.current_page
  meta.value.last_page = data.last_page
}

const handleSearch = () => {
  filters.value.page = 1
  fetchNews()
}

const handleDelete = async (id: number) => {
  if (confirm('Bạn có chắc chắn muốn xoá tin này?')) {
    await newsService.deleteNews(id)
    toast.success('Delete suscessfully !')
    fetchNews()
  }
}

const handlePageChange = (page: number) => {
  filters.value.page = page
  fetchNews()
}

const goToCreate = () => {
  router.push('/admin/news/create')
}

onMounted(fetchNews)
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="fw-bold">📰 Quản lý Tin tức</h2>
      <button @click="goToCreate" class="btn btn-success">
        ➕ Thêm tin tức
      </button>
    </div>

    <!-- Tìm kiếm -->
    <div class="input-group mb-4 w-50">
      <input
        type="text"
        class="form-control"
        placeholder="Tìm theo tiêu đề..."
        v-model="filters.title"
      />
      <button class="btn btn-primary" @click="handleSearch">Tìm</button>
    </div>

    <!-- Bảng danh sách -->
    <div class="table-responsive">
    <table class="table table-bordered align-middle text-center">
        <thead class="table-light">
        <tr>
            <th>Id</th>
            <th>Ảnh</th>
            <th class="text-start">Tiêu đề</th>
            <th class="text-start">Mô tả</th>
            <th class="text-start">Nội dung</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in newsList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>
            <img
                v-if="item.image"
                :src="item.image.url_img"
                class="rounded"
                style="width: 60px; height: 45px; object-fit: cover;"
                alt="Ảnh"
            />
            <span v-else>-</span>
            </td>
            <td class="text-start fw-semibold">{{ item.title }}</td>
            <td class="text-start">{{ item.description }}</td>
            <td class="text-start text-muted">{{ item.content.slice(0, 100) }}...</td>
            <td class="text-muted">{{ new Date(item.created_at).toLocaleDateString('vi-VN') }}</td>
            <td>
            <button
                @click="handleDelete(item.id)"
                class="btn btn-sm btn-outline-danger"
            >
                Xoá
            </button>
            </td>
        </tr>
        <tr v-if="newsList.length === 0">
            <td colspan="7" class="text-center text-muted py-3">Không có tin tức nào.</td>
        </tr>
        </tbody>
    </table>
    </div>


    <!-- Phân trang -->
    <div class="mt-3 d-flex justify-content-center">
      <Paginate
        :currentPage="meta.current_page"
        :lastPage="meta.last_page"
        @change-page="handlePageChange"
      />
    </div>
  </div>
</template>
