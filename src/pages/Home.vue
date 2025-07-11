<script setup lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Header from '../layouts/header/Header.vue'
import Footer from '../layouts/footer/Footer.vue'
import AddCart from '../components/cart/AddCart.vue'
import { ref, watch, onMounted } from 'vue'
import { fetchClothes, fetchPresents } from '../services/productService'
import { useRoute, useRouter } from 'vue-router'
import LastestNews from '../components/user/news/LastestNews.vue'
const route = useRoute()
const router = useRouter()

const type = ref<'clothes' | 'present'>(route.query.type === 'present' ? 'present' : 'clothes')
const search = ref('')
const loading = ref(false)
const products = ref<any[]>([])
const selectedOptions = ref<Record<number, any>>({})
const quantities = ref<Record<number, number>>({})
const cartItem = ref<{ type: 'clothes' | 'present'; detailId: number; quantity: number } | null>(null)

const updateQuantity = (id: number, value: number) => {
  if (value < 1) value = 1
  quantities.value[id] = value
}

const groupProducts = (items: any[]) => {
  const grouped: Record<number, any> = {}
  items.forEach(item => {
    const product = item.product_clothes
    const productId = product?.id
    if (!grouped[productId]) grouped[productId] = { product, items: [] }
    grouped[productId].items.push(item)
  })
  return Object.values(grouped)
}

const loadData = async () => {
  loading.value = true
  try {
    if (type.value === 'clothes') {
      const res = await fetchClothes(search.value)
      products.value = groupProducts(res.data)
    } else {
      const res = await fetchPresents()
      products.value = res.data
    }
  } catch (err) {
    console.error('Lỗi khi load:', err)
  } finally {
    loading.value = false
  }
}

const selectItem = (groupId: number, key: string, value: any) => {
  selectedOptions.value[groupId] = {
    ...selectedOptions.value[groupId],
    [key]: value
  }
}

const selectedItem = (group: any) => {
  const sel = selectedOptions.value[group.product?.id] || {}
  return (group.items as any[]).find((i: any) => {
    return (!sel.color || i.color?.id === sel.color?.id) &&
           (!sel.size || i.size?.id === sel.size?.id)
  }) || group.items[0]
}

const getSizesByColor = (items: any[], selectedColor: any) => {
  const filtered = selectedColor
    ? items.filter(i => i.color?.id === selectedColor.id)
    : items
  const seen = new Set()
  return filtered.map(i => i.size).filter(val => {
    if (!val || seen.has(val.id)) return false
    seen.add(val.id)
    return true
  })
}

const getUnique = (items: any[], key: 'color' | 'size') => {
  const seen = new Set()
  return items.map(i => i[key]).filter(val => {
    if (!val || seen.has(val.id)) return false
    seen.add(val.id)
    return true
  })
}

const formatPrice = (val: number) => new Intl.NumberFormat('vi-VN').format(val)

onMounted(loadData)

watch(() => route.query.type, (val) => {
  type.value = val === 'present' ? 'present' : 'clothes'
  search.value = ''
  loadData()
})
const handleClickNews = (id: number | string) => {
  if (typeof id === 'number') {
    router.push({ path: '/view/all-news', query: { id } })
  } else {
    router.push('/view/all-news')
  }
}
</script>

<template>
  <Header />
  <div class="container-fluid h-100" style="padding-top: 64px;">
    <div class="container me-lg-300 py-4">
      <div class="d-flex justify-content-center mb-4">
        <ul class="nav nav-pills bg-white shadow-sm px-2 py-2 rounded-pill gap-2">
          <li class="nav-item">
            <a
              class="nav-link d-flex align-items-center gap-2 px-4 py-2 rounded-pill"
              :class="{ active: type === 'clothes' }"
              @click="router.push({ query: { type: 'clothes' } })"
            >
              <i class="bi bi-shirt"></i> Quần áo
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link d-flex align-items-center gap-2 px-4 py-2 rounded-pill"
              :class="{ active: type === 'present' }"
              @click="router.push({ query: { type: 'present' } })"
            >
              <i class="bi bi-gift"></i> Quà lưu niệm
            </a>
          </li>
        </ul>
      </div>

      <!-- Danh sách sản phẩm -->
      <div class="row row-cols-1 row-cols-md-3 g-4">
        <!-- Clothes -->
        <template v-if="type === 'clothes'">
          <div v-for="group in products" :key="group.product.id" class="col">
            <div class="card h-100 border-0 shadow-sm">
              <img
                v-if="selectedItem(group)?.image?.url_img"
                :src="selectedItem(group).image.url_img"
                class="card-img-top product-img"
                alt="Ảnh sản phẩm"
              />
              <div class="card-body">
                <h6 class="card-title text-primary">{{ group.product.name }}</h6>

                <div class="mb-2">
                  <strong>Size:</strong>
                  <button
                    v-for="size in getSizesByColor(group.items, selectedOptions[group.product.id]?.color)"
                    :key="size.id"
                    @click="selectItem(group.product.id, 'size', size)"
                    :class="['btn btn-sm me-1 mt-1', selectedOptions[group.product.id]?.size?.id === size.id ? 'btn-primary' : 'btn-outline-primary']"
                  >
                    {{ size.name }}
                  </button>
                </div>

                <div class="mb-2">
                  <strong>Màu:</strong>
                  <span
                    v-for="color in getUnique(group.items, 'color')"
                    :key="color.id"
                    class="color-circle me-2 mt-1"
                    :style="{ backgroundColor: color.color_code }"
                    @click="selectItem(group.product.id, 'color', color)"
                  ></span>
                </div>

                <div class="mb-2 d-flex align-items-center">
                  <strong class="me-2">SL:</strong>
                  <input
                    type="number"
                    class="form-control form-control-sm"
                    style="width: 70px"
                    :value="quantities[group.product.id] || 1"
                    @input="updateQuantity(group.product.id, +($event.target as HTMLInputElement).value)"
                  />
                </div>

                <p class="mb-1 small">Giá: <strong>{{ formatPrice(group.product.price) }}₫</strong></p>
                <p class="mb-0 small text-muted">Kho: {{ selectedItem(group)?.stock || 0 }} | Đã bán: {{ selectedItem(group)?.sold_count || 0 }}</p>

                <div class="d-flex justify-content-between mt-3">
                  <button
                    class="btn btn-success btn-sm w-50 me-1"
                    @click="cartItem = {
                      type: 'clothes',
                      detailId: selectedItem(group)?.id,
                      quantity: quantities[group.product.id] || 1
                    }"
                  >
                    <i class="bi bi-cart-plus"></i> Add Cart
                  </button>
                  <button class="btn btn-outline-danger btn-sm w-50">
                    <i class="bi bi-heart"></i> Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Presents -->
        <template v-else>
          <div v-for="item in products" :key="item.id" class="col">
            <div class="card h-100 border-0 shadow-sm">
              <img
                v-if="item.image?.url_img"
                :src="item.image.url_img"
                class="card-img-top product-img"
                alt="Ảnh sản phẩm"
              />
              <div class="card-body">
                <h6 class="card-title text-success">{{ item.product_present?.name }}</h6>
                <p class="mb-1 small">Chất liệu: {{ item.product_present?.metarial }}</p>
                <p class="mb-1 small">Trọng lượng: {{ item.product_present?.weight }} kg</p>

                <div class="mb-2 d-flex align-items-center">
                  <strong class="me-2">SL:</strong>
                  <input
                    type="number"
                    class="form-control form-control-sm"
                    style="width: 70px"
                    :value="quantities[item.id] || 1"
                    @input="updateQuantity(item.id, +($event.target as HTMLInputElement).value)"
                  />
                </div>

                <p class="mb-1 small">Giá: <strong>{{ formatPrice(item.product_present?.price) }}₫</strong></p>
                <p class="mb-0 small text-muted">Kho: {{ item.stock }} | Đã bán: {{ item.sold_count }}</p>

                <div class="d-flex justify-content-between mt-3">
                  <button
                    class="btn btn-success btn-sm w-50 me-1"
                    @click="cartItem = {
                      type: 'present',
                      detailId: item.id,
                      quantity: quantities[item.id] || 1
                    }"
                  >
                    <i class="bi bi-cart-plus"></i> Add Cart
                  </button>
                  <button class="btn btn-outline-danger btn-sm w-50">
                    <i class="bi bi-heart"></i> Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <LastestNews class="mt-5" @click-news="handleClickNews"/>

  <AddCart
    v-if="cartItem"
    :type="cartItem.type"
    :detailId="cartItem.detailId"
    :quantity="cartItem.quantity"
    @onSuccess="cartItem = null"
  />

  <Footer />
</template>

<style scoped>
.color-circle {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #aaa;
  cursor: pointer;
}
.product-img {
  height: 140px;
  object-fit: contain;
  transition: transform 0.2s ease;
  padding: 4px;
}
.product-img:hover {
  transform: scale(1.05);
}
.card-title {
  font-size: 1rem;
  font-weight: 600;
}
.nav-pills .nav-link {
  color: #495057;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  font-weight: 500;
  cursor: pointer;
}
.nav-pills .nav-link.active {
  background-color: #0d6efd;
  color: #fff !important;
  box-shadow: 0 4px 10px rgba(13, 110, 253, 0.25);
}
</style>
