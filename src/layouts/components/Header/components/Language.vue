<script setup lang="ts">
import type { LanguageType } from '@/stores/interface'
import { useGlobalStore } from '@/stores/modules/global'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const globalStore = useGlobalStore()
const language = computed(() => globalStore.language)

const languageList = [
  { label: '简体中文', value: 'zh' },
  { label: 'English', value: 'en' },
]

function changeLanguage(lang: string) {
  i18n.locale.value = lang
  globalStore.setGlobalState('language', lang as LanguageType)
}
</script>

<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <i class="iconfont icon-zhongyingwen toolBar-icon" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in languageList"
          :key="item.value"
          :command="item.value"
          :disabled="language === item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
