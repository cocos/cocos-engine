
import { property } from '../../../cocos/core/data/class-decorator';
import { deserialize } from '../../../cocos/serialization/deserialize';
import { js } from '../../../cocos/core';
import { ccclassAutoNamed } from './shared/utils';

@ccclassAutoNamed(__dirname) class Foo {
    @property
    bar!: Foo;
}

// We once had a BUG when processing `__id__: 0`
test(`Deserialize property reference __id__: 0`, () => {
    const deserialized = deserialize([{
        __type__: js.getClassName(Foo),
        bar: { __id__: 0 }
    }], undefined, undefined) as Foo;
    expect(deserialized.bar).toBe(deserialized);
});
