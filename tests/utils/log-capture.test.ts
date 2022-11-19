import { error, errorID, warn, warnID } from "../../cocos/core";
import { captureErrorIDs, captureErrors, captureWarnIDs, captureWarns } from "./log-capture";

describe('Log capture', () => {
    test.each([
        ['Capture warns', captureWarns, warn],
        ['Capture errors', captureErrors, error],
    ])('%s', (_title, captureX, logX) => {
        logX(`This is a test-purpose log. Ignore it no matter its log level.`);

        const watcher = captureX();
        // Previous logs are not captured.
        expect(watcher.captured).toHaveLength(0);

        logX(`This log should not be presented!!`);
        expect(watcher.captured).toHaveLength(1);
        expect(watcher.captured[0][0]).toStrictEqual(`This log should not be presented!!`);

        watcher.clear();
        expect(watcher.captured).toHaveLength(0);

        logX(`This log should not be presented!!`);
        expect(watcher.captured).toHaveLength(1);
        expect(watcher.captured[0][0]).toStrictEqual(`This log should not be presented!!`);
        watcher.stop();
        // .stop() clear the captures
        expect(watcher.captured).toHaveLength(0);

        logX(`This is a test-purpose log. Ignore it.`);
        expect(watcher.captured).toHaveLength(0);
    });

    test.each([
        ['Capture warn IDs', captureWarnIDs, warnID],
        ['Capture error IDs', captureErrorIDs, errorID],
    ])('%s', (_title, captureX, logX) => {
        const ID = 3;

        logX(ID);

        const watcher = captureX();
        // Previous logs are not captured.
        expect(watcher.captured).toHaveLength(0);

        logX(ID);
        expect(watcher.captured).toHaveLength(1);
        expect(watcher.captured[0][0]).toStrictEqual(ID);

        watcher.clear();
        expect(watcher.captured).toHaveLength(0);

        logX(ID);
        expect(watcher.captured).toHaveLength(1);
        expect(watcher.captured[0][0]).toStrictEqual(ID);
        watcher.stop();
        // .stop() clear the captures
        expect(watcher.captured).toHaveLength(0);

        logX(ID);
        expect(watcher.captured).toHaveLength(0);
    });
});