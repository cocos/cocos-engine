const ps = require('path');
const fs = require('fs-extra');

const CocosConfig ='cocos.compile.config.json';

const currentInfo = {
    cocosParams: {},
    projectPath: '',
}

function getParams() {
    if (currentInfo.cocosParams) {
        return currentInfo.cocosParams;
    }
    currentInfo.cocosParams = fs.readJsonSync(ps.join(getCurrentProject(),CocosConfig));
    return currentInfo.cocosParams;
}

function getCurrentProjectFromArgs() {
    const index = process.argv.findIndex((item) => item === '--project');
    if (index === -1) {
        throw Error('--project is required');
    }
    const projectPath = process.argv[index + 1];
    if (!fs.existsSync(projectPath)) {
        throw Error(`Project path ${projectPath} is not exist!`);
    }
    currentInfo.projectPath = projectPath
    return projectPath;
}

function getCurrentProject () {
    if (currentInfo.projectPath) {
        return currentInfo.projectPath;
    }
    return getCurrentProjectFromArgs();
}

module.exports = {
    currentInfo,
    getCurrentProject,
    getParams,
}
