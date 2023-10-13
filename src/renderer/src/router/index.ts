import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { staticRoutes } from '@renderer/router/static'

NProgress.configure({ showSpinner: false })

// const constantRoutes: RouteRecordRaw[] = [
//   {
//     path: '/',
//     component: () => import('@renderer/views/home.vue')
//   }
// ]

export const errorRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)',
  redirect: '/404'
}

export const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRoutes
})

// 路由跳转前
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  console.log(to, from)
  next()
})

// 路由加载后
router.afterEach(() => {
  NProgress.done()
})
