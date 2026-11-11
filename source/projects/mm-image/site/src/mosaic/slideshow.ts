import type { MosaicAdapter } from './generators'
import { basic, button, col, finish, image, node, row, text } from './builders'
import { slideshowSelection, slideshowSizes, slideshowSlides, slideIndex } from '../data/slideshow'

export const slideshowAdapter: MosaicAdapter = {
  status: 'partial', identity: 'Selected slide → Image + content + pagination controls',
  componentTypes: ['Basic', 'Col', 'Row', 'Image', 'Text', 'Badge', 'Button'],
  notes: [
    'Exports the selected slide and its content using catalog primitives. Absolute overlays, exact cropping, Alice typography, blur and thumbnail hover need host rendering.',
    'The host supplies paging state, keyboard behavior and typed actions. Catalog validity is not visual parity with the React specimen.',
  ],
  generate(values, live) {
    const { size, pagination, state } = slideshowSelection(values)
    const { width, height } = slideshowSizes[size]
    const slides = slideshowSlides(size, pagination)
    const index = slideIndex(live.initialIndex, slides.length)
    const selected = slides[index]
    const children = [image(selected.src, selected.alt, { width, height, fit: 'cover' })]
    if (pagination === 'Bottom bars') {
      children.push(node('Badge', { label: `${size === '3:4' ? 24 : 23} images`, size: 'sm', color: 'secondary', variant: 'solid', pill: true }))
      children.push(text(selected.title, { size: 'lg', weight: 'normal' }), text(selected.description, { size: size === '3:2' ? 'sm' : 'md' }))
      if (state === 'Hover') children.push(row(slides.map((slide, i) => image(slide.src, `Preview slide ${i + 1}${i === index ? ' (selected)' : ''}`, { width: size === '5:4' ? 110 : size === '3:4' ? 64 : 54, height: size === '5:4' ? 110 : size === '3:4' ? 64 : 54 })), { gap: size === '3:4' ? 2 : 3 }))
    } else if (pagination === 'Top bars' || pagination === 'Bottom bars + arrows') {
      children.push(text(selected.title, { size: 'md', weight: 'bold' }))
      if (pagination === 'Bottom bars + arrows' && index === 0 && selected.source) children.push(text(selected.source, { size: 'sm' }))
    }
    if (selected.seeMore) children.push(button('See more'))
    children.push(row([
      button('Previous slide', { disabled: index === 0 }),
      text(selected.seeMore ? 'More' : `${index + 1} of ${slides.filter(slide => !slide.seeMore).length}`, { size: 'sm' }),
      button('Next slide', { disabled: index === slides.length - 1 }),
    ], { gap: 2 }))
    return finish(basic([col(children, { width, gap: 2 })]), [
      `SlideShow ${size} / ${pagination} / ${state}: selected preview slot ${index + 1} of ${slides.length}. This is a linear SDL fallback, not the overlaid card.`,
      'Absolute positioning, exact image crop, layered gradients, blur, Alice font and indicator/thumbnail hover require host rendering.',
      'Paging and See more need host state and ActionConfig; no autoplay timing is specified by Figma.',
      'Local reference images must be replaced with reachable product/CDN URLs before publishing in Mosaic.',
    ])
  },
}
