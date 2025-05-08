<template>
  <el-dropdown trigger="click">
    <div class="el-dropdown-link">
      <div>菜单</div>
      <div class="i-ep-arrow-down"></div>
    </div>
    <template #dropdown>
      <div class="dropdown-body">
        <slot></slot>
      </div>

      <!-- <el-dropdown-menu>
        <el-dropdown-item v-for="(item, index) in $slots.default" :key="index">
          <component :is="item"></component>
        </el-dropdown-item>
      </el-dropdown-menu> -->
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
// console.log(slots);

// let result: Array<any> = [];
// if (slots && slots.default) {
//   const list = slots.default();
//   list.forEach(item => {
//     if (item.patchFlag > 0) {
//       result.push(item);
//     }
//   });
// }
</script>
<style lang="scss" scoped>
.el-dropdown-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  color: var(--el-color-primary);
  cursor: pointer;
}
.dropdown-body {
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  :deep(.el-button) {
    margin: 3px 0;
    margin-left: 0;
  }
}
</style>
