const fs = require('fs-extra');
const ps = require('path');
const { buildEngine, StatsQuery } = require('@cocos/ccbuild');

const args = process.argv.slice(2);
if (args.length == 0) {
    console.error('Please specify the engine root path');
    process.exit(1);
}
const engineRoot = args[0];

console.log(`Engine root: ${engineRoot}`);

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

const features2DEmptyLegacyPipeline = [
    "2d",
    "audio",
    "base",
    "gfx-webgl2",
    "legacy-pipeline",
];

const features2DLegacyPipeline = [...features2DCommon, "legacy-pipeline"];
const features2DNewPipeline = [...features2DCommon, "custom-pipeline", "custom-pipeline-builtin-scripts"];

console.log(`2d features: [ ${features2DLegacyPipeline.join(', ')} ]`);

async function buildEngineForFeatures(options) {
    console.log(`>>> ==============================================================`);
    console.log(`>>> ============== features: ${options.features.join(', ')}`);
    console.log(`>>> ============== outDir: ${options.outDir}`);
    const outDir = options.outDir;
    const ccbuildOptions = {
        engine: engineRoot,
        out: outDir,
        platform: options.platform,
        moduleFormat: "system",
        compress: true,
        split: false,
        nativeCodeBundleMode: options.nativeCodeBundleMode,
        assetURLFormat: "runtime-resolved",
        noDeprecatedFeatures: options.noDeprecatedFeatures,
        sourceMap: false,
        features: options.features,
        loose: true,
        mode: "BUILD",
        flags: {
            DEBUG: false,
            NET_MODE: 0,
            SERVER_MODE: false
        },
        wasmCompressionMode: options.wasmCompressionMode,
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

    await buildEngine(ccbuildOptions);
}

(async () => {
    const statsQuery = await StatsQuery.create(engineRoot);

    const excludeFeatures = [
        'vendor-google',
        'xr',
    ];
    
    const allFeatures = statsQuery.getFeatures().filter(feature => !excludeFeatures.includes(feature));
    console.log(`all features: [ ${allFeatures.join(', ')} ]`);

    await buildEngineForFeatures({
        features: allFeatures,
        outDir: ps.join(engineRoot, 'build-cc-out-all'),
        noDeprecatedFeatures: false,
        platform: "WECHAT",
        nativeCodeBundleMode: "wasm",
        wasmCompressionMode: 'brotli',
    });

    await buildEngineForFeatures({
        features: allFeatures,
        outDir: ps.join(engineRoot, 'build-cc-out-all-web'),
        noDeprecatedFeatures: false,
        platform: "HTML5",
    });

    await buildEngineForFeatures({
        features: features2DLegacyPipeline,
        outDir: ps.join(engineRoot, 'build-cc-out-2d-legacy-pipline'),
        noDeprecatedFeatures: true,
        platform: "WECHAT",
        nativeCodeBundleMode: "wasm",
        wasmCompressionMode: 'brotli',
    });

    await buildEngineForFeatures({
        features: features2DNewPipeline,
        outDir: ps.join(engineRoot, 'build-cc-out-2d-new-pipline'),
        noDeprecatedFeatures: true,
        platform: "WECHAT",
        nativeCodeBundleMode: "wasm",
        wasmCompressionMode: 'brotli',
    });
    
    await buildEngineForFeatures({
        features: features2DEmptyLegacyPipeline,
        outDir: ps.join(engineRoot, 'build-cc-out-2d-empty-legacy-pipline'),
        noDeprecatedFeatures: true,
        platform: "WECHAT",
        nativeCodeBundleMode: "wasm",
        wasmCompressionMode: 'brotli',
    });
})();
