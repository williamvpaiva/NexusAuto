# Template de Handoff Resumido

## HANDOFF: [AGENTE_ORIGEM] -> [AGENTE_DESTINO]

### Metadados
- **Data/Hora**: `YYYY-MM-DD HH:mm`
- **Tarefa ID**: `[ID do PROGRESS.md]`
- **Hash do Commit**: `git rev-parse HEAD`

### Escopo da Entrega
- **Módulo Afetado**: (ex: `backend/src/auth/`)
- **Arquivos Alterados**: 
  - `path/to/file1.ts` (modificado)
  - `path/to/file2.ts` (criado)
  - `path/to/file3.ts` (deletado)

### Resumo Funcional
*(Máximo 100 palavras - descreva O QUE mudou, não COMO)*

### Impacto em Testes
- **Suítes Afetadas**: 
  - `tests/unit/auth.test.ts` - ✅ Aprovado
  - `tests/integration/login.test.ts` - ⏳ Pendente
- **Novos Testes Criados**: (listar apenas se houver)

### Validação Aplicada
- [ ] Lint (ESLint/Prettier)
- [ ] Type Check (TypeScript)
- [ ] Testes Unitários
- [ ] Testes de Integração
- [ ] Smoke Test

### Pontos Críticos para Atenção
*(O que o próximo agente DEVE verificar)*
1. 
2. 
3. 

### Próxima Ação Esperada
*(Seja específico sobre o que o agente destinatário deve fazer)*

### Anexos (apenas se necessário)
- [ ] Diff completo (arquivo `.patch` separado)
- [ ] Logs de erro (referência, não conteúdo)
- [ ] Screenshots (caminho relativo)

---

## Regras Obrigatórias
1. ❌ NUNCA copie código inteiro do agente anterior
2. ✅ USE apenas este template (máx 200 tokens)
3. ✅ REFERENCIE arquivos por nome, não por conteúdo
4. ✅ INCLUA hash do git para cache de validação
5. ✅ ESPECIFIQUE próxima ação de forma clara

## Validação do Tech Lead
- [ ] Template seguido corretamente
- [ ] Hash de commit presente
- [ ] Próxima ação clara
- [ ] Sem código duplicado

*Se algum item acima falhar, o handoff será rejeitado e deverá ser refeito.*