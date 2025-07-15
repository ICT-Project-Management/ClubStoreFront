<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getOrders, updateStatus, downloadOrderDoc} from '../../../services/admin/orderAdminService'
import { useToast } from 'vue-toastification'
import ExportExcel from './ExportExcel.vue';
const toast = useToast();
const filters = ref({
  date_from: '',
  date_to: '',
  price_min: '',
  price_max: ''
})

const orders = ref<any[]>([])
const expandedOrderId = ref<number | null>(null)
const selectedStatus = ref<Record<number, string>>({})
const message = ref('')

const fetchOrders = async () => {
  try {
    const query = Object.fromEntries(
      Object.entries(filters.value).filter(([_, v]) => v !== '' && v !== null)
    )
    const res = await getOrders(query)
    orders.value = res.data
  } catch (err) {
    console.error('Lỗi khi lấy danh sách đơn:', err)
  }
}

const handleUpdate = async (orderId: number) => {
  const status = selectedStatus.value[orderId]
  if (!status) return
  try {
    await updateStatus(orderId, status)
    message.value = '✅ Cập nhật trạng thái thành công'
    await fetchOrders()
  } catch (err) {
    console.error(err)
    message.value = '❌ Lỗi khi cập nhật trạng thái'
  }
}

const toggleDetails = (id: number) => {
  expandedOrderId.value = expandedOrderId.value === id ? null : id
}

const formatDate = (str: string) => {
  const d = new Date(str)
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
    .toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours()
    .toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}
const handleDownloadOrder = async (orderId: number) => {
  try {
    await downloadOrderDoc(orderId)
  } catch (error) {
    toast.warning('Download file error!!!!');
  }
}
onMounted(fetchOrders)
</script>

<template>
  <div class="container py-4">
    <h2 class="mb-4 text-dark">Quản lý đơn hàng</h2>

    <!-- BỘ LỌC -->
    <div class="card p-3 mb-1 shadow-sm">
      <div class="row g-3">
        <div class="col-md-3">
          <label>Ngày bắt đầu</label>
          <input type="date" class="form-control" v-model="filters.date_from" />
        </div>
        <div class="col-md-3">
          <label>Ngày kết thúc</label>
          <input type="date" class="form-control" v-model="filters.date_to" />
        </div>
        <div class="col-md-3">
          <label>Giá tối thiểu</label>
          <input type="number" class="form-control" v-model="filters.price_min" />
        </div>
        <div class="col-md-3">
          <label>Giá tối đa</label>
          <input type="number" class="form-control" v-model="filters.price_max" />
        </div>
      </div>
      <div class="text-end mt-3">
        <button class="btn btn-primary" @click="fetchOrders">🔍 Lọc</button>
      </div>
    </div>

    <div v-if="message" class="alert alert-info text-center">{{ message }}</div>
    <ExportExcel class="mb-1"/>
    <!-- BẢNG -->
    <table class="table table-bordered align-middle">
      <thead class="table-light text-center">
        <tr>
          <th>ID</th>
          <th>Ngày</th>
          <th>Tổng tiền</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="order in orders" :key="order.id">
          <tr :class="{ 'table-light': expandedOrderId === order.id }">
            <td>#{{ order.id }}</td>
            <td>{{ formatDate(order.created_at) }}</td>
            <td>{{ order.total_price.toLocaleString() }}đ</td>
            <td>
              <span class="badge"
                :class="{
                  'bg-warning text-dark': order.status === 'pending',
                  'bg-info text-dark': order.status === 'delivering',
                  'bg-success': ['delivered', 'completed'].includes(order.status),
                  'bg-danger': order.status === 'cancelled'
                }">
                {{ order.status }}
              </span>
            </td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-info me-2" @click="toggleDetails(order.id)">
                {{ expandedOrderId === order.id ? 'Ẩn' : 'Chi tiết' }}
              </button>
              <template v-if="!['completed', 'cancelled'].includes(order.status)">
                <select class="form-select form-select-sm d-inline w-auto me-1" v-model="selectedStatus[order.id]">
                  <option disabled value="">--Chọn--</option>
                  <option v-if="order.status === 'pending'" value="delivering">Đang giao</option>
                  <option v-if="order.status === 'pending'" value="cancelled">Huỷ</option>
                  <option v-if="order.status === 'delivering'" value="delivered">Đã giao</option>
                  <option v-if="order.status === 'delivering'" value="cancelled">Hủy</option>
                  <option v-if="['delivering','delivered'].includes(order.status)" value="completed">Hoàn tất</option>
                </select>
                <button class="btn btn-sm btn-outline-success" @click="handleUpdate(order.id)" :disabled="!selectedStatus[order.id]">
                  Cập nhật
                </button>
              </template>
              <span v-else class="text-muted"></span>
              <button
                class="btn btn-sm btn-outline-dark d-inline-flex align-items-center gap-1 ms-3"
                @click="handleDownloadOrder(order.id)"
                title="Tải file Word đơn hàng"
              >
                🖨️ <span>In đơn</span>
              </button>
            </td>
          </tr>

          <!-- CHI TIẾT -->
          <tr v-if="expandedOrderId === order.id">
            <td colspan="5">
              <div class="row g-4">
                <!-- Quần áo -->
                <div class="col-md-6">
                  <h6 class="text-primary">👕 Sản phẩm quần áo</h6>
                  <div v-if="order.detail_clothes_orders?.length" class="d-flex flex-column gap-2">
                    <div
                      v-for="item in order.detail_clothes_orders"
                      :key="item.id"
                      class="d-flex align-items-center gap-3 border rounded p-2 shadow-sm"
                    >
                      <img
                        :src="item.detail_clothes.image.url_img"
                        alt="clothes"
                        width="60"
                        height="60"
                        class="rounded border object-fit-cover"
                      />
                      <div>
                        <strong>{{ item.detail_clothes.product_clothes.name }}</strong><br />
                        <small>Size: {{ item.detail_clothes.size.name }},</small>
                        <small>Màu: {{ item.detail_clothes.color.name }}</small><br />
                        <small>SL: {{ item.quantity }}</small>
                      </div>
                    </div>
                  </div>
                  <p v-else class="text-muted"></p>
                </div>

                <!-- Quà lưu niệm -->
                <div class="col-md-6">
                  <h6 class="text-success">🎁 Sản phẩm quà lưu niệm</h6>
                  <div v-if="order.detail_present_orders?.length" class="d-flex flex-column gap-2">
                    <div
                      v-for="item in order.detail_present_orders"
                      :key="item.id"
                      class="d-flex align-items-center gap-3 border rounded p-2 shadow-sm"
                    >
                      <img
                        :src="item.detail_present.image.url_img"
                        alt="present"
                        width="60"
                        height="60"
                        class="rounded border object-fit-cover"
                      />
                      <div>
                        <strong>{{ item.detail_present.product_present.name }}</strong><br />
                        <small>SL: {{ item.quantity }}</small>
                      </div>
                    </div>
                  </div>
                  <p v-else class="text-muted"></p>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}
</style>
