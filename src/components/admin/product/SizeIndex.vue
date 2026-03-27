<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold">{{ $t('admin.product.manage_sizes') }}</h4>
      <button class="btn btn-outline-primary" @click="showAddModal = true">{{ $t('admin.product.add_size') }}</button>
    </div>

    <div class="list-group">
      <div v-for="item in sizes" :key="item.id" class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong>{{ item.name }}</strong>
          <div class="text-muted small">{{ item.description }}</div>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-danger" @click="remove(item.id)">{{ $t('admin.product.delete') }}</button>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" class="modal d-block" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t('admin.product.add_size') }}</h5>
            <button type="button" class="btn-close" @click="showAddModal = false"></button>
          </div>
          <div class="modal-body">
            <input v-model="newSize.name" class="form-control mb-2" :placeholder="t('admin.product.size_name')" />
            <input v-model="newSize.description" class="form-control" :placeholder="t('admin.product.description')" />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showAddModal = false">{{ $t('admin.product.close') }}</button>
            <button class="btn btn-primary" @click="saveSize">{{ $t('admin.product.save') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { useAuthStore } from '../../../store/auth'
const API = import.meta.env.VITE_API_BASE_URL
const auth = useAuthStore()
const { t } = useI18n()
const sizes = ref<any[]>([])
const showAddModal = ref(false)
const newSize = ref({ name: '', description: '' })

const loadData = async () => {
  try {
    const res = await axios.get(`${API}/sizes`, { headers: { Authorization: `Bearer ${auth.token}` } })
    sizes.value = res.data
  } catch(e) {}
}

const saveSize = async () => {
  try {
    await axios.post(`${API}/sizes`, newSize.value, { headers: { Authorization: `Bearer ${auth.token}` } })
    showAddModal.value = false
    newSize.value = { name: '', description: '' }
    loadData()
  } catch (err) {
    alert('Thêm lỗi')
  }
}

const remove = async (id: number) => {
  if (!confirm('Xóa size này?')) return
  await axios.delete(`${API}/sizes/${id}`, { headers: { Authorization: `Bearer ${auth.token}` } })
  loadData()
}

onMounted(loadData)
</script>
