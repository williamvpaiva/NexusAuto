# Design Workflow - UI/UX Pro Max

## Visão Geral

Este documento descreve o fluxo completo de geração de design no NexusAuto usando o UI/UX Pro Max Agent.

## 🎯 Quando Usar

### Cenários Recomendados
- ✅ **Novas landing pages** - Gerar design completo do zero
- ✅ **Novas features de frontend** - Telas, dashboards, formulários
- ✅ **Redesign de interfaces** - Melhorar UI existente
- ✅ **Sistemas de design** - Criar padrões consistentes
- ✅ **E-commerce** - Páginas de produto, checkout, listagens

### Cenários Opcionais
- ⚠️ **APIs backend** - Apenas se tiver componentes visuais (Swagger UI, admin)
- ⚠️ **Scripts internos** - Apenas se for CLI com UI

### Cenários Não Recomendados
- ❌ **APIs puramente backend** - Sem interface visual
- ❌ **Workers e jobs** - Processamento em background
- ❌ **Bancos de dados** - Schema e migrations

## 📋 Fluxo Completo

### Passo 1: Especificação Funcional (Spec-Kit)

```bash
# Tech Lead gera especificação funcional
/nl-specify "Landing page para spa com hero, sobre, serviços, depoimentos, contato"
```

**Output:**
```
specs/spa-landing/
├── spec.md      # Requisitos funcionais, user stories, critérios de aceite
├── plan.md      # Plano de implementação
└── tasks.md     # Lista de tarefas
```

### Passo 2: Design System (UI/UX Pro Max)

```bash
# Tech Lead gera especificação visual
/design save "Landing page para spa de bem-estar, foco em relaxamento e natureza" "spa-landing"
```

**Output:**
```
✅ Design gerado e salvo
📄 Arquivo: specs/spa-landing/design-spec.md
🎨 Layout: Hero + 4 seções
🌈 Cores: 5 cores definidas
🔤 Tipografia: 2 fontes
✨ Efeitos: 5 efeitos CSS
🚫 Antipadrões: 5 itens
✅ Checklist: 5 itens
```

**Conteúdo de `design-spec.md`:**
```markdown
# Design System Specification - spa-landing

## 🎨 Layout Pattern
Hero com imagem de fundo + seções: Sobre, Serviços, Depoimentos, Contato

## 🌈 Color Palette
| Nome | Hex | Uso |
|------|-----|-----|
| Primary | #2C3E50 | Botões, links, títulos |
| Secondary | #8E8E8E | Texto secundário |
| Accent | #E8D5C4 | Destaques, hover |
| Background | #FFFFFF | Fundos |
| Surface | #F8F9FA | Cards |

## 🔤 Typography
- Headings: Playfair Display (700, 600)
- Body: Lato (400, 500)
- Escala: 12px, 14px, 16px, 20px, 24px, 32px, 48px

## ✨ CSS Effects
- Sombra suave: box-shadow: 0 2px 8px rgba(0,0,0,0.1)
- Transições: transition: all 300ms ease-in-out
- Hover: transform: translateY(-2px)

## 🚫 Anti-patterns
- Evitar cores vibrantes (saturação > 80%)
- Não usar mais de 3 fontes
- Evitar animações > 500ms

## ✅ Checklist
- [ ] WCAG 2.1 AA
- [ ] Mobile-first
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
```

### Passo 3: Implementação (Frontend-Dev)

```bash
# Tech Lead atribui implementação
"frontend-dev, construa a landing page seguindo specs/spa-landing/design-spec.md"
```

**Frontend-dev lê:**
1. `specs/spa-landing/spec.md` - O que construir
2. `specs/spa-landing/design-spec.md` - Como deve parecer

**Frontend-dev implementa:**
```bash
spa-landing/
├── page.tsx           # Componente principal
├── sections/
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Services.tsx
│   ├── Testimonials.tsx
│   └── Contact.tsx
├── styles/
│   ├── globals.css    # Variáveis CSS do design system
│   └── components.css # Estilos específicos
└── utils/
    └── validation.ts  # Validação do formulário
```

### Passo 4: Validação (QA-Tester)

```bash
# Tech Lead atribui validação
"qa-tester, valide a landing page contra o checklist em specs/spa-landing/design-spec.md"
```

**QA-Tester valida:**
- [ ] Contraste de cores (WCAG AA)
- [ ] Navegação por teclado
- [ ] Responsividade (mobile, tablet, desktop)
- [ ] Performance (LCP, CLS, FID)
- [ ] Formulários (validação, erros)

**Output:**
```markdown
# QA Report - spa-landing

## Status: ✅ APROVADO

### Acessibilidade
- ✅ Contraste: 4.8:1 (mínimo 4.5:1)
- ✅ Teclado: Navegação completa
- ✅ Screen readers: Labels em todos inputs

### Performance
- ✅ LCP: 1.8s (meta: < 2.5s)
- ✅ CLS: 0.05 (meta: < 0.1)
- ✅ FID: 45ms (meta: < 100ms)

### Responsividade
- ✅ Mobile (320px)
- ✅ Tablet (768px)
- ✅ Desktop (1024px+)
```

## 🔧 Comandos Disponíveis

### Geração Completa
```bash
/design save "descrição" "feature-name"
# Gera e salva em specs/[feature]/design-spec.md
```

### Apenas Paleta
```bash
/design palette "e-commerce minimalista"
# Retorna apenas cores com hex codes
```

### Apenas Tipografia
```bash
/design typography "dashboard enterprise"
# Retorna apenas fontes e escala
```

### Apenas Checklist
```bash
/design checklist "formulário de checkout"
# Retorna apenas checklist de qualidade
```

### Status do Módulo
```bash
/design status
# Verifica se UI/UX Pro Max está disponível
```

## 📁 Estrutura de Arquivos

```
nexusauto/
├── specs/
│   └── [feature]/
│       ├── spec.md           # Spec-Kit (funcional)
│       ├── design-spec.md    # UI/UX Pro Max (visual)
│       ├── plan.md           # Plano de implementação
│       └── tasks.md          # Tarefas
├── .ai-factory/
│   ├── agents/
│   │   └── ui-ux-pro-max-agent.md
│   ├── scripts/
│   │   ├── ui-ux-pro-max-wrapper.py
│   │   └── ui-ux-pro-max-bridge.js
│   └── workflows/
│       └── design-workflow.md  # ESTE ARQUIVO
└── ui-ux-pro-max/              # Submódulo (opcional)
    ├── core.py
    └── design_system_generator.py
```

## 🎨 Exemplos Práticos

### Exemplo 1: E-commerce de Moda

```bash
# 1. Especificação funcional
/nl-specify "E-commerce de moda com listagem, página de produto, carrinho e checkout"

# 2. Design system
/design save "E-commerce de moda sustentável, minimalista, cores neutras" "fashion-store"

# 3. Implementação
"frontend-dev, construa seguindo specs/fashion-store/design-spec.md"

# 4. Validação
"qa-tester, valide contra checklist em specs/fashion-store/design-spec.md"
```

### Exemplo 2: Dashboard SaaS

```bash
# 1. Especificação funcional
/nl-specify "Dashboard de analytics com gráficos, tabelas e filtros"

# 2. Design system
/design save "Dashboard SaaS enterprise, modo dark, dados densos" "analytics-dashboard"

# 3. Implementação
"frontend-dev, construa seguindo specs/analytics-dashboard/design-spec.md"

# 4. Validação
"qa-tester, valide acessibilidade e performance"
```

### Exemplo 3: Landing Page B2B

```bash
# 1. Especificação funcional
/nl-specify "Landing page B2B com hero, features, pricing, FAQ, contato"

# 2. Design system
/design save "Landing page B2B enterprise, cores da marca (azul #0066CC), foco em conversão" "b2b-landing"

# 3. Implementação
"frontend-dev, construa seguindo specs/b2b-landing/design-spec.md"

# 4. Validação
"qa-tester, valide formulário de captura e performance"
```

## 🚨 Troubleshooting

### Módulo Não Disponível

Se `/design status` retornar "🔴 Módulo não disponível":

```bash
# 1. Verificar submódulo
git submodule status

# 2. Se não existir, adicionar
git submodule add https://github.com/seu-usuario/ui-ux-pro-max.git ui-ux-pro-max
git submodule update --init --recursive

# 3. Verificar wrapper Python
python3 .ai-factory/scripts/ui-ux-pro-max-wrapper.py "teste"

# 4. Verificar bridge Node.js
node -e "import('./.ai-factory/scripts/ui-ux-pro-max-bridge.js').then(m => console.log('OK'))"
```

### Design Genérico

Se o design parecer genérico:

```bash
# Adicione mais contexto na descrição
/design save "Landing page para spa de bem-estar 'Serenidade', com foco em relaxamento, natureza, cores terrosas, público feminino 30-50 anos, estilo minimalista" "serenidade"

# Em vez de:
/design save "Landing page para spa" "serenidade"
```

### Checklist Muito Longo

Se o checklist tiver muitos itens:

```bash
# Gere apenas o essencial
/design checklist "landing page" | head -n 10

# Ou foque em uma categoria
/design checklist "formulário de checkout"  # Específico para forms
```

## 📊 Métricas de Qualidade

### Tempo de Geração
- **Específico:** < 30 segundos
- **Completo:** < 1 minuto
- **Com salvamento:** < 2 minutos

### Cobertura
- **Layout:** 100% das seções descritas
- **Cores:** Mínimo 4 cores (primary, secondary, accent, background)
- **Tipografia:** Mínimo 2 fontes (headings + body)
- **Efeitos:** Mínimo 3 efeitos CSS
- **Antipadrões:** Mínimo 3 itens
- **Checklist:** Mínimo 5 itens

### Satisfação
- **Frontend-dev:** Especificação clara o suficiente para implementar sem dúvidas
- **QA-Tester:** Checklist objetivo para validação
- **Usuário:** Design final alinhado com expectativas

## 🔗 Links Relacionados

- [[TECH-LEAD]] - Slash commands de design
- [[ORCHESTRATOR]] - Fluxo de orquestração
- [[ui-ux-pro-max-agent]] - Agente UI/UX Pro Max
- [[frontend-dev]] - Agente de implementação
- [[qa-tester]] - Agente de validação
- [[spec-kit]] - Especificação funcional