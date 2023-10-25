import { resolve } from 'path'
import { bytecodePlugin, defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
import { loadEnv } from './scripts/vite'
import { viteMockServe } from 'vite-plugin-mock'
import * as pkg from './package.json'
// import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig(({ command, mode }) => {
	const { VITE_OPEN, VITE_PORT, VITE_PROXY_URL } = loadEnv(mode)

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
			plugins: [externalizeDepsPlugin(), bytecodePlugin()]
		},
		preload: {
			plugins: [externalizeDepsPlugin(), bytecodePlugin()]
		},
		renderer: {
			base: '/src/renderer/src',
			resolve: {
				alias: {
					'@': resolve('./src/renderer/src')
				}
			},
			plugins: [
				vue(),
				// AutoImport({
				// 	// 自动导入vue相关函数，如: ref、reactive、toRef等
				// 	imports: ['vue', 'vue-router'],
				// 	dts: 'auto-import.d.ts'
				// }),
				createHtmlPlugin({
					inject: {
						data: {
							title: pkg.title
						}
					}
				}),
				viteMockServe({
					mockPath: './mock/',
					logger: true, //  是否在控制台显示请求日志
					localEnabled: command === 'serve', // 设置是否启用本地mock文件
					prodEnabled: command !== 'serve' && true, // 设置打包是否启用mock功能
					// 这样可以控制关闭mock的时候不让mock打包到最终代码内
					injectCode: `
          import { setupProdMockServer } from './mock/index';
          setupProdMockServer();
        `
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
