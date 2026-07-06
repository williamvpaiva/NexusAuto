import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// Importa o módulo TencentDB Agent Memory (assumindo que é instalado via npm ou submódulo)
import * as tencentMemory from '../tencent-memory/src/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class TencentMemoryBridge {
  constructor(options = {}) {
    this.baseDir = options.baseDir || path.join(__dirname, '..', '..');
    this.memoryDir = options.memoryDir || path.join(this.baseDir, '.ai-factory', 'brain');
    this.tencent = tencentMemory;
    
    // Inicializa o sistema de memória
    if (this.tencent && this.tencent.init) {
      this.tencent.init({
        dbPath: path.join(this.baseDir, 'nexusauto_memory.db'),
        markdownPath: this.memoryDir,
        personaFile: path.join(this.memoryDir, 'persona.md'),
        scenarioDir: path.join(this.memoryDir, 'scenarios'),
        atomDir: path.join(this.memoryDir, 'atoms'),
      });
    }
  }

  // ========== SHORT-TERM (SYMBOLIC) ==========
  
  async storeShortTerm(taskId, logs, metadata = {}) {
    if (!this.tencent || !this.tencent.shortTerm) return 'mock_node_id';
    const canvas = await this.tencent.shortTerm.createCanvas({
      taskId,
      logs,
      metadata,
    });
    const nodeId = await this.tencent.shortTerm.saveCanvas(canvas);
    return nodeId;
  }

  async drillDown(nodeId) {
    if (!this.tencent || !this.tencent.shortTerm) return 'Mock drill down text';
    return this.tencent.shortTerm.getRawText(nodeId);
  }

  async getCanvas(taskId) {
    if (!this.tencent || !this.tencent.shortTerm) return 'graph TD\n  Mock[Mock Canvas]';
    const canvas = await this.tencent.shortTerm.getCanvas(taskId);
    return canvas ? canvas.mermaid : null;
  }

  // ========== LONG-TERM (HIERARCHICAL) ==========

  async storeConversation(conversation, metadata = {}) {
    if (!this.tencent || !this.tencent.longTerm) return { mock: true };
    const result = await this.tencent.longTerm.processConversation({
      conversation,
      metadata,
      personaFile: path.join(this.memoryDir, 'persona.md'),
      scenarioDir: path.join(this.memoryDir, 'scenarios'),
    });
    return result;
  }

  async getPersona() {
    const personaPath = path.join(this.memoryDir, 'persona.md');
    if (fs.existsSync(personaPath)) {
      return fs.readFileSync(personaPath, 'utf-8');
    }
    return null;
  }

  async searchScenarios(query, topK = 3) {
    if (!this.tencent || !this.tencent.longTerm) return [];
    return this.tencent.longTerm.searchScenarios(query, topK);
  }

  async searchAtoms(query, topK = 5) {
    if (!this.tencent || !this.tencent.longTerm) return [];
    return this.tencent.longTerm.searchAtoms(query, topK);
  }

  // ========== HYBRID SEARCH ==========

  async hybridSearch(query, topK = 5) {
    if (!this.tencent || !this.tencent.hybridSearch) return [];
    return this.tencent.hybridSearch.search(query, topK);
  }

  // ========== UTILITÁRIOS ==========

  isAvailable() {
    return !!this.tencent;
  }

  async cleanup() {
    if (this.tencent && this.tencent.shortTerm) {
      await this.tencent.shortTerm.cleanupOldCanvases(7); // dias
    }
  }
}

export default TencentMemoryBridge;
