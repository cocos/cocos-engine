import { ccclass } from 'cc.decorator';
import { warnID } from '../../cocos/core';
import { float, property } from '../../cocos/core/data/class-decorator';
import * as requiringFrame from '../../cocos/core/data/utils/requiring-frame';
import { getClassName, unregisterClass, getClassId } from '../../cocos/core/utils/js-typed';
import { Component } from '../../cocos/scene-graph/component'

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

    // TODO
    test.skip('Warn on no default value specified', () => {
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

describe('Class id & class name', () => {
    type ExpectedNameComeFrom = 'self-name' | 'explicit-name' | 'frame-name';
    type ExpectedIdComeFrom = 'self-name' | 'explicit-name' | 'frame-uuid' | 'temp-id';

    test.each([
        [true, true, true, 'explicit-name', 'frame-uuid'], // Usually: in user land, components, with explicit name
        [true, true, false, 'explicit-name', 'explicit-name'],  // Usually: in user land, non-components, with explicit name
        [true, false, true, 'explicit-name', 'explicit-name'], // Usually: in engine, components
        [true, false, false, 'explicit-name', 'explicit-name'], // Usually: in engine, non-components

        [false, true, true, 'frame-name', 'frame-uuid'], // Usually: in user land, components, no explicit name
        [false, true, false, 'self-name', 'temp-id'],  // Usually: in user land, non-components, no explicit name
        [false, false, true, 'self-name', 'temp-id'],
        [false, false, false, 'self-name', 'temp-id'],
    ] as Array<[
        withExplicitName: boolean,
        withinRequiringFrame: boolean,
        inheritingFromComponent: boolean,
        expectedNameComeFrom: ExpectedNameComeFrom,
        expectedIdComeFrom: ExpectedIdComeFrom,
    ]>)(
        `WithExplicitName: %j, WithinRequiringFrame: %j, InheritingFromComponent: %j`,
        (withExplicitName, withinRequiringFrame, inheritingFromComponent, expectedNameComeFrom, expectedIdComeFrom) => {
        const EXPLICIT_NAME = '__EXPLICIT_NAME__';
        const FRAME_NAME = '__FRAME_NAME__';
        const FRAME_UUID = '__FRAME_UUID__';
        const expectedName = (() => {
            switch (expectedNameComeFrom) {
                case 'frame-name': return FRAME_NAME;
                case 'explicit-name': return EXPLICIT_NAME;
                default: case 'self-name': return 'Cls';
            }
        })();
        const expectedId = (() => {
            switch (expectedIdComeFrom) {
                case 'frame-uuid': return FRAME_UUID;
                case 'explicit-name': return EXPLICIT_NAME;
                case 'temp-id': return expect.stringMatching(/^TmpCId\.\.[0-9]+/i);
                default: case 'self-name': return 'Cls';
            }
        })();

        if (withinRequiringFrame) {
            requiringFrame.push(
                {}, // module
                FRAME_UUID, // uuid
                FRAME_NAME, // script
            );
        }

        let Cls_: Function;
        if (inheritingFromComponent) {
            Cls_ = (() => {
                @(withExplicitName ? ccclass(EXPLICIT_NAME) : ccclass) class Cls extends Component {}
                return Cls;
            })();
        } else {
            Cls_ = (() => {
                @(withExplicitName ? ccclass(EXPLICIT_NAME) : ccclass) class Cls {}
                return Cls;
            })();
        }

        if (withinRequiringFrame) {
            requiringFrame.pop();
        }

        try {
            expect(getClassName(Cls_)).toBe(expectedName);
            expect(getClassId(Cls_)).toStrictEqual(expectedId);
        } finally {
            unregisterClass(Cls_);
        }
    });
});