<template>
  <div class="container py-5">
    <h2 class="text-center text-primary mb-4">📦 Đơn đang xử lý</h2>

    <div v-if="message" class="alert alert-info text-center">{{ message }}</div>

    <div v-if="orders.length === 0" class="alert alert-secondary text-center">
      Không có đơn hàng nào đang chờ xử lý
    </div>

    <div v-else class="table-responsive">
      <table class="table table-bordered align-middle">
        <thead class="table-primary text-center">
          <tr>
            <th>ID</th>
            <th>Ngày đặt</th>
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
                <span
                  class="badge"
                  :class="{
                    'bg-warning text-dark': order.status === 'pending',
                    'bg-info text-dark': order.status === 'delivering',
                    'bg-success': order.status === 'delivered',
                    'bg-secondary': !['pending', 'delivering', 'delivered'].includes(order.status)
                  }"
                >
                  {{
                    order.status === 'pending'
                      ? 'Chờ xử lý'
                      : order.status === 'delivering'
                      ? 'Đang giao'
                      : order.status === 'delivered'
                      ? 'Đã giao'
                      : order.status
                  }}
                </span>
              </td>
              <td class="text-center">
                <button
                  class="btn btn-sm btn-outline-info me-2"
                  @click="toggleDetails(order.id)"
                >
                  {{ expandedOrderId === order.id ? 'Ẩn' : 'Chi tiết' }}
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="handleCancel(order.id)"
                  :disabled="order.status !== 'pending'"
                >
                  Huỷ
                </button>
              </td>
            </tr>

            <tr v-if="expandedOrderId === order.id">
              <td colspan="5">
                <div class="row">
                  <div class="col-md-6">
                    <h6>👕 Quần áo</h6>
                    <ul v-if="order.detail_clothes_orders?.length">
                      <li
                        v-for="item in order.detail_clothes_orders"
                        :key="item.id"
                        class="d-flex align-items-center gap-2 mb-2"
                      >
                        <img
                          :src="item.detail_clothes.image.url_img"
                          alt="clothes"
                          width="50"
                          class="rounded border"
                        />
                        <span>
                          {{ item.detail_clothes.product_clothes.name }} -
                          Size: {{ item.detail_clothes.size.name }},
                          Màu: {{ item.detail_clothes.color.name }},
                          SL: {{ item.quantity }}
                        </span>
                      </li>
                    </ul>
                    <p v-else class="text-muted"></p>
                  </div>

                  <div class="col-md-6">
                    <h6>🎁 Quà tặng</h6>
                    <ul v-if="order.detail_present_orders?.length">
                      <li
                        v-for="item in order.detail_present_orders"
                        :key="item.id"
                        class="d-flex align-items-center gap-2 mb-2"
                      >
                        <img
                          :src="item.detail_present.image.url_img"
                          alt="present"
                          width="50"
                          class="rounded border"
                        />
                        <span>
                          {{ item.detail_present.product_present.name }},
                          SL: {{ item.quantity }}
                        </span>
                      </li>
                    </ul>
                    <p v-else class="text-muted">Không có</p>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPendingOrders, cancelOrder } from '../../../services/user/orderService'

const orders = ref<any[]>([])
const expandedOrderId = ref<number | null>(null)
const message = ref('')

const fetchOrders = async () => {
  try {
    const res = await getPendingOrders()
    orders.value = res.data
  } catch (err) {
    console.error('Lỗi lấy đơn hàng:', err)
  }
}

const toggleDetails = (id: number) => {
  expandedOrderId.value = expandedOrderId.value === id ? null : id
}

const handleCancel = async (orderId: number) => {
  if (!confirm('Bạn có chắc muốn huỷ đơn hàng này?')) return
  try {
    await cancelOrder(orderId)
    message.value = '✅ Đã huỷ đơn hàng'
    await fetchOrders()
  } catch (err) {
    console.error(err)
    message.value = '❌ Huỷ đơn thất bại'
  }
}

const formatDate = (str: string) => {
  const d = new Date(str)
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${d.getFullYear()} ${d
    .getHours()
    .toString()
    .padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

onMounted(fetchOrders)
</script>
