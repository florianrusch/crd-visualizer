/**
 * Main CRD parser composable
 */

import { parseYamlOrJson } from '~/utils/yaml-parser'
import type { CRDDefinition } from '~/types/crd'
import type { ParseError } from '~/types/visualization'

export function useCrdParser() {
  function parseCrd(input: string): {
    crd: CRDDefinition | null
    error?: ParseError
    format?: 'yaml' | 'json'
  } {
    // Parse the input
    const { data, format, error: parseError } = parseYamlOrJson(input)

    if (parseError) {
      return { crd: null, error: parseError, format }
    }

    if (!data) {
      return {
        crd: null,
        format,
        error: {
          message: 'Parsed data is empty',
          type: 'structure'
        }
      }
    }

    // Validate basic CRD structure
    const validationError = validateCrdStructure(data)
    if (validationError) {
      return { crd: null, error: validationError, format }
    }

    return { crd: data as CRDDefinition, format }
  }

  function validateCrdStructure(data: any): ParseError | null {
    if (typeof data !== 'object' || data === null) {
      return {
        message: 'Input must be an object',
        type: 'structure'
      }
    }

    if (!data.apiVersion) {
      return {
        message: 'Missing required field: apiVersion',
        type: 'structure'
      }
    }

    if (data.kind !== 'CustomResourceDefinition') {
      return {
        message: `Invalid kind: expected "CustomResourceDefinition", got "${data.kind}"`,
        type: 'structure'
      }
    }

    if (!data.spec) {
      return {
        message: 'Missing required field: spec',
        type: 'structure'
      }
    }

    if (!data.spec.group) {
      return {
        message: 'Missing required field: spec.group',
        type: 'structure'
      }
    }

    if (!data.spec.names || !data.spec.names.kind) {
      return {
        message: 'Missing required field: spec.names.kind',
        type: 'structure'
      }
    }

    if (!data.spec.versions || !Array.isArray(data.spec.versions)) {
      return {
        message: 'Missing or invalid field: spec.versions must be an array',
        type: 'structure'
      }
    }

    if (data.spec.versions.length === 0) {
      return {
        message: 'spec.versions array is empty',
        type: 'structure'
      }
    }

    // Validate at least one version has a schema
    const hasSchema = data.spec.versions.some((v: any) => v.schema?.openAPIV3Schema)
    if (!hasSchema) {
      return {
        message: 'No version contains a valid schema.openAPIV3Schema',
        type: 'schema'
      }
    }

    return null
  }

  return {
    parseCrd,
    validateCrdStructure
  }
}
