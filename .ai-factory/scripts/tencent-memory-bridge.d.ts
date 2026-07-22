export interface TencentMemoryBridgeOptions {
  baseDir?: string;
  memoryDir?: string;
}

export interface CanvasResult {
  taskId: string;
  logs: unknown;
  metadata: Record<string, unknown>;
}

export default class TencentMemoryBridge {
  constructor(options?: TencentMemoryBridgeOptions);

  // Short-term (Symbolic)
  storeShortTerm(taskId: string, logs: unknown, metadata?: Record<string, unknown>): Promise<string>;
  drillDown(nodeId: string): Promise<string>;
  getCanvas(taskId: string): Promise<string | null>;

  // Long-term (Hierarchical)
  storeConversation(conversation: unknown, metadata?: Record<string, unknown>): Promise<unknown>;
  getPersona(): Promise<string | null>;
  searchScenarios(query: string, topK?: number): Promise<unknown[]>;
  searchAtoms(query: string, topK?: number): Promise<unknown[]>;

  // Hybrid Search
  hybridSearch(query: string, topK?: number): Promise<unknown[]>;

  // Utilities
  isAvailable(): boolean;
  cleanup(): Promise<void>;
}
