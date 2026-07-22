# ADR 001: Governança e Integridade do Ecossistema NexusAuto

**Data:** 2026-07-19
**Status:** Aceito
**Contexto:**
Durante a auditoria de integridade do ecossistema de multiagentes (INTEGRITY-REPORT.md), constatou-se que o repositório sofria de:
1. Lock files duplicados (`.kilo` vs `.kilocode`).
2. Artefatos não versionáveis vazando para o Git (`build/`, `logs/`, `venv/`).
3. Arquivos de configuração de agentes e skills sobrepostas criando ambiguidades.
4. Múltiplos `package.json` sem uma política clara de monorepo.

**Decisões:**

1. **Gestão de Dependências (Monorepo vs Multi-repo)**
   *   O projeto adota uma arquitetura **Multi-repo Lógica** gerenciada em pastas raiz (`backend/`, `frontend/`, `.ai-factory/`, etc.).
   *   **Regra:** Cada subprojeto possui seu próprio `package.json` e `package-lock.json`. O diretório raiz **NÃO** gerencia dependências globais via workspaces do npm para evitar conflitos de versão entre scripts isolados da IA e os serviços da aplicação principal.
   *   *Ação Tomada:* O diretório duplicado `.kilocode` foi expurgado para evitar dependências fantasma.

2. **Higiene do Git**
   *   Artefatos gerados dinamicamente (`build/`, `logs/`, relatórios de token manager e virtuais Python) foram estritamente incluídos no `.gitignore`.
   *   Apenas os arquivos de estado persistente (`REGISTRO-GLOBAL.json`, `economia-acumulada.json`) continuam rastreados para fornecer contexto contínuo para o orquestrador (Tech Lead).

3. **Consistência de Configurações de Agentes**
   *   Os arquivos `.ai-factory/agents/configs/*.json` foram revisados. A margem de tokens (`max_tokens_per_agent: 30000` vs `Tech-Lead: 50000`) é consistente com a arquitetura hierárquica. O Tech-Lead orquestra e, portanto, tem um budget maior.
   *   O caminho do `handoff_template` está padronizado para convergir no arquivo unificado.

4. **Governança de Skills (Registry)**
   *   Todas as skills redundantes foram mescladas (ex: `code-reviewer` -> `code-review`).
   *   Foi introduzido o `SKILLS-REGISTRY.md` como Single Point of Truth (SPoT) obrigatório para o roteamento de tarefas.

**Consequências:**
*   Redução drástica do tamanho da árvore do git.
*   Prevenção de regressões no CI/CD causadas por artefatos de build viciados.
*   Melhor precisão nas respostas dos LLMs, que agora consultam um *registry* unificado em vez de skills concorrentes.
