#!/usr/bin/env node

/**
 * apply-diff.js
 * 
 * Aplica diff/patch gerado por agentes
 * Fallback para rewrite completo se patch falhar
 * 
 * Uso: node scripts/apply-diff.js old.ts new.ts
 * Saída: Arquivo atualizado ou erro
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Tenta aplicar patch via git apply
 */
function applyPatch(oldFile, newFile) {
  try {
    // Gera diff
    const diff = execSync(`git diff --no-index "${oldFile}" "${newFile}"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'] // Ignora stderr (exit code 1 é normal)
    });
    
    if (!diff.trim()) {
      return { success: true, method: 'NO_CHANGES', message: 'Arquivos idênticos' };
    }
    
    // Salva diff temporário
    const tempPatch = path.join(__dirname, '..', '.tmp', 'update.patch');
    fs.mkdirSync(path.dirname(tempPatch), { recursive: true });
    fs.writeFileSync(tempPatch, diff);
    
    // Tenta aplicar patch
    try {
      execSync(`git apply --ignore-whitespace "${tempPatch}"`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      return { success: true, method: 'PATCH', message: 'Patch aplicado com sucesso' };
    } catch (err) {
      // Patch falhou, usa fallback
      return { success: false, method: 'PATCH_FAILED', error: err.message };
    }
  } catch (err) {
    // Git diff falhou (arquivos não existem, etc)
    return { success: false, method: 'DIFF_FAILED', error: err.message };
  }
}

/**
 * Fallback: copia arquivo novo diretamente
 */
function fallbackCopy(oldFile, newFile) {
  try {
    const content = fs.readFileSync(newFile, 'utf8');
    fs.writeFileSync(oldFile, content);
    
    return { success: true, method: 'DIRECT_COPY', message: 'Cópia direta realizada' };
  } catch (err) {
    return { success: false, method: 'COPY_FAILED', error: err.message };
  }
}

/**
 * Main function
 */
async function main() {
  const oldFile = process.argv[2];
  const newFile = process.argv[3];
  
  if (!oldFile || !newFile) {
    console.error('Uso: node scripts/apply-diff.js <old-file> <new-file>');
    console.error('Ex: node scripts/apply-diff.js backend/src/app.ts backend/src/app.new.ts');
    process.exit(1);
  }
  
  // Verifica existência dos arquivos
  if (!fs.existsSync(oldFile)) {
    console.error(`❌ Arquivo antigo não existe: ${oldFile}`);
    process.exit(1);
  }
  
  if (!fs.existsSync(newFile)) {
    console.error(`❌ Arquivo novo não existe: ${newFile}`);
    process.exit(1);
  }
  
  console.error(`[apply-diff] Tentando aplicar diff de ${oldFile} para ${newFile}...`);
  
  // Tenta aplicar patch
  const patchResult = applyPatch(oldFile, newFile);
  
  if (patchResult.success) {
    console.error(`✅ ${patchResult.method}: ${patchResult.message}`);
    
    // Cleanup
    const tempPatch = path.join(__dirname, '..', '.tmp', 'update.patch');
    if (fs.existsSync(tempPatch)) {
      fs.unlinkSync(tempPatch);
    }
    
    // Remove arquivo temporário
    if (newFile !== oldFile) {
      fs.unlinkSync(newFile);
    }
    
    process.exit(0);
  }
  
  // Fallback: copia direta
  console.error(`⚠️  Patch falhou (${patchResult.error}), usando fallback...`);
  
  const fallbackResult = fallbackCopy(oldFile, newFile);
  
  if (fallbackResult.success) {
    console.error(`✅ ${fallbackResult.method}: ${fallbackResult.message}`);
    
    // Remove arquivo temporário
    if (newFile !== oldFile) {
      fs.unlinkSync(newFile);
    }
    
    process.exit(0);
  }
  
  // Falha total
  console.error(`❌ Falha ao aplicar diff: ${fallbackResult.error}`);
  process.exit(1);
}

main().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});