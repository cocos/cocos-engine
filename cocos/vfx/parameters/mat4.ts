import { DEBUG } from 'internal:constants';
import { assertIsTrue, Mat4 } from '../../core';
import { ArrayParameter, VFXParameter, VFXParameterType } from '../vfx-parameter';

const tempMat4 = new Mat4();
export class Mat4ArrayParameter extends ArrayParameter {
    get data () {
        return this._data;
    }

    get stride (): number {
        return 16;
    }

    get type (): VFXParameterType {
        return VFXParameterType.MAT4;
    }

    private _data = new Float32Array(16 * this._capacity);

    reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const oldData = this._data;
        this._data = new Float32Array(16 * capacity);
        this._data.set(oldData);
    }
    move (a: number, b: number) {
        if (DEBUG) {
            assertIsTrue(a < this._capacity && a >= 0 && b < this._capacity && b >= 0);
        }
        this.setMat4At(this.getMat4At(tempMat4, a), b);
    }

    getMat4At (out: Mat4, handle: number) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 16;
        const data = this._data;
        out.m00 = data[offset];
        out.m01 = data[offset + 1];
        out.m02 = data[offset + 2];
        out.m03 = data[offset + 3];
        out.m04 = data[offset + 4];
        out.m05 = data[offset + 5];
        out.m06 = data[offset + 6];
        out.m07 = data[offset + 7];
        out.m08 = data[offset + 8];
        out.m09 = data[offset + 9];
        out.m10 = data[offset + 10];
        out.m11 = data[offset + 11];
        out.m12 = data[offset + 12];
        out.m13 = data[offset + 13];
        out.m14 = data[offset + 14];
        out.m15 = data[offset + 15];
        return out;
    }

    setMat4At (val: Mat4, handle: number) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 9;
        const data = this._data;
        data[offset] = val.m00;
        data[offset + 1] = val.m01;
        data[offset + 2] = val.m02;
        data[offset + 3] = val.m03;
        data[offset + 4] = val.m04;
        data[offset + 5] = val.m05;
        data[offset + 6] = val.m06;
        data[offset + 7] = val.m07;
        data[offset + 8] = val.m08;
        data[offset + 9] = val.m09;
        data[offset + 10] = val.m10;
        data[offset + 11] = val.m11;
        data[offset + 12] = val.m12;
        data[offset + 13] = val.m13;
        data[offset + 14] = val.m14;
        data[offset + 15] = val.m15;
    }

    copyFrom (src: Mat4ArrayParameter, fromIndex: number, toIndex: number) {
        throw new Error('Method not implemented.');
    }

    copyToTypedArray (dest: ArrayBufferView, destOffset: number, stride: number, strideOffset: number, fromIndex: number, toIndex: number) {
        throw new Error('Method not implemented.');
    }
}

export class Mat4Parameter extends VFXParameter {
    get isArray (): boolean {
        return false;
    }

    get type (): VFXParameterType {
        return VFXParameterType.MAT4;
    }

    get data (): Readonly<Mat4> {
        return this._data;
    }

    set data (val: Readonly<Mat4>) {
        Mat4.copy(this._data, val);
    }

    private _data = new Mat4();
}
