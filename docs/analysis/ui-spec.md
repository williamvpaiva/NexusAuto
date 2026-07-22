# UI/UX Specification - NexusAuto

## Visão e Identidade
A interface do frontend do NexusAuto não é voltada ao público geral (B2C), mas atua como um Console de Missão Crítica (Internal Tooling) para Engenheiros, Tech Leads e a orquestração da "The Agency". 
- **Foco Primário:** Densidade de informação, legibilidade de dados estruturados e identificação imediata de gargalos.
- **Tema:** Dark Mode nativo (prioritário para redução de fadiga) com tipografia de alta performance.
- **Fontes:** *Inter* para a navegação estrutural e componentes UI; *JetBrains Mono* ou *Fira Code* para logs, JSONs, UUIDs e trechos de memória bruta.

## Estrutura de Layout (App Shell)
- **Sidebar de Navegação (Esquerda):** Menus claros e agrupados:
  - 📊 Overview (Métricas Macro)
  - 🧠 Memory Explorer (CRUD e buscas no SQLite)
  - 💰 Token Economy (Gastos e auditoria de handoffs)
  - 🩺 System Health (Status V&V)
- **Header / Topbar:** Exibição global do status da API, latência do banco de dados (Ping) e Breadcrumbs para localização imediata do operador.
- **Main View:** Área de conteúdo que expande horizontalmente para alocar tabelas de dados de forma flexível.

## Módulos e Componentes Core
### 1. The Memory Explorer (Explorador de Handoffs)
- **Tabela de Dados Interativa:** Visualização da tabela `messages` e `conversations` integradas. Colunas: `Agent ID`, `Timestamp`, `Role`, `Token Cost`.
- **Row Expansion:** O payload bruto do contexto de LLM é massivo. Ele deve estar colapsado (truncado) e expandir apenas mediante interação (clique) para não quebrar a grade.
- **Busca Avançada:** Barra lateral ou modal focado em busca rápida (filtrando pelos agentes em ação na sessão noturna GNHF).

### 2. Token Dashboard (Métricas)
- **KPI Cards:** Exibição imediata de métricas como `Total Tokens Burned`, `Avg Tokens/Handoff`, `Estimated Cost ($)`.
- **Visualização Gráfica:** Gráfico de linhas ou barras (ex: Recharts) que evidencie os picos de processamento, permitindo ao Tech Lead encontrar anomalias na orquestração dos subagentes.

### 3. V&V & Health Monitor
- **Semáforos de Status:** Indicadores visuais clássicos (🟢 Verde, 🟡 Amarelo, 🔴 Vermelho) consumindo diretamente a rota `/api/v1/health` para apontar o Uptime, Memory Heap do Node e conexão do DB.
- **Error Log Panel:** Uma seção isolada exibindo as instâncias de `error_logs` persistidas caso a API dispare classes customizadas do tipo `AppError`.

## Interações e Feedback de Estado
- **Carregamento (Loading):** Uso intensivo de *Skeleton Loaders* na transição de rotas para minimizar o *Cumulative Layout Shift* (CLS).
- **Toast Notifications:** Feedback não intrusivo para operações CRUD (ex: deletar/limpar logs antigos), garantindo ao operador o sucesso/falha da ação HTTP de imediato.

## Stack Visual Base (Recomendada)
Para atingir este padrão rapidamente e com estabilidade:
- **Estilização:** Tailwind CSS (versão atualizada).
- **Biblioteca de Componentes:** Elementos *headless* via Radix UI, possivelmente combinados com Shadcn UI para tabelas complexas, badges, modais e cards, garantindo visual polido sem peso extra.
- **Ícones:** Biblioteca coesa, preferencialmente *Lucide React*.
