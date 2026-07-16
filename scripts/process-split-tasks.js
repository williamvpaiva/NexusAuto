#!/usr/bin/env node

/**
 * process-split-tasks.js
 * 
 * Lê os arquivos gerados em .ai-factory/tasks-split/ e os enfileira no CowAgent.
 */

const fs = require('fs');
const path = require('path');
const CowAgentWrapper = require('./cowagent-wrapper');

const splitDir = path.join(__dirname, '..', '.ai-factory', 'tasks-split');

async function main() {
  if (!fs.existsSync(splitDir)) {
    console.log('Nenhuma pasta de split encontrada.');
    return;
  }

  const files = fs.readdirSync(splitDir).filter(f => f.endsWith('.md'));
  
  if (files.length === 0) {
    console.log('Nenhuma subtarefa encontrada.');
    return;
  }

  // Ordena os arquivos para garantir execução sequencial (part-1, part-2...)
  files.sort();

  console.log(`📦 Encontradas ${files.length} subtarefas. Preparando fila do CowAgent...`);
  
  const cowAgent = new CowAgentWrapper();
  
  for (const file of files) {
    const filePath = path.join(splitDir, file);
    console.log(`\n⏳ Iniciando subtarefa: ${file}`);
    
    try {
      const result = await cowAgent.executeTask(filePath);
      console.log(`✅ Subtarefa ${file} concluída.`);
      
      // Arquiva ou remove a subtarefa após processar
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`❌ Erro ao executar subtarefa ${file}:`, err.error || err.message);
      console.log('Interrompendo a fila para revisão manual.');
      process.exit(1);
    }
  }
  
  console.log('\n🎉 Todas as subtarefas foram processadas com sucesso!');
}

main().catch(err => {
  console.error('Erro no processador de subtarefas:', err);
  process.exit(1);
});
