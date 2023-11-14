const { readFileSync, writeFileSync } = require('fs');
const { magenta } = require('chalk');

const prefix = ''.padStart(20, '=');
console.log(magenta(`${prefix} Build debug infos ${prefix}`));
function buildDebugInfos () {
    const readContent = readFileSync('EngineErrorMap.md', 'utf-8');
    const titleRegExp = /### \d+/g;
    const debugInfos = {};

    let result1 = titleRegExp.exec(readContent);
    while (result1) {
        const result2 = titleRegExp.exec(readContent);
        const errInfoHead = result1.index + result1[0].length;
        const errInfoTail = result2 ? result2.index : readContent.length;

        const errCode = /\d+/.exec(result1[0])[0];
        let errInfo = readContent.slice(errInfoHead, errInfoTail);
        errInfo = errInfo.replace(/```/g, ' ');
        errInfo = errInfo.trim();
        errInfo = errInfo.replace(/\r\n/g, '\n');

        if (!errInfo.includes('<!-- DEPRECATED -->')) {
            debugInfos[`${errCode}`] = errInfo;
        }

        result1 = result2;
    }

    const writeContent = JSON.stringify(debugInfos, null, 4);
    writeFileSync('DebugInfos.json', writeContent);
}

buildDebugInfos();
