---
name: transitions-polish
description: "Use when you need to combine multiple transitions, create complex choreography, or polish existing animations with timing adjustments and easing curves"
---

# Transitions Polish - Combining & Polishing Transitions

## When to Use
- Need to combine multiple transitions (e.g., modal + backdrop fade)
- Polishing existing animations
- Creating complex choreography for page load sequences
- Fine-tuning timing and easing of transitions
- Building multi-step animations

## Portuguese Triggers
- "combinar transições"
- "polir animação"
- "timing da animação"
- "easing personalizado"
- "sequência de animação"
- "choreografia de elementos"

## Core Concepts

### Transition Composition
Combine transitions by applying multiple classes:
```html
<div class="t-modal t-backdrop-fade">
  <!-- Modal with backdrop -->
</div>
```

### Staggered Animations
Create sequences with transition-delay:
```css
.stagger-1 { animation-delay: 0ms; }
.stagger-2 { animation-delay: 50ms; }
.stagger-3 { animation-delay: 100ms; }
.stagger-4 { animation-delay: 150ms; }
```

### Choreography Patterns

#### 1. Page Load Sequence
```css
.page-load > * {
  opacity: 0;
  transform: translateY(20px);
  animation: fade-up 400ms var(--p-easing-decelerate) forwards;
}

.page-load > *:nth-child(1) { animation-delay: 0ms; }
.page-load > *:nth-child(2) { animation-delay: 100ms; }
.page-load > *:nth-child(3) { animation-delay: 200ms; }
.page-load > *:nth-child(4) { animation-delay: 300ms; }
```

#### 2. Modal + Backdrop
```css
.modal-backdrop {
  animation: fade-in 200ms ease forwards;
}
.modal-content {
  animation: modal-in 300ms 100ms var(--p-easing-decelerate) forwards;
}
```

#### 3. Staggered List Items
```css
.list-item {
  opacity: 0;
  transform: translateX(-20px);
}
.list-item.reveal {
  animation: slide-in 300ms var(--p-easing-decelerate) forwards;
}
/* Stagger via nth-child */
.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 50ms; }
.list-item:nth-child(3) { animation-delay: 100ms; }
```

## Easing Reference

### Standard Easings
```css
--p-easing-standard: cubic-bezier(0.4, 0, 0.2, 1);      /* Default */
--p-easing-decelerate: cubic-bezier(0, 0, 0.2, 1);     /* Enter */
--p-easing-accelerate: cubic-bezier(0.4, 0, 1, 1);      /* Exit */
--p-easing-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Bouncy */
```

### Custom Easings
```css
.ease-in-out { transition-timing-function: ease-in-out; }
.ease-out-back { transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
.ease-out-expo { transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
```

## Duration Reference
```css
--p-duration-instant: 50ms;   /* Feedback only */
--p-duration-fast: 150ms;     /* Micro-interactions */
--p-duration-normal: 300ms;    /* Standard transitions */
--p-duration-slow: 500ms;     /* Emphasis */
--p-duration-slower: 700ms;   /* Complex animations */
```

## Common Patterns

### 1. Loading Spinner Sequence
```css
.spinner {
  animation: spin 1s linear infinite;
}
.spinner-dot:nth-child(1) { animation: pulse 1s ease-in-out 0ms infinite; }
.spinner-dot:nth-child(2) { animation: pulse 1s ease-in-out 200ms infinite; }
.spinner-dot:nth-child(3) { animation: pulse 1s ease-in-out 400ms infinite; }
```

### 2. Toast Notification
```css
.toast {
  animation: toast-in 300ms var(--p-easing-spring) forwards;
}
.toast.dismissing {
  animation: toast-out 200ms var(--p-easing-accelerate) forwards;
}
```

### 3. Skeleton Loading
```css
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}
```

### 4. Accordion
```css
.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 300ms var(--p-easing-standard);
}
.accordion.open > .accordion-content {
  max-height: 500px; /* Or measured value */
}
```

## Refine Tool
Use the Refine tool to visually adjust transitions:

```bash
# Inject panel + start relay
npx transitions-refine live

# With LLM backing
npx transitions-refine live --llm
```

Then click "Refine" in the panel to get AI suggestions for your specific animation.

## Related Skills
- transitions-dev: Individual transition implementations
- frontend-design: General frontend patterns