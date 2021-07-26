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
import { PORTS_BOTH_DYNAMIC_COMPILED, PORT_CCOB, testEachPort } from "../port";
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
        if (_context.fromCCON) {
            this.bar = serializationInput.readProperty('bar');
        }
    }
}

export const value = new Foo();

testEachPort([PORT_CCOB], async (port) => {
    await runTest(
        __filename,
        port,
        value,
        (serialized: typeof value) => {
            expect(serialized.bar).toBe(3.14);
        }
    );
});
