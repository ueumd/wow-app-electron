import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@renderer/store'

NProgress.configure({ showSpinner: false })

const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: () => import('@renderer/layout/index.vue'),
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@renderer/layout/components/Router/Redirect.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@renderer/views/login/index.vue')
  },
  {
    path: '/404',
    component: () => import('@renderer/views/404.vue')
  }
]

export const errorRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)',
  redirect: '/404'
}

const asyncRoutes: RouteRecordRaw = {
  path: '/',
  component: () => import('@renderer/layout/index.vue'),
  redirect: '/home',
  children: [
    {
      path: '/home',
      name: 'Home',
      component: () => import('@renderer/views/home.vue'),
      meta: {
        title: 'HOme',
        affix: true
      }
    }
  ]
}

export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

// 白名单列表
const whiteList = ['/login']

// 路由跳转前
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // console.log(to, from)
  // token存在的情况
  if (store.userStore.token) {
    if (to.path === '/login') {
      next('/home')
    } else {
      // 用户信息不存在，则重新拉取
      if (!store.userStore.user.id) {
        try {
          await store.userStore.getUserInfoAction()
        } catch (error) {
          // 请求异常，则跳转到登录页
          store.userStore?.setToken('')
          next('/login')
          return Promise.reject(error)
        }

        // 动态菜单+常量菜单
        const menuRoutes = await store.routerStore.getMenuRoutes()

        // 获取扁平化路由，将多级路由转换成一级路由
        const keepAliveRoutes = getKeepAliveRoutes(menuRoutes, [])

        // 添加菜单路由
        asyncRoutes.children?.push(...keepAliveRoutes)
        router.addRoute(asyncRoutes)

        // 错误路由
        // router.addRoute(errorRoute)

        // 保存路由数据
        store.routerStore.setRoutes(constantRoutes.concat(asyncRoutes))

        next({ ...to, replace: true })
      } else {
        next()
      }
    }
  } else {
    // 没有token的情况下，可以进入白名单
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
})

// 路由加载后
router.afterEach(() => {
  NProgress.done()
})

// 获取扁平化路由，将多级路由转换成一级路由
export const getKeepAliveRoutes = (
  rs: RouteRecordRaw[],
  breadcrumb: string[]
): RouteRecordRaw[] => {
  const routerList: RouteRecordRaw[] = []

  rs.forEach((item: any) => {
    if (item.meta.title) {
      breadcrumb.push(item.meta.title)
    }

    if (item.children && item.children.length > 0) {
      routerList.push(...getKeepAliveRoutes(item.children, breadcrumb))
    } else {
      item.meta.breadcrumb.push(...breadcrumb)
      routerList.push(item)
    }

    breadcrumb.pop()
  })
  return routerList
}

// 加载vue组件
const layoutModules = import.meta.glob('/src/renderer/src/views/**/*.vue')

// 根据路径，动态获取vue组件
const getDynamicComponent = (path: string): any => {
  return layoutModules[`/src/renderer/src/views/${path}.vue`]
}

// 根据菜单列表，生成路由数据
export const generateRoutes = (menuList: any): RouteRecordRaw[] => {
  const routerList: RouteRecordRaw[] = []

  menuList.forEach((menu: any) => {
    let component
    let path
    if (menu.children && menu.children.length > 0) {
      component = () => import('@renderer/layout/index.vue')
      path = '/p/' + menu.id
    } else {
      // 判断是否iframe
      if (isIframeUrl(menu)) {
        component = () => import('@renderer/layout/components/Router/Iframe.vue')
        path = '/iframe/' + menu.id
      } else if (menu.url.indexOf('online/form/') != -1) {
        // component = () => import('@renderer/views/online/form/index.vue')
        // path = '/' + menu.url
      } else {
        component = getDynamicComponent(menu.url)
        path = '/' + menu.url
      }
    }
    const route: RouteRecordRaw = {
      path: path,
      name: pathToCamel(path),
      component: component,
      children: [],
      meta: {
        title: menu.name,
        icon: menu.icon,
        id: '' + menu.id,
        url: menu.url,
        cache: true,
        newOpen: menu.openStyle === 1,
        breadcrumb: []
      }
    }

    // 有子菜单的情况
    if (menu.children && menu.children.length > 0) {
      route.children?.push(...generateRoutes(menu.children))
    }

    routerList.push(route)
  })

  return routerList
}

// 判断是否iframe
const isIframeUrl = (menu: any): boolean => {
  // 如果是新页面打开，则不用iframe
  if (menu.openStyle === 1) {
    return false
  }

  // 是否外部链接
  return isExternalLink(menu.url)
}
