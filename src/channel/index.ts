export default {
	// 主进程 <-> 渲染进程通信
	MAIN_RENDERER_MESSAGE: 'inter-renderer-message',

	// 创建子窗口
	CREATE_CHILD_WINDOW: 'create-child-window',

	// 关闭子窗口
	CLOSE_CHILD_WINDOW: 'close-child-window',

	// 渲染进程 <-> 渲染进程 通信
	INTER_RENDERER_MESSAGE_TO_CHILD_WINDOW: 'inter-renderer-message-to-child-window', //父窗口->子窗口
	INTER_RENDERER_MESSAGE_TO_PARENT_WINDOW: 'inter-renderer-message-to-parent-window' //子窗口->父窗口
}
