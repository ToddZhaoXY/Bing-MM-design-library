# AIGC architecture

The application preserves MM_ACF's level-first registry, property workbench, React API,
page assembler and catalog-validated flattened SDL v2.

```text
Scoped Figma export → checked source fragments → component-registry.json
                                            ├─ navigation and component documentation
                                            ├─ Workbench → React preview + JSX
                                            ├─ Playground → registered page state
                                            └─ Mosaic generators → SDL v2 → validator
```

React composes image molecules, controls and helper parts into content, history,
carousel and the SERP answer. Five helper workbenches use partOf to sit beneath
their parent in navigation. SourceCatalog maps all 16 source families to live pages.

values holds registry properties; live holds current interaction overrides. JSX
and SDL use the same effective values. JSON import validates the version, known
slugs, enums/types, unique IDs and payload size before replacing the canvas.
Viewing scale does not change generated component dimensions.

The design has fixed desktop dimensions. Workbenches offer Fit and 100% views.
Creator uses the 1208 px answer body; SERP uses the 1600 px source page. Custom assemblies
can include any of the 17 components. Runtime selection and edited prompt values
are reflected in copied code and saved page state.

Mosaic uses only fields present in the inherited catalog snapshot. Source blur,
overlays, exact vector appearance, portal positioning and platform actions have
explicit gap warnings. Missing nested action/resource schemas are outer-shape
checks only, never claimed as fully validated.

Image hashes remain stable in figma-assets.json while URLs point to optimized
local files. The build excludes raw export archives and unoptimized copies.
Source provenance and extraction tooling are kept outside the runtime bundle.
