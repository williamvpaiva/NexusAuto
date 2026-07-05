import { EventEmitter } from 'events';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const memoryManagerPath = path.resolve(__dirname, '../../scripts/memory-manager.js');

let MemoryManager = null;
try {
    const mm = await import(memoryManagerPath);
    MemoryManager = mm.MemoryManager || mm.default;
} catch (e) {
    console.error('Falha ao carregar MemoryManager no API:', e);
}

const memoryStream = new EventEmitter();

class MemoryAPI {
    constructor() {
        this.mm = MemoryManager ? new MemoryManager() : null;
    }

    /**
     * Busca memórias (placeholder simplificado)
     */
    async getMemories(query = '', limit = 50, offset = 0, filter = {}) {
        if (!this.mm) return [];
        // No mundo real, faríamos query no banco sqlite-vec
        // Aqui mockaremos uma resposta base
        return [
            { id: 1, content: "Início do projeto", type: "decision", isPrivate: false },
            { id: 2, content: "[Watcher] Evento: file_changed no arquivo: src/App.tsx", type: "file_event", isPrivate: false }
        ];
    }

    /**
     * Marca uma memória como privada
     */
    async markPrivate(id) {
        console.log(`🔒 Marcando memória ${id} como privada.`);
        // Faria UPDATE no SQLite
        return { success: true };
    }

    /**
     * Atualiza o conteúdo da memória
     */
    async updateMemory(id, content) {
        console.log(`✏️ Atualizando memória ${id}.`);
        // Faria UPDATE no SQLite
        return { success: true };
    }

    /**
     * Retorna o EventEmitter para SSE (Server-Sent Events)
     */
    streamMemories() {
        return memoryStream;
    }
}

export default new MemoryAPI();
