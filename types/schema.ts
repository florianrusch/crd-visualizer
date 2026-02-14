/**
 * OpenAPI v3 Schema types for visualization
 */

import type { OpenAPIV3Schema } from './crd'

export interface SchemaField {
  name: string
  type: string
  description?: string
  required: boolean
  schema: OpenAPIV3Schema
}

export interface ValidationRule {
  type: string
  value: any
  description: string
}

export interface SchemaValidation {
  format?: string
  pattern?: string
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
  minItems?: number
  maxItems?: number
  uniqueItems?: boolean
  enum?: any[]
}

export interface ParsedCRD {
  name: string
  group: string
  kind: string
  scope: 'Namespaced' | 'Cluster'
  versions: {
    name: string
    served: boolean
    storage: boolean
  }[]
}
