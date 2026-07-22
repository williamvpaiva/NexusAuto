---
title: NexusAuto Design System & UI/UX Guidelines
description: Diretrizes de design baseadas no Taste-Skill e Transitions.dev para manter estética premium e animações fluidas.
tags: [ui, ux, design-system, frontend, transitions, taste-skill]
---

# NexusAuto Design System

Este documento estabelece as restrições estéticas e regras de design para todos os projetos desenvolvidos sob a chancela da NexusAuto (incluindo F.A.W 3D, VamoMarcar, HiperNeural, etc.). 

Qualquer Agente de Frontend **deve** ler e aplicar estes princípios ao criar ou modificar componentes da interface, em conformidade com o `ui-visual-validator`.

## 1. O Princípio do Bom Gosto (Taste-Skill)
O objetivo principal é evitar a geração do "boring, generic slop" (código de UI preguiçoso e padronizado). O design deve sempre parecer premium, sofisticado e intencional.

### 1.1 Cores e Paletas (Proibição de Cores Genéricas)
- **NUNCA** use as cores padrão do navegador ou versões puras/brilhantes demais (ex: vermelho `#FF0000`, azul `#0000FF`, verde `#00FF00`).
- **SEMPRE** use paletas HSL (Hue, Saturation, Lightness) com baixa saturação para fundos e alta saturação controlada para destaques, ou as paletas extendidas e equilibradas de frameworks como Tailwind (ex: `slate-900`, `zinc-900` para fundos escuros, `indigo-500` para botões primários).
- **Dark Mode Premium:** O dark mode não é apenas "fundo preto e texto branco". Use fundos cinza bem escuros ou azulados (ex: `#0F172A` ou `#121212`) e textos off-white (`#F8FAFC`).

### 1.2 Tipografia Moderna
- A tipografia padrão do navegador está banida.
- Utilize fontes modernas sem serifa como **Inter, Roboto, Outfit, ou Geist**.
- Mantenha uma hierarquia visual clara, utilizando variações de peso (Light, Regular, Medium, Semibold) e cor do texto (ex: texto secundário deve ter opacidade reduzida ou ser um tom de cinza, nunca o mesmo destaque do título principal).

### 1.3 Espaçamento, Bordas e Sombras
- **Respiro (Padding/Margin):** Use espaços generosos para dar "respiro" aos elementos. Layouts apertados parecem amadores.
- **Glassmorphism & Profundidade:** Utilize desfoque de fundo (`backdrop-blur`), bordas sutis translúcidas (ex: `border border-white/10`) e sombras suaves multicamadas para criar profundidade e elegância.
- **Bordas Arredondadas:** Os elementos modernos possuem cantos suaves. Use `rounded-xl`, `rounded-2xl` ou `rounded-full` apropriadamente, mantendo a consistência em todo o projeto.

---

## 2. O Princípio do Movimento (Transitions.dev)
Uma interface estática parece sem vida. O design deve ser dinâmico para incentivar a interação do usuário e criar uma sensação de interface "viva".

### 2.1 Micro-animações (Hover e Focus)
- Todos os elementos interativos (botões, links, cards, inputs) **devem** ter um estado de interação visível.
- Nunca faça mudanças bruscas. Sempre utilize transições suaves (ex: em Tailwind, use `transition-all duration-300 ease-in-out`).
- Efeitos recomendados:
  - Leve elevação em cards ao passar o mouse (`hover:-translate-y-1 hover:shadow-lg`).
  - Mudança sutil no brilho ou cor de botões.
  - Expansão leve na escala (ex: `hover:scale-105`).

### 2.2 Transições de Estado e Layout
- Elementos que aparecem ou somem da tela devem ter fade in/out (animação de opacidade) combinada com um leve deslocamento (slide in/out).
- Se estiver utilizando bibliotecas (como React), considere o uso de `Framer Motion` ou as APIs nativas do navegador para garantir que não haja deslocamentos bruscos de layout (Layout Shifts).

## 3. Checklist do Agente
Antes de submeter um código para o V&V de UI, verifique:
- [ ] A interface aplica fontes modernas e não usa as padrões do navegador?
- [ ] As cores foram escolhidas com base em paletas harmoniosas e não genéricas?
- [ ] Os elementos têm bordas, sombras e espaçamentos proporcionais?
- [ ] Os botões e itens clicáveis possuem micro-animações no `:hover` e `:active`?
- [ ] A aplicação de "Premium Design" foi alcançada de forma clara?

*(Referência base: Integração do repositório Leonxlnx/taste-skill e Jakubantalik/transitions.dev adaptada ao NexusAuto).*
