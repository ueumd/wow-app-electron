import type { MockMethod } from 'vite-plugin-mock'
import { resultSuccess } from './_utils'

// 获取兴趣爱好
const getHobbysList = (num: number) => {
	const list = ['篮球', '羽毛球', '足球', '音乐', '电影', '旅行', '高尔夫', '爬山', '游泳', '健身']
	const arr: string[] = []
	while (arr.length < num) {
		const index = Math.floor(Math.random() * list.length)
		if (!arr.includes(list[index])) {
			arr.push(list[index])
		}
	}
	return arr
}

const getTableListData = (params: any) => {
	const data: any[] = []
	for (let i = 0; i < params.limit; i++) {
		data.push({
			id: '@integer(10,999999)',
			index: i,
			name: params.name !== '' ? params.name : '@cname()',
			amount: Date.now(),
			phone: '15578728810',
			endTime: '@datetime',
			createTime: '@datetime',
			address: '@county(true)',
			avatar: 'https://sponsors.vuejs.org/images/chrome_frameworks_fund.avif',
			date: `@date('yyyy-MM-dd')`,
			time: `@time('HH:mm')`,
			'proportion|1-100': 10,
			'no|100000-10000000': 100000,
			status: params.status != '' ? Number(params.status) : Math.random() > 0.5 ? 1 : 0, // 0或1
			hobbys: getHobbysList(Math.floor(Math.random() * 9))
		})
	}
	return data
}

export default [
	{
		url: '/api/table/person/list',
		method: 'post',
		timeout: 350,
		response: ({ body }) => {
			const { current = 1, limit = 10, status = 0, name } = body
			const list = getTableListData({ current, limit, status, name })
			return resultSuccess({
				current: Number(current),
				limit: Number(limit),
				total: 1000,
				list: list
			})
		}
	}
] as MockMethod[]
