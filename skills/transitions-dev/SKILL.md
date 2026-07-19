---
name: transitions-dev
description: "Use when you need production-ready CSS transitions - modal animations, dropdown menus, card hover effects, notification badges, page transitions, or any UI animation. Triggers: 'transição do modal', 'animação dropdown', 'hover effect', 'panel reveal', 'page transition', 'notification badge animation'"
---

# Transitions.dev - Production-Ready CSS Transitions

## When to Use
- User needs smooth UI animations (modal, dropdown, toast, etc.)
- Building interactive components with micro-interactions
- Implementing hover effects, focus states, or loading animations
- User mentions: "transição", "animação", "hover", "efeito", "micro-interaction"

## Portuguese Triggers
- "transição do modal"
- "animação do dropdown"
- "hover effect"
- "painel com animação"
- "notificação com animação"
- "card com efeito hover"
- "toast notification animation"
- "page transition"
- "smooth animation"

## 18 Available Transitions

| # | Name | Portuguese Trigger | Use Case |
|---|------|-------------------|----------|
| 01 | Card resize | "card com resize" | Cards that expand/collapse |
| 02 | Number pop-in | "número com animação" | Stats, counters, badges |
| 03 | Notification badge | "badge de notificação" | Unread counts, alerts |
| 04 | Text states swap | "troca de texto" | Tabs, accordion headers |
| 05 | Menu dropdown | "dropdown com animação" | Navigation menus |
| 06 | Modal open/close | "modal animado" | Dialogs, modals |
| 07 | Panel reveal | "painel reveal" | Side panels, drawers |
| 08 | Page side-by-side | "transição de página" | Page navigation |
| 09 | Icon swap | "troca de ícone" | Toggle states, buttons |
| 10 | Success check | "check de sucesso" | Form submission, confirmations |
| 11 | Avatar group hover | "avatar group" | Team members, user lists |
| 12 | Error state shake | "input com shake" | Form validation |
| 13-18 | Additional transitions | See individual files | Various UI patterns |

## How to Use

### Step 1: Identify the Transition
Match the user's request to one of the 18 transitions above.

### Step 2: Apply the CSS
Each transition has a self-contained CSS snippet with:
- CSS custom properties (--pX-*) on :root
- Transition rules under t-* classes
- prefers-reduced-motion media query for accessibility

### Step 3: Apply to HTML
Add the t-* class to your element:
```html
<div class="t-card-resize">
  <!-- Your card content -->
</div>
```

## CSS Root (Required)
Include this in your CSS:
```css
@import 'transitions-dev/_root.css';
```

Or use the CLI:
```bash
npx transitions-pro add [transition-name]
```

## Motion Tokens
All transitions use consistent motion tokens:
```css
--p-duration-fast: 150ms;
--p-duration-normal: 300ms;
--p-duration-slow: 500ms;
--p-easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
--p-easing-decelerate: cubic-bezier(0, 0, 0.2, 1);
--p-easing-accelerate: cubic-bezier(0.4, 0, 1, 1);
```

## Accessibility
All transitions respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  .t-* {
    animation: none !important;
    transition: none !important;
  }
}
```

## Example: Modal Animation

### 1. Apply CSS (from 06-modal-open-close.md)
```css
.t-modal {
  animation: modal-in 300ms var(--p-easing-decelerate) forwards;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

### 2. Apply to HTML
```html
<div class="t-modal" role="dialog" aria-modal="true">
  <h2>Modal Title</h2>
  <p>Modal content...</p>
</div>
```

## CLI Usage
```bash
# List all available transitions
npx transitions-pro list

# Add a transition
npx transitions-pro add card-resize
npx transitions-pro add modal-open-close
npx transitions-pro add notification-badge

# Install full skill for AI agents
npx skills add Jakubantalik/transitions.dev
```

## Related Skills
- transitions-polish: Combine multiple transitions for complex effects
- frontend-design: General frontend patterns
- ui-ux-pro-max: Design system with motion tokens