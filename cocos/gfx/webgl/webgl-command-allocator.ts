import { CachedArray } from '../../core/memop/cached-array';
import { GFXCommandAllocator, IGFXCommandAllocatorInfo } from '../command-allocator';
import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import {
    WebGLCmdBeginRenderPass,
    WebGLCmdBindStates,
    WebGLCmdCopyBufferToTexture,
    WebGLCmdDraw,
    WebGLCmdObject,
    WebGLCmdPackage,
    WebGLCmdUpdateBuffer,
} from './webgl-commands';

export class WebGLGFXCommandPool<T extends WebGLCmdObject> {

    private _frees: Array<T|null>;
    private _freeIdx: number = 0;
    private _freeCmds: CachedArray<T>;

    constructor (clazz: new() => T, count: number) {
        this._frees = new Array(count);
        this._freeCmds = new CachedArray(count);
        for (let i = 0; i < count; ++i) {
            this._frees[i] = new clazz();
        }
        this._freeIdx = count - 1;
    }

    public alloc (clazz: new() => T): T {
        return new clazz();
    }

    /*
    public alloc (clazz: new() => T): T {
        if (this._freeIdx < 0) {
            const size = this._frees.length * 2;
            const temp = this._frees;
            this._frees = new Array<T>(size);

            const increase = size - temp.length;
            for (let i = 0; i < increase; ++i) {
                this._frees[i] = new clazz();
            }

            for (let i = increase, j = 0; i < size; ++i, ++j) {
                this._frees[i] = temp[j];
            }

            this._freeIdx += increase;
        }

        const cmd = this._frees[this._freeIdx];
        this._frees[this._freeIdx--] = null;
        return cmd!;
    }
    */

    public free (cmd: T) {
        this._freeCmds.push(cmd);
    }

    public freeCmds (cmds: CachedArray<T>) {
        // this._freeCmds.concat(cmds);
    }

    public release () {
        for (let i = 0; i < this._freeCmds.length; ++i) {
            const cmd = this._freeCmds.array[i];
            cmd.clear();
            this._frees[++this._freeIdx] = cmd;
        }
        this._freeCmds.clear();
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

    public clearCmds (cmdPackage: WebGLCmdPackage) {

        if (cmdPackage.beginRenderPassCmds.length) {
            this.beginRenderPassCmdPool.freeCmds(cmdPackage.beginRenderPassCmds);
            cmdPackage.beginRenderPassCmds.clear();
        }

        if (cmdPackage.bindStatesCmds.length) {
            this.bindStatesCmdPool.freeCmds(cmdPackage.bindStatesCmds);
            cmdPackage.bindStatesCmds.clear();
        }

        if (cmdPackage.drawCmds.length) {
            this.drawCmdPool.freeCmds(cmdPackage.drawCmds);
            cmdPackage.drawCmds.clear();
        }

        if (cmdPackage.updateBufferCmds.length) {
            this.updateBufferCmdPool.freeCmds(cmdPackage.updateBufferCmds);
            cmdPackage.updateBufferCmds.clear();
        }

        if (cmdPackage.copyBufferToTextureCmds.length) {
            this.copyBufferToTextureCmdPool.freeCmds(cmdPackage.copyBufferToTextureCmds);
            cmdPackage.copyBufferToTextureCmds.clear();
        }

        cmdPackage.cmds.clear();
    }

    public releaseCmds () {
        this.beginRenderPassCmdPool.release();
        this.bindStatesCmdPool.release();
        this.drawCmdPool.release();
        this.updateBufferCmdPool.release();
        this.copyBufferToTextureCmdPool.release();
    }
}
