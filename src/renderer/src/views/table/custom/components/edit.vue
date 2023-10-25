<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import type { FormInstance, FormRules } from 'element-plus'
import _ from 'lodash'

const props = defineProps({
	itemData: {
		type: Object,
		default() {
			return {}
		}
	}
})

const emits = defineEmits(['confirm'])

const loading = ref(false)

const form = ref({}) as any
const formRef = ref<FormInstance>()

const rules = reactive<FormRules>({
	name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
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

onMounted(() => {
	form.value = _.cloneDeep(props.itemData)
})
</script>
<template>
	<div>
		<el-form ref="formRef" label-width="90px" label-position="left" :rules="rules" :model="form">
			<el-form-item label="姓名:" prop="name">
				<el-input v-model.trim="form.name" maxlength="50" class="input-box" placeholder="请输入商品名称"></el-input>
			</el-form-item>
			<el-form-item label="金额:" prop="amount">
				<el-input-number v-model="form.amount" :min="0" :controls="false" :precision="2"></el-input-number>
			</el-form-item>
			<el-form-item>
				<el-button class="darkBtn" :loading="loading" type="primary" @click="confirm()">确认</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<style scoped lang="scss"></style>
