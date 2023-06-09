import { DEBUG } from 'internal:constants';
import { assertIsTrue, Mat3 } from '../../core';
import { ArrayParameter, VFXParameter, VFXValueType } from '../vfx-parameter';

const tempMat3 = new Mat3();
const STRIDE = 9;
export class Mat3ArrayParameter extends ArrayParameter {
    get data () {
        return this._data;
    }

    get type (): VFXValueType {
        return VFXValueType.MAT3;
    }

    private _data = new Float32Array(STRIDE * this._capacity);

    reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const oldData = this._data;
        this._data = new Float32Array(STRIDE * capacity);
        this._data.set(oldData);
    }
    moveTo (a: number, b: number) {
        if (DEBUG) {
            assertIsTrue(a < this._capacity && a >= 0 && b < this._capacity && b >= 0);
        }
        this.setMat3At(this.getMat3At(tempMat3, a), b);
    }

    getMat3At (out: Mat3, handle: number) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * STRIDE;
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
        return out;
    }

    setMat3At (val: Mat3, handle: number) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * STRIDE;
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
    }

    copyFrom (src: Mat3ArrayParameter, fromIndex: number, toIndex: number) {
        throw new Error('Method not implemented.');
    }

    copyToTypedArray (dest: ArrayBufferView, destOffset: number, stride: number, strideOffset: number, fromIndex: number, toIndex: number) {
        throw new Error('Method not implemented.');
    }
}

export class Mat3Parameter extends VFXParameter {
    get type (): VFXValueType {
        return VFXValueType.MAT3;
    }

    get data (): Readonly<Mat3> {
        return this._data;
    }

    set data (val: Readonly<Mat3>) {
        Mat3.copy(this._data, val);
    }

    private _data = new Mat3();
}
