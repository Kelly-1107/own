import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/Home.vue')
  },
  {
    path: '/items',
    name: 'items',
    component: () => import('@/pages/items/ItemList.vue')
  },
  {
    path: '/items/new',
    name: 'item-new',
    component: () => import('@/pages/items/ItemForm.vue')
  },
  {
    path: '/items/:id',
    name: 'item-detail',
    component: () => import('@/pages/items/ItemDetail.vue')
  },
  {
    path: '/locations',
    name: 'locations',
    component: () => import('@/pages/locations/LocationList.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/pages/Search.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
