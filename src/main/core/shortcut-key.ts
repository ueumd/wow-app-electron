import { BrowserWindow, globalShortcut } from 'electron'

/**
 * 注册快捷健
 */
export function registryShortcut() {
  globalShortcut.register('Command+P', () => {
    // 开发者工具
    BrowserWindow?.getFocusedWindow()?.webContents.openDevTools()
  })
}
