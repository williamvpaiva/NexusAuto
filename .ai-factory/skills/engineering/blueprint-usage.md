---
name: Blueprint Usage and Templates
description: Guidelines on how to utilize the awesome-llm-apps blueprints for RAG, Voice, and MCP architectures.
role: architect
---

# Blueprint Usage and Templates

O NexusAuto possui um vasto catálogo de plantas baixas (Blueprints) disponíveis localmente em `.ai-factory/blueprints/awesome-llm-apps`. 
Esses templates contêm código-fonte testado e aprovado para integrações complexas de IA, incluindo:
- RAG Pipelines
- Model Context Protocol (MCP) Agents
- Multi-Agent Teams
- Voice AI Agents

## Como utilizar:
1. **Nunca reinvente a roda**: Se a especificação (spec.md) solicitar funcionalidades de IA conversacional avançada, consulte o SQLite memory (via CLI ou script) pelos blueprints usando a tag `blueprint`.
2. **Adaptação**: Não copie o código 1:1. Use o blueprint como uma referência de arquitetura. Integre-o respeitando os padrões de roteamento e serviços do NexusAuto.
3. **Paths importantes**: 
   - RAG: `.ai-factory/blueprints/awesome-llm-apps/rag_tutorials`
   - MCP: `.ai-factory/blueprints/awesome-llm-apps/mcp_ai_agents`
   - Multi-Agent: `.ai-factory/blueprints/awesome-llm-apps/advanced_ai_agents/multi_agent_apps`

Sempre extraia as melhores práticas (e.g. controle de estado com LangGraph, configuração de LLM providers) e converta isso em tarefas executáveis no Kanban.
