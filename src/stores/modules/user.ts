import type { UserState } from '@/stores/interface'
import piniaPersistConfig from '@/stores/helper/persist'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('geeker-user', {
  state: (): UserState => ({
    token: {
      tokenName: '',
      tokenValue: '',
    },
    userInfo: {
      userId: '',
      orgId: '',
      nickName: '',
      headImg: '',
    },
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: UserState['token']) {
      Object.assign(this.token, token)
    },
    clearToken() {
      this.token = {
        tokenName: '',
        tokenValue: '',
      }
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState['userInfo']) {
      this.userInfo = userInfo
    },
  },
  persist: piniaPersistConfig('geeker-user'),
})
