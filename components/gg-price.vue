<template>
  <span>{{ val }}<slot /></span>
</template>
<script setup lang="ts">
import {fmt as $fmt} from "~/utils/moneyFmt";
const props = defineProps<{
  modelValue?: any
  value?: any
  fmt?: string
}>()

// 默认格式字符串
const fmt = computed(() => props.fmt ?? '#,###.##')

// 获取实际金额值（优先 value）
const raw = computed(() => props.value ?? props.modelValue)

// 调用 $fmt 格式化函数
const val = computed(() => {
  // @ts-ignore
  return (typeof raw.value !== 'undefined' && raw.value !== null)
      ? ($fmt(raw.value, fmt.value) ?? raw.value)
      : ''
})
</script>

<style scoped></style>