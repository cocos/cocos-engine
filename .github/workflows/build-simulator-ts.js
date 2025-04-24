const { join, normalize } = require('path');
const { ensureDir, emptyDir } = require('fs-extra');

const { buildEngine, StatsQuery } = require('@cocos/ccbuild');

const args = process.argv;

if (args.length < 3) {
    console.error(`==> exclude modules were not passed in!`);
    process.exit(1);
}

const spineVersion = args[2];

function excludeFeatures(features, exclude) {
    return features.filter((feature) => !exclude.includes(feature));
}

(async function exec () {
    const engineDir = normalize(join(__dirname, '..', '..'));
    const engineOutput = join(engineDir, 'bin', 'native-preview');

    console.log(`==> engineDir: ${engineDir}`);
    console.log(`==> engineOutput: ${engineOutput}`);

    await ensureDir(engineOutput);
    await emptyDir(engineOutput);

    const buildMode = 'PREVIEW';
    const buildPlatform = 'NATIVE';

    const statsQuery = await StatsQuery.create(engineDir);

    allFeatures = excludeFeatures(statsQuery.getFeatures(), ['gfx-webgpu', 'vendor-google']);
    allFeatures = allFeatures.filter((feature) => !feature.startsWith('spine-'))

    allFeatures.push(spineVersion);

    console.log(`-----------------------------------------------`);
    console.log(`==> features: ${allFeatures.join(', \n')}`);
    console.log(`-----------------------------------------------`);

    const buildOptions = {
        engine: engineDir,
        out: engineOutput,
        moduleFormat: 'system',
        compress: false,
        targets: 'chrome 80',
        split: true,
        nativeCodeBundleMode: 'wasm',
        platform: buildPlatform,
        mode: buildMode,
        features: allFeatures,
        flags: {
            DEBUG: true,
            SERVER_MODE: false,
        },
    };
    await buildEngine(buildOptions);

}());
