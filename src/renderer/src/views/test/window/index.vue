<script setup lang="ts">
import { onMounted } from 'vue'
import { useIpcRenderer } from '@vueuse/electron'
const ipcRenderer = useIpcRenderer()
const test = () => {
  console.log(window.nodeFseApi)
  window.nodeFseApi?.remove('/xxff/ff')
}

const openWin = (url, title) => {
  console.log(1, url, title)
  ipcRenderer.invoke('logger', 'info', 'Cancel the download')
  ipcRenderer.invoke('create-child-window', {
    title,
    route: url,
    data: {
      id: Date.now()
    }
  })
}

const closeWin = () => {}

const sendMsgByTitle = (title) => {
  console.log(title)
  window.ipcApi?.sendMsgToChildWindow({
    title: title,
    data: {
      id: Date.now()
    }
  })
}

onMounted(() => {
  test()

  window.ipcApi?.on((res) => {
    console.log(11111, res)
  })
})
</script>

<template>
  <el-row class="mg">
    <el-col :span="8">
      <el-button type="primary" @click="openWin('/test/window/child-window-one', '子窗口一')"
        >打开子窗口一</el-button
      >
      <el-button type="primary" @click="closeWin">关闭窗口</el-button>
      <el-button type="success" @click="sendMsgByTitle('子窗口一')">send msg</el-button>
    </el-col>
    <el-col :span="8">
      <el-button type="primary" @click="openWin('/test/window/child-window-two', '子窗口二')"
        >打开子窗口二</el-button
      >
      <el-button type="success" @click="sendMsgByTitle('子窗口二')">send msg</el-button>
    </el-col>
    <el-col :span="8"> </el-col>
  </el-row>
  <el-row> </el-row>
</template>

<style lang="less"></style>
