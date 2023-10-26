<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import store from '@/store'

const route = useRoute()

const recParentWindowMessage = () => {
	console.log('recParentWindowMessage')
	window.ipcApi?.onRecParentWindowMessage(res => {
		console.log('parent window msg: ', res)
	})
}

const sendMsg = () => {
	window.ipcApi?.sendMessageToParentWindow({
		title: store.appStore.title,
		data: {
			message: '子窗口消息',
			childWinId: route.query.winId
		}
	})
}

onMounted(() => {
	console.log('current window id: ', route.query.winId)
	recParentWindowMessage()
})
</script>

<template>
	<el-row class="mg">
		<el-button type="success" @click="sendMsg()">send msg</el-button>
		<el-button type="success" @click="sendMsg()">send msg</el-button>
	</el-row>
</template>

<style scoped lang="scss"></style>
