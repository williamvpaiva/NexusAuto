const fs = require('fs');
const path = require('path');

// Integração de memória persistente da Agência.
// Em um sistema real, isso chamaria o memory-manager.js

class AgencyUtils {
    constructor() {
        this.memoryManagerPath = path.join(__dirname, '..', '..', 'scripts', 'memory-manager.js');
        this.profilesDir = path.join(__dirname, '..', 'profiles');
    }

    /**
     * Tenta carregar o MemoryManager se existir.
     */
    getMemoryManager() {
        try {
            if (fs.existsSync(this.memoryManagerPath)) {
                const { MemoryManager } = require(this.memoryManagerPath);
                if (typeof MemoryManager === 'function') {
                    return new MemoryManager();
                }
            }
        } catch (e) {
            console.warn("Aviso: Falha ao carregar MemoryManager, usando fallback de console.", e.message);
        }
        return null;
    }

    /**
     * Registra o uso de um perfil
     */
    logProfileUsage(profileName, task, result) {
        const mm = this.getMemoryManager();
        const content = `Perfil '${profileName}' usado para: ${task}. Resultado: ${result}`;
        
        if (mm && typeof mm.saveMemory === 'function') {
            mm.saveMemory(content, { agent: 'tech-lead', type: 'agency-usage', profile: profileName });
        } else {
            console.log(`[Agency Log] ${content}`);
        }
    }

    /**
     * Registra a criação de um perfil
     */
    logProfileCreation(profileName, division) {
        const mm = this.getMemoryManager();
        const content = `Novo perfil criado: '${profileName}' (${division})`;
        
        if (mm && typeof mm.saveMemory === 'function') {
            mm.saveMemory(content, { agent: 'tech-lead', type: 'agency-creation', profile: profileName });
        } else {
            console.log(`[Agency Log] ${content}`);
        }
    }

    /**
     * Lê e retorna um perfil da agência.
     */
    loadProfile(profileName) {
        // Simple recursive search logic
        const searchDir = (dir) => {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                if (fs.statSync(fullPath).isDirectory()) {
                    const found = searchDir(fullPath);
                    if (found) return found;
                } else if (file.toLowerCase() === `${profileName.toLowerCase()}.md`) {
                    return fs.readFileSync(fullPath, 'utf8');
                }
            }
            return null;
        };
        
        if (fs.existsSync(this.profilesDir)) {
            return searchDir(this.profilesDir);
        }
        return null;
    }
}

module.exports = { AgencyUtils };
