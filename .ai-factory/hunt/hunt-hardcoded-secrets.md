# 🎯 Hunt Hardcoded Secrets

> **Detecta secrets hardcoded (API keys, senhas, tokens) que podem vazar em repositórios públicos**

---

## When to Use

- [ ] TECH-LEAD identifica "vazamento de secrets" como preocupação
- [ ] Code review antes de push para repositório público
- [ ] Auditoria de segurança preventiva
- [ ] Onboarding de novo desenvolvedor (verificar más práticas)
- [ ] Pós-incidente de vazamento de credenciais

---

## Prerequisites

- [ ] Acesso completo ao código (backend, frontend, configs, scripts)
- [ ] Ferramenta de scan de secrets (ex: truffleHog, gitleaks) opcional
- [ ] Lista de padrões de secrets usados no projeto

---

## How to Run

```bash
# 1. Buscar padrões comuns de secrets
node scripts/memory-manager.js search "hardcoded secrets pattern" --topK 3

# 2. Executar scan automatizado (recomendado)
npx trufflehog@latest filesystem . --only-verified

# 3. Ou manualmente: buscar padrões suspeitos
grep -r "password\s*=\s*['\"]" . --include="*.ts" --include="*.js" --include="*.env.example"
grep -r "api[_-]?key\s*:\s*['\"]" . --include="*.ts" --include="*.js"
grep -r "sk_live_\|sk_test_\|AKIA\|ghp_\|xox[baprs]-" . --include="*.ts" --include="*.md"
```

---

## Procedure

### **Passo 1: Buscar Padrões de Secrets**

Varra o código buscando **padrões comuns**:

```typescript
// ❌ PADRÕES SUSPEITOS

// Senhas hardcoded
const password = "admin123";
const DB_PASSWORD = "minha_senha_secreta";

// API Keys
const apiKey = "sk_live_abc123xyz";
const apiKey = "AIzaSyD..."; // Google
const apiKey = "AKIA..."; // AWS

// Tokens
const token = "ghp_xxxxxxxxxxxx"; // GitHub
const token = "xoxb-xxxxxxxxxxxx"; // Slack
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // JWT

// Private Keys
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
-----END RSA PRIVATE KEY-----`;

// Connection Strings
const mongoUri = "mongodb://user:password@host:27017/db";
const redisUrl = "redis://:password@host:6379";
```

### **Passo 2: Verificar Arquivos de Config**

Cheque arquivos que **comumente vazam secrets**:

| Arquivo | Risco | Verificar |
|---------|-------|-----------|
| `.env` | 🔴 Crítico | Está no .gitignore? |
| `.env.example` | 🟡 Médio | Tem valores reais ou placeholders? |
| `config.ts` / `config.js` | 🟡 Médio | Tem secrets hardcoded? |
| `docker-compose.yml` | 🟡 Médio | Tem passwords em plaintext? |
| `README.md` | 🟡 Médio | Tem secrets em exemplos de uso? |
| `*.test.ts` | 🟡 Médio | Tem secrets em testes? |

### **Passo 3: Classificar Tipo de Secret**

| Tipo | Severidade | Exemplo |
|------|-----------|---------|
| **Production API Key** | 🔴 Crítica | `sk_live_...`, `AKIA...` |
| **Database Password** | 🔴 Crítica | Senha de produção |
| **Private Key** | 🔴 Crítica | RSA, EC, SSH keys |
| **JWT Secret** | 🔴 Crítica | `process.env.JWT_SECRET` hardcoded |
| **OAuth Client Secret** | 🔴 Crítica | Google, GitHub, etc. |
| **Test/Sandbox Key** | 🟡 Alta | `sk_test_...`, chaves de staging |
| **Internal API Key** | 🟡 Alta | APIs internas, webhooks |
| **Placeholder/Fake** | 🟢 Baixa | `"your-api-key-here"`, `"changeme"` |

### **Passo 4: Verificar Histórico do Git**

Secrets podem estar em **commits antigos** mesmo se removidos:

```bash
# Verificar se .env já foi commitado
git log --all --full-history -- ".env"

# Buscar secrets em todo histórico (usando trufflehog)
npx trufflehog@latest git file://. --only-verified

# Buscar patterns específicos no histórico
git log -p --all -S "password=" --source --all
```

### **Passo 5: Calcular Score de Risco**

| Fator | Score |
|-------|-------|
| Secret de produção (live/production) | +5 |
| Secret em repositório público | +5 |
| Secret em código frontend (exposto no bundle) | +4 |
| Private key (RSA, SSH, EC) | +5 |
| Database password | +4 |
| Secret em .env.example com valor real | +3 |
| Secret em testes/fixtures | +2 |
| Secret em README ou docs | +3 |
| Secret com menos de 24h no git | +2 |
| Secret rotacionável facilmente | -2 |

**Total:** <score>

---

## Pitfalls

### ⚠️ Falso Positivo: Placeholders Óbvios

```typescript
// ✅ NÃO É SECRET: Placeholder claro
const apiKey = "YOUR_API_KEY_HERE";
const password = "changeme";
const secret = process.env.MY_SECRET; // ← Referência, não valor
```

### ⚠️ Falso Positivo: Secrets em Arquivos .gitignored

```typescript
// ✅ NÃO É PROBLEMA: .env no .gitignore
// .env (gitignored)
DATABASE_URL="postgresql://user:pass@localhost/db"

// MAS: Verificar se .env.example não tem valores reais
```

### ⚠️ Edge Case: Secrets Criptografados

```typescript
// ⚠️ ATENÇÃO: Secret criptografado ainda é risco se chave estiver no código
const encryptedSecret = "U2FsdGVkX1+..."; // ← Ainda pode ser decifrado
const decryptionKey = "my-hardcoded-key"; // ← ISSO é o problema real
```

---

## Verification

### Para Detecção

- [ ] Padrões de secrets buscados no código
- [ ] Arquivos de config verificados
- [ ] Tipo de secret classificado
- [ ] Histórico do git verificado (se aplicável)
- [ ] Score calculado conforme fatores de risco

### Para Fix

- [ ] Secret removido do código
- [ ] Secret movido para variável de ambiente
- [ ] .env atualizado e no .gitignore
- [ ] .env.example atualizado com placeholders
- [ ] Secret vazado foi rotacionado (INVALIDAR o antigo!)
- [ ] Histórico do git limpo (se secret foi commitado)

---

## Score Calculation

| Fator | Score |
|-------|-------|
| Secret de produção (live/production) | +5 |
| Secret em repositório público | +5 |
| Secret em código frontend (exposto no bundle) | +4 |
| Private key (RSA, SSH, EC) | +5 |
| Database password | +4 |
| Secret em .env.example com valor real | +3 |
| Secret em testes/fixtures | +2 |
| Secret em README ou docs | +3 |

**Total:** <score>

**Ação Recomendada:**
- **Score >= 10:** 🔴 Crítico → V&V Nível 1, security + devops, rotacionar IMEDIATAMENTE
- **Score 6-9:** 🟡 Alto → V&V Nível 2, security + backend-dev, rotacionar em 24h
- **Score < 6:** 🟢 Normal → V&V Nível 2, backend-dev, rotacionar next sprint

---

## Fix Patterns

### **Pattern 1: Mover para Variável de Ambiente**

```typescript
// ❌ ANTES: Hardcoded
const config = {
  database: {
    host: 'localhost',
    user: 'admin',
    password: 'senha_secreta_123', // ← VAZOU!
  },
  apiKey: 'sk_live_abc123xyz', // ← VAZOU!
};

// ✅ DEPOIS: Environment variables
const config = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // ← Seguro
  },
  apiKey: process.env.STRIPE_API_KEY, // ← Seguro
};

// .env (no .gitignore!)
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=senha_secreta_123
STRIPE_API_KEY=sk_live_abc123xyz
```

### **Pattern 2: Secret Manager (Produção)**

```typescript
// ✅ PRODUCTION: AWS Secrets Manager
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient();

async function getSecret(secretName: string) {
  const response = await client.send(new GetSecretValueCommand({ SecretId: secretName }));
  return JSON.parse(response.SecretString);
}

// Uso
const dbCreds = await getSecret('prod/db/credentials');
// dbCreds = { username: '...', password: '...' }
```

### **Pattern 3: Invalidar Secret Vazado**

```bash
# CHECKLIST DE EMERGÊNCIA (secret vazado em repo público)

# 1. Rotacionar IMEDIATAMENTE
- [ ] AWS Access Keys → AWS Console → IAM → Rotacionar
- [ ] Stripe API Keys → Stripe Dashboard → Developers → API Keys → Roll
- [ ] GitHub Tokens → GitHub Settings → Developer Settings → Delete
- [ ] Database passwords → DB admin → Change password
- [ ] JWT Secret → Gerar novo → Invalidar todos os tokens atuais

# 2. Remover do código
- [ ] Commit fix removendo secret
- [ ] Limpar histórico do git (git filter-branch ou BFG Repo-Cleaner)
- [ ] Force push (com cuidado!)

# 3. Prevenir recorrência
- [ ] Adicionar .env ao .gitignore
- [ ] Instalar pre-commit hook com trufflehog
- [ ] Configurar GitHub secret scanning
```

---

## Related Skills

- `chains/README.md` → Chain C: Secret Exposure (Hardcoded + Public Repo)
- `agents/security` → Responsável por auditoria e resposta a incidente
- `agents/devops` → Responsável por rotacionar secrets em produção
- `standards/secret-management.md` → Padrões de gestão de secrets

---

**Versão:** 1.0.0  
**Autor:** TECH-LEAD (inspirado em recon-skills)  
**Local:** `.ai-factory/hunt/hunt-hardcoded-secrets.md`