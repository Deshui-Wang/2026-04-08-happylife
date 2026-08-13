<template>
  <el-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="友邦保险13份合同全面梳理分析报告"
    size="60%"
    direction="rtl"
    destroy-on-close
    append-to-body
    class="policy-drawer"
  >
    <div class="markdown-body" v-html="renderedMarkdown"></div>
  </el-drawer>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  renderedMarkdown: { type: String, default: '' }
})

defineEmits(['update:modelValue'])
</script>
