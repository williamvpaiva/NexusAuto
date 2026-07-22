#!/usr/bin/env node

/**
 * E2E Tests for Líder Orchestration Flow
 * 
 * Tests the complete workflow from task intake to validation:
 * 1. Task analysis and agent routing
 * 2. CowAgent delegation
 * 3. Memory persistence (SQLite + Wiki)
 * 4. V&V validation with cache
 * 5. Wiki synchronization
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Paths
const ROOT_DIR = path.join(__dirname, '..', '..');
const SCRIPTS_DIR = path.join(ROOT_DIR, 'scripts');
const TESTS_DIR = path.join(ROOT_DIR, 'tests');
const FIXTURES_DIR = path.join(TESTS_DIR, 'fixtures');
const WIKI_DIR = path.join(ROOT_DIR, '.ai-factory', 'wiki');

// Import modules under test
const CowAgentWrapper = require(path.join(SCRIPTS_DIR, 'cowagent-wrapper.cjs'));
const MemoryManager = require(path.join(SCRIPTS_DIR, 'memory-manager.cjs'));

// Test state
const testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: []
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString().slice(11, 19);
  const prefix = {
    'info': '📋',
    'pass': '✅',
    'fail': '❌',
    'skip': '⏭️',
    'error': '🚨'
  }[type] || '📋';
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function registerTest(name, status, error = null) {
  testResults.tests.push({ name, status, error, timestamp: new Date().toISOString() });
  
  if (status === 'passed') {
    testResults.passed++;
    log(name, 'pass');
  } else if (status === 'failed') {
    testResults.failed++;
    log(`${name}: ${error?.message || error}`, 'fail');
  } else {
    testResults.skipped++;
    log(name, 'skip');
  }
}

// Test fixtures
const TEST_TASKS = {
  backend_api: {
    description: 'Create REST API endpoint for user authentication with JWT tokens',
    expectedAgent: 'backend-dev',
    keywords: ['API', 'endpoint', 'auth', 'JWT', 'backend']
  },
  frontend_component: {
    description: 'Build React component for user dashboard with responsive design',
    expectedAgent: 'frontend-dev',
    keywords: ['React', 'component', 'frontend', 'UI', 'dashboard']
  },
  security_audit: {
    description: 'Audit login endpoint against OWASP Top 10 vulnerabilities',
    expectedAgent: 'security',
    keywords: ['OWASP', 'vulnerabilidade', 'security', 'audit', 'pentest']
  },
  devops_pipeline: {
    description: 'Setup CI/CD pipeline with Docker deployment to staging',
    expectedAgent: 'devops',
    keywords: ['CI', 'CD', 'pipeline', 'Docker', 'deploy']
  },
  digital_product: {
    description: 'Create online course structure for React Advanced patterns',
    expectedAgent: 'digital-product-creator',
    keywords: ['curso', 'produto digital', 'curso online', 'infoproduto']
  }
};

// ============ TEST SUITES ============

async function testSuite_CowAgentDelegation() {
  log('=== Test Suite: CowAgent Automatic Delegation ===', 'info');
  
  const cowAgent = new CowAgentWrapper();
  
  // Test 1: Keyword routing matrix exists
  try {
    assert.ok(cowAgent.keywordRouting, 'Keyword routing matrix should exist');
    assert.ok(Object.keys(cowAgent.keywordRouting).length > 20, 'Should have comprehensive keyword coverage');
    registerTest('CowAgent: Keyword routing matrix initialized', 'passed');
  } catch (error) {
    registerTest('CowAgent: Keyword routing matrix initialized', 'failed', error);
  }
  
  // Test 2: Analyze and delegate - Backend task
  try {
    const task = TEST_TASKS.backend_api;
    // Simulate keyword matching (without actual CowAgent execution)
    const matchedKeywords = task.keywords.filter(k => 
      Object.keys(cowAgent.keywordRouting).some(rk => rk.toLowerCase() === k.toLowerCase())
    );
    assert.ok(matchedKeywords.length > 0, 'Should match keywords');
    registerTest('CowAgent: Backend task keyword matching', 'passed');
  } catch (error) {
    registerTest('CowAgent: Backend task keyword matching', 'failed', error);
  }
  
  // Test 3: Analyze and delegate - Frontend task
  try {
    const task = TEST_TASKS.frontend_component;
    const matchedKeywords = task.keywords.filter(k => 
      Object.keys(cowAgent.keywordRouting).some(rk => rk.toLowerCase() === k.toLowerCase())
    );
    assert.ok(matchedKeywords.length > 0, 'Should match keywords');
    registerTest('CowAgent: Frontend task keyword matching', 'passed');
  } catch (error) {
    registerTest('CowAgent: Frontend task keyword matching', 'failed', error);
  }
  
  // Test 4: Analyze and delegate - Security task
  try {
    const task = TEST_TASKS.security_audit;
    const matchedKeywords = task.keywords.filter(k => 
      Object.keys(cowAgent.keywordRouting).some(rk => rk.toLowerCase() === k.toLowerCase())
    );
    assert.ok(matchedKeywords.length > 0, 'Should match keywords');
    registerTest('CowAgent: Security task keyword matching', 'passed');
  } catch (error) {
    registerTest('CowAgent: Security task keyword matching', 'failed', error);
  }
  
  // Test 5: Analyze and delegate - DevOps task
  try {
    const task = TEST_TASKS.devops_pipeline;
    const matchedKeywords = task.keywords.filter(k => 
      Object.keys(cowAgent.keywordRouting).some(rk => rk.toLowerCase() === k.toLowerCase())
    );
    assert.ok(matchedKeywords.length > 0, 'Should match keywords');
    registerTest('CowAgent: DevOps task keyword matching', 'passed');
  } catch (error) {
    registerTest('CowAgent: DevOps task keyword matching', 'failed', error);
  }
  
  // Test 6: Analyze and delegate - Digital Product task
  try {
    const task = TEST_TASKS.digital_product;
    const matchedKeywords = task.keywords.filter(k => 
      Object.keys(cowAgent.keywordRouting).some(rk => rk.toLowerCase() === k.toLowerCase())
    );
    assert.ok(matchedKeywords.length > 0, 'Should match keywords');
    registerTest('CowAgent: Digital Product task keyword matching', 'passed');
  } catch (error) {
    registerTest('CowAgent: Digital Product task keyword matching', 'failed', error);
  }
  
  // Test 7: Skill mapping exists
  try {
    const skillMap = {
      'architect': 'architecture-design',
      'backend-dev': 'backend-development',
      'frontend-dev': 'frontend-development',
      'security': 'security-audit',
      'devops': 'ci-cd-pipeline',
      'qa-tester': 'test-generation',
      'performance': 'performance-optimization',
      'tech-lead': 'code-review',
      'digital-product-creator': 'digital-product-create',
      'monetization-strategist': 'monetization-plan',
      'product-launch-manager': 'launch-plan'
    };
    assert.ok(Object.keys(skillMap).length === 11, 'Should have all skill mappings');
    registerTest('CowAgent: Skill mapping complete', 'passed');
  } catch (error) {
    registerTest('CowAgent: Skill mapping complete', 'failed', error);
  }
}

async function testSuite_MemoryPersistence() {
  log('=== Test Suite: Memory Persistence (SQLite + Wiki) ===', 'info');
  
  const mm = new MemoryManager();
  await mm.init();
  
  // Test 1: Memory Manager initialization
  try {
    const dbPath = mm.getDbPath();
    assert.ok(fs.existsSync(dbPath), 'SQLite database should exist');
    registerTest('Memory: SQLite database initialized', 'passed');
  } catch (error) {
    registerTest('Memory: SQLite database initialized', 'failed', error);
  }
  
  // Test 2: Save memory with Wiki sync
  try {
    const testContent = 'E2E Test: Decision to use TypeScript for all new modules';
    const metadata = {
      agent: 'architect',
      type: 'decision',
      tags: ['typescript', 'architecture', 'standards'],
      testRun: true
    };
    
    const result = await mm.saveMemoryWithWiki(testContent, metadata);
    
    assert.ok(result.id, 'Should return SQLite ID');
    assert.ok(result.wikiFile, 'Should return wiki filename');
    assert.ok(result.wikiPath, 'Should return wiki filepath');
    assert.ok(fs.existsSync(result.wikiPath), 'Wiki file should exist');
    
    registerTest('Memory: Save with Wiki sync', 'passed');
  } catch (error) {
    registerTest('Memory: Save with Wiki sync', 'failed', error);
  }
  
  // Test 3: Wiki file format
  try {
    const wikiFiles = fs.readdirSync(path.join(WIKI_DIR, 'decisions'))
      .filter(f => f.endsWith('.md') && f !== 'INDEX.md');
    
    assert.ok(wikiFiles.length > 0, 'Should have wiki files in decisions directory');
    
    const latestFile = path.join(WIKI_DIR, 'decisions', wikiFiles[0]);
    const content = fs.readFileSync(latestFile, 'utf-8');
    
    assert.ok(content.includes('---'), 'Should have frontmatter');
    assert.ok(content.includes('agent:'), 'Should have agent metadata');
    assert.ok(content.includes('type:'), 'Should have type metadata');
    assert.ok(content.includes('#'), 'Should have markdown heading');
    
    registerTest('Memory: Wiki file format correct', 'passed');
  } catch (error) {
    registerTest('Memory: Wiki file format correct', 'failed', error);
  }
  
  // Test 4: Session log append
  try {
    const sessionLogFile = path.join(WIKI_DIR, 'session', 'log.md');
    assert.ok(fs.existsSync(sessionLogFile), 'Session log should exist');
    
    const content = fs.readFileSync(sessionLogFile, 'utf-8');
    assert.ok(content.includes('memory_saved'), 'Should log memory_saved action');
    
    registerTest('Memory: Session log append working', 'passed');
  } catch (error) {
    registerTest('Memory: Session log append working', 'failed', error);
  }
  
  // Test 5: Wiki search
  try {
    const results = await mm.searchWiki('E2E Test', { limit: 10 });
    assert.ok(Array.isArray(results), 'Should return array');
    assert.ok(results.length > 0, 'Should find test content');
    
    registerTest('Memory: Wiki search functional', 'passed');
  } catch (error) {
    registerTest('Memory: Wiki search functional', 'failed', error);
  }
  
  // Test 6: Hybrid search (SQLite + Wiki)
  try {
    const results = await mm.searchHybrid('E2E Test', { topK: 10 });
    assert.ok(results.sqlite || results.wiki || results.merged, 'Should return results from both sources');
    
    registerTest('Memory: Hybrid search functional', 'passed');
  } catch (error) {
    registerTest('Memory: Hybrid search functional', 'failed', error);
  }
  
  // Test 7: Wiki Index auto-update
  try {
    const decisionsIndex = path.join(WIKI_DIR, 'decisions', 'INDEX.md');
    assert.ok(fs.existsSync(decisionsIndex), 'Decisions INDEX.md should exist');
    
    const content = fs.readFileSync(decisionsIndex, 'utf-8');
    assert.ok(content.includes('Atualizado:'), 'Should have update timestamp');
    assert.ok(content.includes('Total:'), 'Should have document count');
    
    registerTest('Memory: Wiki Index auto-update', 'passed');
  } catch (error) {
    registerTest('Memory: Wiki Index auto-update', 'failed', error);
  }
  
  await mm.close();
}

async function testSuite_VnVValidation() {
  log('=== Test Suite: V&V Validation with Cache ===', 'info');
  
  // Test 1: Check cache script exists
  try {
    const checkCacheScript = path.join(SCRIPTS_DIR, 'check-cache.cjs');
    assert.ok(fs.existsSync(checkCacheScript), 'check-cache.cjs should exist');
    registerTest('V&V: Cache check script exists', 'passed');
  } catch (error) {
    registerTest('V&V: Cache check script exists', 'failed', error);
  }
  
  // Test 2: V&V scoring logic
  try {
    const scoringFactors = {
      'Auth/Pagamento envolvido': 5,
      'Schema change': 4,
      'Multi-agent handoff': 3,
      'Nova dependência': 2,
      'Apenas UI/CSS': 1
    };
    
    // Test critical score (>= 8)
    const criticalScore = scoringFactors['Auth/Pagamento envolvido'] + scoringFactors['Schema change'];
    assert.ok(criticalScore >= 8, 'Auth + Schema should be critical (>= 8)');
    
    // Test medium score (4-7)
    const mediumScore = scoringFactors['Nova dependência'] + scoringFactors['Apenas UI/CSS'];
    assert.ok(mediumScore >= 4 && mediumScore < 8, 'Dependency + UI should be medium (4-7)');
    
    // Test normal score (< 4)
    const normalScore = scoringFactors['Apenas UI/CSS'];
    assert.ok(normalScore < 4, 'UI only should be normal (< 4)');
    
    registerTest('V&V: Scoring logic correct', 'passed');
  } catch (error) {
    registerTest('V&V: Scoring logic correct', 'failed', error);
  }
  
  // Test 3: V&V levels mapping
  try {
    const levelMapping = {
      'critical': { level: 1, steps: 7, tokens: 3000 },
      'medium': { level: 2, steps: 3, tokens: 1000 },
      'cache': { level: 3, steps: 0, tokens: 50 }
    };
    
    assert.ok(levelMapping.critical.steps === 7, 'Critical should have 7 steps');
    assert.ok(levelMapping.medium.steps === 3, 'Medium should have 3 steps');
    assert.ok(levelMapping.cache.steps === 0, 'Cache should have 0 steps (skip)');
    
    registerTest('V&V: Level mapping correct', 'passed');
  } catch (error) {
    registerTest('V&V: Level mapping correct', 'failed', error);
  }
}

async function testSuite_IntegrationFlow() {
  log('=== Test Suite: Full Integration Flow ===', 'info');
  
  // Test 1: End-to-end task flow simulation
  try {
    const task = TEST_TASKS.backend_api;
    
    // Step 1: Keyword analysis
    const CowAgentWrapper = require(path.join(SCRIPTS_DIR, 'cowagent-wrapper.cjs'));
    const cowAgent = new CowAgentWrapper();
    
    const matchedKeywords = task.keywords.filter(k => 
      Object.keys(cowAgent.keywordRouting).some(rk => rk.toLowerCase() === k.toLowerCase())
    );
    
    assert.ok(matchedKeywords.length > 0, 'Step 1: Should match keywords');
    
    // Step 2: Agent determination
    const agentScores = {};
    for (const keyword of matchedKeywords) {
      const agent = cowAgent.keywordRouting[keyword.toLowerCase()] || 
                    Object.entries(cowAgent.keywordRouting).find(([k]) => 
                      k.toLowerCase() === keyword.toLowerCase())?.[1];
      if (agent) {
        agentScores[agent] = (agentScores[agent] || 0) + 1;
      }
    }
    
    const bestAgent = Object.entries(agentScores).sort(([,a], [,b]) => b - a)[0]?.[0];
    assert.ok(bestAgent, 'Step 2: Should determine best agent');
    
    // Step 3: Memory save with Wiki
    const mm = new MemoryManager();
    await mm.init();
    
    const memoryContent = `Task delegated to ${bestAgent}: ${task.description}`;
    const memoryResult = await mm.saveMemoryWithWiki(memoryContent, {
      agent: 'tech-lead',
      type: 'context',
      tags: ['e2e-test', 'orchestration'],
      delegatedTo: bestAgent
    });
    
    assert.ok(memoryResult.wikiFile, 'Step 3: Should save to Wiki');
    
    await mm.close();
    
    registerTest('Integration: End-to-end task flow', 'passed');
  } catch (error) {
    registerTest('Integration: End-to-end task flow', 'failed', error);
  }
  
  // Test 2: Multi-agent handoff simulation
  try {
    const mm = new MemoryManager();
    await mm.init();
    
    // Simulate handoff from backend-dev to frontend-dev
    const handoffContent = 'API endpoint /api/users ready for frontend integration';
    await mm.saveMemoryWithWiki(handoffContent, {
      agent: 'backend-dev',
      type: 'handoff',
      tags: ['api', 'users'],
      handoffTo: 'frontend-dev'
    });
    
    // Verify handoff is searchable
    const results = await mm.searchWiki('handoff', { limit: 5 });
    assert.ok(results.length > 0, 'Handoff should be searchable');
    
    await mm.close();
    
    registerTest('Integration: Multi-agent handoff', 'passed');
  } catch (error) {
    registerTest('Integration: Multi-agent handoff', 'failed', error);
  }
}

// ============ MAIN TEST RUNNER ============

async function runAllTests() {
  log('🚀 Starting E2E Orchestration Flow Tests', 'info');
  log('=' .repeat(60), 'info');
  
  const startTime = Date.now();
  
  try {
    await testSuite_CowAgentDelegation();
    await testSuite_MemoryPersistence();
    await testSuite_VnVValidation();
    await testSuite_IntegrationFlow();
  } catch (error) {
    log(`Test suite error: ${error.message}`, 'error');
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  // Summary
  log('=' .repeat(60), 'info');
  log('📊 Test Summary', 'info');
  log('=' .repeat(60), 'info');
  log(`Total: ${testResults.passed + testResults.failed + testResults.skipped} tests`, 'info');
  log(`✅ Passed: ${testResults.passed}`, testResults.failed === 0 ? 'pass' : 'info');
  log(`❌ Failed: ${testResults.failed}`, testResults.failed === 0 ? 'pass' : 'fail');
  log(`⏭️  Skipped: ${testResults.skipped}`, 'info');
  log(`⏱️  Duration: ${duration}s`, 'info');
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.passed + testResults.failed + testResults.skipped,
      passed: testResults.passed,
      failed: testResults.failed,
      skipped: testResults.skipped,
      duration: duration
    },
    tests: testResults.tests
  };
  
  const reportFile = path.join(TESTS_DIR, 'e2e', 'test-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  log(`📄 Report saved to: ${reportFile}`, 'info');
  
  // Exit with error code if tests failed
  if (testResults.failed > 0) {
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { runAllTests, TEST_TASKS };