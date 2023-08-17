/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import { ccclass, serializable } from 'cc.decorator';
import { Vec3, Quat, Vec4, Vec2, Mat4 } from '../../math';

export enum StorageUnit {
    Uint8, Uint16, Uint32,
    Int8, Int16, Int32,
    Float32, Float64,
}

export enum ElementType {
    Scalar,
    Vec2,
    Vec3,
    Vec4,
    Quat,
    Mat4,
}

const elementTypeBits = 3;

export type StorageUnitElementType = number;

export function combineStorageUnitElementType (unit: StorageUnit, elementType: ElementType): number {
    return (elementType << elementTypeBits) + unit;
}

export function extractStorageUnitElementType (combined: StorageUnitElementType): {
    storageUnit: number;
    elementType: number;
} {
    return {
        storageUnit: ~(-1 << elementTypeBits) & combined,
        elementType: combined >> elementTypeBits,
    };
}

/**
 * @deprecated Since V3.5.0.
 */
@ccclass('cc.CompactValueTypeArray')
export class CompactValueTypeArray {
    public static StorageUnit = StorageUnit;

    public static ElementType = ElementType;

    /**
     * Offset into the buffer, in bytes.
     */
    @serializable
    private _byteOffset = 0;

    /**
     * Unit count this CVTA occupies.
     */
    @serializable
    private _unitCount = 0;

    /**
     * Element type this CVTA holds.
     */
    @serializable
    private _unitElement = combineStorageUnitElementType(StorageUnit.Uint8, ElementType.Scalar);

    /**
     * Element count this CVTA holds.
     */
    @serializable
    private _length = 0;

    /**
     * Returns the length in bytes that a buffer needs to encode the specified value array in form of CVTA.
     * @param values The value array.
     * @param unit Target element type.
     */
    public static lengthFor (values: any[], elementType: ElementType, unit: StorageUnit): number {
        const elementTraits = getElementTraits(elementType);
        return elementTraits.requiredUnits * values.length * getStorageConstructor(unit).BYTES_PER_ELEMENT;
    }

    /**
     * Compresses the specified value array in form of CVTA into target buffer.
     * @param values The value array.
     * @param unit Target element type.
     * @param arrayBuffer Target buffer.
     * @param byteOffset Offset into target buffer.
     */
    public static compress (values: any[], elementType: ElementType, unit: StorageUnit, arrayBuffer: ArrayBuffer, byteOffset: number, presumedByteOffset: number): CompactValueTypeArray {
        const elementTraits = getElementTraits(elementType);
        const storageConstructor = getStorageConstructor(unit);
        const unitCount = elementTraits.requiredUnits * values.length;
        const storage = new storageConstructor(arrayBuffer, byteOffset, unitCount);
        for (let i = 0; i < values.length; ++i) {
            elementTraits.compress(storage, i, values[i]);
        }

        const result = new CompactValueTypeArray();
        result._unitElement = combineStorageUnitElementType(unit, elementType);
        result._byteOffset = presumedByteOffset;
        result._unitCount = unitCount;
        result._length = values.length;
        return result;
    }

    /**
     * Decompresses this CVTA.
     * @param arrayBuffer The buffer this CVTA stored in.
     */
    public decompress<T> (arrayBuffer: ArrayBuffer): T[] {
        const { storageUnit, elementType } = extractStorageUnitElementType(this._unitElement);
        const elementTraits = getElementTraits(elementType);
        const storageConstructor = getStorageConstructor(storageUnit);
        const storage = new storageConstructor(arrayBuffer, this._byteOffset, this._unitCount);
        const result = new Array<T>(this._length);
        for (let i = 0; i < this._length; ++i) {
            result[i] = elementTraits.decompress(storage, i);
        }
        return result;
    }
}

function getElementTraits (elementType: ElementType): CompactTraits {
    return BuiltinElementTypeTraits[elementType];
}

function getStorageConstructor (unit: StorageUnit): TypedArrayConstructor {
    switch (unit) {
    case StorageUnit.Uint8:
        return Uint8Array;
    case StorageUnit.Uint16:
        return Uint16Array;
    case StorageUnit.Uint32:
        return Uint32Array;
    case StorageUnit.Int8:
        return Int8Array;
    case StorageUnit.Int16:
        return Int16Array;
    case StorageUnit.Int32:
        return Int32Array;
    case StorageUnit.Float32:
        return Float32Array;
    case StorageUnit.Float64:
        return Float64Array;
    }
}

interface CompactTraits {
    requiredUnits: number;
    compress (storage: CompactValueTypeArrayStorage, index: number, value: any): void;
    decompress (storage: CompactValueTypeArrayStorage, index: number): any;
}

const BuiltinElementTypeTraits: Record<ElementType, CompactTraits> = {
    [ElementType.Scalar]: {
        requiredUnits: 1,
        compress (storage: CompactValueTypeArrayStorage, index: number, value: number) {
            storage[index] = value;
        },
        decompress (storage: CompactValueTypeArrayStorage, index: number) {
            return storage[index];
        },
    },
    [ElementType.Vec2]: {
        requiredUnits: 2,
        compress (storage: CompactValueTypeArrayStorage, index: number, value: Vec2) {
            storage[index * 2] = value.x;
            storage[index * 2 + 1] = value.y;
        },
        decompress (storage: CompactValueTypeArrayStorage, index: number) {
            return new Vec3(storage[index * 2], storage[index * 2 + 1]);
        },
    },
    [ElementType.Vec3]: {
        requiredUnits: 3,
        compress (storage: CompactValueTypeArrayStorage, index: number, value: Vec3) {
            storage[index * 3] = value.x;
            storage[index * 3 + 1] = value.y;
            storage[index * 3 + 2] = value.z;
        },
        decompress (storage: CompactValueTypeArrayStorage, index: number) {
            return new Vec3(storage[index * 3], storage[index * 3 + 1], storage[index * 3 + 2]);
        },
    },
    [ElementType.Vec4]: {
        requiredUnits: 4,
        compress (storage: CompactValueTypeArrayStorage, index: number, value: Vec4) {
            storage[index * 4] = value.x;
            storage[index * 4 + 1] = value.y;
            storage[index * 4 + 2] = value.z;
            storage[index * 4 + 3] = value.w;
        },
        decompress (storage: CompactValueTypeArrayStorage, index: number) {
            return new Vec4(storage[index * 4], storage[index * 4 + 1], storage[index * 4 + 2], storage[index * 4 + 3]);
        },
    },
    [ElementType.Quat]: {
        requiredUnits: 4,
        compress (storage: CompactValueTypeArrayStorage, index: number, value: Quat) {
            storage[index * 4] = value.x;
            storage[index * 4 + 1] = value.y;
            storage[index * 4 + 2] = value.z;
            storage[index * 4 + 3] = value.w;
        },
        decompress (storage: CompactValueTypeArrayStorage, index: number) {
            return new Quat(storage[index * 4], storage[index * 4 + 1], storage[index * 4 + 2], storage[index * 4 + 3]);
        },
    },
    [ElementType.Mat4]: {
        requiredUnits: 16,
        compress (storage: CompactValueTypeArrayStorage, index: number, value: Mat4) {
            Mat4.toArray(storage, value, index * 16);
        },
        decompress (storage: CompactValueTypeArrayStorage, index: number) {
            return Mat4.fromArray(new Mat4(), storage, index * 16);
        },
    },
};

interface CompactValueTypeArrayStorage {
    readonly length: number;
    [n: number]: number;
}

export function isCompactValueTypeArray (value: any): value is CompactValueTypeArray  {
    return value instanceof CompactValueTypeArray;
}
