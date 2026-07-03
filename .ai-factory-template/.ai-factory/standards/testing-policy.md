# Política de Testes

## Pirâmide de Testes
```
       /\
      /  \      E2E: 10% - fluxos críticos completos
     /----\
    /      \    Integração: 30% - endpoints, componentes conectados
   /--------\
  /          \  Unitário: 60% - services, utils, componentes isolados
 /------------\
```

## Cobertura Mínima

| Camada | Cobertura | Bloqueia Merge |
|--------|-----------|----------------|
| Services e Domain (backend) | 80%+ | ✅ Sim |
| Utils e Helpers | 90%+ | ✅ Sim |
| Controllers e Routes | via integração | ✅ Sim |
| Componentes UI críticos | 70%+ | ✅ Sim |
| Fluxos E2E principais | 100% dos críticos | ✅ Release |

## Convenções de Nomenclatura

### Descrever comportamento, não implementação
```typescript
// ✅ Bom
it('cria usuário com senha hasheada', () => {})
it('lança ConflictError quando email já existe', () => {})

// ❌ Ruim
it('testa createUser', () => {})
it('verifica se funciona', () => {})
```

## Estrutura AAA

```typescript
// Arrange: preparar dados e dependências
const userInput = { name: 'Ada', email: 'ada@example.com' }

// Act: executar a ação sendo testada
const user = await userService.create(userInput)

// Assert: verificar resultado esperado
expect(user.email).toBe('ada@example.com')
```

## Test Data Builders

### Usar factories, nunca objetos gigantes copiados
```typescript
// ✅ Bom
const user = buildUser({ email: 'novo@example.com' })

// ❌ Ruim
const user = {
  id: '123',
  name: 'Test',
  email: 'test@example.com',
  createdAt: '...',
  updatedAt: '...',
  // ... 20 campos
}
```

## O que Testar (prioridade)

1. **Regras de negócio:** todo `BUS-ID` tem teste
2. **Casos de erro:** validações, permissões, conflitos
3. **Edge cases:** vazio, nulo, limites, unicode
4. **Fluxos críticos E2E:** login, checkout, operações de dinheiro
5. **Bugs corrigidos:** todo `BUG-ID` ganha teste de regressão

## O que NÃO Testar

- ❌ Bibliotecas de terceiros (já testadas)
- ❌ Getters e setters triviais
- ❌ Detalhes de implementação (testar comportamento)
- ❌ Snapshots gigantes sem propósito

## Anti-Patterns de Testes

- ❌ Testes que dependem de ordem de execução
- ❌ Testes com `sleep` ou timeout fixo (usar `waitFor`)
- ❌ Mockar tudo (teste que só testa mocks não testa nada)
- ❌ Assert genérico `toBeTruthy()`
- ❌ Testes flaky ignorados com `skip` (corrigir ou deletar)
- ❌ Compartilhar estado entre testes

## Regra de Ouro

> **Todo PR de feature inclui testes.**
> **Todo PR de bugfix inclui teste que falharia sem a correção.**
> **Sem exceções.**