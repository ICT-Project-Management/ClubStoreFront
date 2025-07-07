<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAddress, updateAddress, addOrders } from '../../../services/user/orderService'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import Header from '../../../layouts/header/Header.vue'
const toast = useToast()
const router = useRouter()

const address = ref({
  city: '',
  provine: '',
  house_code: '',
  address: ''
})

const message = ref('')
const loading = ref(false)

const fetchAddress = async () => {
  try {
    const res = await getAddress()
    address.value = res.data
  } catch (err) {
    console.error('Lỗi lấy địa chỉ:', err)
  }
}

const handleUpdate = async () => {
  loading.value = true
  try {
    await updateAddress(address.value)
    message.value = '✅ Đã cập nhật địa chỉ thành công!'
  } catch (err) {
    message.value = '❌ Cập nhật thất bại!'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleOrder = async () => {
  try {
    await addOrders()
    toast.success('🛒 Đặt hàng thành công!')
    router.push('/') 
  } catch (err) {
    toast.error('❌ Đặt hàng thất bại!')
    console.error(err)
  }
}

onMounted(fetchAddress)
</script>

<template>
    <Header />
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="bg-white p-5 rounded shadow w-100" style="max-width: 600px">
      <h3 class="mb-4 text-center">📦 Thông tin giao hàng</h3>

      <div class="mb-3">
        <label class="form-label">Tỉnh/Thành phố</label>
        <input v-model="address.city" type="text" class="form-control" placeholder="VD: Hà Nội" />
      </div>

      <div class="mb-3">
        <label class="form-label">Phường/Xã</label>
        <input v-model="address.provine" type="text" class="form-control" placeholder="VD: Phúc Xá" />
      </div>

      <div class="mb-3">
        <label class="form-label">Số nhà</label>
        <input v-model="address.house_code" type="text" class="form-control" placeholder="VD: 12A" />
      </div>

      <div class="mb-3">
        <label class="form-label">Địa chỉ chi tiết</label>
        <input v-model="address.address" type="text" class="form-control" placeholder="VD: Số 12A, Phúc Xá, Ba Đình" />
      </div>

      <div class="mb-3 text-success fw-bold" v-if="message">{{ message }}</div>

      <div class="d-flex justify-content-between">
        <button class="btn btn-primary" :disabled="loading" @click="handleUpdate">
          {{ loading ? 'Đang cập nhật...' : 'Cập nhật địa chỉ' }}
        </button>
        <button class="btn btn-success" @click="handleOrder">Đặt hàng</button>
        <button class="btn btn-secondary" @click="router.back()">Quay lại</button>
      </div>
    </div>
  </div>
</template>
