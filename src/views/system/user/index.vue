<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :init-param="initParam" :data-callback="dataCallback">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="i-ep-circle-plus" @click="handleEdit()">新增用户</el-button>
        <!-- <el-button type="primary" icon="i-ep-upload" plain @click="batchAdd">批量添加用户</el-button> -->
        <!-- <el-button type="primary" icon="i-ep-download" plain @click="downloadFile">导出用户数据</el-button> -->
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <DropdownMenu>
          <el-button type="primary" link icon="i-ep-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="primary" link icon="i-ep-refresh" @click="resetPass(scope.row)">重置密码</el-button>
          <el-button type="primary" link icon="i-ep-delete" @click="deleteAccount(scope.row)">删除</el-button>
        </DropdownMenu>
      </template>
    </ProTable>
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { User } from "@/api/interface";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import EditDialog from "./component/EditDialog.vue";
import { useMessage } from "@/hooks/useMessage";
import sysUserApi from "@/api/modules/system/user";
import useDialog from "@/hooks/useDialog";
// import { useDownload } from "@/hooks/useDownload";

const message = useMessage();

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return sysUserApi.getPage(newParams);
};

// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { type: "selection", fixed: "left", width: 70 },
  {
    prop: "nickName",
    label: "用户姓名",
    search: { el: "input", tooltip: "我是搜索提示" }
  },
  {
    prop: "identifier",
    label: "登录账号",
    search: { el: "input", tooltip: "我是搜索提示" }
  },
  {
    prop: "gender",
    label: "性别",
    // 字典数据（本地数据）
    // enum: genderType,
    // 字典请求不带参数
    enum: [],
    // 字典请求携带参数
    // enum: () => getUserGender({ id: 1 }),
    search: { el: "select", props: { filterable: true, clearable: true } },
    fieldNames: { label: "genderLabel", value: "genderValue" }
  },
  { prop: "mobile", label: "手机号", search: { el: "input" } },
  { prop: "email", label: "邮箱" },
  {
    prop: "userStatus",
    label: "用户状态",
    enum: [],
    search: { el: "tree-select", props: { filterable: true } },
    fieldNames: { label: "userLabel", value: "userStatus" }
    // render: scope => {
    //   return (
    //     <>
    //       {BUTTONS.value.status ? (
    //         <el-switch
    //           model-value={scope.row.status}
    //           active-text={scope.row.status ? "启用" : "禁用"}
    //           active-value={1}
    //           inactive-value={0}
    //           onClick={() => changeStatus(scope.row)}
    //         />
    //       ) : (
    //         <el-tag type={scope.row.status ? "success" : "danger"}>{scope.row.status ? "启用" : "禁用"}</el-tag>
    //       )}
    //     </>
    //   );
    // }
  },
  {
    prop: "createDate",
    label: "创建时间",
    width: 180
  },
  { prop: "operation", label: "操作", fixed: "right", width: 100 }
]);

const editDialog = useDialog(EditDialog);

const handleEdit = async (row?: any) => {
  editDialog({
    title: row ? "修改" : "新增",
    id: row?.userId,
    onConfirm: () => {
      proTable.value?.getTableList();
    }
  });
};

// 删除用户信息
const deleteAccount = async (params: any) => {
  message.delConfirm({
    message: `删除【${params.nickName}】用户`,
    onConfirm: async () => {
      await sysUserApi.remove(params.userId);
      proTable.value?.getTableList();
    }
  });
};

// // 批量删除用户信息
// const batchDelete = async (id: string[]) => {
//   message.delConfirm({
//     message: `删除所选用户信息`,
//     onConfirm: async () => {
//       await api.sysApi.user.deleteUser({ id: id });
//       proTable.value?.clearSelection();
//       proTable.value?.getTableList();
//     }
//   });
// };

// 重置用户密码
const resetPass = async (params: User.ResUserList) => {
  message.delConfirm({
    message: `重置【${params.username}】用户密码`,
    onConfirm: async () => {
      await sysUserApi.resetUserPassWord();
      proTable.value?.getTableList();
    }
  });
};

// // 切换用户状态
// const changeStatus = async (row: User.ResUserList) => {
//   message.delConfirm({
//     message: `切换【${row.username}】用户状态`,
//     onConfirm: async () => {
//       await api.sysApi.user.changeUserStatus({ id: row.id, status: row.status == 1 ? 0 : 1 });
//       proTable.value?.getTableList();
//     }
//   });
// };

// 导出用户列表
// const downloadFile = async () => {
//   message.confirm({
//     message: "确认导出用户数据？",
//     onConfirm: () => {
//       useDownload(sysUserApi.exportUserInfo, "用户列表", proTable.value?.searchParam);
//     }
//   });
// };

// 批量添加用户
// const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
// const batchAdd = () => {
//   const params = {
//     title: "用户",
//     tempApi: sysUserApi.exportUserInfo,
//     importApi: sysUserApi.BatchAddUser,
//     getTableList: proTable.value?.getTableList
//   };
//   dialogRef.value?.acceptParams(params);
// };
</script>
