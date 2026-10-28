import assets from './figma-assets.json'

/** Original images from the 13 scoped Figma pages; paths work under a static sub-path. */
export function figmaImage(hash: string): string {
  const asset = (assets as Record<string, { url: string }>)[hash]
  if (!asset) throw new Error(`Figma image is not present in the scoped export: ${hash}`)
  return `${import.meta.env?.BASE_URL ?? './'}${asset.url}`
}
export const figmaAssets = assets
