import { assertIsTrue } from '@base/debug/internal';
import { sys } from '../../core';
import { IRuntimeFileData } from '../deserialize';

assertIsTrue(sys.isLittleEndian, `Deserialization system currently suppose little endian.`);

export const typedArrayTypeTable = Object.freeze([
    Float32Array,
    Float64Array,

    Int8Array,
    Int16Array,
    Int32Array,

    Uint8Array,
    Uint16Array,
    Uint32Array,

    Uint8ClampedArray,
    // BigInt64Array,
    // BigUint64Array,
] as const);

/**
 * Describes the serialized data of an typed array.
 * - If it's an array, it's `TypedArrayDataJson`.
 * - Otherwise, it's `TypedArrayDataPtr`.
 */
export type TypedArrayData = TypedArrayDataJson | TypedArrayDataPtr;

export type TypedArrayDataJson = [
    /**
     * Indicates the constructor of typed array.
     * It's index of the constructor in `TypedArrays`.
     */
    typeIndex: number,

    /**
     * Array element values.
     */
    elements: number[],
];

/**
 * Let `offset` be this value,
 * Let `storage` be the binary buffer attached to the deserialized document.
 * Then, the data of `storage` started from `offset`
 * can be described using the following structure(in C++, assuming fields are packed tightly):
 *
 * ```cpp
 * struct _ {
 *   /// Indicates the constructor of typed array.
 *   /// It's index of the constructor in `typedArrayTypeTable`.
 *   std::uint32_t typeIndex;
 *
 *   /// The typed array's element count. Note this is not "byte length".
 *   std:: uint32_t length;
 *
 *   /// Automatically padding bytes to align the `arrayBufferBytes`.
 *   /// See comments on `arrayBufferBytes`.
 *   std::byte[] _padding;
 *
 *   /// Bytes of the underlying `ArrayBuffer` of this typed array.
 *   /// Should be aligned to `typedArrayConstructor.BYTES_PER_ELEMENT`
 *   /// according to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#bytelength_must_be_aligned.
 *   std::byte[] arrayBufferBytes;
 * }
 * ```
 */
export type TypedArrayDataPtr = number;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getTypedArrayConstructor (typeIndex: number) {
    assertIsTrue(typeIndex >= 0 && typeIndex < typedArrayTypeTable.length);
    return typedArrayTypeTable[typeIndex];
}

function calculatePaddingToAlignAs (v: number, align: number): number {
    if (align === 0) {
        return 0;
    }
    const remainder = v % align;
    if (remainder !== 0) {
        return align - remainder;
    }
    return 0;
}

function decodeTypedArray (data: IRuntimeFileData, value: TypedArrayData): ArrayBufferView {
    if (Array.isArray(value)) {
        const [typeIndex, elements] = value;
        const TypedArrayConstructor = getTypedArrayConstructor(typeIndex);
        return new TypedArrayConstructor(elements);
    } else {
        const context = data[0];
        const attachedBinary = context._attachedBinary;
        assertIsTrue(attachedBinary, `Incorrect data: binary is expected.`);
        const dataView = (context._attachedBinaryDataViewCache
            ??= new DataView(attachedBinary.buffer, attachedBinary.byteOffset, attachedBinary.byteLength));

        let p = value;
        const header = dataView.getUint8(p);
        p += 1;
        const length = dataView.getUint32(p, true);
        p += 4;

        const typeIndex = header & 0xFF;
        const TypedArrayConstructor = getTypedArrayConstructor(typeIndex);

        // The elements must be padded.
        p += calculatePaddingToAlignAs(p + attachedBinary.byteOffset, TypedArrayConstructor.BYTES_PER_ELEMENT);

        // Copy the section:
        // - Allocates the result.
        // - Creates a view on big buffer.
        // - Copy using `TypedArray.prototype.set`.
        // This manner do not consider the endianness problem.
        //
        // Here listed the benchmark in various other ways:
        // https://jsperf.app/vayeri/2/preview
        //
        const result = new TypedArrayConstructor(length);
        result.set(new TypedArrayConstructor(attachedBinary.buffer, attachedBinary.byteOffset + p, length));
        return result;
    }
}

export function deserializeTypedArray (data: IRuntimeFileData, owner: any, key: string, value: TypedArrayData): void {
    owner[key] = decodeTypedArray(data, value);
}
