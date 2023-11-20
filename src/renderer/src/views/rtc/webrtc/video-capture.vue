<script setup lang="ts">
import { onMounted, ref } from 'vue'
const fromVideo = ref()
const toVideo = ref()
const audioStreamRef = ref()

let localStream

onMounted(() => {
	fromVideo.value.onplay = () => {
		localStream = toVideo.value.srcObject = fromVideo.value.captureStream()
		const [audioTrack] = localStream.getAudioTracks()
		audioStreamRef.value.srcObject = audioTrack
	}
})

const getAudioTracks = () => {
	const [audioTrack] = localStream.getAudioTracks()
	console.log('audioTrack', audioTrack)
}

const getVideoTracks = () => {
	const [videoTrack] = localStream.getVideoTracks()
	console.log('videoTrack', videoTrack)
}
</script>

<template>
	<el-row>
		<el-button @click="getAudioTracks">音频流</el-button>
		<el-button @click="getVideoTracks">视频流</el-button>
	</el-row>
	<el-row :gutter="10">
		<el-col :span="6">
			<video ref="fromVideo" playsinline controls muted>
				<source src="@/assets/test.mp4" type="video/mp4" />
			</video>
		</el-col>
		<el-col :span="6">
			<video ref="toVideo" playsinline autoplay controls></video>
		</el-col>
		<el-col :span="6">
			<audio ref="audioStreamRef" autoplay controls></audio>
		</el-col>
	</el-row>
</template>

<style scoped lang="scss">
.left,
.right {
	width: 350px;
	height: 500px;
}
video {
	width: 100%;
	height: 100%;
	object-fit: contain;
}
</style>
