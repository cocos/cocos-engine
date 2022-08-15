const path = require('path');
const os = require('os');
const fs = require('fs');
const util = require('util');

const assert = require('assert');

const { spawnSync } = require('child_process');

const nodeMainVersion = parseInt(process.version.match(/^v(\d+)\.\d+/)[1]);
console.log('node main version: ' + nodeMainVersion + ', version: ' + process.version);
if (nodeMainVersion < 8) {
    console.error(`Node version (${process.version}) is too low, require at least NodeJS 8`);
    process.exit(-1);
}

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

const COCOS_NATIVE_ROOT = path.resolve('../..');
console.log('COCOS_NATIVE_ROOT:' + COCOS_NATIVE_ROOT);

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

const swigConfigMap = [
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

function generateBindings(interfaceFile, generatedCppFile) {
    console.log(`==> generateBindings: interface: ${interfaceFile}, cpp: ${generatedCppFile}`);
    let args = [
        '-c++', '-cocos', '-fvirtual', '-noexcept', '-cpperraswarn',
        '-D__clang__', '-Dfinal= ', '-DCC_PLATFORM=3', '-Dconstexpr=const', '-DCC_PLATFORM_ANDROID=3',
    ];
    args = args.concat(includes, [
        '-o', path.join(COCOS_NATIVE_ROOT, 'cocos', 'bindings', 'auto', generatedCppFile),
        path.join(COCOS_NATIVE_ROOT, 'tools', 'swig-config', interfaceFile)
    ]);
    console.log(`==> args:${args.join(' ')}`);
    console.log(`exe: ${SWIG_EXE}`);
    try {
        const ret = spawnSync(SWIG_EXE, args, {
            stdio: ['ignore', process.stdout, process.stderr],
        });
        if (ret.status !== 0) {
            process.exit(-1);
        }
    } catch (error) {
        console.error('ERROR:', error);
        process.exit(-2);
    }
}

for (const config of swigConfigMap) {
    generateBindings(config[0], config[1]);
}

