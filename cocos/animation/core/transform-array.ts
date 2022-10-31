import { Vec3 } from '../../core/math/vec3';
import { Quat } from '../../core/math/quat';
import { Transform } from './Transform';

const TRANSFORM_STRIDE_IN_FLOATS = 10;

const TRANSFORM_STRIDE_IN_BYTES = Float64Array.BYTES_PER_ELEMENT * TRANSFORM_STRIDE_IN_FLOATS;

const ROTATION_OFFSET = 3;

const SCALE_OFFSET = ROTATION_OFFSET + 4;

/**
 * Array-buffer-based transform array.
 */
export class TransformArray {
    public static get BYTES_PER_ELEMENT () {
        return TRANSFORM_STRIDE_IN_BYTES;
    }

    constructor (length?: number);

    constructor (buffer: ArrayBuffer, byteOffset?: number, length?: number);

    constructor (bufferOrLength?: number | ArrayBuffer, byteOffset?: number, length_?: number) {
        if (typeof bufferOrLength === 'undefined') {
            this._data = new Float64Array();
        } else if (typeof bufferOrLength === 'number') {
            this._data = new Float64Array(TRANSFORM_STRIDE_IN_FLOATS * bufferOrLength);
        } else {
            this._data = new Float64Array(
                bufferOrLength,
                byteOffset,
                typeof length_ === 'number' ? TRANSFORM_STRIDE_IN_FLOATS * length_ : undefined,
            );
        }
    }

    get buffer () {
        return this._data.buffer;
    }

    get byteLength () {
        return this._data.byteLength;
    }

    get byteOffset () {
        return this._data.byteOffset;
    }

    get length () {
        return this._data.length / TRANSFORM_STRIDE_IN_FLOATS;
    }

    public getTransform (index: number, out: Transform) {
        const {
            _data: data,
        } = this;
        const {
            position,
            rotation,
            scale,
        } = out;
        const baseOffset = TRANSFORM_STRIDE_IN_FLOATS * index;
        Vec3.fromArray(position, data, baseOffset);
        Quat.fromArray(rotation, data, baseOffset + ROTATION_OFFSET);
        Vec3.fromArray(scale, data, baseOffset + SCALE_OFFSET);
        return out;
    }

    public getPosition (index: number, out: Vec3) {
        const {
            _data: data,
        } = this;
        const baseOffset = TRANSFORM_STRIDE_IN_FLOATS * index;
        Vec3.fromArray(out, data, baseOffset);
        return out;
    }

    public getRotation (index: number, out: Quat) {
        const {
            _data: data,
        } = this;
        const baseOffset = TRANSFORM_STRIDE_IN_FLOATS * index;
        Quat.fromArray(out, data, baseOffset + ROTATION_OFFSET);
        return out;
    }

    public getScale (index: number, out: Vec3) {
        const {
            _data: data,
        } = this;
        const baseOffset = TRANSFORM_STRIDE_IN_FLOATS * index;
        Vec3.fromArray(out, data, baseOffset + SCALE_OFFSET);
        return out;
    }

    public setTransform (index: number, value: Readonly<Transform>) {
        const {
            _data: data,
        } = this;
        const {
            position,
            rotation,
            scale,
        } = value;
        const baseOffset = TRANSFORM_STRIDE_IN_FLOATS * index;
        Vec3.toArray(data, position, baseOffset);
        Quat.toArray(data, rotation, baseOffset + ROTATION_OFFSET);
        Vec3.toArray(data, scale, baseOffset + SCALE_OFFSET);
    }

    public setPosition (index: number, value: Readonly<Vec3>) {
        const {
            _data: data,
        } = this;
        const baseOffset = TRANSFORM_STRIDE_IN_FLOATS * index;
        Vec3.toArray(data, value, baseOffset);
    }

    public setRotation (index: number, value: Readonly<Quat>) {
        const {
            _data: data,
        } = this;
        const baseOffset = TRANSFORM_STRIDE_IN_FLOATS * index;
        Quat.toArray(data, value, baseOffset + ROTATION_OFFSET);
    }

    public setScale (index: number, value: Readonly<Vec3>) {
        const {
            _data: data,
        } = this;
        const baseOffset = TRANSFORM_STRIDE_IN_FLOATS * index;
        Vec3.toArray(data, value, baseOffset + SCALE_OFFSET);
    }

    /**
     * Same algorithm as https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/copyWithin
     * except for the the operating objects are transforms.
     */
    public copyWithin (target: number, start: number, end?: number) {
        this._data.copyWithin(
            target * TRANSFORM_STRIDE_IN_FLOATS,
            start * TRANSFORM_STRIDE_IN_FLOATS,
            typeof end === 'number' ? end * TRANSFORM_STRIDE_IN_FLOATS : undefined,
        );
    }

    /**
     * Same algorithm as https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/fill
     * except for the the operating objects are transforms.
     */
    public fill (value: Readonly<Transform>, start?: number, end?: number) {
        const { length } = this;
        start ??= 0;
        end ??= length;
        if (start >= length) {
            return;
        }
        this.setTransform(start, value);
        for (let i = start + 1; i < end; ++i) {
            this.copyWithin(i, start, start + 1);
        }
    }

    /**
     * Same as `this.fill(Transform.ZERO, start, end)`.
     */
    public fillZero (start?: number, end?: number) {
        this._data.fill(
            0.0,
            typeof start === 'number' ? start * TRANSFORM_STRIDE_IN_FLOATS : undefined,
            typeof end === 'number' ? end * TRANSFORM_STRIDE_IN_FLOATS : undefined,
        );
    }

    /**
     * Same algorithm as https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set
     * except for:
     * - the the operating objects are transforms,
     * - plain array is not allowed.
     */
    public set (transformArray: TransformArray, targetOffset?: number) {
        this._data.set(
            transformArray._data,
            typeof targetOffset === 'number' ? targetOffset * TRANSFORM_STRIDE_IN_FLOATS : undefined,
        );
    }

    /**
     * Same algorithm as https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice
     * except for the the operating objects are transforms.
     */
    public slice (start?: number, end?: number) {
        const dataSliced = this._data.slice(
            typeof start === 'number' ? start * TRANSFORM_STRIDE_IN_FLOATS : undefined,
            typeof end === 'number' ? end * TRANSFORM_STRIDE_IN_FLOATS : undefined,
        );
        return new TransformArray(dataSliced.buffer, dataSliced.byteOffset, dataSliced.length / TRANSFORM_STRIDE_IN_FLOATS);
    }

    private _data: Float64Array;
}
