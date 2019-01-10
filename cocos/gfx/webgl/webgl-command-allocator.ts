import { GFXCommandAllocator, IGFXCommandAllocatorInfo } from '../command-allocator';
import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { WebGLCmdBeginRenderPass, WebGLCmdBindBindingLayout, WebGLCmdBindInputAssembler, WebGLCmdBindPipelineState, WebGLCmdCopyBufferToTexture, WebGLCmdDraw, WebGLCmdUpdateBuffer } from './webgl-commands';

export class WebGLGFXCommandPool<T> {

    private _frees: Array<T|null>;
    private _freeIdx: number = 0;
    private _increase: number = 0;

    constructor (clazz: new() => T, count: number, increase: number) {
        this._frees = new Array(count);
        for (let i = 0; i < count; ++i) {
            this._frees[i] = new clazz();
        }

        this._freeIdx = count - 1;
        this._increase = increase;
    }

    public alloc (clazz: new() => T): T | null {

        if (this._freeIdx <= 0) {
            const size = this._frees.length + this._increase;
            const temp = this._frees;
            this._frees = new Array<T>(size);

            for (let i = 0; i < temp.length; ++i) {
                this._frees[i] = temp[i];
            }

            for (let i = temp.length + 1; i < size; ++i) {
                this._frees[i] = new clazz();
            }

            this._freeIdx += (size - temp.length);
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
    public bindPipelineStateCmdPool: WebGLGFXCommandPool<WebGLCmdBindPipelineState>;
    public bindBindingLayoutCmdPool: WebGLGFXCommandPool<WebGLCmdBindBindingLayout>;
    public bindInputAssemblerCmdPool: WebGLGFXCommandPool<WebGLCmdBindInputAssembler>;
    public drawCmdPool: WebGLGFXCommandPool<WebGLCmdDraw>;
    public updateBufferCmdPool: WebGLGFXCommandPool<WebGLCmdUpdateBuffer>;
    public copyBufferToTextureCmdPool: WebGLGFXCommandPool<WebGLCmdCopyBufferToTexture>;

    constructor (device: GFXDevice) {
        super(device);
        this.beginRenderPassCmdPool = new WebGLGFXCommandPool(WebGLCmdBeginRenderPass, 64, 32);
        this.bindPipelineStateCmdPool = new WebGLGFXCommandPool(WebGLCmdBindPipelineState, 64, 32);
        this.bindBindingLayoutCmdPool = new WebGLGFXCommandPool(WebGLCmdBindBindingLayout, 64, 32);
        this.bindInputAssemblerCmdPool = new WebGLGFXCommandPool(WebGLCmdBindInputAssembler, 64, 32);
        this.drawCmdPool = new WebGLGFXCommandPool(WebGLCmdDraw, 64, 32);
        this.updateBufferCmdPool = new WebGLGFXCommandPool(WebGLCmdUpdateBuffer, 64, 32);
        this.copyBufferToTextureCmdPool = new WebGLGFXCommandPool(WebGLCmdCopyBufferToTexture, 64, 32);
    }

    public initialize (info: IGFXCommandAllocatorInfo): boolean {

        this._status = GFXStatus.SUCCESS;
        return true;
    }

    public destroy () {
        this._status = GFXStatus.UNREADY;
    }
}
