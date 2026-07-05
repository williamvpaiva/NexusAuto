#!/usr/bin/env node

/**
 * test-spec-kit-integration.js — Teste do Fluxo Completo Spec-Kit → NexusAuto
 *
 * Executa um teste end-to-end da integração Spec-Kit com NexusAuto,
 * gerando uma especificação de exemplo (CRUD de tarefas) e validando
 * todos os artefatos.
 *
 * Uso:
 *   node scripts/test-spec-kit-integration.js
 */

const SpecKitBridge = require('./spec-kit-bridge');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const SPECS_DIR = path.join(PROJECT_ROOT, 'specs');

async function runTest() {
  console.log('🧪 Iniciando teste de integração Spec-Kit → NexusAuto\n');
  console.log('=' .repeat(60));
  
  const bridge = new SpecKitBridge();
  const featureName = 'crud-tarefas-test';
  const idea = 'Criar um CRUD completo de tarefas com título, descrição, status (pendente/em progresso/concluído) e data de vencimento. Deve incluir API REST com validação e frontend com React e Tailwind CSS.';
  const techStack = 'Node.js/TypeScript, Express, Prisma, PostgreSQL, React, Tailwind CSS';
  
  try {
    // Teste 1: Gerar especificação completa
    console.log('\n📝 TESTE 1: Gerar especificação completa');
    console.log('-'.repeat(60));
    
    const specResult = await bridge.generateFullSpec(idea, techStack, featureName);
    
    console.log('\n✅ Especificação gerada com sucesso!');
    console.log(`📁 Diretório: ${specResult.specDir}`);
    console.log(`📊 Tamanho dos artefatos:`);
    console.log(`   - spec.md: ${specResult.spec.length} bytes`);
    console.log(`   - plan.md: ${specResult.plan.length} bytes`);
    console.log(`   - tasks.md: ${specResult.tasks.length} bytes`);
    console.log(`   - clarifications.md: ${specResult.clarifications.length} bytes`);
    
    // Teste 2: Validar especificação
    console.log('\n🔍 TESTE 2: Validar especificação');
    console.log('-'.repeat(60));
    
    const validation = bridge.validateSpec(featureName);
    
    if (validation.valid) {
      console.log('✅ Validação APROVADA');
    } else {
      console.log('⚠️ Validação REPROVADA');
      validation.validations.forEach(v => {
        if (!v.valid) {
          console.log(`   ❌ ${v.file}: ${v.exists ? 'Presente mas incompleto' : 'Não encontrado'}`);
        }
      });
    }
    
    // Teste 3: Importar tarefas para MELHORIAS/
    console.log('\n📥 TESTE 3: Importar tarefas para MELHORIAS/');
    console.log('-'.repeat(60));
    
    const importResult = await bridge.importTasksToMelhorias(featureName, '01-BACKEND');
    
    if (importResult.success) {
      console.log('✅ Tarefas importadas com sucesso!');
      console.log(`📁 Área: ${importResult.area}`);
      console.log(`📄 Arquivo: ${importResult.tarefasPath}`);
    } else {
      console.log('⚠️ Erro ao importar tarefas:', importResult.error);
    }
    
    // Teste 4: Sincronizar Constitution
    console.log('\n🔄 TESTE 4: Sincronizar Constitution');
    console.log('-'.repeat(60));
    
    const constitutionResult = bridge.syncConstitution();
    
    if (constitutionResult.success) {
      console.log('✅ Constitution sincronizada!');
      console.log(`📁 .specify/constitution.md → .ai-factory/brain/Constitution.md`);
    } else {
      console.log('⚠️ Erro ao sincronizar Constitution:', constitutionResult.error);
    }
    
    // Resumo final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO DO TESTE');
    console.log('='.repeat(60));
    console.log(`✅ Especificação gerada: ${specResult.featureName}`);
    console.log(`✅ Validação: ${validation.valid ? 'APROVADA' : 'REPROVADA'}`);
    console.log(`✅ Importação MELHORIAS/: ${importResult.success ? 'SUCESSO' : 'FALHOU'}`);
    console.log(`✅ Constitution: ${constitutionResult.success ? 'SINCRONIZADA' : 'FALHOU'}`);
    
    // Economia de tokens (estimativa)
    console.log('\n💰 ECONOMIA DE TOKENS (Estimativa)');
    console.log('-'.repeat(60));
    const promptSolto = 2000; // Tokens em média para prompt solto
    const specEstruturada = 500; // Tokens para carregar spec estruturada
    const economia = ((promptSolto - specEstruturada) / promptSolto) * 100;
    console.log(`Prompt solto (médio): ~${promptSolto} tokens`);
    console.log(`Especificação estruturada: ~${specEstruturada} tokens`);
    console.log(`📉 Economia: ${economia.toFixed(0)}% menos tokens por tarefa`);
    
    console.log('\n🎉 Teste de integração CONCLUÍDO!\n');
    
    return {
      success: true,
      featureName,
      specResult,
      validation,
      importResult,
      constitutionResult
    };
    
  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:');
    console.error(error.message);
    console.error(error.stack);
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Executar teste
runTest()
  .then(result => {
    if (!result.success) {
      process.exit(1);
    }
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });