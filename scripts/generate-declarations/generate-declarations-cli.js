const { generate } = require('./generate-declarations');

generate({
    outDir: './declarations',
}).then((successed) => {
    if (successed) {
        console.log(`Successed.`);
    } else {
        console.error(`Failed to generate declaration files.`);
    }
});