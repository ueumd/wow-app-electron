import { electronAPI } from '@electron-toolkit/preload'
import channel from '../../channel'

export class IpcApi {
  private static instance: IpcApi

  public static getInstance() {
    if (this.instance) return this.instance
    return (this.instance = new IpcApi())
  }

  emit(channel: string, payload?: any) {
    electronAPI.ipcRenderer.send(channel, payload)
  }

  /**
   * send message renderer to renderer
   * @param payload
   */
  send(payload) {
    electronAPI.ipcRenderer.send(channel.INTER_RENDERER_MESSAGE, payload)
  }

  /**
   * receive message renderer to renderer
   * @param payload
   */
  on(callback) {
    electronAPI.ipcRenderer.on(channel.INTER_RENDERER_MESSAGE, (_, data) => {
      callback(data)
    })
  }
}
