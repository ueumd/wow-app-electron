<script setup lang="ts">
import MenuItem from './components/MenuItem.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import store from '@/store'
const route = useRoute()
const defaultActive = computed(() => {
	const { path } = route
	return path
})
</script>
<template>
	<el-container class="layout-container layout-vertical">
		<el-aside class="layout-sidebar">
			<el-menu :default-active="defaultActive" :collapse="false" background-color="transparent" :collapse-transition="false" mode="vertical">
				<menu-item v-for="menu in store.routerStore.menuRoutes" :key="menu.path" :menu="menu"></menu-item>
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
</template>
<style scoped lang="scss">
.navbar-container {
	height: var(--theme-header-height);
	display: flex;
	align-items: center;
	background: var(--theme-header-bg-color);
	border-bottom: 1px solid var(--theme-border-color-light);
	color: var(--theme-header-text-color);
	::v-deep(.svg-icon) {
		align-items: center;
		cursor: pointer;
		height: var(--theme-header-height);
		line-height: var(--theme-header-height);
		padding: 0 12px;
		svg {
			color: var(--theme-header-text-color) !important;
			font-size: 16px;
		}
		&:hover {
			background: var(--theme-header-hover-color);
		}
	}
}
.wrap {
	height: 100%;
	display: flex;
	flex-direction: column;
	.el-header {
		background: #eeeeee;
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
			background: blue;
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
