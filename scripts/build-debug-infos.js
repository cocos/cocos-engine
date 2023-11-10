'use strict';

const { readFileSync, writeFileSync } = require('fs');

function buildDebugInfos () {
    let readContent = readFileSync('EngineErrorMap.md', 'utf-8');
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
    writeFileSync('DebugInfos.json', writeContent);
};

buildDebugInfos();
