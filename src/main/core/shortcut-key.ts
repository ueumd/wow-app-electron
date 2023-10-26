import { BrowserWindow, globalShortcut } from 'electron'

/**
 * 注册快捷健
 */
export function registryShortcut() {
	globalShortcut.register('ctrl+shift+alt+k', () => {
		// 开发者工具
		BrowserWindow?.getFocusedWindow()?.webContents.openDevTools()
	})
}
