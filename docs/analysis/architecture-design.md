# Architecture Design Document - NexusAuto

## 1. Visão de Alto Nível
O NexusAuto adota uma arquitetura Cliente-Servidor (Client-Server) focada em API-First, otimizada primariamente para integrações Máquina-para-Máquina (M2M), visto que os consumidores principais do backend são os agentes autônomos de IA (The Agency). O sistema é estruturado como um monorepo para facilitar o versionamento e a esteira de CI/CD contínua.

### Componentes Principais
1. **Frontend (Control Board):** React 18, Vite e TypeScript. Interface homem-máquina (HMI) utilizada pelo Tech Lead e Operadores Humanos para monitorar o gasto de tokens, acompanhar logs de erros e intervir no pipeline se necessário.
2. **Backend (Memory API / Engine):** Node.js com Express e TypeScript. Coração do ecossistema de dados. Encapsula as regras de validação (Zod), segurança (Helmet/CORS/JWT) e lida com a lógica de persistência e recuperação de contexto em camadas (summarized vs raw).
3. **Database (Persistence Layer):** RDBMS leve (SQLite local em `./data/memory.db`). O acesso é unificado, permitindo estabilidade imediata para testes e uma fundação relacional para o armazenamento hierárquico das execuções (conversations/messages).

## 2. Padrões de Design de Software
- **Camadas Clássicas (N-Tier Layering):** Adoção rigorosa do padrão `Controller -> Service -> Repository` no backend para separar roteamento HTTP, lógica de negócios pura e comunicação direta via SQL.
- **Fail-Fast Error Handling:** Tratamento de erros centralizado via middleware de captura `error-handler.ts`. O backend não expõe stack traces a requisições falhas, validando contratos fortemente via schemas do Zod antes de onerar recursos do banco.
- **Interceptor de Segurança:** Aplicação de middleware JWT genérico (`auth.ts`) em rotas sensíveis (Memória, Usuários), protegendo o sistema contra envenenamento de contexto por scripts maliciosos.

## 3. Topologia de Dados e Relacionamentos
A estrutura de dados que mapeia a "Memória" da IA é composta por:
- **`users`**: Autenticação de agentes e humanos (Machine e Human Tokens).
- **`conversations`**: Entidade pai que agrupa o macro-contexto (ex: Milestone GNHF-v1).
- **`messages`**: Armazenamento em série temporal de cada payload de LLM/Prompt. Inclui a métrica crítica de `token_count` para a Token Economy.
- **`error_logs`**: Tabela autônoma que grava o estado em caso de falha sistêmica (`error_code`, dump do estado) para retomada segura pelo agente de Debug.

## 4. Integração do Orquestrador (The Agency)
Os scripts locais de orquestração na pasta `.ai-factory/` utilizam bibliotecas HTTP ou scripts `.ts` independentes para acessar a Memory API.
O fluxo (Pipeline V&V) exige que as integrações sejam asseguradas por testes via `Supertest`, atuando como testes de contrato, impossibilitando que regressões da API quebrem a inteligência dos agentes.

## 5. Plano de Evolução (Evolução Técnica)
- O uso de drivers diretos de banco (`sqlite3`) é transitório. O contrato da camada de Repository facilita a introdução futura de um ORM maduro (como Drizzle ou Prisma).
- Escalabilidade Vertical e Horizontal: A migração projetada da persistência local (SQLite) para PostgreSQL (Cloud ou Dockerizado) é o divisor de águas para permitir concorrência verdadeira (múltiplos agentes de IA operando e alterando arquivos paralelamente sem "database lock").
