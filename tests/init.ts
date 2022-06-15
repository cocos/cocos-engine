
jest.mock(
    'internal:constants',
    () => jest.requireActual('./constants-for-test'),
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
import { game, IGameConfig } from '../exports/base';
import './asset-manager/init';
import '../cocos/core/gfx/empty/empty-device';
import '../cocos/3d/skeletal-animation/data-pool-manager';
import '../cocos/core/animation';
import '../cocos/2d/utils/dynamic-atlas/atlas-manager';

const canvas = document.createElement('canvas');
const div = document.createElement('div');
const config: IGameConfig = {
    customJointTextureLayouts: [],
    debugMode: DebugMode.INFO,
    renderMode: 3, // Headless Mode
    adapter: {
        canvas: canvas,
        frame: div,
        container: div
    }
}
game.init(config);
game.run();