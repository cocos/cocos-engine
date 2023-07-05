import { DEBUG } from 'internal:constants';
import { Color, assertIsTrue, Vec3 } from '../../core';
import { VFXEventType } from '../define';
import { VFXArray, BATCH_OPERATION_THRESHOLD, Handle, VFXValue, VFXValueType } from '../vfx-parameter';

const STRIDE = 11;
export class VFXEventInfo {
    public type = VFXEventType.UNKNOWN;
    public particleId = 0;
    public currentTime = 0;
    public prevTime = 0;
    public position = new Vec3();
    public velocity = new Vec3();
    public color = new Color();

    copy (src: VFXEventInfo) {
        this.type = src.type;
        this.particleId = src.particleId;
        this.currentTime = src.currentTime;
        this.prevTime = src.prevTime;
        Vec3.copy(this.position, src.position);
        Vec3.copy(this.velocity, src.velocity);
        Color.copy(this.color, src.color);
    }
}

export class VFXEventArray extends VFXArray {
    get type () {
        return VFXValueType.EVENT;
    }

    private _data = new Float32Array(STRIDE * this._size);
    private _uint32data = new Uint32Array(this._data.buffer);

    reserve (size: number) {
        if (size <= this._size) return;
        this._size = size;
        const oldData = this._data;
        this._data = new Float32Array(STRIDE * size);
        this._uint32data = new Uint32Array(this._data.buffer);
        this._data.set(oldData);
    }

    moveTo (a: Handle, b: Handle) {
        if (DEBUG) {
            assertIsTrue(a <= this._size && a >= 0);
            assertIsTrue(b <= this._size && b >= 0);
        }
        const offsetA = a * STRIDE;
        const offsetB = b * STRIDE;
        this._data[offsetB] = this._data[offsetA];
        this._data[offsetB + 1] = this._data[offsetA + 1];
        this._data[offsetB + 2] = this._data[offsetA + 2];
        this._data[offsetB + 3] = this._data[offsetA + 3];
        this._data[offsetB + 4] = this._data[offsetA + 4];
        this._data[offsetB + 5] = this._data[offsetA + 5];
        this._data[offsetB + 6] = this._data[offsetA + 6];
        this._data[offsetB + 7] = this._data[offsetA + 7];
        this._data[offsetB + 8] = this._data[offsetA + 8];
        this._data[offsetB + 9] = this._data[offsetA + 9];
        this._data[offsetB + 10] = this._data[offsetA + 10];
    }

    getEventAt (out: VFXEventInfo, handle: Handle) {
        const data = this._data;
        const uint32Data = this._uint32data;
        const offset = handle * STRIDE;
        out.type = uint32Data[offset];
        out.particleId = data[offset + 1];
        out.currentTime = data[offset + 2];
        out.prevTime = data[offset + 3];
        Vec3.set(out.position, data[offset + 4], data[offset + 5], data[offset + 6]);
        Vec3.set(out.velocity, data[offset + 7], data[offset + 8], data[offset + 9]);
        Color.fromUint32(out.color, uint32Data[offset + 10]);
        return out;
    }

    setEventAt (event: VFXEventInfo, handle: Handle) {
        const data = this._data;
        const uint32Data = this._uint32data;
        const offset = handle * STRIDE;
        uint32Data[offset] = event.type;
        data[offset + 1] = event.particleId;
        data[offset + 2] = event.currentTime;
        data[offset + 3] = event.prevTime;
        data[offset + 4] = event.position.x;
        data[offset + 5] = event.position.y;
        data[offset + 6] = event.position.z;
        data[offset + 7] = event.velocity.x;
        data[offset + 8] = event.velocity.y;
        data[offset + 9] = event.velocity.z;
        uint32Data[offset + 10] = Color.toUint32(event.color);
    }

    copyFrom (src: VFXEventArray, fromIndex: Handle, toIndex: Handle) {
    }
}

export class VFXEvent extends VFXValue {
    get type (): VFXValueType {
        return VFXValueType.EVENT;
    }

    get data (): Readonly<VFXEventInfo> {
        return this._data;
    }

    set data (val: Readonly<VFXEventInfo>) {
        this._data.copy(val);
    }

    private _data = new VFXEventInfo();
}
