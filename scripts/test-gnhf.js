const CowAgentWrapper = require('./cowagent-wrapper');

async function test() {
  const wrapper = new CowAgentWrapper();
  try {
    console.log('Testing GNHF dry-run...');
    await wrapper.runGNHF('Test dummy task (dry-run)');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();
