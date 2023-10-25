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
		path: '/window/base/child-window-one',
		component: () => import('@/views/window/base/child-window-one.vue'),
		meta: {
			title: pageTitle('子窗口一'),
			childWindow: true
		}
	},
	{
		path: '/window/base/child-window-two',
		component: () => import('@/views/window/base/child-window-two.vue'),
		meta: {
			title: pageTitle('子窗口二'),
			childWindow: true
		}
	}
]

export { staticRoutes }
