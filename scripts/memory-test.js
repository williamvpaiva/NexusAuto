#!/usr/bin/env node

const MemoryManager = require('./memory-manager');

async function runTests() {
  console.log('🧪 Memory Manager Tests\n');

  const mm = new MemoryManager();
  await mm.init();

  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`  ✅ ${name}`);
      passed++;
    } else {
      console.log(`  ❌ ${name}`);
      failed++;
    }
  }

  try {
    const uniqueSuffix = Date.now();
    // 1. Save memory
    const r1 = await mm.saveMemory(
      `Test ${uniqueSuffix}: API routes devem seguir REST pattern`,
      { agent: 'backend-dev', type: 'decision', tags: ['api', 'rest'] }
    );
    assert(r1 && r1.id && !r1.deduplicated, 'save: nova memória');

    // 2. Deduplication
    const r2 = await mm.saveMemory(
      `Test ${uniqueSuffix}: API routes devem seguir REST pattern`,
      { agent: 'backend-dev', type: 'decision' }
    );
    assert(r2 && r2.deduplicated === true, 'save: deduplicação');

    // 3. Search returns results
    const results = await mm.searchMemories('API REST', 5);
    assert(results.length >= 1, 'search: retorna resultados');

    // 4. Filter by agent
    const agentResults = await mm.searchMemories('API', 5, { agent: 'backend-dev' });
    assert(agentResults.length >= 1, 'search: filtro por agente');

    // 5. Filter by type
    const typeResults = await mm.searchMemories('ORM', 5, { type: 'decision' });
    assert(typeResults.length >= 1, 'search: filtro por tipo');

    // 6. Cache set/get
    await mm.saveCachedResponse('test query', 'test response');
    const cached = await mm.getCachedResponse('test query');
    assert(cached === 'test response', 'cache: set e get');

    // 7. Stats
    const stats = await mm.getStats();
    assert(stats.total_memories >= 2, 'stats: total_memories');
    assert(stats.unique_agents >= 1, 'stats: unique_agents');

    // 8. Summarize
    const summary = await mm.summarize();
    assert(summary && summary.total_memories >= 2, 'summarize');

  } catch (err) {
    console.error('  💥 Erro inesperado:', err.message);
    failed++;
  } finally {
    mm.close();
  }

  console.log(`\n📊 Resultado: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
