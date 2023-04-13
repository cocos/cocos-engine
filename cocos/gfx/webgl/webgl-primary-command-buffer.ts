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

import { Buffer } from '../base/buffer';
import { CommandBuffer } from '../base/command-buffer';
import { BufferSource, DrawInfo, BufferTextureCopy, Color, Rect, BufferUsageBit, Viewport, TextureBlit, Filter } from '../base/define';
import { Framebuffer } from '../base/framebuffer';
import { InputAssembler } from '../base/input-assembler';
import { Texture } from '../base/texture';
import { WebGLBuffer } from './webgl-buffer';
import { WebGLCommandBuffer } from './webgl-command-buffer';
import {
    WebGLCmdFuncBeginRenderPass, WebGLCmdFuncBindStates, WebGLCmdFuncBlitTexture, WebGLCmdFuncCopyBuffersToTexture,
    WebGLCmdFuncDraw, WebGLCmdFuncExecuteCmds, WebGLCmdFuncUpdateBuffer } from './webgl-commands';
import { WebGLFramebuffer } from './webgl-framebuffer';
import { WebGLTexture } from './webgl-texture';
import { RenderPass } from '../base/render-pass';
import { WebGLRenderPass } from './webgl-render-pass';
import { WebGLDeviceManager } from './webgl-define';

export class WebGLPrimaryCommandBuffer extends WebGLCommandBuffer {
    public beginRenderPass (
        renderPass: RenderPass,
        framebuffer: Framebuffer,
        renderArea: Readonly<Rect>,
        clearColors: Readonly<Color[]>,
        clearDepth: number,
        clearStencil: number,
    ) {
        WebGLCmdFuncBeginRenderPass(
            WebGLDeviceManager.instance,
            (renderPass as WebGLRenderPass).gpuRenderPass,
            (framebuffer as WebGLFramebuffer).gpuFramebuffer,
            renderArea, clearColors, clearDepth, clearStencil,
        );
        this._isInRenderPass = true;
    }

    public draw (infoOrAssembler: DrawInfo | InputAssembler) {
        if (this._isInRenderPass) {
            if (this._isStateInvalied) {
                this.bindStates();
            }

            const info = 'drawInfo' in infoOrAssembler ? infoOrAssembler.drawInfo : infoOrAssembler;

            WebGLCmdFuncDraw(WebGLDeviceManager.instance, info);

            ++this._numDrawCalls;
            this._numInstances += info.instanceCount;
            const indexCount = info.indexCount || info.vertexCount;
            if (this._curGPUPipelineState) {
                const glPrimitive = this._curGPUPipelineState.glPrimitive;
                switch (glPrimitive) {
                case 0x0004: { // WebGLRenderingContext.TRIANGLES
                    this._numTris += indexCount / 3 * Math.max(info.instanceCount, 1);
                    break;
                }
                case 0x0005: // WebGLRenderingContext.TRIANGLE_STRIP
                case 0x0006: { // WebGLRenderingContext.TRIANGLE_FAN
                    this._numTris += (indexCount - 2) * Math.max(info.instanceCount, 1);
                    break;
                }
                default:
                }
            }
        } else {
            console.error('Command \'draw\' must be recorded inside a render pass.');
        }
    }

    public setViewport (viewport: Readonly<Viewport>) {
        const { stateCache: cache, gl } = WebGLDeviceManager.instance;

        if (cache.viewport.left !== viewport.left
            || cache.viewport.top !== viewport.top
            || cache.viewport.width !== viewport.width
            || cache.viewport.height !== viewport.height) {
            gl.viewport(viewport.left, viewport.top, viewport.width, viewport.height);

            cache.viewport.left = viewport.left;
            cache.viewport.top = viewport.top;
            cache.viewport.width = viewport.width;
            cache.viewport.height = viewport.height;
        }
    }

    public setScissor (scissor: Readonly<Rect>) {
        const { stateCache: cache, gl } = WebGLDeviceManager.instance;

        if (cache.scissorRect.x !== scissor.x
            || cache.scissorRect.y !== scissor.y
            || cache.scissorRect.width !== scissor.width
            || cache.scissorRect.height !== scissor.height) {
            gl.scissor(scissor.x, scissor.y, scissor.width, scissor.height);

            cache.scissorRect.x = scissor.x;
            cache.scissorRect.y = scissor.y;
            cache.scissorRect.width = scissor.width;
            cache.scissorRect.height = scissor.height;
        }
    }

    public updateBuffer (buffer: Buffer, data: Readonly<BufferSource>, size?: number) {
        if (!this._isInRenderPass) {
            const gpuBuffer = (buffer as WebGLBuffer).gpuBuffer;
            if (gpuBuffer) {
                let buffSize: number;
                if (size !== undefined) {
                    buffSize = size;
                } else if (buffer.usage & BufferUsageBit.INDIRECT) {
                    buffSize = 0;
                } else {
                    buffSize = (data as ArrayBuffer).byteLength;
                }

                WebGLCmdFuncUpdateBuffer(WebGLDeviceManager.instance, gpuBuffer, data as ArrayBuffer, 0, buffSize);
            }
        } else {
            console.error('Command \'updateBuffer\' must be recorded outside a render pass.');
        }
    }

    public copyBuffersToTexture (buffers: Readonly<ArrayBufferView[]>, texture: Texture, regions: Readonly<BufferTextureCopy[]>) {
        if (!this._isInRenderPass) {
            const gpuTexture = (texture as WebGLTexture).gpuTexture;
            if (gpuTexture) {
                WebGLCmdFuncCopyBuffersToTexture(WebGLDeviceManager.instance, buffers, gpuTexture, regions);
            }
        } else {
            console.error('Command \'copyBufferToTexture\' must be recorded outside a render pass.');
        }
    }

    public execute (cmdBuffs: Readonly<CommandBuffer[]>, count: number) {
        for (let i = 0; i < count; ++i) {
            // actually they are secondary buffers, the cast here is only for type checking
            const webGLCmdBuff = cmdBuffs[i] as WebGLPrimaryCommandBuffer;
            WebGLCmdFuncExecuteCmds(WebGLDeviceManager.instance, webGLCmdBuff.cmdPackage);
            this._numDrawCalls += webGLCmdBuff._numDrawCalls;
            this._numInstances += webGLCmdBuff._numInstances;
            this._numTris += webGLCmdBuff._numTris;
        }
    }

    protected bindStates () {
        WebGLCmdFuncBindStates(WebGLDeviceManager.instance, this._curGPUPipelineState, this._curGPUInputAssembler,
            this._curGPUDescriptorSets, this._curDynamicOffsets, this._curDynamicStates);
        this._isStateInvalied = false;
    }

    public blitTexture (srcTexture: Readonly<Texture>, dstTexture: Texture, regions: Readonly<TextureBlit []>, filter: Filter): void {
        const gpuTextureSrc = (srcTexture as WebGLTexture).gpuTexture;
        const gpuTextureDst = (dstTexture as WebGLTexture).gpuTexture;
        WebGLCmdFuncBlitTexture(WebGLDeviceManager.instance, gpuTextureSrc, gpuTextureDst, regions, filter);
    }
}
