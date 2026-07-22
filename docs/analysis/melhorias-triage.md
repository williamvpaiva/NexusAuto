# Triage Report - Pipeline de Melhorias (GNHF)

## Visão Geral
Durante a auditoria do diretório `.ai-factory/MELHORIAS/`, identificamos 24 áreas mapeadas (superando as 22 previstas), grande parte estagnada. Para que o orquestrador autônomo (GNHF) resolva essas pendências sem gerar regressão ou quebras de dependência, organizamos os módulos em **4 Sprints (Waves) Acionáveis**.

---

## 🌊 Sprint 1: Fundação & Economia (Backend & Data)
**Foco:** Garantir estabilidade do Banco de Dados, robustez de API e gestão do Token Economy antes de mexer na UI ou fluxos paralelos.
- `01-ARQUITETURA`
- `01-BACKEND`
- `12-BANCO-DE-DADOS`
- `18-API-E-INTEGRACOES`
- `23-Token-Economy` (Crítico para a fábrica não gastar tokens desenfreadamente)
- `04-PERFORMANCE`
**Ação do Orquestrador:** Disparar os agentes `Backend Dev` e `Performance`. Validar com os testes E2E do backend a cada PR gerada.

---

## 🌊 Sprint 2: Qualidade de Código & DX (Developer Experience)
**Foco:** Refatorar, limpar código morto e elevar a manutenibilidade para que humanos e agentes entendam o código gerado.
- `02-DEBUGGING`
- `05-CLEAN-ARCHITECTURE`
- `09-TESTES` (Aumentar a cobertura do V&V atual)
- `16-GESTAO-DE-ERROS`
- `21-LIMPEZA-E-HOUSEKEEPING`
- `19-ONBOARDING-E-DX`
**Ação do Orquestrador:** Agente de `QA` (Quality Assurance) trabalhando em loop com o `Architect` para refatorar fluxos sujos apontados pelo linter.

---

## 🌊 Sprint 3: Blindagem (Security, DevOps & Compliance)
**Foco:** Preparar o código para enfrentar redes públicas (Internet) de forma segura.
- `08-SEGURANCA`
- `22-PENTEST-E-SEGURANCA-AVANCADA`
- `10-CI-CD` (Implementação do pipeline mapeado na task DevOps PO-05)
- `20-COMPLIANCE-E-LGPD`
- `13-MONITORAMENTO`
- `03-SISTEMAS`
**Ação do Orquestrador:** O agente `Security` varre vulnerabilidades (OWASP), blindando o Node.js. O agente `DevOps` acopla o Prometheus/Grafana ou logs cloud no painel de monitoramento.

---

## 🌊 Sprint 4: Frontend & Inteligência (The Face & Brain)
**Foco:** Fechar a Interface visual e consolidar o workflow dos múltiplos agentes interagindo entre si.
- `07-UI-COMPONENTS`
- `17-GESTAO-DE-ESTADO`
- `14-ACESSIBILIDADE`
- `15-SEO-E-ANALYTICS` (Apenas se o painel B2B for aberto via indexação interna)
- `06-MULTIAGENTE` (Refinamento final dos fluxos complexos de The Agency)
- `11-DOCUMENTACAO` (Passar o rodo final gerando os compêndios definitivos)
**Ação do Orquestrador:** `UI/UX Designer` e `Frontend Dev` consumindo a Spec gerada no passo PO-03.

---
## Protocolo de Execução
Para executar cada sprint, basta o *Tech Lead* acionar:
`/lider inicie a resolução do Sprint 1 do Triage de Melhorias, respeitando o Pipeline V&V de 7 passos após cada entrega.`
