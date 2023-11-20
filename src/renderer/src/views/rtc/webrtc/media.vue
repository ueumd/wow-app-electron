<script setup lang="ts">
import { ref } from 'vue'

/**
 * 显示本地摄像头的视频
 */
const constraints = {
	audio: true,
	video: true
}

const videoLocalRef = ref()

const open = async () => {
	try {
		const stream = await navigator.mediaDevices.getUserMedia(constraints)
		console.log('stream', stream)

		const videoTracks = stream.getVideoTracks()
		console.log('videoTracks', videoTracks)
		console.log(`正在使用的设备: ${videoTracks[0].label}`)

		videoLocalRef.value.srcObject = stream
	} catch (err) {
		console.error(err)
	}
}

const close = () => {
	console.log('停止视频')
	const stream = videoLocalRef.value.srcObject

	if (stream == null) {
		return
	}

	// 获取所有轨道
	const tracks = stream.getTracks()

	tracks.forEach(track => {
		track.stop()
	})

	videoLocalRef.value.srcObject = null
}
</script>

<template>
	<el-row>
		<video ref="videoLocalRef" autoplay playsinline></video>
	</el-row>
	<el-row>
		<el-button type="primary" @click="open()">打开摄像头</el-button>
		<el-button type="danger" @click="close">关闭摄像头</el-button>
	</el-row>
</template>

<style scoped lang="scss"></style>
