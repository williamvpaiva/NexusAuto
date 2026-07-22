# Deployment Readiness Plan - NexusAuto

## Visão Geral
Este documento estabelece o blueprint de infraestrutura e o processo de CI/CD para mover o NexusAuto do ambiente de desenvolvimento (localhost) para um ambiente de Produção/Staging em cloud. Como o sistema orquestra agentes de IA e lida com persistência pesada de contexto e "Token Economy", resiliência e estabilidade no acesso a dados são as prioridades.

## 1. Topologia de Infraestrutura (Target Architecture)
Dado que a stack atual usa Node.js, Express, React (Vite) e SQLite (com road map para PostgreSQL), desenhamos a produção para operar baseada em contêineres, simplificando o escalonamento.

### Opção A: Full Docker (Recomendada para MVP Imediato)
- **Hospedagem (Compute):** VPS moderna (DigitalOcean Droplet, Linode) ou PaaS *Container-friendly* (Render, Railway).
- **Backend:** Contêiner Docker baseado em Alpine Linux operando a API Node.js (Express).
- **Frontend:** Estáticos buildados pelo Vite e servidos de forma isolada via contêiner Nginx.
- **Persistência Imediata (SQLite):** Volumes gerenciados (`Docker Volumes`) montados apontando obrigatoriamente para `./data/` a fim de garantir que as memórias (`memory.db`) sobrevivam aos *restarts* ou redeploys do serviço.

### Opção B: Cloud Native Desacoplado (Recomendada Pós-PostgreSQL)
- **Frontend:** Servido por CDN Edge/Serverless (Vercel ou Netlify).
- **Backend:** Plataforma Serverless ou CaaS (Google Cloud Run / AWS Fargate) — exigindo que a aplicação seja 100% *stateless*.
- **Database:** Banco relacional em nuvem gerenciado (Neon DB ou Supabase), extinguindo o risco de perda de estado por shutdown do backend.

## 2. Dockerização Necessária (Action Items)
Para a Opção A, precisaremos produzir os seguintes artefatos para selar a infraestrutura como código (IaC):
- `backend/Dockerfile` (Multi-stage build visando *image size* reduzido).
- `frontend/Dockerfile` (Build em Node.js -> Servido por um bloco server leve, como Nginx).
- `docker-compose.prod.yml` (Mapeando portas 80/443 para o front, 3000 interna para o back e blindando networks).

## 3. Environment & Security Secrets
No deploy em nuvem, a segurança das integrações M2M (Machine-to-Machine) da API será pautada pela injeção das variáveis:
- `JWT_SECRET`: Rotacionada periodicamente e injetada no contêiner para validar a API sem exposição no `.env` do repositório.
- `NODE_ENV=production`: Obriga o Express a rodar pipelines internas mais eficientes e desliga stack traces não-intencionais que possam vazar em erros 500.

## 4. Pipeline de CI/CD Contínuo (GitHub Actions)
Uma *action* no diretório `.github/workflows/deploy.yml` atuará como *gatekeeper*. O pipeline não fará push de *codebase* quebrado:
1. Disparado no evento de Merge/Push para `main`.
2. Execução bloqueante do **Pipeline V&V 7-Passos** (Lints, Unitários e E2E, recém ativados no passo PO-04).
3. Efetivação do Build.
4. SSH para VPS e trigger remoto (ou Webhook via API Render/Railway) para swap do contêiner rodando com `Zero Downtime` preferencial.

## Veredito do Agente DevOps
✅ **Pronto para Build.** O código está modular (NPM Workspaces) e a saúde do ecossistema respondeu 100% no último teste local, liberando a via para construir os manifestos Docker em uma PR futura.
