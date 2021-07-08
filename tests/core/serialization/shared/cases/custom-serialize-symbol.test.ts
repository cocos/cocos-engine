import {
    _decorator,
    serializeSymbol,
    deserializeSymbol,
    CustomizedSerializable,
    SerializationOutput,
    SerializationInput,
    SerializationContext,
} from 'cc';
import { PORTS_BOTH_DYNAMIC_COMPILED, testEachPort } from "../port";
import { ccclassAutoNamed, runTest } from '../utils';

@ccclassAutoNamed(__filename)
class SerializationOutputProperty implements CustomizedSerializable {
    x = 0.1;

    y = 0.2;

    z = 0.3;

    [serializeSymbol](serializationOutput: SerializationOutput, _context: SerializationContext) {
        serializationOutput.property('values', [this.x, this.y, this.z]);
    }

    [deserializeSymbol](serializationInput: SerializationInput) {
        const values = serializationInput.property('values') as number[];
        this.x = values[0];
        this.y = values[1];
        this.z = values[2];
    }
}

@ccclassAutoNamed(__filename)
class Base {
    @_decorator.property
    baseProperty = '';
}

@ccclassAutoNamed(__filename)
class ContextSerializeSuper extends Base implements CustomizedSerializable {
    bar = 'SuperProperty';

    [serializeSymbol](serializationOutput: SerializationOutput, context: SerializationContext) {
        context.serializeSuper();
        serializationOutput.property('bar', this.bar);
    }
}

@ccclassAutoNamed(__filename)
class ContextSerializeSuper1 extends Base implements CustomizedSerializable {
    bar = 'SuperProperty';

    [serializeSymbol](serializationOutput: SerializationOutput, context: SerializationContext) {
        context.serializeSuper();
        serializationOutput.property('baseProperty', 'CustomOverrideSuper');
    }
}

@ccclassAutoNamed(__filename)
class ContextSerializeSuper2 extends Base implements CustomizedSerializable {
    bar = 'SuperProperty';

    [serializeSymbol](serializationOutput: SerializationOutput, context: SerializationContext) {
        serializationOutput.property('baseProperty', 'CustomOverrideSuper');
        context.serializeSuper();
    }
}

@ccclassAutoNamed(__filename)
class ContextSerializeThis {
    @_decorator.property
    foo = 1;

    [serializeSymbol](serializationOutput: SerializationOutput, context: SerializationContext) {
        context.serializeThis();
    }
}

@ccclassAutoNamed(__filename)
class ContextSerializeThis1 {
    @_decorator.property
    foo = 'Original';

    [serializeSymbol](serializationOutput: SerializationOutput, context: SerializationContext) {
        serializationOutput.property('foo', 'CustomOverride');
        context.serializeThis();
    }
}

@ccclassAutoNamed(__filename)
class ContextSerializeThis2 {
    @_decorator.property
    foo = 'Original';

    [serializeSymbol](serializationOutput: SerializationOutput, context: SerializationContext) {
        context.serializeThis();
        serializationOutput.property('foo', 'CustomOverride');
    }
}

export const value = {
    serializationOutputProperty: new SerializationOutputProperty(),
    contextSerializeSuper: new ContextSerializeSuper(),
    contextSerializeSuper1: new ContextSerializeSuper1(),
    contextSerializeSuper2: new ContextSerializeSuper2(),
    contextSerializeThis: new ContextSerializeThis(),
    contextSerializeThis1: new ContextSerializeThis1(),
    contextSerializeThis2: new ContextSerializeThis2(),
};

testEachPort(PORTS_BOTH_DYNAMIC_COMPILED, async (port) => {
    await runTest(
        __filename,
        port,
        value,
        (serialized: typeof value) => {
            expect(serialized.serializationOutputProperty).toStrictEqual(value.serializationOutputProperty);
            expect(serialized.contextSerializeSuper).toStrictEqual(value.contextSerializeSuper);
            expect(serialized.contextSerializeSuper1.baseProperty).toStrictEqual('CustomOverrideSuper');
            expect(serialized.contextSerializeSuper2).toStrictEqual(value.contextSerializeSuper2);
            expect(serialized.contextSerializeThis).toStrictEqual(value.contextSerializeThis);
            expect(serialized.contextSerializeThis1).toStrictEqual(value.contextSerializeThis1);
            expect(serialized.contextSerializeThis2.foo).toStrictEqual('CustomOverride');
        }
    );
});
