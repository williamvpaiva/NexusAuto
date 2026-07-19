# Guia de Variáveis de Ambiente

## Padrão

Toda variável de ambiente DEVE ser documentada no `.env.example` com:

```bash
# NOME_DA_VARIAVEL - Descrição curta do propósito
# Tipo: string | number | boolean
# Obrigatório: sim | não
# Padrão: valor (se opcional)
# Link: https://... (se aplicável)
NOME_DA_VARIAVEL=valor_exemplo
```

## Exemplo

```bash
# DB_HOST - Endereço do servidor PostgreSQL
# Tipo: string
# Obrigatório: sim
DB_HOST=localhost

# DB_PORT - Porta do PostgreSQL
# Tipo: number
# Obrigatório: não
# Padrão: 5432
DB_PORT=5432

# LLM_API_KEY - Chave da API do provedor LLM
# Tipo: string
# Obrigatório: sim
# Link: https://platform.openai.com/api-keys
LLM_API_KEY=sk-exemplo
```

## Boas Práticas

1. **Nunca commitar secrets** — `.env` está no `.gitignore`
2. **Sempre documentar** — toda variável nova vai pro `.env.example`
3. **Usar `{{VARIAVEL}}`** em templates de configuração
4. **Validar na inicialização** — o app deve falhar rápido se faltar variável obrigatória
5. **Prefixar por módulo** — `DB_*`, `API_*`, `AUTH_*`, `LLM_*`
