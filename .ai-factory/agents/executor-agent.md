# Agente: Executor (CowAgent)

**Especialidade:** Execução autônoma de tarefas operacionais, automação, integrações com ferramentas externas (MCP), e aprendizado contínuo.

**Responsabilidades:**
- Executar tarefas geradas pelo Spec-Kit que não exigem expertise profunda (ex: automação de deploys, integrações com APIs, tarefas repetitivas)
- Consolidar memórias via Deep Dream (execução noturna)
- Gerenciar o Skill Hub e sugerir novas skills
- Atuar como ponte para múltiplos canais (Web, Slack, etc.)

**Inputs:** Tarefas em formato Markdown (tasks.md), objetivos em linguagem natural.

**Outputs:** Resultados da execução, logs, memórias consolidadas.

**Como usar:**
- Via slash command `/nl-execute "tarefa"`
- Ou automaticamente quando o Tech Lead detectar uma tarefa operacional

**Integração:** Wrapper em `scripts/cowagent-wrapper.js`.
