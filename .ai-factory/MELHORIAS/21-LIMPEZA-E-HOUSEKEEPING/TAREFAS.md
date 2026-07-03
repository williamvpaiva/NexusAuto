# 🧹 21 - Limpeza e Housekeeping

> **Objetivo:** Identificar e remover arquivos, dependências, código e configurações que **NÃO pertencem ao projeto** e **NÃO são necessários para execução**

---

## Status Geral da Área

**Status:** 🟡 Em Progresso  
**Progresso:** 0% concluído (0 de 8 tarefas)

---

## 📋 Tarefas

### TAREFA 1: Identificar Arquivos de Lixo na Raiz

| Campo              | Detalhe                                      |
|--------------------|----------------------------------------------|
| 📌 Status          | 🔴 Pendente |
| 🗓️ Iniciado em     | - |
| ✅ Concluído em    | - |
| 👤 Responsável     | housekeeping-agent |
| ⚡ Prioridade      | 🟠 Alta |

#### 🔍 O que existe hoje:
> Projetos acumulam arquivos temporários, backups, logs de IDE, configurações antigas que não pertencem ao repositório.

#### 🎯 O que deve ser feito:
1. Escanear raiz do projeto em busca de:
   - Arquivos `.log`, `.tmp`, `.bak`, `.old`
   - Pastas `backup/`, `old/`, `temp/`, `lixo/`
   - Arquivos de IDE (`.vs/`, `.idea/`, `*.swp`)
   - Downloads acidentais (`*.zip`, `*.rar`, `*.exe`)
   - Screenshots e imagens temporárias
2. Listar todos os arquivos candidatos a remoção
3. Mover para `.ai-factory/quarentena/` (não deletar imediatamente)
4. Aguardar validação antes de deletar permanentemente

#### ❓ Por que corrigir:
- ✅ Polui repositório git
- ✅ Aumenta tamanho do projeto desnecessariamente
- ✅ Confunde novos desenvolvedores
- ✅ Pode expor dados sensíveis em logs

#### 📦 Entregáveis:
- [ ] Lista de arquivos identificados como lixo
- [ ] Arquivos movidos para `.ai-factory/quarentena/`
- [ ] `.gitignore` atualizado para prevenir recorrência
- [ ] Relatório de limpeza

#### 🛡️ RELATÓRIO V&V

| # | Verificação                              | Status | Observações        |
|---|------------------------------------------|--------|--------------------|
| 1 | 🧪 Integridade (projeto ainda executa)   | ⬜     |                    |
| 2 | 🔗 Integração (dependências OK)          | ⬜     |                    |
| 3 | 🔄 Regressão (nada quebrado)             | ⬜     |                    |
| 4 | 🧨 Edge Cases (arquivos críticos salvos) | ⬜     |                    |
| 5 | 📱 Ambientes (todos ambientes OK)        | ⬜     |                    |
| 6 | ⚡ Performance (sem impacto)              | ⬜     |                    |
| 7 | ✅ Validação Final                        | ⬜     |                    |

**Resultado V&V:** ⬜ NÃO EXECUTADO / ✅ APROVADO / ❌ REPROVADO

---

### TAREFA 2: Limpar Dependências Não Utilizadas

| Campo              | Detalhe                                      |
|--------------------|----------------------------------------------|
| 📌 Status          | 🔴 Pendente |
| 🗓️ Iniciado em     | - |
| ✅ Concluído em    | - |
| 👤 Responsável     | housekeeping-agent |
| ⚡ Prioridade      | 🟠 Alta |

#### 🔍 O que existe hoje:
> `package.json`, `requirements.txt`, `go.mod`, etc. acumulam dependências que foram usadas no passado mas não são mais necessárias.

#### 🎯 O que deve ser feito:
1. Analisar imports/imports em todo o código
2. Comparar com dependências instaladas
3. Identificar dependências não utilizadas
4. Remover do arquivo de dependências
5. Executar `npm uninstall`, `pip uninstall`, etc.
6. Testar projeto completo

#### ❓ Por que corrigir:
- ✅ Reduz tamanho de `node_modules/`, `venv/`, etc.
- ✅ Diminui superfície de ataque de segurança
- ✅ Acelera instalação do projeto
- ✅ Previne vulnerabilidades em pacotes não usados

#### 📦 Entregáveis:
- [ ] Lista de dependências removidas
- [ ] Arquivo de dependências atualizado
- [ ] Projeto testado e funcionando
- [ ] Economia de espaço em MB

#### 🛡️ RELATÓRIO V&V

| # | Verificação                              | Status | Observações        |
|---|------------------------------------------|--------|--------------------|
| 1 | 🧪 Integridade (projeto executa)         | ⬜     |                    |
| 2 | 🔗 Integração (todas features OK)        | ⬜     |                    |
| 3 | 🔄 Regressão (testes passam)             | ⬜     |                    |
| 4 | 🧨 Edge Cases (cenários críticos OK)     | ⬜     |                    |
| 5 | 📱 Ambientes (dev/staging/prod OK)       | ⬜     |                    |
| 6 | ⚡ Performance (startup mais rápido)      | ⬜     |                    |
| 7 | ✅ Validação Final                        | ⬜     |                    |

**Resultado V&V:** ⬜ NÃO EXECUTADO / ✅ APROVADO / ❌ REPROVADO

---

### TAREFA 3: Remover Código Morto (Dead Code)

| Campo              | Detalhe                                      |
|--------------------|----------------------------------------------|
| 📌 Status          | 🔴 Pendente |
| 🗓️ Iniciado em     | - |
| ✅ Concluído em    | - |
| 👤 Responsável     | dead-code-eliminator (skill) |
| ⚡ Prioridade      | 🟡 Média |

#### 🔍 O que existe hoje:
> Funções, classes, variáveis e arquivos que não são mais chamados em lugar nenhum do código.

#### 🎯 O que deve ser feito:
1. Executar skill `dead-code-eliminator`
2. Identificar:
   - Funções não chamadas
   - Classes não instanciadas
   - Variáveis não lidas
   - Arquivos não importados
3. Listar candidatos a remoção
4. Remover com validação
5. Testar tudo após remoção

#### ❓ Por que corrigir:
- ✅ Código morto confunde desenvolvedores
- ✅ Aumenta complexidade ciclomática
- ✅ Dificulta refatoração
- ✅ Pesa no bundle final

#### 📦 Entregáveis:
- [ ] Relatório de código morto encontrado
- [ ] Funções/classes/arquivos removidos
- [ ] Testes passando após remoção
- [ ] Métricas de complexidade antes/depois

#### 🛡️ RELATÓRIO V&V

| # | Verificação                              | Status | Observações        |
|---|------------------------------------------|--------|--------------------|
| 1 | 🧪 Integridade (compila sem erros)       | ⬜     |                    |
| 2 | 🔗 Integração (features funcionam)       | ⬜     |                    |
| 3 | 🔄 Regressão (testes passam)             | ⬜     |                    |
| 4 | 🧨 Edge Cases (cenários críticos OK)     | ⬜     |                    |
| 5 | 📱 Ambientes (todos OK)                  | ⬜     |                    |
| 6 | ⚡ Performance (bundle menor)             | ⬜     |                    |
| 7 | ✅ Validação Final                        | ⬜     |                    |

**Resultado V&V:** ⬜ NÃO EXECUTADO / ✅ APROVADO / ❌ REPROVADO

---

### TAREFA 4: Limpar Configurações Obsoletas

| Campo              | Detalhe                                      |
|--------------------|----------------------------------------------|
| 📌 Status          | 🔴 Pendente |
| 🗓️ Iniciado em     | - |
| ✅ Concluído em    | - |
| 👤 Responsável     | housekeeping-agent |
| ⚡ Prioridade      | 🟡 Média |

#### 🔍 O que existe hoje:
> Arquivos de configuração antigos (`.env.example`, `config.old.js`, `webpack.config.v1.js`), configs de ferramentas não usadas mais.

#### 🎯 O que deve ser feito:
1. Identificar configs de ferramentas não usadas (ex: `webpack` se migrou para `vite`)
2. Listar versões antigas de configs (`.v1.`, `.old`, `.bak`)
3. Remover ou arquivar em `.ai-factory/arquivo/`
4. Manter apenas configs ativas

#### ❓ Por que corrigir:
- ✅ Evita confusão sobre qual config usar
- ✅ Previne erros de configuração duplicada
- ✅ Mantém projeto limpo

#### 📦 Entregáveis:
- [ ] Lista de configs obsoletas
- [ ] Configs removidas ou arquivadas
- [ ] Documentação atualizada

#### 🛡️ RELATÓRIO V&V

| # | Verificação                              | Status | Observações        |
|---|------------------------------------------|--------|--------------------|
| 1 | 🧪 Integridade (projeto executa)         | ⬜     |                    |
| 2 | 🔗 Integração (configs ativas OK)        | ⬜     |                    |
| 3 | 🔄 Regressão (nada quebrado)             | ⬜     |                    |
| 4 | 🧨 Edge Cases (ambientes OK)             | ⬜     |                    |
| 5 | 📱 Ambientes (dev/staging/prod OK)       | ⬜     |                    |
| 6 | ⚡ Performance (sem impacto)              | ⬜     |                    |
| 7 | ✅ Validação Final                        | ⬜     |                    |

**Resultado V&V:** ⬜ NÃO EXECUTADO / ✅ APROVADO / ❌ REPROVADO

---

### TAREFA 5: Remover Logs e Arquivos Temporários

| Campo              | Detalhe                                      |
|--------------------|----------------------------------------------|
| 📌 Status          | 🔴 Pendente |
| 🗓️ Iniciado em     | - |
| ✅ Concluído em    | - |
| 👤 Responsável     | housekeeping-agent |
| ⚡ Prioridade      | 🔴 Crítica (segurança) |

#### 🔍 O que existe hoje:
> Arquivos de log (`*.log`), temporários (`*.tmp`, `tmp/`), cache (`__pycache__/`, `.cache/`) podem conter dados sensíveis.

#### 🎯 O que deve ser feito:
1. Escanear projeto em busca de:
   - `*.log` files
   - `*.tmp` files
   - Pastas `tmp/`, `temp/`, `cache/`
   - `__pycache__/`, `.pytest_cache/`
   - `node_modules/.cache/`
2. Adicionar ao `.gitignore` se já não estiver
3. Remover arquivos (não versionados)
4. Configurar limpeza automática (cron/script)

#### ❓ Por que corrigir:
- ✅ **Segurança:** Logs podem conter senhas, tokens, dados de usuários
- ✅ **Privacidade:** LGPD/GDPR requer proteção de dados
- ✅ **Performance:** Discos não enchem desnecessariamente

#### 📦 Entregáveis:
- [ ] Logs e temporários removidos
- [ ] `.gitignore` atualizado
- [ ] Script de limpeza automática configurado
- [ ] Relatório de dados sensíveis encontrados (se houver)

#### 🛡️ RELATÓRIO V&V

| # | Verificação                              | Status | Observações        |
|---|------------------------------------------|--------|--------------------|
| 1 | 🧪 Integridade (projeto executa)         | ⬜     |                    |
| 2 | 🔗 Integração (logs ativos OK)           | ⬜     |                    |
| 3 | 🔄 Regressão (nada quebrado)             | ⬜     |                    |
| 4 | 🧨 Edge Cases (produção não afetada)     | ⬜     |                    |
| 5 | 📱 Ambientes (logs de prod preservados)  | ⬜     |                    |
| 6 | ⚡ Performance (disco liberado)           | ⬜     |                    |
| 7 | ✅ Validação Final                        | ⬜     |                    |

**Resultado V&V:** ⬜ NÃO EXECUTADO / ✅ APROVADO / ❌ REPROVADO

---

### TAREFA 6: Organizar Pastas Bagunçadas

| Campo              | Detalhe                                      |
|--------------------|----------------------------------------------|
| 📌 Status          | 🔴 Pendente |
| 🗓️ Iniciado em     | - |
| ✅ Concluído em    | - |
| 👤 Responsável     | architect + housekeeping-agent |
| ⚡ Prioridade      | 🟡 Média |

#### 🔍 O que existe hoje:
> Pastas como `misc/`, `stuff/`, `novo/`, `teste/`, `backup/` com conteúdo heterogêneo e sem organização.

#### 🎯 O que deve ser feito:
1. Identificar pastas bagunçadas
2. Analisar conteúdo de cada uma
3. Movar arquivos para locais apropriados:
   - Código → `src/`, `lib/`
   - Docs → `docs/`
   - Scripts → `scripts/`
   - Lixo → `.ai-factory/quarentena/`
4. Renomear pastas para nomes descritivos
5. Deletar pastas vazias

#### ❓ Por que corrigir:
- ✅ Melhora navegação no projeto
- ✅ Facilita onboarding de novos devs
- ✅ Previne perda de arquivos importantes

#### 📦 Entregáveis:
- [ ] Mapa de pastas antes/depois
- [ ] Arquivos realocados corretamente
- [ ] Pastas vazias removidas
- [ ] Estrutura documentada

#### 🛡️ RELATÓRIO V&V

| # | Verificação                              | Status | Observações        |
|---|------------------------------------------|--------|--------------------|
| 1 | 🧪 Integridade (imports atualizados)     | ⬜     |                    |
| 2 | 🔗 Integração (paths corrigidos)         | ⬜     |                    |
| 3 | 🔄 Regressão (projeto executa)           | ⬜     |                    |
| 4 | 🧨 Edge Cases (builds OK)                | ⬜     |                    |
| 5 | 📱 Ambientes (todos OK)                  | ⬜     |                    |
| 6 | ⚡ Performance (sem impacto)              | ⬜     |                    |
| 7 | ✅ Validação Final                        | ⬜     |                    |

**Resultado V&V:** ⬜ NÃO EXECUTADO / ✅ APROVADO / ❌ REPROVADO

---

### TAREFA 7: Atualizar .gitignore

| Campo              | Detalhe                                      |
|--------------------|----------------------------------------------|
| 📌 Status          | 🔴 Pendente |
| 🗓️ Iniciado em     | - |
| ✅ Concluído em    | - |
| 👤 Responsável     | housekeeping-agent |
| ⚡ Prioridade      | 🟠 Alta |

#### 🔍 O que existe hoje:
> `.gitignore` desatualizado permite commit de arquivos que não deveriam estar no repositório.

#### 🎯 O que deve ser feito:
1. Analisar `.gitignore` atual
2. Adicionar padrões para:
   - Logs (`*.log`, `logs/`)
   - Temporários (`*.tmp`, `*.temp`, `tmp/`)
   - IDE (`.vscode/`, `.idea/`, `*.swp`)
   - Dependências (`node_modules/`, `venv/`, `.venv/`)
   - Build (`dist/`, `build/`, `output/`)
   - Environment (`.env`, `.env.local`, `*.key`)
   - OS (`.DS_Store`, `Thumbs.db`)
3. Remover entradas obsoletas
4. Validar com `git check-ignore`

#### ❓ Por que corrigir:
- ✅ Previne commit acidental de lixo
- ✅ Protege dados sensíveis
- ✅ Mantém repositório limpo

#### 📦 Entregáveis:
- [ ] `.gitignore` atualizado
- [ ] Arquivos já cometidos removidos do git (git rm --cached)
- [ ] Validação com `git status` limpo

#### 🛡️ RELATÓRIO V&V

| # | Verificação                              | Status | Observações        |
|---|------------------------------------------|--------|--------------------|
| 1 | 🧪 Integridade (git funciona)            | ⬜     |                    |
| 2 | 🔗 Integração (CI/CD não quebrada)       | ⬜     |                    |
| 3 | 🔄 Regressão (nada crítico removido)     | ⬜     |                    |
| 4 | 🧨 Edge Cases (ambientes OK)             | ⬜     |                    |
| 5 | 📱 Ambientes (devs conseguem trabalhar)  | ⬜     |                    |
| 6 | ⚡ Performance (repo menor)               | ⬜     |                    |
| 7 | ✅ Validação Final                        | ⬜     |                    |

**Resultado V&V:** ⬜ NÃO EXECUTADO / ✅ APROVADO / ❌ REPROVADO

---

### TAREFA 8: Criar Script de Limpeza Automática

| Campo              | Detalhe                                      |
|--------------------|----------------------------------------------|
| 📌 Status          | 🔴 Pendente |
| 🗓️ Iniciado em     | - |
| ✅ Concluído em    | - |
| 👤 Responsável     | housekeeping-agent |
| ⚡ Prioridade      | 🟡 Média |

#### 🔍 O que existe hoje:
> Limpeza manual é esquecida e inconsistente.

#### 🎯 O que deve ser feito:
1. Criar script `scripts/cleanup.sh` (ou `.ps1` para Windows)
2. Script deve:
   - Remover `*.log`, `*.tmp`
   - Limpar caches (`__pycache__`, `.cache`, `node_modules/.cache`)
   - Esvaziar lixeira do projeto
   - Reportar espaço liberado
3. Agendar execução semanal (cron/Task Scheduler)
4. Adicionar ao `package.json` como `npm run cleanup`

#### ❓ Por que corrigir:
- ✅ Automatização previne acumulo
- ✅ Economia de tempo dos desenvolvedores
- ✅ Disco sempre limpo

#### 📦 Entregáveis:
- [ ] Script `cleanup.sh` / `cleanup.ps1` criado
- [ ] Script testado e seguro
- [ ] Agendamento configurado
- [ ] Documentação de uso

#### 🛡️ RELATÓRIO V&V

| # | Verificação                              | Status | Observações        |
|---|------------------------------------------|--------|--------------------|
| 1 | 🧪 Integridade (script não quebra nada)  | ⬜     |                    |
| 2 | 🔗 Integração (projeto executa após)     | ⬜     |                    |
| 3 | 🔄 Regressão (nada crítico removido)     | ⬜     |                    |
| 4 | 🧨 Edge Cases (prod não afetado)         | ⬜     |                    |
| 5 | 📱 Ambientes (todos OK)                  | ⬜     |                    |
| 6 | ⚡ Performance (disco liberado)           | ⬜     |                    |
| 7 | ✅ Validação Final                        | ⬜     |                    |

**Resultado V&V:** ⬜ NÃO EXECUTADO / ✅ APROVADO / ❌ REPROVADO

---

## 📊 Instruções de Uso

1. **Executar skill `housekeeping-agent`** para identificar lixo
2. **Preencher tarefas** conforme itens são encontrados
3. **Mover para quarentena** antes de deletar (`.ai-factory/quarentena/`)
4. **Executar V&V** após cada remoção
5. **Registrar no LOG-VALIDACOES.md** global
6. **Atualizar INDEX.md** com progresso

---

## 🗂️ Estrutura de Quarentena

```
.ai-factory/
└── quarentena/
    ├── 2026-07-02-arquivos-log/
    ├── 2026-07-03-dependencias-nao-usadas/
    └── 2026-07-04-codigo-morto/
```

**Regra:** Arquivos ficam em quarentena por **7 dias** antes de deleção permanente.

---

## 🔗 Referências

- [Protocolo V&V](../../standards/vv-protocol.md)
- [Log de Validações](../LOG-VALIDACOES.md)
- [Painel Geral](../INDEX.md)
- [Skill: Dead Code Eliminator](../../skills/dead-code-eliminator.md)
- [Skill: Housekeeping Agent](../../agents/housekeeping-agent.md)