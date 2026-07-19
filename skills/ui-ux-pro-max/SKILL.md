---
name: ui-ux-pro-max
description: "Use when building UI, designing interfaces, choosing design systems, color palettes, typography, or styles for any project. Triggers: 'design system para SaaS', 'cores para landing page', 'tipografia para fintech', 'estilo glassmorphism', 'bento grid dashboard', 'neumorphism', 'dark mode', 'brutalism', 'flat design'"
---

# UI-UX Pro Max - Design Intelligence System

## When to Use
- User wants a complete design system
- Choosing colors, typography, or styles
- Building UI components
- User mentions: design system, colors, typography, UI style
- Landing page, dashboard, mobile app, SaaS product

## Portuguese Triggers
- "design system para [produto]"
- "cores para landing page"
- "tipografia para [setor]"
- "estilo [glassmorphism/neumorphism/brutalism]"
- "bento grid dashboard"
- "paleta neo-brutalism"
- "dark mode fintech"
- "mobile UI e-commerce"

## Design System Generation

### How It Works
```
1. USER REQUEST → "Build landing page for beauty spa"
2. MULTI-DOMAIN SEARCH (5 parallel):
   - Product type matching (192 categories)
   - Style recommendations (84 styles)
   - Color palette selection (192 palettes)
   - Landing page patterns (34 patterns)
   - Typography pairing (74 fonts)
3. REASONING ENGINE
   - BM25 ranking
   - Anti-pattern filtering
4. COMPLETE DESIGN SYSTEM OUTPUT
```

### CLI Usage
```bash
# Install CLI
npm install -g ui-ux-pro-max-cli

# Generate design system
uipro init --ai claude

# Direct search
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness" --design-system -p "Serenity Spa"
```

## 84 UI Styles

### Popular Styles (Top 20)
| # | Style | Portuguese Trigger | Best For |
|---|-------|-------------------|----------|
| 1 | Minimalism & Swiss Style | "minimalismo" | Enterprise, dashboards |
| 2 | Neumorphism | "neumorphism" | Wellness, meditation |
| 3 | Glassmorphism | "glassmorphism" | Modern SaaS, fintech |
| 4 | Brutalism | "brutalism" | Portfolios, creative |
| 5 | Claymorphism | "claymorphism" | Educational, children's |
| 6 | Dark Mode (OLED) | "dark mode" | Night apps, coding |
| 7 | Bento Grid | "bento grid" | Dashboards, features |
| 8 | Cyberpunk UI | "cyberpunk" | Gaming, crypto |
| 9 | Soft UI Evolution | "soft UI" | Modern SaaS |
| 10 | Neubrutalism | "neubrutalism" | Gen Z, startups |
| 11 | Aurora UI | "aurora UI" | Creative agencies |
| 12 | Biophilic/Organic | "biophilic" | Wellness, sustainability |
| 13 | AI-Native UI | "AI-native" | AI products, chatbots |
| 14 | Accessible & Ethical | "accessible" | Government, healthcare |
| 15 | Retro-Futurism | "retro-futurism" | Gaming, entertainment |
| 16 | Vaporwave | "vaporwave" | Music, aesthetics |
| 17 | Pixel Art | "pixel art" | Indie games, retro |
| 18 | Motion-Driven | "motion-driven" | Portfolios |
| 19 | Gradient Mesh | "gradient mesh" | Hero sections |
| 20 | Editorial Grid | "editorial" | News, magazines |

## 192 Color Palettes (by Industry)

### Tech & SaaS
| Sector | Primary | Secondary | CTA | Background |
|--------|---------|-----------|-----|------------|
| SaaS | #3B82F6 | #10B981 | #F59E0B | #F8FAFC |
| Fintech | #1E40AF | #059669 | #DC2626 | #F0FDF4 |
| AI/Chatbot | #7C3AED | #EC4899 | #06B6D4 | #FAF5FF |
| Cybersecurity | #0F172A | #22C55E | #EF4444 | #0F172A |

### Healthcare & Wellness
| Sector | Primary | Secondary | CTA | Background |
|--------|---------|-----------|-----|------------|
| Medical | #0EA5E9 | #10B981 | #F97316 | #F0F9FF |
| Dental | #06B6D4 | #84CC16 | #F43F5E | #ECFEFF |
| Spa/Wellness | #E8B4B8 | #A8D5BA | #D4AF37 | #FFF5F5 |
| Mental Health | #8B5CF6 | #F59E0B | #06B6D4 | #F5F3FF |

### E-commerce
| Sector | Primary | Secondary | CTA | Background |
|--------|---------|-----------|-----|------------|
| Luxury | #1F2937 | #92400E | #B45309 | #FFFBEB |
| Fashion | #171717 | #DC2626 | #2563EB | #FAFAFA |
| Food Delivery | #EA580C | #16A34A | #CA8A04 | #FFF7ED |

## 74 Typography Pairings

### Modern SaaS
```
Headings: Inter (700, 600)
Body: Inter (400, 500)
Mono: JetBrains Mono
```

### Finance & Corporate
```
Headings: IBM Plex Sans (600, 700)
Body: IBM Plex Sans (400, 500)
Mono: IBM Plex Mono
```

### Creative & Portfolio
```
Headings: Playfair Display (700)
Body: Source Sans Pro (400)
Accent: Crimson Pro (400 italic)
```

### Wellness & Beauty
```
Headings: Cormorant Garamond (500, 600)
Body: Montserrat (400, 500)
Accent: Lora (400 italic)
```

## 161 Reasoning Rules (Industry-Specific)

### Tech & SaaS
- **SaaS**: Hero-centric, social proof, trial CTA
- **Developer Tool**: Dark mode default, code snippets prominent
- **B2B Service**: Trust signals, case studies, authority

### Healthcare
- **Medical**: Clean, accessible, appointment CTA
- **Mental Health**: Calming colors, soft transitions, privacy-focused
- **Pharmacy**: Professional, trust, clear information hierarchy

### Finance
- **Banking**: Trust colors (blues, greens), data security emphasis
- **Fintech**: Modern, digital-first, dark mode popular
- **Crypto**: Bold colors, speculative, community-driven

### E-commerce
- **Luxury**: Minimal, premium, high-quality imagery
- **Fashion**: Visual-forward, editorial, trends
- **Food Delivery**: Appetizing colors, fast, local

## Design System Output Template

```markdown
# Design System: [Product Name]

## Pattern
[Recommended Landing Page Pattern]

## Style
- Primary: [Style Name]
- Keywords: [Style keywords]
- Best For: [Use cases]
- Performance: Excellent/Good/Fair
- Accessibility: WCAG AA/AAA

## Colors
- Primary: #XXXXXX
- Secondary: #XXXXXX
- CTA: #XXXXXX
- Background: #XXXXXX
- Text: #XXXXXX

## Typography
- Headings: [Font Family]
- Body: [Font Family]
- Google Fonts: [Link]

## Key Effects
- Shadows: [type]
- Transitions: [duration]
- Hover states: [description]

## Anti-Patterns
- AVOID: [specific things to avoid]

## Pre-Delivery Checklist
- [ ] No emojis as icons
- [ ] cursor-pointer on clickable
- [ ] Hover states smooth
- [ ] prefers-reduced-motion
- [ ] Responsive breakpoints
```

## Related Skills
- design-system: Master design system wrapper
- ui-styling: CSS-specific styling guidance
- transitions-dev: Animation/motion guidance
- frontend-design: General frontend patterns