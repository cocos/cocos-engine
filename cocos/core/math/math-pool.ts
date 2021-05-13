import { DEBUG, JSB } from 'internal:constants';
import { ValueType } from '../value-types/value-type';

enum MathPoolType {
    VEC2,
    VEC3,
    VEC4,
    MAT3,
    MAT4,
    RECT,
    QUAT
}

const contains = (a: number[], t: number) => {
    for (let i = 0; i < a.length; ++i) {
        if (a[i] === t) return true;
    }
    return false;
};

interface IMemoryPool<P extends MathPoolType> {
    free (handle: IHandle<P>): void;
}

// a little hacky, but works (different specializations should not be assignable to each other)
interface IHandle<P extends MathPoolType> extends Number {
    // we make this non-optional so that even plain numbers would not be directly assignable to handles.
    // this strictness will introduce some casting hassle in the pool implementation itself
    // but becomes generally more useful for client code type checking.
    _: P;
}

type BufferManifest = { [key: string]: number | string; COUNT: number };

class MathBufferPool<P extends MathPoolType, E extends BufferManifest> implements IMemoryPool<P> {
    // naming convension:
    // this._bufferViews[chunk][entry]
    private _elementCount: number;
    private _entryBits: number;
    private _stride: number;
    private _entriesPerChunk: number;
    private _entryMask: number;
    private _chunkMask: number;
    private _poolFlag: number;
    private _arrayBuffers: ArrayBuffer[] = [];
    private _freeLists: number[][] = [];
    private _float32BufferViews: Float32Array[][] = [];

    constructor (poolType: P, enumType: E, entryBits = 8) {
        this._elementCount = enumType.COUNT;
        this._entryBits = entryBits;

        const bytesPerElement = 4;
        this._stride = bytesPerElement * this._elementCount;
        this._entriesPerChunk = 1 << entryBits;
        this._entryMask = this._entriesPerChunk - 1;
        this._poolFlag = 1 << 30;
        this._chunkMask = ~(this._entryMask | this._poolFlag);
    }

    public alloc (): IHandle<P> {
        let i = 0;
        for (; i < this._freeLists.length; i++) {
            const list = this._freeLists[i];
            if (list.length) {
                const j = list[list.length - 1]; list.length--;
                return (i << this._entryBits) + j + this._poolFlag as unknown as IHandle<P>;
            }
        }
        // add a new chunk
        const buffer = new ArrayBuffer(this._stride * this._entriesPerChunk);
        const float32BufferViews: Float32Array[] = [];
        const freeList: number[] = [];
        for (let j = 0; j < this._entriesPerChunk; j++) {
            float32BufferViews.push(new Float32Array(buffer, this._stride * j, this._elementCount));
            if (j) { freeList.push(j); }
        }
        this._arrayBuffers.push(buffer);
        this._float32BufferViews.push(float32BufferViews);
        this._freeLists.push(freeList);
        return (i << this._entryBits) + this._poolFlag as unknown as IHandle<P>; // guarantees the handle is always not zero
    }

    public getBuffer (handle: IHandle<P>): Float32Array {
        // Web engine has Vec2 property, don't record it in shared memory.
        const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
        const entry = this._entryMask & handle as unknown as number;
        const bufferViews = this._float32BufferViews;
        if (DEBUG && (!handle || chunk < 0 || chunk >= bufferViews.length
            || entry < 0 || entry >= this._entriesPerChunk || contains(this._freeLists[chunk], entry))) {
            console.warn('invalid buffer pool handle');
            return [] as unknown as Float32Array;
        }
        return bufferViews[chunk][entry];
    }

    public free (handle: IHandle<P>) {
        const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
        const entry = this._entryMask & handle as unknown as number;
        if (DEBUG && (!handle || chunk < 0 || chunk >= this._freeLists.length
            || entry < 0 || entry >= this._entriesPerChunk || contains(this._freeLists[chunk], entry))) {
            console.warn('invalid buffer pool handle');
            return;
        }
        const bufferViews = this._float32BufferViews;
        bufferViews[chunk][entry].fill(0);
        const freeList = this._freeLists[chunk];
        freeList.push(entry);
        // release array buffer
        if (freeList.length >= this._entriesPerChunk && this._freeLists.length > 1) {
            bufferViews.splice(chunk);
            freeList.splice(chunk);
            this._arrayBuffers.splice(chunk);
        }
    }
}

enum Vec2View {
    X,
    Y,
    COUNT
}

enum Vec3View {
    X,
    Y,
    Z,
    COUNT
}

enum Vec4View {
    X,
    Y,
    Z,
    W,
    COUNT
}

enum Mat3View {
    M00,
    M01,
    M02,
    M03,
    M04,
    m05,
    M06,
    M07,
    M08,
    COUNT
}

enum Mat4View {
    M00,
    M01,
    M02,
    M03,
    M04,
    m05,
    M06,
    M07,
    M08,
    M09,
    M10,
    M11,
    M12,
    M13,
    M14,
    M15,
    COUNT
}

enum QuatView {
    X,
    Y,
    Z,
    W,
    COUNT
}

enum RectView {
    X,
    Y,
    Z,
    W,
    COUNT
}

export const Vec2BufferPool = new MathBufferPool<MathPoolType.VEC2, typeof Vec2View>(MathPoolType.VEC2, Vec2View);
export const Vec3BufferPool = new MathBufferPool<MathPoolType.VEC3, typeof Vec3View>(MathPoolType.VEC3, Vec3View);
export const Vec4BufferPool = new MathBufferPool<MathPoolType.VEC4, typeof Vec4View>(MathPoolType.VEC4, Vec4View);
export const Mat3BufferPool = new MathBufferPool<MathPoolType.MAT3, typeof Mat3View>(MathPoolType.MAT3, Mat3View);
export const Mat4BufferPool = new MathBufferPool<MathPoolType.MAT4, typeof Mat4View>(MathPoolType.MAT4, Mat4View);
export const QuatBufferPool = new MathBufferPool<MathPoolType.QUAT, typeof QuatView>(MathPoolType.QUAT, QuatView);
export const RectBufferPool = new MathBufferPool<MathPoolType.RECT, typeof RectView>(MathPoolType.RECT, RectView);

export type Vec2Handle = IHandle<MathPoolType.VEC2>;
export type Vec3Handle = IHandle<MathPoolType.VEC3>;
export type Vec4Handle = IHandle<MathPoolType.VEC4>;
export type Mat3Handle = IHandle<MathPoolType.MAT3>;
export type Mat4Handle = IHandle<MathPoolType.MAT4>;
export type QuatHandle = IHandle<MathPoolType.QUAT>;
export type RectHandle = IHandle<MathPoolType.RECT>;

export const NULL_HANDLE = 0 as unknown as IHandle<any>;

export class MathBase extends ValueType {
    /**
     * @en Get the internal array data.
     * @zh 获取内部 array 数据。
     */
    public get array (): Float32Array  {
        return this._array;
    }

    protected _handle: Vec3Handle = NULL_HANDLE;
    protected declare _array: Float32Array;

    constructor () {
        super();
        this.initialize();
    }

    public destroy () {
        if (!this._handle) return;
        Vec3BufferPool.free(this._handle);
        this._handle = NULL_HANDLE;
    }

    private initialize () {
        if (this._handle) return;
        this._handle = Vec3BufferPool.alloc();
        this._array = Vec3BufferPool.getBuffer(this._handle);
    }
}
