/**
 * Kubernetes Custom Resource Definition (CRD) types
 */

export interface CRDDefinition {
  apiVersion: string
  kind: 'CustomResourceDefinition'
  metadata: {
    name: string
    [key: string]: any
  }
  spec: CRDSpec
}

export interface CRDSpec {
  group: string
  names: {
    kind: string
    plural: string
    singular?: string
    shortNames?: string[]
    categories?: string[]
  }
  scope: 'Namespaced' | 'Cluster'
  versions: CRDVersion[]
}

export interface CRDVersion {
  name: string
  served: boolean
  storage: boolean
  schema: {
    openAPIV3Schema: OpenAPIV3Schema
  }
  subresources?: {
    status?: Record<string, any>
    scale?: Record<string, any>
  }
  additionalPrinterColumns?: Array<{
    name: string
    type: string
    jsonPath: string
    description?: string
  }>
}

export interface OpenAPIV3Schema {
  type?: string
  description?: string
  properties?: Record<string, OpenAPIV3Schema>
  items?: OpenAPIV3Schema
  required?: string[]
  enum?: any[]
  default?: any
  format?: string
  pattern?: string
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
  minItems?: number
  maxItems?: number
  uniqueItems?: boolean
  additionalProperties?: boolean | OpenAPIV3Schema
  [key: string]: any
}
