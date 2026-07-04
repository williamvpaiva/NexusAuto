---
name: auditar-cors
description: "Audita configuração CORS de aplicações web e identifica vulnerabilidades"
agent: security
tags: [security, cors, web, audit]
version: 1.0.0
created: 2026-01-04
updated: 2026-01-04
---

# Propósito
Analisar configurações de CORS (Cross-Origin Resource Sharing) em aplicações web para identificar vulnerabilidades como origens muito permissivas, exposição de dados sensíveis e falta de validação de origem.

# Trigger
Esta skill deve ser ativada quando:
- Solicitado para "auditar CORS"
- Mencionado "configuração de CORS"
- Necessário validar headers de segurança
- Palavras-chave: "CORS", "Access-Control", "cross-origin"

# Instruções

## Passo 1: Identificar Endpoints
Listar todos os endpoints que expõem CORS:
- APIs REST (`/api/*`)
- GraphQL endpoints
- endpoints de upload/download
- Webhooks

## Passo 2: Analisar Headers CORS
Para cada endpoint, verificar headers:
```
Access-Control-Allow-Origin
Access-Control-Allow-Methods
Access-Control-Allow-Headers
Access-Control-Allow-Credentials
Access-Control-Max-Age
Access-Control-Expose-Headers
```

## Passo 3: Identificar Vulnerabilidades

### Crítico 🔴
- `Access-Control-Allow-Origin: *` com `Allow-Credentials: true`
- Origem refletida sem validação (XSS via CORS)
- `Access-Control-Allow-Origin: null` permitido

### Alto 🟠
- Wildcard em métodos (`GET, POST, *`)
- Headers permissivos demais (`Authorization, Content-Type, *`)
- Falta de validação de origem em produção

### Médio 🟡
- `Access-Control-Max-Age` muito alto (> 24h)
- Métodos desnecessários expostos (PUT, DELETE em APIs públicas)
- Falta de documentação de CORS

### Baixo 🟢
- Configuração correta mas não otimizada
- Headers expostos desnecessários

## Passo 4: Testar Exploração
Para vulnerabilidades encontradas, testar:
```javascript
// Testar origem arbitrária
fetch('https://api.target.com/data', {
  headers: { Origin: 'https://attacker.com' },
  credentials: 'include'
});

// Testar null origin
fetch('https://api.target.com/data', {
  headers: { Origin: 'null' },
  credentials: 'include'
});
```

## Passo 5: Gerar Relatório
Criar `security-reports/cors-audit-{date}.md` com:
- Resumo executivo
- Vulnerabilidades por severidade
- Provas de conceito (PoC)
- Recomendações de correção
- Priority matrix (impacto × esforço)

## Passo 6: Criar Issue (Opcional)
Se integrado com GitHub, criar issue com:
- Título descritivo
- Severidade
- Passos para reproduzir
- Recomendação de fix
- Labels: security, cors, bug

# Inputs
- `targetUrl` (string): URL da API para auditar
- `endpoints` (array, opcional): Endpoints específicos para auditar
- `origensEsperadas` (array): Origens que deveriam ser permitidas

# Outputs
- Relatório de auditoria em Markdown
- Lista de vulnerabilidades com severidade
- Recomendações de correção
- Issue no GitHub (se habilitado)

# Exemplos

## Exemplo 1: Auditoria de API REST
**Entrada:**
```
targetUrl: https://api.example.com
endpoints: [/api/users, /api/orders, /api/admin]
origensEsperadas: [https://app.example.com, https://admin.example.com]
```

**Saída:**
```markdown
# CORS Audit Report - api.example.com

## Resumo
- Endpoints auditados: 3
- Vulnerabilidades encontradas: 2
- Severidade máxima: ALTO

## Vulnerabilidades

### 🔴 ALTO: Origem Reflexiva
**Endpoint:** `/api/users`
**Problema:** Header `Access-Control-Allow-Origin` reflete qualquer origem sem validação
**Exploração:** Attacker.com pode fazer requisições com credentials
**Fix:** Validar origem contra whitelist

### 🟠 MÉDIO: Credentials com Wildcard
**Endpoint:** `/api/orders`
**Problema:** `Access-Control-Allow-Credentials: true` com origem `*`
**Fix:** Especificar origens explícitas
```

# Dependências
- Ferramentas: curl, browser devtools, ou script customizado
- Acesso à aplicação (staging ou produção)
- Lista de origens autorizadas

# Links Relacionados
- [[brain/Patterns]] - Padrões de segurança
- [[standards/security]] - Standards de segurança
- [[skills/automation/github-create-issue]] - Criar issue de segurança