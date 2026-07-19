---
name: design-system
description: "Use when creating or documenting design systems, design tokens, component libraries, or when user asks about 'design system', 'design tokens', 'component library', 'master design', 'overrides pattern'"
---

# Design System - Master Design Framework

## When to Use
- User asks to create a design system
- User mentions "design tokens", "component library"
- User wants master + page overrides pattern
- Setting up design system for team/project
- Documenting existing design decisions

## Portuguese Triggers
- "criar design system"
- "design tokens"
- "componente raiz"
- "master + overrides"
- "padrão de design"

## Master + Overrides Pattern

### Structure
```
design-system/
├── MASTER.md           # Global Source of Truth
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   ├── Components
│   └── Patterns
└── pages/
    ├── dashboard.md    # Page-specific overrides
    ├── checkout.md    # Only deviations from Master
    └── profile.md
```

### Retrieval Priority
1. Check page-specific file (e.g., `pages/dashboard.md`)
2. If exists → merge overrides with Master
3. If not → use Master exclusively

### Example: Master.md
```markdown
# Design System Master

## Colors
- Primary: #3B82F6 (Blue 500)
- Secondary: #10B981 (Emerald 500)
- Background: #FFFFFF
- Text: #1F2937 (Gray 800)

## Typography
- Font: Inter
- Headings: 600 weight
- Body: 400 weight
- Line height: 1.5

## Spacing
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96

## Components
### Button
- Padding: 12px 24px
- Border radius: 8px
- Font weight: 500
```

### Example: pages/dashboard.md
```markdown
# Dashboard Overrides

## Colors (override Master)
- Primary: #8B5CF6 (Purple for dashboard accent)
- Background: #F8FAFC (Light gray)

## Components
### Card
- Border radius: 12px
- Shadow: soft

### DataTable
- Row height: 48px
- Header: sticky
```

## Design Tokens Architecture

### Tier 1: Primitives
```css
--color-blue-100: #DBEAFE;
--color-blue-500: #3B82F6;
--color-blue-900: #1E3A8A;
```

### Tier 2: Semantic
```css
--color-primary: var(--color-blue-500);
--color-primary-hover: var(--color-blue-600);
```

### Tier 3: Component
```css
--button-bg: var(--color-primary);
--button-color: white;
--button-radius: 8px;
```

## Component Documentation Template

```markdown
## [Component Name]

### States
- Default
- Hover
- Active
- Disabled
- Loading

### Props/Parameters
| Name | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' | 'primary' | Visual style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Size variant |

### Usage
```html
<Button variant="primary" size="md">
  Click me
</Button>
```

### Accessibility
- Role: button
- aria-label: [if icon-only]
- focus-visible: ring
- keyboard: Enter/Space to activate
```

## Design System CLI

### Install UI-UX Pro Max
```bash
npm install -g ui-ux-pro-max-cli
uipro init --ai claude
```

### Generate Design System
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "[product type]" --design-system --persist -p "[ProjectName]"
```

## Related Skills
- ui-ux-pro-max: Design intelligence with 84 styles
- ui-styling: CSS implementation
- transitions-dev: Motion and animation tokens