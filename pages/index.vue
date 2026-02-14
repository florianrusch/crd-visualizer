<script setup lang="ts">
const state = useVisualizationState()

const showVisualizer = computed(() => state.transformedSchema.value !== null)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <CrdInput v-if="!showVisualizer" />
    <SchemaVisualizer v-else />
  </div>
</template>
