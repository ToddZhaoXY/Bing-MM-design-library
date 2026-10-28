import { createElement, type ComponentType, type ReactNode } from 'react'
import { components } from '../data/components'
import * as publicComponents from './index'
import type { Values, LiveProps } from './Workbench'

export const TAGS = Object.fromEntries(components.map(def => [def.slug, def.tag!]))
export const RENDERERS: Record<string, (values: Values, onLive: (live: LiveProps) => void) => ReactNode> = Object.fromEntries(components.map(def => {
  const component = (publicComponents as unknown as Record<string, ComponentType<Record<string, unknown>>>)[def.tag!]
  if (!component) throw new Error(`Missing public Video component: ${def.tag}`)
  return [def.slug, (values: Values, onLive: (live: LiveProps) => void) => createElement(component, { ...Object.fromEntries(def.props.map(prop => [prop.name, prop.kind === 'select' && prop.numeric ? Number(values[prop.name] ?? prop.default) : values[prop.name] ?? prop.default])), onLive })]
}))
