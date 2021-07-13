import { TEST } from 'internal:constants';

export const serializeTag = Symbol('[[Serialize]]');

export const deserializeTag = Symbol('[[Deserialize]]');

export interface SerializationInput {
    /**
     * Reads a property from input.
     * @param name Property name.
     * @returns The property's value, after deserialized.
     */
    property(name: string): unknown;
}

export interface SerializationOutput {
    /**
     * Writes a property into output.
     * @param name Property name.
     * @param value Property value.
     */
    property(name: string, value: unknown): void;
}

export type SerializationContext = {
    /**
     * The root value passed to serialization procedure.
     */
    root: unknown;

    /**
     * Serialize this object according to the original procedure.
     */
    serializeThis(): void;

    /**
     * Serialize super according to the original procedure.
     */
    serializeSuper(): void;

    /**
     * Customized arguments passed to serialization procedure.
     */
    customizedArguments: Record<PropertyKey, unknown>
};

export type DeserializationContext = {
    /**
     * Deserializes this object according to the original procedure.
     */
    deserializeThis(): void;

    /**
     * Deserializes super according to the original procedure.
     */
    deserializeSuper(): void;
};

export interface CustomizedSerializable {
    [serializeTag](output: SerializationOutput, context: SerializationContext): void;

    [deserializeTag]?(input: SerializationInput, context: DeserializationContext): void;
}
