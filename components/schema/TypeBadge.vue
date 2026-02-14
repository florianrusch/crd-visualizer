<script setup lang="ts">
import { getTypeColor } from '~/utils/schema-transformer'

const props = defineProps<{
  type: string
}>()

const color = computed(() => getTypeColor(props.type))
</script>

<template>
  <UBadge
    :color="color"
    variant="subtle"
    size="xs"
    class="font-mono"
  >
    {{ type }}
  </UBadge>
</template>
