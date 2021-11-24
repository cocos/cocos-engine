
import { debug, DebugMode, log, _resetDebugSetting } from '../../cocos/core/platform/debug';

describe('Logging', () => {
    test('Debug mode', () => {
        const debugSpy = jest.spyOn(globalThis.console, 'debug');
        const logSpy = jest.spyOn(globalThis.console, 'log');

        _resetDebugSetting(DebugMode.VERBOSE);
        debug('Hiya');
        log('Hiya');
        expect(debugSpy).toBeCalledTimes(1);
        expect(debugSpy).toBeCalledWith('Hiya');
        expect(logSpy).toBeCalledTimes(1);
        expect(logSpy).toBeCalledWith('Hiya');
        debugSpy.mockClear();
        logSpy.mockClear();

        _resetDebugSetting(DebugMode.INFO);
        debug('Hiya');
        log('Hiya');
        expect(debugSpy).toBeCalledTimes(0);
        expect(logSpy).toBeCalledTimes(1);
        expect(logSpy).toBeCalledWith('Hiya');
        debugSpy.mockClear();
        logSpy.mockClear();

        debugSpy.mockRestore();
        logSpy.mockRestore();
    });
});