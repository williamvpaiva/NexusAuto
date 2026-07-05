---
name: frontend-design
description: Princípios e diretrizes para design de interfaces frontend distintas e intencionais. Ajuda com direção estética, tipografia, layout e escolhas que não parecem templates genéricos. Use ao criar novas UIs ou reformular existentes.
---

# Frontend Design

## Filosofia

Approach this as the design lead at a small studio known for giving every client a visual identity that could not be mistaken for anyone else's. This client has already rejected proposals that felt templated, and is paying for a distinctive point of view.

**Make deliberate, opinionated choices about palette, typography, and layout that are specific to this brief.**

---

## Princípios Fundamentais

### 1. Ground It in the Subject

Se o brief não especifica o produto ou assunto, defina você mesmo antes de projetar:

- Nomeie **um sujeito concreto**
- Defina **o público-alvo**
- Estabeleça **o único job da página**

> O sujeito próprio, seus materiais, instrumentos, artefatos e vernáculo é de onde vêm escolhas distintivas.

### 2. Typography Carries Personality

Tipografia carrega a personalidade da página:

- **Pair display and body faces deliberately** - não use as mesmas famílias que usaria em qualquer projeto
- **Set a clear type scale** - pesos, widths e spacing intencionais
- **Make type treatment memorable** - não seja veículo neutro de conteúdo

```css
/* Exemplo: Type Scale Intencional */
:root {
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.75vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 1vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.2rem + 1.5vw, 2rem);
  --text-3xl: clamp(2rem, 1.5rem + 2.5vw, 2.5rem);
  --text-4xl: clamp(2.5rem, 2rem + 3vw, 3.5rem);
}
```

### 3. Structure Is Information

Dispositivos estruturais devem **codificar algo verdadeiro sobre o conteúdo**, não decorar:

- **Numbered markers (01/02/03)**: Apenas se for sequência real (processo, timeline)
- **Dividers**: Quando separam conteúdo semanticamente diferente
- **Labels**: Quando categorizam de forma significativa

> Question if choices like numbered markers actually make sense before incorporating them.

### 4. Leverage Motion Deliberately

Pense onde e se animação serve ao sujeito:

- **Page-load sequence**: Revelação inicial
- **Scroll-triggered reveal**: Conteúdo que emerge
- **Hover micro-interactions**: Feedback tátil
- **Ambient atmosphere**: Estado contínuo sutil

> An orchestrated moment usually lands harder than scattered effects.

### 5. Match Complexity to Vision

- **Maximalist directions**: Precisam de execução elaborada
- **Minimal directions**: Precisam de precisão em spacing, type e detail
- **Elegance**: Executar a visão escolhida bem

---

## Processo de Design

### Fase 1: Brainstorm do Plano de Design

Crie um **compact token system** com:

#### Color (4-6 named hex values)

```
Palette Concept:
- Primary: [descrição do sentimento]
- Secondary: [papel na hierarquia]
- Accent: [quando usar]
- Background: [atmosfera]
- Surface: [camadas]
- Text: [legibilidade]
```

#### Type (2+ roles)

```
Typography System:
- Display face: [caracter + uso restrito]
- Body face: [complementar]
- Utility face: [captions ou data, se necessário]
```

#### Layout (prose + ASCII wireframes)

```
Layout Concept:
[descrição prose de uma sentença]

ASCII Wireframe:
┌─────────────────────────────────────┐
│           HERO SECTION              │
│    Headline + Subhead + CTA         │
└─────────────────────────────────────┘
┌──────────────┬──────────────────────┐
│   Feature 1  │      Feature 2       │
│    Icon +    │     Icon +           │
│    Copy      │     Copy             │
└──────────────┴──────────────────────┘
```

#### Signature (elemento único memorável)

```
Signature Element:
[O único elemento único que esta página será lembrada por]
[Deve incorporar o brief de forma apropriada]
```

---

### Fase 2: Review do Plano

Revise o plano contra o brief:

**Checklist de Anti-Genericidade:**

Se alguma parte lê como **default genérico** que você produziria para qualquer brief similar:

1. **Identifique** qual parte é genérica
2. **Revise** essa parte
3. **Documente** o que mudou e por quê

> Só após confirmar a相对 unicidade do seu plano de design, comece a escrever código.

---

### Fase 3: Implementação

Ao escrever código:

#### CSS Selector Specificity

Cuidado com classes que se cancelam:

```css
/* ❌ Ruim - Classes se cancelam */
.section { padding: 48px; }
.cta { padding: 24px; } /* Qual vence? */

/* ✅ Bom - Especificidade clara */
.section-hero { padding: 48px; }
.section-cta { padding: 24px; }
```

#### Planejamento em Pensamento

Faça muito planejamento e iteração **no seu thinking**, só mostre ao usuário quando tiver alta confiança que vai deliciar.

---

## Restrição e Autocrítica

### Spend Your Boldness in One Place

Deixe o **signature element** ser a única coisa memorável. Mantenha tudo ao redor quieto e disciplinado.

> Cut any decoration that does not serve the brief.

### Quality Floor (Sempre)

- ✅ Responsivo até mobile
- ✅ Keyboard focus visível
- ✅ Reduced motion respeitado
- ✅ Contraste WCAG AA

> Build to a quality floor without announcing it.

### Chanel's Advice

> Before leaving the house, take a look in the mirror and remove one accessory.

---

## Writing in Design

### Words Are Design Material

Palavras aparecem em um design por uma razão: **para tornar mais fácil de entender e usar**.

- **Before writing**: Ask what the design needs to say
- **From user's side**: Name things by what people control and recognize
- **Active voice default**: "Save changes", não "Submit"
- **Consistent vocabulary**: "Publish" → toast "Published"

### Failure and Emptiness

- **Errors**: Explique o que deu errado e como consertar
- **Empty states**: Convite para agir, não mood

### Tone

- Conversational e tuned
- Plain verbs
- Sentence case
- No filler
- Tone matched to brand e audience

---

## Anti-Padrões (Evite)

### 1. Warm Cream Default

```css
/* ❌ Genérico */
background: #F4F1EA;
font-family: 'Playfair Display', serif;
accent: #D97757; /* terracotta */
```

**Quando é OK**: Brief pede explicitamente

### 2. Near-Black + Acid Accent

```css
/* ❌ Genérico */
background: #0A0A0A;
accent: #CCFF00; /* acid green */
```

**Quando é OK**: Brief pede explicitly

### 3. Broadsheet Style

```css
/* ❌ Genérico */
border: 1px solid #000;
border-radius: 0;
font-family: 'GT America', sans-serif;
columns: dense newspaper-like;
```

**Quando é OK**: Brief pede explicitamente

---

## Templates de Direção

### Direção Minimalista

```json
{
  "palette": ["#FFFFFF", "#111111", "#666666", "#E5E5E5"],
  "type": {
    "display": "Neue Haas Grotesk",
    "body": "Neue Haas Grotesk"
  },
  "spacing": "8pt grid",
  "signature": "Tipografia em escala dramática"
}
```

### Direção Maximalista

```json
{
  "palette": ["#FF0066", "#00FF99", "#0066FF", "#FFCC00", "#111111"],
  "type": {
    "display": "Space Grotesk",
    "body": "Inter"
  },
  "spacing": "Variável, baseado em conteúdo",
  "signature": "Colisão de cores + motion orquestrado"
}
```

### Direção Técnica

```json
{
  "palette": ["#0F172A", "#3B82F6", "#64748B", "#F8FAFC"],
  "type": {
    "display": "IBM Plex Sans",
    "body": "IBM Plex Sans",
    "mono": "JetBrains Mono"
  },
  "spacing": "4pt grid",
  "signature": "Data visualization como elemento central"
}
```

---

## Critique Durante Build

### Screenshots

Se seu ambiente suporta, tire screenshots durante o build:

> A picture is worth 1000 tokens.

### Questions de Autocrítica

1. Isso lê como template ou escolha específica?
2. O signature element é memorável?
3. Há decoração que não serve o brief?
4. O contraste é acessível?
5. Funciona em mobile?

---

## Quando Usar Esta Skill

Use quando:

1. Criar nova UI do zero
2. Reformular UI existente
3. Precisar de direção estética distinta
4. Evitar look "AI-generated"
5. Escolher tipografia intencionalmente
6. Definir signature element
7. Criticar seu próprio trabalho durante build

**Trigger phrases**: "design de interface", "UI design", "direção estética", "tipografia", "layout", "não quero template", "design distinto", "frontend design"