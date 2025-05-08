<script setup lang="ts" name="menuMange">
import type { ColumnProps } from '@/components/ProTable/interface'
import sysMenuApi from '@/api/modules/system/menu'
import ProTable from '@/components/ProTable/index.vue'
import useDialog from '@/hooks/useDialog'
import { useMessage } from '@/hooks/useMessage'
import { CirclePlus, Delete, EditPen } from '@element-plus/icons-vue'
import { ref } from 'vue'
import EditDialog from './component/EditDialog.vue'

const message = useMessage()

const proTable = ref()

// 表格配置项
const columns: ColumnProps[] = [
  { prop: 'menuName', label: '菜单名称', align: 'left', search: { el: 'input' } },
  { prop: 'menuIcon', label: '菜单图标', width: 100 },
  { prop: 'menuPath', label: '菜单路径', minWidth: 100, search: { el: 'input' } },
  { prop: 'pagePath', label: '组件路径', minWidth: 100 },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' },
]

function getTableList(params: any) {
  return sysMenuApi.getMenuTree(params)
}

const editDialog = useDialog(EditDialog)

async function openDialog(row?: any) {
  editDialog({
    title: row ? '修改' : '新增',
    id: row?.menuId,
    onConfirm: () => {
      proTable.value?.getTableList()
    },
  })
}

// 删除用户信息
async function removeMenu(row: any) {
  if (Array.isArray(row.children) && row.children.length > 0) {
    message.warning('该菜单下面还有子菜单，请先删除子菜单')
    return false
  }
  await message.delConfirm({
    onConfirm: async () => {
      await sysMenuApi.remove(row.menuId)
      proTable.value?.getTableList()
    },
  })
}
</script>

<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="菜单列表"
      row-key="menuId"
      :indent="20"
      :columns="columns"
      :pagination="false"
      :request-api="getTableList"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDialog()">
          新增菜单
        </el-button>
      </template>
      <!-- 菜单图标 -->
      <template #menuIcon="scope">
        <Icon :icon="scope.row.menuIcon" />
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDialog(scope.row)">
          编辑
        </el-button>
        <el-button type="primary" link :icon="Delete" @click="removeMenu(scope.row)">
          删除
        </el-button>
      </template>
    </ProTable>
  </div>
</template>
