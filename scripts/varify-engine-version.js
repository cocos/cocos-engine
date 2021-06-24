const fs = require('fs');
const vGit = require('v-git');

const repo = vGit.init('../');
const branchName = repo.branch;
const branchRegExp = /^v?(\d+\.\d+\.\d+)(?:-.*)?$/
const matchResult = branchName.match(branchRegExp);
if (!(matchResult && matchResult[1])) {
    console.warn(`Invalid branch name: "${branchName}", skip engine version validation.`)
    process.exit(0);
}
const branchVersion = matchResult[1];

const versionRegExpMap = {
    './package.json': /"version": "(.*)"/,
    './cocos/core/global-exports.ts': /engineVersion = '(.*)'/,
};
for (filePath in versionRegExpMap) {
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
