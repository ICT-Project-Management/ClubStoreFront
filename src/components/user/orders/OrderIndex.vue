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

const paymentMethod = ref('cod')
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
    const res = await addOrders({ payment_method: paymentMethod.value })

    if (paymentMethod.value === 'vnpay' && res.data?.payment_url) {
      window.location.href = res.data.payment_url
    } else {
      toast.success('Đặt hàng thành công!')
      router.push('/')
    }
  } catch (err) {
    toast.error('Đặt hàng thất bại!')
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
      <div class="mb-4">
        <label class="form-label mb-2">Phương thức thanh toán</label>
        <div class="d-flex flex-column gap-2">
          <div
            class="form-check form-check-inline p-3 rounded"
            :class="{
              'border border-2 border-info bg-light': paymentMethod === 'cod',
              'border': paymentMethod !== 'cod'
            }"
          >
            <input
              class="form-check-input"
              type="radio"
              id="cod"
              value="cod"
              v-model="paymentMethod"
            />
            <label class="form-check-label ms-2" for="cod">
              <i class="bi bi-wallet"></i>
               Thanh toán khi nhận hàng (COD)
            </label>
          </div>

          <div
            class="form-check form-check-inline p-3 rounded"
            :class="{
              'border border-2 border-info bg-light': paymentMethod === 'vnpay',
              'border': paymentMethod !== 'vnpay'
            }"
          >
            <input
              class="form-check-input"
              type="radio"
              id="vnpay"
              value="vnpay"
              v-model="paymentMethod"
            />
            <label class="form-check-label d-flex align-items-center gap-2 ms-2" for="vnpay">
              <img
                src="../../../assets/vnpay.png"
                alt="VNPay"
                style="height: 24px"
              />
              Thanh toán qua VNPay
            </label>
          </div>

          <div
            class="form-check form-check-inline p-3 rounded"
            :class="{
              'border border-2 border-info bg-light': paymentMethod === 'qr',
              'border': paymentMethod !== 'qr'
            }"
          >
            <input
              class="form-check-input"
              type="radio"
              id="qr"
              value="qr"
              v-model="paymentMethod"
            />
            <label class="form-check-label ms-2" for="qr">
              <i class="bi bi-qr-code"></i>
               Quét mã QR
            </label>
          </div>

          <div
            class="form-check form-check-inline p-3 rounded"
            :class="{
              'border border-2 border-info bg-light': paymentMethod === 'bank',
              'border': paymentMethod !== 'bank'
            }"
          >
            <input
              class="form-check-input"
              type="radio"
              id="bank"
              value="bank"
              v-model="paymentMethod"
            />
            <label class="form-check-label ms-2" for="bank">
              <i class="bi bi-credit-card-2-front"></i>
               Chuyển khoản ngân hàng
            </label>
          </div>
        </div>
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
