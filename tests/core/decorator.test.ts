import { getSerializationMetadata } from '../../cocos/core/data/serialization-metadata';
import { uniquelyReferenced } from '../../cocos/core/data/decorators/serializable';
import {
    visible,
    editable, tooltip, ccclass, serializable, formerlySerializedAs,
    readOnly, displayName, group, range, rangeMin, rangeMax, rangeStep,
    slide, displayOrder, unit, radian, multiline, disallowAnimation,
    editorOnly,
    type,
    float,
} from '../../cocos/core/data/decorators';
import { CCClass } from '../../cocos/core/data/class';
import { property } from '../../cocos/core/data/decorators/property';
import { experimental } from '../../cocos/core/data/class-decorator';
import { captureWarnIDs } from '../utils/log-capture';

describe(`Decorators`, () => {
    test('@uniquelyReferenced', () => {
        @uniquelyReferenced
        class Foo { }
        
        expect(getSerializationMetadata(Foo)?.uniquelyReferenced).toBe(true);
    });

    @ccclass('Dummy')
    class Dummy {}

    describe('Visible', () => {
        function visibleFn () { return false; }

        const withVisibleTrueSerializableFalse = <T>(v: T) => ({ visible: true, serializable: false, ...v });

        const withVisibleFalseSerializableTrue = <T>(v: T) => ({ visible: false, serializable: true, ...v });

        test.each([
            ['@property', [property], { /*visible: true, serializable: true*/ }],

            ['@property({})', [property({})], { /*visible: true, serializable: true*/ }],

            ['@property({ visible: true })', [property({ visible: true })], { visible: true, /* serializable: true */ }],

            ['@property({ visible: false })', [property({ visible: false })], { visible: false, /* serializable: true */ }],

            ['@property({ visible: [[Function]] })', [property({ visible: visibleFn })], { visible: visibleFn }],

            ['@property({ serializable: false })', [property({ serializable: false })], { serializable: false, /* visible: true */ }],

            ['@type(a)', [type(Dummy)], { type: 'Object', ctor: Dummy }],

            ['@editable', [editable], withVisibleTrueSerializableFalse({})],
            ['@readOnly', [readOnly], withVisibleTrueSerializableFalse({ readonly: true })],
            ['@displayName(a)', [displayName('d')], withVisibleTrueSerializableFalse({ displayName: 'd' })],
            ['@tooltip(a)', [tooltip('t')], withVisibleTrueSerializableFalse({ tooltip: 't' })],
            ['@group(a)', [group('g')], withVisibleTrueSerializableFalse({ group: 'g' })],
            ['@range([a, b])', [range([2, 3])], withVisibleTrueSerializableFalse({ min: 2, max: 3 })],
            ['@range([a, b, c])', [range([2, 3, 4])], withVisibleTrueSerializableFalse({ min: 2, max: 3, step: 4 })],
            ['@rangeMin(a)', [rangeMin(6)], withVisibleTrueSerializableFalse({ min: 6 })],
            ['@rangeMax(a)', [rangeMax(6)], withVisibleTrueSerializableFalse({ max: 6 })],
            ['@rangeStep(a)', [rangeStep(6)], withVisibleTrueSerializableFalse({ step: 6 })],
            ['@slide', [slide], withVisibleTrueSerializableFalse({ slide: true })],
            ['@displayOrder(a)', [displayOrder(6)], withVisibleTrueSerializableFalse({ displayOrder: 6 })],
            ['@unit(a)', [unit('cd/m²')], withVisibleTrueSerializableFalse({ unit: 'cd/m²' })],
            ['@radian', [radian], withVisibleTrueSerializableFalse({ radian: true })],
            ['@multiline', [multiline], withVisibleTrueSerializableFalse({ multiline: true })],
            ['@disallowAnimation', [disallowAnimation], { animatable: false, serializable: false, visible: false }],

            ['@serializable', [serializable], withVisibleFalseSerializableTrue({})],
            ['@editorOnly', [editorOnly], withVisibleFalseSerializableTrue({ editorOnly: true })],
            ['@formerlySerializedAs(a)', [formerlySerializedAs('xx')], withVisibleFalseSerializableTrue({ formerlySerializedAs: 'xx' })],

            ['@visible, @serializable', [
                visible(true),
                serializable,
            ], {
                visible: true,
                serializable: true,
            }],

            ['@visible, implicit visible', [
                visible(visibleFn),
                tooltip('t'),
            ], {
                tooltip: 't',
                visible: visibleFn,
                serializable: false,
            }],

            ['implicit visible, @visible', [
                tooltip('t'),
                visible(visibleFn),
            ], {
                tooltip: 't',
                visible: visibleFn,
                serializable: false,
            }],

            ['Implicit visible, implicit serializable', [
                tooltip('t'),
                formerlySerializedAs('ABC'),
            ], {
                tooltip: 't',
                formerlySerializedAs: 'ABC',
                visible: true,
                serializable: true,
            }],

            ['Implicit serializable, implicit visible', [
                formerlySerializedAs('ABC'),
                tooltip('t'),
            ], {
                tooltip: 't',
                formerlySerializedAs: 'ABC',
                visible: true,
                serializable: true,
            }],

            ['@type, implicit visible', [
                type(Dummy),
                tooltip('t'),
            ], {
                tooltip: 't',
                visible: true,
                serializable: false,
                type: 'Object',
                ctor: Dummy,
            }],

            ['@type, implicit serializable', [
                type(Dummy),
                formerlySerializedAs('t'),
            ], {
                formerlySerializedAs: 't',
                visible: false,
                serializable: true,
                type: 'Object',
                ctor: Dummy,
            }],
        ] as Array<[
            title: string,
            decorators: Array<PropertyDecorator>,
            expected: Record<string, unknown>,
        ]>)(`%s`, (_title, decorators, expected) => {
            const empty: PropertyDecorator = () => {};

            const tryApplyNthDecorator = (index: number) => decorators.length > index ? decorators[index] : empty;
            
            @ccclass
            class Foo {
                @tryApplyNthDecorator(0)
                @tryApplyNthDecorator(1)
                @tryApplyNthDecorator(2)
                bar;
            }
    
            const attr = CCClass.Attr.attr(Foo, 'bar');
            expect(attr).toStrictEqual(expected);
        });

        test('Properties started with slash', () => {
            @ccclass
            class Foo {
                @property
                _p0 = 3.0;

                @property({ visible: true })
                _p1 = 3.0;

                @visible(true)
                _p2 = 3.0;

                @tooltip('t')
                _p3 = 3.0;

                @property
                get _a() {
                    return 0;
                }
            }

            expect(CCClass.Attr.attr(Foo, '_p0')).toHaveProperty('visible', false);
            expect(CCClass.Attr.attr(Foo, '_p1')).toHaveProperty('visible', true);
            expect(CCClass.Attr.attr(Foo, '_p2')).toHaveProperty('visible', true);
            expect(CCClass.Attr.attr(Foo, '_p3')).toHaveProperty('visible', true);
            expect(CCClass.Attr.attr(Foo, '_a')).toHaveProperty('visible', false);

        });
    });

    test('Property defaults', () => {
        
        @ccclass('Foo')
        class Foo {
            @serializable
            public num = 3;

            @editable
            public str = 'hello';

            @tooltip('t')
            public boo = true;

            @formerlySerializedAs('566')
            public nil = null;

            @visible(true)
            public arr = [0.1, 0.2, 0.3];

            @radian
            public noInit;

            @type(Dummy)
            public noInitButHasObjectTypeSpecified;

            @float
            public noInitButHasPrimitiveTypeSpecified;
        }

        expect(CCClass.Attr.attr(Foo, 'num').default).toStrictEqual(3);
        expect(CCClass.Attr.attr(Foo, 'str').default).toStrictEqual('hello');
        expect(CCClass.Attr.attr(Foo, 'boo').default).toStrictEqual(true);
        expect(CCClass.Attr.attr(Foo, 'nil').default).toStrictEqual(null);
        expect(CCClass.Attr.attr(Foo, 'arr').default()).toStrictEqual([0.1, 0.2, 0.3]);
        expect(CCClass.Attr.attr(Foo, 'noInit')).not.toHaveProperty('default');
        expect(CCClass.Attr.attr(Foo, 'noInitButHasObjectTypeSpecified')).not.toHaveProperty('default');
        expect(CCClass.Attr.attr(Foo, 'noInitButHasPrimitiveTypeSpecified')).not.toHaveProperty('default');
    });

    test('tooltip', () => {
        @ccclass('Tooltip')
        class Tooltip {
            @tooltip('i18n:model.shadow_normal_bias')
            public boo = true;
        }

        expect(CCClass.Attr.attr(Tooltip, 'boo').tooltip).toBe('i18n:ENGINE.model.shadow_normal_bias');
    });

    test('@experimental', () => {
        const warnWatcher = captureWarnIDs();

        class Meow {
            @experimental
            public fn(...args: unknown[]) {
                return this._mock.apply(this, args);
            }

            public callFnAndCheck(...args: Parameters<Meow['fn']>) {
                expect(this._mock).not.toBeCalled();

                this.fn(...args);

                expect(this._mock).toBeCalledTimes(1);
                expect(this._mock.mock.calls[0]).toEqual(args);

                this._mock.mockClear();
            }

            private _mock = jest.fn<Meow, [number, string]>();
        }

        const meow1 = new Meow();

        // The first call.
        meow1.callFnAndCheck(1, 'a');
        // Warn should be emitted.
        expect(warnWatcher.captured).toHaveLength(1);
        expect(warnWatcher.captured[0]).toEqual([101, 'Meow', 'fn']);
        warnWatcher.clear();
        
        // Later calls on the same object.
        meow1.callFnAndCheck(2, 'b');
        // No more warns.
        expect(warnWatcher.captured).toHaveLength(0);

        // Do it again.
        meow1.callFnAndCheck(3, 'c');
        // No more warns.
        expect(warnWatcher.captured).toHaveLength(0);

        // Create another instance. It should not bother.
        const meow2 = new Meow();
        meow2.callFnAndCheck(4, 'd');
        // No more warns.
        expect(warnWatcher.captured).toHaveLength(0);
    })
});
