/**
 * Tree visualization types
 */

import type { OpenAPIV3Schema } from './crd'

export interface SchemaNode {
  id: string
  name: string
  type: string
  required: boolean
  description?: string
  children?: SchemaNode[]
  schema: OpenAPIV3Schema
  path: string
  depth: number
}

export interface TreeState {
  expandedNodes: Set<string>
  selectedNode: SchemaNode | null
}

export type InputFormat = 'yaml' | 'json'

export interface ParseError {
  message: string
  line?: number
  column?: number
  type: 'syntax' | 'structure' | 'schema'
}
