import {
    _decorator,
    serializeTag,
    deserializeTag,
    CustomSerializable,
    SerializationOutput,
    SerializationInput,
    SerializationContext,
    DeserializationContext,
} from 'cc';
import { PORTS_BOTH_DYNAMIC_COMPILED, testEachPort } from "../port";
import { ccclassAutoNamed, runTest } from '../utils';

@ccclassAutoNamed(__filename)
class Foo implements CustomSerializable {
    declare bar: number;

    [serializeTag](serializationOutput: SerializationOutput, _context: SerializationContext) {
        if (_context.toCCON) {
            serializationOutput.writeProperty('bar', 3.14);
        }
    }

    [deserializeTag](serializationInput: SerializationInput, _context: DeserializationContext) {
        if (_context.toCCON) {
            this.bar = serializationInput.readProperty('bar');
        }
    }
}

export const value = new Foo();

testEachPort(PORTS_BOTH_DYNAMIC_COMPILED, async (port) => {
    await runTest(
        __filename,
        port,
        value,
        (serialized: typeof value) => {
            expect(serialized.bar).toBe(3.14);
        }
    );
});
