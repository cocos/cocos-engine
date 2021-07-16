import { assertIsTrue } from './utils/asserts';

/**
 * Tag to define the custom serialization method.
 * @internal
 */
export const serializeTag = Symbol('[[Serialize]]');

/**
 * Tag to define the custom deserialization method.
 * @internal
 */
export const deserializeTag = Symbol('[[Deserialize]]');

export interface SerializationInput {
    /**
     * Reads a property from input.
     * @param name Property name.
     * @returns The property's value, after deserialized.
     */
    readProperty(name: string): unknown;

    /**
     * Deserializes this object according to the original procedure.
     */
    readThis(): void;

    /**
      * Deserializes super according to the original procedure.
      */
    readSuper(): void;
}

export interface SerializationOutput {
    /**
     * Writes a property into output.
     * @param name Property name.
     * @param value Property value.
     */
    writeProperty(name: string, value: unknown): void;

    /**
     * Serialize this object according to the original procedure.
     */
    writeThis(): void;

    /**
     * Serialize super according to the original procedure.
     */
    writeSuper(): void;
}

export type SerializationContext = {
    /**
     * The root value passed to serialization procedure.
     */
    root: unknown;

    /**
     * True if the serialization procedure is targeting CCON.
     */
    toCCON: boolean;

    /**
     * Customized arguments passed to serialization procedure.
     */
    customArguments: Record<PropertyKey, unknown>
};

export type DeserializationContext = {
    /**
     * True if the deserialization procedure is deserializing from CCON.
     */
    fromCCON: boolean;
};

export interface CustomSerializable {
    [serializeTag](output: SerializationOutput, context: SerializationContext): void;

    [deserializeTag]?(input: SerializationInput, context: DeserializationContext): void;
}

/**
 * Enables the custom serialize/deserialize method only if the (de)serialize procedure is targeting CCON.
 * @internal
 */
export const enableIfCCON: MethodDecorator = <T>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    _target: Object,
    propertyKey: PropertyKey,
    descriptor: TypedPropertyDescriptor<T>,
): TypedPropertyDescriptor<T> | void => {
    const original = descriptor.value;
    assertIsTrue(original);
    if (propertyKey === serializeTag) {
        return {
            ...descriptor,
            value: function wrapSerialize (output: SerializationOutput, context: SerializationContext) {
                if (!context.toCCON) {
                    output.writeThis();
                } else {
                    (original as unknown as CustomSerializable[typeof serializeTag]).call(this, output, context);
                }
            },
        } as unknown as TypedPropertyDescriptor<T>;
    } else {
        assertIsTrue(propertyKey === deserializeTag, '@enableIfCCON should be only applied to custom (de)serialize method');
        return {
            ...descriptor,
            value: function wrapDeserialize (input: SerializationInput, context: DeserializationContext) {
                if (!context.fromCCON) {
                    input.readThis();
                } else {
                    (original as unknown as NonNullable<CustomSerializable[typeof deserializeTag]>).call(this, input, context);
                }
            },
        } as unknown as TypedPropertyDescriptor<T>;
    }
};
