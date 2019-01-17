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

    private _frees: Array<T|null>;
    private _freeIdx: number = 0;

    constructor (clazz: new() => T, count: number) {
        this._frees = new Array(count);
        for (let i = 0; i < count; ++i) {
            this._frees[i] = new clazz();
        }

        this._freeIdx = count - 1;
    }

    public alloc (clazz: new() => T): T | null {

        if (this._freeIdx < 0) {
            const size = this._frees.length * 2;
            const temp = this._frees;
            this._frees = new Array<T>(size);

            const increase = size - temp.length;
            for (let i = 0; i < increase; ++i) {
                this._frees[i] = new clazz();
            }

            this._freeIdx += increase;
        }

        const item = this._frees[this._freeIdx];
        this._frees[this._freeIdx--] = null;

        return item;
    }

    public free (cmd: T) {
        this._frees[++this._freeIdx] = cmd;
    }
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
