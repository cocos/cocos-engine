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


// @ts-ignore
cc.game._initConfig({
    debugMode: DebugMode.INFO
});