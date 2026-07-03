# Checklist de QA

## Funcional
- [ ] Fluxo principal funciona (happy path)
- [ ] Validações funcionam (campos obrigatórios, formatos)
- [ ] Edge cases cobertos (valores limite, vazios, nulos)
- [ ] Mensagens de erro são claras
- [ ] Navegação funciona (frontend)

## Integração
- [ ] API responde com status codes corretos
- [ ] Banco de dados persiste/recupera dados corretamente
- [ ] Frontend consome API sem erros de CORS
- [ ] Rotas protegidas (se auth implementado)

## Regressão
- [ ] Funcionalidades não modificadas continuam funcionando
- [ ] Testes existentes passam
- [ ] Nenhum warning novo no console

## Performance
- [ ] Queries < 200ms (ou dentro do NFR)
- [ ] Tempo de carregamento da página aceitável
