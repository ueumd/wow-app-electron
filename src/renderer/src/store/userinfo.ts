import { defineStore } from 'pinia'

export const useUserinfo = defineStore('userinfo', {
  state() {
    return {
      id: '',
      username: '',
      password: '',
      nickname: '',
      token: '',
      refreshToken: ''
    }
  },
  actions: {
    dataFill(state) {
      this.$state = { ...this.$state, ...state }
    },
    removeToken() {
      this.token = ''
      this.refreshToken = ''
    },
    setToken(token: string, type: 'token' | 'refreshToken') {
      this[type] = token
    },
    getToken(type: 'auth' | 'refresh' = 'auth') {
      return type === 'auth' ? this.token : this.refreshToken
    },
    getUserinfo() {
      return this
    },
    resetInfo() {
      this.$state = {
        id: '',
        username: '',
        password: '',
        nickname: '',
        token: '',
        refreshToken: ''
      }
    }
  }
})
