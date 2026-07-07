#!/usr/bin/env node
require('ts-node').register({ 
  transpileOnly: true,
  compilerOptions: { module: "commonjs", moduleResolution: "node" }
});
require('../index.ts');
