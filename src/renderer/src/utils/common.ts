import { ElForm } from 'element-plus'
import { useTitle } from '@vueuse/core'
import { router } from '@/router'
import { nextTick } from 'vue'
import store from '@/store'

/**
 * 加载网络css文件
 * @param url css资源url
 */
export function loadCss(url: string): void {
	const link = document.createElement('link')
	link.rel = 'stylesheet'
	link.href = url
	link.crossOrigin = 'anonymous'
	document.getElementsByTagName('head')[0].appendChild(link)
}

/**
 * 加载网络js文件
 * @param url js资源url
 */
export function loadJs(url: string): void {
	const link = document.createElement('script')
	link.src = url
	document.body.appendChild(link)
}

/**
 * 是否是外部链接
 * @param path
 */
export function isExternal(path: string): boolean {
	return /^(https?|ftp|mailto|tel):/.test(path)
}

/**
 * 防抖
 * @param fn 执行函数
 * @param ms 间隔毫秒数
 */
export const debounce = (fn: (...T) => void, ms: number) => {
	return (...args: any[]) => {
		if (window.lazy) {
			clearTimeout(window.lazy)
		}
		window.lazy = window.setTimeout(() => {
			fn(...args)
		}, ms)
	}
}

/**
 * 根据pk字段的值从数组中获取key
 * @param arr
 * @param pk
 * @param value
 */
export const getArrayKey = (arr: any, pk: string, value: any): any => {
	for (const key in arr) {
		if (arr[key][pk] == value) {
			return key
		}
	}
	return false
}

/**
 * 表单重置
 * @param formEl
 */
export const onResetForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
	if (!formEl) return
	formEl.resetFields && formEl.resetFields()
}
/**
 * 数字千位分隔符格式
 * @param value
 */
export function numberToCurrencyNo(value: any) {
	if (!value) return 0
	// 获取整数部分
	const intPart = Math.trunc(value)
	// 整数部分处理，增加,
	const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
	// 预定义小数部分
	let floatPart = ''
	// 将数值截取为小数部分和整数部分
	const valueArray = value.toString().split('.')
	if (valueArray.length === 2) {
		// 有小数部分
		floatPart = valueArray[1].toString() // 取得小数部分
		return intPartFormat + '.' + floatPart
	}
	return intPartFormat + floatPart
}

/**
 * 随机函数
 * @param min
 * @param max
 */

export function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 设置浏览器标题-只能在路由加载完成后调用
 * @param webTitle 新的标题
 */
export function setTitle(webTitle: string) {
	const title = useTitle()
	// const siteConfig = useSiteConfig()
	title.value = webTitle
}

export function uuidv4() {
	let d = new Date().getTime()
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (d + Math.random() * 16) % 16 | 0
		d = Math.floor(d / 16)
		return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
	})
}

/**
 * https://github.com/scopsy/await-to-js/blob/master/src/await-to-js.ts
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to<T, U = Error>(promise: Promise<T>, errorExt?: object): Promise<[U, undefined] | [null, T]> {
	return promise
		.then<[null, T]>((data: T) => [null, data])
		.catch<[U, undefined]>((err: U) => {
			if (errorExt) {
				const parsedError = Object.assign({}, err, errorExt)
				return [parsedError, undefined]
			}

			return [err, undefined]
		})
}

/**
 * 根据路由 meta.title 设置浏览器标题
 */
export function setWindowTitle() {
	if (router.currentRoute.value.meta.childWindow) {
		nextTick(() => {
			const title = useTitle()
			title.value = router.currentRoute.value.meta.title as string
		})
	}
}

/**
 * 数组 对象元素去重
 * @param list
 * @param key
 */
export function unique(list, key) {
	const obj = {}
	return list.reduce((acc, curItem) => {
		if (!obj[curItem[key]]) {
			acc.push(curItem)
			obj[curItem[key]] = curItem[key]
		}
		return acc
	}, [])
}

export function testStore() {
	console.log(store.userStore?.user)
}
