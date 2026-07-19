---
name: taste-skill
description: "Use when building frontend, UI components, design decisions, or when user wants guidance on balancing taste vs speed vs quality. NOT for backend-only work."
---

# Taste Skill - Frontend Design Excellence

## When to Use
- Building UI components
- Design decisions needed
- Balancing aesthetics vs speed
- Frontend architecture
- CSS/styling choices
- "Which approach is better?"
- "What would you do?"

## Portuguese Triggers
- "qualidade de código"
- "design frontend"
- "melhor abordagem"
- "beleza vs velocidade"
- "trade-off"
- "taste" (English trigger)

## The 3 Dials Framework

### Dial 1: TASTE (Aesthetics & Craft)
```
High Taste:   Pixel-perfect, thoughtful details, premium feel
Medium Taste: Good enough, functional beauty
Low Taste:    Functional, gets the job done

Use HIGH taste for:
- Landing pages, marketing sites
- User-facing components
- Brand-critical interfaces
- Demo/prototype work

Use LOW taste for:
- Internal tools
- Rapid prototyping
- MVPs before product-market fit
- Proof of concepts
```

### Dial 2: SPEED (Time to Ship)
```
Fast:   Ship today, iterate tomorrow
Medium: Thoughtful velocity
Slow:   Investment for long-term

Use FAST when:
- Deadlines are tight
- Testing hypotheses
- Proof of concept
- User needs it NOW

Use SLOW when:
- Building foundations
- Creating systems
- Long-term products
- Repeated patterns
```

### Dial 3: QUALITY (Technical Excellence)
```
High Quality: Test coverage, types, best practices
Medium:       Reasonably clean, works well
Low Quality:   Works, worry about tech debt later

Use HIGH quality for:
- Critical paths
- High-traffic code
- Long-lived systems
- Shared libraries

Use LOW quality for:
- Temporary code
- Experiments
- One-off scripts
- Throwaway prototypes
```

## Anti-Slop Patterns

### What Good Taste Looks Like
- [ ] Consistent spacing scale
- [ ] Thoughtful color palette
- [ ] Meaningful animations (not gratuitous)
- [ ] Proper typography hierarchy
- [ ] Considered negative space
- [ ] Functional micro-interactions

### What Slop Looks Like (AVOID)
- Tailwind defaults without customization
- Generic stock design
- Inconsistent spacing (magic numbers)
- Too many fonts/colors
- Animations that don't communicate
- Over-engineering simple things
- Copy-paste without thought

## Frontend Design Quick Tips

### Colors
```
Good:   Pick 3-4 colors, use them consistently
Slop:   Use Tailwind defaults everywhere
```

### Typography
```
Good:   One font family, 3-5 sizes max
Slop:   5 different fonts, random sizes
```

### Spacing
```
Good:   Consistent scale (4, 8, 12, 16, 24, 32, 48, 64)
Slop:   Random values (7, 13, 21, 34)
```

### Animations
```
Good:   Purposeful, 200-400ms, ease-out
Slop:   Bouncing, spinning, blinking
```

## Dial Combinations

### Production App (High Taste, Medium Speed, High Quality)
```
- Custom design system
- Thoroughly tested
- Proper architecture
- Shipped thoughtfully
```

### Startup MVP (Low Taste, Fast, Low Quality)
```
- Tailwind defaults
- Minimal testing
- Ship now, iterate later
- Functional but raw
```

### Marketing Site (High Taste, Medium, Medium Quality)
```
- Pixel-perfect design
- Light interactivity
- Content-focused
- Premium feel
```

### Internal Tool (Low Taste, Fast, Medium Quality)
```
- Functional design
- Gets the job done
- Minimal polish
- Focus on UX (not visuals)
```

## Decision Framework

```markdown
# Design Decision: [What]
Context: [Why this is being built]
Audience: [Who uses it]
Priority: [What's most important]

## Options
1. [Option A]
   Taste: ⭐⭐⭐
   Speed: 🏃♀️🏃♀️
   Quality: ✅✅✅

2. [Option B]
   Taste: ⭐⭐
   Speed: 🏃♀️🏃♀️🏃♀
   Quality: ✅✅

## Recommendation
Based on dials: [X]
Because: [Reasoning]
```

## When to Override User Preferences

If user says "just make it work" but asks for:
- Landing page design
- Customer-facing features
- Brand-critical components

→ Gently suggest higher taste setting

If user says "make it perfect" but deadline is today:
- Suggest MVP with taste
- Plan for iteration
- Don't over-engineer

## Related Skills
- frontend-design: General frontend patterns
- ui-styling: CSS implementation
- design-system: Design token architecture
- transitions-dev: Animation guidance