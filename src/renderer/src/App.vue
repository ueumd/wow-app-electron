<template>
  <router-view />
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { setWindowTitle } from '@/utils/common'
import { watch } from 'vue'
const route = useRoute()
watch(
  () => route.path,
  () => {
    setWindowTitle()
  }
)
</script>
