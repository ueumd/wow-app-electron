import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
import { loadEnv } from './scripts/vite'
import { viteMockServe } from 'vite-plugin-mock'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import * as pkg from './package.json'
import mkcert from'vite-plugin-mkcert'
// import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig(({ command, mode }) => {
	const { VITE_OPEN, VITE_PORT, VITE_PROXY_URL } = loadEnv(mode)

	// const isServe = command === 'serve'
	// const isBuild = command === 'build'
	// const sourcemap = isServe || !!process.env.VSCODE_DEBUG

	// console.log('------------process.cwd()', process.cwd())
	// console.log('------------__dirname', __dirname)

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
			base: '/src/renderer',
			resolve: {
				alias: {
					'@': resolve('./src/renderer/src')
				}
			},
			plugins: [
				mkcert(),
				vue(),
				// AutoImport({
				// 	// 自动导入vue相关函数，如: ref、reactive、toRef等
				// 	imports: ['vue', 'vue-router'],
				// 	dts: 'auto-import.d.ts'
				// }),
				vueSetupExtend(),
				createSvgIconsPlugin({
					iconDirs: [resolve('./src/renderer/src/icons/svg')],
					symbolId: 'icon-[dir]-[name]'
				}),

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
			// 引入sass全局样式变量
			css: {
				preprocessorOptions: {
					scss: {
						additionalData: `@import "@/styles/variables.scss";`
					}
				}
			},
			server: {
				https: true,
				host: '0.0.0.0',
				port: VITE_PORT, // 端口号
				open: VITE_OPEN, // 是否自动打开浏览器
				proxy: proxy
			},
			// 构建
			build: {
				chunkSizeWarningLimit: 2000 // 消除打包大小超过500kb警告
			},
			esbuild: {
				drop: mode === 'production' ? ['debugger'] : [],
				pure: mode === 'production' ? ['console.log'] : []
			}
		}
	}
})
