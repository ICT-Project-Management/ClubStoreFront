import { defineStore } from 'pinia'
import axios from 'axios'

export const useCartStore = defineStore('cart', {
  state: () => ({
    clothes: [] as any[],
    presents: [] as any[],
    showCart: false,
  }),
  getters: {
    cartCount(state): number {
      return state.clothes.length + state.presents.length
    }
  },
  actions: {
    async fetchCart(userId?: number) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          params: userId ? { user_id: userId } : {}
        })
        this.clothes = res.data.clothes || []
        this.presents = res.data.presents || []
      } catch (error) {
        console.error('❌ Lỗi khi lấy giỏ hàng:', error)
        this.clothes = []
        this.presents = []
      }
    },
    toggleCart() {
      this.showCart = !this.showCart
    }
  }
})
