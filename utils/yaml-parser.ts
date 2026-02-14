/**
 * YAML/JSON parsing utilities with error handling
 */

import yaml from 'js-yaml'
import type { ParseError } from '~/types/visualization'

export function parseYamlOrJson(input: string): {
  data: any
  format: 'yaml' | 'json'
  error?: ParseError
} {
  const trimmedInput = input.trim()

  if (!trimmedInput) {
    return {
      data: null,
      format: 'yaml',
      error: {
        message: 'Input is empty',
        type: 'syntax'
      }
    }
  }

  // Try JSON first (faster and more specific)
  if (trimmedInput.startsWith('{') || trimmedInput.startsWith('[')) {
    try {
      const data = JSON.parse(trimmedInput)
      return { data, format: 'json' }
    } catch (e: any) {
      // Extract line and column from JSON error
      const match = e.message.match(/position (\d+)/)
      const position = match ? parseInt(match[1]) : undefined

      let line: number | undefined
      let column: number | undefined

      if (position !== undefined) {
        const lines = trimmedInput.substring(0, position).split('\n')
        line = lines.length
        column = lines[lines.length - 1].length + 1
      }

      return {
        data: null,
        format: 'json',
        error: {
          message: `JSON parsing error: ${e.message}`,
          line,
          column,
          type: 'syntax'
        }
      }
    }
  }

  // Try YAML
  try {
    const data = yaml.load(trimmedInput)
    return { data, format: 'yaml' }
  } catch (e: any) {
    return {
      data: null,
      format: 'yaml',
      error: {
        message: `YAML parsing error: ${e.message}`,
        line: e.mark?.line ? e.mark.line + 1 : undefined,
        column: e.mark?.column ? e.mark.column + 1 : undefined,
        type: 'syntax'
      }
    }
  }
}
