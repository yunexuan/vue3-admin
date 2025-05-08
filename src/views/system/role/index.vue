<template>
  <div class="table-box">
    <ProTable ref="proTable" title="角色列表" :indent="20" :columns="columns" :request-api="getTableList">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="i-ep-circle-plus" @click="handleEdit()">新增角色</el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link icon="i-ep-edit-pen" @click="handleEdit(scope.row)"> 编辑 </el-button>
        <el-button type="primary" link icon="i-ep-delete" @click="removeMenu(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import EditDialog from "./component/EditDialog.vue";
import { useMessage } from "@/hooks/useMessage";
import sysRoleApi from "@/api/modules/system/role";
import useDialog from "@/hooks/useDialog";

const message = useMessage();

const proTable = ref();

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "roleName", label: "角色名称", search: { el: "input" } },
  { prop: "roleCode", label: "角色标识", search: { el: "input" } },
  { prop: "createDate", label: "创建时间" },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];

const getTableList = (params: any) => {
  return sysRoleApi.getPage(params);
};

const editDialog = useDialog(EditDialog);

const handleEdit = async (row?: any) => {
  editDialog({
    title: row ? "修改" : "新增",
    id: row?.roleId,
    onConfirm: () => {
      proTable.value?.getTableList();
    }
  });
};

// 删除用户信息
const removeMenu = async (row: any) => {
  await message.delConfirm({
    onConfirm: async () => {
      await sysRoleApi.remove(row.roleId);
      proTable.value?.getTableList();
    }
  });
};
</script>
