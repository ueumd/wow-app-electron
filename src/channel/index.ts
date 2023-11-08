export default {
	// 主进程 <-> 渲染进程通信
	MAIN_TO_RENDERER: 'main-to-renderer',

	// 创建子窗口
	CREATE_CHILD_WINDOW: 'create-child-window',

	// 关闭子窗口
	CLOSE_CHILD_WINDOW: 'close-child-window',

	// 渲染进程 <-> 渲染进程 通信
	RENDERER_TO_RENDERER: 'renderer-to-renderer',

	// 启动RTMP服务
	BOOT_NODE_MEDIA_SERVER: 'boot-node-media-server',

	FFMPEG_PUBLISH: 'FFMPEG_PUBLISH'
}
