# SPEC-KIT: Catálogo Inteligente de Veículos

**ID:** FEAT-003
**Área:** 01-BACKEND & 02-FRONTEND
**Autor:** TECH-LEAD (Antigravity)
**Status:** 📝 Draft / Aprovado para Execução

---

## 1. Visão Geral
O Catálogo Inteligente de Veículos é o coração da vitrine do NexusAuto. Ele permitirá o cadastro, gerenciamento e exposição dos carros disponíveis na concessionária. Deve suportar busca filtrada e estar preparado para futura integração com IA (geração de descrições baseadas nos dados técnicos).

## 2. Modelagem de Dados (Prisma Schema)
**Model: `Vehicle`**
- `id` (String/UUID, PK)
- `plate` (String, Unique) - Placa do veículo (usado internamente/validação)
- `brand` (String) - Marca (Ex: Toyota, Honda)
- `model` (String) - Modelo (Ex: Corolla, Civic)
- `year` (Int) - Ano de fabricação
- `price` (Decimal/Float) - Valor de venda
- `mileage` (Int) - Quilometragem
- `status` (Enum: `AVAILABLE`, `RESERVED`, `SOLD`) - Default: `AVAILABLE`
- `description` (Text, Opcional) - Descrição detalhada do veículo
- `images` (String[]) - Array de URLs (caminhos virtuais ou links S3/Cloudinary)
- `createdAt` & `updatedAt`

## 3. Endpoints (API REST)
**Prefixo:** `/api/v1/vehicles`

- **`GET /`** (Público) 
  - Lista veículos disponíveis.
  - Suporta Query Params: `?brand=Toyota&minPrice=50000&maxPrice=100000`
- **`GET /:id`** (Público) 
  - Retorna os dados detalhados de um veículo específico.
- **`POST /`** (Protegido: ADMIN, MANAGER)
  - Cria um novo veículo no catálogo. Validação rigorosa via Zod.
- **`PUT /:id`** (Protegido: ADMIN, MANAGER)
  - Atualiza preço, status ou descrição do veículo.
- **`DELETE /:id`** (Protegido: ADMIN)
  - Remove/oculta um veículo do sistema.

## 4. Regras de Negócio e Segurança
1. **RBAC:** Apenas gestores (`ADMIN`, `MANAGER`) têm permissão de escrita e alteração. A rota de leitura é pública para permitir a criação da vitrine para clientes finais.
2. **Sanitização:** Validar dados de entrada (Zod) garantindo que preços e quilometragem nunca sejam negativos.
3. **Placa:** A placa deve ser única no banco para evitar veículos duplicados.

## 5. Implementação no Frontend (React/Vite)
- **`VehicleCatalogPage.tsx` (Público):** Galeria/Grid de veículos para o usuário final com filtros interativos.
- **`AdminVehiclePage.tsx` (Protegido):** CRUD para o lojista cadastrar e gerenciar a frota, com formulário complexo usando React Hook Form + Zod.

## 6. Critérios de Aceite (V&V - Verification & Validation)
- [ ] O modelo `Vehicle` foi criado no banco e sincronizado (`db push`).
- [ ] Testes de Integração (Vitest) para a API retornam HTTP 200 nas buscas e HTTP 401 para criação sem token de ADMIN.
- [ ] O frontend exibe corretamente a lista em grid consumindo o endpoint público.
- [ ] O formulário de criação no painel Admin valida corretamente campos obrigatórios antes de enviar a requisição.
