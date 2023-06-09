import { DEBUG } from 'internal:constants';
import { Color, assertIsTrue, Vec3 } from '../../core';
import { VFXEventType } from '../define';
import { ArrayParameter, BATCH_OPERATION_THRESHOLD, Handle, VFXParameter, VFXValueType } from '../vfx-parameter';

export class VFXEvent {
    public type = VFXEventType.UNKNOWN;
    public particleId = 0;
    public currentTime = 0;
    public prevTime = 0;
    public position = new Vec3();
    public velocity = new Vec3();
    public color = new Color();
    public randomSeed = 0;
}

export class EventArrayParameter extends ArrayParameter {
    get data () {
        return this._data;
    }

    get type () {
        return VFXValueType.EVENT;
    }

    get stride (): number {
        return 1;
    }

    private _data = new Uint32Array(this._capacity);

    reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const oldData = this._data;
        this._data = new Uint32Array(capacity);
        this._data.set(oldData);
    }

    move (a: Handle, b: Handle) {
        this._data[b] = this._data[a];
    }

    getColorAt (out: Color, handle: Handle) {
        Color.fromUint32(out, this._data[handle]);
        return out;
    }

    setColorAt (color: Color, handle: Handle) {
        this._data[handle] = Color.toUint32(color);
    }

    multiplyColorAt (color: Color, handle: Handle) {
        Color.fromUint32(tempColor, this._data[handle]);
        tempColor.multiply(color);
        this._data[handle] = Color.toUint32(tempColor);
    }

    fill (color: Color, fromIndex: Handle, toIndex: Handle) {
        const val = Color.toUint32(color);
        if ((toIndex - fromIndex) > BATCH_OPERATION_THRESHOLD) {
            this._data.fill(val, fromIndex, toIndex);
        } else {
            const data = this._data;
            for (let i = fromIndex; i < toIndex; i++) {
                data[i] = val;
            }
        }
    }

    copyToTypedArray (dest: Uint32Array, destOffset: number, stride: number, strideOffset: number, fromIndex: Handle, toIndex: Handle) {
        if (DEBUG) {
            assertIsTrue(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
            assertIsTrue(stride >= 1 && strideOffset >= 0 && strideOffset < stride);
            assertIsTrue(strideOffset + this.stride <= stride);
            assertIsTrue(dest.length >= (toIndex - fromIndex) * stride + destOffset * stride);
        }

        if (stride === this.stride && strideOffset === 0 && (toIndex - fromIndex) > BATCH_OPERATION_THRESHOLD) {
            const source = (fromIndex === 0 && toIndex === this._capacity) ? this._data : this._data.subarray(fromIndex, toIndex);
            dest.set(source, destOffset * stride);
            return;
        }

        const data = this._data;
        for (let offset = fromIndex * stride + strideOffset, i = fromIndex; i < toIndex; offset += stride, i++) {
            dest[offset] = data[i];
        }
    }

    copyFrom (src: ColorArrayParameter, fromIndex: Handle, toIndex: Handle) {
        if ((toIndex - fromIndex) > BATCH_OPERATION_THRESHOLD) {
            this._data.set(src._data.subarray(fromIndex, toIndex), fromIndex);
        } else {
            const destData = this._data;
            const srcData = src._data;
            for (let i = fromIndex; i < toIndex; i++) {
                destData[i] = srcData[i];
            }
        }
    }
}

export class EventParameter extends VFXParameter {
    get type (): VFXValueType {
        return VFXValueType.EVENT;
    }

    get data (): Readonly<Color> {
        return this._data;
    }

    set data (val: Readonly<Color>) {
        Color.copy(this._data, val);
    }

    private _data = new Color();
}
