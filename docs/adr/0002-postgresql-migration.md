# ADR 0002: Plano de Migração do SQLite para PostgreSQL

## 1. Contexto e Problema
O NexusAuto utiliza o SQLite como banco de dados principal no momento (Sprint 1). Embora o SQLite seja excelente para desenvolvimento rápido, testes locais e operações com pouca concorrência (file-locking isolation), a arquitetura autônoma da fábrica implica em **multiagentes rodando em paralelo** (GNHF, Tech Lead, Analyst, etc).
Essa paralelização fatalmente levará a erros de `database is locked` e gargalos de I/O em produção. Para escalar as operações SaaS e permitir que múltiplos agentes acessem e modifiquem os mesmos estados ou logs simultaneamente, é imperativo migrar a base relacional para um SGBD robusto: **PostgreSQL**.

## 2. Decisão
Adotar o **PostgreSQL 16+** como banco de dados principal da aplicação para os ambientes de Staging e Produção. O SQLite será mantido como ambiente opcional apenas para Testes E2E (Unitários) efêmeros e setups de CI isolados.

## 3. Estratégia de Migração (Passo a Passo)

### Fase 1: Preparação do Ambiente e ORM
1. **Instalação das Dependências:** Substituir a dependência direta `sqlite3` pelo ecossistema Prisma ORM para suportar transições transparentes de query.
   - `npm i -D prisma`
   - `npm i @prisma/client`
2. **Schema Base:** Configurar `schema.prisma` definindo a `datasource db` para apontar inicialmente para `env("DATABASE_URL")`.
3. **Mapeamento de Tipos JSON:** Converter persistência manual de strings em colunas de tipo `JSONB` nativas do PostgreSQL (crucial para o payload das memórias dos agentes e histórico de log de V&V).

### Fase 2: Sincronização Local e Docker
1. **Containers:** Adicionar uma imagem `postgres:16-alpine` no `docker-compose.yml`.
2. **Seeds:** Atualizar os scripts de seed em `src/repositories` ou `prisma/seed.ts` para popular dinamicamente a nova base sem conflitos de serial keys.

### Fase 3: Migração Lógica e Queries Específicas
O SQLite não diferencia rigorosamente certos tipos de dados como DateTime e Booleans vs Integers (0/1). 
1. Auditar as queries SQL hardcoded (se houver alguma no repositório atual) e refatorá-las para queries tipadas no Prisma.
2. Atualizar as rotas do CRUD `crud-tarefas-test` e as rotas de memória para usar os métodos do PrismaClient.

### Fase 4: Zero-Downtime e Deploy Staging
1. Validar a conexão no Vercel (ou render) usando instâncias serverless (ex: NeonDB ou Supabase).
2. O GNHF deve ser configurado com chaves secretas de acesso usando pools gerenciados.

## 4. Consequências e Trade-offs
- **Positivo:** Fim dos locks em processos autônomos concorrentes. O banco de dados estará isolado da aplicação e com backups contínuos via provedor de nuvem (WAL).
- **Positivo:** Adoção de JSONB no PostgreSQL facilita buscas complexas nos rastros de `Token Economy`.
- **Negativo:** Overhead de configuração inicial. Requer container para rodar em desenvolvimento.

## 5. Status
- **Status:** Proposto
- **Responsável:** Agente de Performance / Tech Lead
- **Data:** 2026-07-19
