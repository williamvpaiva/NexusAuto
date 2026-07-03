/**
 * Token Capture Script — AI Factory
 * 
 * Captura automaticamente tokens de interações com LLMs
 * Registra em tempo real no REGISTRO-GLOBAL.json
 * Gera relatórios automáticos (diário, semanal, mensal)
 * 
 * Uso:
 *   node token-capture.js --projeto POLYMARKETING --tarefa "Criar TECH-LEAD.md" --modelo claude-sonnet
 * 
 * Ou via API:
 *   const TokenCapture = require('./token-capture');
 *   const capture = new TokenCapture();
 *   capture.registrar({ projeto, tarefa, modelo, prompt, resposta });
 */

const fs = require('fs');
const path = require('path');

// ==================== CONFIGURAÇÕES ====================

const CONFIG_PATH = path.join(__dirname, '../CONFIG.json');
const REGISTRO_GLOBAL_PATH = path.join(__dirname, '../REGISTRO-GLOBAL.json');
const PROJETOS_PATH = path.join(__dirname, '../PROJETOS');
const RELATORIOS_PATH = path.join(__dirname, '../RELATORIOS');
const OTIMIZACOES_PATH = path.join(__dirname, '../OTIMIZACOES');

// ==================== UTILITÁRIOS ====================

function contarTokens(texto) {
  if (!texto || typeof texto !== 'string') return 0;
  return Math.ceil(texto.length / 3.5);
}

function gerarId() {
  return `REG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function formatarDuracao(segundos) {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const secs = Math.floor(segundos % 60);
  if (horas > 0) return `${horas}h ${minutos}min ${secs}s`;
  if (minutos > 0) return `${minutos}min ${secs}s`;
  return `${secs}s`;
}

function carregarJSON(caminho) {
  try {
    if (!fs.existsSync(caminho)) return {};
    return JSON.parse(fs.readFileSync(caminho, 'utf-8'));
  } catch (e) {
    console.error(`Erro ao carregar ${caminho}:`, e.message);
    return {};
  }
}

function salvarJSON(caminho, dados) {
  try {
    const dir = path.dirname(caminho);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf-8');
  } catch (e) {
    console.error(`Erro ao salvar ${caminho}:`, e.message);
  }
}

// ==================== CLASSE PRINCIPAL ====================

class TokenCapture {
  constructor() {
    this.config = carregarJSON(CONFIG_PATH);
    this.registroGlobal = carregarJSON(REGISTRO_GLOBAL_PATH);
    if (!this.registroGlobal.registros) this.registroGlobal.registros = [];
    if (!this.registroGlobal.resumo_geral) {
      this.registroGlobal.resumo_geral = {
        total_tarefas: 0, total_tokens_entrada: 0, total_tokens_saida: 0,
        total_tokens_geral: 0, custo_total_usd: 0, custo_total_brl: 0,
        tempo_total_segundos: 0, economia_total_usd: 0, economia_total_percentual: '0%'
      };
    }
  }
  
  calcularCusto(tokens, modelo, tipo) {
    const precos = this.config.precos_modelos || {};
    let modeloConfig = null;
    for (const cat in precos) {
      if (precos[cat][modelo]) { modeloConfig = precos[cat][modelo]; break; }
    }
    if (!modeloConfig) {
      console.warn(`⚠️ Modelo "${modelo}" não encontrado. Usando Claude Sonnet como default.`);
      modeloConfig = { entrada_usd_per_million: 3, saida_usd_per_million: 15 };
    }
    const precoPorToken = tipo === 'entrada' 
      ? modeloConfig.entrada_usd_per_million / 1000000 
      : modeloConfig.saida_usd_per_million / 1000000;
    const custo_usd = tokens * precoPorToken;
    const custo_brl = custo_usd * (this.config.configuracoes?.taxa_cambio_brl_usd || 5.45);
    return { usd: custo_usd, brl: custo_brl };
  }
  
  registrarInteracao(dados) {
    console.log('\n📊 Token Capture — Registrando interação...\n');
    
    const id = gerarId();
    const timestamp = new Date().toISOString();
    const tokens_entrada = contarTokens(dados.prompt || '');
    const tokens_saida = contarTokens(dados.resposta || '');
    const tokens_total = tokens_entrada + tokens_saida;
    
    const custo_entrada = this.calcularCusto(tokens_entrada, dados.modelo, 'entrada');
    const custo_saida = this.calcularCusto(tokens_saida, dados.modelo, 'saida');
    const custo_total_usd = custo_entrada.usd + custo_saida.usd;
    const custo_total_brl = custo_entrada.brl + custo_saida.brl;
    
    const duracao = dados.duracao_segundos || 0;
    
    let economia_tokens = 0, economia_usd = 0;
    if (dados.otimizacoes && Array.isArray(dados.otimizacoes)) {
      dados.otimizacoes.forEach(opt => {
        economia_tokens += opt.economia_tokens || 0;
        economia_usd += opt.economia_usd || 0;
      });
    }
    
    const registro = {
      id, timestamp,
      projeto: dados.projeto || 'PROJETO_NAO_ESPECIFICADO',
      tarefa: dados.tarefa || 'TAREFA_NAO_ESPECIFICADA',
      agente: dados.agente || 'agente_nao_especificado',
      modelo: dados.modelo || this.config.configuracoes?.modelo_padrao || 'claude-sonnet-4-20250514',
      tokens: { entrada: tokens_entrada, saida: tokens_saida, total: tokens_total },
      custo: { entrada_usd: custo_entrada.usd, saida_usd: custo_saida.usd, total_usd: custo_total_usd, total_brl: custo_total_brl },
      tempo: { inicio: dados.inicio || timestamp, fim: dados.fim || timestamp, duracao_segundos: duracao, duracao_formatada: formatarDuracao(duracao) },
      otimizacoes_aplicadas: dados.otimizacoes || [],
      economia: { tokens_economizados: economia_tokens, usd_economizados: economia_usd },
      metadata: { arquivos_lidos: dados.arquivos_lidos || [], arquivos_criados: dados.arquivos_criados || [], area: dados.area || null }
    };
    
    this.salvarRegistro(registro);
    this.atualizarRelatorioDiario(registro);
    this.atualizarRelatorioSemanal(registro);
    this.atualizarRelatorioMensal(registro);
    this.atualizarProjeto(registro);
    this.atualizarEconomiaAcumulada(registro);
    this.verificarAlertas(registro);
    this.exibirResumo(registro);
    
    return registro;
  }
  
  salvarRegistro(registro) {
    this.registroGlobal.registros.push(registro);
    const resumo = this.registroGlobal.resumo_geral;
    resumo.total_tarefas++;
    resumo.total_tokens_entrada += registro.tokens.entrada;
    resumo.total_tokens_saida += registro.tokens.saida;
    resumo.total_tokens_geral += registro.tokens.total;
    resumo.custo_total_usd += registro.custo.total_usd;
    resumo.custo_total_brl += registro.custo.total_brl;
    resumo.tempo_total_segundos += registro.tempo.duracao_segundos;
    resumo.economia_total_usd += registro.economia.usd_economizados;
    
    const custo_sem_otimizacoes = resumo.custo_total_usd + resumo.economia_total_usd;
    resumo.economia_total_percentual = custo_sem_otimizacoes > 0 
      ? ((resumo.economia_total_usd / custo_sem_otimizacoes) * 100).toFixed(1) + '%' 
      : '0%';
    
    this.registroGlobal.ultima_atualizacao = new Date().toISOString();
    salvarJSON(REGISTRO_GLOBAL_PATH, this.registroGlobal);
  }
  
  atualizarRelatorioDiario(registro) {
    const data = registro.timestamp.split('T')[0];
    const caminho = path.join(RELATORIOS_PATH, 'diario', `${data}.json`);
    let rel = carregarJSON(caminho);
    
    if (!rel.resumo_dia) {
      rel = { data, semana: this.getNumeroSemana(new Date()), mes: this.getNomeMes(new Date()), ano: new Date().getFullYear(),
        resumo_dia: { total_tarefas: 0, total_tokens: 0, custo_total_usd: 0, custo_total_brl: 0, tempo_total_horas: 0, economia_usd: 0, economia_percentual: '0%' },
        tarefas_por_hora: {}, modelo_usage: {}, agente_usage: {}, otimizacoes_do_dia: [], gargalos_identificados: [], sugestoes_para_amanha: [],
        comparacao_dia_anterior: { variacao_tokens: '0%', variacao_custo: '0%', variacao_economia: '0%' }, ultima_atualizacao: registro.timestamp };
    }
    
    rel.resumo_dia.total_tarefas++;
    rel.resumo_dia.total_tokens += registro.tokens.total;
    rel.resumo_dia.custo_total_usd += registro.custo.total_usd;
    rel.resumo_dia.custo_total_brl += registro.custo.total_brl;
    rel.resumo_dia.tempo_total_horas += registro.tempo.duracao_segundos / 3600;
    rel.resumo_dia.economia_usd += registro.economia.usd_economizados;
    
    const modelo = registro.modelo;
    if (!rel.modelo_usage[modelo]) rel.modelo_usage[modelo] = { tarefas: 0, tokens: 0, custo_usd: 0 };
    rel.modelo_usage[modelo].tarefas++;
    rel.modelo_usage[modelo].tokens += registro.tokens.total;
    rel.modelo_usage[modelo].custo_usd += registro.custo.total_usd;
    
    const agente = registro.agente;
    if (!rel.agente_usage[agente]) rel.agente_usage[agente] = { tarefas: 0, tokens: 0, custo_usd: 0 };
    rel.agente_usage[agente].tarefas++;
    rel.agente_usage[agente].tokens += registro.tokens.total;
    rel.agente_usage[agente].custo_usd += registro.custo.total_usd;
    
    const hora = new Date(registro.timestamp).getHours().toString().padStart(2, '0');
    if (!rel.tarefas_por_hora[hora]) rel.tarefas_por_hora[hora] = { tarefas: 0, tokens: 0 };
    rel.tarefas_por_hora[hora].tarefas++;
    rel.tarefas_por_hora[hora].tokens += registro.tokens.total;
    
    if (registro.otimizacoes_aplicadas && registro.otimizacoes_aplicadas.length > 0) {
      registro.otimizacoes_aplicadas.forEach(opt => {
        const existente = rel.otimizacoes_do_dia.find(o => o.tipo === opt.tipo);
        if (existente) {
          existente.vezes_aplicada++;
          existente.tokens_economizados += opt.economia_tokens || 0;
          existente.usd_economizados += opt.economia_usd || 0;
        } else {
          rel.otimizacoes_do_dia.push({ tipo: opt.tipo, vezes_aplicada: 1, tokens_economizados: opt.economia_tokens || 0, usd_economizados: opt.economia_usd || 0 });
        }
      });
    }
    
    rel.ultima_atualizacao = new Date().toISOString();
    salvarJSON(caminho, rel);
  }
  
  atualizarRelatorioSemanal(registro) {
    const data = new Date(registro.timestamp);
    const numSemana = this.getNumeroSemana(data);
    const ano = data.getFullYear();
    const caminho = path.join(RELATORIOS_PATH, 'semanal', `semana-${numSemana}-${ano}.json`);
    let rel = carregarJSON(caminho);
    
    if (!rel.resumo_semana) {
      const inicio = this.getDataInicioSemana(data);
      const fim = this.getDataFimSemana(data);
      rel = { semana: numSemana, ano, data_inicio: inicio.toISOString().split('T')[0], data_fim: fim.toISOString().split('T')[0],
        resumo_semana: { total_tarefas: 0, total_tokens: 0, custo_total_usd: 0, custo_total_brl: 0, tempo_total_horas: 0, economia_usd: 0, economia_percentual: '0%' },
        resumo_por_dia: {}, top_projetos: [], top_tarefas_mais_caras: [], otimizacoes_da_semana: [], comparacao_semana_anterior: { variacao_tokens: '0%', variacao_custo: '0%', variacao_economia: '0%' },
        tendencias: [], ultima_atualizacao: registro.timestamp };
    }
    
    rel.resumo_semana.total_tarefas++;
    rel.resumo_semana.total_tokens += registro.tokens.total;
    rel.resumo_semana.custo_total_usd += registro.custo.total_usd;
    rel.resumo_semana.custo_total_brl += registro.custo.total_brl;
    rel.resumo_semana.tempo_total_horas += registro.tempo.duracao_segundos / 3600;
    rel.resumo_semana.economia_usd += registro.economia.usd_economizados;
    
    const dataStr = registro.timestamp.split('T')[0];
    if (!rel.resumo_por_dia[dataStr]) rel.resumo_por_dia[dataStr] = { tarefas: 0, tokens: 0, custo_usd: 0 };
    rel.resumo_por_dia[dataStr].tarefas++;
    rel.resumo_por_dia[dataStr].tokens += registro.tokens.total;
    rel.resumo_por_dia[dataStr].custo_usd += registro.custo.total_usd;
    
    rel.ultima_atualizacao = new Date().toISOString();
    salvarJSON(caminho, rel);
  }
  
  atualizarRelatorioMensal(registro) {
    const data = new Date(registro.timestamp);
    const nomeMes = this.getNomeMes(data);
    const ano = data.getFullYear();
    const caminho = path.join(RELATORIOS_PATH, 'mensal', `${nomeMes}-${ano}.json`);
    let rel = carregarJSON(caminho);
    
    if (!rel.resumo_mes) {
      rel = { mes: nomeMes, ano, data_inicio: `${ano}-${(data.getMonth()+1).toString().padStart(2,'0')}-01`, data_fim: `${ano}-${(data.getMonth()+1).toString().padStart(2,'0')}-31`,
        resumo_mes: { total_tarefas: 0, total_tokens: 0, custo_total_usd: 0, custo_total_brl: 0, tempo_total_horas: 0, economia_usd: 0, economia_percentual: '0%' },
        resumo_por_semana: {}, distribuicao_por_modelo: {}, projecao_anual: { consumo_estimado_tokens: 0, custo_estimado_usd: 0, economia_estimada_usd: 0 },
        top_projetos: [], otimizacoes_do_mes: [], roi_otimizacoes: [], ultima_atualizacao: registro.timestamp };
    }
    
    rel.resumo_mes.total_tarefas++;
    rel.resumo_mes.total_tokens += registro.tokens.total;
    rel.resumo_mes.custo_total_usd += registro.custo.total_usd;
    rel.resumo_mes.custo_total_brl += registro.custo.total_brl;
    rel.resumo_mes.tempo_total_horas += registro.tempo.duracao_segundos / 3600;
    rel.resumo_mes.economia_usd += registro.economia.usd_economizados;
    
    const modelo = registro.modelo;
    if (!rel.distribuicao_por_modelo[modelo]) rel.distribuicao_por_modelo[modelo] = { tarefas: 0, tokens: 0, custo_usd: 0 };
    rel.distribuicao_por_modelo[modelo].tarefas++;
    rel.distribuicao_por_modelo[modelo].tokens += registro.tokens.total;
    rel.distribuicao_por_modelo[modelo].custo_usd += registro.custo.total_usd;
    
    rel.ultima_atualizacao = new Date().toISOString();
    salvarJSON(caminho, rel);
  }
  
  atualizarProjeto(registro) {
    const projeto = registro.projeto;
    const caminho = path.join(PROJETOS_PATH, `${projeto}.json`);
    let proj = carregarJSON(caminho);
    
    if (!proj.resumo) {
      proj = { projeto, data_criacao: new Date().toISOString(),
        resumo: { total_tarefas: 0, total_tokens_entrada: 0, total_tokens_saida: 0, total_tokens_geral: 0, custo_total_usd: 0, custo_total_brl: 0, tempo_total_segundos: 0, tempo_total_formatado: '0h 0min', economia_total_usd: 0, economia_total_percentual: '0%' },
        fases: { inicializacao: { tokens: 0, custo_usd: 0, percentual: '0%' }, configuracao: { tokens: 0, custo_usd: 0, percentual: '0%' }, desenvolvimento: { tokens: 0, custo_usd: 0, percentual: '0%' }, revisao: { tokens: 0, custo_usd: 0, percentual: '0%' } },
        tarefas: [], top_tarefas_mais_caras: [], gargalos: [], otimizacoes_especificas: [], ultima_atualizacao: registro.timestamp };
    }
    
    proj.resumo.total_tarefas++;
    proj.resumo.total_tokens_entrada += registro.tokens.entrada;
    proj.resumo.total_tokens_saida += registro.tokens.saida;
    proj.resumo.total_tokens_geral += registro.tokens.total;
    proj.resumo.custo_total_usd += registro.custo.total_usd;
    proj.resumo.custo_total_brl += registro.custo.total_brl;
    proj.resumo.tempo_total_segundos += registro.tempo.duracao_segundos;
    proj.resumo.tempo_total_formatado = formatarDuracao(proj.resumo.tempo_total_segundos);
    proj.resumo.economia_total_usd += registro.economia.usd_economizados;
    
    proj.tarefas.push({ id: registro.id, nome: registro.tarefa, agente: registro.agente, modelo: registro.modelo, tokens: registro.tokens.total, custo_usd: registro.custo.total_usd, duracao_segundos: registro.tempo.duracao_segundos, timestamp: registro.timestamp });
    proj.top_tarefas_mais_caras = proj.tarefas.sort((a,b) => b.custo_usd - a.custo_usd).slice(0, 10);
    
    proj.ultima_atualizacao = new Date().toISOString();
    salvarJSON(caminho, proj);
  }
  
  atualizarEconomiaAcumulada(registro) {
    const caminho = path.join(OTIMIZACOES_PATH, 'economia-acumulada.json');
    let eco = carregarJSON(caminho);
    
    if (!eco.total_economia_acumulada_usd) {
      eco = { total_economia_acumulada_usd: 0, total_economia_acumulada_brl: 0, total_tokens_economizados: 0,
        por_tipo_otimizacao: { contexto_comprimido: { vezes_aplicada: 0, tokens_economizados: 0, usd_economizados: 0 }, modelo_adequado: { vezes_aplicada: 0, tokens_economizados: 0, usd_economizados: 0 }, prompt_reutilizado: { vezes_aplicada: 0, tokens_economizados: 0, usd_economizados: 0 }, instrucoes_enxutas: { vezes_aplicada: 0, tokens_economizados: 0, usd_economizados: 0 }, cache_contexto: { vezes_aplicada: 0, tokens_economizados: 0, usd_economizados: 0 } },
        historico_economia: [], projecao_anual: { economia_estimada_usd: 0, economia_estimada_brl: 0, tokens_estimados_economizados: 0 }, ultima_atualizacao: registro.timestamp };
    }
    
    eco.total_economia_acumulada_usd += registro.economia.usd_economizados;
    eco.total_economia_acumulada_brl += registro.economia.usd_economizados * (this.config.configuracoes?.taxa_cambio_brl_usd || 5.45);
    eco.total_tokens_economizados += registro.economia.tokens_economizados;
    
    if (registro.otimizacoes_aplicadas && Array.isArray(registro.otimizacoes_aplicadas)) {
      registro.otimizacoes_aplicadas.forEach(opt => {
        const tipo = opt.tipo;
        if (eco.por_tipo_otimizacao[tipo]) {
          eco.por_tipo_otimizacao[tipo].vezes_aplicada++;
          eco.por_tipo_otimizacao[tipo].tokens_economizados += opt.economia_tokens || 0;
          eco.por_tipo_otimizacao[tipo].usd_economizados += opt.economia_usd || 0;
        }
      });
    }
    
    eco.historico_economia.push({ data: registro.timestamp, tarefa: registro.tarefa, economia_usd: registro.economia.usd_economizados, economia_tokens: registro.economia.tokens_economizados });
    if (eco.historico_economia.length > 1000) eco.historico_economia = eco.historico_economia.slice(-1000);
    
    eco.ultima_atualizacao = new Date().toISOString();
    salvarJSON(caminho, eco);
  }
  
  verificarAlertas(registro) {
    const alertas = this.config.configuracoes?.alertas || {};
    const dataHoje = registro.timestamp.split('T')[0];
    const registrosHoje = this.registroGlobal.registros.filter(r => r.timestamp.startsWith(dataHoje));
    const custoDiario = registrosHoje.reduce((sum, r) => sum + r.custo.total_usd, 0);
    
    if (alertas.custo_diario_maximo_usd && custoDiario > alertas.custo_diario_maximo_usd) {
      console.warn(`\n⚠️ ALERTA: Custo diário ($${custoDiario.toFixed(2)}) excedeu limite de $${alertas.custo_diario_maximo_usd}\n`);
      if (!this.registroGlobal.alertas_disparados) this.registroGlobal.alertas_disparados = [];
      this.registroGlobal.alertas_disparados.push({ tipo: 'custo_diario_excedido', data: registro.timestamp, valor: custoDiario, limite: alertas.custo_diario_maximo_usd });
    }
  }
  
  exibirResumo(registro) {
    console.log('═'.repeat(60));
    console.log('📊 TOKEN CAPTURE — RESUMO DA INTERAÇÃO');
    console.log('═'.repeat(60));
    console.log(`ID:        ${registro.id}`);
    console.log(`Projeto:   ${registro.projeto}`);
    console.log(`Tarefa:    ${registro.tarefa}`);
    console.log(`Agente:    ${registro.agente}`);
    console.log(`Modelo:    ${registro.modelo}`);
    console.log('─'.repeat(60));
    console.log(`📝 Tokens Entrada:  ${registro.tokens.entrada.toLocaleString()}`);
    console.log(`📤 Tokens Saída:    ${registro.tokens.saida.toLocaleString()}`);
    console.log(`📊 Total Tokens:    ${registro.tokens.total.toLocaleString()}`);
    console.log('─'.repeat(60));
    console.log(`💰 Custo Entrada:   $${registro.custo.entrada_usd.toFixed(4)} (R$ ${registro.custo.entrada_brl.toFixed(2)})`);
    console.log(`💰 Custo Saída:     $${registro.custo.saida_usd.toFixed(4)} (R$ ${registro.custo.saida_brl.toFixed(2)})`);
    console.log(`💰 Custo Total:     $${registro.custo.total_usd.toFixed(4)} (R$ ${registro.custo.total_brl.toFixed(2)})`);
    console.log('─'.repeat(60));
    console.log(`⏱️  Duração:         ${registro.tempo.duracao_formatada}`);
    console.log(`🛠️  Otimizações:     ${registro.otimizacoes_aplicadas.length}`);
    console.log(`💵 Economia:        $${registro.economia.usd_economizados.toFixed(4)} (${registro.economia.tokens_economizados.toLocaleString()} tokens)`);
    console.log('═'.repeat(60));
    console.log('✅ Registro salvo com sucesso!\n');
  }
  
  getNumeroSemana(data) {
    const inicioAno = new Date(data.getFullYear(), 0, 1);
    const dias = Math.floor((data - inicioAno) / (24 * 60 * 60 * 1000));
    return Math.ceil((dias + inicioAno.getDay() + 1) / 7);
  }
  
  getNomeMes(data) {
    const meses = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return meses[data.getMonth()];
  }
  
  getDataInicioSemana(data) {
    const dia = data.getDay();
    const diff = data.getDate() - dia + (dia === 0 ? -6 : 1);
    return new Date(data.setDate(diff));
  }
  
  getDataFimSemana(data) {
    const inicio = this.getDataInicioSemana(new Date(data));
    return new Date(inicio.setDate(inicio.getDate() + 6));
  }
  
  gerarRelatorio(tipo, filtro) {
    console.log(`\n📊 Gerando relatório ${tipo}...\n`);
    switch (tipo) {
      case 'diario':
        const data = filtro || new Date().toISOString().split('T')[0];
        return carregarJSON(path.join(RELATORIOS_PATH, 'diario', `${data}.json`));
      case 'semanal':
        const numSemana = filtro || this.getNumeroSemana(new Date());
        const ano = new Date().getFullYear();
        return carregarJSON(path.join(RELATORIOS_PATH, 'semanal', `semana-${numSemana}-${ano}.json`));
      case 'mensal':
        const mes = filtro || this.getNomeMes(new Date());
        const anoMes = new Date().getFullYear();
        return carregarJSON(path.join(RELATORIOS_PATH, 'mensal', `${mes}-${anoMes}.json`));
      case 'projeto':
        if (!filtro) { console.error('❌ Nome do projeto é obrigatório'); return null; }
        return carregarJSON(path.join(PROJETOS_PATH, `${filtro}.json`));
      default:
        console.error('❌ Tipo inválido. Use: diario, semanal, mensal, projeto');
        return null;
    }
  }
}

module.exports = TokenCapture;

// ==================== CLI ====================

if (require.main === module) {
  const args = process.argv.slice(2);
  const capture = new TokenCapture();
  
  const getArg = (name) => {
    const idx = args.indexOf(name);
    return idx !== -1 ? args[idx + 1] : null;
  };
  
  const projeto = getArg('--projeto');
  const tarefa = getArg('--tarefa');
  const modelo = getArg('--modelo') || 'claude-sonnet-4-20250514';
  const agente = getArg('--agente') || 'tech-lead';
  const prompt = getArg('--prompt') || '';
  const resposta = getArg('--resposta') || '';
  const duracao = parseInt(getArg('--duracao') || '0', 10);
  
  if (!projeto || !tarefa) {
    console.log('\n📊 TOKEN CAPTURE — Uso\n');
    console.log('Use: node token-capture.js --projeto NOME --tarefa "DESCRICAO" [opcoes]');
    console.log('\nOpções:');
    console.log('  --projeto <nome>      Nome do projeto (obrigatório)');
    console.log('  --tarefa <descricao>  Descrição da tarefa (obrigatório)');
    console.log('  --modelo <modelo>     Modelo LLM (padrão: claude-sonnet-4-20250514)');
    console.log('  --agente <agente>     Agente responsável (padrão: tech-lead)');
    console.log('  --prompt <texto>      Prompt de entrada (opcional)');
    console.log('  --resposta <texto>    Resposta da IA (opcional)');
    console.log('  --duracao <segundos>  Duração em segundos (opcional)');
    console.log('\nExemplo:');
    console.log('  node token-capture.js --projeto POLYMARKETING --tarefa "Criar TECH-LEAD.md" --modelo claude-sonnet --duracao 300');
    console.log('\n');
    process.exit(0);
  }
  
  const registro = capture.registrarInteracao({
    projeto, tarefa, modelo, agente, prompt, resposta, duracao_segundos: duracao,
    inicio: Date.now() - (duracao * 1000), fim: Date.now()
  });
  
  console.log('\n💡 Dica: Para registro automático via API, integre este script com seu fluxo.\n');
  console.log('📁 Arquivos atualizados:');
  console.log(`   - ${REGISTRO_GLOBAL_PATH}`);
  console.log(`   - ${path.join(PROJETOS_PATH, `${projeto}.json`)}`);
  console.log(`   - ${path.join(RELATORIOS_PATH, 'diario', `${new Date().toISOString().split('T')[0]}.json`)}`);
  console.log('\n');
}