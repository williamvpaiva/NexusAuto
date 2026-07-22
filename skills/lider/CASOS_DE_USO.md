# Casos de Uso Avançados - Líder (Tech Lead / Orquestrador)

## Visão Geral

Este documento apresenta casos de uso avançados para a skill **Líder**, demonstrando cenários complexos de orquestração, integração multi-agente, e otimização de fluxo de trabalho.

---

## Caso de Uso 1: Lançamento Completo de Produto Digital

### Cenário
Usuário deseja lançar um curso online de "React Avançado" com estratégia completa de monetização, campanha de marketing e vídeo promocional.

### Comando
```bash
/lider "Quero lançar um curso de React Avançado com estratégia completa"
```

### Fluxo de Orquestração

#### Fase 1: Estruturação do Produto
**Agente:** `digital-product-creator`

```markdown
1. Acionar skill: digital-product-creator
2. Comando: node scripts/digital-product.js create curso
3. Inputs:
   - Tema: "React Avançado"
   - Público: Desenvolvedores com experiência básica
   - Formato: Vídeo + Exercícios + Projeto Final
4. Outputs:
   - Estrutura de módulos (8-12 módulos)
   - Cronograma de produção (4-6 semanas)
   - Materiais necessários (slides, código, exercícios)
5. Salvar memória:
   node scripts/memory-manager.js save "Estrutura curso React Avançado" \
     --agent digital-product-creator --type decision --tags curso,react
```

#### Fase 2: Estratégia de Monetização
**Agente:** `monetization-strategist`

```markdown
1. Acionar skill: monetization-strategist
2. Comando: node scripts/digital-product.js monetize precificação
3. Inputs:
   - Valor percebido: Alto (curso avançado)
   - Concorrência: R$ 297-597
   - Público: Desenvolvedores brasileiros
4. Outputs:
   - Preço sugerido: R$ 497 (ou 12x R$ 49,90)
   - Upsell: Mentoria em grupo (+R$ 297)
   - Downsell: Apenas primeiros módulos (R$ 197)
   - Afiliados: 40% de comissão
5. Salvar memória:
   node scripts/memory-manager.js save "Precificação curso React" \
     --agent monetization-strategist --type decision --tags pricing,estratégia
```

#### Fase 3: Planejamento de Lançamento
**Agente:** `product-launch-manager`

```markdown
1. Acionar skill: product-launch-manager
2. Comando: node scripts/digital-product.js launch planejamento
3. Inputs:
   - Tipo: Lançamento Semente (primeira vez)
   - Orçamento: R$ 2.000 (tráfego)
   - Prazo: 30 dias
4. Outputs:
   - Cronograma de emails (7 emails)
   - Sequência de vídeos (3 aulas gratuitas)
   - Tráfego: Facebook Ads + LinkedIn
   - Métricas: 500 leads, 25 vendas (5%)
5. Salvar memória:
   node scripts/memory-manager.js save "Lançamento curso React" \
     --agent product-launch-manager --type context --tags lançamento,marketing
```

#### Fase 4: Vídeo Promocional
**Agente:** `hyperframes`

```markdown
1. Acionar skill: hyperframes
2. Comando: hyperframes create video
3. Inputs:
   - Roteiro: "Domine React Avançado em 6 semanas"
   - Duração: 60-90 segundos
   - Estilo: Moderno, tech, animações
4. Outputs:
   - Vídeo MP4 (1080p)
   - Legendas automáticas
   - Versões: Instagram (1:1), YouTube (16:9), Stories (9:16)
5. Salvar memória:
   node scripts/memory-manager.js save "Vídeo lançamento React" \
     --agent hyperframes --type code --tags video,marketing
```

### Consolidação no Wiki

```bash
# Criar página mestre no wiki
node scripts/memory-manager.js wiki-save "Lançamento Curso React Avançado" \
  --agent tech-lead \
  --type entity \
  --tags "curso,react,lançamento,monetização,vídeo"

# Arquivo gerado: .ai-factory/wiki/entities/2026-07-21-tech-lead-lancamento-curso-react-*.md
```

### Resultado Final

```markdown
## Produto: React Avançado

### Estrutura
- 10 módulos, 45 aulas, 6 semanas
- Projeto final: Dashboard com React Query + TypeScript

### Monetização
- Preço: R$ 497 (ou 12x R$ 49,90)
- Upsell: Mentoria (+R$ 297)
- Afiliados: 40% de comissão

### Lançamento
- 30 dias de campanha
- 7 emails, 3 aulas gratuitas
- Meta: 500 leads, 25 vendas (5%)

### Marketing
- Vídeo promocional (90s)
- Instagram, YouTube, LinkedIn
- Orçamento: R$ 2.000
```

---

## Caso de Uso 2: Debug de Produção em Cascata

### Cenário
Checkout está falhando intermitentemente em produção. Múltiplos serviços envolvidos: backend, frontend, banco de dados.

### Comando
```bash
/lider "O checkout está falhando intermitentemente - usuários reportando erro 500"
```

### Fluxo de Orquestração

#### Passo 1: Análise Inicial e Roteamento
**Agente:** `tech-lead` (você)

```markdown
1. Analisar keywords: "checkout", "falhando", "erro 500", "produção"
2. Keywords detectadas:
   - "checkout" → backend-dev, frontend-dev
   - "erro 500" → backend-dev, devops
   - "produção" → devops
3. Score de criticidade:
   - Auth/Pagamento envolvido: +5 (checkout = pagamento)
   - Multi-agent handoff: +3 (múltiplos serviços)
   - Schema change: 0 (não detectado)
   - Total: 8 → 🔴 Crítico (V&V Nível 1)
4. Decisão: Acionar systematic-debugging + delegar para múltiplos agentes
```

#### Passo 2: Debug Sistemático
**Agente:** `systematic-debugging`

```markdown
1. Fase 1: Reprodução
   - Verificar logs de erro (backend/src/checkout/controller.ts)
   - Identificar padrão temporal (horário de pico?)
   - Coletar stack traces
   
2. Fase 2: Isolamento
   - Testar API diretamente: POST /api/checkout
   - Verificar banco de dados (locks, timeouts)
   - Checar integrações externas (gateway de pagamento)
   
3. Fase 3: Hipóteses
   - H1: Timeout de banco em queries de checkout
   - H2: Rate limiting do gateway de pagamento
   - H3: Condição de corrida em atualizações de estoque
   
4. Salvar descobertas:
   node scripts/memory-manager.js save "Checkout erro 500 - hipóteses" \
     --agent systematic-debugging --type decision --tags bug,checkout,produção
```

#### Passo 3: Delegação para Agentes Especializados

**3a. Backend Dev - Investigar API**
```markdown
Agente: backend-dev
Tarefa: Investigar endpoint POST /api/checkout
Ações:
  - Adicionar logging detalhado no controller
  - Verificar queries SQL (N+1?)
  - Testar com carga simulada
  - Checar timeouts de conexão
```

**3b. DevOps - Investigar Infraestrutura**
```markdown
Agente: devops
Tarefa: Verificar infraestrutura de produção
Ações:
  - Checar métricas de CPU/memória
  - Analisar logs do Kubernetes (se aplicável)
  - Verificar health checks
  - Inspecionar connection pool do banco
```

**3c. QA Tester - Reproduzir Bug**
```markdown
Agente: qa-tester
Tarefa: Criar teste de reprodução
Ações:
  - Script de carga simulando 100 checkouts/min
  - Teste de estresse no endpoint
  - Verificar condições de corrida
```

#### Passo 4: Consolidação e Fix

```markdown
1. Receber reports dos agentes
2. Identificar causa raiz:
   - Ex: Query N+1 no cálculo de frete + timeout de 30s
   
3. Delegar fix para backend-dev:
   - Otimizar query com JOIN
   - Adicionar índice em orders.shipping_address
   - Implementar cache de CEP (5min)
   
4. Validar fix (V&V Nível 1 - Crítico):
   - [x] Integridade (compila)
   - [x] Integração (módulos dependentes)
   - [x] Regressão (testes existentes)
   - [x] Edge Cases (cep inválido, timeout)
   - [x] Ambientes (dev → staging → prod)
   - [x] Performance (benchmark antes/depois)
   - [x] Validação Final
   
5. Salvar lição:
   node scripts/memory-manager.js save "Checkout N+1 fix - lição" \
     --agent tech-lead --type lesson --tags bugfix,performance,checkout
```

### Resultado Final

```markdown
## Incidente: Checkout Erro 500

### Causa Raiz
- Query N+1 no cálculo de frete (150ms → 4500ms em pico)
- Timeout de 30s excedido em horários de pico

### Fix Implementado
- Otimizada query com JOIN (150ms → 45ms)
- Adicionado índice em orders.shipping_address
- Cache de CEP com Redis (5min TTL)

### Validação
- V&V Nível 1 (7 passos) ✅
- Testes de carga: 100 req/min → 0 erros
- Deploy em produção: 2026-07-21 14:30 UTC

### Lições Aprendidas
- Adicionar monitoramento de queries lentas (>100ms)
- Implementar circuit breaker para gateway de pagamento
- Revisar todas as queries de checkout (auditoria completa)
```

---

## Caso de Uso 3: Migração de Arquitetura Monólito → Microserviços

### Cenário
Sistema monolítico crescendo, necessidade de escalar times e deploy independente. Decisão de migrar para microserviços.

### Comando
```bash
/lider "Precisamos migrar nosso monólito para microserviços - planeje a arquitetura"
```

### Fluxo de Orquestração

#### Fase 1: Análise da Arquitetura Atual
**Agente:** `architect`

```markdown
1. Inventário do monólito:
   - Módulos: Auth, Users, Products, Orders, Payments, Shipping
   - Acoplamento: Alto (módulos compartilham banco de dados)
   - Deploy: Único (45min de deploy, rollback complexo)
   
2. Identificar bounded contexts (DDD):
   - Contexto de Autenticação (Auth + Users)
   - Contexto de Catálogo (Products)
   - Contexto de Pedidos (Orders + Payments + Shipping)
   
3. Salvar análise:
   node scripts/memory-manager.js save "Análise monólito - bounded contexts" \
     --agent architect --type adr --tags arquitetura,ddd,microserviços
```

#### Fase 2: Design da Nova Arquitetura
**Agente:** `architect` + `backend-dev`

```markdown
1. Definir microserviços:
   - auth-service (Node.js + JWT + Redis)
   - catalog-service (Node.js + MongoDB)
   - orders-service (Node.js + PostgreSQL)
   - payments-service (Node.js + Stripe API)
   - shipping-service (Node.js + Correios API)
   
2. Definir comunicação:
   - Síncrona: REST API (gateway → serviços)
   - Assíncrona: RabbitMQ (eventos de domínio)
   
3. Infraestrutura:
   - Kubernetes (EKS ou GKE)
   - Service Mesh: Istio
   - Observabilidade: Prometheus + Grafana + Jaeger
   
4. Salvar decisão:
   node scripts/memory-manager.js save "Arquitetura microserviços - decisão" \
     --agent architect --type adr --tags arquitetura,microserviços,kubernetes
```

#### Fase 3: Plano de Migração (Strangler Fig Pattern)
**Agente:** `architect` + `devops`

```markdown
1. Fase 1 (Semana 1-2): Infraestrutura Base
   - Setup Kubernetes
   - Configurar CI/CD por serviço
   - Implementar API Gateway
   
2. Fase 2 (Semana 3-4): Primeiro Serviço (Auth)
   - Extrair módulo de auth para serviço independente
   - Manter compatibilidade com monólito (dual-write)
   - Migrar tráfego gradualmente (10% → 50% → 100%)
   
3. Fase 3 (Semana 5-8): Serviços Restantes
   - Catalog (mais simples, sem dependências)
   - Shipping (integração externa)
   - Payments (crítico, requer testes extensivos)
   - Orders (último, depende dos outros)
   
4. Fase 4 (Semana 9-10): Descomissionar Monólito
   - Remover código migrado
   - Desligar banco de dados antigo
   - Manter apenas como fallback (30 dias)
   
5. Salvar plano:
   node scripts/memory-manager.js save "Plano de migração - strangler fig" \
     --agent architect --type decision --tags migração,microserviços
```

#### Fase 4: Implementação Guiada por Testes
**Agente:** `backend-dev` + `qa-tester`

```markdown
Para cada serviço:
1. Criar testes de contrato (Pact.io)
2. Implementar serviço com TDD
3. Testes de integração (Testcontainers)
4. Testes de carga (k6)
5. Validação V&V Nível 2 (Médio)
```

#### Fase 5: Monitoramento e Observabilidade
**Agente:** `devops` + `performance`

```markdown
1. Implementar distributed tracing (Jaeger)
2. Configurar SLOs por serviço:
   - Availability: 99.9%
   - Latency p95: <200ms
   - Error rate: <0.1%
3. Dashboards no Grafana
4. Alertas no PagerDuty
```

### Resultado Final

```markdown
## Migração: Monólito → Microserviços

### Arquitetura Final
- 5 microserviços (auth, catalog, orders, payments, shipping)
- Kubernetes (EKS)
- API Gateway + Istio Service Mesh
- Observabilidade completa (tracing, metrics, logs)

### Métricas de Sucesso
- Deploy time: 45min → 3min por serviço
- Rollback: Complexo → 1 comando
- Escalabilidade: Horizontal por serviço
- Team autonomy: 1 squad por serviço

### Lições Aprendidas
- Começar pelo serviço mais simples (auth)
- Manter compatibilidade durante migração (dual-write)
- Investir em observabilidade antes de migrar
- Testes de contrato são essenciais
```

---

## Caso de Uso 4: Auditoria de Segurança OWASP + LGPD

### Cenário
Startup em crescimento precisa de auditoria completa de segurança antes de rodada de investimento. Requisitos: OWASP Top 10 + LGPD compliance.

### Comando
```bash
/lider "Precisamos de auditoria completa de segurança para investidores - OWASP + LGPD"
```

### Fluxo de Orquestração

#### Fase 1: Scanning Automatizado
**Agente:** `security`

```markdown
1. Hunt Skills acionadas:
   - hunt-n-plus-one-queries
   - hunt-missing-input-validation
   - hunt-hardcoded-secrets
   - hunt-missing-error-handling
   
2. Ferramentas:
   - npm audit (dependências)
   - Semgrep (análise estática)
   - OWASP ZAP (pentest automatizado)
   
3. Salvar findings:
   node scripts/memory-manager.js save "Security scan - findings iniciais" \
     --agent security --type decision --tags segurança,owasp,audit
```

#### Fase 2: Validação Manual
**Agente:** `security` + `backend-dev`

```markdown
1. Validar cada finding:
   - True positive → Priorizar por severidade
   - False positive → Documentar justificativa
   
2. Testes manuais:
   - SQL Injection (login, search forms)
   - XSS (comments, user input)
   - Broken Authentication (session management)
   - Sensitive Data Exposure (API responses)
```

#### Fase 3: LGPD Compliance Check
**Agente:** `security` + `product-owner`

```markdown
1. Mapear dados pessoais:
   - Users table (nome, email, CPF, endereço)
   - Orders table (histórico de compras)
   - Logs (IP addresses, user agents)
   
2. Verificar requisitos LGPD:
   - [ ] Consentimento explícito (checkboxes)
   - [ ] Right to be forgotten (delete account)
   - [ ] Data portability (export data)
   - [ ] Privacy by design (encryption, access control)
   - [ ] DPO contato (privacy@company.com)
   
3. Salvar compliance:
   node scripts/memory-manager.js save "LGPD compliance check" \
     --agent security --type decision --tags lgpd,privacy,compliance
```

#### Fase 4: Remediation
**Agente:** `backend-dev` + `frontend-dev`

```markdown
Priorização por risco:

🔴 Crítico (Semana 1):
- Hardcoded secrets → Mover para AWS Secrets Manager
- SQL Injection → Parameterized queries
- Missing auth → JWT validation em todos os endpoints

🟡 Alto (Semana 2-3):
- XSS vulnerabilities → Sanitize inputs, CSP headers
- Broken access control → RBAC implementation
- Missing rate limiting → Redis-based rate limiter

🟢 Médio (Semana 4):
- Error messages → Não expor stack traces
- Logging → Remover dados sensíveis dos logs
- HTTPS → Forçar em todas as rotas
```

#### Fase 5: Relatório para Investidores
**Agente:** `tech-lead`

```markdown
1. Compilar resultados:
   - Vulnerabilidades encontradas: 23
   - Corrigidas: 21 (91%)
   - Em progresso: 2 (baixa severidade)
   
2. Certificações:
   - OWASP Top 10: ✅ 20/20 mitigado
   - LGPD: ✅ 18/20 requisitos atendidos
   
3. Próximos passos:
   - Pentest externo (empresa terceira)
   - SOC 2 Type I (próximo trimestre)
   - Bug bounty program (Q3)
   
4. Salvar relatório:
   node scripts/memory-manager.js wiki-save "Security Audit Report 2026-07" \
     --agent tech-lead --type entity --tags segurança,compliance,investidores
```

### Resultado Final

```markdown
## Security Audit Report

### OWASP Top 10
| Vulnerabilidade | Status | Mitigação |
|----------------|--------|-----------|
| A01: Broken Access Control | ✅ Corrigido | RBAC implementation |
| A02: Cryptographic Failures | ✅ Corrigido | AES-256, TLS 1.3 |
| A03: Injection | ✅ Corrigido | Parameterized queries |
| A04: Insecure Design | 🟡 Em progresso | Threat modeling |
| A05: Security Misconfiguration | ✅ Corrigido | Hardened configs |
| ... | ... | ... |

### LGPD Compliance
- Consentimento: ✅ Implementado
- Right to be forgotten: ✅ Implementado
- Data portability: ✅ Export JSON/CSV
- Privacy by design: ✅ Encryption, access control
- DPO: ✅ privacy@company.com

### Score Final
- OWASP: 20/20 ✅
- LGPD: 18/20 ✅
- Overall: 95% compliance

### Próxima Auditoria
- Data: 2027-01-21 (6 meses)
- Escopo: Full re-audit + SOC 2
```

---

## Caso de Uso 5: Otimização de Performance em Larga Escala

### Cenário
Aplicação com 100k usuários ativos/dia está lenta. Page load >5s, API latency >1s. Necessidade de otimizar para escala de 1M usuários.

### Comando
```bash
/lider "Aplicação está lenta - 100k usuários/dia, page load 5s. Otimizar para 1M usuários."
```

### Fluxo de Orquestração

#### Fase 1: Baseline de Performance
**Agente:** `performance`

```markdown
1. Coletar métricas atuais:
   - Frontend: Lighthouse scores, Core Web Vitals
   - Backend: API latency (p50, p95, p99)
   - Banco: Query performance, connection pool
   - Infra: CPU, memory, network I/O
   
2. Identificar bottlenecks:
   - Frontend: Bundle size 2.5MB (sem code splitting)
   - Backend: N+1 queries em listagens
   - Banco: Missing indexes em queries frequentes
   - Cache: 0% cache hit rate
   
3. Salvar baseline:
   node scripts/memory-manager.js save "Performance baseline - 100k usuários" \
     --agent performance --type decision --tags performance,baseline,otimização
```

#### Fase 2: Otimizações de Frontend
**Agente:** `frontend-dev` + `performance`

```markdown
1. Code splitting:
   - Lazy load por rota
   - Dynamic imports para componentes pesados
   - Resultado: 2.5MB → 350KB initial bundle
   
2. Image optimization:
   - WebP format
   - Lazy loading
   - CDN para assets estáticos
   
3. Caching:
   - Service Worker (offline-first)
   - HTTP cache headers (immutable assets)
   - React Query (server state cache)
   
4. Resultado esperado:
   - FCP: 3.2s → 0.8s
   - LCP: 4.5s → 1.2s
   - TTI: 5.1s → 1.5s
```

#### Fase 3: Otimizações de Backend
**Agente:** `backend-dev` + `performance`

```markdown
1. Query optimization:
   - Eliminar N+1 com JOINs
   - Adicionar indexes (EXPLAIN ANALYZE)
   - Query caching (Redis, 5min TTL)
   
2. API optimization:
   - GraphQL (evitar over-fetching)
   - Response compression (gzip, brotli)
   - Connection pooling (PgBouncer)
   
3. Async processing:
   - Bull queues para tarefas pesadas
   - Background jobs (emails, reports)
   - Webhooks para integrações
   
4. Resultado esperado:
   - API p95: 1200ms → 150ms
   - Throughput: 100 → 1000 req/s
   - Error rate: 2% → 0.1%
```

#### Fase 4: Escalabilidade de Infraestrutura
**Agente:** `devops` + `architect`

```markdown
1. Horizontal scaling:
   - Auto-scaling groups (Kubernetes HPA)
   - Load balancer (ALB/Nginx)
   - Database read replicas
   
2. Caching strategy:
   - L1: Application cache (in-memory)
   - L2: Distributed cache (Redis Cluster)
   - L3: CDN (CloudFront/Akamai)
   
3. Database optimization:
   - Connection pooling (PgBouncer)
   - Partitioning por data
   - Archive old data (S3 Glacier)
   
4. Monitoring:
   - APM (New Relic/Datadog)
   - Real User Monitoring (RUM)
   - Synthetic monitoring (Pingdom)
```

#### Fase 5: Load Testing e Validação
**Agente:** `qa-tester` + `performance`

```markdown
1. Load tests (k6):
   - 100k concurrent users (baseline)
   - 500k concurrent users (target)
   - 1M concurrent users (stress test)
   
2. Chaos engineering:
   - Kill random pods
   - Simulate network latency
   - Database failover
   
3. Validação V&V Nível 2 (Médio):
   - [x] Lint + Type Check
   - [x] Load tests passing
   - [x] SLOs atendidos
   
4. Salvar resultados:
   node scripts/memory-manager.js save "Load test results - 1M usuários" \
     --agent performance --type decision --tags performance,load-test,escala
```

### Resultado Final

```markdown
## Performance Optimization Report

### Antes → Depois

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Frontend** |
| Bundle Size | 2.5MB | 350KB | -86% |
| FCP | 3.2s | 0.8s | -75% |
| LCP | 4.5s | 1.2s | -73% |
| TTI | 5.1s | 1.5s | -71% |
| **Backend** |
| API p95 | 1200ms | 150ms | -87% |
| Throughput | 100 req/s | 1000 req/s | +900% |
| Error Rate | 2% | 0.1% | -95% |
| **Infra** |
| CPU (avg) | 85% | 35% | -59% |
| Memory | 12GB | 4GB | -67% |
| Cost/mês | $5.000 | $2.500 | -50% |

### Capacidade Atual
- Suporta: 1M usuários/dia ✅
- SLOs: 99.9% availability ✅
- Auto-scaling: 10 → 100 pods (automático)

### Próximos Passos
- Implementar edge computing (Cloudflare Workers)
- Multi-region deployment (US, EU, Asia)
- Database sharding (por tenant)
```

---

## Referências

- [TECH-LEAD.md](../../TECH-LEAD.md) - Diretrizes completas do Tech Lead
- [PROPOSTA.md](./PROPOSTA.md) - Proposta da skill Líder
- [tests/README.md](../../tests/README.md) - Documentação de testes E2E
- [.ai-factory/wiki/](../../.ai-factory/wiki/) - Wiki persistente do projeto

---

**Skill Owner**: NexusAuto AI Factory  
**Status**: ✅ Ativa  
**Comando**: `/lider`  
**Última Atualização**: 2026-07-21