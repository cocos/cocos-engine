
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
    'pal/systemInfo',
    () => jest.requireActual('../pal/system/web/system'),
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

import '../exports/base';
import { DebugMode } from "../cocos/core/platform/debug";
import { game, IGameConfig } from '../exports/base';

const canvas = document.createElement('canvas');
const div = document.createElement('div');
const config: IGameConfig = {
    debugMode: DebugMode.INFO,
    renderMode: 0,
    adapter: {
        canvas: canvas,
        frame: div,
        container: div
    }
}
game.init(config);
game.run();