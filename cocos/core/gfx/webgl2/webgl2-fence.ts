/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { Fence, FenceInfo } from '../fence';
import { WebGL2Device } from './webgl2-device';

export class WebGL2Fence extends Fence {
    private _sync: WebGLSync | null = null;

    public initialize (info: FenceInfo): boolean {
        return true;
    }

    public destroy () {
    }

    public wait () {
        if (this._sync) {
            const gl = (this._device as WebGL2Device).gl;
            gl.clientWaitSync(this._sync, 0, gl.TIMEOUT_IGNORED);
        }
    }

    public reset () {
        if (this._sync) {
            const gl = (this._device as WebGL2Device).gl;
            gl.deleteSync(this._sync);
            this._sync = null;
        }
    }

    public insert () {
        const gl = (this._device as WebGL2Device).gl;
        if (this._sync) { gl.deleteSync(this._sync); }
        this._sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    }
}
