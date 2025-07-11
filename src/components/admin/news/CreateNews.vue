<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { newsService } from '../../../services/newsService'

const router = useRouter()
const toast = useToast()

const fileInput = ref<HTMLInputElement | null>(null)

const form = ref({
  title: '',
  description: '',
  content: '',
  image: null as File | null,
  imagePreview: '' as string
})

const handleImageDrop = (e: DragEvent) => {
  e.preventDefault()
  const file = e.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    form.value.image = file
    form.value.imagePreview = URL.createObjectURL(file)
  }
}

const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file && file.type.startsWith('image/')) {
    form.value.image = file
    form.value.imagePreview = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  if (!form.value.title || !form.value.description || !form.value.content || !form.value.image) {
    toast.error('❗ Vui lòng nhập đầy đủ thông tin và chọn ảnh!')
    return
  }

  const formData = new FormData()
  formData.append('title', form.value.title)
  formData.append('description', form.value.description)
  formData.append('content', form.value.content)
  formData.append('image', form.value.image)

  try {
    await newsService.addNews(formData)
    toast.success('✅ Thêm tin tức thành công!')
    router.push('/admin/news')
  } catch (err) {
    console.error(err)
    toast.error('❌ Lỗi khi thêm tin tức!')
  }
}
</script>

<template>
  <div class="container mt-4">
    <h2 class="fw-bold mb-4">📝 Thêm Tin Tức Mới</h2>

    <div class="card shadow-sm">
      <div class="card-body">
        <!-- Tiêu đề -->
        <div class="mb-3">
          <label class="form-label fw-semibold">Tiêu đề</label>
          <input v-model="form.title" type="text" class="form-control" placeholder="Nhập tiêu đề..." />
        </div>

        <!-- Mô tả -->
        <div class="mb-3">
          <label class="form-label fw-semibold">Mô tả</label>
          <input v-model="form.description" type="text" class="form-control" placeholder="Nhập mô tả..." />
        </div>

        <!-- Nội dung -->
        <div class="mb-3">
          <label class="form-label fw-semibold">Nội dung</label>
          <QuillEditor
            v-model:content="form.content"
            contentType="html"
            theme="snow"
            style="min-height: 200px"
            class="bg-white border rounded"
          />
        </div>

        <!-- Ảnh đại diện -->
        <div class="mb-4">
          <label class="form-label fw-semibold">Ảnh đại diện</label>
          <div
            class="border rounded p-4 text-center"
            @dragover.prevent
            @drop="handleImageDrop"
            @click="fileInput?.click()"
            style="cursor: pointer; background: #f8fafc"
          >
            <div v-if="form.imagePreview">
              <img :src="form.imagePreview" class="img-thumbnail" style="max-height: 150px" />
              <p class="mt-2 text-muted">Ảnh đã chọn</p>
            </div>
            <div v-else class="text-muted">Kéo thả ảnh vào đây hoặc click để chọn</div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              hidden
              @change="handleFileChange"
            />
          </div>
        </div>

        <!-- Hành động -->
        <div class="d-flex gap-2">
          <button class="btn btn-success" @click="handleSubmit">Lưu tin</button>
          <button class="btn btn-secondary" @click="$router.back()">Quay lại</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.img-thumbnail {
  object-fit: cover;
  width: 100%;
  max-width: 200px;
  border-radius: 8px;
}
</style>
