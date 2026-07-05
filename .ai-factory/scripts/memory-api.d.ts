export interface Memory {
  id: string;
  content: string;
  timestamp: string;
  agent: string;
  type: string;
  tags: string[];
  isPrivate: boolean;
}

export interface MemoryApi {
  getMemories: (query?: string) => Promise<Memory[]>;
  markPrivate: (id: string) => Promise<void>;
  updateMemory: (id: string, content: string) => Promise<void>;
  streamMemories: () => any;
}

declare const memoryApi: MemoryApi;
export default memoryApi;