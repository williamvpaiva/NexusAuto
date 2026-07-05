const CowAgentWrapper = require('./cowagent-wrapper.js');

async function test() {
    try {
        console.log('Inicializando CowAgentWrapper...');
        const cowagent = new CowAgentWrapper();
        console.log('CowAgent configurado e pronto!');
        
        console.log('\nListando skills disponíveis...');
        const skills = await cowagent.listSkills();
        console.log('Skills:', skills);
        
    } catch (error) {
        console.error('Erro no teste:', error);
    }
}

test();
