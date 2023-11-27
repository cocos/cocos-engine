const fs = require('fs-extra');
const ps = require('path');

function formatPath (path) {
    return path.replace(/\\/g, '/');
}

function buildDebugInfos () {
    let readContent = fs.readFileSync(formatPath(ps.join(__dirname, '../../../../EngineErrorMap.md')), 'utf-8');
    let titleRegExp = /### \d+/g;
    let debugInfos = {};

    let result1 = titleRegExp.exec(readContent);
    while (result1) {
        let result2 = titleRegExp.exec(readContent);
        let errInfoHead = result1.index + result1[0].length;
        let errInfoTail = result2? result2.index: readContent.length;

        let errCode = /\d+/.exec(result1[0])[0];
        let errInfo = readContent.slice(errInfoHead, errInfoTail);
        errInfo = errInfo.replace(/```/g, ' ');
        errInfo = errInfo.trim();
        errInfo = errInfo.replace(/\r\n/g, '\n');

        if (!errInfo.includes('<!-- DEPRECATED -->')) {
            debugInfos[`${errCode}`] = errInfo;
        }

        result1 = result2;
    }

    let writeContent = JSON.stringify(debugInfos, null, 4);
    fs.outputFileSync(formatPath(ps.join(__dirname, '../lib/DebugInfos.json')), writeContent);

    const dtsContent = `
/**
 * This is a declaration file for 'DebugInfos.json'
 * which is generated from 'EngineErrorMap.md'.
 * You may run cli command
 * \`npm run build\` to generate the json file.
 */

/**
 * Engine error maps.
 * The keys are error codes and their values are format strings.
 */
declare const $: Record<number, string>;

export default $;`;
    fs.outputFileSync(formatPath(ps.join(__dirname, '../lib/DebugInfos.d.ts')), dtsContent);
};

buildDebugInfos();