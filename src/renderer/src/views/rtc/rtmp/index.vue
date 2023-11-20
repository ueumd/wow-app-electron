<script setup lang="ts">
import flvjs from 'flv.js'
import { onMounted, ref } from 'vue'

const filePath = ref('E:\\coding\\github-me\\front\\wow-app-electron\\test-rtmp\\video\\rst_lmm_1.mp4')

let videoIndex = 0
const videoList = [
	'E:\\coding\\github-me\\front\\wow-app-electron\\test-rtmp\\video\\rst_lmm_1.mp4',
	'E:\\coding\\github-me\\front\\wow-app-electron\\test-rtmp\\video\\rst_lmm_2.mp4',
	'E:\\coding\\github-me\\front\\wow-app-electron\\test-rtmp\\video\\rst_lmm_3.mp4'
]

const bootServe = () => {
	window.ipcApi.bootNodeMediaServe()
}

const listenNMSServer = () => {
	window.ipcApi.onMainMsg(res => {
		console.log('nms: ', res)
		if (res.type === 'ffmpeg' && res.data === 'Finished') {
			publishStream()
		}
	})
}

let flvPlayer: any
let isPlaying = false

const playVideo = () => {
	if (isPlaying) {
		continuePlay()
		return
	}

	if (flvjs.isSupported()) {
		const videoElement = document.querySelector('#PiXiuLiveRoom')
		flvPlayer = flvjs.createPlayer(
			{
				isLive: true, // 是否是直播流
				hasAudio: true, // 是否有音频
				hasVideo: true, // 是否有视频
				type: 'flv',
				url: 'http://127.0.0.1:8080/live/stream.flv'
			},
			{
				reuseRedirectedURL: true, //重用301/302重定向url，用于随后的请求，如查找、重新连接等
				autoCleanupSourceBuffer: true, //自动清除缓存 默认为 false
				enableStashBuffer: false // 是否开启播放器端缓存 默认为true
			}
		)

		flvPlayer.attachMediaElement(<HTMLMediaElement>videoElement)
		flvPlayer.load()
		flvPlayer.play()
		isPlaying = true
	}
}

const videoEnded = () => {
	console.log('play ended')
	flvPlayer.unload()
	setTimeout(() => {
		flvPlayer.load()
		flvPlayer.play()
		isPlaying = true
	}, 10)
}

/**
 * 结束 - 销毁断流方法
 */
const destroyVideo = () => {
	flvPlayer.unload()
	flvPlayer.detachMediaElement()
	flvPlayer.destroy()
	flvPlayer = null

	window.ipcApi.closeFfmpeg()
}

const reloadVideo = () => {
	destroyVideo()
	playVideo()
}

const playVideoPause = () => {
	flvPlayer.pause()
	isPlaying = false
}

const continuePlay = () => {
	flvPlayer.play()
}

onMounted(() => {
	listenNMSServer()
	// 断开重连机制
})

const publishStream = () => {
	// 'E:\\coding\\github-me\\front\\wow-app-electron\\test-rtmp\\video\\rst_lmm_1.mp4'
	if (videoIndex > videoList.length - 1) {
		videoIndex = 0
	}
	const vpath = videoList[videoIndex]
	console.log('path', vpath)
	window.ipcApi.sendExecuteFfmpeg(vpath)
	videoIndex += 1
}
</script>

<template>
	<el-row>
		<el-col>
			<div class="mb-1">
				<el-button type="primary" @click="bootServe">启动服务</el-button>
				<el-button type="primary" @click="publishStream">开始推流</el-button>
				<el-button type="primary" @click="playVideo">播放</el-button>
				<el-button type="primary" @click="playVideoPause">暂停</el-button>
				<el-button type="danger" @click="destroyVideo">结束</el-button>
			</div>
			<div class="mb-1">
				<el-input type="text" v-model="filePath" placeholder="视频地址"></el-input>
			</div>
			<div class="box">
				<video id="PiXiuLiveRoom" @ended="videoEnded"></video>
			</div>
		</el-col>
	</el-row>
</template>
<style scoped lang="scss">
.box {
	width: 400px;
	height: 600px;
	border: 1px solid #ddd;
}

video {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
</style>
