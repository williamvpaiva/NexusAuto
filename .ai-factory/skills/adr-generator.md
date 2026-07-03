# Skill: ADR Generator

> Geração automática de Architecture Decision Records para documentar decisões arquiteturais de forma padronizada e rastreável

---

## 🎯 Objetivo

Criar e manter Architecture Decision Records (ADRs) para toda decisão arquitetural significativa, seguindo o formato MADR (Markdown ADR), garantindo que o contexto, alternativas e trade-offs de cada decisão sejam documentados e acessíveis.

---

## 🔁 Gatilhos de Acionamento

- Decisão arquitetural tomada em reunião/discussão
- Nova tecnologia adotada no projeto
- Mudança significativa de estrutura (refatoração grande)
- Framework ou biblioteca substituído
- Decisão de design que afeta múltiplos módulos
- Solicitação de "documente esta decisão como ADR"

---

## 📋 Processo de 4 Passos

### PASSO 1: CAPTURAR CONTEXTO DA DECISÃO

**Objetivo:** Documentar o problema e contexto que motivam a decisão

**Ações:**
1. Identificar o problema sendo resolvido
2. Listar forças e restrições envolvidas:
   - Técnicas, de negócio, de prazo, de equipe
3. Documentar o estado atual e por que não atende
4. Registrar participantes da decisão

**Output:**
```markdown
# ADR-001: Adoção de Microservices para Módulo de Pedidos

## Status
✅ Aprovado em 2026-07-02

## Contexto
O módulo de pedidos atualmente é um monolito com 50K+ linhas.
A equipe de 8 desenvolvedores enfrenta:
- Deploy lento (45min para build + teste + deploy)
- Conflitos frequentes de merge (15/semana)
- Dificuldade de escalar (apenas 1 instância pode escrever)
- Testing hell (suite leva 2h para rodar completa)

## Forças e Restrições
- Time: 8 devs com experiência em Node.js
- Prazo: 3 meses para migração completa
- Orçamento: $5k/mês para infraestrutura
- Requisito: Zero downtime durante migração
- Compliance: Logs de auditoria obrigatórios (3 anos)
```

---

### PASSO 2: LISTAR ALTERNATIVAS CONSIDERADAS

**Objetivo:** Documentar todas as opções avaliadas com prós e contras

**Ações:**
1. Listar no mínimo 2 alternativas viáveis
2. Para cada alternativa, documentar:
   - Prós (mínimo 3)
   - Contras (mínimo 3)
3. Incluir alternativa de "não fazer nada"
4. Se aplicável, mencionar prova de conceito realizada

**Output:**
```markdown
## Alternativas Consideradas

### Alternativa A: Monolito Modular (Manter + Organizar)
**Prós:**
- Menor investimento inicial (2 semanas)
- Sem complexidade de comunicação entre serviços
- Transação ACID entre módulos
- Monitoramento mais simples

**Contras:**
- Escalabilidade limitada (tudo escala junto)
- Deploy continua afetando tudo
- Conflitos de merge persistem
- Acoplamento tende a aumentar com o tempo

### Alternativa B: Microservices (ADOTADA) ✅
**Prós:**
- Deploys independentes por serviço
- Escalabilidade granular (cada serviço escala sozinho)
- Times podem trabalhar em paralelo sem conflitos
- Isolamento de falhas (um serviço cair não derruba tudo)
- Tecnologia apropriada para cada serviço

**Contras:**
- Complexidade de comunicação (rede, latência)
- Necessidade de consistência eventual
- Observabilidade mais complexa (tracing distribuído)
- DevOps mais sofisticado (orquestração)
- Custo operacional maior ($4k/mês extra)

### Alternativa C: Serverless (Lambda + Step Functions)
**Prós:**
- Escalabilidade infinita automática
- Pagamento por uso (custo variável)
- Zero gerenciamento de infraestrutura

**Contras:**
- Cold start (latência de 200ms-1s)
- Limite de 15min de execução (inviável para relatórios)
- Vendor lock-in
- Debugging mais difícil

### Alternativa D: Não Fazer Nada (Status Quo)
**Contras:**
- Problemas escalam com o crescimento
- Produtividade continua caindo
- Débito técnico aumenta exponencialmente

## Prova de Conceito
Realizada POC com 2 serviços durante 2 semanas:
- OrderRead (GraphQL): 50ms p95
- OrderWrite (REST): 100ms p95
- Comunicação via RabbitMQ com 99.9% de entrega
- Conclusão: Viável, com latência aceitável
```

---

### PASSO 3: REGISTRAR DECISÃO E CONSEQUÊNCIAS

**Objetivo:** Documentar a decisão tomada e seus impactos esperados

**Ações:**
1. Registrar a decisão de forma clara e específica
2. Documentar consequências positivas esperadas
3. Documentar consequências negativas (trade-offs)
4. Associar a decisão a requisitos de compliance

**Output:**
```markdown
## Decisão

Adotaremos microservices para o módulo de pedidos, seguindo os
padrões definidos em `architecture-decisions.md`. Os 4 serviços
iniciais serão: OrderRead, OrderWrite, OrderHistory, OrderReport.

## Consequências

### Positivas
- Deploys independentes (de 45min para 5min por serviço)
- Paralelismo: 8 devs podem trabalhar sem conflitos
- Escalabilidade: OrderRead escala para 10K req/s
- Tecnologias: GraphQL para leitura, REST para escrita

### Negativas (Trade-offs)
- Consistência eventual aceita (até 5s de delay)
- Infraestrutura: Kubernetes obrigatório ($3k/mês extra)
- Equipe precisa aprender: k8s, tracing, mensageria
- Migração: 3 meses de dual-run

## Compliance

- [x] Logs de auditoria centralizados no Elasticsearch
- [x] Rastreabilidade via correlation-id entre serviços
- [x] Retenção de logs: 3 anos (S3 Glacier)
- [ ] Pendente: Revisão de segurança por time de security
```

---

### PASSO 4: SALVAR E REFERENCIAR ADR

**Objetivo:** Armazenar o ADR no local padrão e criar referências

**Ações:**
1. Salvar em `.ai-factory/adr/ADR-NNN.md`
2. Atualizar índice de ADRs
3. Criar referência em documentos relacionados:
   - `README.md` do módulo afetado
   - `architecture.md` do projeto
4. Notificar stakeholders sobre a decisão

**Output:**
```markdown
## Registro do ADR

### Arquivo
`.ai-factory/adr/ADR-001.md`

### Índice de ADRs Atualizado

| ADR | Título | Status | Data | Autor |
|-----|--------|--------|------|-------|
| 001 | Adoção de Microservices | ✅ Aprovado | 2026-07-02 | architect |
| 002 | GraphQL para OrderRead | ✅ Aprovado | 2026-07-02 | architect |
| 003 | RabbitMQ como Message Broker | 🔄 Em discussão | 2026-07-02 | tech-lead |

### Referências
- `docs/architecture.md:45` → Seção de Microservices
- `services/order-read/README.md` → Primeiro serviço implementado
- `SLACK-20260702.md` → Discussão completa no canal #architecture

### Notificação
- [x] Canal #architecture notificado
- [x] Tech leads de outros módulos informados
- [x] Adicionado ao board de arquitetura
```

---

## 💻 Exemplo de Prompt

```
Documente a decisão de adotar RabbitMQ como message broker para
comunicação entre microservices de pedidos. Formato ADR completo
com: contexto (precisa de async messaging), 3 alternativas
(RabbitMQ, Kafka, SQS), prós e contras de cada, decisão final,
consequências e trade-offs.
```

---

## ✅ Métricas de Sucesso

| Métrica | Alvo | Como Medir |
|---------|------|------------|
| ADRs criados | 100% das decisões arquiteturais | Contagem em `.ai-factory/adr/` |
| Completude do template | 100% dos campos | Checklist no ADR |
| Alternativas por ADR | ≥ 3 | Contagem no ADR |
| Trade-offs documentados | ≥ 3 por ADR | Seção de consequências |
| ADRs revisados | 100% por tech-lead | Status de review no índice |
| Aderência ao formato MADR | 100% | Validação automática |

---

## 🔗 Integrações

### Acionado Por
- `architecture-analyzer` (quando identifica gap arquitetural)
- `tech-lead` (decisões de arquitetura)
- `architect` (planejamento de solução)
- `pattern-matcher` (decisão de aplicar padrão)
- `coupling-detector` (decisão de desacoplamento)

### Aciona
- `modularity-optimizer` (após decisão de modularizar)
- `code-smell-detector` (revisar código afetado)
- `complexity-analyzer` (medir impacto da decisão)

### Registra Em
- `.ai-factory/adr/ADR-NNN.md`
- `.ai-factory/adr/INDEX.md`
- `docs/architecture.md`

---

**Versão:** 1.0.0  
**Universal:** Sim (formato MADR padrão de mercado)  
**Tempo Médio:** 30-60min por ADR  
**Taxa de Sucesso:** >90% (ADRs consultados após 6 meses)
