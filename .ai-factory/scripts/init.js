# AI Factory - Inicialização Rápida
# Use: node .ai-factory/scripts/init.js

const techLeadPrompt = \
Leia .ai-factory/agents/tech-lead.md
Leia .ai-factory/standards/vv-protocol.md

Assuma papel de Tech Lead.
Varra .ai-factory/MELHORIAS/*/TAREFAS.md
Atribua tarefas automaticamente.
Execute com V&V obrigatório.
\;

console.log("?? AI Factory Tech Lead");
console.log("Copie este prompt para sua IA:\n");
console.log(techLeadPrompt);
