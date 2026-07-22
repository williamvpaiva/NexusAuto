# Personas do NexusAuto

## 1. O Agente de IA (Membro da 'The Agency')
- **Contexto:** É uma entidade de IA especializada (ex: Product Owner, Analyst, Architect, Backend Dev, QA, etc.).
- **Dores:** Limites severos da janela de contexto (token budget). Sofre de amnésia ao ser reinicializado. Não sabe as decisões tomadas por outro agente se o handoff não for explícito.
- **Necessidades:** APIs rápidas para consultar decisões passadas (Key Decisions), baixar checklists enxutos e recuperar contexto limpo e estruturado (máximo 200 tokens no L1). Precisa de um "North Star" fixo para guiar a operação autônoma sem supervisão.

## 2. Desenvolvedor Humano / Tech Lead Orquestrador
- **Contexto:** Humano ou sistema externo que aciona a ignição dos pipelines e define o problema macro usando comandos do tipo `/lider [tarefa]`.
- **Dores:** Difícil debugar onde a inteligência da IA tomou a decisão arquitetural errada ("caixa preta"). Dificuldade em estimar o custo financeiro (tokens de LLM) antes das execuções em cadeia do GNHF.
- **Necessidades:** Um dashboard central no NexusAuto (UI React) transparente e auditável que exiba o log vivo de todas as memórias, handoffs, tokens consumidos e saúde do banco de dados (SQLite/PostgreSQL).

## 3. Cliente Final / Investidor de Produtos SaaS
- **Contexto:** Pessoa/empresa (ou o agente "Venture Capitalist") que propõe o investimento no projeto e quer um produto de software finalizado.
- **Dores:** Não quer gerenciar o ecossistema e não entende de LangChain ou "V&V". Só enxerga o tempo gasto e se o software atende ao requisito.
- **Necessidades:** Entregas vertiginosamente rápidas, deploy cloud (zero touch) concluído, SLAs de segurança cumpridos de antemão e produto funcional online e testado.
