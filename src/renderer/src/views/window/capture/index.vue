<script setup lang="ts">
const capture = () => {
	window.ipcApi.sendCapture()
	setTimeout(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					mandatory: {
						chromeMediaSource: 'desktop',
						minWidth: 1280,
						maxWidth: 1280,
						minHeight: 720,
						maxHeight: 720
					}
				}
			})
			handleStream(stream)
		} catch (e) {
			handleError(e)
		}

		function handleStream(stream) {
			console.log(stream)
			const video = document.querySelector('#myVideo')
			video.srcObject = stream
			video.onloadedmetadata = e => video.play()
		}

		function handleError(e) {
			console.log(e)
		}
	}, 2000)
}
</script>

<template>
	<el-row>
		<el-col>
			<video id="myVideo"></video>
			<el-button type="primary" @click="capture">捕获窗口</el-button>
		</el-col>
	</el-row>
</template>

<style scoped lang="scss"></style>
