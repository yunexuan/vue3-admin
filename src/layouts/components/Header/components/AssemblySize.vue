<script setup lang="ts">
import type { AssemblySizeType } from '@/stores/interface'
import { useGlobalStore } from '@/stores/modules/global'
import { computed } from 'vue'

const globalStore = useGlobalStore()
const assemblySize = computed(() => globalStore.assemblySize)

const assemblySizeList = [
  { label: '默认', value: 'default' },
  { label: '大型', value: 'large' },
  { label: '小型', value: 'small' },
]

function setAssemblySize(item: AssemblySizeType) {
  if (assemblySize.value === item)
    return
  globalStore.setGlobalState('assemblySize', item)
}
</script>

<template>
  <el-dropdown trigger="click" @command="setAssemblySize">
    <i class="iconfont icon-contentright toolBar-icon" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in assemblySizeList"
          :key="item.value"
          :command="item.value"
          :disabled="assemblySize === item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
