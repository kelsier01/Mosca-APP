import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'dashboard',
        component: () => import('@/views/DashboardView.vue')
      },
      {
        path: 'detecciones',
        component: () => import('@/views/DeteccionesView.vue')
      },
      {
        path: 'trampas',
        component: () => import('@/views/TrampasView.vue')
      },
      {
        path: 'funcionarios',
        component: () => import('@/views/FuncionariosView.vue')
      },
      {
        path: 'predios',
        component: () => import('@/views/PrediosView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
