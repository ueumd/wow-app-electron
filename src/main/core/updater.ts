import { ipcMain } from 'electron'

import { autoUpdater } from 'electron-updater'
import logger from './logger'
import { isDev } from './utils'
import path from 'path'
import { EelectronWindowType } from '../../types/electron-env'

// 更新地址
const updateURL = 'https://xxxx.com/app/'

const message = {
	error: { status: -1, msg: '检查更新出错' },
	checking: { status: 0, msg: '正在检查更新……' },
	updateAva: { status: 1, msg: '检测到新版本，正在下载……' },
	updateNotAva: { status: -1, msg: '已经是最新版本' },
	updateDownload: { status: 2, msg: '正在下载' }
}

export function updateAppClient(mainWindow: EelectronWindowType) {
	// 若执行删除操作，每次检查更新都会重新下载更新包，
	// 若不执行删除操作,在已有更新包的情况下,会直接跳过下载事件,直接进行安装操作
	// deleteUpdate()

	// 设置是否自动下载，默认是true,当点击检测到新版本时，会自动下载安装包，所以设置为false
	autoUpdater.autoDownload = false

	autoUpdater.autoInstallOnAppQuit = false // 如果安装包下载好了，当应用退出后是否自动安装更新

	if (isDev) {
		autoUpdater.updateConfigPath = path.join(__dirname, '../../dev-app-update.yml')
	}

	autoUpdater.checkForUpdates()
	// 设置版本更新服务器地址
	autoUpdater.setFeedURL(updateURL)
	// autoUpdater.setFeedURL('http://localhost:5050/client')

	// 更新发生错误时触发
	autoUpdater.on('error', function () {
		logger.error('检查更新出错')
		sendUpdateMessage(message.error)
	})

	// 开始检查更新事件
	autoUpdater.on('checking-for-update', function () {
		logger.info('开始检查更新')
		sendUpdateMessage(message.checking)
	})

	// 没有可更新版本
	autoUpdater.on('update-not-available', function (info) {
		logger.info('已经是最新的版本', info)
		sendUpdateMessage(message.updateNotAva)
	})

	// 发现可更新版本
	autoUpdater.on('update-available', function (info) {
		logger.debug('发现新版本')
		logger.info('新版本信息：', info)
		// 获取当前版本信息
		// logger.info("localVersion---->",config.version)
		sendUpdateMessage(message.updateAva)
		mainWindow.webContents.send('update-available', info)
	})

	// ================ 手动更新 ====================
	// 检查更新
	ipcMain.on('checkForUpdate', () => {
		// 执行自动更新检查
		logger.info('执行更新检查')
		autoUpdater.checkForUpdates()
	})

	// 下载更新
	ipcMain.on('downloadUpdate', () => {
		// 下载
		logger.info('下载操作执行')
		// autoUpdater.downloadUpdate()

		// 下载路径
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
		logger.debug('下载进度事件 ... ')
		logger.info('progressObj--->', progressObj)
		const info = {
			bytesPerSecond: progressObj.bytesPerSecond,
			percent: progressObj.percent, // 下载进度百分比
			transferred: progressObj.transferred,
			total: progressObj.total
		}
		mainWindow.webContents.send('downloadProgress', info)
	})

	// 下载完成
	autoUpdater.on('update-downloaded', args => {
		logger.info('下载完毕')
		logger.info('releaseInfo---->', args)

		// 接收到立即更新的信号，退出程序并更新
		ipcMain.on('isUpdateNow', (_, arg) => {
			logger.info(arg)
			autoUpdater
				.downloadUpdate()
				.then(downloadPath => {
					logger.info('download path:', downloadPath)
				})
				.catch(err => {
					logger.info(err)
				})
			logger.info('开始更新')
			// 3秒后退出并安装，可控制
			// mainWindow.isUpdateNow = true
			setTimeout(() => {
				// autoUpdater.quitAndInstall()
				autoUpdater.quitAndInstall(true, true) // 包下载完成后，重启当前的应用并且安装更新
			}, 1500)
		})

		// 通知客户端是否立即安装
		if (isDev) {
			mainWindow.webContents.send('isUpdateNow', args)
		}
	})

	// 立即安装
	ipcMain.on('handleUpdateNow', (_, arg) => {
		// serveControll.stopServer() // 关闭后台服务
		logger.info(arg)
		// 3秒后退出并安装，可控制
		setTimeout(() => {
			// 退出且重新安装
			logger.info('退出且重新安装')
			autoUpdater.quitAndInstall()
		}, 3000)
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
// function deleteUpdate() {
//   const updateCacheDirName = 'sdp-desktop-client-updater'
//   // 更新包下载路径
//   const updatePendingPath = path.join(autoUpdater.app.baseCachePath, updateCacheDirName, 'pending')
//   logger.info('updatePendingPath=', updatePendingPath)
//   // 删除本地安装包
//   fs.emptyDir(updatePendingPath)
// }
