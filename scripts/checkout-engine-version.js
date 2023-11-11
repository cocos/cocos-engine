const fs = require('fs');
// for adding options
// const argv = require('yargs/yargs')(process.argv.slice(3))
//     .usage('npm run checkout-engine-version -- [engine-version] [options]')
//     .help('h').alias('h', 'help')
//     .version('1.0')
//     .argv;

const targetEngineVersion = process.argv[2];
const versionRegExp = /^\d+\.\d+\.\d+$/;
if (!targetEngineVersion) {
    console.error('please specify a target engine version');
    process.exit(1);
} else if (!versionRegExp.test(targetEngineVersion)) {
    console.error('please specify a valid engine version');
    process.exit(1);
}

/**
 * This is a map for file path to file handler,
 * the parameter of each handler is the content of file,
 * each handler needs to return the handle result.
 */
const fileHandlers = {
    './package.json': function (content) {
        const versionRegExp = /"version": ".*"/;
        content = content.replace(versionRegExp, `"version": "${targetEngineVersion}"`);
        return content;
    },

    './cocos/core/global-exports.ts': function (content) {
        const versionRegExp = /engineVersion = '.*'/;
        content = content.replace(versionRegExp, `engineVersion = '${targetEngineVersion}'`);
        return content;
    },
};

for (const filePath in fileHandlers) {
    const handler = fileHandlers[filePath];
    let content = fs.readFileSync(filePath, 'utf8');
    content = handler(content);
    if (!content) {
        console.error('file handler need to return the handle result');
        process.exit(1);
    }
    fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Checkout engine version complete!');
process.exit(0);
