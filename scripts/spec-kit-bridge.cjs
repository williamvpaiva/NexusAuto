#!/usr/bin/env node

/**
 * spec-kit-bridge.js — Ponte entre Spec-Kit e NexusAuto
 *
 * Gera especificações estruturadas usando templates, integrando com
 * MemoryManager e MELHORIAS/ do NexusAuto.
 *
 * Uso via CLI:
 *   node scripts/spec-kit-bridge.js full "descrição" --feature nome --tech "Node/React"
 *   node scripts/spec-kit-bridge.js import-tasks --feature nome-da-feature
 *   node scripts/spec-kit-bridge.js validate --feature nome-da-feature
 *   node scripts/spec-kit-bridge.js constitution
 *
 * Uso via API:
 *   const SpecKitBridge = require('./spec-kit-bridge');
 *   const bridge = new SpecKitBridge();
 *   const result = await bridge.generateFullSpec("criar CRUD", "Node/React", "crud-tasks");
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const SPECS_DIR = path.join(PROJECT_ROOT, 'specs');
const MELHORIAS_DIR = path.join(PROJECT_ROOT, '.ai-factory', 'MELHORIAS');
const TEMPLATES_DIR = path.join(PROJECT_ROOT, '.specify', 'templates');

class SpecKitBridge {
  constructor() {
    this.templates = this.loadTemplates();
  }

  /**
   * Carrega os templates do Spec-Kit
   */
  loadTemplates() {
    const templates = {};
    const templateFiles = [
      'spec-template.md',
      'plan-template.md', 
      'tasks-template.md',
      'clarifications-template.md'
    ];

    templateFiles.forEach(file => {
      const templatePath = path.join(TEMPLATES_DIR, file);
      if (fs.existsSync(templatePath)) {
        templates[file] = fs.readFileSync(templatePath, 'utf-8');
      }
    });

    return templates;
  }

  /**
   * Gera uma especificação completa a partir de uma ideia
   * @param {string} idea - Descrição da ideia/feature
   * @param {string} techStack - Stack tecnológico
   * @param {string} featureName - Nome da feature
   * @returns {object} Todos os artefatos gerados
   */
  async generateFullSpec(idea, techStack = 'Node.js/TypeScript, React', featureName = null) {
    console.log('🚀 Gerando especificação completa via Spec-Kit...\n');
    
    // Gerar nome da feature se não fornecido
    if (!featureName) {
      featureName = idea
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50);
    }

    console.log(`📝 Feature: ${featureName}`);
    console.log(`💡 Ideia: ${idea.substring(0, 100)}...\n`);
    
    const specDir = path.join(SPECS_DIR, featureName);
    
    // Criar diretório da feature
    if (!fs.existsSync(specDir)) {
      fs.mkdirSync(specDir, { recursive: true });
      console.log(`📁 Diretório criado: ${specDir}`);
    }

    const timestamp = new Date().toISOString().split('T')[0];

    // 1. Gerar spec.md
    console.log('1️⃣ Gerando spec.md (O QUE construir)...');
    const specContent = this.generateSpecContent(idea, featureName, timestamp);
    fs.writeFileSync(path.join(specDir, 'spec.md'), specContent, 'utf-8');

    // 2. Gerar plan.md
    console.log('2️⃣ Gerando plan.md (COMO construir)...');
    const planContent = this.generatePlanContent(techStack, featureName, timestamp);
    fs.writeFileSync(path.join(specDir, 'plan.md'), planContent, 'utf-8');

    // 3. Gerar tasks.md
    console.log('3️⃣ Gerando tasks.md (tarefas ordenadas)...');
    const tasksContent = this.generateTasksContent(featureName, timestamp);
    fs.writeFileSync(path.join(specDir, 'tasks.md'), tasksContent, 'utf-8');

    // 4. Gerar clarifications.md
    console.log('4️⃣ Gerando clarifications.md...');
    const clarificationsContent = this.generateClarificationsContent(featureName, timestamp);
    fs.writeFileSync(path.join(specDir, 'clarifications.md'), clarificationsContent, 'utf-8');

    console.log('\n✅ Especificação completa gerada com sucesso!\n');
    
    const allArtifacts = this.readArtifacts(specDir);
    
    console.log('📁 Artefatos:');
    console.log(`   - spec.md: ${allArtifacts['spec.md'] ? '✅' : '❌'} (${allArtifacts['spec.md']?.length || 0} bytes)`);
    console.log(`   - plan.md: ${allArtifacts['plan.md'] ? '✅' : '❌'} (${allArtifacts['plan.md']?.length || 0} bytes)`);
    console.log(`   - tasks.md: ${allArtifacts['tasks.md'] ? '✅' : '❌'} (${allArtifacts['tasks.md']?.length || 0} bytes)`);
    console.log(`   - clarifications.md: ${allArtifacts['clarifications.md'] ? '✅' : '❌'} (${allArtifacts['clarifications.md']?.length || 0} bytes)`);
    
    return {
      featureName,
      specDir,
      spec: allArtifacts['spec.md'] || '',
      plan: allArtifacts['plan.md'] || '',
      tasks: allArtifacts['tasks.md'] || '',
      clarifications: allArtifacts['clarifications.md'] || ''
    };
  }

  /**
   * Gera conteúdo para spec.md
   */
  generateSpecContent(idea, featureName, timestamp) {
    return `# ${featureName} - Especificação

> **O QUE construir** - Requisitos, histórias de usuário e critérios de aceitação

## Contexto

**Problema:** ${idea}

**Solução Proposta:** Implementar uma solução completa com backend API REST e frontend React para atender aos requisitos descritos.

**Stakeholders:** Usuários finais, equipe de desenvolvimento, product owner

---

## Histórias de Usuário

### US-001: Criar novo registro

**Como** usuário  
**Quero** criar um novo registro  
**Para** gerenciar meus dados

#### Critérios de Aceitação

- [ ] Formulário com validação de campos obrigatórios
- [ ] Feedback visual de sucesso/erro
- [ ] Redirecionamento após criação

#### Notas Técnicas

- Usar Zod para validação
- API endpoint: POST /api/${featureName}

---

### US-002: Listar registros

**Como** usuário  
**Quero** visualizar todos os registros  
**Para** acompanhar o status

#### Critérios de Aceitação

- [ ] Tabela com paginação
- [ ] Ordenação por colunas
- [ ] Filtros básicos

---

### US-003: Atualizar registro

**Como** usuário  
**Quero** editar um registro existente  
**Para** manter dados atualizados

#### Critérios de Aceitação

- [ ] Carregar dados existentes
- [ ] Validar alterações
- [ ] Confirmar salvamento

---

### US-004: Deletar registro

**Como** usuário  
**Quero** remover um registro  
**Para** limpar dados desnecessários

#### Critérios de Aceitação

- [ ] Confirmação antes de deletar
- [ ] Soft delete (opcional)
- [ ] Feedback de exclusão

---

## Requisitos Não Funcionais

| ID | Requisito | Categoria | Prioridade |
|----|-----------|-----------|------------|
| RNF-001 | Performance < 200ms | Performance | 🔴 Alta |
| RNF-002 | 99.9% uptime | Disponibilidade | 🟡 Média |
| RNF-003 | Responsive design | UX | 🟡 Média |

---

## Dependências Externas

- [ ] Banco de dados PostgreSQL
- [ ] API REST backend
- [ ] Frontend React

---

## Métricas de Sucesso

| Métrica | Linha de Base | Meta | Como medir |
|---------|---------------|------|------------|
| Tempo de resposta | 500ms | 200ms | New Relic |
| Taxa de erro | 5% | < 1% | Sentry |

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| API externa indisponível | 🟡 Média | 🔴 Alto | Circuit breaker + fallback |

---

**Status:** 📝 Rascunho  
**Versão:** 1.0.0  
**Criado em:** ${timestamp}  
**Última atualização:** ${timestamp}
`;
  }

  /**
   * Gera conteúdo para plan.md
   */
  generatePlanContent(techStack, featureName, timestamp) {
    return `# ${featureName} - Plano Técnico

> **COMO construir** - Tecnologia, arquitetura e decisões técnicas

---

## Stack Tecnológico

| Camada | Tecnologia | Versão | Justificativa |
|--------|------------|--------|---------------|
| Frontend | React + TypeScript | 18.x | Type-safety, ecossistema |
| Backend | Node.js + Express | 20.x | Performance, familiaridade |
| Banco | PostgreSQL | 15.x | ACID, JSONB, full-text search |
| ORM | Prisma | 5.x | Type-safety, migrations |
| Testes | Jest + Playwright | - | Unitários + E2E |

**Stack definido:** ${techStack}

---

## Arquitetura

### Diagrama de Componentes

\`\`\`
┌─────────────┐
│  Frontend   │
│   (React)   │
└──────┬──────┘
       │ REST API
┌──────▼──────┐
│   Backend   │
│  (Express)  │
└──────┬──────┘
       │ Prisma
┌──────▼──────┐
│ PostgreSQL  │
└─────────────┘
\`\`\`

### Estrutura de Diretórios

\`\`\`
backend/
├── src/
│   ├── controllers/${featureName}.ts
│   ├── services/${featureName}.ts
│   ├── repositories/${featureName}.ts
│   └── models/${featureName}.ts
frontend/
├── src/
│   ├── components/${featureName}/
│   ├── pages/${featureName}/
│   └── services/${featureName}.ts
\`\`\`

---

## Schema do Banco de Dados

\`\`\`prisma
model ${featureName.replace(/-/g, '_')} {
  id          String   @id @default(uuid())
  title       String
  description String?
  status      String   @default("pending")
  dueDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
\`\`\`

---

## APIs e Endpoints

### REST Endpoints

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | \`/api/${featureName}\` | Criar registro | ✅ |
| GET | \`/api/${featureName}\` | Listar registros | ✅ |
| GET | \`/api/${featureName}/:id\` | Obter registro | ✅ |
| PUT | \`/api/${featureName}/:id\` | Atualizar registro | ✅ |
| DELETE | \`/api/${featureName}/:id\` | Deletar registro | ✅ |

---

## Estratégia de Testes

| Tipo | Ferramenta | Cobertura Mínima |
|------|------------|------------------|
| Unitários | Jest | 80% |
| Integração | Jest + Supertest | Endpoints críticos |
| E2E | Playwright | Fluxos principais |

---

## Segurança

- [ ] Input validation (Zod/Joi)
- [ ] Output encoding (XSS prevention)
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] SQL injection prevention (Prisma)
- [ ] Auth/JWT validation

---

## Cronograma Estimado

| Fase | Duração | Entregáveis |
|------|---------|-------------|
| Setup | 1 dia | Ambiente, boilerplate |
| Backend | 3 dias | API, models, tests |
| Frontend | 3 dias | Components, pages, tests |
| Integração | 1 dia | E2E, ajustes |
| **Total** | **8 dias** | **Feature completa** |

---

**Status:** 📝 Rascunho  
**Versão:** 1.0.0  
**Criado em:** ${timestamp}  
**Última atualização:** ${timestamp}
`;
  }

  /**
   * Gera conteúdo para tasks.md
   */
  generateTasksContent(featureName, timestamp) {
    return `# ${featureName} - Lista de Tarefas

> **Tarefas ordenadas por dependência** - Executar em sequência

---

## Tarefas

### ✅ TAREFA 1: Configurar ambiente e boilerplate

**Tipo:** Infra  
**Prioridade:** 🟡 Alta  
**Estimativa:** 4 horas  
**Dependências:** Nenhuma

**Descrição:**
Configurar ambiente de desenvolvimento, criar estrutura de diretórios e boilerplate do projeto.

**Critérios de Conclusão:**
- [ ] Repositório configurado
- [ ] Docker compose para PostgreSQL
- [ ] ESLint + Prettier configurados
- [ ] CI/CD básico

**Atribuído para:** devops

---

### ✅ TAREFA 2: Criar modelo e migrations Prisma

**Tipo:** Backend  
**Prioridade:** 🔴 Crítica  
**Estimativa:** 3 horas  
**Dependências:** TAREFA 1

**Descrição:**
Definir schema Prisma e criar migrations para o banco de dados.

**Critérios de Conclusão:**
- [ ] Schema definido em schema.prisma
- [ ] Migration criada e aplicada
- [ ] Seed data para testes

**Atribuído para:** backend-dev

---

### ✅ TAREFA 3: Implementar API REST

**Tipo:** Backend  
**Prioridade:** 🔴 Crítica  
**Estimativa:** 8 horas  
**Dependências:** TAREFA 2

**Descrição:**
Criar endpoints REST para CRUD completo.

**Critérios de Conclusão:**
- [ ] POST /api/${featureName}
- [ ] GET /api/${featureName}
- [ ] GET /api/${featureName}/:id
- [ ] PUT /api/${featureName}/:id
- [ ] DELETE /api/${featureName}/:id
- [ ] Validação com Zod
- [ ] Tratamento de erros

**Atribuído para:** backend-dev

---

### ✅ TAREFA 4: Criar componentes React

**Tipo:** Frontend  
**Prioridade:** 🟡 Alta  
**Estimativa:** 8 horas  
**Dependências:** TAREFA 3

**Descrição:**
Implementar componentes React para UI do CRUD.

**Critérios de Conclusão:**
- [ ] Lista de registros com paginação
- [ ] Formulário de criação/edição
- [ ] Modal de confirmação de exclusão
- [ ] Loading states e error states

**Atribuído para:** frontend-dev

---

### ✅ TAREFA 5: Integrar frontend com backend

**Tipo:** Frontend + Backend  
**Prioridade:** 🔴 Crítica  
**Estimativa:** 4 horas  
**Dependências:** TAREFA 3, TAREFA 4

**Descrição:**
Conectar frontend à API backend.

**Critérios de Conclusão:**
- [ ] Service layer para chamadas API
- [ ] React Query para cache
- [ ] Toast notifications
- [ ] Error handling global

**Atribuído para:** frontend-dev

---

### ✅ TAREFA 6: Testes E2E

**Tipo:** QA  
**Prioridade:** 🟡 Alta  
**Estimativa:** 4 horas  
**Dependências:** TAREFA 5

**Descrição:**
Criar testes end-to-end com Playwright.

**Critérios de Conclusão:**
- [ ] Teste de criação
- [ ] Teste de listagem
- [ ] Teste de edição
- [ ] Teste de exclusão

**Atribuído para:** qa-tester

---

## Progresso

| Tarefa | Status | Agente | Iniciado em | Concluído em |
|--------|--------|--------|-------------|--------------|
| 1 | 🔴 Pendente | - | - | - |
| 2 | 🔴 Pendente | - | - | - |
| 3 | 🔴 Pendente | - | - | - |
| 4 | 🔴 Pendente | - | - | - |
| 5 | 🔴 Pendente | - | - | - |
| 6 | 🔴 Pendente | - | - | - |

---

**Status:** 🔴 Pendente  
**Versão:** 1.0.0  
**Criado em:** ${timestamp}  
**Última atualização:** ${timestamp}
`;
  }

  /**
   * Gera conteúdo para clarifications.md
   */
  generateClarificationsContent(featureName, timestamp) {
    return `# ${featureName} - Clarificações

> **Perguntas e Respostas** - Durante o desenvolvimento

---

## Perguntas Pendentes

_Nenhuma pergunta pendente no momento._

---

## Perguntas Respondidas

_Nenhuma pergunta respondida no momento._

---

## Decisões Tomadas Durante Desenvolvimento

| Data | Decisão | Decidido Por | Impacto |
|------|---------|--------------|---------|
| ${timestamp} | Spec inicial criada | Tech Lead | Baixo |

---

**Status:** 📝 Em Aberto  
**Versão:** 1.0.0  
**Criado em:** ${timestamp}  
**Última atualização:** ${timestamp}
`;
  }

  /**
   * Lê os artefatos gerados
   */
  readArtifacts(specDir) {
    const artifacts = {};
    const files = ['spec.md', 'plan.md', 'tasks.md', 'clarifications.md'];
    
    files.forEach(file => {
      const filePath = path.join(specDir, file);
      if (fs.existsSync(filePath)) {
        artifacts[file] = fs.readFileSync(filePath, 'utf-8');
      } else {
        artifacts[file] = null;
      }
    });
    
    return artifacts;
  }

  /**
   * Importa tarefas para MELHORIAS/
   */
  async importTasksToMelhorias(featureName, area = null) {
    console.log(`📥 Importando tarefas de ${featureName} para MELHORIAS/...\n`);
    
    const tasksPath = path.join(SPECS_DIR, featureName, 'tasks.md');
    
    if (!fs.existsSync(tasksPath)) {
      return {
        success: false,
        error: `tasks.md não encontrado em specs/${featureName}/`
      };
    }
    
    const tasksContent = fs.readFileSync(tasksPath, 'utf-8');
    
    // Determinar área
    if (!area) {
      if (tasksContent.toLowerCase().includes('react') || tasksContent.toLowerCase().includes('component')) {
        area = '07-FRONTEND';
      } else if (tasksContent.toLowerCase().includes('api') || tasksContent.toLowerCase().includes('endpoint')) {
        area = '01-BACKEND';
      } else {
        area = '00-GERAL';
      }
    }
    
    const areaDir = path.join(MELHORIAS_DIR, area);
    
    if (!fs.existsSync(areaDir)) {
      fs.mkdirSync(areaDir, { recursive: true });
    }
    
    const tarefasPath = path.join(areaDir, 'TAREFAS.md');
    const timestamp = new Date().toISOString().split('T')[0];
    
    let existingContent = '';
    if (fs.existsSync(tarefasPath)) {
      existingContent = fs.readFileSync(tarefasPath, 'utf-8');
    }
    
    if (!existingContent.trim()) {
      existingContent = `# ${area} - Tarefas\n\n> **Gestão de tarefas da área**\n\n---\n\n`;
    }
    
    const featureSection = `
## Feature: ${featureName} (${timestamp})

${tasksContent}

---
`;
    
    const newContent = existingContent + featureSection;
    fs.writeFileSync(tarefasPath, newContent, 'utf-8');
    
    console.log(`✅ Tarefas importadas para ${tarefasPath}`);
    
    await this.saveToMemory(featureName, area);
    
    return {
      success: true,
      area,
      tarefasPath,
      featureName
    };
  }

  /**
   * Salva na memória persistente
   */
  async saveToMemory(featureName, area) {
    console.log(`💾 Salvando especificação na memória persistente...`);
    
    const memoryManagerPath = path.join(__dirname, 'memory-manager.js');
    const specSummary = `Spec-Kit gerado para ${featureName} (Área: ${area})`;
    
    try {
      execSync(`node "${memoryManagerPath}" save "${specSummary}" --agent tech-lead --type specification --tags spec-kit,${featureName}`, {
        cwd: PROJECT_ROOT,
        stdio: 'pipe'
      });
      console.log(`✅ Memória salva com sucesso`);
    } catch (error) {
      console.warn(`⚠️ Erro ao salvar memória: ${error.message}`);
    }
  }

  /**
   * Sincroniza Constitution
   */
  syncConstitution() {
    console.log(`🔄 Sincronizando Constitution...\n`);
    
    const specifyConst = path.join(PROJECT_ROOT, '.specify', 'constitution.md');
    const brainConst = path.join(PROJECT_ROOT, '.ai-factory', 'brain', 'Constitution.md');
    
    if (!fs.existsSync(specifyConst)) {
      return {
        success: false,
        error: '.specify/constitution.md não encontrado'
      };
    }
    
    const content = fs.readFileSync(specifyConst, 'utf-8');
    fs.writeFileSync(brainConst, content, 'utf-8');
    
    console.log(`✅ Constitution sincronizada: ${brainConst}`);
    
    return {
      success: true,
      specifyConst,
      brainConst
    };
  }

  /**
   * Valida especificação
   */
  validateSpec(featureName) {
    console.log(`🔍 Validando especificação de ${featureName}...\n`);
    
    const specDir = path.join(SPECS_DIR, featureName);
    const validations = [];
    let allValid = true;
    
    // spec.md
    const specPath = path.join(specDir, 'spec.md');
    if (fs.existsSync(specPath)) {
      const specContent = fs.readFileSync(specPath, 'utf-8');
      const hasUserStories = specContent.includes('Histórias de Usuário') || specContent.includes('US-');
      const hasAcceptanceCriteria = specContent.includes('Critérios de Aceitação');
      
      validations.push({
        file: 'spec.md',
        exists: true,
        hasUserStories,
        hasAcceptanceCriteria,
        valid: hasUserStories && hasAcceptanceCriteria
      });
      
      if (!hasUserStories || !hasAcceptanceCriteria) {
        allValid = false;
        console.warn(`⚠️ spec.md: Faltam histórias de usuário ou critérios de aceitação`);
      } else {
        console.log(`✅ spec.md: Válida`);
      }
    } else {
      validations.push({ file: 'spec.md', exists: false, valid: false });
      allValid = false;
      console.warn(`⚠️ spec.md: Não encontrado`);
    }
    
    // plan.md
    const planPath = path.join(specDir, 'plan.md');
    if (fs.existsSync(planPath)) {
      const planContent = fs.readFileSync(planPath, 'utf-8');
      const hasTechStack = planContent.includes('Stack Tecnológico') || planContent.includes('Tecnologia');
      const hasArchitecture = planContent.includes('Arquitetura') || planContent.includes('Diagrama');
      
      validations.push({
        file: 'plan.md',
        exists: true,
        hasTechStack,
        hasArchitecture,
        valid: hasTechStack && hasArchitecture
      });
      
      if (!hasTechStack || !hasArchitecture) {
        allValid = false;
        console.warn(`⚠️ plan.md: Faltam definição de tecnologia ou arquitetura`);
      } else {
        console.log(`✅ plan.md: Válido`);
      }
    } else {
      validations.push({ file: 'plan.md', exists: false, valid: false });
      allValid = false;
      console.warn(`⚠️ plan.md: Não encontrado`);
    }
    
    // tasks.md
    const tasksPath = path.join(specDir, 'tasks.md');
    if (fs.existsSync(tasksPath)) {
      const tasksContent = fs.readFileSync(tasksPath, 'utf-8');
      const hasDependencies = tasksContent.includes('Dependências');
      const hasTasks = tasksContent.includes('TAREFA');
      
      validations.push({
        file: 'tasks.md',
        exists: true,
        hasDependencies,
        hasTasks,
        valid: hasDependencies && hasTasks
      });
      
      if (!hasDependencies || !hasTasks) {
        allValid = false;
        console.warn(`⚠️ tasks.md: Faltam tarefas ou dependências claras`);
      } else {
        console.log(`✅ tasks.md: Válida`);
      }
    } else {
      validations.push({ file: 'tasks.md', exists: false, valid: false });
      allValid = false;
      console.warn(`⚠️ tasks.md: Não encontrado`);
    }
    
    console.log(`\n${allValid ? '✅' : '⚠️'} Validação ${allValid ? 'aprovada' : 'reprovada'}`);
    
    return {
      valid: allValid,
      featureName,
      validations
    };
  }
}

// CLI handler
function cli() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command || ['--help', '-h'].includes(command)) {
    console.log(`
Uso: node scripts/spec-kit-bridge.js <comando> [args]

Comandos:
  full "descrição"            Gera especificação completa (spec + plan + tasks)
    --feature <nome>            Nome da feature
    --tech "stack"              Stack tecnológico (opcional)

  import-tasks                Importa tasks para MELHORIAS/
    --feature <nome>            Nome da feature
    --area <area>               Área do NexusAuto (opcional)

  constitution                Sincroniza Constitution

  validate                    Valida especificação
    --feature <nome>            Nome da feature

Exemplos:
  node scripts/spec-kit-bridge.js full "Criar CRUD de tarefas" --feature crud-tasks --tech "Node/React"
  node scripts/spec-kit-bridge.js import-tasks --feature crud-tasks --area 01-BACKEND
  node scripts/spec-kit-bridge.js validate --feature crud-tasks
`);
    return;
  }
  
  const bridge = new SpecKitBridge();
  
  try {
    switch (command) {
      case 'full': {
        const description = args[1];
        const feature = args.includes('--feature') ? args[args.indexOf('--feature') + 1] : null;
        const tech = args.includes('--tech') ? args[args.indexOf('--tech') + 1] : 'Node.js/TypeScript, React';
        if (!description) {
          console.error('Erro: full requer "descrição"');
          process.exit(1);
        }
        bridge.generateFullSpec(description, tech, feature)
          .then(result => {
            console.log(JSON.stringify({
              success: true,
              featureName: result.featureName,
              specDir: result.specDir,
              artifacts: {
                spec: !!result.spec,
                plan: !!result.plan,
                tasks: !!result.tasks,
                clarifications: !!result.clarifications
              }
            }, null, 2));
          })
          .catch(err => {
            console.error(err);
            process.exit(1);
          });
        break;
      }
      
      case 'import-tasks': {
        const feature = args.includes('--feature') ? args[args.indexOf('--feature') + 1] : null;
        const area = args.includes('--area') ? args[args.indexOf('--area') + 1] : null;
        if (!feature) {
          console.error('Erro: import-tasks requer --feature');
          process.exit(1);
        }
        bridge.importTasksToMelhorias(feature, area)
          .then(result => {
            console.log(JSON.stringify(result, null, 2));
          })
          .catch(err => {
            console.error(err);
            process.exit(1);
          });
        break;
      }
      
      case 'constitution': {
        const result = bridge.syncConstitution();
        console.log(JSON.stringify(result, null, 2));
        break;
      }
      
      case 'validate': {
        const feature = args.includes('--feature') ? args[args.indexOf('--feature') + 1] : null;
        if (!feature) {
          console.error('Erro: validate requer --feature');
          process.exit(1);
        }
        const result = bridge.validateSpec(feature);
        console.log(JSON.stringify(result, null, 2));
        break;
      }
      
      default:
        console.error(`Comando desconhecido: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(JSON.stringify({ 
      status: 'error', 
      message: error.message,
      stack: error.stack 
    }, null, 2));
    process.exit(1);
  }
}

if (require.main === module) {
  cli();
}

module.exports = SpecKitBridge;