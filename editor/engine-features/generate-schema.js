const { execSync } = require('child_process');
const { join } = require('path');

const input = join(__dirname, 'types.ts');
const output = join(__dirname, 'schema.json');
execSync(`typescript-json-schema ${input} ModuleRenderConfig -o ${output} --noExtraProps`);
