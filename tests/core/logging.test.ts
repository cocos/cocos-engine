
import { debug, DebugMode, _resetDebugSetting } from '../../cocos/core/platform/debug';

describe('Logging', () => {
    test('Verbose level', () => {
        const spy = jest.spyOn(globalThis.console, 'debug');

        _resetDebugSetting(DebugMode.VERBOSE);
        debug('Hiya');
        expect(spy).toBeCalledTimes(1);
        expect(spy).toBeCalledWith('Hiya');
        spy.mockClear();

        _resetDebugSetting(DebugMode.INFO);
        debug('Hiya');
        expect(spy).toBeCalledTimes(0);
        spy.mockClear();

        spy.mockRestore();
    });
});