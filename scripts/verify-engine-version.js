const fs = require('fs');

const branchName = process.argv[2];
if (typeof branchName === 'undefined') {
    console.error('Need to specify the current branch name in git repository');
    process.exit(1);
}
const branchRegExp = /^v?(\d+\.\d+\.\d+)(?:-.*)?$/;
const matchResult = branchName.match(branchRegExp);
if (!(matchResult && matchResult[1])) {
    console.warn(`Invalid branch name: "${branchName}", skip engine version validation.`);
    process.exit(0);
}
const branchVersion = matchResult[1];

const versionRegExpMap = {
    './package.json': /"version": "(.*)"/,
    './cocos/core/global-exports.ts': /engineVersion = '(.*)'/,
};
for (const filePath in versionRegExpMap) {
    const regExp = versionRegExpMap[filePath];
    const content = fs.readFileSync(filePath, 'utf8');
    const version = content.match(regExp)[1];
    if (version !== branchVersion) {
        console.error(`Wrong engine version "${version}" in file "${filePath}", need to match branch name "${branchName}".`);
        process.exit(1);
    }
}

console.log('Engine version validation complete!');
process.exit(0);
