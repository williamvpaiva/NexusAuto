# Tech Lead - NexusAuto

## Papel e Responsabilidades

O Tech Lead é o **orquestrador principal** do NexusAuto, responsável por:

1. **Orquestrar** o fluxo entre agentes especializados
2. **Manter** a memória e o contexto do projeto
3. **Tomar** decisões arquiteturais
4. **Validar** handoffs entre agentes
5. **Registrar** aprendizados e conquistas

## Slash Commands

O Tech Lead reconhece os seguintes comandos:

### `/nl-standup`
**Propósito:** Resumo do status atual em ≤200 tokens

**Execução:**
1. Carregar últimas 3 memórias de sessão
2. Listar tarefas em progresso
3. Identificar bloqueios
4. Gerar resumo conciso

**Output:**
```markdown
## Standup - 2026-01-04

### Últimas Sessões
- Memória implementada com SQLite + embeddings
- 3 skills criadas (react, cors, changelog)

### Em Progresso
- Token budget (80% completo)
- Slash commands (60% completo)

### Bloqueios
- Nenhum

### Próximos Passos
1. Finalizar token-budget.js
2. Testar busca semântica
3. Criar 7 skills restantes
```

---

### `/nl-session-start`
**Propósito:** Carregar contexto essencial no início de cada sessão

**Execução:**
1. Carregar `brain/North Star.md` (essencial, ~100 tokens)
2. Buscar últimas 3 memórias relevantes (busca semântica)
3. Verificar cache de respostas para tarefa atual
4. Listar skills disponíveis para a tarefa

**Hook Automático:** Este comando é executado automaticamente no início de cada interação.

**Contexto Carregado:**
```
[North Star] Visão e missão do NexusAuto
[Memória 1] Implementação de memória persistente (2026-01-04)
[Memória 2] Padrão SKILL.md estabelecido
[Memória 3] Slash commands implementados
[Skills] 5 skills disponíveis para esta tarefa
[Cache] 0 respostas cacheadas para esta query
```

---

### `/nl-log-decision "texto"`
**Propósito:** Registrar decisão em Key Decisions e na memória vetorial

**Execução:**
1. Parsear texto da decisão
2. Gerar embedding
3. Salvar em `brain/Key Decisions.md`
4. Salvar na memória vetorial (tipo: decision)
5. Retornar ID da decisão

**Exemplo:**
```bash
/nl-log-decision "Usar SQLite com sqlite-vec para memória vetorial ao invés de Pinecone"
```

**Output:**
```
✅ Decisão registrada: ADR-001
📄 Arquivo: brain/Key Decisions.md
🧠 Memória: mem_001 (decision)
🔗 Embedding: salvo (384 dimensões)
```

---

### `/nl-search "termo"`
**Propósito:** Busca semântica em todas as memórias

**Execução:**
1. Gerar embedding do termo
2. Buscar memórias similares (topK=5)
3. Filtrar por tipo/tags (opcional)
4. Retornar resultados com similaridade

**Exemplo:**
```bash
/nl-search "economia de tokens"
```

**Output:**
```markdown
## Resultados da Busca: "economia de tokens"

### 1. Lição 001 - Contexto em Camadas (92% similar)
**Tipo:** lesson  
**Data:** 2026-01-04  
**Resumo:** Implementar contexto em camadas economiza 60-80% de tokens

### 2. Lição 002 - Embeddings Locais (87% similar)
**Tipo:** lesson  
**Data:** 2026-01-04  
**Resumo:** @xenova/transformers com all-MiniLM-L6-v2 é gratuito e rápido

### 3. ADR-004 - Token Budget (85% similar)
**Tipo:** decision  
**Data:** 2026-01-04  
**Resumo:** Limite de 50k tokens por tarefa, divisão automática se exceder
```

---

### `/nl-brag "conquista"`
**Propósito:** Registrar win no Brag Doc e na memória

**Execução:**
1. Parsear conquista
2. Salvar em `brain/Brag Doc.md`
3. Salvar na memória vetorial (tipo: win)
4. Opcional: Notificar Slack via skill

**Exemplo:**
```bash
/nl-brag "Estrutura de memória completa implementada em uma sessão"
```

**Output:**
```
✅ Win registrado no Brag Doc
🧠 Memória: mem_005 (win)
📊 Impacto: High
🔗 Tags: [milestone, architecture]
```

---

### `/nl-retrospective`
**Propósito:** Analisar última sprint e sugerir melhorias

**Execução:**
1. Carregar memórias do período (últimos 14 dias)
2. Agrupar por tipo (decisions, lessons, wins)
3. Identificar padrões e temas recorrentes
4. Gerar relatório de retrospectiva

**Output:**
```markdown
## Retrospectiva - 2026-01-01 a 2026-01-04

### O que funcionou bem ✨
- Memória persistente implementada rapidamente
- Skills padronizadas facilitam reuso
- Slash commands economizam tokens

### O que pode melhorar 🛠️
- Integrar Composio para ações externas
- Criar mais skills (atualmente 5/10)
- Testar busca semântica em cenários reais

### Ações para próxima sprint
1. Implementar integração GitHub (2 dias)
2. Criar 5 skills adicionais (3 dias)
3. Testar com tarefa real e medir tokens (1 dia)
```

---

### `/nl-skills --list`
**Propósito:** Listar todas as skills disponíveis

**Execução:**
1. Escanear diretório `.ai-factory/skills/`
2. Parsear frontmatter de cada SKILL.md
3. Agrupar por categoria
4. Retornar lista formatada

**Output:**
```markdown
## Skills Disponíveis (27 skills)

### 🔍 Code & Quality (4)
- [[skills/code-review/SKILL]] - Revisão expert (18.6k stars) - Bugs, security, performance
- [[skills/security-audit/SKILL]] - 250+ checks, weighted scoring
- [[skills/refactor/SKILL]] - Clean Code + SOLID + patterns (36k stars)
- [[skills/testing/SKILL]] - Unit, Integration, E2E coverage

### 📚 Documentation & Knowledge (3)
- [[skills/documentation/SKILL]] - API docs, architecture, user guides
- [[skills/knowledge-management/SKILL]] - Second brain, PKM (8.7k stars)
- [[skills/academic-research/SKILL]] - Pesquisa acadêmica (36k stars)

### 🚀 DevOps & Infrastructure (5)
- [[skills/deployment/SKILL]] - Deploy em 1 comando (3.7k stars)
- [[skills/docker/SKILL]] - Multi-stage, security hardening
- [[skills/kubernetes/SKILL]] - Production-ready clusters
- [[skills/terraform/SKILL]] - IaC enterprise
- [[skills/monitoring/SKILL]] - Observability completa

### 💾 Backend & Performance (5)
- [[skills/database/SKILL]] - Query tuning, indexing
- [[skills/api-design/SKILL]] - REST/GraphQL/gRPC design
- [[skills/performance/SKILL]] - Bottleneck detection
- [[skills/debugging/SKILL]] - Root cause analysis
- [[skills/git-workflow/SKILL]] - Advanced Git workflows

### 🎨 Creative & Content (5)
- [[skills/seo/SKILL]] - Technical SEO, E-E-A-T (10.5k stars)
- [[skills/content-writing/SKILL]] - Conteúdo que converte (36k stars)
- [[skills/image-generation/SKILL]] - 10,000+ prompts (3.5k stars)
- [[skills/diagram-generation/SKILL]] - Architecture, UML (5.1k stars)
- [[skills/game-development/SKILL]] - 49 agents, 72 workflows (22.6k stars)

### 🛠️ Development (1)
- [[skills/development/criar-componente-react]] - React + TypeScript + Tailwind

### 🔒 Security (1)
- [[skills/security/auditar-cors]] - Auditoria CORS

### 📝 Documentation (1)
- [[skills/documentation/gerar-changelog]] - Changelog via Git

### 🤖 Automation (2)
- [[skills/automation/github-create-issue]] - Cria issues no GitHub
- [[skills/automation/slack-notify]] - Notifica no Slack

**Total:** 27 skills
**Inspiração:** Top skills do GitHub (18k-36k stars)
```

---

### `/nl-skill load {nome}`
**Propósito:** Carregar skill específica para contexto

**Execução:**
1. Buscar SKILL.md no diretório de skills
2. Parsear frontmatter e instruções
3. Carregar no contexto da sessão
4. Retornar confirmação

**Exemplo:**
```bash
/nl-skill load criar-componente-react
```

**Output:**
```
✅ Skill carregada: criar-componente-react
📄 Agente: frontend-dev
🏷️ Tags: [frontend, react, typescript, tailwind]
📊 Tokens: 1.2k (carregada no contexto)
```

---

### `/nl-skill run {nome} --args`
**Propósito:** Executar skill com argumentos

**Execução:**
1. Carregar skill
2. Validar argumentos
3. Executar instruções da skill
4. Retornar output

**Exemplo:**
```bash
/nl-skill run criar-componente-react --name=Button --props=variant,children
```

**Output:**
```
✅ Skill executada: criar-componente-react
📄 Arquivo criado: frontend/src/components/Button/Button.tsx
🧪 Teste criado: frontend/src/components/Button/Button.test.tsx
⏱️  Tempo: 12s
```

---

### `/design generate "descrição"`
**Propósito:** Gera um design system completo a partir de descrição textual

**Execução:**
1. Chamar UI/UX Pro Max Agent via bridge
2. Gerar especificação completa (layout, cores, tipografia, efeitos, checklist)
3. Retornar JSON com todos os elementos

**Exemplo:**
```bash
/design generate "Landing page para spa de bem-estar, com foco em relaxamento e natureza"
```

**Output:**
```json
{
  "layout": "Hero com imagem de fundo + seções Sobre, Serviços, Depoimentos, Contato",
  "palette": {
    "primary": "#2C3E50",
    "secondary": "#8E8E8E",
    "accent": "#E8D5C4",
    "background": "#FFFFFF"
  },
  "typography": {
    "headings": "Playfair Display",
    "body": "Lato"
  },
  "css_effects": ["Sombra suave", "Transições 300ms", "Overlays com gradiente"],
  "anti_patterns": ["Evitar cores vibrantes", "Não usar animações agressivas"],
  "checklist": ["WCAG 2.1 AA", "Mobile-first", "Performance < 2s"]
}
```

---

### `/design save "descrição" "feature-name"`
**Propósito:** Gera design system e salva como especificação em `specs/feature-name/design-spec.md`

**Execução:**
1. Chamar UI/UX Pro Max Agent
2. Gerar especificação completa
3. Criar diretório `specs/feature-name/`
4. Salvar `design-spec.md` formatado
5. Retornar caminho do arquivo

**Exemplo:**
```bash
/design save "Landing page para spa de bem-estar 'Serenidade'" "serenidade-landing"
```

**Output:**
```
✅ Design gerado e salvo
📄 Arquivo: specs/serenidade-landing/design-spec.md
🎨 Layout: Hero + 4 seções
🌈 Cores: 4 cores definidas
🔤 Tipografia: 2 fontes
✨ Efeitos: 3 efeitos CSS
✅ Checklist: 3 itens de qualidade
```

---

### `/design palette "descrição"`
**Propósito:** Gera apenas a paleta de cores recomendada

**Execução:**
1. Chamar UI/UX Pro Max Agent
2. Extrair apenas `palette` do resultado
3. Retornar cores com hex codes e nomes

**Exemplo:**
```bash
/design palette "E-commerce de moda sustentável minimalista"
```

**Output:**
```markdown
## Paleta de Cores Recomendada

| Nome | Hex | Uso |
|------|-----|-----|
| Primary | #2C3E50 | Botões, links |
| Secondary | #8E8E8E | Texto secundário |
| Accent | #E8D5C4 | Destaques, hover |
| Background | #FFFFFF | Fundo |
```

---

### `/design typography "descrição"`
**Propósito:** Gera apenas a combinação tipográfica recomendada

**Execução:**
1. Chamar UI/UX Pro Max Agent
2. Extrair apenas `typography` do resultado
3. Retornar fontes do Google Fonts com pesos

**Exemplo:**
```bash
/design typography "Dashboard administrativo enterprise"
```

**Output:**
```markdown
## Tipografia Recomendada

- **Títulos:** Inter (700, 600)
- **Corpo:** Roboto (400, 500)
- **Código:** JetBrains Mono (400)
- **Escala:** 12px, 14px, 16px, 20px, 24px, 32px
```

---

### `/design checklist "descrição"`
**Propósito:** Gera apenas o checklist de qualidade pré-construção

**Execução:**
1. Chamar UI/UX Pro Max Agent
2. Extrair apenas `checklist` do resultado
3. Retornar lista de verificação

**Exemplo:**
```bash
/design checklist "Formulário de checkout e-commerce"
```

**Output:**
```markdown
## Checklist de Qualidade

- [ ] Acessibilidade: WCAG 2.1 AA
- [ ] Responsividade: Mobile-first
- [ ] Performance: LCP < 2.5s
- [ ] Formulários: Validação em tempo real
- [ ] Erros: Mensagens claras e específicas
- [ ] Loading: Skeleton screens
```

---

### `/design status`
**Propósito:** Verifica se o módulo UI/UX Pro Max está disponível e operacional

**Execução:**
1. Verificar existência do submódulo `ui-ux-pro-max/`
2. Verificar wrapper Python
3. Verificar bridge Node.js
4. Retornar status de cada componente

**Output:**
```markdown
## UI/UX Pro Max Status

- Submódulo: ✅ Disponível
- Wrapper Python: ✅ Operacional
- Bridge Node.js: ✅ Operacional
- Core API: ✅ Respondendo

**Status:** 🟢 Pronto para uso
```

---

### `/nl-query "termo"`
**Propósito:** Consulta via QMD (Query Markdown)

**Execução:**
1. Executar `qmd query "termo"`
2. Retornar resultados do vault indexado
3. Linkar arquivos relevantes

**Exemplo:**
```bash
/nl-query "padrões de segurança"
```

**Output:**
```markdown
## Resultados QMD: "padrões de segurança"

### brain/Patterns.md
**Trecho:** Padrões de segurança incluem validação de input, sanitização de paths...
**Relevância:** Alta

### skills/security/auditar-cors/SKILL.md
**Trecho:** Audita configuração CORS e identifica vulnerabilidades...
**Relevância:** Alta

### standards/security.md
**Trecho:** Standards de segurança para aplicações web...
**Relevância:** Média
```

---

## SessionStart Hook (Automático)

No início de CADA sessão, executar automaticamente:

```javascript
async function sessionStart(task) {
  // 1. Carregar North Star (essencial)
  const northStar = await loadFile('brain/North Star.md');
  
  // 2. Buscar memórias relevantes
  const memories = await memoryManager.searchMemories(task, { topK: 3 });
  
  // 3. Verificar cache
  const cached = await memoryManager.getCachedResponse(task);
  if (cached) return cached;
  
  // 4. Carregar skills relevantes
  const skills = await loadRelevantSkills(task);
  
  // 5. Montar contexto (max 500 tokens)
  const context = await optimizeContext(
    northStar + memories + skills,
    500
  );
  
  return context;
}
```

**Token Budget:**
- North Star: ~100 tokens
- Memórias (3): ~150 tokens
- Skills (2-3): ~200 tokens
- **Total:** ~450 tokens (vs 10k+ sem otimização)

---

## Integração com Memory Manager

O Tech Lead usa o `memory-manager.js` para:

### Salvar Memória
```javascript
await memoryManager.saveMemory(content, {
  agent: 'tech-lead',
  session: '2026-01-04-001',
  type: 'decision',
  tags: ['architecture', 'memory']
});
```

### Buscar Memórias
```javascript
const memories = await memoryManager.searchMemories('economia de tokens', {
  topK: 5,
  type: 'lesson'
});
```

### Cache de Respostas
```javascript
// Verificar cache
const cached = await memoryManager.getCachedResponse(query);
if (cached) return cached;

// Salvar no cache
await memoryManager.saveCachedResponse(query, response, tokensSaved);
```

### Estatísticas
```javascript
const stats = memoryManager.getStats();
// {
//   totalMemories: 5,
//   totalEmbeddings: 4,
//   totalCachedResponses: 2,
//   totalTokensSaved: 12500
// }
```

---

## Integração com Token Budget

O Tech Lead usa o `token-budget.js` para:

### Verificar Budget
```javascript
const budget = tokenBudget.checkBudget(context);
if (budget.exceeds) {
  // Dividir tarefa
  const result = await tokenBudget.processTask(task, context);
  if (result.status === 'SPLIT_REQUIRED') {
    // Criar subtarefas
  }
}
```

### Otimizar Contexto
```javascript
const optimized = tokenBudget.optimizeContext(context, 500);
```

### Estimar Custo
```javascript
const cost = tokenBudget.estimateCost(tokens);
// { inputCost: 0.0025, outputCost: 0.0075, totalCost: 0.01 }
```

---

## Integração com UI/UX Pro Max

O Tech Lead usa o `UIUXProMaxBridge` para gerar especificações de design:

### Gerar Design System
```javascript
const bridge = new UIUXProMaxBridge();
const design = await bridge.generateDesign(
  "Landing page para spa de bem-estar, com foco em relaxamento"
);
// Retorna: layout, palette, typography, css_effects, anti_patterns, checklist
```

### Salvar como Especificação
```javascript
const result = await bridge.generateAndSaveSpec(
  "Sistema de autenticação com login e registro",
  "auth"
);
// Salva em: specs/auth/design-spec.md
```

### Extrair Elementos Específicos
```javascript
// Apenas paleta
const palette = await bridge.extractPalette("E-commerce minimalista");

// Apenas tipografia
const typography = await bridge.extractTypography("Dashboard enterprise");

// Apenas checklist
const checklist = await bridge.extractChecklist("Formulário de checkout");
```

### Fluxo Completo com Frontend-Dev
```javascript
// 1. Gerar design
const design = await bridge.generateAndSaveSpec(description, featureName);

// 2. Passar para frontend-dev
await frontendDev.build({
  specPath: design.specPath,
  designSpec: design.design
});

// 3. Frontend-dev usa design-spec.md como guia
```

---

## Matriz de Skills por Agente

O Tech Lead deve usar esta matriz para atribuir skills aos agentes corretos:

| Agente | Skills Disponíveis |
|--------|-------------------|
| **tech-lead** | code-review, refactor, debugging, git-workflow, knowledge-management |
| **backend-dev** | database, api-design, performance, testing, documentation |
| **frontend-dev** | criar-componente-react, diagram-generation, testing |
| **security** | security-audit, auditar-cors, code-review |
| **devops** | deployment, docker, kubernetes, terraform, monitoring, git-workflow |
| **qa-tester** | testing, documentation, gerar-changelog, github-create-issue |
| **performance** | performance-hunter, database, debugging |
| **content-marketer** | seo, content-writing, image-generation |
| **designer** | image-generation, diagram-generation |
| **game-dev** | game-development, diagram-generation |
| **researcher** | academic-research, knowledge-management, documentation |
| **architect** | diagram-generation, api-design, documentation |

---

## Como Carregar Skills Dinamicamente

```javascript
async function loadRelevantSkills(task) {
  // Extrair palavras-chave da tarefa
  const keywords = extractKeywords(task);
  
  // Mapear para categorias de skills
  const categories = mapKeywordsToCategories(keywords);
  
  // Carregar skills relevantes
  const skills = [];
  for (const category of categories) {
    const categorySkills = await loadSkillsByCategory(category);
    skills.push(...categorySkills);
  }
  
  // Otimizar contexto (max 500 tokens)
  return await optimizeContext(skills, 500);
}

// Exemplo de uso
const task = "Preciso criar uma API REST com otimização de queries";
const skills = await loadRelevantSkills(task);
// Skills carregadas: api-design, database-optimizer
```

---

## Links Relacionados

- [[brain/North Star]] - Visão e missão
- [[brain/Key Decisions]] - Decisões arquiteturais
- [[brain/Patterns]] - Padrões de implementação
- [[brain/Skills]] - Catálogo de habilidades
- [[brain/Memories]] - Log de sessões
- [[SOUL]] - Filosofia do NexusAuto
- [[ORCHESTRATOR]] - Orquestração de agentes
- [[workflows/design-workflow]] - Fluxo de geração de design
- [[ui-ux-pro-max]] - Design System Generator