const fs = require('fs-extra');
const ps = require('path');
const { buildEngine } = require('@cocos/ccbuild');

const args = process.argv.slice(2);
if (args.length == 0) {
    console.error('Please specify the engine root path');
    process.exit(1);
}
const engineRoot = args[0];

console.log(`Engine root: ${engineRoot}`);

const exportsDir = ps.join(engineRoot, 'exports');
const files = fs.readdirSync(exportsDir);

const allFeatures = [];
files.forEach(file => {
    const filePath = ps.join(exportsDir, file);
    const feature = ps.parse(ps.basename(filePath)).name;
    if (feature !== 'vendor-google' && feature !== 'xr') {
        allFeatures.push(feature);
    }
});
allFeatures.push('meshopt'); // meshopt feature doesn't have a module entry in 'exports' directory, so append it manually here.

console.log(`all features: [ ${allFeatures.join(', ')} ]`);

const features2DCommon = [
    "2d",
    "affine-transform",
    "animation",
    "audio",
    "base",
    "dragon-bones",
    "gfx-webgl",
    "gfx-webgl2",
    "graphics",
    "intersection-2d",
    "mask",
    "particle-2d",
    "physics-2d-framework",
    "physics-2d-builtin",
    "physics-2d-box2d",
    "physics-2d-box2d-wasm",
    "profiler",
    "rich-text",
    "spine",
    "tiled-map",
    "tween",
    "ui",
    "ui-skew",
    "video",
    "webview",
];

// "custom-pipeline",
// "custom-pipeline-builtin-scripts",
// "custom-pipeline-post-process",

const features2DLegacyPipeline = [...features2DCommon, "legacy-pipeline"];

console.log(`2d features: [ ${features2DLegacyPipeline.join(', ')} ]`);

async function buildEngineForFeatures(features, outDir) {
    const options = {
        engine: engineRoot,
        out: outDir,
        platform: "WECHAT",
        moduleFormat: "system",
        compress: true,
        split: false,
        nativeCodeBundleMode: "wasm",
        assetURLFormat: "runtime-resolved",
        noDeprecatedFeatures: true,
        sourceMap: false,
        features,
        loose: true,
        mode: "BUILD",
        flags: {
            DEBUG: false,
            NET_MODE: 0,
            SERVER_MODE: false
        },
        wasmCompressionMode: 'brotli',
        inlineEnum: true,
        mangleProperties: {
            mangleList: [
                'UITransform._sortSiblings',
                'UITransform._cleanChangeMap',
                'Node._findComponents',
                'Node._findChildComponent',
                'Node._findChildComponents',
                'Node.idGenerator',
                'Node._stacks',
                'Node._stackId',
                'Node._setScene',
                'EffectAsset._layoutValid',
                'EffectAsset._effects',
                'ReflectionProbe.DEFAULT_CUBE_SIZE',
                'ReflectionProbe.DEFAULT_PLANER_SIZE',
                'WebGLDeviceManager.setInstance',
                'WebGL2DeviceManager.setInstance',
                'CanvasPool',
            ],
            dontMangleList: [
                'Component',
            ],
        },
    };

    await fs.ensureDir(outDir);
    await fs.emptyDir(outDir);

    await buildEngine(options);
}

(async () => {
    await buildEngineForFeatures(allFeatures, ps.join(engineRoot, 'build-cc-out-all'));
    await buildEngineForFeatures(features2DLegacyPipeline, ps.join(engineRoot, 'build-cc-out-2d-legacy-pipline'));
})();
