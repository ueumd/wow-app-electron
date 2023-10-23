import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
import { loadEnv } from './scripts/vite'
import { viteMockServe } from 'vite-plugin-mock'

// export default defineConfig({
//   main: {
//     plugins: [externalizeDepsPlugin()]
//   },
//   preload: {
//     plugins: [externalizeDepsPlugin()]
//   },
//   renderer: {
//     resolve: {
//       alias: {
//         '@renderer': resolve('src/renderer/src')
//       }
//     },
//     plugins: [vue()],
//     server: {
//       host: true,
//       port: 3000, // 端口号
//       open: false // 是否自动打开浏览器
//     }
//   }
// })

export default defineConfig(({ mode }) => {
  const { VITE_OPEN, VITE_PORT, VITE_APP_TITLE, VITE_PROXY_URL } = loadEnv(mode)

  // const isServe = command === 'serve'
  // const isBuild = command === 'build'
  // const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  let proxy = {}
  if (VITE_PROXY_URL) {
    proxy = {
      '/api': {
        target: VITE_PROXY_URL,
        changeOrigin: true
      }
    }
  }
  return {
    main: {
      plugins: [externalizeDepsPlugin()]
    },
    preload: {
      plugins: [externalizeDepsPlugin()]
    },
    renderer: {
      base: './src/renderer/src',
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src')
        }
      },
      plugins: [
        vue(),
        createHtmlPlugin({
          inject: {
            data: {
              title: VITE_APP_TITLE
            }
          }
        }),
        viteMockServe({
          mockPath: './mock/',
          // localEnabled: true, //设置是否启用本地mock文件
          // prodEnabled: true, //设置打包是否启用 mock 功能
          watchFiles: false //设置是否监视mockPath对应的文件夹内文件中的更改
          // logger: true, //是否在控制台显示请求日志
        })
      ],
      server: {
        host: '0.0.0.0',
        port: VITE_PORT, // 端口号
        open: VITE_OPEN, // 是否自动打开浏览器
        proxy: proxy
      }
    }
  }
})
