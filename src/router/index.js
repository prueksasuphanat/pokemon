import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      redirect: '/1',
    },
    {
      path: '/:id',
      name: 'pokemonDetail',
      component: HomeView,
    },
  ],
})

export default router
