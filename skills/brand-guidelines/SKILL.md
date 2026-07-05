---
name: brand-guidelines
description: Aplica as diretrizes de marca e identidade visual do NexusAuto. Use quando precisar de consistência visual, cores da marca, tipografia, ou padrões de design em artefatos, documentos, UI ou apresentações.
---

# NexusAuto Brand Guidelines

## Visão Geral

Esta skill garante que todo conteúdo visual e escrito siga a identidade visual do NexusAuto, criando consistência através de todos os artefatos, documentos, interfaces e comunicações.

**Palavras-chave**: branding, identidade visual, cores, tipografia, design system, padrão visual, NexusAuto

---

## Cores da Marca

### Paleta Primária

| Cor | Hex | Uso |
|-----|-----|-----|
| **Nexus Dark** | `#0F172A` | Texto primário, backgrounds escuros, headers |
| **Nexus Light** | `#F8FAFC` | Backgrounds claros, texto sobre escuro |
| **Nexus Blue** | `#3B82F6` | Cor primária de destaque, CTAs, links |
| **Nexus Gray** | `#64748B` | Texto secundário, bordas sutis |

### Paleta de Accent

| Cor | Hex | Uso |
|-----|-----|-----|
| **Auto Orange** | `#F97316` | Ações importantes, alertas, destaques |
| **Tech Green** | `#10B981` | Sucesso, confirmações, métricas positivas |
| **Data Purple** | `#8B5CF6` | Features de IA, automação, analytics |
| **Alert Red** | `#EF4444` | Erros, críticas, atenções urgentes |

### Gradientes

```css
/* Gradiente Primário */
background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);

/* Gradiente Dark */
background: linear-gradient(180deg, #0F172A 0%, #1E293B 100%);

/* Gradiente Accent */
background: linear-gradient(90deg, #F97316 0%, #EF4444 100%);
```

---

## Tipografia

### Fontes Primárias

| Elemento | Fonte | Tamanho | Peso |
|----------|-------|---------|------|
| **H1 / Título** | Inter | 32-40px | 700 (Bold) |
| **H2 / Seção** | Inter | 24-28px | 600 (SemiBold) |
| **H3 / Subseção** | Inter | 20-22px | 600 (SemiBold) |
| **Body** | Inter | 16px | 400 (Regular) |
| **Caption** | Inter | 14px | 400 (Regular) |
| **Code** | JetBrains Mono | 14px | 400 (Regular) |

### Hierarquia de Texto

```
H1: 40px / Bold / #0F172A
H2: 28px / SemiBold / #0F172A
H3: 22px / SemiBold / #1E293B
Body: 16px / Regular / #334155
Caption: 14px / Regular / #64748B
```

### Fallbacks

- Inter → system-ui, -apple-system, sans-serif
- JetBrains Mono → Consolas, Monaco, monospace

---

## Componentes Visuais

### Botões

```css
/* Primary Button */
background: #3B82F6;
color: #FFFFFF;
border-radius: 8px;
padding: 12px 24px;
font-weight: 500;

/* Secondary Button */
background: transparent;
color: #3B82F6;
border: 2px solid #3B82F6;
border-radius: 8px;
padding: 12px 24px;
font-weight: 500;

/* Danger Button */
background: #EF4444;
color: #FFFFFF;
border-radius: 8px;
padding: 12px 24px;
font-weight: 500;
```

### Cards

```css
background: #FFFFFF;
border: 1px solid #E2E8F0;
border-radius: 12px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
padding: 24px;
```

### Ícones

- Use ícones da família **Lucide** ou **Heroicons**
- Tamanho padrão: 20x20px
- Cor: `#64748B` (inativo), `#3B82F6` (ativo)
- Stroke width: 1.5px

---

## Padrões de Layout

### Grid System

- **Colunas**: 12 colunas
- **Gutter**: 24px
- **Margin**: 32px (desktop), 16px (mobile)
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

### Espaçamento

| Token | Valor | Uso |
|-------|-------|-----|
| `xs` | 4px | Micro espaçamentos |
| `sm` | 8px | Elementos próximos |
| `md` | 16px | Elementos relacionados |
| `lg` | 24px | Seções |
| `xl` | 32px | Seções maiores |
| `2xl` | 48px | Divisões de página |

---

## Tom de Voz

### Princípios

1. **Direto e Técnico**: Vá direto ao ponto, use terminologia técnica apropriada
2. **Confiante mas Humilde**: Afirme fatos, admita limitações
3. **Ação-Orientado**: Foque em resultados e próximos passos
4. **Sem Filler**: Corte palavras desnecessárias, seja conciso

### Exemplos

| ❌ Evite | ✅ Prefira |
|----------|-----------|
| "Nós acreditamos que talvez..." | "Os dados mostram..." |
| "É importante notar que..." | "Nota:" |
| "Por favor, note que..." | "Atenção:" |
| "Gostaríamos de sugerir..." | "Recomendação:" |

### Microcopy de UI

| Elemento | Texto |
|----------|-------|
| Botão de salvar | "Salvar mudanças" |
| Botão de cancelar | "Cancelar" |
| Sucesso | "Salvo com sucesso" |
| Erro | "Erro ao salvar. Verifique os dados." |
| Loading | "Processando..." |
| Vazio | "Nenhum dado encontrado" |

---

## Aplicações Práticas

### Documentos (DOCX/PDF)

- Header com logo NexusAuto
- Títulos em Nexus Blue
- Body text em Nexus Dark
- Code blocks com syntax highlighting
- Footer com numeração de página

### Apresentações (PPTX)

- Slide master com gradiente Nexus
- Títulos em Inter Bold
- Body em Inter Regular
- Ícones consistentes
- Máximo 6 bullets por slide

### Interfaces Web

- Navbar em Nexus Dark
- CTAs em Nexus Blue
- Forms com border-radius 8px
- Focus states visíveis
- Dark mode opcional

### Código e Artefatos

- Comments em inglês técnico
- Variáveis em camelCase
- Constantes em UPPER_SNAKE_CASE
- JSDoc/TSDoc para funções públicas

---

## Check de Qualidade

Antes de finalizar qualquer artefato, verifique:

- [ ] Cores seguem a paleta NexusAuto
- [ ] Tipografia usa Inter como primária
- [ ] Hierarquia visual está clara
- [ ] Espaçamento segue o sistema (4/8/16/24/32)
- [ ] Tom de voz é direto e técnico
- [ ] Ícones são consistentes
- [ ] Contraste de cor é acessível (WCAG AA)
- [ ] Responsivo para mobile

---

## Recursos

- **Logo Assets**: `/assets/brand/logo/`
- **Ícones**: Lucide React, Heroicons
- **Ferramentas**: Figma (design system), Storybook (componentes)

---

## Quando Usar Esta Skill

Use esta skill quando:

1. Criar documentos oficiais (propostas, relatórios, specs)
2. Desenvolver interfaces UI/UX
3. Produzir apresentações para stakeholders
4. Gerar artefatos web (HTML/CSS)
5. Escrever comunicação interna ou externa
6. Revisar conteúdo para consistência de marca
7. Criar templates reutilizáveis

**Trigger phrases**: "brand guidelines", "identidade visual", "cores da marca", "padrão NexusAuto", "design system", "template oficial"