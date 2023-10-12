"use strict";
const electron = require("electron");
const utils = require("@electron-toolkit/utils");
const path = require("path");
const isDev = process.env.NODE_ENV === "development";
({
  isWindows: process.platform === "win32",
  isMacOS: process.platform === "darwin",
  isLinux: process.platform === "linux"
});
process.env.DIST_ELECTRON = path.join(__dirname, "..");
process.env.DIST = path.join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? path.join(process.env.DIST_ELECTRON, "../public") : process.env.DIST;
const preload = path.join(__dirname, "../preload/index.js");
const INDEX_HTML_PATH = path.join(process.env.DIST, "../renderer/index.html");
const ELECTRON_RENDERER_URL = process.env["ELECTRON_RENDERER_URL"] || INDEX_HTML_PATH;
class MultiWindows {
  // 主窗口
  primaryWindow = {};
  // 窗口组
  windowGroup = [];
  // 托盘
  tray = {};
  // 窗口配置
  /**
   * https://electron.nodejs.cn/docs/latest/api/structures/browser-window-options/
   */
  getElectronWindowDefaultConfig() {
    return {
      title: "",
      width: 1e3,
      height: 900,
      minWidth: 0,
      minHeight: 0,
      resizable: true,
      minimizable: true,
      maximizable: true,
      autoHideMenuBar: true,
      frame: true,
      show: true,
      backgroundColor: "#2f3241",
      modal: false,
      webPreferences: {
        contextIsolation: false,
        //上下文隔离
        nodeIntegration: true,
        //启用Node集成（是否完整的支持 node）
        webSecurity: true,
        preload
      }
    };
  }
  /**
   * 默认配置 与 传参处理
   * @param userArgs
   */
  getUserConfig(userArgs) {
    const windowOpt = this.getElectronWindowDefaultConfig();
    const eleKeys = Object.keys(windowOpt);
    Object.keys(userArgs).forEach((it) => {
      if (eleKeys.includes(it)) {
        windowOpt[it] = userArgs[it];
      }
    });
    return windowOpt;
  }
  /**
   * 创建主窗口（维一）
   * @param args 传入参数配置
   */
  async createPrimaryWindow(args) {
    if (Object.keys(this.primaryWindow).length) {
      console.log("主窗口存在");
      return this.primaryWindow;
    }
    const windowOpt = this.getUserConfig(args);
    this.primaryWindow = new electron.BrowserWindow(windowOpt);
    if (isDev) {
      this.primaryWindow.setMaximizable(windowOpt.maximizable);
      this.primaryWindow.setResizable(windowOpt.resizable);
      this.primaryWindow.webContents.openDevTools();
    } else {
      this.primaryWindow.setMinimumSize(1600, 900);
      this.primaryWindow.setMaximizable(false);
      this.primaryWindow.setResizable(true);
    }
    let winUrl = INDEX_HTML_PATH;
    if (utils.is.dev) {
      winUrl = args.pageRoute ? `${ELECTRON_RENDERER_URL}#${args.pageRoute}?winId=${this.primaryWindow.id}` : ELECTRON_RENDERER_URL;
    } else {
      winUrl = args.pageRoute ? `${INDEX_HTML_PATH}#${args.pageRoute}?winId=${this.primaryWindow.id}` : `${INDEX_HTML_PATH}`;
    }
    await this.primaryWindow.loadURL(winUrl);
    return this.primaryWindow;
  }
  /**
   * 获取窗口
   * @param id
   */
  getWindow(id) {
    return electron.BrowserWindow.fromId(id);
  }
  /**
   * 当前正在活动的窗口
   */
  getFocusedWindow() {
    return electron.BrowserWindow.getFocusedWindow();
  }
  /**
   * 禁止右键菜单弹出
   * @param win
   */
  disabledRightClick(win) {
    win.hookWindowMessage && win.hookWindowMessage(278, function() {
      win.setEnabled(false);
      const timer_ = setTimeout(() => {
        win.setEnabled(true);
        clearTimeout(timer_);
      }, 100);
      return true;
    });
  }
  /**
   * 创建托盘
   */
  createTray() {
    const contextMenu = electron.Menu.buildFromTemplate([
      {
        label: "注销",
        click: () => {
          console.log("注销");
        }
      },
      {
        type: "separator"
        // 分割线
      },
      // 菜单项
      {
        label: "退出",
        role: "quit"
        // 使用内置的菜单行为，就不需要再指定 click 事件
      }
    ]);
    this.tray = new electron.Tray(path.join(__dirname, "../favicon.ico"));
    this.tray.on("click", () => {
      for (const i in this.windowGroup) {
        if (this.windowGroup[i])
          this.getWindow(Number(i)).show();
      }
    });
    this.tray.on("right-click", () => {
      this.tray?.popUpContextMenu(contextMenu);
    });
    this.tray.setToolTip("WindowTitle");
  }
  /**
   * 开启监听
   */
  listen() {
    electron.ipcMain.on("set-title", (_, title) => {
      this.getFocusedWindow().setTitle(title);
    });
    electron.ipcMain.on("pinUp", (_, winId) => {
      if (winId && this.primaryWindow.id == winId) {
        const win = this.getWindow(Number(this.primaryWindow.id));
        if (win.isAlwaysOnTop()) {
          win.setAlwaysOnTop(false);
        } else {
          win.setAlwaysOnTop(true);
        }
      }
    });
    electron.ipcMain.on("window-hide", (_, winId) => {
      if (winId) {
        this.getWindow(Number(winId)).hide();
      } else {
        for (const i in this.windowGroup) {
          if (this.windowGroup[i])
            this.getWindow(Number(i)).hide();
        }
      }
    });
    electron.ipcMain.on("window-show", (_, winId) => {
      if (winId) {
        this.getWindow(Number(winId)).show();
      } else {
        for (const i in this.windowGroup) {
          if (this.windowGroup[i])
            this.getWindow(Number(i)).show();
        }
      }
    });
    electron.ipcMain.on("window-mini", (_) => {
      this.getFocusedWindow().minimize();
    });
    electron.ipcMain.on("window-max", (_) => {
      const win = this.getFocusedWindow();
      if (win.isMaximized()) {
        win.restore();
      } else {
        win.maximize();
      }
    });
    electron.ipcMain.on("app-quit", (_) => {
      electron.app.quit();
    });
    electron.ipcMain.on("app-exit", (_) => {
      electron.app.exit();
    });
    electron.ipcMain.on("close-window", (_, id) => {
      const win = this.getWindow(id);
      if (win) {
        win.close();
      }
    });
  }
}
const multiWindows = new MultiWindows();
multiWindows.listen();
const createAppWindow = async () => {
  const mainWindow = await multiWindows.createPrimaryWindow({
    isPrimaryWindow: true,
    isMultiWindow: false,
    width: 1600,
    height: 900,
    frame: true,
    show: true,
    autoHideMenuBar: true
  });
  mainWindow.on("close", (event) => {
    event.preventDefault();
    electron.dialog.showMessageBox(mainWindow, {
      type: "info",
      noLink: true,
      //win下的样式
      title: "  哇塞",
      message: "确认退出吗？",
      buttons: ["取消", "确定"]
    }).then((index) => {
      if (index.response === 1) {
        electron.app.exit();
      }
    });
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    if (utils.is.dev) {
      mainWindow.setContentProtection(true);
      mainWindow.webContents.on("before-input-event", (event, input) => {
        mainWindow.webContents.setIgnoreMenuShortcuts(!input.control && !input.meta);
        const key = input.key.toLowerCase();
        if (input.control && ["i", "m", "r"].includes(key)) {
          console.log("Pressed Control+" + key);
          event.preventDefault();
        }
      });
    }
  });
};
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createAppWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createAppWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
