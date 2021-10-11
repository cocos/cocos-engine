
import { property } from '../../cocos/core/data/class-decorator';
import { ccclass } from '../../cocos/core/data/decorators';
import { deserialize } from '../../cocos/core/data/deserialize';

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
});
