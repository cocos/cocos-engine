'use strict';

const assert = require('assert');
const nodeMainVersion = parseInt(process.version.match(/^v(\d+)\.\d+/)[1]);
assert(nodeMainVersion >= 8, `Node version (${process.version}) is too low, require at least NodeJS 8`);

const path = require('path');
const os = require('os');
const fs = require('fs');
const util = require('util');
const { spawnSync } = require('child_process');

const SCRIPT_DIR = __dirname;
const COCOS_NATIVE_ROOT = path.resolve(path.join(SCRIPT_DIR, '../..'));
const WORK_DIR = process.cwd();
console.log(`==> WORK_DIR: ${WORK_DIR}`);
console.log(`==> SCRIPT_DIR: ${SCRIPT_DIR}`);
console.log('==> COCOS_NATIVE_ROOT:' + COCOS_NATIVE_ROOT);

//------------------------------------------------------------------------

const EXIT_CODE_SUCCESS = 0;
const EXIT_CODE_SPAWN_ERROR = -1;
const EXIT_CODE_WRONG_ARGUMENT_COUNT = -2;
const EXIT_CODE_WRONG_ARGUMENT = -3;

console.log('==> platform: ' + os.platform());
let hostName = os.platform();
let exeSuffix = '';
if (hostName == 'darwin') {
    hostName = 'mac';
} else if (hostName == 'win32') {
    // NOTE: The external folder name is win64 for windows platform
    // hostName here is for searching platform folder in native/cocos/external
    hostName = 'win64';
    exeSuffix = '.exe';
}

// Release
const SWIG_ROOT=path.join(COCOS_NATIVE_ROOT, 'external', hostName, 'bin', 'swig');
const SWIG_EXE=path.join(SWIG_ROOT, 'bin', 'swig') + exeSuffix;
const SWIG_LIB_ARRAY=[
    path.join(SWIG_ROOT, 'share', 'swig', '4.1.0', 'javascript', 'cocos'),
    path.join(SWIG_ROOT, 'share', 'swig', '4.1.0'),
];

// // Debug
// // linux
// // const SWIG_ROOT=`/home/james/projects/swig`;
// // mac
// const SWIG_ROOT=`/Users/james/Project/cocos/swig`;

// const SWIG_EXE=path.join(SWIG_ROOT, 'build', 'Debug', 'swig');
// const SWIG_LIB_ARRAY=[
//     path.join(SWIG_ROOT, 'build'),
//     path.join(SWIG_ROOT, 'Lib', 'javascript', 'cocos'),
//     path.join(SWIG_ROOT, 'Lib'),
// ];

function ensureAbsolutePath(rootDir, filePath) {
    if (path.isAbsolute(filePath)) {
        return filePath;
    }

    return path.join(rootDir, filePath);
}

assert(fs.existsSync(SWIG_EXE), `${SWIG_EXE} doesn't exist`);

let includes = [...SWIG_LIB_ARRAY];
includes.push(COCOS_NATIVE_ROOT);
includes.push(path.join(COCOS_NATIVE_ROOT, 'cocos'));
for (const includePath of includes) {
    assert(fs.existsSync(includePath), `${includePath} doesn't exist`);
}

let swigConfig = {
    flags: [],
    includeDirs: [],
    configList: [],
};

function makeSwigConfig(configJSPath) {
    const configObj = require(configJSPath); 
    const configJSDir = path.dirname(configJSPath);

    function resolveDir(dir) {
        if (dir && dir.length > 0) {
            dir = path.normalize(dir);
            if (!path.isAbsolute(dir)) {
                dir = path.join(configJSDir, dir);
            }
            assert(fs.existsSync(dir), `${dir} doesn't exist`);
            return dir;
        }
        
        return null;
    }

    const flags = configObj.flags;
    const includeDirs = [];

    if (configObj.includeDirs instanceof Array) {
        for (let includeDir of configObj.includeDirs) {
            includeDir = resolveDir(includeDir);
            if (includeDir) {
                includeDirs.push(includeDir);
            }
        }
    }
    const interfacesDir = resolveDir(configObj.interfacesDir);
    const bindingsOutDir = resolveDir(configObj.bindingsOutDir);
    const configList = [];
    
    for (let oneConfig of configObj.configList) {
        let interfaceFile = path.normalize(oneConfig[0]);
        let outputFile = path.normalize(oneConfig[1]);
        if (!path.isAbsolute(interfaceFile)) {
            if (interfacesDir) {
                interfaceFile = path.join(interfacesDir, interfaceFile);
            } else {
                interfaceFile = path.join(configJSDir, interfaceFile);
            }
        }
        assert(fs.existsSync(interfaceFile), `(${interfaceFile}) doesn't exist`);

        if (!path.isAbsolute(outputFile)) {
            if (bindingsOutDir) {
                outputFile = path.join(bindingsOutDir, outputFile);
            } else {
                outputFile = path.join(configJSDir, outputFile);
            }

        }
        const outputDir = path.dirname(outputFile);
        assert(fs.existsSync(outputDir), `${outputDir} doesn't exist`);

        configList.push([ interfaceFile, outputFile ]);
    }

    return {
        flags,
        includeDirs,
        configList
    };
}

const commandLineArgs = process.argv.slice(2);
if (commandLineArgs.length === 0) {
    const SWIG_CONFIG_FILE_NAME = 'swig-config.js';
    let swigConfigPathPriority = [
        path.join(WORK_DIR, SWIG_CONFIG_FILE_NAME),
        path.join(SCRIPT_DIR, SWIG_CONFIG_FILE_NAME)
    ];

    for (const swigConfigPath of swigConfigPathPriority) {
        if (fs.existsSync(swigConfigPath)) {
            swigConfig = makeSwigConfig(swigConfigPath);
            break;
        }
    }
} else {
    if (commandLineArgs.includes('--help') || commandLineArgs.includes('-h')) {
        console.log(`
Usage: node genbindings.js [arguments]
       
       node genbindings.js   : Without arguments, the tool will generate binding code by the 'swig-config.js' file in current workspace

       node genbindings.js -c your_config_path.js  : Generate binding code for user modules by a config js file, For example:

            // required
            const configList = [
                [ 'your_interface_0.i', 'your_generated_file_0.cpp' ],
                [ 'your_interface_1.i', 'your_generated_file_1.cpp' ],
                // ......
            ];

            // optional
            const interfacesDir = '< The directory of your interface files >';

            // optional
            const bindingsOutDir = '< The directory of generated files > ';

            // optional
            const includeDirs = [
                '< Your custom c++ include directory 0 >',
                '< Your custom c++ include directory 1 >',
            ];

            // optional
            const flags = [
                '-DUSE_AAA=1',
                '-DUSE_BBB=0',
            ];

            module.exports = {
                interfacesDir, // Delete this line if you want to use relative path related to 'your_config_path.js'
                bindingsOutDir, // Delete this line if you want to use relative path related to 'your_config_path.js'
                includeDirs, // optional 
                flags, // optional
                configList // Required
            };

        `);
        process.exit(EXIT_CODE_SUCCESS);
    }

    console.log(`==> commandLineArgs: ${commandLineArgs}`);

    const configIndex = commandLineArgs.indexOf('-c');
    if (configIndex !== -1) {
        swigConfig = makeSwigConfig(ensureAbsolutePath(WORK_DIR, commandLineArgs[configIndex+1]));
    } else {
        console.error(`==> ERROR: Could not find -c argument`);
        process.exit(EXIT_CODE_WRONG_ARGUMENT);
    }
}

function generateBindings(swigArgs, interfaceFile, generatedCppFile) {
    console.info(`======================================================================`)
    console.info(`==> Generate Bindings: interface: ${interfaceFile}, output cpp: ${generatedCppFile}`);

    swigArgs = swigArgs.concat([
        '-o', generatedCppFile,
        interfaceFile
    ]);

    console.log(`==> exe: ${SWIG_EXE}`);
    console.log(`==> swigArgs: ${swigArgs.join(' ')}`);

    try {
        const ret = spawnSync(SWIG_EXE, swigArgs, {
            stdio: ['ignore', process.stdout, process.stderr],
        });
        let retCode = ret.status;
        if (retCode !== 0) {
            console.error(`==> ERROR: spawnSync returns ${retCode}`);
            if (typeof retCode !== 'number') {
                retCode = EXIT_CODE_SPAWN_ERROR;
            }
            process.exit(retCode);
        }
    } catch (error) {
        console.error('ERROR:', error);
        process.exit(EXIT_CODE_SPAWN_ERROR);
    }
}

let swigArgs = [
    '-c++', '-cocos', '-fvirtual', '-noexcept', '-cpperraswarn',
    '-D__clang__', '-Dfinal= ', '-DCC_PLATFORM=3', '-Dconstexpr=const', '-DCC_PLATFORM_ANDROID=3',
];

if (swigConfig.flags instanceof Array) {
    swigArgs = swigArgs.concat(swigConfig.flags);
}

if (swigConfig.includeDirs instanceof Array) {
    includes = includes.concat(swigConfig.includeDirs);
}

for (let i = 0, len = includes.length; i < len; ++i) {
    includes[i] = '-I' + includes[i];
}

swigArgs = swigArgs.concat(includes);

for (const config of swigConfig.configList) {
    generateBindings(swigArgs, config[0], config[1]);
}

if (swigConfig.configList.length > 0) {
    console.info(`======================================================================`);
    console.info(`    Congratulations, JS binding code was generated successfully!`);
    console.info(`======================================================================`);
} else {
    console.warn(`======================================================================`);
    console.warn(`    WARNING: No binding code is generated!`);
    console.warn(`======================================================================`);
}
