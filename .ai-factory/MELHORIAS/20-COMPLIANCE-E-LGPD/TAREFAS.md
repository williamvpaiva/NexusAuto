# 20 — COMPLIANCE E LGPD

> Conformidade legal: LGPD, proteção de dados, consentimento e privacidade
>
> **Status:** 🔴 Não Iniciado
> **Prioridade:** Média
> **Dependências:** 08-SEGURANÇA

---

## 📋 Tarefas

### LGP-001 — Política de Privacidade e Termos de Uso
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Criar páginas de Política de Privacidade e Termos de Uso com linguagem clara, baseadas na LGPD (Lei 13.709/2018)
- **Critério de aceite:** Páginas acessíveis via `/privacy` e `/terms`; cobrem coleta, uso, armazenamento, compartilhamento e direitos do titular
- **Esforço:** 3h
- **Prioridade:** Alta

### LGP-002 — Consentimento de Dados (Cookie Banner + Opt-in)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Banner de consentimento com granularidade: cookies essenciais, analytics, funcionalidades; registro de consentimento no banco
- **Critério de aceite:** Banner aparece na primeira visita; "Aceitar todos" / "Recusar" / "Personalizar"; consentimento registrado com timestamp
- **Esforço:** 4h
- **Prioridade:** Alta

### LGP-003 — Direitos do Titular (SAR)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Endpoints para exercício de direitos LGPD: acesso, retificação, exclusão, portabilidade e revogação de consentimento
- **Critério de aceite:** `POST /data/export` gera JSON com dados do usuário; `POST /data/delete` anonimiza dados; resposta em < 24h simulado
- **Esforço:** 5h
- **Prioridade:** Alta

### LGP-004 — Data Retention Policy
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Implementar política de retenção: logs de interação 90 dias, dados pessoais ativos enquanto conta ativa + 180 dias, backups 30 dias
- **Critério de aceite:** Script `npm run db:purge` deleta dados expirados; log de purge com contagem de registros removidos
- **Esforço:** 3h
- **Prioridade:** Média

### LGP-005 — Registro de Tratamento (RIPD)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Manter Registro das Operações de Tratamento de Dados Pessoais (RIPD) conforme art. 37 LGPD: finalidade, base legal, categorias, compartilhamento
- **Critério de aceite:** Documento `docs/compliance/ripd.md` com tabela de todas as operações de tratamento; revisão semestral agendada
- **Esforço:** 3h
- **Prioridade:** Média

### LGP-006 — Data Breach Response Plan
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Plano de resposta a incidentes de dados: detecção, contenção, notificação ANPD (72h), comunicação aos titulares e documentação
- **Critério de aceite:** Documento `docs/compliance/breach-response.md` com checklist e template de notificação ANPD
- **Esforço:** 2h
- **Prioridade:** Baixa

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
