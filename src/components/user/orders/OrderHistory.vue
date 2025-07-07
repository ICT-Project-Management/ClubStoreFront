<template>
  <div class="container py-5">
    <h2 class="text-center text-primary mb-4">📋 Lịch sử đơn hàng</h2>

    <div v-if="message" class="alert alert-info text-center">{{ message }}</div>

    <div class="table-responsive">
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
                    'bg-success': ['delivered', 'completed'].includes(order.status),
                    'bg-danger': order.status === 'cancelled',
                    'bg-secondary': !['pending', 'delivering', 'delivered', 'completed', 'cancelled'].includes(order.status)
                  }"
                >
                  {{
                    order.status === 'pending'
                      ? 'Chờ xử lý'
                      : order.status === 'delivering'
                      ? 'Đang giao'
                      : order.status === 'delivered'
                      ? 'Đã giao'
                      : order.status === 'completed'
                      ? 'Hoàn tất'
                      : order.status === 'cancelled'
                      ? 'Đã huỷ'
                      : order.status
                  }}
                </span>
              </td>
              <td class="text-center">
                <button
                  class="btn btn-sm btn-outline-info"
                  @click="toggleDetails(order.id)"
                >
                  {{ expandedOrderId === order.id ? 'Ẩn' : 'Chi tiết' }}
                </button>
              </td>
            </tr>

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

                  <!-- Quà tặng -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getOrders } from '../../../services/user/orderService'

const orders = ref<any[]>([])
const expandedOrderId = ref<number | null>(null)
const message = ref('')

const fetchOrders = async () => {
  try {
    const res = await getOrders()
    orders.value = res.data
  } catch (err) {
    console.error('Lỗi lấy đơn hàng:', err)
  }
}

const toggleDetails = (id: number) => {
  expandedOrderId.value = expandedOrderId.value === id ? null : id
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

<style scoped>
.object-fit-cover {
  object-fit: cover;
}
</style>
