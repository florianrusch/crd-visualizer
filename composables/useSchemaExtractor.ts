/**
 * Extract OpenAPI v3 schema from CRD
 */

import type { CRDDefinition, CRDVersion, OpenAPIV3Schema } from '~/types/crd'
import type { ParsedCRD } from '~/types/schema'

export function useSchemaExtractor() {
  function extractMetadata(crd: CRDDefinition): ParsedCRD {
    return {
      name: crd.metadata.name,
      group: crd.spec.group,
      kind: crd.spec.names.kind,
      scope: crd.spec.scope,
      versions: crd.spec.versions.map((v) => ({
        name: v.name,
        served: v.served,
        storage: v.storage
      }))
    }
  }

  function extractSchema(crd: CRDDefinition, versionName?: string): OpenAPIV3Schema | null {
    // Find the version to extract schema from
    let version: CRDVersion | undefined

    if (versionName) {
      version = crd.spec.versions.find((v) => v.name === versionName)
    } else {
      // Default to storage version, or first served version
      version = crd.spec.versions.find((v) => v.storage) ||
                crd.spec.versions.find((v) => v.served) ||
                crd.spec.versions[0]
    }

    if (!version) {
      return null
    }

    return version.schema?.openAPIV3Schema || null
  }

  function getAvailableVersions(crd: CRDDefinition): string[] {
    return crd.spec.versions.map((v) => v.name)
  }

  function getDefaultVersion(crd: CRDDefinition): string {
    // Return storage version, or first served version, or first version
    const storageVersion = crd.spec.versions.find((v) => v.storage)
    if (storageVersion) return storageVersion.name

    const servedVersion = crd.spec.versions.find((v) => v.served)
    if (servedVersion) return servedVersion.name

    return crd.spec.versions[0].name
  }

  return {
    extractMetadata,
    extractSchema,
    getAvailableVersions,
    getDefaultVersion
  }
}
