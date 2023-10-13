import { RouteRecordRaw } from 'vue-router'
const pageTitle = (title): string => {
  return title
}

/*
 * 静态路由
 *
 */
const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@renderer/views/home.vue')
  },

  {
    path: '/:path(.*)*',
    redirect: '/404'
  }
]

const singleWindow: Array<RouteRecordRaw> = [
  {
    path: '/child-window-one',
    component: () => import('@renderer/views/test/child-window-one.vue'),
    meta: {
      title: pageTitle('子窗口一')
    }
  },
  {
    path: '/child-window-two',
    component: () => import('@renderer/views/window/child-window-two.vue'),
    meta: {
      title: pageTitle('子窗口二')
    }
  }
]

staticRoutes.push(...singleWindow)

export { staticRoutes }
