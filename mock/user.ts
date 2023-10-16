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
            id: 12,
            pid: 0,
            children: [
              {
                id: 28,
                pid: 12,
                children: [],
                name: '用户管理',
                url: 'sys/user/index',
                type: 0,
                openStyle: 0,
                icon: 'icon-user',
                authority: '',
                sort: 0,
                createTime: '2023-08-10 00:02:04'
              },
              {
                id: 18,
                pid: 12,
                children: [],
                name: '机构管理',
                url: 'sys/org/index',
                type: 0,
                openStyle: 0,
                icon: 'icon-cluster',
                authority: '',
                sort: 1,
                createTime: '2023-08-10 00:02:03'
              },
              {
                id: 13,
                pid: 12,
                children: [],
                name: '岗位管理',
                url: 'sys/post/index',
                type: 0,
                openStyle: 0,
                icon: 'icon-solution',
                authority: '',
                sort: 2,
                createTime: '2023-08-10 00:02:03'
              },
              {
                id: 23,
                pid: 12,
                children: [],
                name: '角色管理',
                url: 'sys/role/index',
                type: 0,
                openStyle: 0,
                icon: 'icon-team',
                authority: '',
                sort: 3,
                createTime: '2023-08-10 00:02:03'
              }
            ],
            name: '权限管理',
            url: '',
            type: 0,
            openStyle: 0,
            icon: 'icon-safetycertificate',
            authority: '',
            sort: 0,
            createTime: '2023-08-10 00:02:03'
          },
          {
            id: 1,
            pid: 0,
            children: [
              {
                id: 2,
                pid: 1,
                children: [],
                name: '菜单管理',
                url: 'sys/menu/index',
                type: 0,
                openStyle: 0,
                icon: 'icon-menu',
                sort: 0,
                createTime: '2023-08-10 00:02:03'
              },
              {
                id: 59,
                pid: 1,
                children: [],
                name: '定时任务',
                url: 'quartz/schedule/index',
                type: 0,
                openStyle: 0,
                icon: 'icon-reloadtime',
                sort: 0,
                createTime: '2023-08-10 00:02:40'
              },
              {
                id: 7,
                pid: 1,
                children: [],
                name: '数据字典',
                url: 'sys/dict/type',
                type: 0,
                openStyle: 0,
                icon: 'icon-insertrowabove',
                authority: '',
                sort: 1,
                createTime: '2023-08-10 00:02:03'
              },
              {
                id: 42,
                pid: 1,
                children: [],
                name: '参数管理',
                url: 'sys/params/index',
                type: 0,
                openStyle: 0,
                icon: 'icon-filedone',
                authority: 'sys:params:all',
                sort: 2,
                createTime: '2023-08-10 00:02:04'
              },
              {
                id: 34,
                pid: 1,
                children: [],
                name: '附件管理',
                url: 'sys/attachment/index',
                type: 0,
                openStyle: 0,
                icon: 'icon-folder-fill',
                sort: 3,
                createTime: '2023-08-10 00:02:04'
              },
              {
                id: 43,
                pid: 1,
                children: [],
                name: '接口文档',
                url: '{{apiUrl}}/doc.html',
                type: 0,
                openStyle: 1,
                icon: 'icon-file-text-fill',
                sort: 10,
                createTime: '2023-08-10 00:02:04'
              }
            ],
            name: '系统设置',
            type: 0,
            openStyle: 0,
            icon: 'icon-setting',
            sort: 1,
            createTime: '2023-08-10 00:02:03'
          },
          {
            id: 44,
            pid: 0,
            children: [
              {
                id: 45,
                pid: 44,
                children: [],
                name: 'Online表单开发',
                url: 'online/table/index',
                type: 0,
                openStyle: 0,
                icon: 'icon-table',
                authority: 'online:table:all',
                sort: 0,
                createTime: '2023-08-10 00:02:04'
              }
            ],
            name: '在线开发',
            url: '',
            type: 0,
            openStyle: 0,
            icon: 'icon-cloud',
            authority: '',
            sort: 2,
            createTime: '2023-08-10 00:02:04'
          },
          {
            id: 33,
            pid: 0,
            children: [
              {
                id: 47,
                pid: 33,
                children: [],
                name: '代码生成器',
                url: '{{apiUrl}}/maku-generator/index.html',
                type: 0,
                openStyle: 0,
                icon: 'icon-rocket',
                authority: '',
                sort: 2,
                createTime: '2023-08-10 00:02:17'
              },
              {
                id: 48,
                pid: 33,
                children: [
                  {
                    id: 50,
                    pid: 48,
                    children: [],
                    name: '短信平台',
                    url: 'message/sms/platform/index',
                    type: 0,
                    openStyle: 0,
                    icon: 'icon-whatsapp',
                    sort: 0,
                    createTime: '2023-08-10 00:02:26'
                  },
                  {
                    id: 49,
                    pid: 48,
                    children: [],
                    name: '短信日志',
                    url: 'message/sms/log/index',
                    type: 0,
                    openStyle: 0,
                    icon: 'icon-detail',
                    authority: 'sms:log',
                    sort: 1,
                    createTime: '2023-08-10 00:02:26'
                  }
                ],
                name: '消息管理',
                url: '',
                type: 0,
                openStyle: 0,
                icon: 'icon-message',
                authority: '',
                sort: 2,
                createTime: '2023-08-10 00:02:25'
              },
              {
                id: 55,
                pid: 33,
                children: [
                  {
                    id: 56,
                    pid: 55,
                    children: [],
                    name: '服务监控',
                    url: 'monitor/server/index',
                    type: 0,
                    openStyle: 0,
                    icon: 'icon-sever',
                    authority: 'monitor:server:all',
                    sort: 0,
                    createTime: '2023-08-10 00:02:33'
                  },
                  {
                    id: 57,
                    pid: 55,
                    children: [],
                    name: '缓存监控',
                    url: 'monitor/cache/index',
                    type: 0,
                    openStyle: 0,
                    icon: 'icon-fund-fill',
                    authority: 'monitor:cache:all',
                    sort: 2,
                    createTime: '2023-08-10 00:02:33'
                  },
                  {
                    id: 58,
                    pid: 55,
                    children: [],
                    name: '在线用户',
                    url: 'monitor/user/index',
                    type: 0,
                    openStyle: 0,
                    icon: 'icon-user',
                    authority: 'monitor:user:all',
                    sort: 3,
                    createTime: '2023-08-10 00:02:33'
                  }
                ],
                name: '系统监控',
                url: '',
                type: 0,
                openStyle: 0,
                icon: 'icon-Report',
                authority: '',
                sort: 10,
                createTime: '2023-08-10 00:02:33'
              }
            ],
            name: '应用管理',
            url: '',
            type: 0,
            openStyle: 0,
            icon: 'icon-appstore',
            authority: '',
            sort: 2,
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
