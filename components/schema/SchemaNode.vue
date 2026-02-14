<script setup lang="ts">
import type { SchemaNode } from '~/types/visualization'

const props = defineProps<{
  node: SchemaNode
  isExpanded: boolean
}>()

const emit = defineEmits<{
  toggle: [nodeId: string]
  select: [node: SchemaNode]
}>()

const state = useVisualizationState()

const hasChildren = computed(() => props.node.children && props.node.children.length > 0)
const isSelected = computed(() => state.selectedField.value?.id === props.node.id)

const handleToggle = () => {
  if (hasChildren.value) {
    emit('toggle', props.node.id)
  }
}

const handleSelect = () => {
  console.log('SchemaNode clicked:', props.node.name)
  emit('select', props.node)
}

const indentStyle = computed(() => {
  return {
    paddingLeft: `${props.node.depth * 1.5}rem`
  }
})
</script>

<template>
  <div class="select-none">
    <div
      class="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 cursor-pointer rounded transition-colors"
      :class="{
        'bg-blue-50 hover:bg-blue-100': isSelected
      }"
      :style="indentStyle"
      @click="handleSelect"
    >
      <button
        v-if="hasChildren"
        class="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700 flex-shrink-0"
        @click.stop="handleToggle"
      >
        <span v-if="isExpanded" class="text-xs">▼</span>
        <span v-else class="text-xs">▶</span>
      </button>
      <div v-else class="w-4 flex-shrink-0" />

      <div class="flex items-center gap-2 flex-1 min-w-0">
        <span class="font-mono text-sm font-medium text-gray-900 truncate">
          {{ node.name }}
        </span>
        <SchemaTypeBadge :type="node.type" />
        <span v-if="node.required" class="text-red-500 text-xs font-bold">*</span>
      </div>
    </div>

    <div v-if="hasChildren && isExpanded">
      <SchemaNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :is-expanded="state.expandedNodes.value.has(child.id)"
        @toggle="emit('toggle', $event)"
        @select="emit('select', $event)"
      />
    </div>
  </div>
</template>
