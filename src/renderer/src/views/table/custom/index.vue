<script setup lang="ts">
import { onMounted, reactive, ref, nextTick } from 'vue'
import { useTable } from '@/hooks'
import { getTablePersonList } from '@/api/table'
import { ElMessageBox, ElTable } from 'element-plus'
import { testStore, unique } from '@/utils/common'
import Sortable from 'sortablejs'
import _ from 'lodash'

import Edit from '@/views/table/custom/components/edit.vue'

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const selectedTable = ref<InstanceType<typeof ElTable>>()

const centerDialogVisible = ref(false)

const query = reactive({
	id: '',
	limit: 10,
	name: '',
	page: 1,
	asc: false
})

const state = reactive({
	selectedList: [],
	list: [] as Array<any>,
	itemData: null as any
})

// useTable
const { loading, tableData, getTableData, pagination } = useTable<any>(_ => getTablePersonList(query), {
	immediate: false,
	formatResult: data => data.map(i => ({ ...i, isEdit: false }))
})

/**
 * 排序
 * @param order
 */
const sortChange = ({ order }) => {
	query.asc = order === 'ascending'
	getTableData()
}

// 搜索
const handleSearch = () => {
	query.page = 1
	getTableData()
}

/** 分页 */
const handleCurrentChange = curPage => {
	query.page = curPage
	getTableData()
}

const handleSizeChange = curSize => {
	query.limit = curSize
	getTableData()
}
/** 分页 end */

// 删除
const handleDelete = item => {
	ElMessageBox.confirm(`是否删除 ${item.name} 吗`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		getTableData()
	})
}

// 批量删除
const batchDelete = () => {
	ElMessageBox.confirm(`否删除选中 ${state.selectedList.length} 条数据吗`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		const ids = state.selectedList.map((it: any) => it.id)
		console.log(ids)
	})
}

// 编辑
const handleEdit = item => {
	centerDialogVisible.value = true
	state.itemData = item
	console.log(item)
}

// 添加
const onAdd = () => {
	centerDialogVisible.value = true
	state.itemData = {}
	testStore()
}

const close = () => {
	centerDialogVisible.value = false
	state.itemData = null
}

/**
 * 当前数据
 * @param selectionf
 * @param row
 */
const select = (selection, row) => {
	console.log(row)
	state.selectedList = selection

	const resList = state.list.filter(it => {
		return it.id !== row.id
	})

	if (resList.length === state.list.length) {
		state.list.push(row)
	} else {
		state.list = [...resList]
	}
	toBottom()
}

/**
 * 表格全选
 */
const selectAll = selection => {
	console.log(selection)
	// console.log(multipleTableRef?.value.store.states.isAllSelected.value)
	if (multipleTableRef?.value && multipleTableRef?.value.store.states) {
		const selectedData = multipleTableRef?.value.store.states.data.value
		if (multipleTableRef?.value.store.states.isAllSelected.value) {
			// 选中
			console.log(true, selectedData)
			state.list = unique([...state.list, ...selectedData], 'id')
			toBottom()
		} else {
			// 取消
			selectedData.forEach(it => {
				state.list = state.list.filter(cur => cur.id !== it.id)
			})
		}
	}
}

const handleDeleteBySelected = item => {
	state.list = state.list.filter(it => it.id !== item.id)
	checkTableDataSelected()
}

/**
 * 检测左边表格中的数据是否选中
 */
const checkTableDataSelected = () => {
	if (multipleTableRef.value) {
		nextTick(() => {
			multipleTableRef.value?.clearSelection()
			tableData.value.forEach(item => {
				const result = state.list.find(row => row.id == item.id)
				if (result) {
					multipleTableRef.value?.toggleRowSelection(item, true)
				}
			})
		})
	}
}

const confirm = val => {
	console.log(val)
	getTableData()
	close()
}

// 行拖拽排序
const rowDrop = () => {
	const tbody = selectedTable.value?.$el.querySelector('.el-table__body-wrapper tbody')
	Sortable.create(tbody, {
		onEnd(evt: any) {
			// console.log(evt.newIndex, evt.oldIndex)
			const copyList = _.cloneDeep(state.list)
			const targetRow = copyList.splice(evt.oldIndex, 1)[0]
			copyList.splice(evt.newIndex, 0, targetRow)

			state.list = []
			nextTick(() => {
				state.list = copyList
				console.log(state.list.map(it => it.name))
			})
		}
	})
}

const selectedTableBoxRef = ref<InstanceType<typeof HTMLDivElement>>()

// 滚动到底部
const toBottom = () => {
	nextTick(() => {
		selectedTableBoxRef.value?.scrollTo({ top: selectedTableBoxRef.value?.scrollHeight, behavior: 'smooth' })
	})
}

onMounted(() => {
	getTableData()
	nextTick(() => {
		rowDrop()
	})
})
</script>

<template>
	<el-row class="mb-1">
		<el-col :span="12">
			<el-button type="primary" @click="onAdd()">添加</el-button>
			<el-button type="danger" @click="batchDelete()">删除</el-button>
		</el-col>
		<el-col :span="12" align="right">
			<el-input v-model.trim="query.name" clearable placeholder="搜索名称" style="width: 200px" class="mr-1" @change="getTableData"></el-input>
			<el-button type="primary" class="darkBtn" @click="handleSearch">搜索</el-button>
		</el-col>
	</el-row>
	<el-row :gutter="20">
		<el-col :span="16">
			<el-table
				ref="multipleTableRef"
				v-loading="loading"
				:data="tableData"
				style="width: 100%"
				stripe
				:default-sort="{ prop: 'createTime', order: 'descending' }"
				@sort-change="sortChange"
				@select="select"
				@selectAll="selectAll"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column label="序号" type="index" width="60" align="center" />
				<el-table-column label="头像" prop="avatar" align="center" class-name="img-column" width="90">
					<template #default="scope">
						<el-image
							style="width: 30px; height: 30px"
							:src="scope.row.avatar"
							fit="fill"
							preview-teleported
							:preview-src-list="[scope.row.avatar]"
						></el-image>
					</template>
				</el-table-column>
				<el-table-column label="姓名" prop="name" width="100" />
				<el-table-column label="地址" prop="address" align="left" show-overflow-tooltip />
				<el-table-column label="创建时间" prop="createTime" width="160" align="center" sortable="custom" :sort-orders="['descending', 'ascending']" />
				<el-table-column label="状态" prop="status" align="center" width="100" />
				<el-table-column align="center" label="操作" width="160">
					<template #default="scope">
						<el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
						<el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				v-model:current-page="query.page"
				v-model:page-size="query.limit"
				background
				:page-sizes="[10, 20, 30, 40]"
				layout="total, sizes, prev, pager, next, jumper"
				:total="pagination.total"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</el-col>
		<el-col :span="8">
			<div class="selectedTable" ref="selectedTableBoxRef">
				<el-table ref="selectedTable" :data="state.list" stripe :default-sort="{ prop: 'createTime', order: 'descending' }">
					<el-table-column label="序号" type="index" width="60" align="center" />
					<el-table-column label="姓名" prop="name" />
					<el-table-column label="状态" prop="status" align="center" width="100" />
					<el-table-column align="center" label="操作" width="90">
						<template #default="scope">
							<el-button size="small" type="danger" @click="handleDeleteBySelected(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-col>
	</el-row>

	<el-dialog v-model="centerDialogVisible" :title="state.itemData?.name || '添加'" width="30%" destroy-on-close center draggable @close="close">
		<Edit @confirm="confirm" :item-data="state.itemData" />
	</el-dialog>
</template>

<style scoped lang="scss">
.selectedTable {
	height: calc(100vh - 120px);
	overflow-y: auto;
	background: white;
	border: 1px solid #dddddd;
}
</style>
