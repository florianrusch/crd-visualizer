<script setup lang="ts">
import type { SchemaNode } from '~/types/visualization'

const state = useVisualizationState()

const handleToggle = (nodeId: string) => {
  state.toggleNode(nodeId)
}

const handleSelect = (node: SchemaNode) => {
  console.log('SchemaTree handling select:', node.name)
  state.selectField(node)
  console.log('After selectField, state is:', state.selectedField.value)
}

const handleExpandAll = () => {
  state.expandAll()
}

const handleCollapseAll = () => {
  state.collapseAll()
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-4 pb-3 border-b">
      <div class="flex items-center gap-4">
        <h3 class="text-lg font-semibold text-gray-900">Schema Structure</h3>
        <div class="text-xs text-gray-500 space-x-2">
          <span><span class="text-red-500">*</span> = required</span>
        </div>
      </div>

      <div class="flex gap-2">
        <UButton
          color="gray"
          variant="ghost"
          size="xs"
          @click="handleExpandAll"
        >
          Expand All
        </UButton>
        <UButton
          color="gray"
          variant="ghost"
          size="xs"
          @click="handleCollapseAll"
        >
          Collapse All
        </UButton>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <template v-if="state.transformedSchema.value">
        <SchemaNode
          v-for="node in state.transformedSchema.value"
          :key="node.id"
          :node="node"
          :is-expanded="state.expandedNodes.value.has(node.id)"
          @toggle="handleToggle"
          @select="handleSelect"
        />
      </template>
    </div>
  </div>
</template>
