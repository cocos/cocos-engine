const { execSync } = require('child_process');
const { join } = require('path');

const input = join(__dirname, 'division-config.ts');
const output = join(__dirname, 'division-config-schema.json');
execSync(`typescript-json-schema ${input} ModuleDivision -o ${output} --noExtraProps`);
