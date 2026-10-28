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

export interface MosaicValidationResult {
  valid: boolean
  nodeCount: number
  componentTypes: string[]
  issues: MosaicValidationIssue[]
}

export interface MosaicGeneration {
  node: MosaicSdlNode
  validation: MosaicValidationResult
  warnings: string[]
}

export type MosaicValues = Record<string, string | boolean>
export type MosaicLiveProps = Record<string, unknown>

export interface MosaicGenerationContext {
  surface?: 'serp' | 'irp' | 'blank'
  width?: number
  tileAll?: MosaicValues
  tileOne?: Record<number, MosaicValues>
}

export type MosaicGenerator = (
  values: MosaicValues,
  live: MosaicLiveProps,
  context?: MosaicGenerationContext,
) => MosaicGeneration
