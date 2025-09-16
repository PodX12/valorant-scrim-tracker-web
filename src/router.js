import { createMemoryHistory, createRouter } from 'vue-router'

import Dashboard from './Dashboard.vue'
import AboutView from './Analytics.vue'
import Match from './Match.vue'

const routes = [
  {
    name: "dashboard",
    path: '/',
    component: Dashboard,
  },
  {
    name: "analytics",
    path: '/analytics',
    component: AboutView,
  },
  {
    name: "matches",
    path: '/matches/:id',
    component: Match,
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
