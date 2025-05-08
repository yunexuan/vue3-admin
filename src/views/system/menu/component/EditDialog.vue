<template>
  <el-dialog
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    draggable
    :title="`${dialogProps.title}菜单`"
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
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb10">
          <el-form-item label="上级菜单" prop="parentId">
            <el-cascader
              ref="parentRef"
              :options="menuList"
              :props="menuProps"
              placeholder="请选择上级菜单"
              clearable
              class="w-full"
              v-model="ruleForm.parentId"
              @change="parentChange"
            >
              <template #default="{ node, data }">
                <span>{{ data.menuName }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </template>
            </el-cascader>
          </el-form-item>
        </el-col>

        <!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb10">
          <el-form-item label="菜单等级" prop="menuGrade">
            <el-radio-group v-model="ruleForm.menuGrade">
              <el-radio-button v-for="item in menuGrade" :key="item.value" :value="item.value">{{ item.label }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col> -->
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb10">
          <el-form-item label="菜单排序" prop="sortNo">
            <el-input-number v-model="ruleForm.sortNo" controls-position="right" placeholder="请输入排序" class="w100" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb10">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="ruleForm.menuName" placeholder="请输入菜单名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <template v-if="ruleForm.menuType === 0">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb10">
            <el-form-item label="路由路径" prop="menuPath">
              <el-input v-model="ruleForm.menuPath" placeholder="路由中的 path 值" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb10">
            <el-form-item label="页面路径" prop="pagePath">
              <el-input v-model="ruleForm.pagePath" placeholder="路由中的 path 值" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb10">
            <el-form-item label="重定向" prop="redirectPath">
              <el-input v-model="ruleForm.redirectPath" placeholder="请输入重定向路由" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb10">
            <el-form-item label="菜单图标" prop="menuIcon">
              <SelectIcon placeholder="请选择菜单图标" v-model:icon-value="ruleForm.menuIcon" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb10">
            <el-form-item label="权限标识" prop="authority">
              <el-input v-model="ruleForm.authority" placeholder="请输入权限标识" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb10">
            <el-form-item label="链接地址" prop="linkUrl">
              <el-input
                v-model="ruleForm.linkUrl"
                placeholder="外链/内嵌时链接地址（http:xxx.com）"
                clearable
                :disabled="ruleForm.linkFlag == 0"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb10">
            <el-form-item label="是否隐藏" prop="hideFlag">
              <el-radio-group v-model="ruleForm.hideFlag">
                <el-radio :value="1">隐藏</el-radio>
                <el-radio :value="0">不隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb10">
            <el-form-item label="页面缓存" prop="cacheFlag">
              <el-radio-group v-model="ruleForm.cacheFlag">
                <el-radio :value="1">缓存</el-radio>
                <el-radio :value="0">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb10">
            <el-form-item label="是否固定" prop="fixedFlag">
              <el-radio-group v-model="ruleForm.fixedFlag">
                <el-radio :value="1">固定</el-radio>
                <el-radio :value="0">不固定</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb10">
            <el-form-item label="是否外链" prop="linkFlag">
              <el-radio-group v-model="ruleForm.linkFlag" :disabled="ruleForm.iframeFlag == 1">
                <el-radio :value="1">是</el-radio>
                <el-radio :value="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb10">
            <el-form-item label="是否内嵌" prop="iframeFlag">
              <el-radio-group v-model="ruleForm.iframeFlag">
                <el-radio :value="1">是</el-radio>
                <el-radio :value="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb10">
            <el-form-item label="是否全屏" prop="fullFlag">
              <el-radio-group v-model="ruleForm.fullFlag">
                <el-radio :value="1">是</el-radio>
                <el-radio :value="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button v-show="!dialogProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="MenuDrawer">
import { ref, reactive, computed } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import SelectIcon from "@/components/SelectIcon/index.vue";
import sysMenuApi from "@/api/modules/system/menu";
import { onMounted } from "vue";

const menuProps = {
  emitPath: false,
  checkStrictly: true,
  value: "menuId",
  label: "menuName"
};

const dialogProps = defineProps<{
  visible: boolean;
  isView?: boolean;
  title: string;
  id?: string;
}>();

const emits = defineEmits<{
  (event: "close"): void;
  (event: "confirm"): void;
}>();

const dialogVisible = computed<boolean>({
  get() {
    return dialogProps.visible;
  },
  set(visible) {
    if (!visible) {
      emits("close");
    }
  }
});

const menuList = ref<Array<any>>([]);
const ruleForm = reactive({
  menuId: "",
  menuType: 0,
  menuGrade: 1,
  menuName: "",
  parentId: "",
  applyId: "",
  parentName: "",
  menuPath: "",
  pagePath: "",
  authority: "",
  sortNo: 0,
  menuIcon: "",
  redirectPath: "",
  linkUrl: "",
  linkFlag: 0,
  hideFlag: 0,
  cacheFlag: 0,
  fixedFlag: 0,
  iframeFlag: 0,
  fullFlag: 0
});

const rules = reactive({
  avatar: [{ required: true, message: "请上传用户头像" }],
  photo: [{ required: true, message: "请上传用户照片" }],
  username: [{ required: true, message: "请填写用户姓名" }],
  gender: [{ required: true, message: "请选择性别" }],
  idCard: [{ required: true, message: "请填写身份证号" }],
  email: [{ required: true, message: "请填写邮箱" }],
  address: [{ required: true, message: "请填写居住地址" }]
});

const getInfo = async (id: string) => {
  const { data } = await sysMenuApi.getById(id);
  Object.assign(ruleForm, data);
  changeApply();
};

// 获取菜单列表
const getMenuList = async () => {
  const params = {
    applyId: ruleForm.applyId
  };
  const { data } = await sysMenuApi.getMenuTree(params);
  menuList.value = data;
};

const changeApply = () => {
  if (ruleForm.applyId) {
    getMenuList();
  } else {
    menuList.value = [];
    ruleForm.parentId = "";
  }
};

const parentRef = ref();
// 上级菜单改变时
const parentChange = () => {
  const checkedList = parentRef.value.getCheckedNodes();
  if (checkedList.length > 0) {
    const length = checkedList[0].children.length;
    ruleForm.sortNo = length;
  }
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await sysMenuApi.save(ruleForm);
      ElMessage.success({ message: `${dialogProps.title}成功！` });
      emits("confirm");
      dialogVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

onMounted(() => {
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields();
  }
  if (dialogProps.id) {
    getInfo(dialogProps.id);
  }
});
</script>
