
import { PORTS_BOTH_DYNAMIC_COMPILED, testEachPort } from "../port";
import { ccclassAutoNamed, runTest } from "../utils";
import * as cc from 'cc';

@ccclassAutoNamed(__filename)
class DefaultDeducedFromInitializer {
    @cc._decorator.property
    numField = 2.0;

    @cc._decorator.property
    nullishNumField = 0.0;

    @cc._decorator.property
    stringField = 'foo';

    @cc._decorator.property
    nullishStringField = '';

    @cc._decorator.property
    boolField = true;

    @cc._decorator.property
    nullishBoolField = false;

    @cc._decorator.property
    nullField = null;
}

const defaultDeducedFromInitializer_defaultHit = new DefaultDeducedFromInitializer();

const defaultDeducedFromInitializer_defaultMissing = new DefaultDeducedFromInitializer();
defaultDeducedFromInitializer_defaultMissing.numField = 1.2;
defaultDeducedFromInitializer_defaultMissing.nullishNumField = 1.3;
defaultDeducedFromInitializer_defaultMissing.stringField = 'bar';
defaultDeducedFromInitializer_defaultMissing.nullishStringField = 'baz';
defaultDeducedFromInitializer_defaultMissing.boolField = false;
defaultDeducedFromInitializer_defaultMissing.nullishBoolField = true;
defaultDeducedFromInitializer_defaultMissing.nullField = { "foo1": "bar1" };

const value = {
    defaultDeducedFromInitializer_defaultHit,
    defaultDeducedFromInitializer_defaultMissing,
};

testEachPort(PORTS_BOTH_DYNAMIC_COMPILED.map((port) => ({
    ...port,
    serializeOptions: {
        ...port.serializeOptions,
        _exporting: true,
        dontStripDefault: false,
    },
})), async (port) => {
    await runTest(
        __filename,
        port,
        value,
    );
});
