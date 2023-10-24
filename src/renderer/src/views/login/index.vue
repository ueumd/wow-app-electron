<script setup lang="ts">
import { ref, reactive } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import store from '@/store'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import constant from '@/utils/constant'
const { t } = useI18n()

const router = useRouter()
const loginFormRef = ref()

const loginForm = reactive({
  username: constant.env.PROD ? '' : 'admin',
  password: constant.env.PROD ? '' : 'admin'
})

const loginRules = ref({
  username: [{ required: true, message: t('required'), trigger: 'blur' }],
  password: [{ required: true, message: t('required'), trigger: 'blur' }]
})

const onLogin = () => {
  loginFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    // 用户登录
    return store.userStore
      .accountLoginAction(loginForm)
      .then(() => {
        router.push({ path: '/home' })
      })
      .catch((err) => {
        console.error(err)
      })
  })
}
</script>
<template>
  <div class="page-wrap">
    <el-form
      class="login-wrap"
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      @keyup.enter="onLogin"
    >
      <div class="login-title">登录</div>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" :prefix-icon="User" placeholder="帐号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          :prefix-icon="Lock"
          show-password
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item class="login-button">
        <el-button type="primary" @click="onLogin()">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
.login-wrap {
  width: 500px;
  padding: 20px 40px;
  border-radius: 10px;
  background: white;
  box-sizing: border-box;
  box-shadow: 0 14px 24px rgba(0, 0, 0, 0.2);
}
.login-title {
  display: flex;
  justify-content: center;
  margin-bottom: 35px;
  font-size: 24px;
  color: #444;
  letter-spacing: 4px;
}
.login-captcha {
  :deep(.el-input) {
    width: 200px;
  }
}
.login-captcha img {
  width: 150px;
  height: 40px;
  margin: 5px 0 0 10px;
  cursor: pointer;
}
.login-button {
  :deep(.el-button--primary) {
    margin-top: 10px;
    width: 100%;
    height: 45px;
    font-size: 18px;
    letter-spacing: 8px;
  }
}
</style>
