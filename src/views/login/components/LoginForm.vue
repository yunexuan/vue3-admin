<script setup lang="ts">
// import { getTimeState } from "@/utils";
import type { Login } from '@/api/interface'
import type { ElForm } from 'element-plus'
// import md5 from "md5";
import sysAuthApi from '@/api/modules/system/auth'
import { HOME_URL } from '@/config'
import { initDynamicRouter } from '@/routers/modules/dynamicRouter'
import { useKeepAliveStore } from '@/stores/modules/keepAlive'
import { useTabsStore } from '@/stores/modules/tabs'
import { useUserStore } from '@/stores/modules/user'
import { CircleClose, UserFilled } from '@element-plus/icons-vue'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const tabsStore = useTabsStore()
const keepAliveStore = useKeepAliveStore()

type FormInstance = InstanceType<typeof ElForm>
const loginFormRef = ref<FormInstance>()
const loginRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})

const loading = ref(false)
const loginForm = reactive<Login.ReqLoginForm>({
  username: 'sp_admin',
  password: 'twx@admin123321',
  captcha: '',
  key: '',
})

// login
function login(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  formEl.validate(async (valid) => {
    if (!valid)
      return
    loading.value = true
    try {
      // 1.执行登录接口
      const { data } = await sysAuthApi.login(loginForm)
      userStore.setToken(data)
      // 2.添加动态路由
      await initDynamicRouter()

      // 3.清空 tabs、keepAlive 数据
      tabsStore.setTabs([])
      keepAliveStore.setKeepAliveName([])

      // 4.跳转到首页
      router.push(HOME_URL)
    }
    catch (e) {
      console.warn(e)
      getCaptcha()
    }
    finally {
      loading.value = false
    }
  })
}

// resetForm
function resetForm(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  formEl.resetFields()
}

const captchaBase64 = ref('')
async function getCaptcha() {
  const { data } = await sysAuthApi.getCaptcha()
  loginForm.key = data.key
  captchaBase64.value = `data:image/png;base64,${data.captcha}`
}

onMounted(() => {
  getCaptcha()
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    if (e.code === 'Enter' || e.code === 'enter' || e.code === 'NumpadEnter') {
      if (loading.value)
        return
      login(loginFormRef.value)
    }
  }
})

onBeforeUnmount(() => {
  document.onkeydown = null
})
</script>

<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="请输入账号">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password autocomplete="new-password">
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="captcha">
      <div class="login-captcha-row">
        <el-input v-model="loginForm.captcha" placeholder="验证码">
          <template #prefix>
            <el-icon class="el-input__icon">
              <lock />
            </el-icon>
          </template>
        </el-input>
        <div class="login-captcha-code" @click="getCaptcha">
          <img :src="captchaBase64" alt="">
        </div>
      </div>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button :icon="CircleClose" round size="large" @click="resetForm(loginFormRef)">
      重置
    </el-button>
    <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading" @click="login(loginFormRef)">
      登录
    </el-button>
  </div>
</template>

<style scoped lang="scss">
@import '../index';
</style>
