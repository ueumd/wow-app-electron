<script setup lang="ts">
import MenuItem from './components/MenuItem.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import store from '@renderer/store'
const route = useRoute()
const defaultActive = computed(() => {
  const { path } = route
  return path
})
</script>
<template>
  <div class="wrap">
    <el-container>
      <el-aside>
        <el-menu
          :default-active="defaultActive"
          background-color="transparent"
          :collapse-transition="false"
          mode="horizontal"
        >
          <menu-item
            v-for="menu in store.routerStore.menuRoutes"
            :key="menu.path"
            :menu="menu"
          ></menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view v-slot="{ Component, route }">
          <template v-if="Component">
            <keep-alive v-if="route.meta.keepAlive">
              <component :is="Component" :key="route.path" />
            </keep-alive>
            <!-- 不缓存-->
            <component :is="Component" v-else :key="route.path" />
          </template>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>
<style scoped lang="scss">
.wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-header {
    background: $bg-color-app;
    padding: 0;
    padding-left: 10px;
    height: 50px;
  }
  .el-container {
    flex-grow: 1;
    padding: 0 10px 10px 10px;
    box-sizing: border-box;
    overflow: auto;
    .el-aside {
      width: 120px;
      margin-right: 10px;
      background: $bg-color-module;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .el-main {
      background: #333;
      padding: 0px;
      border-radius: 4px;
      box-sizing: border-box;
    }
  }
}
</style>
