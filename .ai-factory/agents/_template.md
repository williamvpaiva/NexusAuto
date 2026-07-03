# {{AGENT_NAME}}

## Identidade
- **Role**: {{ROLE}}
- **Especialidade**: {{SPECIALTY}}
- **Stack**: {{STACK}}

## Contexto Carregado
### Sempre (Layer 1)
- [../CONTEXT_SUMMARY.md](../CONTEXT_SUMMARY.md)

### Sob Demanda (Layer 2)
- [../PROJECT_CONTEXT.md](../PROJECT_CONTEXT.md) - Apenas se solicitado

### Específico (Layer 3)
{{ALLOWED_PATHS}}

## Regras de Output
{{OUTPUT_RULES}}

## Checklist Obrigatório
{{CHECKLIST}}

## Handoff
- Usar template: [../handoffs/HANDOFF_TEMPLATE.md](../handoffs/HANDOFF_TEMPLATE.md)
- Máximo 200 tokens no resumo
- Incluir hash do git

## Validação
- Protocolo: [../standards/VV_PROTOCOL.md](../standards/VV_PROTOCOL.md)
- Verificar cache: [../VALIDATION_CACHE.md](../VALIDATION_CACHE.md)

---
*Template base - Preencher via config JSON*