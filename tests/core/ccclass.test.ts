import { ccclass } from 'cc.decorator';
import { warnID } from '../../cocos/core';
import { float, property } from '../../cocos/core/data/class-decorator';

/**
 * Happened when:
 *  - `@property(undefined)` Explicit `undefined`, it's rare
 *  - `@property(${some-global}.${some-property})` From a expression which evaluated as `undefined`,
 *  - `@property(${imported-undefined})` Due to circular reference
 */
test('explicit undefined type', () => {
    // @ts-ignore
    warnID.mockClear();

    @ccclass
    class Foo {
        /**
         * `@property(type)` form.
         */
        @property(undefined)
        public property1 = 0;

        /**
         * `@property({ type })` form.
         */
        @property({
            type: undefined,
        })
        public property2 = 0;
    }

    expect(warnID).toHaveBeenCalledTimes(2);
    expect(warnID).toHaveBeenNthCalledWith(1, 3660, 'property1', Foo.name);
    expect(warnID).toHaveBeenNthCalledWith(2, 3660, 'property2', Foo.name);
});

describe('ccclass warnings', () => {
    const clearWarnID = () => {
        // @ts-expect-error
        warnID.mockClear();
    };

    test('Warn on no default value specified', () => {
        clearWarnID();
        { @ccclass class _ { @float p; } }
        expect(warnID).toHaveBeenCalledTimes(1);
        expect(warnID).toHaveBeenCalledWith(3654, '_', 'p');

        clearWarnID();
        { @ccclass class _ { @property p; } }
        expect(warnID).toHaveBeenCalledTimes(1);
        expect(warnID).toHaveBeenCalledWith(3654, '_', 'p');

        clearWarnID();
        @ccclass class C { }
        { @ccclass class _ { @property(C) p; } }
        expect(warnID).not.toHaveBeenCalled();
    });
});