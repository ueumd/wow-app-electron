import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { NodeFseApi } from './lib/node-fse-api'
import { IpcApi } from './lib/ipc-api'

const nodeFseApi = NodeFseApi.getInstance()
const ipcApi = IpcApi.getInstance()

type INodeFseApi = NodeFseApi
type IIpcApi = IpcApi

export type { INodeFseApi, IIpcApi }

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('nodeFseApi', nodeFseApi)
    contextBridge.exposeInMainWorld('ipcApi', ipcApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.nodeFseApi = nodeFseApi
  // @ts-ignore (define in dts)
  window.ipcApi = ipcApi
}
