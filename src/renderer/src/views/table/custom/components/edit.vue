<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import type { FormInstance, FormRules } from 'element-plus'
import _ from 'lodash'

const emits = defineEmits(['confirm', 'close'])

const centerDialogVisible = ref(false)

const loading = ref(false)

const form = ref({
	name: '',
	amount: 0,
	address: ''
}) as any

const formRef = ref<FormInstance>()
const title = ref('')

const rules = reactive<FormRules>({
	name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
	amount: [{ required: true, message: '请输入金额', trigger: 'blur' }]
})

const confirm = () => {
	formRef.value?.validate(valid => {
		if (!valid) return
		loading.value = true
		setTimeout(() => {
			loading.value = false
			emits('confirm', true)
		}, 1000)
	})
}

const show = item => {
	centerDialogVisible.value = true
	if (item) {
		title.value = item.name
		form.value = _.cloneDeep(item)
	}
}

const close = () => {
	centerDialogVisible.value = false
	form.value.name = ''
	form.value.amount = 0
	form.value.address = ''
	emits('close')
}

defineExpose({ show, close })

onMounted(() => {
	console.log('edit')
})
</script>
<template>
	<el-dialog v-model="centerDialogVisible" :title="title ? title + ' - 编辑' : '添加'" width="30%" destroy-on-close center draggable @close="close">
		<el-form ref="formRef" label-width="80px" label-position="right" :rules="rules" :model="form">
			<el-form-item label="姓名:" prop="name">
				<el-input v-model.trim="form.name" maxlength="50" class="input-box" placeholder="请输入名称"></el-input>
			</el-form-item>
			<el-form-item label="金额:" prop="amount">
				<el-input-number v-model="form.amount" :min="0" :controls="true" :precision="2"></el-input-number>
			</el-form-item>
			<el-form-item label="地址:" prop="address">
				<el-input v-model.trim="form.address" maxlength="50" class="input-box" placeholder="地址"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button class="darkBtn" :loading="loading" type="primary" @click="confirm()">确认</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<style scoped lang="scss"></style>
