#!/usr/bin/env node

/**
 * check-cache.js
 * 
 * Verifica se arquivo pode usar cache de validação
 * 
 * Uso: node scripts/check-cache.js path/to/file.ts
 * Saída: JSON com status do cache
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CACHE_FILE = path.join(__dirname, '..', '.ai-factory', 'VALIDATION_CACHE.md');

/**
 * Parse da tabela de cache (método simples)
 */
function parseCacheTable(content) {
  const lines = content.split('\n');
  const cache = {};
  
  let inTable = false;
  
  for (const line of lines) {
    // Detecta início da tabela
    if (line.includes('| Arquivo |') && line.includes('Hash')) {
      inTable = true;
      continue;
    }
    
    // Pula linha de separação
    if (line.startsWith('|---')) continue;
    
    // Sai da tabela
    if (inTable && line.trim() === '') break;
    
    // Parse de linha da tabela
    if (inTable && line.startsWith('|')) {
      const parts = line.split('|').map(p => p.trim()).filter(p => p);
      
      if (parts.length >= 5) {
        const [file, hash, status, validated, date] = parts;
        cache[file] = {
          hash,
          status: status.includes('✅') ? 'APPROVED' : 'PENDING',
          validated: validated.includes('Sim'),
          date
        };
      }
    }
  }
  
  return cache;
}

/**
 * Obtém hash atual de um arquivo
 */
function getCurrentHash(filePath) {
  try {
    // Tenta usar git show
    const relativePath = path.relative(process.cwd(), filePath);
    const hash = execSync(`git rev-parse HEAD:${relativePath}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
    
    return hash.substring(0, 8); // Primeiros 8 caracteres
  } catch (err) {
    // Fallback: hash do conteúdo
    const crypto = require('crypto');
    const content = fs.readFileSync(filePath, 'utf8');
    return crypto.createHash('sha256').update(content).digest('hex').substring(0, 8);
  }
}

/**
 * Main function
 */
async function main() {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.error('Uso: node scripts/check-cache.js <arquivo>');
    console.error('Ex: node scripts/check-cache.js backend/src/app.ts');
    process.exit(1);
  }
  
  // Normaliza path
  const normalizedPath = path.normalize(filePath);
  
  // Lê cache
  let cache = {};
  try {
    const cacheContent = fs.readFileSync(CACHE_FILE, 'utf8');
    cache = parseCacheTable(cacheContent);
  } catch (err) {
    console.error('⚠️  Cache file não encontrado ou inválido');
  }
  
  // Busca entry no cache
  const cacheEntry = Object.entries(cache).find(([key]) => 
    key.includes(normalizedPath) || normalizedPath.includes(key)
  );
  
  if (!cacheEntry) {
    console.log(JSON.stringify({
      file: normalizedPath,
      cacheHit: false,
      reason: 'CACHE_MISS',
      action: 'APPLY_VV',
      message: 'Arquivo não encontrado no cache'
    }, null, 2));
    process.exit(1); // CACHE_MISS
  }
  
  const [cachedFile, cachedData] = cacheEntry;
  const currentHash = getCurrentHash(filePath);
  
  // Verifica cache hit
  const cacheHit = cachedData.hash === currentHash && 
                   cachedData.status === 'APPROVED' && 
                   cachedData.validated;
  
  const result = {
    file: normalizedPath,
    cacheHit,
    currentHash,
    cachedHash: cachedData.hash,
    cachedStatus: cachedData.status,
    cachedValidated: cachedData.validated,
    cachedDate: cachedData.date,
    action: cacheHit ? 'SKIP_VV' : 'APPLY_VV',
    reason: cacheHit ? 'CACHE_HIT' : 'HASH_CHANGED',
    message: cacheHit 
      ? 'Cache hit - validação pode ser pulada' 
      : 'Cache miss - aplicar validação V&V'
  };
  
  console.log(JSON.stringify(result, null, 2));
  
  // Exit code para automação
  process.exit(cacheHit ? 0 : 1);
}

main().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});