<script setup lang="ts" name="menuMange">
import type { ColumnProps } from '@/components/ProTable/interface'
import sysRoleApi from '@/api/modules/system/role'
import ProTable from '@/components/ProTable/index.vue'
import useDialog from '@/hooks/useDialog'
import { useMessage } from '@/hooks/useMessage'
import { ref } from 'vue'
import EditDialog from './component/EditDialog.vue'

const message = useMessage()

const proTable = ref()

// 表格配置项
const columns: ColumnProps[] = [
  { prop: 'roleName', label: '角色名称', search: { el: 'input' } },
  { prop: 'roleCode', label: '角色标识', search: { el: 'input' } },
  { prop: 'createDate', label: '创建时间' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' },
]

function getTableList(params: any) {
  return sysRoleApi.getPage(params)
}

const editDialog = useDialog(EditDialog)

async function handleEdit(row?: any) {
  editDialog({
    title: row ? '修改' : '新增',
    id: row?.roleId,
    onConfirm: () => {
      proTable.value?.getTableList()
    },
  })
}

// 删除用户信息
async function removeMenu(row: any) {
  await message.delConfirm({
    onConfirm: async () => {
      await sysRoleApi.remove(row.roleId)
      proTable.value?.getTableList()
    },
  })
}
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" title="角色列表" :indent="20" :columns="columns" :request-api="getTableList">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="i-ep-circle-plus" @click="handleEdit()">
          新增角色
        </el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link icon="i-ep-edit-pen" @click="handleEdit(scope.row)">
          编辑
        </el-button>
        <el-button type="primary" link icon="i-ep-delete" @click="removeMenu(scope.row)">
          删除
        </el-button>
      </template>
    </ProTable>
  </div>
</template>
