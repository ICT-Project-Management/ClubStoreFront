<script setup lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Header from '../layouts/header/Header.vue'
import Footer from '../layouts/footer/Footer.vue'
import { ref, watch, onMounted } from 'vue'
import { fetchClothes, fetchPresents } from '../services/productService'
import AddCart from '../components/cart/AddCart.vue'

const type = ref<'clothes' | 'present'>('clothes')
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

const handleSearch = () => {
  if (type.value === 'clothes') loadData()
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
watch(type, () => {
  search.value = ''
  loadData()
})
</script>

<template>
  <Header />
  <div class="container-fluid h-100" style="padding-top: 64px;">
    <div class="container py-4">
      <h2 class="text-primary mb-4">🛒 Danh sách sản phẩm</h2>

      <!-- Bộ lọc -->
      <div class="row mb-4 align-items-end">
        <div class="col-md-3">
          <label class="form-label">Loại sản phẩm</label>
          <select v-model="type" class="form-select">
            <option value="clothes">Quần áo</option>
            <option value="present">Quà lưu niệm</option>
          </select>
        </div>
      </div>

      <!-- Danh sách sản phẩm -->
      <div class="row row-cols-1 row-cols-md-3 g-4">
        <!-- Clothes -->
        <template v-if="type === 'clothes'">
          <div v-for="group in products" :key="group.product.id" class="col">
            <div class="card h-100 shadow-sm border-0">
              <img
                v-if="selectedItem(group)?.image?.url_img"
                :src="selectedItem(group).image.url_img"
                class="card-img-top product-img"
                alt="Ảnh sản phẩm"
              />
              <div class="card-body">
                <h5 class="card-title text-primary">{{ group.product.name }}</h5>

                <div class="mb-2">
                  <strong>Size:</strong>
                  <button
                    v-for="size in getSizesByColor(group.items, selectedOptions[group.product.id]?.color)"
                    :key="size.id"
                    @click="selectItem(group.product.id, 'size', size)"
                    :class="['btn btn-sm me-1', selectedOptions[group.product.id]?.size?.id === size.id ? 'btn-primary' : 'btn-outline-primary']"
                  >
                    {{ size.name }}
                  </button>
                </div>

                <div class="mb-2">
                  <strong>Màu:</strong>
                  <span
                    v-for="color in getUnique(group.items, 'color')"
                    :key="color.id"
                    class="color-circle me-2"
                    :style="{ backgroundColor: color.color_code }"
                    @click="selectItem(group.product.id, 'color', color)"
                  ></span>
                </div>

                <div class="mb-2 d-flex align-items-center">
                  <strong class="me-2">Số lượng:</strong>
                  <input
                    type="number"
                    class="form-control form-control-sm"
                    style="width: 80px"
                    :value="quantities[group.product.id] || 1"
                    @input="updateQuantity(group.product.id, +($event.target as HTMLInputElement).value)"
                  />
                </div>

                <p class="mb-1">Giá: <strong>{{ formatPrice(group.product.price) }}₫</strong></p>
                <p class="mb-0">Kho: {{ selectedItem(group)?.stock || 0 }} | Đã bán: {{ selectedItem(group)?.sold_count || 0 }}</p>

                <div class="d-flex justify-content-between mt-3">
                  <button
                    class="btn btn-outline-success btn-sm w-50 me-1"
                    @click="cartItem = {
                      type: 'clothes',
                      detailId: selectedItem(group)?.id,
                      quantity: quantities[group.product.id] || 1
                    }"
                  >
                    <i class="bi bi-cart-plus"></i> Thêm vào giỏ
                  </button>
                  <button class="btn btn-outline-danger btn-sm w-50">
                    <i class="bi bi-heart"></i> Yêu thích
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Presents -->
        <template v-else>
          <div v-for="item in products" :key="item.id" class="col">
            <div class="card h-100 shadow-sm border-0">
              <img
                v-if="item.image?.url_img"
                :src="item.image.url_img"
                class="card-img-top product-img"
                alt="Ảnh sản phẩm"
              />
              <div class="card-body">
                <h5 class="card-title text-success">{{ item.product_present?.name }}</h5>
                <p>Chất liệu: {{ item.product_present?.metarial }}</p>
                <p>Trọng lượng: {{ item.product_present?.weight }} kg</p>

                <div class="mb-2 d-flex align-items-center">
                  <strong class="me-2">Số lượng:</strong>
                  <input
                    type="number"
                    class="form-control form-control-sm"
                    style="width: 80px"
                    :value="quantities[item.id] || 1"
                    @input="updateQuantity(item.id, +($event.target as HTMLInputElement).value)"
                  />
                </div>

                <p class="mb-1">Giá: <strong>{{ formatPrice(item.product_present?.price) }}₫</strong></p>
                <p class="mb-0">Kho: {{ item.stock }} | Đã bán: {{ item.sold_count }}</p>

                <div class="d-flex justify-content-between mt-3">
                  <button
                    class="btn btn-outline-success btn-sm w-50 me-1"
                    @click="cartItem = {
                      type: 'present',
                      detailId: item.id,
                      quantity: quantities[item.id] || 1
                    }"
                  >
                    <i class="bi bi-cart-plus"></i> Thêm vào giỏ
                  </button>
                  <button class="btn btn-outline-danger btn-sm w-50">
                    <i class="bi bi-heart"></i> Yêu thích
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>


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
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid #aaa;
  cursor: pointer;
}
.card-title {
  font-weight: 600;
  font-size: 1.1rem;
}
.product-img {
  height: 180px;
  object-fit: contain;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding: 8px;
}
.product-img:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.btn i {
  margin-right: 4px;
  transition: transform 0.2s;
}
.btn:hover i {
  transform: scale(1.2);
}
</style>
