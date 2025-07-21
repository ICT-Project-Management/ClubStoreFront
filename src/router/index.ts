import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'

import Dashboard from '../pages/admin/Dashboard.vue'
import AdminHome from '../pages/admin/AdminHome.vue'
import Index from '../components/admin/product/Index.vue'
import AddClothes from '../components/admin/product/AddClothes.vue'
import AddPresent from '../components/admin/product/AddPresent.vue'
import AddDetailClothes from '../components/admin/product/AddDetailClothes.vue'
import AddDetailPresent from '../components/admin/product/AddDetailPresent.vue'

import ListUser from '../components/admin/user/ListUser.vue'
import ViewCart from '../components/cart/ViewCart.vue'

import { useAuthStore } from '../store/auth'
import Profile from '../components/user/Profile.vue'
import ViewUser from '../components/user/ViewUser.vue'
import OrderIndex from '../components/user/orders/OrderIndex.vue'
import OrderAdminIndex from '../components/admin/order/OrderAdminIndex.vue'
import SocialCallback from '../pages/SocialCallback.vue'
import ForgotPassword from '../views/auth/ForgotPassword.vue'
import ResetPassword from '../views/auth/ResetPassword.vue'
import NewsAdmin from '../components/admin/news/NewsAdmin.vue'
import CreateNews from '../components/admin/news/CreateNews.vue'
import AllNews from '../components/user/news/AllNews.vue'
import VNpayReturn from '../components/user/orders/VNpayReturn.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/cart',
    component: ViewCart,
    meta: { requiresAuth: true } 
  },
  {
    path: '/admin',
    component: Dashboard,
    children: [
      { path: '', redirect: 'admin/home' },
      { path: 'home', component: AdminHome },
      { path: 'users', component: ListUser }, 
      { path: 'products', component: Index },
      { path: 'products/add-clothes', component: AddClothes },
      { path: 'products/add-present', component: AddPresent },
      { path: 'products/add-detail-clothes', component: AddDetailClothes },
      { path: 'products/add-detail-present', component: AddDetailPresent },
      { path: 'orders', component: OrderAdminIndex }, 
      { path: 'news', component: NewsAdmin,},
      { path: 'news/create', component: CreateNews },
    ]
  },
  {
    path: '/user',
    component: ViewUser,
    children: [
      { path: 'profile', component: Profile},
    ]
  },
  {
    path: '/order/index', 
    component: OrderIndex, 
    children:[]
  },
  {
    path: '/social-callback',
    component: SocialCallback,
  },
  {
    path: '/forgot-password',
    component: ForgotPassword,
  },
  {
    path: '/reset-password/:token',
    component: ResetPassword,
  },
  {
    path: '/view/all-news',
    component: AllNews,
  },
  {
  path: '/payment/vnpay/return',
  component: VNpayReturn
}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  const roles = auth.user?.roles || []
  const isAdmin = roles.some((r: any) => r.name === 'admin')

  if (to.path.startsWith('/admin') && !isAdmin) {
    return next('/')
  }

  if (to.meta.requiresAuth && !auth.token) {
    return next('/login')
  }

  next()
})


export default router
