<script setup lang="ts" name="MenuDrawer">
import type { FormInstance } from 'element-plus'
import { dictTypeApi } from '@/api/modules/system/dict'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'

const dialogProps = defineProps<{
  visible: boolean
  isView?: boolean
  title: string
  id?: string
}>()

const emits = defineEmits<{
  (event: 'close'): void
  (event: 'confirm'): void
}>()

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

const ruleForm = reactive({
  dictTypeId: '',
  dictType: '',
  dictName: '',
  remark: '',
  sortNo: 0,
})

const rules = reactive({
  dictType: [{ required: true, message: '必填项不能为空' }],
  dictName: [{ required: true, message: '必填项不能为空' }],
})

async function getInfo(id: string) {
  const { data } = await dictTypeApi.getById(id)
  Object.assign(ruleForm, data)
}
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>()
function handleSubmit() {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid)
      return
    try {
      await dictTypeApi.save(ruleForm)
      ElMessage.success({ message: `${dialogProps.title}成功！` })
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
    :title="`${dialogProps.title}字典`"
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
          <el-form-item label="字典名称" prop="dictName">
            <el-input v-model="ruleForm.dictName" placeholder="请输入字典名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb-2">
          <el-form-item label="字典标识" prop="dictType">
            <el-input v-model="ruleForm.dictType" placeholder="请输入字典标识" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-2">
          <el-form-item label="字典备注">
            <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入字典备注" maxlength="150" />
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
