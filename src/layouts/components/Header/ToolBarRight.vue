<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
import { computed } from 'vue'
import AssemblySize from './components/AssemblySize.vue'
import Avatar from './components/Avatar.vue'
import Fullscreen from './components/Fullscreen.vue'
import Language from './components/Language.vue'
import Message from './components/Message.vue'
import SearchMenu from './components/SearchMenu.vue'
import ThemeSetting from './components/ThemeSetting.vue'

const userStore = useUserStore()
const username = computed(() => userStore.userInfo.name)
</script>

<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <AssemblySize id="assemblySize" />
      <Language id="language" />
      <SearchMenu id="searchMenu" />
      <ThemeSetting id="themeSetting" />
      <Message id="message" />
      <Fullscreen id="fullscreen" />
    </div>
    <span class="username">{{ username }}</span>
    <Avatar />
  </div>
</template>

<style scoped lang="scss">
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 25px;
  .header-icon {
    display: flex;
    align-items: center;
    & > * {
      margin-left: 21px;
      color: var(--el-header-text-color);
    }
  }
  .username {
    margin: 0 20px;
    font-size: 15px;
    color: var(--el-header-text-color);
  }
}
</style>
