/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { assertIsNonNullable, assertIsTrue } from './utils/asserts';

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
     * Reads a property from the input.
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
     * The main serializing asset or root node in the scene/prefab passed to the serialization procedure.
     */
    root: unknown;
    /**
     * True if the serialization procedure is targeting CCON.
     */
    toCCON: boolean;
    /**
     * Customized arguments passed to serialization procedure.
     */
    customArguments: Record<PropertyKey, unknown>;
};

/**
 * @engineInternal
 */
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
 * Enables the custom to serialize/deserialize method only if the (de)serialize procedure is targeting CCON.
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export const enableIfCCON: MethodDecorator = <T>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    _target: Object,
    propertyKey: PropertyKey,
    descriptor: TypedPropertyDescriptor<T>,
): TypedPropertyDescriptor<T> | void => {
    const original = descriptor.value;
    assertIsNonNullable(original);
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
