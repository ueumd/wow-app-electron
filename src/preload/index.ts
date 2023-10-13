import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { NodeFseApi } from './lib/node-fse-api'

const nodeFseApi = NodeFseApi.getInstance()

type INodeFseApi = NodeFseApi

export type { INodeFseApi }

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('nodeFseApi', nodeFseApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.nodeFseApi = nodeFseApi
}
