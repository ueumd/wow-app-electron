import { ipcMain } from 'electron'

import { autoUpdater } from 'electron-updater'
import logger from './logger'
import { isDev } from './utils'
import path from 'path'
import fse from 'fs-extra'

// 更新地址
const updateURL = ''

const message = {
	error: { code: -1, msg: '检查更新出错' },
	checking: { code: 0, msg: '正在检查更新……' },
	updateAva: { code: 1, msg: '检测到新版本，正在下载…' },
	updateNotAva: { code: -1, msg: '已经是最新版本' },
	updateDownload: { code: 2, msg: '正在下载' }
}

export function updateAppClient(mainWindow: any) {
	// 若不执行删除操作,在已有更新包的情况下,会直接跳过下载事件,直接进行安装操作
	deleteUpdate()

	// 设置是否自动下载，默认是true
	autoUpdater.autoDownload = false

	autoUpdater.autoInstallOnAppQuit = false // 如果安装包下载好了，当应用退出后是否自动安装更新

	if (isDev) {
		autoUpdater.updateConfigPath = path.join(__dirname, '../../dev-app-update.yml')
	}

	autoUpdater.checkForUpdates().then(res => {
		// console.log(res)
	})

	// 设置版本更新服务器地址
	autoUpdater.setFeedURL(updateURL)

	// 更新发生错误时触发
	autoUpdater.on('error', function (err) {
		logger.error('检查更新出错', err)
		sendUpdateMessage(message.error)
	})

	// 开始检查更新事件
	autoUpdater.on('checking-for-update', function () {
		sendUpdateMessage(message.checking)
	})

	// 没有可更新版本(已经是最新的版本)
	autoUpdater.on('update-not-available', function (info) {
		logger.info('version：', info)
		sendUpdateMessage(message.updateNotAva)
	})

	// 发现可更新版本
	autoUpdater.on('update-available', function (info) {
		logger.info('new version：', info.version)
		// 获取当前版本信息
		sendUpdateMessage(message.updateAva)
		mainWindow.webContents.send('update-available')
	})

	// ================ 手动更新 ====================
	// 执行自动更新检查
	ipcMain.on('checkForUpdate', () => {
		// logger.info('执行更新检查')
		autoUpdater.checkForUpdates()
	})

	// 下载更新
	ipcMain.on('downloadUpdate', () => {
		autoUpdater
			.downloadUpdate()
			.then(downloadPath => {
				logger.info('download path:', downloadPath)
			})
			.catch(err => {
				console.log('download error ', err)
				logger.info(err)
			})
	})

	// 更新下载进度事件
	autoUpdater.on('download-progress', function (progressObj) {
		// logger.info('progressObj--->', progressObj)
		mainWindow.webContents.send('downloadProgress', {
			bytesPerSecond: progressObj.bytesPerSecond,
			percent: progressObj.percent, // 下载进度百分比
			transferred: progressObj.transferred,
			total: progressObj.total
		})
	})

	// 下载完成
	autoUpdater.on('update-downloaded', args => {
		logger.info('New version downloaded')
		// 通知客户端是否立即安装
		mainWindow.webContents.send('isUpdateNow', args)
	})

	// 接收到立即更新的信号，退出程序并更新
	ipcMain.on('isUpdateNow', _ => {
		// 3秒后退出并安装，可控制
		mainWindow.isUpdateNow = true
		logger.info('Install new version')
		setTimeout(() => {
			// 包下载完成后，重启当前的应用并且安装更新
			autoUpdater.quitAndInstall(true, true)
		}, 200)
	})

	// 向渲染进程发送消息
	function sendUpdateMessage(data: object) {
		mainWindow.webContents.send('update-message', data)
	}
}

export function updateNotAva(win) {
	win.webContents.send('update-message', message.updateNotAva)
}

// 更新前先删除本地已经下载的更新包文件
function deleteUpdate() {
	// xxx\\AppData\\Local\\app-name\\pending'
	const appName = 'wow-app-electron'

	// @ts-ignore (define in dts)
	const updatePendingPath = path.join(autoUpdater.app.baseCachePath, appName)
	fse.emptyDir(updatePendingPath)
}
