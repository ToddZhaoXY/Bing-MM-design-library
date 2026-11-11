import type { CSSProperties } from 'react'

/** Native layout descriptors, transcribed from the FY25 Figma design contexts. */
export interface CardNode {
  kind: 'box' | 'image' | 'text' | 'action'
  id?: string
  style?: CSSProperties
  children?: CardNode[]
  text?: string
  src?: string
  alt?: string
  action?: 'more' | 'scroll' | 'related' | 'open' | 'next-page'
}
export interface CardVariant {
  id: string
  label: string
  nodeId: string
  tree: CardNode
  notes?: string[]
}
export interface ImageCardGroup {
  size: string
  width: number
  height: number
  variants: CardVariant[]
}
