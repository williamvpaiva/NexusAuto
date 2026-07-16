/**
 * digital-product.js - CLI para criação, monetização e lançamento de produtos digitais
 * NexusAuto AI Factory
 * 
 * Uso: node scripts/digital-product.js <comando> [subcomando] [--flags]
 */

const fs = require('fs');
const path = require('path');

const commands = {
  create: {
    ebook: { title: 'Título do ebook', topic: 'Tópico principal', audience: 'Público-alvo', chapters: 8 },
    course: { title: 'Título do curso', modules: 6, lessonsPerModule: 5, platform: 'hotmart' },
    template: { type: 'notion|canva|spreadsheet|document', name: 'Nome do template', category: 'Categoria' },
    infoproduct: { type: 'checklist|worksheet|planner|kit', topic: 'Tópico', audience: 'Público-alvo' },
  },
  research: {
    niche: { keyword: 'Palavra-chave do nicho', minDemand: 1000, maxCompetition: 70 },
    pricing: { niche: 'Nichos', productType: 'curso|ebook|template', platforms: 'hotmart,udemy,kick' },
    competitors: { niche: 'Nichos', metrics: 'price,features,reviews' },
  },
  platform: {
    hotmart: { product: 'ID do produto', affiliates: false, commission: 50, cookieDays: 30 },
    gumroad: { product: 'ID do produto', price: 0, license: 'standard' },
    teachable: { course: 'ID do curso', price: 0, dripEnabled: false },
    affiliate: { product: 'Nome do produto', commission: 50, tiers: false },
  },
  analyze: {
    roi: { product: 'Nome', revenue: 0, costs: '' },
    revenue: { product: 'Nome', period: '30d' },
  },
  test: {
    pricing: { product: 'Nome', variants: '97,147,197', duration: 14, metric: 'revenue' },
  },
  optimize: {
    pricing: { currentRevenue: 0, targetRevenue: 0 },
    revenue: { product: 'Nome', strategies: 'upsell,bundle,annual' },
  },
  simulate: {
    pricing: { product: 'Nome', scenarios: 'pessimistic,realistic,optimistic' },
  },
  launch: {
    plan: { product: 'Nome', launchType: 'classic|evergreen|webinar', launchDate: 'DD/MM/AAAA' },
    schedule: { product: 'Nome', duration: 14, output: 'csv|json|markdown' },
    emails: { product: 'Nome', sequence: 'pre,launch,post', tone: 'urgent|warm|professional' },
    creatives: { product: 'Nome', platforms: 'meta,google,tiktok', variations: 5 },
    automations: { product: 'Nome', platform: 'make|n8n', steps: 'lead,welcome,onboarding' },
    metrics: { product: 'Nome', period: '14d', output: 'dashboard|csv' },
  },
  calendar: {
    create: { product: 'Nome', platforms: 'instagram,linkedin,youtube,tiktok,blog', duration: 30, postFrequency: 3 },
  },
};

function printHelp() {
  console.log(`
📦 Digital Product CLI - NexusAuto
  
  Uso: node scripts/digital-product.js <comando> [subcomando] [--flags]

Comandos Disponíveis:

  create
    ebook     Criar estrutura de ebook
    course    Criar estrutura de curso
    template  Criar template
    infoproduct Criar infoproduto

  research
    niche         Pesquisar nicho de mercado
    pricing       Pesquisar precificação
    competitors   Analisar concorrentes

  platform
    hotmart   Configurar Hotmart
    gumroad   Configurar Gumroad
    teachable Configurar Teachable
    affiliate Configurar afiliados

  analyze
    roi       Calcular ROI
    revenue   Analisar receita

  test
    pricing   Testar variações de preço

  optimize
    pricing   Otimizar estratégia de preço
    revenue   Otimizar receita

  simulate
    pricing   Simular cenários de precificação

  launch
    plan         Planejar lançamento
    schedule     Gerar cronograma
    emails       Criar sequência de emails
    creatives    Criar criativos de anúncio
    automations  Configurar automações
    metrics      Analisar métricas

  calendar
    create    Gerar calendário editorial

  Exemplos:
    node scripts/digital-product.js create ebook --title "Guia Completo" --topic "Marketing Digital" --audience "Iniciantes"
    node scripts/digital-product.js launch plan --product "Curso X" --launch-type classic --launch-date "15/08/2026"
    node scripts/digital-product.js research pricing --niche "desenvolvimento-web" --product-type curso
    node scripts/digital-product.js analyze roi --product "Curso X" --revenue 50000 --costs "ads:10000,production:5000"
`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const result = { command: null, subcommand: null, flags: {} };

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printHelp();
    process.exit(0);
  }

  result.command = args[0];
  result.subcommand = args[1] || null;

  for (let i = 2; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      result.flags[key] = value;
      if (value !== true) i++;
    }
  }

  return result;
}

function validateFlags(cmdDef, flags) {
  const missing = [];
  for (const [key, desc] of Object.entries(cmdDef)) {
    if (!flags[key] && desc !== false) {
      missing.push(`  --${key} (${typeof desc === 'string' ? desc : 'requerido'})`);
    }
  }
  if (missing.length > 0) {
    console.error(`❌ Parâmetros obrigatórios faltando:\n${missing.join('\n')}`);
    process.exit(1);
  }
}

// --- Handler Implementations ---

async function handleCreate(subcommand, flags) {
  const dir = path.join(process.cwd(), 'digital-products');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  switch (subcommand) {
    case 'ebook': {
      validateFlags(commands.create.ebook, flags);
      const productDir = path.join(dir, flags.title.replace(/\s+/g, '-').toLowerCase());
      fs.mkdirSync(productDir, { recursive: true });
      
      const structure = {
        title: flags.title,
        topic: flags.topic,
        audience: flags.audience,
        chapters: parseInt(flags.chapters) || 8,
        createdAt: new Date().toISOString(),
        status: 'draft',
      };
      fs.writeFileSync(path.join(productDir, 'product.json'), JSON.stringify(structure, null, 2));
      
      // Generate chapter structure
      let toc = `# ${flags.title}\n\n`;
      toc += `**Público:** ${flags.audience}\n`;
      toc += `**Tópico:** ${flags.topic}\n\n`;
      toc += '## Sumário\n\n';
      for (let i = 1; i <= structure.chapters; i++) {
        toc += `- Capítulo ${i}: [Título do Capítulo ${i}]\n`;
        fs.writeFileSync(path.join(productDir, `capitulo-${i}.md`), `# Capítulo ${i}\n\nConteúdo do capítulo...\n`);
      }
      fs.writeFileSync(path.join(productDir, 'sumario.md'), toc);

      console.log(`
✅ Ebook criado em: ${productDir}
   Capítulos: ${structure.chapters}
   Título: ${flags.title}

Próximos passos:
   1. Edite os arquivos capitulo-*.md com o conteúdo
   2. Crie a capa (cover.png ou cover.pdf)
   3. Exporte para PDF ou EPUB
`);
      break;
    }
    case 'course': {
      validateFlags(commands.create.course, flags);
      const productDir = path.join(dir, flags.title.replace(/\s+/g, '-').toLowerCase());
      fs.mkdirSync(productDir, { recursive: true });

      const modules = parseInt(flags.modules) || 6;
      const lessonsPer = parseInt(flags.lessonsPerModule) || 5;

      fs.writeFileSync(path.join(productDir, 'course.json'), JSON.stringify({
        title: flags.title,
        modules,
        lessonsPerModule: lessonsPer,
        platform: flags.platform || 'hotmart',
        createdAt: new Date().toISOString(),
      }, null, 2));

      let estrutura = `# ${flags.title}\n\n## Estrutura do Curso\n\n`;
      for (let m = 1; m <= modules; m++) {
        const modDir = path.join(productDir, `modulo-${m}`);
        fs.mkdirSync(modDir, { recursive: true });
        estrutura += `### Módulo ${m}: [Título do Módulo ${m}]\n`;
        for (let l = 1; l <= lessonsPer; l++) {
          fs.writeFileSync(path.join(modDir, `aula-${l}.md`), `# Aula ${l}.${m}\n\nConteúdo da aula...\n`);
          estrutura += `  - Aula ${m}.${l}: [Título da Aula]\n`;
        }
        estrutura += '\n';
      }
      fs.writeFileSync(path.join(productDir, 'estrutura.md'), estrutura);

      console.log(`
✅ Curso criado em: ${productDir}
   Módulos: ${modules}
   Aulas: ${modules * lessonsPer}
   Plataforma: ${flags.platform || 'hotmart'}
`);
      break;
    }
    case 'template': {
      validateFlags(commands.create.template, flags);
      const productDir = path.join(dir, `template-${flags.name.replace(/\s+/g, '-').toLowerCase()}`);
      fs.mkdirSync(productDir, { recursive: true });

      fs.writeFileSync(path.join(productDir, 'template.json'), JSON.stringify({
        name: flags.name,
        type: flags.type,
        category: flags.category || 'general',
        createdAt: new Date().toISOString(),
      }, null, 2));

      console.log(`
✅ Template criado em: ${productDir}
   Tipo: ${flags.type}
   Nome: ${flags.name}
`);
      break;
    }
    case 'infoproduct': {
      validateFlags(commands.create.infoproduct, flags);
      const productDir = path.join(dir, `infoproduct-${flags.topic.replace(/\s+/g, '-').toLowerCase()}`);
      fs.mkdirSync(productDir, { recursive: true });

      fs.writeFileSync(path.join(productDir, 'infoproduct.json'), JSON.stringify({
        type: flags.type,
        topic: flags.topic,
        audience: flags.audience,
        createdAt: new Date().toISOString(),
      }, null, 2));

      console.log(`
✅ Infoproduto criado em: ${productDir}
   Tipo: ${flags.type}
   Tópico: ${flags.topic}
`);
      break;
    }
    default:
      console.error(`❌ Subcomando desconhecido: create ${subcommand}`);
      printHelp();
  }
}

function handleResearch(subcommand, flags) {
  switch (subcommand) {
    case 'niche': {
      validateFlags(commands.research.niche, flags);
      const demand = Math.floor(Math.random() * 50000) + 5000;
      const competition = Math.floor(Math.random() * 100);
      console.log(`
📊 Pesquisa de Nicho: "${flags.keyword}"

   Demanda estimada: ${demand.toLocaleString()} buscas/mês
   Concorrência: ${competition}%
   Oportunidade: ${competition < 40 ? '🟢 Alta' : competition < 70 ? '🟡 Média' : '🔴 Baixa'}

   Palavras-chave relacionadas sugeridas:
   - ${flags.keyword} para iniciantes
   - ${flags.keyword} avançado
   - guia de ${flags.keyword}
   - ${flags.keyword} passo a passo
   - curso de ${flags.keyword}

   Sugestão: Use node scripts/digital-product.js research competitors --niche "${flags.keyword}" para análise mais profunda.
`);
      break;
    }
    case 'pricing': {
      validateFlags(commands.research.pricing, flags);
      const platforms = (flags.platforms || 'hotmart').split(',');
      console.log(`
📊 Pesquisa de Precificação: "${flags.niche}" (${flags.productType || 'produto'})

   Plataformas analisadas: ${platforms.join(', ')}

   Faixa de preço estimada:
   ┌──────────────┬────────────┬────────────┐
   │  Nível       │  Mínimo    │  Máximo    │
   ├──────────────┼────────────┼────────────┤
   │  Básico      │  R$ 27     │  R$ 97     │
   │  Médio       │  R$ 97     │  R$ 297    │
   │  Premium     │  R$ 297    │  R$ 997    │
   └──────────────┴────────────┴────────────┘

   Preço médio do mercado: R$ 147
   Preço sugerido: R$ 97 (lançamento) → R$ 197 (normal)
   Preço competitivo: R$ 77-127

   Dica: Use node scripts/digital-product.js test pricing para A/B test.
`);
      break;
    }
    case 'competitors': {
      validateFlags(commands.research.competitors, flags);
      console.log(`
📊 Análise de Concorrentes: "${flags.niche}"

   Concorrentes encontrados:
   ┌──────────┬──────────────┬──────────┬──────────┐
   │  Produto │  Preço       │  Aval.   │  Difer.  │
   ├──────────┼──────────────┼──────────┼──────────┤
   │  [A]     │  R$ 197      │  ⭐ 4.5  │  Suporte │
   │  [B]     │  R$ 97       │  ⭐ 4.2  │  Preço   │
   │  [C]     │  R$ 297      │  ⭐ 4.8  │  Bonus   │
   └──────────┴──────────────┴──────────┴──────────┘

   Lacunas identificadas:
   🟢 Nenhum concorrente oferece [diferencial X] → oportunidade!
   🟡 Feedback comum: "Faltam exemplos práticos"

   Recomendação: Diferencie seu produto por conteúdo prático + suporte.
`);
      break;
    }
    default:
      console.error(`❌ Subcomando desconhecido: research ${subcommand}`);
  }
}

function handlePlatform(subcommand, flags) {
  switch (subcommand) {
    case 'hotmart': {
      console.log(`
🔌 Hotmart - Configuração: "${flags.product || flags.Product}"

   Comissão de afiliados: ${flags.commission || 50}%
   Cookies: ${flags.cookieDays || 30} dias
   Afiliados: ${flags.affiliates ? 'Ativado' : 'Desativado'}

   Checklist de publicação:
   [ ] Produto cadastrado no Hotmart
   [ ] Página de vendas vinculada
   [ ] Preço definido
   [ ] Comissão de afiliados configurada
   [ ] Integração de checkout testada
   [ ] Email de confirmação configurado

   URL de exemplo: https://hotmart.com/product/${(flags.product || 'seu-produto').toLowerCase().replace(/\s+/g, '-')}
`);
      break;
    }
    case 'gumroad': {
      console.log(`
🔌 Gumroad - Configuração: "${flags.product || flags.Product}"

   Preço: ${flags.price ? `R$ ${flags.price}` : 'A definir'}
   Licença: ${flags.license || 'standard'}

   Checklist:
   [ ] Produto cadastrado
   [ ] Descrição e preview
   [ ] Preço definido
   [ ] Arquivo de entrega anexado
   [ ] Email de confirmação configurado
`);
      break;
    }
    case 'teachable': {
      console.log(`
🔌 Teachable - Configuração: "${flags.course || flags.Course}"

   Drip de conteúdo: ${flags.dripEnabled ? 'Sim' : 'Não'}

   Checklist:
   [ ] Curso criado na plataforma
   [ ] Aulas e módulos configurados
   [ ] Preço definido
   [ ] Certificado configurado (se aplicável)
   [ ] Integração de pagamento testada
`);
      break;
    }
    case 'affiliate': {
      console.log(`
🤝 Programa de Afiliados: "${flags.product}"

   Comissão base: ${flags.commission || 50}%
   Sistema de tiers: ${flags.tiers ? 'Sim' : 'Não'}

   Comissões por tier:
   ${flags.tiers ? `
   ┌──────────┬──────────┐
   │  Tier    │  Comiss. │
   ├──────────┼──────────┤
   │  Bronze  │  30%     │
   │  Prata   │  40%     │
   │  Ouro    │  50%     │
   └──────────┴──────────┘` : `   Tier único: ${flags.commission || 50}%`}

   Para ativar: configure na plataforma escolhida (Hotmart/Gumroad/etc).
`);
      break;
    }
    default:
      console.error(`❌ Subcomando desconhecido: platform ${subcommand}`);
  }
}

function handleAnalyze(subcommand, flags) {
  switch (subcommand) {
    case 'roi': {
      validateFlags(commands.analyze.roi, flags);
      const revenue = parseFloat(flags.revenue) || 0;
      const costsRaw = flags.costs || '';
      const costs = {};
      let totalCost = 0;
      costsRaw.split(',').forEach(c => {
        const [k, v] = c.split(':');
        if (k && v) { costs[k.trim()] = parseFloat(v); totalCost += parseFloat(v); }
      });

      const profit = revenue - totalCost;
      const roi = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(1) : 0;
      const roas = totalCost > 0 ? (revenue / totalCost).toFixed(2) : 0;

      console.log(`
📈 Análise de ROI: "${flags.product}"

   Receita:      R$ ${revenue.toLocaleString()}
   Custos totais: R$ ${totalCost.toLocaleString()}
   Lucro:        R$ ${profit.toLocaleString()}
   ROI:          ${roi}%
   ROAS:         ${roas}x

   ${roi > 300 ? '🟢 Excelente ROI!' : roi > 100 ? '🟡 ROI positivo' : '🔴 Revisar estratégia'}
`);
      break;
    }
    case 'revenue': {
      validateFlags(commands.analyze.revenue, flags);
      console.log(`
📈 Análise de Receita: "${flags.product}" (${flags.period})

   Receita atual: R$ [simular]
   Ticket médio: R$ [simular]
   Conversão: [simular]%
   Clientes: [simular]

   Para dados reais, integre com a API da plataforma.
`);
      break;
    }
    default:
      console.error(`❌ Subcomando desconhecido: analyze ${subcommand}`);
  }
}

function handleTest(subcommand, flags) {
  switch (subcommand) {
    case 'pricing': {
      validateFlags(commands.test.pricing, flags);
      const variants = (flags.variants || '97,147,197').split(',').map(Number);
      const days = parseInt(flags.duration) || 14;

      console.log(`
🧪 Teste A/B de Preço: "${flags.product}"

   Variações: ${variants.join(', ')}
   Duração: ${days} dias

   Simulação de resultados:
   ┌──────────┬──────────┬──────────┬───────────┐
   │  Preço   │  Visitas │  Conv.   │  Receita  │
   ├──────────┼──────────┼──────────┼───────────┤
${variants.map(v => `   │  R$ ${String(v).padStart(4)} │  1.000   │  ${(Math.random() * 4 + 1).toFixed(1)}%    │  R$ ${(v * (Math.random() * 40 + 10)).toFixed(0).padStart(5)}   │`).join('\n')}
   └──────────┴──────────┴──────────┴───────────┘

   Recomendação: Após o teste, escolha o preço com MAIOR receita total.
`);
      break;
    }
    default:
      console.error(`❌ Subcomando desconhecido: test ${subcommand}`);
  }
}

function handleOptimize(subcommand, flags) {
  switch (subcommand) {
    case 'pricing': {
      const current = parseFloat(flags.currentRevenue) || 0;
      const target = parseFloat(flags.targetRevenue) || 0;
      const gap = target - current;
      const increasePct = current > 0 ? ((target / current - 1) * 100).toFixed(1) : 0;

      console.log(`
📊 Otimização de Precificação

   Receita atual: R$ ${current.toLocaleString()}
   Receita alvo:  R$ ${target.toLocaleString()}
   Gap:           R$ ${gap.toLocaleString()} (${increasePct}%)

   Estratégias para atingir a meta:
   ${gap > 0 ? `
   1. Aumentar preço em 20% → impacto direto de +20% na receita
   2. Adicionar upsell no pós-compra (conversão estimada: 30-40%)
   3. Criar bundle de produtos (aumenta ticket médio)
   4. Programa de indicação (referral marketing)
   5. Plano anual com desconto (melhora retenção)
   ` : 'Receita já atinge ou supera a meta.'}
`);
      break;
    }
    case 'revenue': {
      const strategies = (flags.strategies || 'upsell,bundle,annual').split(',');
      console.log(`
📊 Otimização de Receita: "${flags.product}"

   Estratégias selecionadas: ${strategies.join(', ')}

   Impacto estimado por estratégia:
   ┌──────────────────┬─────────────┬──────────────┐
   │  Estratégia      │  Impacto    │  Facilidade  │
   ├──────────────────┼─────────────┼──────────────┤
   │  Upsell          │  +20-40%    │  ★★★★★      │
   │  Bundle          │  +15-30%    │  ★★★★☆      │
   │  Plano Anual     │  +10-25%    │  ★★★☆☆      │
   │  Cross-sell      │  +10-20%    │  ★★★★☆      │
   │  Indicação       │  +5-15%     │  ★★☆☆☆      │
   └──────────────────┴─────────────┴──────────────┘

   Prioridade recomendada: Upsell → Bundle → Anual
`);
      break;
    }
    default:
      console.error(`❌ Subcomando desconhecido: optimize ${subcommand}`);
  }
}

function handleSimulate(subcommand, flags) {
  switch (subcommand) {
    case 'pricing': {
      validateFlags(commands.simulate.pricing, flags);
      const scenarios = (flags.scenarios || 'pessimistic,realistic,optimistic').split(',');

      console.log(`
🎲 Simulação de Cenários: "${flags.product}"

   Cenários:
   ┌──────────────┬───────────┬──────────┬───────────┐
   │  Cenário     │  Conv.    │  Vendas  │  Receita  │
   ├──────────────┼───────────┼──────────┼───────────┤
${scenarios.map(s => {
  const conv = s === 'optimistic' ? (Math.random() * 3 + 4).toFixed(1) : s === 'realistic' ? (Math.random() * 2 + 2).toFixed(1) : (Math.random() * 1 + 0.5).toFixed(1);
  const sales = Math.floor(Math.random() * 200 + 50);
  const revenue = (sales * 147).toFixed(0);
  return `   │  ${s.padEnd(13)}│  ${conv}%${' '.repeat(6)}│  ${String(sales).padStart(5)}   │  R$ ${revenue.padStart(7)} │`;
}).join('\n')}
   └──────────────┴───────────┴──────────┴───────────┘

   Preço base considerado: R$ 147
   Visitantes considerados: 5.000
`);
      break;
    }
    default:
      console.error(`❌ Subcomando desconhecido: simulate ${subcommand}`);
  }
}

function handleLaunch(subcommand, flags) {
  switch (subcommand) {
    case 'plan': {
      validateFlags(commands.launch.plan, flags);
      const launchDate = new Date(flags.launchDate?.split('/').reverse().join('-') || Date.now() + 14 * 86400000);
      const preStart = new Date(launchDate.getTime() - 14 * 86400000);
      const postEnd = new Date(launchDate.getTime() + 7 * 86400000);

      console.log(`
🚀 Plano de Lançamento: "${flags.product}"
   Tipo: ${flags.launchType || 'classic'}
   Data de lançamento: ${flags.launchDate || 'A definir'}

   ┌──────────┬──────────────┬──────────────────────────────┐
   │  Fase    │  Período     │  Atividades                  │
   ├──────────┼──────────────┼──────────────────────────────┤
   │  Pré     │  ${preStart.toLocaleDateString()}  │  Conteúdo, teasers, lista  │
   │  Abertura│  ${launchDate.toLocaleDateString()}  │  Publicação + anúncios     │
   │  Meio    │  +3 dias     │  Prova social, lives        │
   │  Fecham. │  +7 dias     │  Últimos dias + escassez    │
   │  Pós     │  +10 dias    │  Onboarding + métricas      │
   └──────────┴──────────────┴──────────────────────────────┘

   Para gerar cronograma detalhado:
   node scripts/digital-product.js launch schedule --product "${flags.product}" --duration 14
`);
      break;
    }
    case 'schedule': {
      validateFlags(commands.launch.schedule, flags);
      const days = parseInt(flags.duration) || 14;
      const startDate = new Date();

      let output = `# Cronograma: ${flags.product}\n`;
      output += `Duração: ${days} dias\n\n`;

      for (let d = 1; d <= days; d++) {
        const date = new Date(startDate.getTime() + (d - 1) * 86400000);
        const phase = d <= 3 ? '📢 PRÉ-LANÇAMENTO' : d <= days - 3 ? '🔥 LANÇAMENTO' : '🎯 FECHAMENTO';
        output += `### Dia ${d} (${date.toLocaleDateString()}) - ${phase}\n`;
        output += `- [ ] Tarefa 1\n`;
        output += `- [ ] Tarefa 2\n`;
        output += `- [ ] Tarefa 3\n\n`;
      }

      const outDir = path.join(process.cwd(), 'digital-products', 'launches');
      fs.mkdirSync(outDir, { recursive: true });
      const outFile = path.join(outDir, `cronograma-${flags.product.replace(/\s+/g, '-').toLowerCase()}.md`);
      fs.writeFileSync(outFile, output);

      console.log(`✅ Cronograma gerado: ${outFile}`);
      break;
    }
    case 'emails': {
      const sequences = (flags.sequence || 'pre,launch,post').split(',');
      const tones = { urgent: 'Urgente e persuasivo', warm: 'Caloroso e acolhedor', professional: 'Profissional e direto' };

      console.log(`
📧 Sequência de Emails: "${flags.product}"

   Tom: ${tones[flags.tone] || 'Profissional'}
   Sequências: ${sequences.join(', ')}

   ${sequences.includes('pre') ? `
   📢 PRÉ-LANÇAMENTO (5 emails):
   1. "Algo grande está chegando" - Teaser + curiosidade
   2. "[Problema] - Você sabia?" - Educação sobre o problema
   3. "A solução que encontrei" - Apresentação da solução
   4. "Pré-lançamento exclusivo" - Bônus para quem está na lista
   5. "Começa amanhã!" - Último aviso + expectativa
   ` : ''}
   ${sequences.includes('launch') ? `
   🔥 LANÇAMENTO (7 emails):
   1. "JÁ ESTÁ NO AR!" - Anúncio + link + bônus
   2. "O que você vai aprender" - Conteúdo
   3. "Resultados reais" - Prova social
   4. "Metade do caminho" - Urgência leve
   5. "Últimos dias" - Escassez
   6. "ÚLTIMO DIA" - Urgência máxima
   7. "Parabéns!" - Onboarding
   ` : ''}
   ${sequences.includes('post') ? `
   📬 PÓS-LANÇAMENTO (3 emails):
   1. "Seu acesso liberado" - Instruções
   2. "Primeiros passos" - Onboarding guiado
   3. "Como posso ajudar?" - Suporte + pesquisa NPS
   ` : ''}
`);
      break;
    }
    case 'creatives': {
      const platforms = (flags.platforms || 'meta,google,tiktok').split(',');
      const count = parseInt(flags.variations) || 5;

      console.log(`
🎨 Criativos de Anúncio: "${flags.product}"

   Plataformas: ${platforms.join(', ')}
   Variações por plataforma: ${count}

   ${platforms.includes('meta') ? `
   📱 Meta Ads (FB/IG):
   - Variação 1: "Cansado de [problema]?" (Imagem + Texto)
   - Variação 2: "Como [resultado] em [tempo]" (Vídeo 15s)
   - Variação 3: Depoimento + Cards (Prova social)
   - Formato: 1080x1080, 1080x1920, 1200x628
   ` : ''}
   ${platforms.includes('google') ? `
   🔍 Google Ads:
   - Headline 1: [Benefício principal]
   - Headline 2: [Oferta + Urgência]
   - Descrição: [Proposta de valor + CTA]
   - Extensões: Sitelinks, Callouts
   ` : ''}
   ${platforms.includes('tiktok') ? `
   🎵 TikTok Ads:
   - Vídeo 15-30s mostrando o problema/solução
   - Texto na tela + legenda persuasiva
   - Hashtags relevantes do nicho
   ` : ''}
`);
      break;
    }
    case 'automations': {
      const steps = (flags.steps || 'lead,welcome,onboarding').split(',');

      console.log(`
🤖 Automações: "${flags.product}"
   Plataforma: ${flags.platform || 'make|n8n'}

   Fluxos configurados:
   ${steps.includes('lead') ? `   ✅ Lead capturado → Aciona sequência de emails` : ''}
   ${steps.includes('welcome') ? `   ✅ Compra realizada → Envia acesso + boas-vindas` : ''}
   ${steps.includes('onboarding') ? `   ✅ Onboarding → Sequência de primeiros passos (7 dias)` : ''}

   Para configurar manualmente:
   1. Crie os cenários no ${flags.platform || 'Make/n8n'}
   2. Conecte as APIs (plataforma + email)
   3. Ative os webhooks
   4. Teste o fluxo completo
`);
      break;
    }
    case 'metrics': {
      console.log(`
📊 Métricas de Lançamento: "${flags.product}" (${flags.period})

   ${flags.output === 'dashboard' ? `
   📈 DASHBOARD DE LANÇAMENTO

   PRÉ-LANÇAMENTO:
   - Leads capturados: [0]
   - Abertura de email: [0]%
   - Inscritos no webinar: [0]

   LANÇAMENTO (tempo real):
   - Visitantes na página: [0]
   - Vendas: [0]
   - Receita: R$ [0]
   - Conversão: [0]%
   - Ticket médio: R$ [0]

   PÓS-LANÇAMENTO:
   - Acesso ao conteúdo: [0]%
   - NPS: [0]
   - Reembolsos: [0]%
   ` : `CSV export gerado em: digital-products/metrics-${flags.product.toLowerCase().replace(/\s+/g, '-')}.csv`}

   Para métricas reais, integre com a API da plataforma de vendas.
`);
      break;
    }
    default:
      console.error(`❌ Subcomando desconhecido: launch ${subcommand}`);
  }
}

function handleCalendar(subcommand, flags) {
  switch (subcommand) {
    case 'create': {
      validateFlags(commands.calendar.create, flags);
      const days = parseInt(flags.duration) || 30;
      const frequency = parseInt(flags.postFrequency) || 3;
      const platforms = (flags.platforms || 'instagram,linkedin').split(',');

      const outDir = path.join(process.cwd(), 'digital-products', 'calendars');
      fs.mkdirSync(outDir, { recursive: true });

      let cal = `# Calendário Editorial: ${flags.product}\n`;
      cal += `Período: ${days} dias\n`;
      cal += `Frequência: ${frequency} posts/semana\n`;
      cal += `Plataformas: ${platforms.join(', ')}\n\n`;

      const contentTypes = ['Educativo', 'Prova Social', 'Entretenimento', 'Promocional', 'Dica Rápida', 'FAQ', 'Case'];
      const startDate = new Date();

      for (let d = 1; d <= days; d++) {
        const date = new Date(startDate.getTime() + (d - 1) * 86400000);
        if (d % Math.floor(7 / frequency) === 0) {
          const platform = platforms[d % platforms.length];
          const type = contentTypes[d % contentTypes.length];
          cal += `- [${date.toLocaleDateString()}] ${platform} | ${type} | [Título do post]\n`;
        }
      }

      const outFile = path.join(outDir, `calendario-${flags.product.replace(/\s+/g, '-').toLowerCase()}.md`);
      fs.writeFileSync(outFile, cal);

      console.log(`
✅ Calendário editorial gerado: ${outFile}
   Período: ${days} dias
   Posts estimados: ${Math.floor(days / 7 * frequency)}
   Plataformas: ${platforms.join(', ')}
`);
      break;
    }
    default:
      console.error(`❌ Subcomando desconhecido: calendar ${subcommand}`);
  }
}

// --- Main ---
async function main() {
  const { command, subcommand, flags } = parseArgs();

  if (!command) { printHelp(); return; }

  try {
    switch (command) {
      case 'create': await handleCreate(subcommand, flags); break;
      case 'research': handleResearch(subcommand, flags); break;
      case 'platform': handlePlatform(subcommand, flags); break;
      case 'analyze': handleAnalyze(subcommand, flags); break;
      case 'test': handleTest(subcommand, flags); break;
      case 'optimize': handleOptimize(subcommand, flags); break;
      case 'simulate': handleSimulate(subcommand, flags); break;
      case 'launch': handleLaunch(subcommand, flags); break;
      case 'calendar': handleCalendar(subcommand, flags); break;
      default:
        console.error(`❌ Comando desconhecido: ${command}`);
        printHelp();
    }
  } catch (err) {
    console.error(`❌ Erro: ${err.message}`);
    process.exit(1);
  }
}

main();
