#!/usr/bin/env node

/**
 * retrieve-context.js
 * 
 * Busca semântica de arquivos relevantes usando TF-IDF (natural)
 * Economia: anexa apenas 3-5 trechos ao invés de diretórios inteiros
 * 
 * Uso: node scripts/retrieve-context.js "descrição da tarefa"
 * Ex: node scripts/retrieve-context.js "criar validação de email no backend"
 */

const natural = require('natural');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Configuração
const CONFIG = {
  topN: 3, // Quantidade de arquivos retornados
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  excludeDirs: ['node_modules', 'dist', 'build', '.git', 'coverage'],
  minScore: 0.1 // Score mínimo para considerar relevante
};

/**
 * Extrai nomes de funções, classes e exports de um arquivo
 */
function extractSymbols(content, filePath) {
  const symbols = [];
  
  // Funções
  const functionRegex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)/g;
  let match;
  while ((match = functionRegex.exec(content)) !== null) {
    symbols.push(`function ${match[1]}`);
  }
  
  // Classes
  const classRegex = /(?:export\s+)?class\s+(\w+)/g;
  while ((match = classRegex.exec(content)) !== null) {
    symbols.push(`class ${match[1]}`);
  }
  
  // Constants/Variables exports
  const exportRegex = /export\s+(?:const|let|var)\s+(\w+)/g;
  while ((match = exportRegex.exec(content)) !== null) {
    symbols.push(`export ${match[1]}`);
  }
  
  // Imports (para contexto de dependências)
  const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
  while ((match = importRegex.exec(content)) !== null) {
    symbols.push(`imports ${match[1]}`);
  }
  
  return symbols;
}

/**
 * Busca todos os arquivos elegíveis em um diretório
 */
function getAllFiles(dir, fileList = []) {
  const files = glob.sync(`${dir}/**/*`, {
    nodir: true,
    ignore: CONFIG.excludeDirs.map(d => `**/${d}/**`)
  });
  
  return files.filter(file => 
    CONFIG.extensions.some(ext => file.endsWith(ext))
  );
}

/**
 * Constrói índice TF-IDF dos arquivos
 */
function buildIndex(dir) {
  console.error(`[retrieve-context] Indexando arquivos em ${dir}...`);
  
  const files = getAllFiles(dir);
  const tfidf = new natural.TfIdf();
  const fileContents = {};
  
  files.forEach((file, index) => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const symbols = extractSymbols(content, file);
      const text = symbols.join(' ');
      
      tfidf.addDocument(text, file);
      fileContents[file] = content;
      
      console.error(`  [${index + 1}/${files.length}] ${file}`);
    } catch (err) {
      console.error(`  ⚠️  Erro ao ler ${file}: ${err.message}`);
    }
  });
  
  console.error(`[retrieve-context] Índice construído: ${files.length} arquivos`);
  
  return { tfidf, fileContents, files };
}

/**
 * Busca os arquivos mais relevantes para uma query
 */
function search(query, index, topN = CONFIG.topN) {
  const { tfidf } = index;
  
  console.error(`[retrieve-context] Buscando por: "${query}"`);
  
  const terms = tfidf.listTerms(query);
  
  if (terms.length === 0) {
    console.error('[retrieve-context] ⚠️  Nenhum resultado encontrado');
    return [];
  }
  
  const results = terms
    .filter(term => term.score >= CONFIG.minScore)
    .slice(0, topN)
    .map(term => ({
      file: term.doc,
      score: term.score,
      terms: term.terms
    }));
  
  console.error(`[retrieve-context] ✅ Encontrados ${results.length} arquivos relevantes`);
  
  return results;
}

/**
 * Extrai trechos relevantes do arquivo (context window)
 */
function extractRelevantSnippet(content, query, maxLines = 50) {
  const lines = content.split('\n');
  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 3);
  
  // Encontra linhas com maior densidade de termos da query
  const lineScores = lines.map((line, index) => {
    const lowerLine = line.toLowerCase();
    const score = queryTerms.reduce((acc, term) => 
      acc + (lowerLine.includes(term) ? 1 : 0), 0
    );
    return { index, score, line };
  });
  
  // Pega as top N linhas
  const topLines = lineScores
    .sort((a, b) => b.score - a.score)
    .slice(0, maxLines)
    .sort((a, b) => a.index - b.index);
  
  return topLines.map(l => l.line).join('\n');
}

/**
 * Main function
 */
async function main() {
  const query = process.argv.slice(2).join(' ');
  
  if (!query) {
    console.error('Uso: node scripts/retrieve-context.js "descrição da tarefa"');
    console.error('Ex: node scripts/retrieve-context.js "criar validação de email no backend"');
    process.exit(1);
  }
  
  const searchDir = process.env.SEARCH_DIR || path.join(__dirname, '..');
  const topN = parseInt(process.env.TOP_N || '3', 10);
  
  // Constrói índice
  const index = buildIndex(searchDir);
  
  // Busca arquivos relevantes
  const results = search(query, index, topN);
  
  // Output em JSON para fácil parsing
  const output = {
    query,
    searchDir,
    results: results.map(r => ({
      file: r.file,
      score: r.score,
      snippet: extractRelevantSnippet(index.fileContents[r.file], query)
    }))
  };
  
  console.log(JSON.stringify(output, null, 2));
}

main().catch(err => {
  console.error('[retrieve-context] Erro fatal:', err);
  process.exit(1);
});