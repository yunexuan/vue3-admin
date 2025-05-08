<script setup lang="ts" name="Dictionary">
import { useDictStore } from '@/stores/modules/dict'
import { onMounted, reactive, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  dict: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '请输入内容',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const dictionaryStore = useDictStore()

const inputValue = ref<string>(String(props.modelValue))

const dictInfo = reactive<DictModel>({
  dictId: '',
  dictName: '',
  dictCode: '',
  colorType: '',
})

function onChange() {
  if (typeof props.modelValue === 'number') {
    emit('update:modelValue', Number(inputValue.value))
  }
  else {
    emit('update:modelValue', inputValue.value)
  }
  emit('change', inputValue.value)
}

const dataList = ref<Array<DictModel>>([])
async function initData() {
  const data = await dictionaryStore.getDictionary(props.dict)
  dataList.value = data
  findData()
}

async function findData() {
  const findResult = dataList.value.find(item => item.dictCode === inputValue.value)
  if (findResult) {
    Object.assign(dictInfo, findResult)
  }
}

watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = String(newVal)
    findData()
  },
  { deep: true },
)

onMounted(() => {
  initData()
})
</script>

<template>
  <div class="w-full">
    <template v-if="type === 'select'">
      <el-select v-model="inputValue" v-bind="$attrs" filterable clearable class="w-full" @change="onChange">
        <el-option v-for="data in dataList" :key="data.dictId" :label="data.dictName" :value="data.dictCode">
          {{
            data.dictName
          }}
        </el-option>
      </el-select>
    </template>
    <template v-else-if="type === 'radio'">
      <el-radio-group v-model="inputValue" v-bind="$attrs" @change="onChange">
        <el-radio v-for="data in dataList" :key="data.dictId" :label="data.dictCode">
          {{ data.dictName }}
        </el-radio>
      </el-radio-group>
    </template>
    <template v-else-if="type === 'tag'">
      <el-tag v-if="dictInfo.colorType === 'success'" type="success">
        {{ dictInfo.dictName }}
      </el-tag>
      <el-tag v-if="dictInfo.colorType === 'warning'" type="warning">
        {{ dictInfo.dictName }}
      </el-tag>
      <el-tag v-if="dictInfo.colorType === 'danger'" type="danger">
        {{ dictInfo.dictName }}
      </el-tag>
      <el-tag v-if="dictInfo.colorType === 'info'" type="info">
        {{ dictInfo.dictName }}
      </el-tag>
      <el-tag v-if="dictInfo.colorType === ''">
        {{ dictInfo.dictName }}
      </el-tag>
    </template>
    <template v-else>
      <div>{{ dictInfo.dictName }}</div>
    </template>
  </div>
</template>
