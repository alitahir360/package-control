import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/connect',
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/connect',
      },
      {
        path: 'connect',
        component: () => import('@/views/ConnectPage.vue'),
      },
      {
        path: 'pin',
        component: () => import('@/views/PinPage.vue'),
      },
      {
        path: 'control',
        component: () => import('@/views/ControlPage.vue'),
      },
      {
        path: 'history',
        component: () => import('@/views/HistoryPage.vue'),
      },
      {
        path: 'language',
        component: () => import('@/views/LanguagePage.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
