import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import { useMenuNavApi } from '@/api/sys/menu'
import { generateRoutes } from '@/router'

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
