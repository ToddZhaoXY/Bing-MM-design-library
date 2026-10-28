# Video ACF scope

Source: https://www.figma.com/design/fRSRroY4YFgJSeqLLE0Y38/MM-ACF

The screenshot selects 15 content pages, recorded exactly in design/scope.json.
Divider pages label the hierarchy and are not component pages. The separate
Video Card page (940:470) and all other unlisted pages are excluded. Shared video
dependencies on the selected Components page remain in scope.

Architecture follows the existing MM_ACF / AIGC-ACF library: React, TypeScript,
Vite, registry, properties, semantic JSX, page assembly, state round-trip and
flattened Mosaic SDL v2 with the reference catalog validator.

Delivery includes a source archive and a static deployment ZIP with index.html
at its root. Source variants and unfinished design states must be distinguished
from runtime controls. Real product navigation and video services require host
integration unless the scoped source provides actual media.
