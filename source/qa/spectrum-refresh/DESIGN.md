# Library UI refresh · 2026-11-10

Reference: https://spectrum.adobe.com/web/rsp/components/button

## Visual direction

Apply the reference's neutral canvas, rounded white surfaces, restrained shadows, strong black typography and pill-shaped actions to the documentation shell. The Library's own components retain their design-source styling.

- Canvas: `#f5f5f5`; surface: `#ffffff`; ink: `#202020`; secondary text: `#626262`; line: `#e5e5e5`; selected action: `#242424`.
- Typography: native system sans serif; 40px page title, 20px section title, 16px prose, 14px controls and primary navigation, 13px nested navigation. Blue is reserved for a visible keyboard focus ring; semantic source-coverage indicators keep their meaning.
- Layout: a 244px inset navigation surface, a flexible content column, and a 236px properties column within component workbenches. Title and overview share one surface. Large specimens retain Fit and 100% modes and local horizontal scrolling.
- Responsive behavior: properties stack below the preview on smaller screens; navigation becomes a bounded, collapsible block on mobile. The Playground retains its own palette, canvas and inspector layout.

## Review against the brief

The reference's extra icon rail and right-side table of contents would take width from our 1208px image cards and page assemblies, so the existing content organization remains. The rounded surfaces intentionally follow the supplied reference; they mark documentation sections rather than adding new content or dashboards. The existing homepage waterfall and its motion controls are retained with a matching neutral palette.

Implementation stays in the shared documentation theme, header generator and homepage presentation. No specimen renderers, registries, exports or source facts are intentionally changed.
