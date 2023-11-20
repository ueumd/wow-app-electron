export default [
	{
		url: '/hello',
		method: 'GET',
		response: () => {
			return {
				code: 0,
				msg: 'success',
				data: 'HELLO'
			}
		}
	},
	{
		url: '/api/sys/auth/login',
		method: 'POST',
		response: () => {
			return {
				code: 0,
				msg: 'success',
				data: {
					accessTokenExpire: '2023-10-17 00:21:16',
					refreshTokenExpire: '2023-10-30 22:21:16',
					access_token: 'faa5772567b54b54a1b8de2f41eb5617',
					refresh_token: '25a0237f2cdd48a4a850203632447a7f'
				}
			}
		}
	},
	{
		url: '/api/sys/user/info',
		method: 'get',
		response: () => {
			return {
				code: 0,
				msg: 'success',
				data: {
					id: 10000,
					username: 'admin',
					realName: 'admin',
					gender: 0,
					email: 'ueumd@126.com',
					mobile: '13012345678',
					status: 1,
					superAdmin: 1
				}
			}
		}
	},
	{
		url: '/api/sys/menu/nav',
		method: 'GET',
		response: ({ body }: { body: any }) => {
			return {
				code: 0,
				msg: 'success',
				data: [
					{
						id: 100,
						pid: 0,
						children: [
							{
								id: 101,
								pid: 100,
								children: [],
								name: '父子窗口',
								url: 'window/base/index',
								type: 0,
								openStyle: 0,
								icon: 'icon-solution',
								authority: 'sys:log:login',
								sort: 0,
								createTime: '2023-08-10 00:02:04'
							},
							{
								id: 102,
								pid: 100,
								children: [],
								name: '捕获窗口',
								url: 'window/capture/index',
								type: 0,
								openStyle: 0,
								icon: 'icon-solution',
								authority: 'sys:log:login',
								sort: 0,
								createTime: '2023-08-10 00:02:04'
							}
						],
						name: '窗口管理',
						url: '',
						type: 0,
						openStyle: 0,
						icon: 'menu-home',
						authority: '',
						sort: 3,
						createTime: '2023-08-10 00:02:04'
					},
					{
						id: 300,
						pid: 0,
						children: [
							{
								id: 301,
								pid: 300,
								children: [],
								name: 'RTMP',
								url: 'rtc/rtmp/index',
								type: 0,
								openStyle: 0,
								icon: 'icon-solution',
								authority: 'sys:log:login',
								sort: 0,
								createTime: '2023-08-10 00:02:04'
							},
							{
								id: 302,
								pid: 300,
								children: [],
								name: 'VideoCapture',
								url: 'rtc/webrtc/video-capture',
								type: 0,
								openStyle: 0,
								icon: 'icon-solution',
								authority: 'sys:log:login',
								sort: 0,
								createTime: '2023-08-10 00:02:04'
							},
							{
								id: 302,
								pid: 300,
								children: [],
								name: 'WebRTC',
								url: 'rtc/webrtc/media',
								type: 0,
								openStyle: 0,
								icon: 'icon-solution',
								authority: 'sys:log:login',
								sort: 0,
								createTime: '2023-08-10 00:02:04'
							}
						],
						name: 'WebRTC',
						url: '',
						type: 0,
						openStyle: 0,
						icon: 'icon-menu-table',
						authority: '',
						sort: 3,
						createTime: '2023-08-10 00:02:04'
					},
					{
						id: 200,
						pid: 0,
						children: [
							{
								id: 201,
								pid: 200,
								children: [],
								name: '自定义表格',
								url: 'table/custom/index',
								type: 0,
								openStyle: 0,
								icon: 'icon-solution',
								authority: 'sys:log:login',
								sort: 0,
								createTime: '2023-08-10 00:02:04'
							}
						],
						name: '表格管理',
						url: '',
						type: 0,
						openStyle: 0,
						icon: 'icon-menu-table',
						authority: '',
						sort: 3,
						createTime: '2023-08-10 00:02:04'
					},
					{
						id: 38,
						pid: 0,
						children: [
							{
								id: 39,
								pid: 38,
								children: [],
								name: '登录日志',
								url: 'sys/log/login',
								type: 0,
								openStyle: 0,
								icon: 'icon-solution',
								authority: 'sys:log:login',
								sort: 0,
								createTime: '2023-08-10 00:02:04'
							},
							{
								id: 46,
								pid: 38,
								children: [],
								name: '操作日志',
								url: 'sys/log/operate',
								type: 0,
								openStyle: 0,
								icon: 'icon-file-text',
								authority: 'sys:operate:all',
								sort: 1,
								createTime: '2023-08-10 00:02:04'
							}
						],
						name: '日志管理',
						url: '',
						type: 0,
						openStyle: 0,
						icon: 'icon-filedone',
						authority: '',
						sort: 3,
						createTime: '2023-08-10 00:02:04'
					}
				]
			}
		}
	}
]
