#!/usr/bin/env ts-node
import { Command } from 'commander';
import { ExecutionLoop } from './executionLoop';
import { GitManager } from './gitManager';
import { Reporter } from './reporter';

const program = new Command();

program
  .name('gnhf')
  .description('Good Night, Have Fun - Orquestrador de Agentes Autônomos em Loop.')
  .version('1.0.0');

program
  .command('start')
  .description('Inicia o loop de execução para resolver uma tarefa.')
  .argument('<task>', 'A descrição da tarefa a ser executada')
  .action(async (task: string) => {
    console.log(`🚀 Iniciando GNHF para a tarefa: "${task}"`);
    const gitManager = new GitManager(process.cwd());
    const reporter = new Reporter(process.cwd());
    const executionLoop = new ExecutionLoop(gitManager, reporter);
    
    await executionLoop.run(task);
    console.log('✅ Execução concluída. Bom trabalho!');
  });

program.parse();
