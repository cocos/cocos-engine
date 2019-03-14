const { generate } = require('./generate-declaration');
const { existsSync } = require('fs');
const outputFiles = generate();
if (!outputFiles || outputFiles.some((outputFile) => !existsSync(outputFile))) {
    console.error(`Failed to generate declaration files.`);
} else {
    console.log(`Generate successed. Files:\n${outputFiles.join('\n')}\n`);
}