<script setup lang="ts">
import { onMounted } from 'vue'
const test = () => {
	console.log(window.nodeFseApi)
	window.nodeFseApi?.remove('/xxff/ff')
}

const writeLog = () => {
	window.ipcApi.log('info', 'Hello Logger!')
	window.ipcApi.log('error', 'Hello Logger!')
}

const openWin = (url, title) => {
	window.ipcApi
		.sendCreateChildWindow({
			title,
			route: url,
			data: {
				title,
				url
			}
		})
		.then(res => {
			console.log('create window', res)
		})
}

const closeWin = title => {
	window.ipcApi
		?.sendCloseChildWindow({
			title
		})
		.then(res => {
			console.log('close window: ', res)
		})
		.catch(err => {
			console.error('close window: ', err)
		})
}

const sendMsgByTitle = title => {
	window.ipcApi?.sendMessageToChildWindow({
		title: title,
		data: {
			message: '父窗口消息'
		}
	})
}

onMounted(() => {
	test()

	window.ipcApi?.onRecChildWindowMessage(res => {
		console.log('child window msg: ', res)
	})
})
</script>

<template>
	<el-row class="mg" :gutter="10">
		<el-col :span="8">
			<el-button type="primary" @click="writeLog">Log</el-button>
			<el-button type="primary" @click="openWin('/window/base/child-window-one', '子窗口一')">打开子窗口一</el-button>
			<el-button type="primary" @click="closeWin('子窗口一')">关闭窗口</el-button>
			<el-button type="success" @click="sendMsgByTitle('子窗口一')">send msg</el-button>
		</el-col>
		<el-col :span="8">
			<el-button type="primary" @click="openWin('/window/base/child-window-two', '子窗口二')">打开子窗口二</el-button>
			<el-button type="success" @click="sendMsgByTitle('子窗口二')">send msg</el-button>
			<el-button type="primary" @click="closeWin('子窗口二')">关闭窗口</el-button>
		</el-col>
		<el-col :span="8"> </el-col>
	</el-row>
	<el-row> </el-row>
</template>

<style lang="less"></style>
