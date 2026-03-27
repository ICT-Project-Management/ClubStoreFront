<template>
  <div class="container mt-5">
    <h3 class="mb-4">{{ $t('admin.user.list') }}</h3>

    <!-- Tìm kiếm -->
    <div class="mb-3 d-flex align-items-center gap-2 flex-wrap">
      <input
        v-model="searchName"
        type="text"
        class="form-control"
        :placeholder="t('admin.user.search_name')"
        style="max-width: 250px"
        @keyup.enter="fetchUsers"
      />
      <input
        v-model="searchEmail"
        type="text"
        class="form-control"
        :placeholder="t('admin.user.search_email')"
        style="max-width: 250px"
        @keyup.enter="fetchUsers"
      />
      <button class="btn btn-outline-info" @click="fetchUsers">{{ $t('admin.user.search_btn') }}</button>
      <button class="btn btn-outline-secondary" @click="clearSearch">{{ $t('admin.user.refresh') }}</button>
    </div>

    <!-- Bảng danh sách -->
    <table class="table table-hover">
      <thead class="table-light">
        <tr>
          <th>{{ $t('admin.user.stt') }}</th>
          <th>{{ $t('admin.user.fullname') }}</th>
          <th>{{ $t('admin.user.email') }}</th>
          <th>{{ $t('admin.user.role') }}</th>
          <th>{{ $t('admin.user.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id">
          <td>{{ index + 1 }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <span
              class="badge me-2"
              :class="{
                'bg-success': user.roles?.[0]?.id === 1,
                'bg-secondary': user.roles?.[0]?.id === 2
              }"
            >
              {{ user.roles?.[0]?.name || 'user' }}
            </span>

            <!-- Chế độ chỉnh sửa -->
            <template v-if="editingUserId === user.id">
              <select
                v-model="user.selectedRoleId"
                class="form-select form-select-sm d-inline-block w-auto me-2"
              >
                <option :value="2">user</option>
                <option :value="1">admin</option>
              </select>
              <button
                class="btn btn-sm me-2"
                style="background-color: skyblue; color: white"
                @click="confirmUpdateRole(user)"
              >
                {{ $t('admin.user.update') }}
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="cancelEdit">
                {{ $t('admin.user.cancel') }}
              </button>
            </template>
          </td>
          <td>
            
            <template v-if="editingUserId !== user.id">
              <button
                class="btn btn-sm me-2"
                style="background-color: skyblue; color: white"
                @click="startEdit(user)"
              >
                {{ $t('admin.user.update_role') }}
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteUser(user.id)">{{ $t('admin.user.delete') }}</button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../../store/auth'
import { useToast } from 'vue-toastification'
const toast = useToast()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const auth = useAuthStore()
const users = ref<any[]>([])
const editingUserId = ref<number | null>(null)

const searchName = ref('')
const searchEmail = ref('')

const fetchUsers = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/list`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      },
      params: {
        name: searchName.value,
        email: searchEmail.value
      }
    })

    users.value = res.data.map((user: any) => ({
      ...user,
      selectedRoleId: user.roles?.[0]?.id || 2
    }))
  } catch (err) {
    console.error('❌ Lỗi lấy danh sách user:', err)
  }
}

const clearSearch = () => {
  searchName.value = ''
  searchEmail.value = ''
  fetchUsers()
}
const startEdit = (user: any) => {
  editingUserId.value = user.id
}
const cancelEdit = () => {
  editingUserId.value = null
}
const confirmUpdateRole = async (user: any) => {
  if (user.selectedRoleId === user.roles?.[0]?.id) {
    toast.warning('Không có thay đổi nào để cập nhật!')
    editingUserId.value = null
    return
  }

  try {
    await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/user/update/${user.id}`,
      { role_id: user.selectedRoleId },
      {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      }
    )
    toast.success(t('admin.user.update_role') + ' thành công!')
    editingUserId.value = null
    fetchUsers()
  } catch (err) {
    console.error('❌ Cập nhật lỗi:', err)
    toast.error(t('admin.user.update_role') + ' thất bại!')
  }
}

// Xoá user
const deleteUser = async (id: number) => {
  if (!confirm('Bạn có chắc muốn xoá người dùng này?')) return
  try {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/user/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    toast.success('Xoá người dùng thành công!')
    fetchUsers()
  } catch (err) {
    console.error('❌ Xoá lỗi:', err)
    toast.warning('Xoá người dùng thất bại!')
  }
}

// Load lần đầu
onMounted(fetchUsers)
</script>
