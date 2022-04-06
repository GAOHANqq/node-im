import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: ()=>import('../views/home.vue')
  },
  {
    path: '/chat',
    name: 'chat',
    component: ()=>import('../views/chat.vue')
  }
]
const router = createRouter({
  routes,
  history: createWebHashHistory('/')
})
export default router
