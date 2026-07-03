# Setup — NexusAuto / Polymarketing

> Guia rápido de instalação e execução.

---

## Pré-requisitos

- Node.js 18+
- npm
- Docker Desktop (opcional, para PostgreSQL/Redis)

---

## Instalação

```bash
# 1. Clone
git clone https://github.com/williamvpaiva/NexusAuto.git
cd NexusAuto

# 2. Instalar dependências
npm install

# 3. Configurar ambiente
copy .env.example .env

# 4. Subir infraestrutura (opcional — SQLite é usado por padrão)
npm run docker:up

# 5. Rodar
npm run dev
```

## URLs

| Serviço   | URL                                   |
|-----------|---------------------------------------|
| Frontend  | http://localhost:5173                 |
| Backend   | http://localhost:3000                 |
| Health    | http://localhost:3000/api/v1/health   |

## Scripts

```bash
npm run dev              # Frontend + Backend
npm run dev:frontend     # Frontend só
npm run dev:backend      # Backend só
npm run build            # Build completo
npm run test             # Testes
npm run docker:up        # PostgreSQL + Redis
```

## Fluxo de Trabalho

1. Coloque arquivos no diretório do projeto
2. Invoque `TECH-LEAD.md`
3. O TECH-LEAD orquestra os agentes automaticamente

---

Para documentação completa, veja [README.md](./README.md).