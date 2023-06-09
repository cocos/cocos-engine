import { DEBUG } from 'internal:constants';
import { Color, assertIsTrue, Vec3 } from '../../core';
import { VFXEventType } from '../define';
import { ArrayParameter, BATCH_OPERATION_THRESHOLD, Handle, VFXParameter, VFXValueType } from '../vfx-parameter';

const STRIDE = 12;
export class VFXEvent {
    public type = VFXEventType.UNKNOWN;
    public particleId = 0;
    public currentTime = 0;
    public prevTime = 0;
    public position = new Vec3();
    public velocity = new Vec3();
    public color = new Color();
    public randomSeed = 0;

    copy (src: VFXEvent) {
        this.type = src.type;
        this.particleId = src.particleId;
        this.currentTime = src.currentTime;
        this.prevTime = src.prevTime;
        Vec3.copy(this.position, src.position);
        Vec3.copy(this.velocity, src.velocity);
        Color.copy(this.color, src.color);
        this.randomSeed = src.randomSeed;
    }
}

export class EventArrayParameter extends ArrayParameter {
    get data () {
        return this._data;
    }

    get type () {
        return VFXValueType.EVENT;
    }

    private _data = new Float32Array(STRIDE * this._capacity);
    private _uint32data = new Uint32Array(this._data.buffer);

    reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const oldData = this._data;
        this._data = new Float32Array(STRIDE * capacity);
        this._uint32data = new Uint32Array(this._data.buffer);
        this._data.set(oldData);
    }

    moveTo (a: Handle, b: Handle) {
        if (DEBUG) {
            assertIsTrue(a <= this._capacity && a >= 0);
            assertIsTrue(b <= this._capacity && b >= 0);
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
        this._data[offsetB + 11] = this._data[offsetA + 11];
    }

    getEventAt (out: VFXEvent, handle: Handle) {
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
        out.randomSeed = uint32Data[offset + 11];
        return out;
    }

    setEventAt (event: VFXEvent, handle: Handle) {
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
        uint32Data[offset + 11] = event.randomSeed;
    }

    fill (event: VFXEvent, fromIndex: Handle, toIndex: Handle) {
        if (DEBUG) {
            assertIsTrue(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }

        const data = this._data;
        const uint32Data = this._uint32data;
        const type = event.type;
        const particleId = event.particleId;
        const currentTime = event.currentTime;
        const prevTime = event.prevTime;
        const position = event.position;
        const velocity = event.velocity;
        const color = event.color;
        const randomSeed = event.randomSeed;
        for (let i = fromIndex; i < toIndex; ++i) {
            const offset = fromIndex * STRIDE;
            uint32Data[offset] = type;
            data[offset + 1] = particleId;
            data[offset + 2] = currentTime;
            data[offset + 3] = prevTime;
            data[offset + 4] = position.x;
            data[offset + 5] = position.y;
            data[offset + 6] = position.z;
            data[offset + 7] = velocity.x;
            data[offset + 8] = velocity.y;
            data[offset + 9] = velocity.z;
            uint32Data[offset + 10] = Color.toUint32(color);
            uint32Data[offset + 11] = randomSeed;
        }
    }

    copyToTypedArray (dest: Uint32Array, destOffset: number, stride: number, strideOffset: number, fromIndex: Handle, toIndex: Handle) {
    }

    copyFrom (src: EventArrayParameter, fromIndex: Handle, toIndex: Handle) {
    }
}

export class EventParameter extends VFXParameter {
    get type (): VFXValueType {
        return VFXValueType.EVENT;
    }

    get data (): Readonly<VFXEvent> {
        return this._data;
    }

    set data (val: Readonly<VFXEvent>) {
        this._data.copy(val);
    }

    private _data = new VFXEvent();
}
