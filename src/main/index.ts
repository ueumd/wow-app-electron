import { app, BrowserWindow, dialog } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import MultiWindows from './core/multi-windows'

// 创建主窗口
const createAppWindow = async () => {
  const mainWindow = await MultiWindows.createPrimaryWindow({
    isPrimaryWindow: true,
    isMultiWindow: false,
    width: 1600,
    height: 900,
    frame: true,
    show: true,
    autoHideMenuBar: true
  })

  mainWindow.on('close', (event) => {
    event.preventDefault()
    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        noLink: true, //win下的样式
        title: '  哇塞',
        message: '确认退出吗？',
        buttons: ['取消', '确定']
      })
      .then((index) => {
        if (index.response === 1) {
          app.exit()
        }
      })
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    if (is.dev) {
      // mainWindow.setContentProtection(true)
      // mainWindow.webContents.on('before-input-event', (event, input) => {
      //   // 当 Ctrl/Cmd are down 被按下，仅开启应用程序菜单键盘快捷键。
      //   mainWindow.webContents.setIgnoreMenuShortcuts(!input.control && !input.meta)
      //   const key = input.key.toLowerCase()
      //   if (input.control && ['i', 'm', 'r'].includes(key)) {
      //     console.log('Pressed Control+' + key)
      //     event.preventDefault()
      //   }
      // })
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createAppWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createAppWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
