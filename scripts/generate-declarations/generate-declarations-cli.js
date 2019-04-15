const { generate } = require('./generate-declarations');

const successed = generate({
    outDir: './declarations',
});
if (successed) {
    console.log(`Successed.`);
} else {
    console.error(`Failed to generate declaration files.`);
}