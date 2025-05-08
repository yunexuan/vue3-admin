import type { Login } from '@/api/interface'
import http from '@/api'

class SysAuthApi {
  // 用户登录
  login(params: Login.ReqLoginForm) {
    return http.post(`/auth/login`, params, { loading: false })
  }

  getUserInfo() {
    return http.get(`/auth/getUserInfo`, {}, { loading: false })
  }

  // 获取验证码
  getCaptcha() {
    return http.get('/auth/captcha')
  }

  // 获取权限
  getAuthority(params = {}) {
    return http.get(`/auth/getAuthority`, params, { loading: false })
  }

  // 用户退出登录
  logout() {
    return http.get(`/auth/logout`)
  }

  // 用户退出登录
  updatePwd(params = {}) {
    return http.post(`/auth/updatePwd`, params, { loading: true })
  }
}

const sysAuthApi = new SysAuthApi()

export default sysAuthApi
