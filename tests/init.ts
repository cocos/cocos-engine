
jest.mock(
    'internal:constants',
    () => jest.requireActual('../cocos/core/default-constants'),
    { virtual: true, },
);

jest.mock('../cocos/core/platform/debug', () => {
    const result = {
        __esModule: true, // Use it when dealing with esModules
        ...jest.requireActual('../cocos/core/platform/debug'),
    };
    if (result.warnID) {
        result.warnID = jest.fn(result.warnID);
    }
    return result;
});

import '../exports/base';
import { DebugMode } from "../cocos/core/platform/debug";


cc.game._initConfig({
    debugMode: DebugMode.INFO,
});
// cc.game.init({
//     debugMode: DebugMode.INFO,
//     adapter: {
//         canvas: document.createElement('canvas'),
//         frame: {},
//         container: {}
//     }
// });
