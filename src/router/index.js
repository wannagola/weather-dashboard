import { createRouter, createWebHistory } from 'vue-router'
import WeatherHomeView from '@/views/WeatherHomeView.vue'
import { CITY_LIST } from '@/services/weatherApi'

const validCityIds = new Set(CITY_LIST.map((city) => city.id))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'WeatherHome',
      component: WeatherHomeView,
    },
    {
      path: '/about',
      name: 'WeatherAbout',
      component: () => import('@/views/WeatherAboutView.vue'),
    },
    {
      path: '/stats',
      name: 'WeatherStats',
      component: () => import('@/views/WeatherStatsView.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'WeatherDetail',
      component: () => import('@/views/WeatherDetailView.vue'),
    },
    {
      path: '/not-found',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'NotFound' },
    },
  ],
})

router.beforeEach((to) => {
  if (to.name === 'WeatherDetail') {
    const cityId = String(to.params.cityId)
    if (!validCityIds.has(cityId)) {
      return { name: 'NotFound' }
    }
  }
})

export default router