<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import store from '@/store'

const route = useRoute()

const onRecMessageByWinTitle = () => {
	console.log('onRecMessageByWinTitle')
	window.ipcApi?.onRecMessageByWinTitle(res => {
		console.log('parent window msg: ', res)
	})
}

const sendMsg = () => {
	window.ipcApi?.sendMessageByWinTitle({
		title: store.appStore.title,
		data: {
			message: '子窗口消息',
			childWinId: route.query.winId
		}
	})
}

const sendMsgToSecondChildWindow = () => {
	window.ipcApi?.sendMessageByWinTitle({
		title: '子窗口二',
		data: {
			message: '来自子窗口一的消息',
			childWinId: route.query.winId
		}
	})
}

onMounted(() => {
	console.log('current window id: ', route.query.winId)
	onRecMessageByWinTitle()
})
</script>

<template>
	<el-row class="mg" :gutter="10">
		<el-col>
			<el-button type="success" @click="sendMsg()">send msg</el-button>
			<el-button type="success" @click="sendMsg()">send msg</el-button>
		</el-col>
		<el-col>
			<el-button type="success" @click="sendMsgToSecondChildWindow()">向子窗口二发送消息</el-button>
		</el-col>
	</el-row>
</template>

<style scoped lang="scss"></style>
