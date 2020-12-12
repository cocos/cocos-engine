const { execSync } = require('child_process');
const { join } = require('path');
const configs = [
    {
        dir: 'modules-entry',
        type: 'ModuleEntryConfig',
    },
    {
        dir: 'modules-render',
        type: 'ModuleRenderConfig',
    },
];
configs.forEach((item) => {
    const input = join(__dirname, item.dir, 'types.ts');
    const output = join(__dirname, item.dir, 'schema.json');
    execSync(`typescript-json-schema ${input} ${item.type} -o ${output} --noExtraProps`);
    console.log(`Generate schema.json for ${item.dir}`);
});
