import { CCClass, ccenum } from '../../cocos/core';
import { property } from '../../cocos/core/data/class-decorator';
import { ccclass, type } from '../../cocos/core/data/decorators';
import { deserialize } from '../../cocos/serialization/deserialize';
import { BitMask } from '../../cocos/core/value-types/bitmask';

describe('Deserialize', () => {
    test('Object array element', () => {
        @ccclass('Foo') class Foo {  @property name: string = ''; }

        @ccclass('Bar') class Bar { @property array: Foo[] = []; @property mainFoo: Foo; }

        const classMap = {
            'Foo': Foo,
            'Bar': Bar,
        };

        const serialized = [
            { __type__: 'Bar', array: [{ __id__: 1 }, {__id__: 2 }], mainFoo: { __id__: 1 }  },
            { __type__: 'Foo', name: 'foo1' },
            { __type__: 'Foo', name: 'foo2'},
        ];

        const deserialized: Bar = deserialize(serialized, undefined, {
            classFinder: (id: string) => {
                return classMap[id];
            },
        });

        expect(deserialized.array).toHaveLength(2);
        expect(deserialized.array[0]).toBeInstanceOf(Foo);
        expect(deserialized.array[0].name).toBe('foo1');
        expect(deserialized.array[1]).toBeInstanceOf(Foo);
        expect(deserialized.array[1].name).toBe('foo2');
    });

    test('Enum and Bitmask deserialize without default value', () => {
        enum MyEnum {
            EnumOption1,
            EnumOption2,
            EnumOption3,
        }
        ccenum(MyEnum);

        const MyBitMask = BitMask({
            BitMask1: 1,
            BitMask2: 1 << 1,
            BitMask3: 1 << 2,
            BitMask4: 1 << 3,
        });
        @ccclass('cc.TestDeserialization') 
        class TestClass {
            @type(MyEnum)
            enumOption1 = MyEnum.EnumOption1;
            @type(MyEnum)
            enumOption2 = MyEnum.EnumOption2;
            @type(MyEnum)
            enumOption3 = MyEnum.EnumOption3;
            @type(MyBitMask)
            bitmask1 = MyBitMask.BitMask1;
            @type(MyBitMask)
            bitmask2 = MyBitMask.BitMask1 | MyBitMask.BitMask4;
        }

        CCClass.Attr.setClassAttr(TestClass, 'enumOption1', 'default', undefined);
        CCClass.Attr.setClassAttr(TestClass, 'enumOption2', 'default', undefined);
        CCClass.Attr.setClassAttr(TestClass, 'enumOption3', 'default', undefined);
        CCClass.Attr.setClassAttr(TestClass, 'bitmask1', 'default', undefined);
        CCClass.Attr.setClassAttr(TestClass, 'bitmask2', 'default', undefined);

        const dataSnippets = [
            { 
                __type__: 'cc.TestDeserialization',  
                'enumOption1': MyEnum.EnumOption2, 
                'enumOption2': MyEnum.EnumOption3,
                'bitmask1': MyBitMask.BitMask2 | MyBitMask.BitMask3 
            },
            { 
                __type__: 'cc.TestDeserialization',  
                'enumOption2': MyEnum.EnumOption3, 
                'enumOption3': MyEnum.EnumOption2,
                'bitmask2': MyBitMask.BitMask2 | MyBitMask.BitMask3 
            },
            { 
                __type__: 'cc.TestDeserialization',  
                'enumOption1': MyEnum.EnumOption3, 
                'enumOption2': MyEnum.EnumOption2,
                'enumOption3': MyEnum.EnumOption1,
                'bitmask1': MyBitMask.BitMask2 | MyBitMask.BitMask3 | MyBitMask.BitMask4,
                'bitmask2': 0
            },
        ];

        const deserialized = deserialize(dataSnippets[0], null) as TestClass;
        expect(deserialized.enumOption1).toBe(MyEnum.EnumOption2);
        expect(deserialized.enumOption2).toBe(MyEnum.EnumOption3);
        expect(deserialized.enumOption3).toBe(MyEnum.EnumOption3);
        expect(deserialized.bitmask1).toBe(MyBitMask.BitMask2 | MyBitMask.BitMask3);
        expect(deserialized.bitmask2).toBe(MyBitMask.BitMask1 | MyBitMask.BitMask4);

        const deserialized1 = deserialize(dataSnippets[1], null) as TestClass;
        expect(deserialized1.enumOption1).toBe(MyEnum.EnumOption1);
        expect(deserialized1.enumOption2).toBe(MyEnum.EnumOption3);
        expect(deserialized1.enumOption3).toBe(MyEnum.EnumOption2);
        expect(deserialized1.bitmask1).toBe(MyBitMask.BitMask1);
        expect(deserialized1.bitmask2).toBe(MyBitMask.BitMask2 | MyBitMask.BitMask3);

        const deserialized2 = deserialize(dataSnippets[2], null) as TestClass;
        expect(deserialized2.enumOption1).toBe(MyEnum.EnumOption3);
        expect(deserialized2.enumOption2).toBe(MyEnum.EnumOption2);
        expect(deserialized2.enumOption3).toBe(MyEnum.EnumOption1);
        expect(deserialized2.bitmask1).toBe(MyBitMask.BitMask2 | MyBitMask.BitMask3 | MyBitMask.BitMask4);
        expect(deserialized2.bitmask2).toBe(0);
    });
});
