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
import { getClassByName, unregisterClass } from '../../cocos/core/utils/js-typed';
import { LegacyPropertyDecorator } from '../../cocos/core/data/decorators/utils';
import { CCBoolean, CCFloat, CCInteger, CCString } from '../../exports/base';
import { PrimitiveType } from '../../cocos/core/data/utils/attribute';

test('Decorators signature', () => {
    class Foo {}

    property(Foo.prototype, 'field1', function initializer () {
        return 1;
    });
    property(Foo.prototype, 'field2', {
        initializer() {
            return 2;
        },
    });
    property(Foo.prototype, 'property', { value: 1 });
    property(Foo.prototype, 'getset', {
        get() {
            return 3;
        },
        set(v) {},
    });
    ccclass('Foo')(Foo);
    expect(Foo['__attrs__']).toMatchObject({
        field1$_$default: 1,
        field2$_$default: 2,
        getset$_$hasGetter: true,
        getset$_$hasSetter: true,
        getset$_$serializable: false,
    });
    expect(Foo['__props__']).toMatchObject(['field1', 'field2', 'property', 'getset']);

    unregisterClass(Foo);
});

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

    describe('@property', () => {
        describe(`Type and default value specification`, () => {
            test.each([
                ['@property explicitly specifying CCString', CCString, '123'],
                ['@property explicitly specifying CCInteger', CCInteger, 123],
                ['@property explicitly specifying CCFloat', CCFloat, 1.23],
                ['@property explicitly specifying CCBoolean', CCBoolean, true],
            ] as [tile: string, type: PrimitiveType<any>, initializer: any][])(`%s`, (
                _title: string, type: PrimitiveType<any>, initializer: any,
            ) => {
                const arrayInitializer = [];

                @ccclass('Foo')
                class Foo {
                    // Having initializer.
                    @property(type)
                    public shorthand_form = initializer;
                    public static readonly shorthand_form_EXPECTED = { type, default: initializer };

                    @property({ type: type })
                    public full_form = initializer;
                    public static readonly full_form_EXPECTED = { type, default: initializer };

                    // Having no initializer.
                    @property(type)
                    public no_initializer_shorthand_form;
                    public static readonly no_initializer_shorthand_form_EXPECTED = { type };

                    @property({ type: type })
                    public no_initializer_full_form;
                    public static readonly no_initializer_full_form_EXPECTED = { type };

                    // Having array initializer.
                    @property(type)
                    public array_initializer_shorthand_form: string[] = arrayInitializer;
                    public static readonly array_initializer_shorthand_form_EXPECTED = { type, default: arrayInitializer };

                    @property({ type })
                    public array_initializer_full_form: string[] = arrayInitializer;
                    public static readonly array_initializer_full_form_EXPECTED = { type, default: arrayInitializer };
                }

                for (const propertyName of [
                    'shorthand_form', 'full_form',
                    'no_initializer_shorthand_form', 'no_initializer_full_form',
                    'array_initializer_shorthand_form', 'array_initializer_full_form',
                ]) {
                    const expectedAttributes = Foo[`${propertyName}_EXPECTED`];

                    const attrs = CCClass.Attr.attr(Foo, propertyName);
                    expect(Object.keys(attrs)).toHaveLength(Object.keys(expectedAttributes).length);
    
                    for (const [attributeName, expectedAttributeValue] of Object.entries(expectedAttributes)) {
                        const actualAttributeValue = attrs[attributeName];
                        if (attributeName === 'default' && typeof actualAttributeValue === 'function') {
                            expect(actualAttributeValue()).toBe(expectedAttributeValue);
                        } else {
                            expect(actualAttributeValue).toBe(expectedAttributeValue);
                        }
                    }
                }
            });
            
        });
    });
});

describe('Decorated property test', () => {
    afterEach(() => {
        const cls = getClassByName('A');
        unregisterClass(cls);
    });

    const t = (descriptorOrInitializer?: Parameters<LegacyPropertyDecorator>[2]) => {
        class A {
            test: number;
        }
        property(A.prototype, 'test', descriptorOrInitializer);
        ccclass('A')(A);
        return CCClass.Attr.attr(A, 'test');
    };

    test('property without default value', () => {
        // Simulate `class A { @property test; }`(in babel case)
        expect(t(null)).toMatchObject({});
    });

    test('property with default value null', () => {
        // Simulate `class A { @property test = null; }`(in babel case)
        expect(t(() => null)).toMatchObject({
            default: null,
        });
    });

    test('property with property descriptor', () => {
        // Simulate `class A { @property test = null; }`(in babel case)
        expect(t({
            configurable: true,
            enumerable: true,
            value: 1,
            writable: true,
            initializer () { return null; }
        })).toMatchObject({
            default: null,
        });
    });

    test('property in TSC compiler', () => {
        // Simulate `class A { @property test; }`(in tsc case)
        expect(t()).toMatchObject({
            default: undefined,
        });
    });
});