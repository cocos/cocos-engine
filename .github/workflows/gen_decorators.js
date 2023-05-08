/// generate jsb decorators 


/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const os = require('os');

const contentLines = [];
process.on('message', (msg) => {
    if (msg.event === 'write-decorator') {
        contentLines.push({ className: msg.className, lines: msg.lines });
    }
});

const engineDir = path.resolve(__dirname, '../..');
const tmpDir = os.tmpdir();

const BUILD_CONFIG = {
    options: {
        engine: engineDir,
        platform: 'HTML5',
        moduleFormat: 2,
        compress: false,
        split: false,
        ammoJsWasm: 'fallback',
        assetURLFormat: 'runtime-resolved',
        noDeprecatedFeatures: false,
        engineName: 'cocos-js',
        sourceMaps: false,
        features: [
            '2d', '3d',
            'animation', 'audio',
            'base', 'dragon-bones',
            'gfx-webgl', 'gfx-webgl2',
            'intersection-2d', 'light-probe',
            'marionette', 'particle',
            'particle-2d', 'physics-2d-box2d',
            'physics-ammo', 'primitive',
            'profiler', 'skeletal-animation',
            'spine', 'terrain',
            'tiled-map', 'tween',
            'ui', 'video',
            'websocket', 'webview',
        ],
        loose: true,
        mode: 'BUILD',
        flags: { DEBUG: false, UI_GPU_DRIVEN: false },
        name: 'cocos-js',
        // incremental: 'C:\\Users\\ADMINI~1\\AppData\\Local\\Temp\\CocosCreator\\3.7.2\\builder\\engine\\8e98547c3502329ef2d27ebed2ca0eac.watch-files.json',
        //out: 'C:\\Users\\ADMINI~1\\AppData\\Local\\Temp\\CocosCreator\\3.7.2\\builder\\engine\\8e98547c3502329ef2d27ebed2ca0eac',
        out: tmpDir,
        buildTimeConstants: {
            HTML5: true,
            NATIVE: false,
            WECHAT: false,
            BAIDU: false,
            XIAOMI: false,
            ALIPAY: false,
            TAOBAO: false,
            BYTEDANCE: false,
            OPPO: false,
            VIVO: false,
            HUAWEI: false,
            COCOSPLAY: false,
            QTT: false,
            LINKSURE: false,
            EDITOR: false,
            PREVIEW: false,
            BUILD: true,
            TEST: false,
            DEBUG: true,
            SERVER_MODE: false,
            DEV: false,
            MINIGAME: false,
            RUNTIME_BASED: false,
            SUPPORT_JIT: true,
            JSB: false,
            NOT_PACK_PHYSX_LIBS: false,
            NET_MODE: 0,
            WEBGPU: false,
        },
        generateDecoratorsForJSB: true,
        // metaFile: 'C:\\Users\\ADMINI~1\\AppData\\Local\\Temp\\CocosCreator\\3.7.2\\builder\\engine\\8e98547c3502329ef2d27ebed2ca0eac.meta\\meta.json'
    },
};

process.env.ENGINE_PATH = engineDir;

const buildEngine = require(`${engineDir}/scripts/build-engine/dist/index.js`);

buildEngine.build(BUILD_CONFIG.options).then((result) => {
    console.log('done!!!');

    console.log(result);
    const sortedLines = contentLines.sort((a, b) => a.className.localeCompare(b.className)).map((x) => x.lines.join('\n')).join('\n');
    const destFile = path.join(engineDir, 'cocos/native-binding/decorators.ts');
    fs.writeFileSync(destFile, `${sortedLines}\n`, 'utf8');
    process.exit(0);
}).catch((err) => {
    console.error(err);
    process.exit(-1);
});
