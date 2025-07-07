<script setup lang="ts">
import { defineProps, watchEffect } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../store/auth'
import { useToast } from 'vue-toastification'

const toast = useToast()
const auth = useAuthStore()

const props = defineProps<{
  type: 'clothes' | 'present'
  detailId: number
  quantity: number
  onSuccess?: () => void
}>()

watchEffect(async () => {
  try {
    const url =
      props.type === 'clothes'
        ? `${import.meta.env.VITE_API_BASE_URL}/cart/clothes`
        : `${import.meta.env.VITE_API_BASE_URL}/cart/presents`

    await axios.post(
      url,
      props.type === 'clothes'
        ? { detail_clothes_id: props.detailId, quantity: props.quantity }
        : { detail_present_id: props.detailId, quantity: props.quantity },
      {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      }
    )

    toast.success('🛒 Sản phẩm đã được thêm vào giỏ hàng!')
    props.onSuccess?.()
  } catch (err) {
    toast.error('❌ Thêm vào giỏ hàng thất bại. Vui lòng đăng nhập để tiếp tục!')
    console.error(err)
  }
})
</script>

<template></template>
