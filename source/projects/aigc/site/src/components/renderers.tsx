import type { ReactNode } from 'react'
import type { LiveProps, Values } from './Workbench'
import { MainImageArea, ImageDisplayList, HistoryPanelImages } from './AigcMolecules'
import type { AigcAspectRatio, MainImageStatus, HistoryImageKind, HistoryImageState } from './AigcMolecules'
import { ActionBar, CreationComposer, StyleMenu, SignInPrompts, ErrorStates } from './AigcControls'
import type { ActionConfiguration, ComposerState, ComposerMode, CreationStyle, SignInState, ErrorState } from './AigcControls'
import { MainContentArea, HistoryPanel, SerpCarousel, SerpAigcAnswer } from './AigcAssemblies'
import type { MainContentVariant, HistoryVariant, CarouselCategory, AigcAnswerState } from './AigcAssemblies'
import { components } from '../data/components'
import { PromptTemplateCard, CheckmarkCircle, MainImageFooter, DisplayImage, SerpTemplateCard } from './AigcParts'
import type { PromptTemplateVariant, CheckmarkVariant, MainImageFooterVariant, DisplayImageSelection, DisplayImageAspect } from './AigcParts'

export type ComponentRenderer = (values: Values, onLive: (props: LiveProps) => void) => ReactNode
export const RENDERERS: Record<string, ComponentRenderer> = {
  'main-image-area': (v, live) => <MainImageArea property1={v.property1 as AigcAspectRatio} status={v.status as MainImageStatus} prompt={String(v.prompt)} mode={String(v.mode)} onPromptChange={prompt => live({ prompt })} />,
  'image-display-list': (v, live) => <ImageDisplayList property1={v.property1 as '3:2' | '1:1'} selectedIndex={Number(v.selectedIndex)} onSelect={selectedIndex => live({ selectedIndex })} />,
  'history-panel-images': (v, live) => <HistoryPanelImages property1={v.property1 as HistoryImageKind} property2={v.property2 as HistoryImageState} onSelect={() => live({ property2: 'Selected' })} />,
  'main-content-area': (v, live) => <MainContentArea property1={v.property1 as MainContentVariant} selectedIndex={Number(v.selectedIndex)} mainStatus={v.mainStatus as MainImageStatus} onLive={live} />,
  'history-panel': (v, live) => <HistoryPanel property1={v.property1 as HistoryVariant} selectedIndex={Number(v.selectedIndex)} onLive={live} />,
  'sign-in-prompts': v => <SignInPrompts state={v.state as SignInState} />,
  'error-states': v => <ErrorStates state={v.state as ErrorState} />,
  'action-bar': v => <ActionBar configuration={v.configuration as ActionConfiguration} />,
  'creation-composer': (v, live) => <CreationComposer state={v.state as ComposerState} prompt={String(v.prompt || '') || undefined} mode={v.mode as ComposerMode} onLive={live} />,
  'style-menu': (v, live) => <StyleMenu selectedStyle={v.selectedStyle as CreationStyle} showMore={v.showMore === true} onLive={live} />,
  'serp-carousel': (v, live) => <SerpCarousel category={v.category as CarouselCategory} heading={String(v.heading)} onLive={live} />,
  'serp-aigc-answer': (v, live) => <SerpAigcAnswer state={v.state as AigcAnswerState} pageShell={v.pageShell !== false} query={String(v.query)} imageVariant={v.imageVariant as MainContentVariant} selectedIndex={Number(v.selectedIndex)} historyIndex={Number(v.historyIndex)} onLive={live} />,
  'prompt-template-card': v => <PromptTemplateCard property1={v.property1 as PromptTemplateVariant} />,
  'checkmark-circle': v => <CheckmarkCircle property1={v.property1 as CheckmarkVariant} />,
  'main-image-footer': (v, live) => <MainImageFooter property1={v.property1 as MainImageFooterVariant} prompt={String(v.prompt || '')} onPromptChange={prompt => live({ prompt })} />,
  'display-image': (v, live) => <DisplayImage property1={v.property1 as DisplayImageSelection} property2={v.property2 as DisplayImageAspect} onLive={live} />,
  'serp-template-card': () => <SerpTemplateCard />,
}
export const TAGS = Object.fromEntries(components.map(component => [component.slug, component.tag ?? component.name.replace(/\s/g, '')]))
