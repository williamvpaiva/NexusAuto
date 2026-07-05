---
name: theme-factory
description: Gera temas visuais completos com paletas de cores, tipografias e tokens de design para projetos UI. Use quando precisar de temas pré-definidos para dashboards, landing pages, ou sistemas de design.
---

# Theme Factory

## Visão Geral

Esta skill gera temas visuais completos e coesos para projetos de interface. Cada tema inclui paleta de cores, tipografia, tokens de espaçamento, e diretrizes de aplicação.

**Palavras-chave**: tema, tema visual, paleta de cores, tipografia, design tokens, UI theme, estilo visual

---

## Biblioteca de Temas

### 1. Nexus Professional (Default)

**Personalidade**: Corporativo moderno, confiável, tech-forward

```json
{
  "name": "Nexus Professional",
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#8B5CF6",
    "accent": "#F97316",
    "background": "#F8FAFC",
    "surface": "#FFFFFF",
    "text": "#0F172A",
    "textSecondary": "#64748B",
    "border": "#E2E8F0",
    "success": "#10B981",
    "warning": "#F59E0B",
    "error": "#EF4444",
    "info": "#3B82F6"
  },
  "typography": {
    "heading": "Inter",
    "body": "Inter",
    "mono": "JetBrains Mono"
  },
  "borderRadius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "xl": "16px"
  },
  "shadows": {
    "sm": "0 1px 2px rgba(0,0,0,0.05)",
    "md": "0 4px 6px rgba(0,0,0,0.1)",
    "lg": "0 10px 15px rgba(0,0,0,0.1)"
  }
}
```

**Uso ideal**: Dashboards enterprise, SaaS B2B, ferramentas internas

---

### 2. Midnight Tech

**Personalidade**: Dark mode nativo, developer-focused, high-contrast

```json
{
  "name": "Midnight Tech",
  "colors": {
    "primary": "#60A5FA",
    "secondary": "#A78BFA",
    "accent": "#34D399",
    "background": "#0F172A",
    "surface": "#1E293B",
    "text": "#F8FAFC",
    "textSecondary": "#94A3B8",
    "border": "#334155",
    "success": "#34D399",
    "warning": "#FBBF24",
    "error": "#F87171",
    "info": "#60A5FA"
  },
  "typography": {
    "heading": "Inter",
    "body": "Inter",
    "mono": "Fira Code"
  },
  "borderRadius": {
    "sm": "4px",
    "md": "6px",
    "lg": "8px",
    "xl": "12px"
  },
  "shadows": {
    "sm": "0 1px 2px rgba(0,0,0,0.3)",
    "md": "0 4px 8px rgba(0,0,0,0.4)",
    "lg": "0 8px 16px rgba(0,0,0,0.5)"
  }
}
```

**Uso ideal**: Ferramentas de desenvolvedor, IDEs, terminais, docs técnicas

---

### 3. Clean Minimal

**Personalidade**: Leve, arejado, foco em conteúdo, menos é mais

```json
{
  "name": "Clean Minimal",
  "colors": {
    "primary": "#111827",
    "secondary": "#6B7280",
    "accent": "#F37311",
    "background": "#FFFFFF",
    "surface": "#F9FAFB",
    "text": "#111827",
    "textSecondary": "#6B7280",
    "border": "#E5E7EB",
    "success": "#059669",
    "warning": "#D97706",
    "error": "#DC2626",
    "info": "#2563EB"
  },
  "typography": {
    "heading": "Plus Jakarta Sans",
    "body": "Inter",
    "mono": "IBM Plex Mono"
  },
  "borderRadius": {
    "sm": "2px",
    "md": "4px",
    "lg": "8px",
    "xl": "12px"
  },
  "shadows": {
    "sm": "0 1px 2px rgba(0,0,0,0.04)",
    "md": "0 2px 4px rgba(0,0,0,0.06)",
    "lg": "0 4px 8px rgba(0,0,0,0.08)"
  }
}
```

**Uso ideal**: Landing pages, portfolios, blogs, conteúdo editorial

---

### 4. Vibrant Creative

**Personalidade**: Energético, criativo, ousado, memorável

```json
{
  "name": "Vibrant Creative",
  "colors": {
    "primary": "#EC4899",
    "secondary": "#8B5CF6",
    "accent": "#F59E0B",
    "background": "#FEF2F2",
    "surface": "#FFFFFF",
    "text": "#1F2937",
    "textSecondary": "#6B7280",
    "border": "#FCA5A5",
    "success": "#10B981",
    "warning": "#F59E0B",
    "error": "#EF4444",
    "info": "#EC4899"
  },
  "typography": {
    "heading": "Space Grotesk",
    "body": "Inter",
    "mono": "JetBrains Mono"
  },
  "borderRadius": {
    "sm": "8px",
    "md": "12px",
    "lg": "16px",
    "xl": "24px"
  },
  "shadows": {
    "sm": "0 2px 4px rgba(236,72,153,0.1)",
    "md": "0 4px 8px rgba(236,72,153,0.15)",
    "lg": "0 8px 16px rgba(236,72,153,0.2)"
  }
}
```

**Uso ideal**: Agências criativas, startups, produtos consumer, marketing

---

### 5. Enterprise Blue

**Personalidade**: Corporativo tradicional, seguro, institucional

```json
{
  "name": "Enterprise Blue",
  "colors": {
    "primary": "#1E40AF",
    "secondary": "#3B82F6",
    "accent": "#06B6D4",
    "background": "#F0F9FF",
    "surface": "#FFFFFF",
    "text": "#1E3A8A",
    "textSecondary": "#64748B",
    "border": "#BFDBFE",
    "success": "#059669",
    "warning": "#D97706",
    "error": "#DC2626",
    "info": "#1E40AF"
  },
  "typography": {
    "heading": "IBM Plex Sans",
    "body": "IBM Plex Sans",
    "mono": "IBM Plex Mono"
  },
  "borderRadius": {
    "sm": "2px",
    "md": "4px",
    "lg": "6px",
    "xl": "8px"
  },
  "shadows": {
    "sm": "0 1px 2px rgba(30,64,175,0.1)",
    "md": "0 2px 4px rgba(30,64,175,0.15)",
    "lg": "0 4px 8px rgba(30,64,175,0.2)"
  }
}
```

**Uso ideal**: Bancos, seguros, governo, healthcare, enterprise tradicional

---

### 6. Nature Calm

**Personalidade**: Orgânico, calmante, sustentável, wellness

```json
{
  "name": "Nature Calm",
  "colors": {
    "primary": "#059669",
    "secondary": "#84CC16",
    "accent": "#D97706",
    "background": "#F7FDF7",
    "surface": "#FFFFFF",
    "text": "#064E3B",
    "textSecondary": "#6B7280",
    "border": "#A7F3D0",
    "success": "#059669",
    "warning": "#D97706",
    "error": "#DC2626",
    "info": "#059669"
  },
  "typography": {
    "heading": "DM Sans",
    "body": "Inter",
    "mono": "IBM Plex Mono"
  },
  "borderRadius": {
    "sm": "6px",
    "md": "10px",
    "lg": "14px",
    "xl": "20px"
  },
  "shadows": {
    "sm": "0 2px 4px rgba(5,150,105,0.08)",
    "md": "0 4px 8px rgba(5,150,105,0.12)",
    "lg": "0 8px 16px rgba(5,150,105,0.16)"
  }
}
```

**Uso ideal**: Apps de wellness, saúde, sustentabilidade, produtos naturais

---

## Como Usar

### Passo 1: Identificar Necessidade

Determine o contexto do projeto:
- **Público-alvo**: Enterprise, consumer, developers?
- **Personalidade**: Formal, casual, criativo?
- **Meio**: Web, mobile, desktop, print?
- **Acessibilidade**: Requer alto contraste?

### Passo 2: Selecionar Tema

Escolha o tema que melhor se alinha com os requisitos.

### Passo 3: Aplicar Tokens

Use os tokens de design para implementar consistentemente:

```css
/* Exemplo de CSS Variables */
:root {
  --color-primary: #3B82F6;
  --color-secondary: #8B5CF6;
  --color-accent: #F97316;
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-text: #0F172A;
  --color-text-secondary: #64748B;
  --color-border: #E2E8F0;
  
  --font-heading: Inter, system-ui, sans-serif;
  --font-body: Inter, system-ui, sans-serif;
  --font-mono: JetBrains Mono, monospace;
  
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

### Passo 4: Gerar Variações

Crie variações para estados:

```css
/* Hover states */
.btn-primary:hover {
  background: color-mix(in srgb, var(--color-primary), black 10%);
}

/* Focus states */
.btn-primary:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Disabled states */
.btn-primary:disabled {
  background: var(--color-border);
  cursor: not-allowed;
}
```

---

## Templates por Tipo de Projeto

### Dashboard Enterprise

```json
{
  "theme": "Nexus Professional",
  "layout": "sidebar-left",
  "density": "compact",
  "features": ["data-tables", "charts", "filters", "bulk-actions"]
}
```

### Landing Page SaaS

```json
{
  "theme": "Clean Minimal",
  "layout": "single-column",
  "density": "comfortable",
  "features": ["hero", "features", "pricing", "testimonials", "cta"]
}
```

### Developer Tool

```json
{
  "theme": "Midnight Tech",
  "layout": "full-width",
  "density": "compact",
  "features": ["code-blocks", "terminal", "docs-nav", "search"]
}
```

### App de Wellness

```json
{
  "theme": "Nature Calm",
  "layout": "mobile-first",
  "density": "spacious",
  "features": ["progress-tracking", "meditation", "breathing", "stats"]
}
```

---

## Guia de Acessibilidade

### Contraste Mínimo (WCAG AA)

- **Texto normal**: 4.5:1
- **Texto grande**: 3:1
- **Elementos de UI**: 3:1

### Verificação de Cores

Sempre verifique contraste antes de publicar:

```
Ferramentas recomendadas:
- WebAIM Contrast Checker
- Stark (Figma/Sketch)
- axe DevTools
```

### Daltonismo

Evite depender apenas de cor para informação:
- Use ícones + cor
- Use padrões + cor
- Use texto explícito

---

## Quando Usar Esta Skill

Use quando:

1. Iniciar novo projeto UI/UX
2. Precisar de tema consistente rapidamente
3. Criar design system do zero
4. Gerar variações de tema (light/dark)
5. Padronizar múltiplos produtos
6. Criar temas para clientes diferentes
7. Prototipar rapidamente

**Trigger phrases**: "criar tema", "theme", "paleta de cores", "design tokens", "tema dark mode", "cor primária", "sistema de design"