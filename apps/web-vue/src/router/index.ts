import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Chat',
      // 懒加载，只有访问/chat才加载聊天模块代码
      component: () => import('@/chat/views/ChatPage.vue'),
    },
  ],
})

export default router
