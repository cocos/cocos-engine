
const ps = require('path');
const fs = require('fs-extra');

const CocosConfig ='cocos.compile.config.json';

const currentInfo = {
    cocosParams: null,
    projectPath: '',
}

function getParams() {
    if (currentInfo.cocosParams) {
        return currentInfo.cocosParams;
    }
    currentInfo.cocosParams = fs.readJsonSync(ps.join(getCurrentProject(), CocosConfig));
    if (!currentInfo.cocosParams) {
        throw new Error(`can not get cocosParams in ${CocosConfig}`);
    }
    return currentInfo.cocosParams;
}

function getCurrentProjectFromArgs() {
    // const index = process.argv.findIndex((item) => item === '--project');
    // if (index === -1) {
    //     throw Error('--project is required');
    // }
    const projectPath = process.argv[2];
    if (!fs.existsSync(projectPath)) {
        throw Error(`Project path ${projectPath} is not exist!`);
    }
    currentInfo.projectPath = projectPath;
    return projectPath;
}

function getTasksFromArgs() {
    // const taskStr = process.argv.find((item) => item === '--task');
    // if (!taskStr) {
    //     throw Error('--task is required');
    // }
    // return taskStr.split(',');
    return process.argv[3].split(',');
}

function getCurrentProject () {
    if (currentInfo.projectPath) {
        return currentInfo.projectPath;
    }
    return getCurrentProjectFromArgs();
}

// main
const cocosParams = getParams();
const { nativePackToolMg } = require('../dist/index');
nativePackToolMg.init(cocosParams);

const tasks = getTasksFromArgs();

let promise = Promise.resolve();
// run all task
tasks.forEach((taskName) => {
    promise = promise.then(() => {
        console.log(`Start run pack task ${taskName}`);
        return nativePackToolMg[taskName](cocosParams.platform);
    });
});

promise.then(() => {
    console.log(`run task ${tasks} success!`);
    process.exit();
}).catch((error) => {
    console.log(error);
    process.exit(-1);
});