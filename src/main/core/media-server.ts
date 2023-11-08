/**
 * https://github.com/illuspas/Node-Media-Server
 *
 * logTyp:
 * 0 - 不记录任何内容
 * 1 - 记录错误
 * 2 - 记录错误和一般信息
 * 3 - 记录一切（调试）
 *
 */
import NodeMediaServer from 'node-media-server'
const nms = new NodeMediaServer({
	logType: 3, // 记录一切（调试）
	rtmp: {
		port: 5175,
		chunk_size: 60000,
		gop_cache: true,
		ping: 60,
		ping_timeout: 30
	},
	http: {
		port: 8080,
		allow_origin: '*'
	}
})

export default nms
