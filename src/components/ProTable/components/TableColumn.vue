<script setup lang="tsx" name="TableColumn">
import type { ColumnProps, HeaderRenderScope, RenderScope } from '@/components/ProTable/interface'
import { filterEnum, formatValue, handleProp, handleRowAccordingToProp } from '@/utils'
import { inject, ref, useSlots } from 'vue'

defineProps<{ column: ColumnProps }>()

const slots = useSlots()

const enumMap = inject('enumMap', ref(new Map()))

// 渲染表格数据
function renderCellData(item: ColumnProps, scope: RenderScope<any>) {
  return enumMap.value.get(item.prop) && item.isFilterEnum
    ? filterEnum(handleRowAccordingToProp(scope.row, item.prop!), enumMap.value.get(item.prop)!, item.fieldNames)
    : formatValue(handleRowAccordingToProp(scope.row, item.prop!))
}

// 获取 tag 类型
function getTagType(item: ColumnProps, scope: RenderScope<any>) {
  return (
    filterEnum(handleRowAccordingToProp(scope.row, item.prop!), enumMap.value.get(item.prop), item.fieldNames, 'tag') || 'primary'
  )
}

function RenderTableColumn(item: ColumnProps) {
  return (
    <>
      {item.isShow && (
        <el-table-column
          {...item}
          align={item.align ?? 'center'}
          showOverflowTooltip={item.showOverflowTooltip ?? item.prop !== 'operation'}
        >
          {{
            default: (scope: RenderScope<any>) => {
              if (item._children)
                return item._children.map(child => RenderTableColumn(child))
              if (item.render)
                return item.render(scope)
              if (item.prop && slots[handleProp(item.prop)])
                return slots[handleProp(item.prop)]!(scope)
              if (item.tag)
                return <el-tag type={getTagType(item, scope)}>{renderCellData(item, scope)}</el-tag>
              return renderCellData(item, scope)
            },
            header: (scope: HeaderRenderScope<any>) => {
              if (item.headerRender)
                return item.headerRender(scope)
              if (item.prop && slots[`${handleProp(item.prop)}Header`])
                return slots[`${handleProp(item.prop)}Header`]!(scope)
              return item.label
            },
          }}
        </el-table-column>
      )}
    </>
  )
}
</script>

<template>
  <RenderTableColumn v-bind="column" />
</template>
