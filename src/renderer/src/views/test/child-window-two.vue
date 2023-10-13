<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const state = reactive({
  parentTitle: '',
})
const recParentWindowMessage = () => {
  window.ipcOn.recParentWindowMessage((res) => {
    console.log('parent window message: ', res)
    state.parentTitle = res.data.parentTitle
  })
}

const sendMsg = (title: string) => {
  window.ipcSend.sendMsgToParentWindow({
    title: state.parentTitle,
    data: {
      title,
      time: Date.now(),
    },
  })
}

onMounted(() => {
  console.log('current window id: ', route.query.winId)
  recParentWindowMessage()
})
</script>

<template>
  <el-row class="mg">
    <el-button type="success" @click="sendMsg('子窗口二')">send msg</el-button>
  </el-row>
</template>

<style scoped lang="scss"></style>
