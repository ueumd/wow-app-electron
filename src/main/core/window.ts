import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron'
import path, { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { IWindowGroup, IWindowsConfig } from '../../types/electron-env'
import type { EelectronWindowType } from '../../types/electron-env'
import { isDev } from './utils'

process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

const preload = join(__dirname, '../preload/index.js')

const INDEX_HTML_PATH = join(process.env.DIST, '../renderer/index.html')
const ELECTRON_RENDERER_URL = process.env['ELECTRON_RENDERER_URL'] || INDEX_HTML_PATH

// 新建窗口时可以传入的一些options配置项
// const windowConfig: IWindowsConfig = {
//   id: null, //唯一 id
//   title: '', //窗口标题
//   width: 1000, //宽度
//   height: 900, //高度
//   minWidth: 0, //最小宽度
//   minHeight: 0, //最小高度
//   resizable: true, //是否支持调整窗口大小
//   minimizable: false, //是否最小化
//   maximizable: false, //是否最大化
//   autoHideMenuBar: false,
//
//   frame: false,
//   show: true,
//   backgroundColor: '#eee', //窗口背景色
//
//   modal: false, //模态窗口 -- 模态窗口是禁用父窗口的子窗口，创建模态窗口必须设置 parent 和 modal 选项 【父窗口不能操作】
//   parent: null, //父窗口 id  创建父子窗口 -- 子窗口永远显示在父窗口顶部 【父窗口可以操作】
//   parentId: null,
//
//   isPrimaryWindow: false,
//   isMultiWindow: false, //是否支持多开窗口 (如果为 false，当窗体存在，再次创建不会新建一个窗体 只 focus 显示即可，，如果为 true，即使窗体存在，也可以新建一个)
//
//   pageRoute: null // 页面路由 /product?id=1
// }

/**
 * 窗口配置
 */
class MultiWindows {
  // 主窗口
  private primaryWindow = {} as EelectronWindowType
  // 窗口组
  private windowGroup: Array<IWindowGroup> = []
  // 托盘
  private tray = {} as Tray

  // 窗口配置
  /**
   * https://electron.nodejs.cn/docs/latest/api/structures/browser-window-options/
   */
  getElectronWindowDefaultConfig() {
    return {
      title: '',
      width: 1000,
      height: 900,
      minWidth: 0,
      minHeight: 0,
      resizable: true,
      minimizable: true,
      maximizable: true,
      autoHideMenuBar: true,
      frame: true,
      show: true,
      backgroundColor: '#2f3241',
      modal: false,
      webPreferences: {
        contextIsolation: false, //上下文隔离
        nodeIntegration: true, //启用Node集成（是否完整的支持 node）
        webSecurity: true,
        preload
      }
    }
  }

  /**
   * 默认配置 与 传参处理
   * @param userArgs
   */
  getUserConfig(userArgs: IWindowsConfig) {
    const windowOpt = this.getElectronWindowDefaultConfig()
    const eleKeys = Object.keys(windowOpt)
    Object.keys(userArgs).forEach((it) => {
      if (eleKeys.includes(it)) {
        windowOpt[it] = userArgs[it]
      }
    })
    return windowOpt
  }

  /**
   * 创建主窗口（维一）
   * @param args 传入参数配置
   */
  async createPrimaryWindow(args: IWindowsConfig): Promise<EelectronWindowType> {
    // args = { ...windowConfig, ...args } as IWindowsConfig

    // 是否主窗口
    if (Object.keys(this.primaryWindow).length) {
      console.log('主窗口存在')
      return this.primaryWindow
    }

    const windowOpt = this.getUserConfig(args)

    // 创建窗口对象
    this.primaryWindow = new BrowserWindow(windowOpt) as EelectronWindowType

    if (isDev) {
      this.primaryWindow.setMaximizable(windowOpt.maximizable)
      this.primaryWindow.setResizable(windowOpt.resizable)
      this.primaryWindow.webContents.openDevTools()
      // primaryWindow.setMinimumSize(1600, 900)
    } else {
      this.primaryWindow.setMinimumSize(1600, 900)
      // 设置窗口是否可以由用户手动最大化
      this.primaryWindow.setMaximizable(false)
      // 设置用户是否可以调节窗口尺寸
      this.primaryWindow.setResizable(true)
    }

    // 默认启动最大化
    // if (windowOpt.maximizable && windowOpt.resizable) {
    //   this.primaryWindow.maximize()
    // }

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    let winUrl = INDEX_HTML_PATH
    if (is.dev) {
      // electron-vite-vue#298
      winUrl = args.pageRoute
        ? `${ELECTRON_RENDERER_URL}#${args.pageRoute}?winId=${this.primaryWindow.id}`
        : ELECTRON_RENDERER_URL
    } else {
      winUrl = args.pageRoute
        ? `${INDEX_HTML_PATH}#${args.pageRoute}?winId=${this.primaryWindow.id}`
        : `${INDEX_HTML_PATH}`
    }
    await this.primaryWindow.loadURL(winUrl)
    return this.primaryWindow
  }

  /**
   * 获取窗口
   * @param id
   */
  getWindow(id: number) {
    return BrowserWindow.fromId(id) as EelectronWindowType
  }

  /**
   * 当前正在活动的窗口
   */
  getFocusedWindow() {
    return BrowserWindow.getFocusedWindow() as EelectronWindowType
  }

  /**
   * 禁止右键菜单弹出
   * @param win
   */
  disabledRightClick(win: any) {
    win.hookWindowMessage &&
      win.hookWindowMessage(278, function () {
        win.setEnabled(false) //窗口禁用
        const timer_ = setTimeout(() => {
          win.setEnabled(true)
          clearTimeout(timer_)
        }, 100) // 延时太快会立刻启动，太慢会妨碍窗口其他操作，可自行测试最佳时间
        return true
      })
  }

  /**
   * 创建托盘
   */
  createTray() {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '注销',
        click: () => {
          console.log('注销')
          // 主进程发送消息，通知渲染进程注销当前登录用户 --todo
        }
      },
      {
        type: 'separator' // 分割线
      },
      // 菜单项
      {
        label: '退出',
        role: 'quit' // 使用内置的菜单行为，就不需要再指定 click 事件
      }
    ])
    this.tray = new Tray(path.join(__dirname, '../favicon.ico')) // 图标
    // 点击托盘显示窗口
    this.tray.on('click', () => {
      for (const i in this.windowGroup) {
        if (this.windowGroup[i]) this.getWindow(Number(i)).show()
      }
    })
    // 处理右键
    this.tray.on('right-click', () => {
      this.tray?.popUpContextMenu(contextMenu)
    })
    this.tray.setToolTip('WindowTitle')
  }

  /**
   * 开启监听
   */
  listen() {
    // 设置标题
    ipcMain.on('set-title', (_, title) => {
      // const win = BrowserWindow.fromWebContents(event.sender)
      // win.setTitle(data)
      this.getFocusedWindow().setTitle(title)
    })

    // 固定
    ipcMain.on('pinUp', (_, winId) => {
      if (winId && (this.primaryWindow as BrowserWindow).id == winId) {
        const win: BrowserWindow = this.getWindow(Number((this.primaryWindow as BrowserWindow).id))
        if (win.isAlwaysOnTop()) {
          win.setAlwaysOnTop(false) // 取消置顶
        } else {
          win.setAlwaysOnTop(true) // 置顶
        }
      }
    })

    // 隐藏
    ipcMain.on('window-hide', (_, winId) => {
      if (winId) {
        this.getWindow(Number(winId)).hide()
      } else {
        for (const i in this.windowGroup) {
          if (this.windowGroup[i]) this.getWindow(Number(i)).hide()
        }
      }
    })

    // 显示
    ipcMain.on('window-show', (_, winId) => {
      if (winId) {
        this.getWindow(Number(winId)).show()
      } else {
        for (const i in this.windowGroup) {
          if (this.windowGroup[i]) this.getWindow(Number(i)).show()
        }
      }
    })

    // 最小化
    ipcMain.on('window-mini', (_) => {
      this.getFocusedWindow().minimize()
    })

    // 最大化
    ipcMain.on('window-max', (_) => {
      const win = this.getFocusedWindow()
      if (win.isMaximized()) {
        // 还原
        win.restore()
      } else {
        // 最大化
        win.maximize()
      }
    })

    /**
     * 退出前
     * app.quit()并不能保证程序一定会退出
     * 在before-quit，will-quit中调用event.preventDefault()或者在window的close事件回调函数中阻止窗口关闭
     */
    ipcMain.on('app-quit', (_) => {
      app.quit()
    })

    /**
     * 强制退出
     * 退出程序，销毁窗口
     */
    ipcMain.on('app-exit', (_) => {
      app.exit()
    })

    // 关闭窗口
    ipcMain.on('close-window', (_, id) => {
      const win = this.getWindow(id)
      if (win) {
        win.close()
      }
    })
  }
}

const multiWindows = new MultiWindows()
multiWindows.listen()

export default multiWindows
