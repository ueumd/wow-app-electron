<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const recParentWindowMessage = () => {
  window.ipcApi?.recParentWindowMessage((res) => {
    console.log(11111, res)
  })
}

const sendMsg = (title: string) => {
  window.ipcApi?.sendMsgToParentWindow({
    title: title,
    data: {
      title,
      id: Date.now()
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
    <el-button type="success" @click="sendMsg('子窗口一')">send msg</el-button>
    <el-button type="success" @click="sendMsg('子窗口一')">send msg</el-button>
    <el-button type="success" @click="sendMsg('子窗口一')">send msg</el-button>
    <el-button type="success" @click="sendMsg('子窗口一')">send msg</el-button>
    <el-button type="success" @click="sendMsg('子窗口一')">send msg</el-button>
    <el-button type="success" @click="sendMsg('子窗口一')">send msg</el-button>
    <el-button type="success" @click="sendMsg('子窗口一')">send msg</el-button>
    <el-button type="success" @click="sendMsg('子窗口一')">send msg</el-button>
    <el-button type="success" @click="sendMsg('子窗口一')">send msg</el-button>
    <el-button type="success" @click="sendMsg('子窗口一')">send msg</el-button>
  </el-row>
</template>

<style scoped lang="scss"></style>
