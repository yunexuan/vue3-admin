<script setup lang="ts">
import type { BaseDialogEmits, BaseDialogProps } from '@/hooks/useDialog'
import type { FormInstance } from 'element-plus'
import hospitalApi from '@/api/modules/system/hospital'
import regAgencyApi from '@/api/modules/system/regAgency'
import sysRoleApi from '@/api/modules/system/role'
import sysUserApi from '@/api/modules/system/user'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'

const dialogProps = defineProps<BaseDialogProps>()

const emits = defineEmits<BaseDialogEmits>()

const dialogVisible = computed<boolean>({
  get() {
    return dialogProps.visible
  },
  set(visible) {
    if (!visible) {
      emits('close')
    }
  },
})

const roleList = ref<Array<any>>([])
const hospitalList = ref<Array<any>>([])
const supervisorOrg = ref<Array<any>>([])
const ruleForm = reactive({
  userId: '',
  account: '',
  nickName: '',
  orgName: '',
  gender: '',
  email: '',
  mobile: '',
  orgId: '',
  userStatus: 0,
  userType: 1,
  roleIdList: [] as any[],
})

const orgList = computed(() => {
  if (ruleForm.userType === 3) {
    return hospitalList.value
  }
  else {
    return supervisorOrg.value
  }
})

const rules = reactive({
  account: [{ required: true, message: '必填项不能为空' }],
  mobile: [{ required: true, message: '必填项不能为空' }],
  nickName: [{ required: true, message: '必填项不能为空' }],
  userType: [{ required: true, message: '必填项不能为空' }],
  orgId: [{ required: true, message: '必填项不能为空' }],
  roleIdList: [{ required: true, message: '必填项不能为空' }],
})

async function getInfo(id: string) {
  const { data } = await sysUserApi.getById(id)
  Object.assign(ruleForm, data)
}

// 获取角色列表
async function getRoleList() {
  const { data } = await sysRoleApi.getList()
  roleList.value = data
}

// 获取医院列表
async function getHospitalList() {
  const { data } = await hospitalApi.getList()
  hospitalList.value = []
  data.forEach((item) => {
    hospitalList.value.push({
      orgId: item.hospitalId,
      orgName: item.hospitalName,
    })
  })
}

// 获取监督机构列表
async function getSupervisorList() {
  const { data } = await regAgencyApi.getList()
  supervisorOrg.value = []
  data.forEach((item) => {
    supervisorOrg.value.push({
      orgId: item.supervisionId,
      orgName: item.supervisionName,
    })
  })
}

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>()
function handleSubmit() {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid)
      return
    try {
      await sysUserApi.save(ruleForm)
      ElMessage.success({ message: `${dialogProps.title}用户成功！` })
      emits('confirm')
      dialogVisible.value = false
    }
    catch (error) {
      console.log(error)
    }
  })
}

onMounted(() => {
  getRoleList()
  getSupervisorList()
  getHospitalList()

  if (dialogProps.id) {
    getInfo(dialogProps.id)
  }
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    draggable
    :title="`${dialogProps.title}用户`"
  >
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="dialogProps.isView"
      :model="ruleForm"
      :hide-required-asterisk="dialogProps.isView"
    >
      <el-row :gutter="35">
        <el-col v-if="!ruleForm.userId" :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb-2">
          <el-form-item v-if="!ruleForm.userId" prop="account" label="登录账号">
            <el-input v-model="ruleForm.account" placeholder="登录账号" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb-2">
          <el-form-item prop="nickName" label="昵称">
            <el-input v-model="ruleForm.nickName" placeholder="昵称" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb-2">
          <el-form-item prop="mobile" label="手机号">
            <el-input v-model="ruleForm.mobile" placeholder="手机号" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb-2">
          <el-form-item prop="email" label="邮箱">
            <el-input v-model="ruleForm.email" placeholder="邮箱" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb-2">
          <el-form-item prop="userType" label="用户类型">
            <el-radio-group v-model="ruleForm.userType" @change="ruleForm.orgId = ''">
              <el-radio-button label="监管用户" :value="1" />
              <el-radio-button label="监督员" :value="2" />
              <el-radio-button label="医院用户" :value="3" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb-2">
          <el-form-item prop="orgId" label="所属机构">
            <el-select v-model="ruleForm.orgId" placeholder="所属机构" clearable filterable>
              <el-option v-for="item in orgList" :key="item.orgId" :value="item.orgId" :label="item.orgName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-2">
          <el-form-item prop="roleIdList" label="所属角色">
            <el-select v-model="ruleForm.roleIdList" multiple placeholder="所属角色" style="width: 100%">
              <el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName" :value="role.roleId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button v-show="!dialogProps.isView" type="primary" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>
