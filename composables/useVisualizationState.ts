/**
 * Global state management for CRD visualization
 */

import type { CRDDefinition, OpenAPIV3Schema } from '~/types/crd'
import type { SchemaNode, ParseError, InputFormat } from '~/types/visualization'
import type { ParsedCRD } from '~/types/schema'

export const useVisualizationState = () => {
  // Input state
  const inputValue = useState<string>('inputValue', () => '')
  const inputFormat = useState<InputFormat | null>('inputFormat', () => null)

  // Parsed data
  const parsedCrd = useState<CRDDefinition | null>('parsedCrd', () => null)
  const crdMetadata = useState<ParsedCRD | null>('crdMetadata', () => null)
  const selectedVersion = useState<string>('selectedVersion', () => '')
  const currentSchema = useState<OpenAPIV3Schema | null>('currentSchema', () => null)
  const transformedSchema = useState<SchemaNode[] | null>('transformedSchema', () => null)

  // UI state
  const selectedField = useState<SchemaNode | null>('selectedField', () => null)
  const expandedNodes = useState<Set<string>>('expandedNodes', () => new Set())
  const searchQuery = useState<string>('searchQuery', () => '')

  // Error state
  const error = useState<ParseError | null>('error', () => null)
  const warnings = useState<string[]>('warnings', () => [])

  // Loading state
  const isLoading = useState<boolean>('isLoading', () => false)

  // Actions
  const setInput = (value: string) => {
    inputValue.value = value
  }

  const setError = (err: ParseError | null) => {
    error.value = err
  }

  const clearError = () => {
    error.value = null
    warnings.value = []
  }

  const setParsedCrd = (crd: CRDDefinition | null, format: InputFormat | null = null) => {
    parsedCrd.value = crd
    if (format) {
      inputFormat.value = format
    }
  }

  const setMetadata = (metadata: ParsedCRD | null) => {
    crdMetadata.value = metadata
  }

  const setSelectedVersion = (version: string) => {
    selectedVersion.value = version
  }

  const setCurrentSchema = (schema: OpenAPIV3Schema | null) => {
    currentSchema.value = schema
  }

  const setTransformedSchema = (schema: SchemaNode[] | null) => {
    transformedSchema.value = schema
  }

  const selectField = (node: SchemaNode | null) => {
    selectedField.value = node
  }

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes.value)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    expandedNodes.value = newExpanded
  }

  const expandAll = (node: SchemaNode | null = null) => {
    const newExpanded = new Set(expandedNodes.value)
    const addNodeAndChildren = (n: SchemaNode) => {
      newExpanded.add(n.id)
      if (n.children) {
        n.children.forEach(addNodeAndChildren)
      }
    }

    if (node) {
      addNodeAndChildren(node)
    } else if (transformedSchema.value) {
      transformedSchema.value.forEach(addNodeAndChildren)
    }

    expandedNodes.value = newExpanded
  }

  const collapseAll = () => {
    expandedNodes.value = new Set()
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const reset = () => {
    inputValue.value = ''
    inputFormat.value = null
    parsedCrd.value = null
    crdMetadata.value = null
    selectedVersion.value = ''
    currentSchema.value = null
    transformedSchema.value = null
    selectedField.value = null
    expandedNodes.value = new Set()
    searchQuery.value = ''
    error.value = null
    warnings.value = []
    isLoading.value = false
  }

  return {
    // State
    inputValue,
    inputFormat,
    parsedCrd,
    crdMetadata,
    selectedVersion,
    currentSchema,
    transformedSchema,
    selectedField,
    expandedNodes,
    searchQuery,
    error,
    warnings,
    isLoading,

    // Actions
    setInput,
    setError,
    clearError,
    setParsedCrd,
    setMetadata,
    setSelectedVersion,
    setCurrentSchema,
    setTransformedSchema,
    selectField,
    toggleNode,
    expandAll,
    collapseAll,
    setSearchQuery,
    reset
  }
}
