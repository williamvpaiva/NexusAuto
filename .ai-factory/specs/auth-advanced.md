# Spec: Autenticação Avançada (JWT + RBAC)

## Visão Geral
Implementar um sistema de autenticação seguro e robusto para o NexusAuto, permitindo que usuários façam login, gerenciem suas sessões e tenham seus acessos controlados com base em papéis (Role-Based Access Control).

## Requisitos Funcionais
1. **Registro/Login**: Cadastro de novos usuários (criptografia de senhas com bcrypt) e emissão de tokens JWT.
2. **RBAC (Roles)**: Suporte aos papéis: `ADMIN`, `MANAGER`, `SALES`, `CLIENT`.
3. **Sessão**: Refresh tokens para manter a sessão ativa de forma segura.
4. **Middlewares**: Criação de middleware para verificar token e middleware para verificar permissões (`requireRole`).

## Arquitetura
- **Banco de Dados (Prisma)**: 
  - Model `User`: id, email, passwordHash, role, createdAt, updatedAt.
  - Model `Session`: id, userId, refreshToken, expiresAt, createdAt.
- **Camada de Serviço (`auth.service.ts`)**: Lógica de hash, verificação de senha e geração de JWT.
- **Camada de Rota (`auth.routes.ts`)**: Endpoints `/register`, `/login`, `/refresh`, `/me`.
- **Segurança**: JWT com expiração curta (ex: 15m) e Refresh Token (HTTP-Only cookie) com expiração longa (ex: 7d).

## Critérios de Aceite (V&V)
- Senhas NUNCA devem ser salvas em plain text.
- Tentativas de acesso a rotas protegidas sem token devem retornar `401 Unauthorized`.
- Tentativas de acesso a rotas de `ADMIN` por um `CLIENT` devem retornar `403 Forbidden`.
- Cobertura de testes unitários para a geração de tokens e verificação de senhas.
