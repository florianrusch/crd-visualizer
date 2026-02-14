<script setup lang="ts">
import { useSchemaExtractor } from '~/composables/useSchemaExtractor'
import { transformSchemaToTreeRoot } from '~/utils/schema-transformer'

const state = useVisualizationState()
const { extractSchema } = useSchemaExtractor()

const handleVersionChange = (version: string) => {
  if (!state.parsedCrd.value) return

  // Extract schema for selected version
  const schema = extractSchema(state.parsedCrd.value, version)

  if (!schema) {
    console.error('Could not extract schema for version:', version)
    return
  }

  // Transform schema to tree (returns array of root nodes)
  const tree = transformSchemaToTreeRoot(schema)

  // Update state
  state.setSelectedVersion(version)
  state.setCurrentSchema(schema)
  state.setTransformedSchema(tree)
  state.collapseAll()
  state.selectField(null)

  // Expand spec node by default if it exists
  const specNode = tree.find(n => n.name === 'spec')
  if (specNode) {
    state.toggleNode(specNode.id)
  }
}

const handleNew = () => {
  state.reset()
}

const availableVersions = computed(() => {
  return state.crdMetadata.value?.versions.map(v => v.name) || []
})
</script>

<template>
  <div class="max-w-[1800px] mx-auto p-6 space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ state.crdMetadata.value?.kind }}
        </h1>
        <p class="text-sm text-gray-600 font-mono">
          {{ state.crdMetadata.value?.group }} / {{ state.crdMetadata.value?.name }}
        </p>
      </div>

      <UButton
        color="gray"
        variant="outline"
        @click="handleNew"
      >
        Load New CRD
      </UButton>
    </div>

    <div v-if="availableVersions.length > 1" class="flex gap-2">
      <UButton
        v-for="version in availableVersions"
        :key="version"
        :color="state.selectedVersion.value === version ? 'primary' : 'gray'"
        :variant="state.selectedVersion.value === version ? 'solid' : 'outline'"
        size="sm"
        @click="handleVersionChange(version)"
      >
        {{ version }}
      </UButton>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-7">
        <UCard>
          <SchemaTree />
        </UCard>
      </div>

      <div class="lg:col-span-5">
        <div class="sticky top-6">
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Field Details</h3>
            </template>
            <div class="max-h-[calc(100vh-12rem)] overflow-y-auto">
              <SchemaFieldDetails :field="state.selectedField.value" />
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>
