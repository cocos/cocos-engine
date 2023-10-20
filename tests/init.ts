jest.mock(
    'internal:constants',
    () => {
        const actual = jest.requireActual('./constants-for-test');
        const { getCurrentTestSuiteConfig } = jest.requireActual('./utils/test-suite-config') as
            typeof import('./utils/test-suite-config');
        const config = getCurrentTestSuiteConfig();
        if (!config.constantOverrides) {
            return actual;
        }
        return {
            ...actual,
            ...config.constantOverrides,
        };
    },
    { virtual: true, },
);

jest.mock(
    'internal:native',
    () => ({
        __esModule: true,
        default: {}
    }),
    { virtual: true, },
);

jest.mock(
    'pal/audio',
    () => jest.requireActual('../pal/audio/web/player'),
    { virtual: true, },
);

jest.mock(
    'pal/minigame',
    () => jest.requireActual('../pal/minigame/non-minigame'),
    { virtual: true, },
);

jest.mock(
    'pal/system-info',
    () => jest.requireActual('../pal/system-info/web/system-info'),
    { virtual: true, },
);

jest.mock(
    'pal/env',
    () => jest.requireActual('../pal/env/web/env'),
    { virtual: true, },
);

jest.mock(
    'pal/pacer',
    () => jest.requireActual('../pal/pacer/pacer-web'),
    { virtual: true, },
);

jest.mock(
    'pal/screen-adapter',
    () => jest.requireActual('../pal/screen-adapter/web/screen-adapter'),
    { virtual: true, },
);

jest.mock(
    'pal/input',
    () => jest.requireActual('../pal/input/web/index'),
    { virtual: true, },
);

jest.mock(
    'pal/wasm',
    () => jest.requireActual('./utils/pal-wasm-testing'),  // NOTE: fix CI, we used import.meta in wasm-web.ts
    { virtual: true, },
);

// Mock external wasm module here
[
    'external:emscripten/bullet/bullet.release.wasm.wasm',
    'external:emscripten/webgpu/webgpu_wasm.wasm',
    'external:emscripten/webgpu/glslang.wasm',
    'external:emscripten/physx/physx.release.wasm.wasm',
    'external:emscripten/spine/spine.wasm',
    'external:emscripten/box2d/box2d.release.wasm.wasm',
    'external:emscripten/meshopt/meshopt_decoder.wasm.wasm',
].forEach(mockModuleId => {
    jest.mock(mockModuleId, 
        () => ({
            __esModule: true,
            default: mockModuleId,
        }),
        { virtual: true, },
    );
});

jest.mock('../cocos/core/platform/debug', () => {
    const result = {
        __esModule: true, // Use it when dealing with esModules
        ...jest.requireActual('../cocos/core/platform/debug')
    };
    const { feed } = require('./utils/log-capture');
    for (const logMethodName of ['warn', 'error', 'warnID', 'errorID']) {
        if (result[logMethodName]) {
            const log = result[logMethodName];
            result[logMethodName] = jest.fn((...args: unknown[]) => {
                if (feed(logMethodName, ...args)) {
                    // TODO: this is an old behaviour to shut some warns
                    if (logMethodName !== 'warnID') {
                        log.call(result, ...args);
                    }
                }
            });
        }
    }
    return result;
});

jest.mock(
    'cc',
    () => jest.requireActual('../exports/base'),
    { virtual: true, },
);

jest.mock('serialization-test-helper/run-test', () => {
    return require('../tests/core/serialization/run-test');
}, {
    virtual: true,
});

import '../exports/base';
import { DebugMode } from "../cocos/core/platform/debug";
import { EffectAsset, Game, game, IGameConfig } from '../exports/base';
import './asset-manager/init';
import '../cocos/gfx/empty/empty-device';
import '../cocos/3d/skeletal-animation/data-pool-manager';
import '../cocos/animation';
import { effects } from './fixtures/builtin-effects';
import { glsl4 } from './fixtures/builtin-glsl4';
import { initBuiltinMaterial } from './fixtures/builtin-material';
import { initBuiltinPhysicsMaterial } from './fixtures/builtin-physics-material';
import '../cocos/2d/utils/dynamic-atlas/atlas-manager';

const canvas = document.createElement('canvas');
const div = document.createElement('div');
const config: IGameConfig = {
    debugMode: DebugMode.INFO,
    overrideSettings: {
        rendering: {
            renderMode: 3, // Headless Mode
        }
    }
}

async function bootstrap() {
    game.on(Game.EVENT_POST_SUBSYSTEM_INIT, () => {
        effects.forEach((e, effectIndex) => {
            const effect = Object.assign(new EffectAsset(), e);
            effect.shaders.forEach((shaderInfo, shaderIndex) => {
                const shaderSource = glsl4[effectIndex][shaderIndex];
                if (shaderSource) {
                    shaderInfo['glsl4'] = shaderSource;
                }
            });
            effect.hideInEditor = true;
            effect.onLoaded();
        });
        initBuiltinMaterial()
    });

    initBuiltinPhysicsMaterial();
    await game.init(config);
    await game.run();
}

module.exports = bootstrap;
