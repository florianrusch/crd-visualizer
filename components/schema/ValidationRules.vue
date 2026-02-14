<script setup lang="ts">
import type { OpenAPIV3Schema } from '~/types/crd'

const props = defineProps<{
  schema: OpenAPIV3Schema
}>()

interface ValidationRule {
  label: string
  value: string | number | boolean
}

const validationRules = computed(() => {
  const rules: ValidationRule[] = []

  if (props.schema.format) {
    rules.push({ label: 'Format', value: props.schema.format })
  }

  if (props.schema.pattern) {
    rules.push({ label: 'Pattern', value: props.schema.pattern })
  }

  if (props.schema.minLength !== undefined) {
    rules.push({ label: 'Min Length', value: props.schema.minLength })
  }

  if (props.schema.maxLength !== undefined) {
    rules.push({ label: 'Max Length', value: props.schema.maxLength })
  }

  if (props.schema.minimum !== undefined) {
    rules.push({ label: 'Minimum', value: props.schema.minimum })
  }

  if (props.schema.maximum !== undefined) {
    rules.push({ label: 'Maximum', value: props.schema.maximum })
  }

  if (props.schema.minItems !== undefined) {
    rules.push({ label: 'Min Items', value: props.schema.minItems })
  }

  if (props.schema.maxItems !== undefined) {
    rules.push({ label: 'Max Items', value: props.schema.maxItems })
  }

  if (props.schema.uniqueItems) {
    rules.push({ label: 'Unique Items', value: true })
  }

  return rules
})

const hasValidations = computed(() => validationRules.value.length > 0)
</script>

<template>
  <div v-if="hasValidations" class="space-y-2">
    <h4 class="text-sm font-semibold text-gray-700">Validation Rules</h4>
    <div class="space-y-1">
      <div
        v-for="rule in validationRules"
        :key="rule.label"
        class="flex justify-between text-sm"
      >
        <span class="text-gray-600">{{ rule.label }}:</span>
        <span class="font-mono text-gray-900">{{ rule.value }}</span>
      </div>
    </div>
  </div>
</template>
