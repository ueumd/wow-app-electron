import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import { useMenuNavApi } from '@renderer/api/sys/menu'
import { generateRoutes } from '@renderer/router'

export const routerStore = defineStore('routerStore', {
  state: () => ({
    menuRoutes: [] as RouteRecordRaw[],
    routes: [] as RouteRecordRaw[]
  }),
  actions: {
    async getMenuRoutes() {
      const { data } = await useMenuNavApi()
      const routes = generateRoutes(data)

      this.menuRoutes.push(...routes)

      return this.menuRoutes
    },
    setRoutes(routers: RouteRecordRaw[]) {
      this.routes = routers
    }
  }
})
