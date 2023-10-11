import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@renderer/views/home.vue')
  },
]


// 配置常量菜单
export const constantMenu = [
  {
    id: 1000,
    name: 'Demo',
    url: null,
    openStyle: 0,
    icon: 'icon-windows',
    children: [
      {
        id: 1001,
        name: 'Icon 图标',
        url: 'demo/icons/index',
        openStyle: 0,
        icon: 'icon-unorderedlist'
      },
      {
        id: 1002,
        name: '表单设计器',
        url: 'demo/formDesign/form',
        openStyle: 0,
        icon: 'icon-unorderedlist'
      },
      {
        id: 1003,
        name: '表单生成器',
        url: 'demo/formDesign/generate',
        openStyle: 0,
        icon: 'icon-unorderedlist'
      },
      {
        id: 1004,
        name: '二维码生成',
        url: 'demo/qrcode/index',
        openStyle: 0,
        icon: 'icon-unorderedlist'
      },
      {
        id: 1005,
        name: '页面打印',
        url: 'demo/printJs/index',
        openStyle: 0,
        icon: 'icon-unorderedlist'
      },
      {
        id: 1006,
        name: '图片裁剪',
        url: 'demo/cropper/index',
        openStyle: 0,
        icon: 'icon-unorderedlist'
      },
      {
        id: 1007,
        name: '富文本编辑器',
        url: 'demo/wangeditor/index',
        openStyle: 0,
        icon: 'icon-unorderedlist'
      }
    ]
  }
]

export const errorRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)',
  redirect: '/404'
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

  next()
})

// 路由加载后
router.afterEach(() => {
  NProgress.done()
})
