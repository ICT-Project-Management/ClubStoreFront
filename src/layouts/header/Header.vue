<template>
  <nav class="navbar navbar-expand-lg shadow-sm fixed-top" style="background-color: #e0f0ff; height: 64px;">
    <div class="container">
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <img
          src="../../assets/Manchester_City_FC_logo.svg"
          alt="ClubStore Logo"
          class="me-2"
          style="height: 40px;"
        />
        <span class="fw-bold text fs-4">ClubStore</span>
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-end" id="mainNavbar">
        <ul class="navbar-nav align-items-center gap-3">
          <li class="nav-item">
            <router-link to="/" class="nav-link d-flex align-items-center">
              <i class="bi bi-house-door fs-5"></i>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/wishlist" class="nav-link d-flex align-items-center">
              <i class="bi bi-heart fs-5"></i>
            </router-link>
          </li>
          <li class="nav-item position-relative">
            <router-link to="/cart" class="nav-link d-flex align-items-center" @click.prevent="toggleCart">
              <i class="bi bi-cart fs-5"></i>
              <span
                v-if="cartStore.cartCount > 0"
                class="position-absolute top-7 right-5 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                style="width: 10px; height: 10px;"
              ></span>
            </router-link>
          </li>
          <li>
            <router-link to="/user/profile" class="nav-link d-flex align-items-center">
              <i class="bi bi-person-lines-fill"></i>
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle d-flex align-items-center"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                :src="auth.user?.avatar || '../../assets/default-avatar.png'"
                class="rounded-circle"
                style="width: 28px; height: 28px; object-fit: cover;"
              />
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <template v-if="auth.user">
                <li>
                  <span class="dropdown-item-text fw-bold">{{ auth.user.name }}</span>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <button class="dropdown-item" @click="handleLogout">
                    <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                  </button>
                </li>
              </template>
              <template v-else>
                <li>
                  <router-link class="dropdown-item" to="/login">
                    <i class="bi bi-box-arrow-in-right me-2"></i>Đăng nhập
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/register">
                    <i class="bi bi-person-plus me-2"></i>Đăng ký
                  </router-link>
                </li>
              </template>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../store/auth'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../store/cart'
const cartStore = useCartStore()

const toggleCart = () => {
  cartStore.toggleCart()
}

const auth = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  font-weight: 500;
  color: #000;
}
.nav-link:hover {
  color: #0d6efd;
  cursor: pointer;
}
.dropdown-menu {
  min-width: 180px;
}
</style>
