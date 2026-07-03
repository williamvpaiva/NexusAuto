# 🛡️ Segurança Implementada - NexusAuto

## ✅ SEC-001: Content Security Policy (CSP) - IMPLEMENTADO

### O que foi feito:

#### Backend (`backend/src/app.ts`)
- **Helmet configurado com CSP customizado**
- Headers de segurança aplicados em todas as respostas

**Headers ativos:**
```http
Content-Security-Policy: 
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' http://localhost:3000 http://localhost:5173;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests

X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload (prod)
```

#### Frontend (`frontend/src/main.tsx`)
- **ClickjackingCheck component** envolviendo toda a aplicação
- Detecção em tempo real de iframe embedding
- Bloqueio automático se detectado dentro de iframe

#### Middleware de Segurança (`backend/src/middleware/security.ts`)
- `securityHeaders()` - Headers adicionais de segurança
- `clickjackingProtection()` - Log e monitoramento de tentativas
- `apiLimiter` - Rate limiting global (100 req/15min)
- `authLimiter` - Rate limiting para auth (10 req/15min)

#### Utilitário de Sanitização (`frontend/src/utils/sanitize.ts`)
- `sanitize()` - Sanitiza HTML com DOMPurify
- `sanitizeText()` - Escapa texto para prevenir XSS
- `sanitizeUrl()` - Valida protocolos de URL
- `useSanitize()` - Hook React para sanitização

---

## ✅ SEC-002: Sanitização de Inputs - IMPLEMENTADO

### O que foi feito:

#### 1. Sanitização em Todos os Componentes
- **`HomePage.tsx`**: `sanitizeText()` em nome e email de usuários
- **`MemoryList.tsx`**: `sanitizeText()` em títulos, agent_id, session_id
- **Atributos ARIA**: Sanitizados para prevenir XSS em labels

#### 2. Validação de Schemas com Zod
- **`frontend/src/schemas/index.ts`**: Schemas para User, Health, Conversation
- **`frontend/src/lib/api.ts`**: Validação de todas as respostas da API
- Validação de inputs antes de enviar ao backend

#### 3. Timeout em Requisições HTTP
- **Timeout global**: 30 segundos em todas as requisições
- **AbortController**: Cancelamento de requests pendentes
- **Tratamento de erro**: Mensagens claras de timeout

#### 4. Rate Limiting no Frontend
- **`frontend/src/utils/rateLimiter.ts`**: Controle de requisições por cliente
- **Configurações**:
  - API geral: 100 req / 15 min
  - Operações sensíveis: 10 req / 15 min
  - Buscas: 30 req / 1 min
  - Uploads: 5 req / 1 min

---

## ✅ SEC-003: Clickjacking Protection - IMPLEMENTADO

### Camadas de Proteção:

1. **Backend Headers**:
   - `X-Frame-Options: DENY`
   - `Content-Security-Policy: frame-ancestors 'none'`

2. **Frontend Component**:
   - `ClickjackingCheck.tsx` detecta iframe
   - Bloqueia renderização se embedado
   - Redireciona para `window.top` se possível

3. **Fallback Visual**:
   - Mensagem clara se bloqueado
   - Botão para abrir em nova janela

---

## ✅ SEC-004: Timeout de Sessão Automático - IMPLEMENTADO

### O que foi feito:

#### Hook `useSessionTimeout` (`frontend/src/hooks/useSessionTimeout.ts`)
- **Timeout configurável**: Padrão 15 minutos de inatividade
- **Warning modal**: Avisa 2 minutos antes de expirar
- **Detecção de atividade**: Mouse, teclado, touch, scroll resetam timer
- **Callbacks**: `onTimeout`, `onWarning`, `onActivity`
- **Retorno**: `timeRemaining`, `isWarning`, `isExpired`, `resetTimer`, `extendSession`

#### Componente `SessionTimeoutWarning`
- Modal acessível (`role="alertdialog"`)
- Countdown em tempo real
- Botões "Continuar" e "Sair"
- Auto-focus no botão "Continuar"

#### Componente `SessionTimeoutProvider`
- Wrapper para envolver toda a aplicação
- Debug mode em desenvolvimento
- Handler de logout customizável

### Como Usar:

```tsx
// Em main.tsx ou App.tsx
<SessionTimeoutProvider onLogout={() => {
  // Implementar logout real
  localStorage.removeItem('token');
  window.location.reload();
}}>
  <App />
</SessionTimeoutProvider>
```

### Configurações:

| Parâmetro | Padrão | Descrição |
|-----------|--------|-----------|
| `timeoutMs` | 15 min | Tempo total antes do logout |
| `warningMs` | 2 min | Tempo do warning antes do timeout |
| `events` | mouse, keyboard, touch | Eventos que resetam timer |
| `disabled` | false | Desabilitar (útil em dev) |

---

## ✅ FE-001: Error Boundary Global - IMPLEMENTADO

### 1. Sanitizar Conteúdo Dinâmico

```tsx
import { sanitize, sanitizeText } from '@/utils/sanitize';

// Para HTML (ex: descrições de veículos)
<div dangerouslySetInnerHTML={{ __html: sanitize(userContent) }} />

// Para texto simples (recomendado)
<p>{sanitizeText(userInput)}</p>

// Para URLs
<a href={sanitizeUrl(userUrl)}>Link</a>
```

### 2. Rate Limiting

Backend já aplica automaticamente:
- **100 requisições por 15 minutos** por IP (rotas gerais)
- **10 requisições por 15 minutos** por IP (rotas de auth)

Headers de resposta indicam status:
```http
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1699900800
```

### 3. Clickjacking Protection

Automático - se alguém tentar embedar seu site em iframe:
```html
<!-- Isso será bloqueado -->
<iframe src="https://seusite.com"></iframe>

<!-- Resposta do navegador: -->
Refused to display 'https://seusite.com' in a frame because it set 'X-Frame-Options' to 'deny'.
```

---

## 🧪 Testes de Verificação

### Testar CSP
```bash
# Acesse o backend e verifique headers
curl -I http://localhost:3000

# Deve retornar:
# content-security-policy: default-src 'self'; ...
# x-frame-options: DENY
# x-content-type-options: nosniff
```

### Testar Clickjacking
1. Crie um HTML local com iframe apontando para seu app
2. Tente carregar
3. Deve ser bloqueado pelo navegador

### Testar XSS
```tsx
// Tente injetar script
const maliciousInput = '<script>alert("XSS")</script>';

// Com sanitização:
sanitize(maliciousInput);
// Retorna: "" (vazio - script removido)

sanitizeText(maliciousInput);
// Retorna: "<script>alert("XSS")</script>"
```

---

## 🔧 Ajustes Futuros

### Para Produção

1. **Atualizar CSP connectSrc:**
```ts
connectSrc: ["'self'", 'https://api.seudominio.com']
```

2. **Ativar HSTS apenas em produção:**
```ts
hsts: {
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}
```

3. **Adicionar domínios de CDN se usar:**
```ts
scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
imgSrc: ["'self'", 'data:', 'https:', 'https://cdn.seudominio.com']
```

### Relatar Violações de CSP

Adicione `reportUri` para coletar violações:
```ts
reportUri: '/api/csp-report'
```

Crie endpoint para receber reports:
```ts
app.post('/api/csp-report', express.json({ type: 'application/csp-report' }), (req, res) => {
  console.log('[CSP Violation]', req.body);
  // Salvar em log ou enviar para SIEM
  res.sendStatus(204);
});
```

---

## 📊 Impacto nas Medidas de Segurança

| Ameaça | Proteção | Status |
|--------|----------|--------|
| **XSS (Cross-Site Scripting)** | CSP + Sanitização DOMPurify | ✅ Protegido |
| **Clickjacking** | X-Frame-Options + CSP frame-ancestors + Componente React | ✅ Protegido |
| **MIME Sniffing** | X-Content-Type-Options: nosniff | ✅ Protegido |
| **Data Sniffing** | Strict-Transport-Security (HSTS) | ✅ Protegido (prod) |
| **Referrer Leakage** | Referrer-Policy | ✅ Protegido |
| **Feature Abuse** | Permissions-Policy | ✅ Protegido |
| **Brute Force** | Rate Limiting (10 req/15min auth) | ✅ Protegido |
| **DoS Básico** | Rate Limiting (100 req/15min) | ✅ Protegido |

---

## 🚀 Próximos Passos (SEC-002 a SEC-010)

1. **SEC-002**: Aplicar `sanitize()` em todos os inputs de usuário
2. **SEC-003**: ✅ Já implementado com X-Frame-Options + CSP
3. **SEC-004**: Timeout de sessão (aguardando autenticação)
4. **SEC-005**: Validar respostas da API com Zod schemas
5. **SEC-006**: Rate limiting no frontend (complementar)
6. **SEC-007**: Timeout em fetch requests
7. **SEC-008**: Route guards para proteção de rotas
8. **SEC-009**: CSRF tokens para mutations
9. **SEC-010**: Masking de dados sensíveis em logs

---

**Status:** ✅ **SEC-001 COMPLETA**  
**Próxima Tarefa:** SEC-002 - Sanitizar todo input de usuário