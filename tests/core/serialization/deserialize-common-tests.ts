import { js } from '@base/utils';
import { property } from '../../../cocos/core/data/class-decorator';
import { ccclass } from '../../../cocos/core/data/decorators';
import { deserialize } from '../../../cocos/serialization/deserialize';

const { getClassId, unregisterClass } = js;

test('Fast mode', () => {
    @ccclass('cc.MeDoNotBelieveThisExists')
    class Cls {
        @property
        n: number;

        @property
        b: boolean;

        @property
        s: string;

        @property
        nil: null;
    }

    const serialized = {
        __type__: getClassId(Cls),
        n: 3.14,
        b: true,
        s: '321',
        nil: null,
    };

    const deserialized = deserialize(serialized, undefined, undefined);
    expect(Object.getPrototypeOf(deserialized)).toStrictEqual(expect.objectContaining({
        constructor: Cls,
    }));
    expect(deserialized).toStrictEqual(expect.objectContaining<Cls>({
        n: 3.14,
        b: true,
        s: '321',
        nil: null,
    }));

    unregisterClass(Cls);
});
