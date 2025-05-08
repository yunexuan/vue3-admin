<script setup lang="ts" name="DictItemDrawer">
import type { ColumnProps, ProTableInstance } from '@/components/ProTable/interface'
import { dictDataApi } from '@/api/modules/system/dict'
import ProTable from '@/components/ProTable/index.vue'
import useDialog from '@/hooks/useDialog'
import { useMessage } from '@/hooks/useMessage'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'

import EditDialog from './component/EditDialog.vue'

const props = defineProps<{
  visible: boolean
  isView?: boolean
  title: string
  id?: any
}>()

const emits = defineEmits<{
  (event: 'close'): void
  (event: 'confirm'): void
}>()

const message = useMessage()

const drawerVisible = computed<boolean>({
  get() {
    return props.visible
  },
  set(visible) {
    if (!visible) {
      emits('close')
    }
  },
})
const proTable = ref<ProTableInstance>()
const editDialog = useDialog(EditDialog)
async function handleEdit(row?: any) {
  editDialog({
    title: row ? '修改' : '新增',
    dictTypeId: props.id,
    dictDataId: row?.dictDataId,
    onConfirm: () => {
      console.log('dsaf')
      proTable.value?.getTableList()
    },
  })
}

const initParam = reactive({ dictTypeId: '' })

// 表格配置项
const columns: ColumnProps[] = [
  { prop: 'dictLabel', label: '字典项名称', search: { el: 'input' } },
  { prop: 'dictValue', label: '字典项傎', search: { el: 'input' } },
  { prop: 'sortNo', label: '字典顺序' },
  { prop: 'colorType', label: '字典颜色' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' },
]

function getTableList(params: any) {
  return dictDataApi.getPage(params)
}

// 删除用户信息
async function removeRow(row: any) {
  await message.delConfirm({
    onConfirm: async () => {
      await dictDataApi.remove(row.dictDataId)
      proTable.value?.getTableList()
    },
  })
}

onMounted(() => {
  initParam.dictTypeId = props.id
  nextTick(() => {
    proTable.value?.getTableList()
  })
})
</script>

<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="70%" :title="`${title}字典项`">
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="字典项列表"
        :indent="20"
        :columns="columns"
        :request-auto="false"
        :request-api="getTableList"
        :init-param="initParam"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" icon="i-ep-circle-plus" @click="handleEdit()">
            新增字典项
          </el-button>
        </template>

        <template #colorType="scope">
          <el-tag v-if="scope.row.colorType === 'success'" type="success">
            {{ scope.row.dictLabel }}
          </el-tag>
          <el-tag v-else-if="scope.row.colorType === 'warning'" type="warning">
            {{ scope.row.dictLabel }}
          </el-tag>
          <el-tag v-else-if="scope.row.colorType === 'danger'" type="danger">
            {{ scope.row.dictLabel }}
          </el-tag>
          <el-tag v-else-if="scope.row.colorType === 'info'" type="info">
            {{ scope.row.dictLabel }}
          </el-tag>
          <el-tag v-else>
            {{ scope.row.dictLabel }}
          </el-tag>
        </template>
        <!-- 菜单操作 -->
        <template #operation="scope">
          <el-button type="primary" link icon="i-ep-edit-pen" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="primary" link icon="i-ep-delete" @click="removeRow(scope.row)">
            删除
          </el-button>
        </template>
      </ProTable>
    </div>
  </el-drawer>
</template>
