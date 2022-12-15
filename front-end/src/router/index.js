import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/login_register/:type',
    name: 'loginRegister',
    component: () => import('../views/LoginRegisterView.vue')
  },
  {
    path: '/daftarKos',
    name: 'daftarKos',
    component: () => import('../views/DaftarKosView.vue')
  },
  {
    path: '/history',
    name: 'historyOrder',
    component: () => import('../views/OrderHistoryView.vue')
  },
  {
    path: '/payment/:orderId',
    name: 'payment',
    component: () => import('../views/PaymentView.vue')
  },
  {
    path: '/booking/:roomId',
    name: 'booking',
    component: () => import('../views/BookingFormView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
