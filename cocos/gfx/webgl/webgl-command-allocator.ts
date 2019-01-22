import { GFXCommandAllocator, IGFXCommandAllocatorInfo } from '../command-allocator';
import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import {
    WebGLCmdBeginRenderPass,
    WebGLCmdBindStates,
    WebGLCmdCopyBufferToTexture,
    WebGLCmdDraw,
    WebGLCmdUpdateBuffer,
} from './webgl-commands';

export class WebGLGFXCommandPool<T> {

    private _count = 0;
    private _data: T[];
    private _objIdx: Map<T, number>;

    constructor (clazz: new() => T, count: number) {
        this._data = new Array(count);
        this._objIdx = new Map<T, number>();

        for (let i = 0; i < count; ++i) {
            this._data[i] = new clazz();
            this._objIdx.set(this._data[i], i);
        }
    }

    /* */
    public alloc (clazz: new() => T): T {
        return new clazz();
    }
    /* *
    public alloc (clazz: new() => T): T {
        if (this._count >= this._data.length) {
            const size = this._data.length * 2;
            for (let i = this._data.length; i < size; ++i) {
                this._data[i] = new clazz();
                this._objIdx.set(this._data[i], i);
            }
        }

        return this._data[this._count++];
    }
    /* */

    /* */
    public free (obj: T) {
    }
    /* *
    public freeAt (idx: number) {
        if (idx >= this._count) {
            return;
        }

        const last = this._count - 1;
        const tmp = this._data[idx];
        this._data[idx] = this._data[last];
        this._data[last] = tmp;
        this._objIdx.set(this._data[idx], idx);
        this._objIdx.set(this._data[last], last);
        this._count -= 1;
    }
    public free (obj: T) {
        const idx = this._objIdx.get(obj);
        if (idx !== undefined) {
            this.freeAt(idx);
        }
    }
    /* */
}

export class WebGLGFXCommandAllocator extends GFXCommandAllocator {

    public beginRenderPassCmdPool: WebGLGFXCommandPool<WebGLCmdBeginRenderPass>;
    public bindStatesCmdPool: WebGLGFXCommandPool<WebGLCmdBindStates>;
    public drawCmdPool: WebGLGFXCommandPool<WebGLCmdDraw>;
    public updateBufferCmdPool: WebGLGFXCommandPool<WebGLCmdUpdateBuffer>;
    public copyBufferToTextureCmdPool: WebGLGFXCommandPool<WebGLCmdCopyBufferToTexture>;

    constructor (device: GFXDevice) {
        super(device);
        this.beginRenderPassCmdPool = new WebGLGFXCommandPool(WebGLCmdBeginRenderPass, 16);
        this.bindStatesCmdPool = new WebGLGFXCommandPool(WebGLCmdBindStates, 16);
        this.drawCmdPool = new WebGLGFXCommandPool(WebGLCmdDraw, 16);
        this.updateBufferCmdPool = new WebGLGFXCommandPool(WebGLCmdUpdateBuffer, 16);
        this.copyBufferToTextureCmdPool = new WebGLGFXCommandPool(WebGLCmdCopyBufferToTexture, 16);
    }

    public initialize (info: IGFXCommandAllocatorInfo): boolean {

        this._status = GFXStatus.SUCCESS;
        return true;
    }

    public destroy () {
        this._status = GFXStatus.UNREADY;
    }
}
