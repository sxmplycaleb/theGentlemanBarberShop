# Design System

## Direction

Milestone 11 uses a warm, restrained luxury language appropriate for a premium
barbershop and a production SaaS dashboard. Interfaces prioritize operational
clarity, accessible contrast, predictable interaction, and low visual noise.

## Theme

Semantic tokens live in `src/app/globals.css`. Light mode uses warm cream
backgrounds, soft beige surfaces, deep brown actions, and a muted brown-gray
text hierarchy. Dark mode uses espresso backgrounds, chocolate surfaces, warm
beige typography, and higher-contrast interactive colors.

The root layout installs a hydration-safe initializer before application
content renders. It reads the `gentleman-theme` local-storage value and falls
back to `prefers-color-scheme`. `ThemeToggle` updates both the document theme
and the persisted preference.

Feature components must use semantic utilities such as `bg-background`,
`bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`,
`text-danger`, and `text-success`. Feature-owned hexadecimal, RGB, HSL, or
OKLCH colors are not permitted.

## Scales

- Spacing follows a 4px base: 4, 8, 12, 16, 20, 24, 32, 40, 48, and 64px.
- Radius tokens are `xs`, `sm`, `md`, `lg`, and `xl`.
- Elevation tokens are `xs`, `sm`, `md`, and `lg`.
- Motion tokens are fast, normal, and slow and share the standard easing curve.
- Interface typography uses the sans stack; premium display headings use the
  serif stack.

## Semantic states

Success, warning, danger, and information each have background, border, text,
and foreground-compatible tokens. Brand `primary` must not be used as an error
color. Status badges and alerts communicate state with text as well as color.

## Accessibility

All interactive elements require visible focus, keyboard operation, disabled
styling, and a minimum practical touch target. Reduced-motion preferences
disable non-essential animation. Light and dark themes must maintain WCAG AA
contrast for normal text and controls.
