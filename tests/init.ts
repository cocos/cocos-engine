
jest.mock(
    'internal:constants',
    () => jest.requireActual('../cocos/core/default-constants'),
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

jest.mock('../cocos/core/platform/debug', () => {
    const result = {
        __esModule: true, // Use it when dealing with esModules
        ...jest.requireActual('../cocos/core/platform/debug'),
    };
    if (result.warnID) {
        result.warnID = jest.fn();
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
import { EffectAsset, game, IGameConfig } from '../exports/base';
import './asset-manager/init';
import '../cocos/core/gfx/empty/empty-device';
import '../cocos/3d/skeletal-animation/data-pool-manager';
import '../cocos/core/animation';
import "../exports/physics-physx";
import "../exports/physics-builtin";
import "../exports/wait-for-ammo-instantiation";
import "../exports/physics-ammo";
import "../exports/physics-cannon";
import { effects } from './fixtures/builtin-effects';
import { glsl4 } from './fixtures/builtin-glsl4';

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
globalThis.waitThis((async () => {
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
    await game.init(config);
    await game.run();
})());
