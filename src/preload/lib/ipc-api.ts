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

  // 接收父窗口消息
  recParentWindowMessage(callback: (T) => void) {
    electronAPI.ipcRenderer.on(channel.REC_PARENT_WINDOW_MESSAGE, (_, data) => {
      callback(data)
    })
  }

  // 接收子窗口消息
  recChildWindowMessage(callback: (T) => void) {
    electronAPI.ipcRenderer.on(channel.REC_CHILD_WINDOW_MESSAGE, (_, data) => {
      callback(data)
    })
  }

  recCloseLiveWin() {
    electronAPI.ipcRenderer.on('closeLiveWin', (_) => {
      window.sessionStorage.removeItem('isOpenLiveWindow')
      console.log('-------closeLiveWin-')
    })
  }

  /**
   * 向子窗口发送消息
   * @param title 目标窗口标题
   * @param data 发送信息
   */
  sendMsgToChildWindow({ title, data }: IRenderToRenderMsg) {
    electronAPI.ipcRenderer.send(channel.SEND_MESSAGE_TO_CHILD_WINDOW, { title, data })
  }

  /**
   * 向父窗口发送消息
   * @param id 目标窗口ID
   * @param title 目标窗口标题
   * @param data 发送信息
   */
  sendMsgToParentWindow({ title, data }: IRenderToRenderMsg) {
    electronAPI.ipcRenderer.send(channel.SEND_MESSAGE_TO_PARENT_WINDOW, { title, data })
  }
}
