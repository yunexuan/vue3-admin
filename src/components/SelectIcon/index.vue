<script setup lang="ts" name="SelectIcon">
import { icons as epIcons } from '@iconify-json/ep'
import { addCollection, listIcons } from '@iconify/vue'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<SelectIconProps>(), {
  iconValue: '',
  title: '请选择图标',
  clearable: true,
  placeholder: '请选择图标',
})

// 选择图标(触发更新父组件数据)
const emit = defineEmits<{
  'update:iconValue': [value: string]
}>()

addCollection(epIcons)

interface SelectIconProps {
  iconValue?: string
  title?: string
  clearable?: boolean
  placeholder?: string
}

// 重新接收一下，防止打包后 clearable 报错
const valueIcon = ref(props.iconValue)

// open Dialog
const dialogVisible = ref(false)
const openDialog = () => (dialogVisible.value = true)

// 清空图标
const inputRef = ref()

function selectIcon(item: any) {
  dialogVisible.value = false
  valueIcon.value = item
  emit('update:iconValue', item)
  setTimeout(() => inputRef.value.blur(), 0)
}

function clearIcon() {
  valueIcon.value = ''
  emit('update:iconValue', '')
  setTimeout(() => inputRef.value.blur(), 0)
}

// 监听搜索框值
const inputValue = ref('')
const iconsList = computed((): Array<string> => {
  const iconList: Array<string> = listIcons('', 'ep')
  if (!inputValue.value)
    return iconList
  return iconList.filter(icon => icon.toLowerCase().includes(inputValue.value.toLowerCase()))
})
</script>

<template>
  <div class="icon-box">
    <el-input
      ref="inputRef" v-model="valueIcon" v-bind="$attrs" :placeholder="placeholder" :clearable="clearable"
      @clear="clearIcon" @click="openDialog"
    >
      <template #append>
        <Icon :icon="iconValue" />
      </template>
    </el-input>
    <el-dialog v-model="dialogVisible" :title="placeholder" top="50px" width="66%">
      <el-input v-model="inputValue" placeholder="搜索图标" size="large" prefix-icon="i-ep-search" />
      <el-scrollbar v-if="Object.keys(iconsList).length">
        <div class="icon-list">
          <div v-for="item in iconsList" :key="item" class="icon-item" @click="selectIcon(item)">
            <Icon :icon="item" width="40" height="40" />
            <span>{{ item.split(":")[1] }}</span>
          </div>
        </div>
      </el-scrollbar>
      <el-empty v-else description="未搜索到您要找的图标~" />
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
@import './_index';
</style>
