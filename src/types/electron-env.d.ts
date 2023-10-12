/// <reference types="vite-plugin-electron/electron-env" />
import { BrowserWindow } from 'electron'

declare namespace NodeJS {
  interface ProcessEnv {
    VSCODE_DEBUG?: 'true'
    DIST_ELECTRON: string
    DIST: string
    PUBLIC: string
  }
}

export type EelectronWindowType = Electron.CrossProcessExports.BrowserWindow

// 窗口选项
export interface IWindowsConfig {
  id?: number | null
  title?: string | undefined
  width: number | null
  height: number | null
  minWidth?: number | null
  minHeight?: number | null
  resizable?: boolean
  minimizable?: boolean
  maximizable?: boolean
  autoHideMenuBar?: boolean
  frame?: boolean
  show?: boolean
  backgroundColor?: string
  modal?: boolean
  parent?: BrowserWindow | null // 创建父子窗口 -- 子窗口永远显示在父窗口顶部
  parentId?: number | null // 父窗口ID

  isPrimaryWindow?: boolean // 是否是主窗口（唯一）
  isMultiWindow?: boolean // 是否支持多开窗口

  pageRoute?: string | null // 页面路由
}

// 窗口组
export interface IWindowGroup {
  [props: string]: {
    isPrimaryWindow?: boolean
    isMultiWindow: boolean
    pageRoute: string
  }
}
