export default {
	INTER_RENDERER_MESSAGE: 'inter-renderer-message',

	// 创建子窗口
	CREATE_CHILD_WINDOW: 'create-child-window',
	CLOSE_CHILD_WINDOW: 'close-child-window',

	// 渲染进程 -> 主进程 SEND_
	INTER_RENDERER_MESSAGE_TO_CHILD_WINDOW: 'inter-renderer-message-to-child-window', //父窗口->子窗口
	INTER_RENDERER_MESSAGE_TO_PARENT_WINDOW: 'inter-renderer-message-to-parent-window' //子窗口->父窗口
}
