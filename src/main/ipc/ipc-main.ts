import { ipcMain, shell } from 'electron'
import logger from '../core/logger'
import channel from '../../channel'

export function initIpcMain(primaryWindow) {
  /**
   * 渲染进程日志处理
   * IPC输出渲染进程日志
   * 渲染进程调用
   * ipcRenderer.invoke('logger', 'info', '输出日志内容'
   */
  ipcMain.handle('logger', (_, level, ...arg) => {
    if (level === 'info') {
      logger.info(...arg)
    } else if (level === 'warn') {
      logger.warn(...arg)
    } else if (level === 'error') {
      logger.error(...arg)
    } else if (level === 'debug') {
      logger.debug(...arg)
    }
  })

  ipcMain.on('openLink', (_, params) => {
    shell.openExternal(params)
  })

  ipcMain.on(channel.INTER_RENDERER_MESSAGE, (_, payload) => {
    primaryWindow.webContents.send(channel.INTER_RENDERER_MESSAGE, payload)
  })
}
