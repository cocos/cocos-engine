const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.usage('Options:')
    .help('h').alias('h', 'help')
    .string('e').alias('e', 'engine-version').describe('e', 'Specify the version of engine')
    .demandOption(['engine-version'])
    .version('1.0')
    .argv;

const targetEngineVersion = argv['engine-version'];
const versionRegExp = /\d[\d\.]*\d$/
if (!targetEngineVersion) {
    throw new Error('please specify a target engine version');
} else if (!versionRegExp.test(targetEngineVersion)) {
    throw new Error('please specify a valid engine version');
}

/**
 * This is a map for file path to file handler,
 * the parameter of each handler is the content of file,
 * each handler needs to return the handle result.
 */
const fileHandlers = {
    './package.json' (content) {
        const versionRegExp = /"version": ".*"/;
        content = content.replace(versionRegExp, `"version": "${targetEngineVersion}"`);
        return content;
    },

    './cocos/core/global-exports.ts' (content) {
        const versionRegExp = /engineVersion = '.*'/;
        content = content.replace(versionRegExp, `engineVersion = '${targetEngineVersion}'`);
        return content;
    },
};

for (filePath in fileHandlers) {
    let handler = fileHandlers[filePath];
    let content = fs.readFileSync(filePath, 'utf8');
    content = handler(content);
    if (!content) {
        throw new Error('file handler need to return the handle result');
    }
    fs.writeFileSync(filePath, content, 'utf8');
}