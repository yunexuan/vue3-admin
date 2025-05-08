<template>
  <div class="table-box">
    <ProTable ref="proTable" title="字典列表" :indent="20" :columns="columns" :request-api="getTableList">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="i-ep-circle-plus" @click="openDialog()">新增字典</el-button>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="i-ep-setting" @click="showDictItem(scope.row)"> 配置 </el-button>
        <el-button type="primary" link icon="i-ep-edit-pen" @click="openDialog(scope.row)"> 编辑 </el-button>
        <el-button type="primary" link icon="i-ep-delete" @click="removeRow(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import EditDialog from "./component/EditDialog.vue";
import DictItemDrawer from "./item/index.vue";
import { useMessage } from "@/hooks/useMessage";
import { dictTypeApi } from "@/api/modules/system/dict";
import useDialog from "@/hooks/useDialog";

const message = useMessage();

const proTable = ref();

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "dictName", label: "字典名称", search: { el: "input" } },
  { prop: "dictType", label: "字典标识", search: { el: "input" } },
  { prop: "createDate", label: "创建时间" },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];

const getTableList = (params: any) => {
  return dictTypeApi.getPage(params);
};

// 编辑弹窗
const editDialog = useDialog(EditDialog);

const openDialog = async (row?: any) => {
  editDialog({
    title: row ? "修改" : "新增",
    id: row?.dictTypeId,
    onConfirm: () => {
      proTable.value?.getTableList();
    }
  });
};

// 字典子项弹窗
const dictItemDrawer = useDialog(DictItemDrawer);

const showDictItem = async (row: any) => {
  dictItemDrawer({
    title: row.dictName,
    id: row?.dictTypeId
  });
};

// 删除用户信息
const removeRow = async (row: any) => {
  await message.delConfirm({
    onConfirm: async () => {
      await dictTypeApi.remove(row.dictTypeId);
      proTable.value?.getTableList();
    }
  });
};
</script>
