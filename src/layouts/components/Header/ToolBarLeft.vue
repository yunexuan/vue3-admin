<script setup lang="ts">
import { useGlobalStore } from '@/stores/modules/global'
import Breadcrumb from './components/Breadcrumb.vue'
import CollapseIcon from './components/CollapseIcon.vue'

const globalStore = useGlobalStore()
</script>

<template>
  <div class="tool-bar-lf">
    <CollapseIcon id="collapseIcon" />
    <Breadcrumb v-show="globalStore.breadcrumb" id="breadcrumb" />
  </div>
</template>

<style scoped lang="scss">
.tool-bar-lf {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
}
</style>
