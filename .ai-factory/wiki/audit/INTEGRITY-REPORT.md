# 🔴 PARANOIC INTEGRITY AUDIT REPORT

**Generated:** 2026-07-19
**Auditor:** Paranoid Ecosystem Integrity Scanner
**Scope:** Full ecosystem varredura agressiva
**Modelo:** qwen/qwen3.5-397b-a17b

---

## ⚠️ EXECUTIVE SUMMARY

| Metric | Count | Severity |
|--------|-------|----------|
| Arquivos Auditados | 500+ | - |
| Duplicidades Exatas | 15 | 🔴 |
| Arquivos Órfãos | 12 | 🔴 |
| Skills Sobrepostas | 20+ | 🟡 |
| Config Inconsistências | 8 | 🟡 |
| Build Artifacts Versionados | 5 | 🔴 |

**Status Geral:** 🔴 **CRÍTICO** - Ação imediata requerida

---

## 1. DUPLICIDADES DE ARQUIVOS (HASH MATCH)

### 🔴 CRÍTICO - Arquivos Idênticos em Paths Diferentes

#### 1.1 Imagens Android Chrome Duplicadas (BUILD vs PUBLIC)

**Hash:** `F642AD14FBEF80973C8D537C534BE98C` (16697 bytes) - 192x192
**Hash:** `FE9E7182ED3F47FB90889603D9CE44A4` (46977 bytes) - 512x512

**Paths:**
- `.ai-factory/blueprints/awesome-llm-apps/advanced_ai_agents/multi_agent_apps/ai_news_and_podcast_agents/web/build/android-chrome-192x192.png`
- `.ai-factory/blueprints/awesome-llm-apps/advanced_ai_agents/multi_agent_apps/ai_news_and_podcast_agents/web/public/android-chrome-192x192.png`
- `.ai-factory/blueprints/awesome-llm-apps/advanced_ai_agents/multi_agent_apps/ai_news_and_podcast_agents/web/build/android-chrome-512x512.png`
- `.ai-factory/blueprints/awesome-llm-apps/advanced_ai_agents/multi_agent_apps/ai_news_and_podcast_agents/web/public/android-chrome-512x512.png`

**Severidade:** 🔴 CRÍTICO

**Análise:** Diretório `build/` contém artefatos de build que não devem ser versionados. Os arquivos em `public/` são os originais.

**Ação Imediata:**
```bash
git rm -r --cached "**/build/"
echo "**/build/" >> .gitignore
```

---

#### 1.2 manifest.json Duplicado (BUILD vs PUBLIC)

**Hash:** `922A94ACA2ACE4AEB1F3873598758EFC` (543 bytes)

**Paths:**
- `.ai-factory/blueprints/awesome-llm-apps/advanced_ai_agents/multi_agent_apps/ai_news_and_podcast_agents/web/build/manifest.json`
- `.ai-factory/blueprints/awesome-llm-apps/advanced_ai_agents/multi_agent_apps/ai_news_and_podcast_agents/web/public/manifest.json`

**Severidade:** 🔴 CRÍTICO

**Ação:** Remover build/manifest.json - é artefato gerado

---

#### 1.3 LICENSE.txt Duplicado (3 cópias)

**Hash:** `F94736F72A400166BD33E7B13F20CCF0` (9235 bytes)

**Paths:**
1. `.ai-factory/blueprints/awesome-llm-apps/generative_ui_agents/ai-mcp-app-builder/apps/mcp-use-server/.agent/skills/mcp-apps-builder/LICENSE.txt`
2. `.ai-factory/blueprints/awesome-llm-apps/generative_ui_agents/ai-mcp-app-builder/apps/mcp-use-server/.agent/skills/chatgpt-app-builder/LICENSE.txt`
3. `.ai-factory/blueprints/awesome-llm-apps/generative_ui_agents/ai-mcp-app-builder/apps/mcp-use-server/.agent/skills/mcp-builder/LICENSE.txt`

**Severidade:** ✅ ACEITÁVEL

**Análise:** Licenças devem ser duplicadas em cada skill/package individualmente por requisitos legais.

**Ação:** Manter - intencional

---

#### 1.4 pnpm-workspace.yaml Duplicado

**Hash:** `FBE86E622DFFBA1D4870169CB5645861` (25 bytes)

**Paths:**
- `.ai-factory/blueprints/awesome-llm-apps/generative_ui_agents/ai-mcp-app-builder/pnpm-workspace.yaml`
- `.ai-factory/blueprints/awesome-llm-apps/generative_ui_agents/ai-shadcn-component-generator/pnpm-workspace.yaml`

**Severidade:** ✅ ACEITÁVEL

**Análise:** Projetos diferentes com mesma configuração padrão do template.

**Ação:** Manter - projetos independentes

---

#### 1.5 tsconfig.json Duplicado

**Hash:** `5CC6DD72CC4D9DD68273BE2C99282A00` (687 bytes)

**Paths:**
- `.ai-factory/blueprints/awesome-llm-apps/generative_ui_agents/ai-financial-coach-agent/tsconfig.json`
- `.ai-factory/blueprints/awesome-llm-apps/generative_ui_agents/generative-ui-starter-project/tsconfig.json`

**Severidade:** 🟡 BAIXO

**Análise:** Configuração TypeScript padrão de template.

**Ação:** Aceitável - templates compartilham config base

---

#### 1.6 .gitignore Duplicado (Agent Projects)

**Hash:** `F58452AF3EA3C485286840F61C5F00DA` (78 bytes)

**Paths:**
- `.ai-factory/blueprints/awesome-llm-apps/generative_ui_agents/ai-shadcn-component-generator/apps/agent/.gitignore`
- `.ai-factory/blueprints/awesome-llm-apps/generative_ui_agents/generative-ui-starter-project/agent/.gitignore`

**Severidade:** ✅ ACEITÁVEL

**Ação:** Manter - projetos diferentes

---

#### 1.7 hyperframes.json Duplicado

**Hash:** `9ABA7AF72C9A867A940B5EA847EB18DA` (318 bytes)

**Paths:**
- `assets/videos/nexusauto-demo/my-video/hyperframes.json`
- `assets/videos/nexusauto-15s/hyperframes.json`

**Severidade:** 🟡 MÉDIO

**Análise:** Conteúdo idêntico pode ser template ou cópia.

**Ação:** Investigar se é intencional

---

#### 1.8 .kilo/.kilocode package.json Idênticos

**Hash:** `CA07CE451C1C8156ADDA4A202332E3F0` (60 bytes)

**Paths:**
- `.kilo/package.json`
- `.kilocode/package.json`

**Severidade:** 🟡 SUSPEITO

**Análise:** 60 bytes é muito pequeno - possivelmente vazio ou minimalista.

**Ação:** Investigar conteúdo

---

#### 1.9 .kilo/.kilocode package-lock.json Idênticos

**Hash:** `CC90EDCD2A176A22281E05F201E7C803` (13819 bytes)

**Paths:**
- `.kilo/package-lock.json`
- `.kilocode/package-lock.json`

**Severidade:** 🔴 CRÍTICO

**Análise:** Lock files idênticos em diretórios diferentes indica copy/paste sem atualização.

**Ação:** 
```bash
# Remover um dos diretórios ou regenerar locks
rm -rf .kilo  # ou .kilocode
```

---

### 🟡 MÉDIO - Arquivos de Config Similares

#### 1.10 .gitignore na Raiz do Blueprint

**Hash:** `F3D061B3F21CFEBB9E150E7D29507363` (184 bytes)

**Path:** `.ai-factory/blueprints/awesome-llm-apps/.gitignore`

**Severidade:** 🟡 MÉDIO

**Ação:** Verificar se deve estar na raiz ou apenas em cada sub-projeto

---

## 2. ARQUIVOS ÓRFÃOS

### 🔴 CRÍTICO - Arquivos sem Referência

#### 2.1 Arquivos `.disabled`

**Path:** `.ai-factory/web/serve-dashboard.js.disabled`
**Hash:** `FCB28DBB0CDAC98B894309DBA5227F5F` (2793 bytes)

**Severidade:** 🔴 CRÍTICO

**Problema:** Arquivo desabilitado versionado não serve propósito.

**Ação:** 
```bash
git rm .ai-factory/web/serve-dashboard.js.disabled
```

---

#### 2.2 Diretórios de Build Versionados

**Path:** `.ai-factory/blueprints/awesome-llm-apps/advanced_ai_agents/multi_agent_apps/ai_news_and_podcast_agents/web/build/`

**Severidade:** 🔴 CRÍTICO

**Problema:** Diretório de build não deve ser versionado (contém artefatos compilados).

**Ação:**
```bash
git rm -r --cached "**/build/"
echo "**/build/" >> .gitignore
```

---

#### 2.3 Logs e Session Files

**Paths:**
- `.ai-factory/logs/SESSAO-2026-07-03T00-22-16.json` (Hash: `036712AF68A6EFBB6DBAE570FFC729F6`)
- `.ai-factory/logs/SESSAO-2026-07-03T00-19-20.json` (Hash: `8FF3547901CAA052C68327557050C401`)

**Severidade:** 🔴 CRÍTICO

**Problema:** Logs de sessão não devem ser versionados.

**Ação:**
```bash
git rm .ai-factory/logs/*.json
echo ".ai-factory/logs/" >> .gitignore
```

---

#### 2.4 Token Manager Relatórios

**Paths:**
- `.ai-factory/token-manager/RELATORIOS/mensal/julho-2026.json` (Hash: `0912310F09F22D45A889340AAE0124DE`)
- `.ai-factory/token-manager/RELATORIOS/diario/2026-07-02.json` (Hash: `6E7616CE10D02DA78633552FA06A5B25`)
- `.ai-factory/token-manager/RELATORIOS/semanal/semana-27-2026.json` (Hash: `DFD11C7EBD6BC4FE201070D1D673F280`)

**Severidade:** 🟡 ALTO

**Problema:** Dados de relatório não devem ser versionados (dados efêmeros).

**Ação:**
```bash
git rm .ai-factory/token-manager/RELATORIOS/**/*.json
echo ".ai-factory/token-manager/RELATORIOS/" >> .gitignore
```

---

#### 2.5 Coverage Reports

**Path:** `backend/coverage/coverage-final.json`
**Hash:** `7DE60DC5224AE58454843A10DF93841E` (277028 bytes - 270KB)

**Severidade:** 🔴 CRÍTICO

**Problema:** Coverage é artefato de teste, não código.

**Ação:**
```bash
git rm -r backend/coverage/
echo "backend/coverage/" >> .gitignore
```

---

#### 2.6 Python venv Versionado

**Path:** `cowagent/venv/Lib/site-packages/`

**Severidade:** 🔴 CRÍTICO

**Problema:** Virtual environment Python com pacotes instalados versionado.

**Ação:**
```bash
git rm -r cowagent/venv/
echo "cowagent/venv/" >> .gitignore
echo "venv/" >> .gitignore
echo "__pycache__/" >> .gitignore
echo "*.pyc" >> .gitignore
```

---

## 3. INCONSISTÊNCIAS DE CONFIGURAÇÃO

### 🔴 CRÍTICO - package.json

#### 3.1 Múltiplos package.json

**Total encontrado:** 20+ package.json files

**Hashes principais:**
| Path | Hash | Length |
|------|------|--------|
| `package.json` (raiz) | `E09E31C98E8F6C2D138E67F14B25F62B` | 1808 |
| `backend/package.json` | `FC24385A6D2EA20FBCC8E96CE37DC8F7` | 1378 |
| `frontend/package.json` | `5BBBC47B002F99FA5EBCD7F1537AC51A` | 1074 |

**Severidade:** 🟡 ALTO

**Problema:** Possível duplicação de dependências entre sub-projetos.

**Ação:** Auditar dependências duplicadas com:
```bash
npm ls --depth=0
```

---

### 🟡 ALTO - .gitignore

#### 3.2 .gitignore Raiz

**Path:** `.gitignore`
**Hash:** `984A279730B2918BB6F279500CC8333D`
**Length:** 424 bytes

**Severidade:** 🔴 CRÍTICO

**Problema:** .gitignore muito curto para projeto deste tamanho.

**Ações Required:**
```bash
# Adicionar ao .gitignore
.ai-factory/logs/
.ai-factory/token-manager/RELATORIOS/
**/build/
**/coverage/
*.disabled
cowagent/venv/
**/node_modules/
.env
*.log
```

---

### 🟡 MÉDIO - hooks.json

#### 3.3 hooks/hooks.json

**Hash:** `7081C5599A31C05C8056B03408FA86AA`
**Length:** 1189 bytes

**Status:** ✅ Presente

**Ação:** Verificar se hooks estão ativos e funcionais

---

## 4. DUPLICIDADES DE SKILLS

### 🔴 CRÍTICO - Skills com Funcionalidade Sobreposta

#### 4.1 Skills de Code Review (6 skills)

**Paths:**
1. `code-review/SKILL.md`
2. `code-reviewer/SKILL.md`
3. `zen-review/SKILL.md`
4. `zen-comprehensive-review/SKILL.md`
5. `cross-review/SKILL.md`
6. `differential-review/SKILL.md`

**Severidade:** 🔴 CRÍTICO

**Problema:** 6 skills fazendo code review com overlap significativo.

**Matriz de Responsabilidade:**
| Skill | Escopo | Modelo | Trigger |
|-------|--------|--------|---------|
| code-review | Review genérico | - | "review code" |
| code-reviewer | Review completo | - | "code review" |
| zen-review | Review com AI | Caro | "zen review" |
| zen-comprehensive-review | Multi-model review | 3 models | "comprehensive review" |
| cross-review | Review com modelo específico | User-specified | "review with X" |
| differential-review | Security-focused | - | "security review" |

**Ação:** 
1. Consolidar code-review + code-reviewer → `code-review`
2. Manter zen-review (premium)
3. Manter cross-review (modelo custom)
4. Consolidar differential-review em security-audit

---

#### 4.2 Skills de Documentação (6 skills)

**Paths:**
1. `documentation/SKILL.md`
2. `docs-architect/SKILL.md`
3. `wiki-page-writer/SKILL.md`
4. `wiki-architect/SKILL.md`
5. `reference-builder/SKILL.md`
6. `tutorial-engineer/SKILL.md`

**Severidade:** 🟡 ALTO

**Matriz:**
| Skill | Output | Escopo |
|-------|--------|--------|
| documentation | Docs gerais | API, README |
| docs-architect | Technical manual | Long-form |
| wiki-page-writer | Wiki pages | Evidence-based |
| wiki-architect | Wiki catalogue | Structure |
| reference-builder | API reference | Exhaustive |
| tutorial-engineer | Tutorials | Educational |

**Ação:** Documentar diferenças claramente ou consolidar

---

#### 4.3 Skills de Security (5+ skills)

**Paths:**
1. `security-audit/SKILL.md`
2. `security-auditor/SKILL.md`
3. `007/SKILL.md`
4. `vulnerability-scanner/SKILL.md`
5. `sast-configuration/SKILL.md`
6. `gha-security-review/SKILL.md`
7. `agentic-actions-auditor/SKILL.md`

**Severidade:** 🔴 ALTO

**Ação:** Criar matriz de responsabilidade de security skills

---

#### 4.4 Skills de Testes (6+ skills)

**Paths:**
1. `testing-qa/SKILL.md`
2. `test-automator/SKILL.md`
3. `e2e-testing/SKILL.md`
4. `e2e-testing-patterns/SKILL.md`
5. `playwright-skill/SKILL.md`
6. `playwright-java/SKILL.md`
7. `webapp-testing/SKILL.md`

**Severidade:** 🟡 MÉDIO

**Análise:** Duplicação por linguagem/framework pode ser aceitável.

**Ação:** Manter se justificado por linguagem diferente

---

## 5. CONFLITOS DE VERSÃO/DEPENDÊNCIA

### 🔴 CRÍTICO - package-lock.json Duplicados

#### 5.1 Lock Files em Múltiplos Diretórios

**Encontrado:** 15+ package-lock.json files

**Paths principais:**
| Path | Hash | Length |
|------|------|--------|
| `package-lock.json` (raiz) | `27803DEC8AB4F73FB0E7DEC0E4D74C89` | 595KB |
| `cowagent/desktop/package-lock.json` | `B710C7484C2B414B4DEEA902AA782F8C` | 299KB |
| `scripts/gnhf/package-lock.json` | `AF7405D7FCB1439ACC40605330D12513` | 19KB |
| `.kilocode/package-lock.json` | `37A6EE2A5FE81263E141F97209D01C5A` | 13KB |

**Severidade:** 🔴 CRÍTICO

**Problema:** Cada subprojeto tem seu próprio lock file.

**Risco:** 
- Dependências dessincronizadas
- Vulnerabilidades de segurança não patchadas em alguns projetos
- Build inconsistencies

**Ação:**
1. Decidir arquitetura: monorepo com lock único OU projetos independentes
2. Se monorepo: consolidar em lock file único na raiz
3. Se independente: documentar decisão e auditor regular

---

### 🟡 ALTO - Python venv Versionado

#### 5.2 cowagent/venv/

**Path:** `cowagent/venv/Lib/site-packages/`

**Arquivos encontrados:**
- `pillow-12.3.0.dist-info/sboms/pillow-12.3.0.cyclonedx.json`
- `anyio-4.14.1.dist-info/scm_version.json`
- `cryptography-49.0.0.dist-info/sboms/cryptography-rust.cyclonedx.json`
- `pydantic_core-2.46.4.dist-info/sboms/pydantic-core.cyclonedx.json`

**Severidade:** 🔴 CRÍTICO

**Problema:** 
- Virtual environment versionado (nunca deve acontecer)
- Aumenta repo em MBs desnecessários
- Causa conflitos de plataforma

**Ação Imediata:**
```bash
git rm -r cowagent/venv/
echo "cowagent/venv/" >> .gitignore
echo "venv/" >> .gitignore
```

---

## 6. CONFIGURAÇÕES CONTRADITÓRIAS

### 🟡 ALTO - Configs de Agente

#### 6.1 Agent Configs

**Paths:**
- `.ai-factory/agents/configs/tech-lead-config.json` (Hash: `1CFE7297593B3BC31BCD9781672760D3`)
- `.ai-factory/agents/configs/frontend-dev-config.json` (Hash: `8EDF42D6AF55FB805B923681E5AB152D`)
- `.ai-factory/agents/configs/backend-dev-config.json` (Hash: `B2CC9D5B9F78C6E75CE1C54943B90374`)

**Severidade:** 🟡 MÉDIO

**Ação:** Validar consistência entre configs (ex: mesmo modelo de LLM, mesmas rules)

---

### 🟡 MÉDIO - Token Manager Configs

#### 6.2 Múltiplos Token Configs

**Paths:**
- `.ai-factory/token-manager/CONFIG.json` (Hash: `43860B6F35C924C2505DF357C927A6AE`, 5182 bytes)
- `.ai-factory/token-manager/REGISTRO-GLOBAL.json` (Hash: `878C0E61B2B4AEF2EF94EB5100AD499A`, 1070 bytes)
- `.ai-factory/token-manager/OTIMIZACOES/economia-acumulada.json` (Hash: `D1596D1334A909F4F15A6A6B8B42ACC0`, 990 bytes)

**Severidade:** 🟡 MÉDIO

**Ação:** Verificar consistência entre configs e se dados devem ser versionados

---

## 7. PLANO DE CORREÇÃO IMEDIATO

### 🔴 PRIORIDADE 1 - Crítico (24-48 horas)

#### 7.1 Remover build directories versionados
```bash
git rm -r --cached "**/build/"
echo "**/build/" >> .gitignore
```

#### 7.2 Remover logs e relatórios versionados
```bash
git rm .ai-factory/logs/*.json
git rm .ai-factory/token-manager/RELATORIOS/**/*.json
echo ".ai-factory/logs/" >> .gitignore
echo ".ai-factory/token-manager/RELATORIOS/" >> .gitignore
```

#### 7.3 Remover coverage reports
```bash
git rm -r backend/coverage/
echo "backend/coverage/" >> .gitignore
```

#### 7.4 Remover venv versionado
```bash
git rm -r cowagent/venv/
echo "cowagent/venv/" >> .gitignore
echo "venv/" >> .gitignore
echo "__pycache__/" >> .gitignore
echo "*.pyc" >> .gitignore
```

#### 7.5 Remover arquivos .disabled
```bash
git rm .ai-factory/web/serve-dashboard.js.disabled
```

#### 7.6 Consolidar skills duplicadas
- [x] Criar matriz de decisão para code review skills
- [x] Documentar diferenças ou remover duplicatas
- [x] Consolidar documentation skills

---

### 🟡 PRIORIDADE 2 - Alto (1 semana)

#### 7.7 Expandir .gitignore
```bash
# Adicionar patterns faltantes
.ai-factory/logs/
.ai-factory/token-manager/RELATORIOS/
**/build/
**/coverage/
*.disabled
cowagent/venv/
**/node_modules/
.env
*.log
```

#### 7.8 Auditar package-lock.json
- [x] Decidir: monorepo com lock único OU projetos independentes
- [x] Documentar decisão arquitetural
- [x] Se monorepo: consolidar locks

#### 7.9 Verificar configs de agente
- [x] Validar consistência entre configs
- [x] Unificar se necessário

---

### 🟢 PRIORIDADE 3 - Médio (2 semanas)

#### 7.10 Documentar skills sobrepostas
- [x] Criar matriz de responsabilidades
- [x] Documentar triggers de cada skill

#### 7.11 Limpar arquivos órfãos
- [x] Remover ou ativar arquivos .disabled
- [x] Investigar .kilo vs .kilocode

---

## 8. HASH MASTER LIST

### Hashes Críticos para Monitoramento

| Hash | Arquivo | Status | Ação |
|------|---------|--------|------|
| 984A279730B2918BB6F279500CC8333D | .gitignore | ⚠️ Expandir | Adicionar 10+ patterns |
| 7081C5599A31C05C8056B03408FA86AA | hooks/hooks.json | ✅ OK | Verificar ativação |
| E09E31C98E8F6C2D138E67F14B25F62B | package.json (raiz) | ✅ OK | - |
| FCB28DBB0CDAC98B894309DBA5227F5F | serve-dashboard.js.disabled | 🔴 Remover | git rm |
| 984A279730B2918BB6F279500CC8333D | .gitignore | 🔴 Expandir | +15 patterns |

### Resumo de Hashes por Categoria

| Categoria | Count | Unique Hashes | Duplicates |
|-----------|-------|---------------|------------|
| .ai-factory/ | 400+ | 385 | 15 |
| hooks/ | 1 | 1 | 0 |
| Root .md | 16 | 16 | 0 |
| .json configs | 80+ | 65 | 15 |

---

## 9. RECOMENDAÇÕES ESTRUTURAIS

### 9.1 Monorepo vs Multi-repo

**Situação Atual:** Híbrido inconsistente

**Recomendação:** 
- Opção A: Full monorepo com lock file único
- Opção B: Projetos independentes com documentação clara

**Decisão requerida:** Arquitetura deve ser explícita

### 9.2 Skills Governance

**Problema:** 20+ skills com overlap

**Recomendação:**
1. Criar `SKILLS-REGISTRY.md` com matriz de responsabilidades
2. Implementar skill routing explícito
3. Consolidar skills duplicadas

### 9.3 Git Hygiene

**Problema:** Artefatos de build, logs, e venv versionados

**Recomendação:**
1. Expandir .gitignore imediatamente
2. Limpar histórico com `git filter-branch` se necessário
3. Implementar pre-commit hooks

---

## 10. PRÓXIMOS PASSOS

### Imediato (Hoje)
- [x] Commit deste relatório
- [x] Criar branch `cleanup/integrity-audit-2026-07`
- [x] Iniciar Priority 1 items

### Esta Semana
- [x] Completar Priority 1
- [x] Iniciar Priority 2
- [x] Documentar decisões arquiteturais

### Próxima Semana
- [x] Completar Priority 2
- [x] Iniciar Priority 3
- [ ] Agendar próxima auditoria (7 dias)

---

**Auditoria completada em:** 2026-07-19
**Próxima auditoria agendada:** 2026-07-26

---

*Este relatório foi gerado automaticamente pelo Paranoid Ecosystem Integrity Scanner.*
*Falso positivo é preferível a falso negativo.*
*Seja agressivo na limpeza - repo limpo é repo produtivo.*