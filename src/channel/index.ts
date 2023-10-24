export default {
  INTER_RENDERER_MESSAGE: 'inter-renderer-message',
  CREATE_CHILD_WINDOW: 'create-child-window',

  // 渲染进程 -> 主进程 SEND_
  SEND_MESSAGE_TO_CHILD_WINDOW: 'send-message-to-child-window', //父窗口->子窗口
  SEND_MESSAGE_TO_PARENT_WINDOW: 'send-message-to-parent-window', //子窗口->父窗口

  // 主进程 -> 渲染进程
  REPLY_MESSAGE_LIVE_ROOM: 'reply-message-live-room',
  REC_MESSAGE_CREATE_WINDOW_SUCCESS: 'rec-message-create-window-success', //成功新建窗口

  REC_PARENT_WINDOW_MESSAGE: 'rec-parent-window-message', //接收父窗口消息
  REC_CHILD_WINDOW_MESSAGE: 'rec-child-window-message' // 接收子窗口消息
}
