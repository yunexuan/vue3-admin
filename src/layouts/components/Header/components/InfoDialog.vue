<script setup lang="ts">
import { ref } from 'vue'

const dialogVisible = ref(false)
function openDialog() {
  dialogVisible.value = true
}

defineExpose({ openDialog })
</script>

<template>
  <el-dialog v-model="dialogVisible" title="个人信息" width="500px" draggable>
    <span>This is userInfo</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
