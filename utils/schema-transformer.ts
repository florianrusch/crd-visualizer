/**
 * Transform OpenAPI schema into tree structure for visualization
 */

import type { OpenAPIV3Schema } from '~/types/crd'
import type { SchemaNode } from '~/types/visualization'

let nodeIdCounter = 0

export function transformSchemaToTree(
  schema: OpenAPIV3Schema,
  name: string = 'root',
  path: string = '',
  depth: number = 0,
  requiredFields: string[] = []
): SchemaNode {
  const nodeId = `node-${nodeIdCounter++}`
  const currentPath = path ? `${path}.${name}` : name
  const isRequired = requiredFields.includes(name)

  // Determine the type
  let type = schema.type || 'any'

  // Handle arrays
  if (type === 'array' && schema.items) {
    type = `array[${schema.items.type || 'object'}]`
  }

  const node: SchemaNode = {
    id: nodeId,
    name,
    type,
    required: isRequired,
    description: schema.description,
    schema,
    path: currentPath,
    depth,
    children: []
  }

  // Process children for objects
  if (schema.type === 'object' && schema.properties) {
    const childRequired = schema.required || []
    node.children = Object.entries(schema.properties).map(([propName, propSchema]) =>
      transformSchemaToTree(propSchema, propName, currentPath, depth + 1, childRequired)
    )

    // Sort children: required first, then alphabetically
    node.children.sort((a, b) => {
      if (a.required && !b.required) return -1
      if (!a.required && b.required) return 1
      return a.name.localeCompare(b.name)
    })
  }

  // Process children for arrays with object items
  if (schema.type === 'array' && schema.items && schema.items.type === 'object') {
    const itemSchema = schema.items
    if (itemSchema.properties) {
      const childRequired = itemSchema.required || []
      node.children = Object.entries(itemSchema.properties).map(([propName, propSchema]) =>
        transformSchemaToTree(propSchema, propName, `${currentPath}[]`, depth + 1, childRequired)
      )

      // Sort children: required first, then alphabetically
      node.children.sort((a, b) => {
        if (a.required && !b.required) return -1
        if (!a.required && b.required) return 1
        return a.name.localeCompare(b.name)
      })
    }
  }

  return node
}

export function transformSchemaToTreeRoot(schema: OpenAPIV3Schema): SchemaNode[] {
  resetNodeIdCounter()

  // If the schema is an object with properties, return each property as a root node
  if (schema.type === 'object' && schema.properties) {
    const requiredFields = schema.required || []
    return Object.entries(schema.properties).map(([propName, propSchema]) =>
      transformSchemaToTree(propSchema, propName, '', 0, requiredFields)
    ).sort((a, b) => {
      // Sort: required first, then alphabetically
      if (a.required && !b.required) return -1
      if (!a.required && b.required) return 1
      return a.name.localeCompare(b.name)
    })
  }

  // Fallback: return a single root node
  return [transformSchemaToTree(schema, 'root', '', 0)]
}

export function resetNodeIdCounter(): void {
  nodeIdCounter = 0
}

export function getTypeColor(type: string): string {
  const typeMap: Record<string, string> = {
    string: 'blue',
    number: 'green',
    integer: 'green',
    boolean: 'purple',
    object: 'orange',
    array: 'red',
    'array[object]': 'red',
    'array[string]': 'pink',
    any: 'gray'
  }

  if (type.startsWith('array')) {
    return typeMap['array'] || 'red'
  }

  return typeMap[type] || 'gray'
}
