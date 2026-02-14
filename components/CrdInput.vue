<script setup lang="ts">
import { useCrdParser } from '~/composables/useCrdParser'
import { useSchemaExtractor } from '~/composables/useSchemaExtractor'
import { transformSchemaToTreeRoot } from '~/utils/schema-transformer'

const state = useVisualizationState()
const { parseCrd } = useCrdParser()
const { extractMetadata, extractSchema, getDefaultVersion } = useSchemaExtractor()

const localInput = ref('')
const isParsing = ref(false)

const handleParse = () => {
  if (!localInput.value.trim()) {
    state.setError({
      message: 'Please paste a CRD YAML or JSON',
      type: 'structure'
    })
    return
  }

  isParsing.value = true
  state.clearError()

  try {
    // Parse the CRD
    const { crd, error, format } = parseCrd(localInput.value)

    if (error || !crd) {
      state.setError(error || { message: 'Unknown parsing error', type: 'structure' })
      return
    }

    // Extract metadata
    const metadata = extractMetadata(crd)

    // Get default version
    const defaultVersion = getDefaultVersion(crd)

    // Extract schema for default version
    const schema = extractSchema(crd, defaultVersion)

    if (!schema) {
      state.setError({
        message: 'Could not extract schema from CRD',
        type: 'schema'
      })
      return
    }

    // Transform schema to tree (returns array of root nodes)
    const tree = transformSchemaToTreeRoot(schema)

    // Update state
    state.setInput(localInput.value)
    state.setParsedCrd(crd, format || 'yaml')
    state.setMetadata(metadata)
    state.setSelectedVersion(defaultVersion)
    state.setCurrentSchema(schema)
    state.setTransformedSchema(tree)

    // Expand root nodes by default (expand spec if it exists)
    const specNode = tree.find(n => n.name === 'spec')
    if (specNode) {
      state.toggleNode(specNode.id)
    }
  } catch (err: any) {
    state.setError({
      message: `Unexpected error: ${err.message}`,
      type: 'structure'
    })
  } finally {
    isParsing.value = false
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    localInput.value = content
  }
  reader.readAsText(file)
}

const loadExample = async (exampleName: string) => {
  try {
    const response = await fetch(`/examples/${exampleName}.yaml`)
    const content = await response.text()
    localInput.value = content
  } catch (err) {
    console.error('Failed to load example:', err)
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <div class="text-center space-y-2">
      <h1 class="text-4xl font-bold text-gray-900">Kubernetes CRD Visualizer</h1>
      <p class="text-lg text-gray-600">
        Parse and visualize Kubernetes Custom Resource Definitions
      </p>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Paste CRD YAML or JSON</h2>
          <div class="flex gap-2">
            <UButton
              color="gray"
              variant="ghost"
              size="sm"
              @click="loadExample('deployment')"
            >
              Load Example
            </UButton>
            <label>
              <UButton
                color="gray"
                variant="ghost"
                size="sm"
                as="span"
              >
                Upload File
              </UButton>
              <input
                type="file"
                accept=".yaml,.yml,.json"
                class="hidden"
                @change="handleFileUpload"
              >
            </label>
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <UTextarea
          v-model="localInput"
          :rows="20"
          placeholder="Paste your CRD YAML or JSON here..."
          class="font-mono text-sm"
        />

        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500">
            <span v-if="localInput">{{ localInput.split('\n').length }} lines</span>
          </div>

          <UButton
            color="primary"
            size="lg"
            :loading="isParsing"
            :disabled="!localInput.trim()"
            @click="handleParse"
          >
            Parse CRD
          </UButton>
        </div>

        <UAlert
          v-if="state.error.value"
          color="red"
          variant="soft"
          :title="state.error.value.message"
          :description="
            state.error.value.line
              ? `Line ${state.error.value.line}${state.error.value.column ? `, Column ${state.error.value.column}` : ''}`
              : undefined
          "
        />
      </div>
    </UCard>

    <div class="text-center text-sm text-gray-500">
      <p>
        Supports Kubernetes CRDs in YAML or JSON format.
        The visualizer will parse the OpenAPI v3 schema and display it as an interactive tree.
      </p>
    </div>
  </div>
</template>
