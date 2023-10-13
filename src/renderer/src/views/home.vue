<script setup lang="ts">
import { onMounted } from 'vue'

const test = () => {
  console.log(window.nodeFseApi)
  window.nodeFseApi.remove('/xxff/ff')
}

const openWin = (url, title) => {
  console.log(url, title)
}
const openWin2 = (url, title) => {
  console.log(url, title)
}

const closeWin = () => {}
const sendMsgByTitle = (title) => {
  console.log(title)
}

onMounted(() => {
  test()
})
</script>

<template>
  <el-row class="mg">
    <el-col :span="8">
      <el-button type="primary" @click="openWin('/child-window-one', '子窗口一')"
        >打开子窗口一</el-button
      >
      <el-button type="primary" @click="closeWin">关闭窗口</el-button>
      <el-button type="success" @click="sendMsgByTitle('子窗口一')">send msg</el-button>
    </el-col>
    <el-col :span="8">
      <el-button type="primary" @click="openWin2('/child-window-two', '子窗口二')"
        >打开子窗口二</el-button
      >
      <el-button type="success" @click="sendMsgByTitle('子窗口二')">send msg</el-button>
    </el-col>
    <el-col :span="8"> </el-col>
  </el-row>
</template>

<style lang="less"></style>
