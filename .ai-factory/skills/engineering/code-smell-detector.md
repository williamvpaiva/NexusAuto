---
name: code-smell-detector
category: general
complexity: medium
agents: []
created: 2026-07-11
---

# Skill: Code Smell Detector

> Identificação automática de code smells em qualquer linguagem ou framework

---

## 🎯 Objetivo

Analisar código-fonte para detectar padrões problemáticos (code smells) que indicam problemas de design, manutenibilidade ou qualidade, antes que se tornem dívida técnica consolidada.

---

## 🔁 Gatilhos de Acionamento

- Code review solicitado
- Antes de merge em branch principal
- Auditoria de qualidade agendada
- Refatoração planejada
- Métricas de qualidade abaixo do threshold
- Onboarding em código legado desconhecido

---

## 📋 Processo de 6 Passos

### PASSO 1: VARRER

**Objetivo:** Escanear todo o código-alvo para coleta de métricas brutas

**Ações:**
1. Identificar escopo (arquivos, módulos, diretórios)
2. Escolher ferramentas de análise estática
3. Executar varredura inicial
4. Coletar métricas brutas por arquivo
5. Registrar baseline de qualidade

**Output:**
```markdown
## Scan Completo

**Escopo:** 47 arquivos, 3 módulos
**LOCs:** 12,430
**Arquivos analisados:** src/, lib/, tests/
**Thresholds:** Complexidade < 10, Métodos < 20 linhas
```

---

### PASSO 2: CLASSIFICAR

**Objetivo:** Categorizar cada smell detectado por tipo e severidade

**Ações:**
1. Mapear cada ocorrência a uma categoria de smell
2. Classificar severidade (baixa/média/alta/crítica)
3. Agrupar ocorrências por padrão
4. Calcular densidade por módulo
5. Identificar hotspots (arquivos com múltiplos smells)

**Critérios de Severidade:**
- **Crítica:** Impede manutenção ou causa bugs frequentes
- **Alta:** Reduz significativamente a qualidade
- **Média:** Violação de boas práticas
- **Baixa:** Oportunidade de melhoria

---

### PASSO 3: ANALISAR

**Objetivo:** Aprofundar cada ocorrência para entender impacto real

**Ações:**
1. Calcular complexidade ciclomática por método
2. Medir acoplamento aferente (CA) e eferente (CE)
3. Calcular coesão (LCOM - Lack of Cohesion of Methods)
4. Identificar dependências circulares
5. Analisar profundidade de herança (DIT)

**Métricas por Arquivo:**
```json
{
  "arquivo": "UserService.java",
  "complexidade_media": 8.5,
  "acoplamento_eferente": 12,
  "acoplamento_aferente": 5,
  "lcom": 0.72,
  "dit": 3,
  "loc": 450
}
```

---

### PASSO 4: REPORTAR

**Objetivo:** Gerar relatório estruturado com todas as descobertas

**Ações:**
1. Consolidar resultados em formato padronizado
2. Priorizar por severidade + impacto
3. Estimar esforço de refatoração
4. Vincular cada smell a técnica de refatoração
5. Exportar para sistema de tracking

**Formato de Saída:**
```json
{
  "smells_identificados": [
    {
      "tipo": "Long Method",
      "severidade": "alta",
      "arquivo": "UserService.java",
      "linha": 42,
      "loc": 45,
      "recomendacao": "Extrair validateUser(), hashPassword(), saveUser()",
      "esforco_estimado": "2h"
    }
  ],
  "metricas_globais": {
    "total_smells": 23,
    "criticos": 2,
    "altos": 7,
    "medios": 9,
    "baixos": 5,
    "densidade_media": "0.18 smells/KLOC"
  },
  "hotspots": [
    {"arquivo": "PaymentProcessor.java", "smells": 5, "prioridade": 1},
    {"arquivo": "UserService.java", "smells": 4, "prioridade": 2}
  ]
}
```

---

### PASSO 5: RECOMENDAR

**Objetivo:** Sugerir ações concretas de refatoração para cada smell

**Ações:**
1. Mapear smell → técnica de refatoração
2. Calcular relação custo/benefício
3. Sugerir ordem de execução
4. Identificar dependências entre refatorações
5. Estimar risco de cada mudança

**Catálogo Smell → Refatoração:**
| Smell | Técnica Recomendada | Complexidade |
|-------|---------------------|--------------|
| Long Method | Extract Method | Baixa |
| Large Class | Extract Class | Média |
| Switch Statements | Replace with Strategy | Alta |
| Feature Envy | Move Method | Média |
| Data Clump | Introduce Parameter Object | Baixa |
| Primitive Obsession | Replace with Value Object | Média |
| Message Chains | Hide Delegate | Baixa |

---

### PASSO 6: ACOMPANHAR

**Objetivo:** Garantir que as refatorações sejam executadas e validadas

**Ações:**
1. Registrar no sistema de tracking (issues)
2. Definir prazo para cada ação
3. Reavaliar após refatoração
4. Atualizar baseline de qualidade
5. Incluir em esteira de CI/CD

**Indicadores de Acompanhamento:**
- Smells corrigidos / smells identificados
- Redução de complexidade média
- Melhoria nas métricas de teste
- Tempo médio de resolução

---

## 🏷️ Catálogo Completo de Code Smells

### Bloaters (Inchaço)
- **Long Method:** Métodos com mais de 20 linhas
- **Large Class:** Classes com mais de 300 linhas
- **Primitive Obsession:** Uso excessivo de tipos primitivos onde objetos seriam mais adequados
- **Long Parameter List:** Métodos com mais de 4 parâmetros
- **Data Clump:** Conjunto de dados que sempre aparecem juntos

### Change Dispatchers (Dispersão de Mudança)
- **Divergent Change:** Classe que muda por razões diferentes
- **Shotgun Surgery:** Mudança que exige alterações em muitos arquivos
- **Parallel Inheritance Hierarchies:** Hierarquias de classes espelhadas
- **Dependency Magnet:** Módulo que muitos outros dependem

### Data Organizers (Organização de Dados)
- **Data Class:** Classe com apenas campos, sem comportamento
- **Temporary Field:** Campos que só são usados em algumas circunstâncias
- **Refused Bequest:** Subclasse que rejeita métodos herdados
- **Alternative Classes with Different Interfaces:** Classes similares com interfaces incompatíveis

### OOP Abusers (Abusos de Orientação a Objetos)
- **Switch Statements:** Múltiplos condicionais que poderiam ser polimorfismo
- **Switch Statements duplicados:** Mesmo switch em vários lugares
- **Conditional Complexity:** Condições muito complexas (if aninhados profundos)
- **Instanceof Abuser:** Uso excessivo de type checking

### Couplers (Acoplamento)
- **Feature Envy:** Método que usa mais dados de outra classe que da própria
- **Inappropriate Intimacy:** Classes que se conhecem intimamente demais
- **Message Chains:** `a.getB().getC().doSomething()`
- **Middle Man:** Classe que só delega para outra
- **Incomplete Library Class:** Biblioteca que precisa de métodos extras

### Outros
- **Speculative Generality:** Código genérico desnecessário ("e se...")
- **Dead Code:** Código morto, não utilizado
- **Duplicate Code:** Código duplicado (DRY violado)
- **Magic Numbers:** Números literais sem constante nomeada
- **Lazy Class:** Classe que faz muito pouco
- **Comments as Crutch:** Comentários que explicam código complexo (indica que deveria ser simplificado)

---

## 📊 Métricas Suportadas

| Métrica | Descrição | Threshold Alerta |
|---------|-----------|-----------------|
| Complexidade Ciclomática | Número de caminhos independentes | > 10 |
| Acoplamento Eferente (CE) | Classes que esta classe usa | > 14 |
| Acoplamento Aferente (CA) | Classes que usam esta classe | N/A (contextual) |
| LCOM | Falta de Coesão de Métodos | > 0.7 |
| DIT | Profundidade na árvore de herança | > 4 |
| NOC | Número de subclasses | N/A |
| LOC | Linhas de código | > 300 (classe), > 20 (método) |
| Tamanho de Parâmetros | Número de parâmetros | > 4 |

---

## ✅ Critérios de Qualidade

- [ ] Todos os arquivos do escopo foram varridos
- [ ] Smells classificados por severidade
- [ ] Métricas calculadas por arquivo e módulo
- [ ] Relatório gerado em formato estruturado
- [ ] Recomendações vinculadas a smells específicos
- [ ] Priorização baseada em impacto + esforço
- [ ] Baseline registrado para comparação futura
- [ ] Hotspots identificados e destacados
- [ ] Estimativas de refatoração incluídas
- [ ] Tracking configurado para acompanhamento

---

## 🔗 Integração

- **Acionado por:** `tech-lead`, `backend-dev`, `frontend-dev`, `qa-engineer`
- **Aciona:** `refactoring-advisor`, `complexity-analyzer`, `dead-code-eliminator`
- **Registra em:** `.ai-factory/logs/code-smells/`
- **Ferramentas compatíveis:** ESLint, SonarQube, PMD, Checkstyle, pylint

---

## 📈 Exemplo de Uso

```markdown
## Solicitação: "Analise code smells no módulo de pagamentos"

### Resultado do Scan
- **Arquivos:** 12
- **LOCs:** 3,450
- **Smells encontrados:** 15

### Principais Problemas
1. **Long Method** em `PaymentProcessor.processar()` (65 linhas) ⚠️ Crítico
   - Sugestão: Extrair 3 métodos (validarCartao, calcularParcelas, executarPagamento)

2. **Feature Envy** em `NotaFiscal.gerarXML()` ⚠️ Alto
   - Usa 7 propriedades de `Pedido`, apenas 2 de `NotaFiscal`
   - Sugestão: Mover para Pedido.gerarXML()

3. **Magic Numbers** em `Juros.calcular()` ⚠️ Médio
   - Substituir 0.05, 0.10, 365 por constantes nomeadas

### Impacto Total Estimado
- Esforço de refatoração: ~8h
- Redução esperada de complexidade: 35%
- Risco de regressão: Baixo (com testes existentes)
```
