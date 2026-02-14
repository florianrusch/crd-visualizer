<script setup lang="ts">
import type { SchemaNode } from '~/types/visualization'
import { linkifyUrls } from '~/utils/url-linker'

const props = defineProps<{
  field: SchemaNode | null
}>()

// Debug: watch for field changes
watch(() => props.field, (newField) => {
  console.log('FieldDetails received:', newField)
}, { immediate: true })

const linkedDescription = computed(() => {
  if (!props.field?.description) return ''
  return linkifyUrls(props.field.description)
})
</script>

<template>
  <div class="min-h-[500px]">
    <div v-if="!field" class="flex items-center justify-center min-h-[500px] text-gray-400">
      <div class="text-center space-y-3">
        <div class="text-5xl">👈</div>
        <p class="text-base font-medium">Select a field to view details</p>
        <p class="text-xs text-gray-400">Click on any field in the tree</p>
      </div>
    </div>

    <div v-else class="space-y-6">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-xl font-bold text-gray-900">{{ field.name }}</h3>
          <SchemaTypeBadge :type="field.type" />
          <UBadge v-if="field.required" color="red" variant="solid" size="xs">
            Required
          </UBadge>
        </div>
        <p class="text-sm text-gray-500 font-mono">{{ field.path }}</p>
      </div>

      <div v-if="field.description" class="space-y-2">
        <h4 class="text-sm font-semibold text-gray-700">Description</h4>
        <div
          class="text-sm text-gray-600 leading-relaxed"
          v-html="linkedDescription"
        />
      </div>

      <div class="space-y-2">
        <h4 class="text-sm font-semibold text-gray-700">Type Information</h4>
        <div class="text-sm space-y-1">
          <div class="flex justify-between">
            <span class="text-gray-600">Type:</span>
            <span class="font-mono text-gray-900">{{ field.schema.type || 'any' }}</span>
          </div>
          <div v-if="field.schema.format" class="flex justify-between">
            <span class="text-gray-600">Format:</span>
            <span class="font-mono text-gray-900">{{ field.schema.format }}</span>
          </div>
        </div>
      </div>

      <SchemaValidationRules :schema="field.schema" />

      <div v-if="field.schema.enum" class="space-y-2">
        <h4 class="text-sm font-semibold text-gray-700">Allowed Values</h4>
        <div class="flex flex-wrap gap-1">
          <UBadge
            v-for="(value, idx) in field.schema.enum"
            :key="idx"
            color="gray"
            variant="soft"
            size="xs"
          >
            {{ value }}
          </UBadge>
        </div>
      </div>

      <div v-if="field.schema.default !== undefined" class="space-y-2">
        <h4 class="text-sm font-semibold text-gray-700">Default Value</h4>
        <pre class="text-sm bg-gray-50 p-2 rounded font-mono">{{ JSON.stringify(field.schema.default, null, 2) }}</pre>
      </div>

      <div v-if="field.children && field.children.length > 0" class="space-y-2">
        <h4 class="text-sm font-semibold text-gray-700">Child Fields</h4>
        <p class="text-sm text-gray-600">
          This field contains {{ field.children.length }} child field{{ field.children.length !== 1 ? 's' : '' }}
        </p>
      </div>
    </div>
  </div>
</template>
