export interface MosaicSdlNode {
  type: string
  children?: MosaicSdlNode[]
  [property: string]: unknown
}

export type MosaicValidationSeverity = 'error' | 'warning'

export interface MosaicValidationIssue {
  severity: MosaicValidationSeverity
  path: string
  message: string
}

export interface MosaicValidationCoverage {
  mode: 'catalog-snapshot'
  checked: string[]
  /** These values have only been checked as objects/arrays, not against nested contracts. */
  opaqueProperties: { path: string; catalogType: string }[]
  limitations: string[]
}

export interface MosaicValidationResult {
  /** True means the available catalog checks passed, not runtime/product validation. */
  valid: boolean
  nodeCount: number
  componentTypes: string[]
  issues: MosaicValidationIssue[]
  coverage: MosaicValidationCoverage
}

export interface MosaicGeneration {
  node: MosaicSdlNode
  validation: MosaicValidationResult
  warnings: string[]
}

export type MosaicValues = Record<string, string | boolean>
export type MosaicLiveProps = Record<string, unknown>

export interface MosaicGenerationContext {
  surface?: 'serp' | 'blank' | 'creator'
  width?: number
  tileAll?: MosaicValues
  tileOne?: Record<number, MosaicValues>
}

export type MosaicGenerator = (
  values: MosaicValues,
  live: MosaicLiveProps,
  context?: MosaicGenerationContext,
) => MosaicGeneration
