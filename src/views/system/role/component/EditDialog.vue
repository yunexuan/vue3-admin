<script setup lang="ts" name="MenuDrawer">
import type { BaseDialogEmits, BaseDialogProps } from '@/hooks/useDialog'
import type { FormInstance } from 'element-plus'
import sysMenuApi from '@/api/modules/system/menu'
import sysRoleApi from '@/api/modules/system/role'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'

const dialogProps = defineProps<BaseDialogProps>()

const emits = defineEmits<BaseDialogEmits>()

const menuProps = {
  emitPath: false,
  checkStrictly: true,
  value: 'menuId',
  label: 'menuName',
}

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

// const orgList = ref<Array<any>>([]);
const menuList = ref<Array<any>>([])
const menuListRef = ref()
const ruleForm = reactive({
  roleId: '',
  roleName: '',
  applyId: '',
  menuIdList: [] as any[],
  roleCode: '',
  roleDesc: '',
})

const rules = reactive({
  roleName: [{ required: true, message: '必填项不能为空' }],
  roleCode: [{ required: true, message: '必填项不能为空' }],
})

async function getInfo(id: string) {
  const { data } = await sysRoleApi.getById(id)
  Object.assign(ruleForm, data)
  await getMenuList()
  ruleForm.menuIdList.forEach(item => menuListRef.value.setChecked(item, true))
}

// 获取菜单列表
async function getMenuList() {
  const params = {
    applyId: ruleForm.applyId,
  }
  const { data } = await sysMenuApi.getMenuTree(params)
  menuList.value = data
}

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>()
function handleSubmit() {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid)
      return
    try {
      ruleForm.menuIdList = [...menuListRef.value.getHalfCheckedKeys(), ...menuListRef.value.getCheckedKeys()]
      await sysRoleApi.save(ruleForm)
      ElMessage.success({ message: `${dialogProps.title}角色成功！` })
      emits('confirm')
      dialogVisible.value = false
    }
    catch (error) {
      console.log(error)
    }
  })
}

onMounted(() => {
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
    :title="`${dialogProps.title}角色`"
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
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb-2">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="ruleForm.roleName" placeholder="请输入角色名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb-2">
          <el-form-item label="角色标识" prop="roleCode">
            <template #label>
              <el-tooltip effect="dark" content="用于 `router/route.ts` meta.roles" placement="top-start">
                <span>角色标识</span>
              </el-tooltip>
            </template>
            <el-input v-model="ruleForm.roleCode" placeholder="请输入角色标识" clearable />
          </el-form-item>
        </el-col>
        <!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb-2">
          <el-form-item label="所属机构" prop="orgId">
            <el-select v-model="ruleForm.orgId" placeholder="请选择所属机构" clearable>
              <el-option v-for="item in orgList" :key="item.orgId" :label="item.orgName" :value="item.orgId"></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-2">
          <el-form-item label="角色描述">
            <el-input v-model="ruleForm.roleDesc" type="textarea" placeholder="请输入角色描述" maxlength="150" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-2">
          <el-form-item label="菜单权限">
            <el-tree
              ref="menuListRef"
              :data="menuList"
              :props="menuProps"
              :default-checked-keys="[112, 113]"
              node-key="menuId"
              show-checkbox
              class="w-full"
            />
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
