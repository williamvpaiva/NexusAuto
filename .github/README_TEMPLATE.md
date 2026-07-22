# {NOME DO MÓDULO}

> {Descrição curta: o que este módulo faz e por que existe}

## Features

- {Feature 1}
- {Feature 2}
- {Feature 3}

## Tech Stack

- **Runtime**: Node.js / Python / Go
- **Framework**: Express / FastAPI / Gin
- **Database**: PostgreSQL / SQLite / Redis
- **Infra**: Docker / AWS Lambda / Cloud Run

## Pré-requisitos

- {Dependência 1} >= {versão}
- {Dependência 2} >= {versão}

## Instalação

```bash
# Clone e entre no diretório
git clone <repo>
cd <modulo>

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Instale dependências
npm install  # ou poetry install, pip install, go mod tidy
```

## Uso

```bash
# Comando de exemplo
npm run start
```

## Estrutura

```
src/
├── modules/    # Lógica de domínio
├── routes/     # Endpoints (se API)
├── services/   # Serviços externos
├── utils/      # Utilitários
└── types/      # Tipos compartilhados
```

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `PORT` | Sim | Porta do servidor |
| `DATABASE_URL` | Sim | Conexão com banco |
| `LOG_LEVEL` | Não | Nível de log (default: info) |

## Agentes Relacionados

- [agents/{agente}](.ai-factory/agents/{agente}.md) — descrição
- [agents/{agente}](.ai-factory/agents/{agente}.md) — descrição
