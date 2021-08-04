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

import { BufferSource, BufferInfo, BufferViewInfo, BufferUsageBit } from '../base/define';
import { Buffer } from '../base/buffer';

import {
    WebGLCmdFuncCreateBuffer,
    WebGLCmdFuncDestroyBuffer,
    WebGLCmdFuncResizeBuffer,
    WebGLCmdFuncUpdateBuffer,
} from './webgl-commands';
import { IWebGLGPUBuffer, IWebGLGPUBufferView, WebGLIndirectDrawInfos } from './webgl-gpu-objects';
import { WebGLDeviceManager } from './webgl-define';

export class WebGLBuffer extends Buffer {
    get gpuBuffer (): IWebGLGPUBuffer {
        return  this._gpuBuffer!;
    }

    get gpuBufferView (): IWebGLGPUBufferView {
        return  this._gpuBufferView!;
    }

    private _gpuBuffer: IWebGLGPUBuffer | null = null;
    private _gpuBufferView: IWebGLGPUBufferView | null = null;
    private _uniformBuffer: Uint8Array | null = null;

    public initialize (info: BufferInfo | BufferViewInfo): boolean {
        if ('buffer' in info) { // buffer view
            this._isBufferView = true;

            const buffer = info.buffer as WebGLBuffer;

            this._usage = buffer.usage;
            this._memUsage = buffer.memUsage;
            this._size = this._stride = info.range;
            this._count = 1;
            this._flags = buffer.flags;

            this._gpuBufferView = {
                gpuBuffer: buffer.gpuBuffer,
                offset: info.offset,
                range: info.range,
            };
        } else { // native buffer
            this._usage = info.usage;
            this._memUsage = info.memUsage;
            this._size = info.size;
            this._stride = Math.max(info.stride || this._size, 1);
            this._count = this._size / this._stride;
            this._flags = info.flags;

            if ((this._usage & BufferUsageBit.UNIFORM) && this._size > 0) {
                this._uniformBuffer = new Uint8Array(this._size);
            }

            this._gpuBuffer = {
                usage: this._usage,
                memUsage: this._memUsage,
                size: this._size,
                stride: this._stride,
                buffer: null,
                vf32: null,
                indirects: new WebGLIndirectDrawInfos(),
                glTarget: 0,
                glBuffer: null,
            };

            if (this._usage & BufferUsageBit.UNIFORM) {
                this._gpuBuffer.buffer = this._uniformBuffer;
            }

            WebGLCmdFuncCreateBuffer(WebGLDeviceManager.instance, this._gpuBuffer);

            WebGLDeviceManager.instance.memoryStatus.bufferSize += this._size;
        }

        return true;
    }

    public destroy () {
        if (this._gpuBuffer) {
            WebGLCmdFuncDestroyBuffer(WebGLDeviceManager.instance, this._gpuBuffer);
            WebGLDeviceManager.instance.memoryStatus.bufferSize -= this._size;
            this._gpuBuffer = null;
        }

        if (this._gpuBufferView) {
            this._gpuBufferView = null;
        }
    }

    public resize (size: number) {
        if (this._isBufferView) {
            console.warn('cannot resize buffer views!');
            return;
        }

        const oldSize = this._size;
        if (oldSize === size) { return; }

        this._size = size;
        this._count = this._size / this._stride;

        if (this._uniformBuffer) {
            this._uniformBuffer = new Uint8Array(size);
        }

        if (this._gpuBuffer) {
            if (this._uniformBuffer) {
                this._gpuBuffer.buffer = this._uniformBuffer;
            }

            this._gpuBuffer.size = size;
            if (size > 0) {
                WebGLCmdFuncResizeBuffer(WebGLDeviceManager.instance, this._gpuBuffer);
                WebGLDeviceManager.instance.memoryStatus.bufferSize -= oldSize;
                WebGLDeviceManager.instance.memoryStatus.bufferSize += size;
            }
        }
    }

    public update (buffer: BufferSource, size?: number) {
        if (this._isBufferView) {
            console.warn('cannot update through buffer views!');
            return;
        }

        let buffSize: number;
        if (size !== undefined) {
            buffSize = size;
        } else if (this._usage & BufferUsageBit.INDIRECT) {
            buffSize = 0;
        } else {
            buffSize = (buffer as ArrayBuffer).byteLength;
        }

        WebGLCmdFuncUpdateBuffer(
            WebGLDeviceManager.instance,
            this._gpuBuffer!,
            buffer,
            0,
            buffSize,
        );
    }
}
