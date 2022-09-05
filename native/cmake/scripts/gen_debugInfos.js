const Fs = require('fs');
const process = require('process');
const writeIfDifferent = require('./utils').writeIfDifferent;

if (process.argv.length !== 5) {
    console.error('bad argument');
    console.error(' - input file');
    console.error(' - template file');
    console.error(' - output file');
    process.exit(-1);
}

const inputFile = process.argv[2];
const template = process.argv[3];
const outputFile = process.argv[4];

let buildDebugInfos = function() {
    let readContent = Fs.readFileSync(inputFile, 'utf-8');
    let titleRegExp = /### \d+/g;
    let debugInfos = "";

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
            errInfo = errInfo.replace(/\n/g, "\\n").replace(/\"/g, "'").replace(/\\`/g, "`");
            debugInfos = debugInfos.concat("{ ", errCode, ", \"", errInfo, "\" },\n");
        }

        result1 = result2;
    }

    let replaceData = Fs.readFileSync(template).toString('utf-8').replace("${PLACE_HOLDER}", debugInfos);
    writeIfDifferent(outputFile, replaceData, { encoding: 'utf-8' });
};

buildDebugInfos();
process.exit(0);
