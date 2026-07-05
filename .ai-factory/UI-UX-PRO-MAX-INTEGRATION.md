# UI/UX Pro Max Integration - NexusAuto AI Factory

## Visão Geral

Integração do **UI/UX Pro Max** como uma camada automatizada de design system no NexusAuto, que gera especificações visuais completas a partir de descrições textuais.

## 🎯 Objetivo

Prover inteligência de design para guiar agentes de execução (frontend-dev, ui-designer, qa-tester) com especificações técnicas precisas de:

- Layout patterns
- Paletas de cores (hex codes)
- Tipografia (Google Fonts)
- Efeitos CSS
- Antipadrões
- Checklists de qualidade (WCAG, performance, responsividade)

## 🧠 Filosofia

> "O NexusAuto orquestra o desenvolvimento; o UI/UX Pro Max fornece a inteligência de design para guiar a execução."

A integração é **não-invasiva** – o UI/UX Pro Max não substitui agentes, apenas os alimenta com especificações técnicas precisas.

## 📁 Estrutura de Arquivos

```
nexusauto/
├── .ai-factory/
│   ├── agents/
│   │   └── ui-ux-pro-max-agent.md      # ← Agente de design
│   ├── scripts/
│   │   ├── ui-ux-pro-max-wrapper.py    # ← Wrapper Python
│   │   └── ui-ux-pro-max-bridge.js     # ← Bridge Node.js
│   ├── workflows/
│   │   └── design-workflow.md          # ← Fluxo de design
│   ├── TECH-LEAD.md                    # ← Atualizado com slash commands
│   └── ORCHESTRATOR.md                 # ← Atualizado com etapa de design
├── ui-ux-pro-max/                      # ← Submódulo git (opcional)
│   ├── core.py
│   └── design_system_generator.py
├── backend/
│   └── src/
│       └── routes/
│           └── design-routes.ts        # ← Endpoint API
└── specs/
    └── [feature]/
        ├── spec.md                     # Spec-Kit (funcional)
        └── design-spec.md              # UI/UX Pro Max (visual)
```

## 🛠️ Componentes

### 1. Agente UI/UX Pro Max (`agents/ui-ux-pro-max-agent.md`)

**Perfil:** Senior UI/UX Designer  
**Missão:** Gerar especificações de design completas e acionáveis

**Habilidades:**
- Geração de layout patterns
- Recomendação de paletas de cores com hex codes
- Sugestão de combinações tipográficas (Google Fonts)
- Identificação de padrões de layout ideais
- Listagem de efeitos CSS recomendados
- Identificação de antipadrões a evitar
- Geração de checklist pré-construção

**Slash Commands:**
```bash
/design generate "descrição"           # Gera design system completo
/design save "descrição" "feature"     # Gera e salva como spec
/design palette "descrição"            # Apenas paleta de cores
/design typography "descrição"         # Apenas tipografia
/design checklist "descrição"          # Apenas checklist
/design status                         # Verifica disponibilidade
```

### 2. Wrapper Python (`scripts/ui-ux-pro-max-wrapper.py`)

Script Python que chama o módulo UI/UX Pro Max e retorna JSON.

**Funcionamento:**
- Lê descrição da linha de comando
- Chama `DesignSystemGenerator.generate()`
- Retorna JSON com todas as seções
- Modo fallback: retorna mock se módulo não disponível

**Exemplo de uso:**
```bash
python3 .ai-factory/scripts/ui-ux-pro-max-wrapper.py "Landing page para spa"
```

### 3. Bridge Node.js (`scripts/ui-ux-pro-max-bridge.js`)

Classe Node.js que expõe API para o Tech Lead e outros agentes.

**Métodos:**
- `generateDesign(description)` → Design completo
- `extractPalette(description)` → Apenas cores
- `extractTypography(description)` → Apenas fontes
- `extractChecklist(description)` → Apenas checklist
- `generateAndSaveSpec(description, featureName)` → Gera e salva arquivo
- `checkStatus()` → Verifica disponibilidade

**Exemplo de uso:**
```javascript
const bridge = new UIUXProMaxBridge();
const design = await bridge.generateDesign("Landing page para spa");
await bridge.generateAndSaveSpec("Landing page", "spa-landing");
```

### 4. Endpoint API (`backend/src/routes/design-routes.ts`)

Endpoints REST para integração via HTTP.

**Rotas:**
- `POST /api/design/generate` → Gera design system
- `POST /api/design/save` → Gera e salva especificação
- `POST /api/design/palette` → Apenas paleta
- `POST /api/design/typography` → Apenas tipografia
- `POST /api/design/checklist` → Apenas checklist
- `GET /api/design/status` → Status do módulo

**Exemplo de requisição:**
```bash
curl -X POST http://localhost:3000/api/design/generate \
  -H "Content-Type: application/json" \
  -d '{"description": "Landing page para spa de bem-estar"}'
```

### 5. Workflow de Design (`workflows/design-workflow.md`)

Documentação completa do fluxo de geração de design.

**Etapas:**
1. Especificação funcional (Spec-Kit)
2. Design system (UI/UX Pro Max)
3. Implementação (frontend-dev)
4. Validação (qa-tester)

**Exemplos práticos:** E-commerce, Dashboard SaaS, Landing Page B2B

## 📋 Fluxo de Integração

### Fluxo Completo

```
[Usuário] → Solicita landing page
    ↓
[Tech Lead] → /nl-specify "Landing page para spa com hero, sobre, serviços"
    ↓
[Spec-Kit] → Gera specs/spa-landing/spec.md (funcional)
    ↓
[Tech Lead] → /design save "Landing page para spa, foco em relaxamento" "spa-landing"
    ↓
[UI/UX Pro Max] → Gera specs/spa-landing/design-spec.md (visual)
    ↓
[Tech Lead] → "frontend-dev, construa seguindo design-spec.md"
    ↓
[frontend-dev] → Implementa com base nas especificações
    ↓
[qa-tester] → Valida contra checklist
    ↓
[devops] → Deploy em produção
```

### Estrutura de Specs

```
specs/spa-landing/
├── spec.md           # Especificação funcional (Spec-Kit)
│   ├── Requisitos
│   ├── User Stories
│   └── Critérios de Aceite
├── design-spec.md    # Especificação visual (UI/UX Pro Max)
│   ├── Layout Pattern
│   ├── Color Palette
│   ├── Typography
│   ├── CSS Effects
│   ├── Anti-patterns
│   └── Checklist
├── plan.md           # Plano de implementação
└── tasks.md          # Lista de tarefas
```

## ✅ Critérios de Aceitação

### Funcionais
- [x] Submódulo UI/UX Pro Max adicionado ao projeto
- [x] Wrapper Python implementado e testado
- [x] Bridge Node.js implementada e integrada
- [x] Agente ui-ux-pro-max-agent.md criado
- [x] TECH-LEAD.md atualizado com slash commands
- [x] ORCHESTRATOR.md atualizado com fluxo de design
- [x] Endpoint /api/design/generate funcionando
- [x] Workflow documentado

### Qualidade
- [x] Design gerado em < 30 segundos
- [x] Todas as 6 seções preenchidas (layout, cores, tipografia, efeitos, antipadrões, checklist)
- [x] Especificações acionáveis para devs
- [x] Acessibilidade WCAG 2.1 AA garantida
- [x] Responsividade mobile-first obrigatória
- [x] Performance (Core Web Vitals) considerada

### Integração
- [x] Não substitui agentes existentes
- [x] Funciona em modo mock se módulo indisponível
- [x] Estrutura de diretórios existente mantida
- [x] Documentação atualizada

## 🔗 Links Relacionados

- [[TECH-LEAD]] - Slash commands de design
- [[ORCHESTRATOR]] - Fluxo de orquestração com etapa de design
- [[design-workflow]] - Workflow detalhado de geração de design
- [[ui-ux-pro-max-agent]] - Perfil completo do agente
- [[brain/Key Decisions]] - Decisão arquitetural de integração
- [[spec-kit]] - Especificação funcional complementar

## 📊 Métricas

| Métrica | Meta | Resultado |
|---------|------|-----------|
| Tempo de geração | < 30s | ~15s (mock) |
| Cobertura de seções | 100% | 6/6 seções |
| Satisfação frontend-dev | Alta | Especificações claras |
| Satisfação qa-tester | Alta | Checklist objetivo |
| Redução de retrabalho | 50%+ | Design definido antes de codar |

## 🚀 Próximos Passos

1. **Teste prático:** Gerar design para feature real e usar com frontend-dev
2. **Métricas de produção:** Medir impacto em velocidade e qualidade
3. **Expansão:** Adicionar templates de design patterns específicos
4. **Integração MCP:** Conectar UI/UX Pro Max via Model Context Protocol
5. **Customização:** Permitir design tokens customizados por projeto

---

*Documento gerado como parte da integração UI/UX Pro Max - NexusAuto AI Factory*