---
name: ui-styling
description: "Use when implementing CSS styles, Tailwind classes, component styling, or when user asks about 'CSS', 'Tailwind', 'styled-components', 'component styles', 'CSS variables'"
---

# UI Styling - CSS & Implementation

## When to Use
- User asks to style components
- Implementing design system tokens in CSS
- Using Tailwind CSS
- CSS custom properties / variables
- Component-level styling

## Portuguese Triggers
- "estilizar componente"
- "Tailwind CSS"
- "CSS variables"
- "design tokens CSS"
- "styled-components"

## CSS Architecture

### 1. Variables (Design Tokens)
```css
:root {
  /* Colors */
  --color-primary: #3B82F6;
  --color-primary-hover: #2563EB;
  --color-secondary: #10B981;
  --color-background: #FFFFFF;
  --color-text: #1F2937;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* Borders */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms ease;
}
```

### 2. Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
        },
        secondary: '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
}
```

### 3. Component Classes
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-6);
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### 4. Responsive Patterns
```css
/* Mobile-first */
.card {
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .card {
    padding: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .card {
    padding: var(--space-8);
  }
}
```

## Tailwind Utility Classes

### Spacing
```html
<div class="p-4 m-2 space-y-4">
  <div class="px-3 py-2">Content</div>
</div>
```

### Typography
```html
<h1 class="text-3xl font-bold text-gray-900">
  Title
</h1>
<p class="text-base text-gray-600 leading-relaxed">
  Body text
</p>
```

### Colors & Backgrounds
```html
<button class="bg-blue-500 text-white hover:bg-blue-600">
  Primary Button
</button>
<div class="bg-gray-100 border border-gray-200">
  Card
</div>
```

### Layout
```html
<div class="flex items-center justify-between">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
```

### Interactive
```html
<button class="transition-all duration-300 hover:scale-105 focus:ring-2">
  Animated Button
</button>
```

## Common Patterns

### Card Component
```html
<div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
  <h3 class="text-lg font-semibold mb-2">Title</h3>
  <p class="text-gray-600">Content</p>
</div>
```

### Form Input
```html
<input
  type="text"
  class="w-full px-4 py-2 border border-gray-300 rounded-lg
         focus:ring-2 focus:ring-blue-500 focus:border-transparent
         transition-all"
  placeholder="Enter text"
/>
```

### Navigation
```html
<nav class="flex items-center justify-between px-6 py-4 bg-white border-b">
  <div class="flex items-center space-x-8">
    <a href="#" class="text-gray-700 hover:text-blue-600">Link</a>
  </div>
</nav>
```

## Best Practices

### DO
- Use CSS custom properties for design tokens
- Use Tailwind for utility classes
- Keep specificity low
- Use consistent spacing scale
- Test responsive breakpoints

### DON'T
- Use inline styles (except dynamic values)
- Use !important
- Mix Tailwind and custom CSS arbitrarily
- Hardcode color values
- Forget hover/focus states

## Animation Quick Reference

```css
/* Hover effect */
.hover-scale {
  transition: transform var(--transition-fast);
}
.hover-scale:hover {
  transform: scale(1.05);
}

/* Fade in */
.fade-in {
  animation: fadeIn var(--transition-normal) ease forwards;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## Related Skills
- design-system: Design token architecture
- ui-ux-pro-max: Style recommendations
- transitions-dev: Animation guidance