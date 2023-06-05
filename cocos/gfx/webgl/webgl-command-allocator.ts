/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { CachedArray } from '../../core';
import {
    WebGLCmdBeginRenderPass,
    WebGLCmdBindStates,
    WebGLCmdBlitTexture,
    WebGLCmdCopyBufferToTexture,
    WebGLCmdDraw,
    WebGLCmdObject,
    WebGLCmdPackage,
    WebGLCmdUpdateBuffer,
} from './webgl-commands';

export class WebGLCommandPool<T extends WebGLCmdObject> {
    private _frees: (T|null)[];
    private _freeIdx = 0;
    private _freeCmds: CachedArray<T>;

    constructor (Clazz: new() => T, count: number) {
        this._frees = new Array(count);
        this._freeCmds = new CachedArray(count);
        for (let i = 0; i < count; ++i) {
            this._frees[i] = new Clazz();
        }
        this._freeIdx = count - 1;
    }

    /*
    public alloc (clazz: new() => T): T {
        return new clazz();
    }
    */

    public alloc (Clazz: new() => T): T {
        if (this._freeIdx < 0) {
            const size = this._frees.length * 2;
            const temp = this._frees;
            this._frees = new Array<T>(size);

            const increase = size - temp.length;
            for (let i = 0; i < increase; ++i) {
                this._frees[i] = new Clazz();
            }

            for (let i = increase, j = 0; i < size; ++i, ++j) {
                this._frees[i] = temp[j];
            }

            this._freeIdx += increase;
        }

        const cmd = this._frees[this._freeIdx]!;
        this._frees[this._freeIdx--] = null;
        ++cmd.refCount;
        return cmd;
    }

    public free (cmd: T): void {
        if (--cmd.refCount === 0) {
            this._freeCmds.push(cmd);
        }
    }

    public freeCmds (cmds: CachedArray<T>): void {
        // return ;
        for (let i = 0; i < cmds.length; ++i) {
            if (--cmds.array[i].refCount === 0) {
                this._freeCmds.push(cmds.array[i]);
            }
        }
    }

    public release (): void {
        for (let i = 0; i < this._freeCmds.length; ++i) {
            const cmd = this._freeCmds.array[i];
            cmd.clear();
            this._frees[++this._freeIdx] = cmd;
        }
        this._freeCmds.clear();
    }
}

export class WebGLCommandAllocator {
    public beginRenderPassCmdPool: WebGLCommandPool<WebGLCmdBeginRenderPass>;
    public bindStatesCmdPool: WebGLCommandPool<WebGLCmdBindStates>;
    public drawCmdPool: WebGLCommandPool<WebGLCmdDraw>;
    public updateBufferCmdPool: WebGLCommandPool<WebGLCmdUpdateBuffer>;
    public copyBufferToTextureCmdPool: WebGLCommandPool<WebGLCmdCopyBufferToTexture>;
    public blitTextureCmdPool: WebGLCommandPool<WebGLCmdBlitTexture>;

    constructor () {
        this.beginRenderPassCmdPool = new WebGLCommandPool(WebGLCmdBeginRenderPass, 1);
        this.bindStatesCmdPool = new WebGLCommandPool(WebGLCmdBindStates, 1);
        this.drawCmdPool = new WebGLCommandPool(WebGLCmdDraw, 1);
        this.updateBufferCmdPool = new WebGLCommandPool(WebGLCmdUpdateBuffer, 1);
        this.copyBufferToTextureCmdPool = new WebGLCommandPool(WebGLCmdCopyBufferToTexture, 1);
        this.blitTextureCmdPool = new WebGLCommandPool(WebGLCmdBlitTexture, 1);
    }

    public clearCmds (cmdPackage: WebGLCmdPackage): void {
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

        if (cmdPackage.blitTextureCmds.length) {
            this.blitTextureCmdPool.freeCmds(cmdPackage.blitTextureCmds);
            cmdPackage.blitTextureCmds.clear();
        }

        cmdPackage.cmds.clear();
    }

    public releaseCmds (): void {
        this.beginRenderPassCmdPool.release();
        this.bindStatesCmdPool.release();
        this.drawCmdPool.release();
        this.updateBufferCmdPool.release();
        this.copyBufferToTextureCmdPool.release();
        this.blitTextureCmdPool.release();
    }
}
