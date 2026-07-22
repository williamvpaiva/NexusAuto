# E2E Tests - NexusAuto Líder Orchestration Flow

## Visão Geral

Este diretório contém testes end-to-end (E2E) para o fluxo de orquestração do Líder, cobrindo:

1. **Delegação Automática de Tarefas** (CowAgent Wrapper)
2. **Persistência de Memória** (SQLite + Wiki)
3. **Validação V&V com Cache**
4. **Fluxo Completo de Integração**

## Estrutura de Arquivos

```
tests/
├── e2e/
│   ├── orchestration-flow.test.js    # Suite principal de testes E2E
│   └── test-report.json              # Relatório gerado após execução
├── fixtures/                          # Dados de teste (mocks, samples)
└── package.json                       # Configuração do pacote de testes
```

## Como Executar

### Pré-requisitos

- Node.js 18+ instalado
- NexusAuto configurado na raiz do projeto
- SQLite disponível (via `sqlite3` npm package)

### Comandos

```bash
# Na raiz do projeto (D:\NexusAuto)
npm test --workspace tests

# Ou diretamente
node tests/e2e/orchestration-flow.test.js

# Com verbose
node --trace-warnings tests/e2e/orchestration-flow.test.js

# Ver relatório
cat tests/e2e/test-report.json | jq '.'
```

## Suítes de Teste

### 1. CowAgent Delegation Tests

Testa o sistema de delegação automática do CowAgent:

- ✅ Keyword routing matrix initialization
- ✅ Backend task keyword matching
- ✅ Frontend task keyword matching
- ✅ Security task keyword matching
- ✅ DevOps task keyword matching
- ✅ Digital Product task keyword matching
- ✅ Skill mapping complete

### 2. Memory Persistence Tests

Testa a integração Memory Manager + Wiki persistente:

- ✅ SQLite database initialized
- ✅ Save memory with Wiki sync
- ✅ Wiki file format correct
- ✅ Session log append working
- ✅ Wiki search functional
- ✅ Hybrid search functional
- ✅ Wiki Index auto-update

### 3. V&V Validation Tests

Testa o protocolo de Validação & Verificação:

- ✅ Cache check script exists
- ✅ Scoring logic correct
- ✅ Level mapping correct

### 4. Integration Flow Tests

Testa o fluxo completo de orquestração:

- ✅ End-to-end task flow
- ✅ Multi-agent handoff

## Critérios de Aceite

Um teste é considerado **aprovado** quando:

1. **Delegação**: Keywords são corretamente mapeadas para agentes
2. **Memória**: Dados são persistidos no SQLite E no Wiki
3. **V&V**: Cache e scoring funcionam conforme matriz
4. **Integração**: Fluxo completo executa sem erros

## Relatório de Testes

Após a execução, um relatório JSON é gerado em `tests/e2e/test-report.json`:

```json
{
  "timestamp": "2026-07-21T...",
  "summary": {
    "total": 20,
    "passed": 19,
    "failed": 1,
    "skipped": 0,
    "duration": "2.45"
  },
  "tests": [...]
}
```

## Adicionando Novos Testes

Para adicionar um novo teste:

1. Crie uma função `testSuite_Nome()` seguindo o padrão existente
2. Use `registerTest(nome, status, erro)` para registrar resultados
3. Adicione a suite ao `runAllTests()`
4. Execute `npm test` para validar

## Troubleshooting

### Erro: "SQLite database not found"

- Verifique se `nexusauto_memory.db` existe na raiz
- Execute `node scripts/memory-manager.js stats` para inicializar

### Erro: "Wiki directory not found"

- Verifique se `.ai-factory/wiki/` existe
- Execute `mkdir -p .ai-factory/wiki/{entities,concepts,decisions,session}`

### Erro: "CowAgent not ready"

- Verifique se o submódulo `cowagent/` está inicializado
- Execute `git submodule update --init`

## Integração com CI/CD

Para integrar com GitHub Actions:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run E2E Tests
        run: npm test --workspace tests
      
      - name: Upload test report
        uses: actions/upload-artifact@v4
        with:
          name: test-report
          path: tests/e2e/test-report.json
```

## Métricas de Qualidade

| Métrica | Target | Como Medir |
|---------|--------|------------|
| Cobertura de Testes | >80% | % de funcionalidades testadas |
| Tempo de Execução | <30s | Duração total do `npm test` |
| Taxa de Aprovação | >95% | `passed / total * 100` |
| Falsos Positivos | <1% | Testes que falham sem motivo real |

## Referências

- [TECH-LEAD.md](../TECH-LEAD.md) - Diretrizes de orquestração
- [cowagent-wrapper.cjs](../scripts/cowagent-wrapper.cjs) - Módulo de delegação
- [memory-manager.cjs](../scripts/memory-manager.cjs) - Módulo de memória
- [PROPOSTA.md](../skills/lider/PROPOSTA.md) - Proposta da skill Líder

---

**Skill Owner**: NexusAuto AI Factory  
**Status**: ✅ Ativa  
**Última Atualização**: 2026-07-21