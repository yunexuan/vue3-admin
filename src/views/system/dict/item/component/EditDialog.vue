<script setup lang="ts" name="MenuDrawer">
import type { BaseDialogEmits, BaseDialogProps } from '@/hooks/useDialog'
import type { FormInstance } from 'element-plus'
import { dictDataApi } from '@/api/modules/system/dict'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'

const dialogProps = defineProps<BaseDialogProps & {
  dictTypeId: string
  dictDataId?: string
}>()

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

const ruleForm = reactive({
  dictDataId: '',
  dictTypeId: '',
  dictLabel: '',
  dictValue: '',
  remark: '',
  colorType: 'primary',
  sortNo: 0,
})

const rules = reactive({
  dictLabel: [{ required: true, message: '必填项不能为空' }],
  dictValue: [{ required: true, message: '必填项不能为空' }],
})

async function getInfo(id: string) {
  const { data } = await dictDataApi.getById(id)
  Object.assign(ruleForm, data)
}
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>()
function handleSubmit() {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid)
      return
    try {
      ruleForm.dictTypeId = dialogProps.dictTypeId
      await dictDataApi.save(ruleForm)
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
  if (dialogProps.dictDataId) {
    getInfo(dialogProps.dictDataId)
  }
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    draggable
    :title="`${dialogProps.title}字典项`"
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
          <el-form-item label="字典项名称" prop="dictLabel">
            <el-input v-model="ruleForm.dictLabel" placeholder="请输入字典项名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb-2">
          <el-form-item label="字典项值" prop="dictValue">
            <el-input v-model="ruleForm.dictValue" placeholder="请输入字典项值" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb-2">
          <el-form-item label="字典顺序" prop="sortNo">
            <el-input-number v-model="ruleForm.sortNo" placeholder="请输入字典顺序" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb-2">
          <el-form-item label="颜色类型" prop="colorType">
            <el-select v-model="ruleForm.colorType">
              <el-option label="primary" value="">
                <el-tag>primary</el-tag>
              </el-option>
              <el-option label="success" value="success">
                <el-tag type="success">
                  success
                </el-tag>
              </el-option>
              <el-option label="warning" value="warning">
                <el-tag type="warning">
                  warning
                </el-tag>
              </el-option>
              <el-option label="danger" value="danger">
                <el-tag type="danger">
                  danger
                </el-tag>
              </el-option>
              <el-option label="info" value="info">
                <el-tag type="info">
                  info
                </el-tag>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-2">
          <el-form-item label="字典项备注">
            <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入字典项备注" maxlength="150" />
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
