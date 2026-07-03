# Padrões Frontend

## Hierarquia de Componentes

```
frontend/src/components/
├── ui/           # Primitivos: Button, Input, Card, Modal
│                 # Sem lógica de negócio, 100% reutilizáveis
├── features/     # Por domínio: UserProfile, OrderList
│                 # Podem ter lógica, conectados a stores e APIs
└── layouts/      # Estruturas: AppShell, Sidebar, Header
```

## Regras de Componentes
- ✅ **Máximo 150 linhas** por componente (quebrar se maior)
- ✅ **Uma responsabilidade** por componente
- ✅ **Props tipadas** TypeScript (obrigatório)
- ✅ Componentes `ui` nunca importam de `features`
- ✅ **Composição > Configuração** (`children` e `slots` > 15 props)

## Gerenciamento de Estado (Decision Tree)

```
Estado usado por 1 componente?
  └─ Sim → useState local

Estado compartilhado entre poucos próximos?
  └─ Sim → Lift state up ou Context pequeno

Dados vindos do servidor?
  └─ Sim → TanStack Query ou SWR
           (NUNCA copiar para estado global)

Estado global de UI (tema, sidebar, modais)?
  └─ Sim → Zustand ou Pinia (store pequena e focada)

Estado de formulário?
  └─ Sim → React Hook Form ou VeeValidate
```

## Regras de Estado
- ✅ Server state ≠ client state (nunca duplicar dados da API em store)
- ✅ Stores pequenas por domínio (não uma store gigante)
- ✅ Estado derivável não é estado (calcular, não armazenar)

## Camada de API

### Estrutura
```typescript
// ✅ Bom
// api/client.ts - cliente único
const apiClient = axios.create({ baseURL: '/api/v1' })

// api/users.ts - serviços por domínio
export const usersService = {
  list: () => apiClient.get('/users'),
  getById: (id: string) => apiClient.get(`/users/${id}`)
}

// hooks/useUsers.ts - hooks que encapsulam queries
export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: usersService.list })
}

// Componentes NUNCA chamam axios/fetch direto
```

### Anti-Pattern
```typescript
// ❌ Ruim - componente chamando API direto
function UserList() {
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    axios.get('/api/v1/users').then(...) // ❌
  }, [])
}
```

## Estados de UI (obrigatórios em toda tela)

1. **Loading:** skeleton > spinner (evita layout shift)
2. **Erro:** mensagem amigável + ação de retry
3. **Vazio:** ilustração ou texto + CTA (quando fizer sentido)
4. **Sucesso:** conteúdo renderizado

## Acessibilidade (mínimo obrigatório)

- ✅ HTML semântico: `button`, `nav`, `main`, `label`
- ✅ Todo input com label associado
- ✅ Imagens com `alt` (ou `alt=""` se decorativa)
- ✅ Navegável por teclado: foco visível, ordem lógica
- ✅ Modais: focus trap + fechar com ESC
- ✅ Contraste mínimo 4.5:1
- ✅ Erros de form anunciados (`aria-invalid`, `aria-describedby`)
- ✅ Ações só com ícone têm `aria-label`

## Responsividade

- ✅ **Mobile-first:** estilos base para mobile, media queries para cima
- ✅ Testar em: 375px, 768px, 1024px, 1440px
- ✅ Touch targets mínimos: 44x44px
- ❌ Sem scroll horizontal em nenhum breakpoint

## Convenções de Arquivos

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Componentes | PascalCase | `UserCard.tsx` |
| Hooks | camelCase com prefixo `use` | `useAuth.ts` |
| Utils | camelCase | `formatDate.ts` |
| Types | PascalCase com sufixo | `UserType.ts` |
| Testes | `filename.test.tsx` | `UserCard.test.tsx` |

### Regras
- ✅ Um componente por arquivo
- ✅ Teste ao lado do arquivo testado
- ✅ Barrel exports (`index.ts`) apenas em pastas de componente