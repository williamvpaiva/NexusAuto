# Cache de Validação por Hash

## Propósito
Evitar re-validação de arquivos inalterados, economizando tokens e tempo.

## Como Funciona
1. Cada arquivo válido recebe um hash (git SHA)
2. Antes de validar, verifica-se se o hash mudou
3. Hash inalterado = "Cache Hit" → pula validação
4. Hash alterado = "Cache Miss" → aplica V&V

## Tabela de Cache

| Arquivo | Último Hash | Status | V&V Aplicado? | Data Validação | Nível V&V |
|---------|-------------|--------|---------------|----------------|-----------|
| backend/src/app.ts | `a1b2c3d4` | ✅ Aprovado | Sim (Cache) | 2026-07-03 10:00 | Completo |
| backend/src/auth/controller.ts | `e5f6g7h8` | ✅ Aprovado | Sim | 2026-07-03 10:15 | Completo |
| backend/src/auth/routes.ts | `i9j0k1l2` | ✅ Aprovado | Sim (Cache) | 2026-07-03 10:20 | Parcial |
| frontend/src/App.tsx | `m3n4o5p6` | ⏳ Pendente | Não | - | - |
| frontend/src/components/Button.tsx | `q7r8s9t0` | ✅ Aprovado | Sim (Cache) | 2026-07-03 09:45 | Parcial |
| tests/unit/auth.test.ts | `u1v2w3x4` | ✅ Aprovado | Sim | 2026-07-03 10:25 | Completo |

## Regras de Cache

### Cache Hit (Pular Validação)
- ✅ Hash atual == Hash cacheado
- ✅ Status anterior == "Aprovado"
- ✅ V&V anterior == "Sim"

### Cache Miss (Aplicar Validação)
- 🔄 Hash atual != Hash cacheado
- 🔄 Status anterior == "Pendente"
- 🔄 V&V anterior == "Não"

### Invalidação de Cache
O cache DEVE ser invalidado quando:
1. Dependências do arquivo mudam (imports alterados)
2. Schema do banco muda (migrations)
3. Interface pública muda (exports/assinaturas)
4. Testes relacionados falham

## Níveis de V&V

| Nível | Passos | Critério | Exemplo |
|-------|--------|----------|---------|
| **Completo** | 7 passos | Arquivos críticos | `auth/**`, `payments/**`, `db/schema.prisma` |
| **Parcial** | 3 passos | Baixa complexidade | `components/**`, `utils/**` |
| **Cache** | 0 passos | Hash inalterado | Qualquer arquivo com cache hit |

## Script de Verificação

```bash
# Verificar hash atual de um arquivo
git rev-parse HEAD:backend/src/app.ts

# Comparar com cache
node scripts/check-cache.js backend/src/app.ts
```

## Manutenção

### Limpeza Automática
- Cache expira após 7 dias sem uso
- Arquivos deletados são removidos do cache

### Reset Manual
```bash
# Resetar cache completo
echo "# Cache resetado em $(date)" > .ai-factory/VALIDATION_CACHE.md

# Resetar cache de um módulo
node scripts/reset-cache.js backend/src/auth/
```

---
*Última atualização: 2026-07-03 | Arquivos cacheados: 6 | Hit rate alvo: 80%*