<template>
  <div>
    <button @click="addToCart(true)">🛒 Thêm thành công</button>
    <button @click="addToCart(false)">❌ Thêm thất bại</button>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification';
const toast = useToast();

/**
 * Hàm xử lý thông báo khi thêm vào giỏ hàng
 * @param success true nếu thêm thành công, false nếu thất bại
 */
function addToCart(success: boolean) {
  if (success) {
    toast.success('🛒 Sản phẩm đã được thêm vào giỏ hàng!', {
      timeout: 3000,
    });
  } else {
    toast.error('❌ Thêm vào giỏ hàng thất bại. Vui lòng thử lại!', {
      timeout: 3000,  
    });
  }
}
</script>

<style scoped>
button {
  margin: 8px;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  background-color: #60a5fa;
  color: white;
  cursor: pointer;
  font-size: 16px;
}
button:hover {
  background-color: #3b82f6;
}
</style>
