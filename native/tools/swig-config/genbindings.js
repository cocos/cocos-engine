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

//------------------------------------------------------------------------
// User module configuration
const PROJECT_ROOT = WORK_DIR; // You could also override the setting of PROJECT_ROOT by an absolute path

const swigConfigUser = [
    // Add your .i and output cpp file paths, we use relative path here for configuring many module easiler.
    // [ 'my_new_module_user.i', 'jsb_my_new_module_user_auto.cpp' ], 
];

// Convert relative path to absolute path, don't need them if you have already used absolute path in `swigConfigUser` variable.
if (swigConfigUser.length > 0) {
    const interfacesDirUser = path.join(PROJECT_ROOT, 'tools', 'swig-config');
    const bindingsOutDirUser = path.join(PROJECT_ROOT, 'native', 'engine', 'common', 'Classes', 'bindings', 'auto');
    for (let config of swigConfigUser) {
        if (!path.isAbsolute(config[0])) {
            config[0] = path.join(interfacesDirUser, config[0]);
        }
        if (!path.isAbsolute(config[1])) {
            config[1] = path.join(bindingsOutDirUser, config[1]);
        }
    }
}
//------------------------------------------------------------------------
console.log(`==> SCRIPT_DIR: ${SCRIPT_DIR}`);
console.log('==> COCOS_NATIVE_ROOT:' + COCOS_NATIVE_ROOT);
//------------------------------------------------------------------------
// Engine Module Configuration
const swigConfigEngine = [
    [ '2d.i', 'jsb_2d_auto.cpp' ],
    [ 'assets.i', 'jsb_assets_auto.cpp' ],
    [ 'audio.i', 'jsb_audio_auto.cpp' ],
    [ 'cocos.i', 'jsb_cocos_auto.cpp' ],
    [ 'dragonbones.i', 'jsb_dragonbones_auto.cpp' ],
    [ 'editor_support.i', 'jsb_editor_support_auto.cpp' ],
    [ 'extension.i', 'jsb_extension_auto.cpp' ],
    [ 'geometry.i', 'jsb_geometry_auto.cpp' ],
    [ 'gfx.i', 'jsb_gfx_auto.cpp' ],
    [ 'network.i', 'jsb_network_auto.cpp' ],
    [ 'physics.i', 'jsb_physics_auto.cpp' ],
    [ 'pipeline.i', 'jsb_pipeline_auto.cpp' ],
    [ 'scene.i', 'jsb_scene_auto.cpp' ],
    [ 'spine.i', 'jsb_spine_auto.cpp' ],
    [ 'webview.i', 'jsb_webview_auto.cpp' ],
    [ 'video.i', 'jsb_video_auto.cpp' ],
    [ 'renderer.i', 'jsb_render_auto.cpp' ],
];

// Convert to absolute path
const interfacesDirEngine = path.join(COCOS_NATIVE_ROOT, 'tools', 'swig-config');
const bindingsOutDirEngine = path.join(COCOS_NATIVE_ROOT, 'cocos', 'bindings', 'auto');

for (let config of swigConfigEngine) {
    config[0] = path.join(interfacesDirEngine, config[0]);
    config[1] = path.join(bindingsOutDirEngine, config[1]);
}
//------------------------------------------------------------------------

const EXIT_CODE_SUCCESS = 0;
const EXIT_CODE_SPAWN_ERROR = -1;
const EXIT_CODE_WRONG_ARGUMENT_COUNT = -2;

console.log('platform: ' + os.platform());
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

function exists(path) {
    try {
        if (fs.existsSync(path)) {
            return true;
        }
    } catch(err) {
        console.error(err)
    }
    return false;
}

assert(exists(SWIG_EXE), `${SWIG_EXE} doesn't exist`);

const includes = [...SWIG_LIB_ARRAY];
includes.push(COCOS_NATIVE_ROOT);
includes.push(path.join(COCOS_NATIVE_ROOT, 'cocos'));
for (const includePath of includes) {
    assert(exists(includePath), `${includePath} doesn't exist`);
}

for (let i = 0, len = includes.length; i < len; ++i) {
    includes[i] = '-I' + includes[i];
}

let swigConfigArray;

const commandLineArgs = process.argv.slice(2);
if (commandLineArgs.length === 0) {
    swigConfigArray = swigConfigUser.length > 0 ? swigConfigUser : swigConfigEngine;
} else {
    swigConfigArray = [];

    if (commandLineArgs.includes('--help') || commandLineArgs.includes('-h')) {
        console.log(`
Usage: node genbindings.js [arguments]
       
       node genbindings.js   : Without arguments will generate binding code for modules
            listed in 'swigConfigUser' or 'swigConfigEngine' at the beginning of genbindings.js,
            if 'swigConfigUser' is not empty, generate bindings for modules defined in 'swigConfigUser' only,
            otherwise, generate bindings for internal modules in engine.

       node genbindings.js your_dot_i_path1 your_output_path1 your_dot_i_path2 your_output_path2 ...  : Generate binding code for user modules passed in by command line arguments

       node genbindings.js --all  : Generate binding code for modules listed in 'swigConfigUser' and 'swigConfigEngine' at the beginning of genbindings.js.

Note: 1. If your have many modules, you could pass multiple interface file and output file in sequencely
      2. Interface file and output file should be in pair
      3. If you don't want to pass interface files and output files in command line every time, you could modify 'swigConfigUser' at the beginning of genbindings.js
        `);
        process.exit(EXIT_CODE_SUCCESS);
    }

    console.log(`==> commandLineArgs: ${commandLineArgs}`);

    if (commandLineArgs.includes('--all')) {
        swigConfigArray = swigConfigEngine.concat(swigConfigUser);
    } else {
        if (commandLineArgs.length % 2 !== 0) {
            console.error(`==> ERROR: Wrong arugment count (${commandLineArgs.length}) , interface file and output file should in pair`);
            process.exit(EXIT_CODE_WRONG_ARGUMENT_COUNT);
        }

        for (let i = 0; i < commandLineArgs.length; i += 2) {
            swigConfigArray.push([commandLineArgs[i], commandLineArgs[i+1]]);
        }
    }
}

function generateBindings(interfaceFile, generatedCppFile) {
    console.log(`==> generateBindings: interface: ${interfaceFile}, cpp: ${generatedCppFile}`);
    let swigArgs = [
        '-c++', '-cocos', '-fvirtual', '-noexcept', '-cpperraswarn',
        '-D__clang__', '-Dfinal= ', '-DCC_PLATFORM=3', '-Dconstexpr=const', '-DCC_PLATFORM_ANDROID=3',
    ];
    swigArgs = swigArgs.concat(includes, [
        '-o', generatedCppFile,
        interfaceFile
    ]);

    console.log(`==> exe: ${SWIG_EXE}`);
    console.log(`==> swigArgs: ${swigArgs.join(' ')}`);

    try {
        const ret = spawnSync(SWIG_EXE, swigArgs, {
            stdio: ['ignore', process.stdout, process.stderr],
        });
        if (ret.status !== 0) {
            process.exit(ret.status);
        }
    } catch (error) {
        console.error('ERROR:', error);
        process.exit(EXIT_CODE_SPAWN_ERROR);
    }
}

for (const config of swigConfigArray) {
    generateBindings(config[0], config[1]);
}

if (swigConfigArray.length > 0) {
    console.info(`======================================================================`)
    console.info(`    Congratulations, JS binding code was generated successfully!`);
    console.info(`======================================================================`)
} else {
    console.warn(`======================================================================`)
    console.warn(`    WARNING: No binding code is generated!`);
    console.warn(`======================================================================`)
}
