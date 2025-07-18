<template>
  <div
      class="mt-4 code-block-container relative group rounded overflow-hidden border border-gray-200"
      :class="isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'"
  >
    <!-- Header -->
    <div
        class="flex justify-between items-center px-4 py-2"
        :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'"
    >
      <span>{{ title }}</span><span>{{  language }}</span>
      <div class="flex items-center space-x-2">
        <el-button
            class="opacity-50 group-hover:opacity-100 transition-opacity"
            icon="DocumentCopy"
            size="small"
            text
            @click="copyCode"
        >{{ copied ? '已复制' : '复制' }}</el-button>
        <el-button
            size="small"
            icon="ArrowDown"
            @click="toggleCollapse"
            :title="collapsed ? '展开代码' : '折叠代码'"
        />
      </div>
    </div>
    <el-scrollbar max-height="400px" ref="slotContainer">
    <!-- Code block -->
    <pre v-if="!collapsed" :class="`language-${language}`">
      <code ref="codeEl"><slot>{{ code }}</slot></code>
    </pre>

    <!-- Collapsed view -->
    <div v-else class="p-4 text-gray-500">
      <span class="italic">代码已折叠...</span>
    </div>
    </el-scrollbar>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import hljs from 'highlight.js'
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'
const { copy, copied } = useClipboard()

const props = defineProps<{
  title?: string
  code?: string
  language?: string
}>()

const language = props.language || 'text'
const codeEl = ref<HTMLElement | null>(null)
const collapsed = ref(false)
const isDark = computed(() => document.documentElement.classList.contains('dark')) // 根据页面主题判断





const highlight = () => {
  if (codeEl.value) {
    hljs.highlightElement(codeEl.value)
  }
}

const copyCode = async () => {
  try {
    if (codeEl.value) {
      await copy(codeEl.value.innerText) // 复制实际渲染出来的 slot 内容
      ElMessage.success('复制成功')
    } else {
      ElMessage.error('复制失败：未找到代码元素')
    }
  } catch {
    ElMessage.error('复制失败')
  }
}

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

onMounted(highlight)
</script>

<style scoped>

.code-block-container pre {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
  font-size: 0.875rem;
  background-color: #f9fafb;
}
</style>

<!-- 推荐在全局引入 highlight.js 默认样式 -->
<!-- main.ts 或 app.vue -->
<!-- import 'highlight.js/styles/github.css' -->
