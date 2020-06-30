import { GFXBuffer, GFXBufferSource } from '../buffer';
import { GFXCommandBuffer } from '../command-buffer';
import { GFXBufferTextureCopy, GFXBufferUsageBit, GFXClearFlag, GFXTextureLayout, IGFXColor, IGFXRect } from '../define';
import { GFXFramebuffer } from '../framebuffer';
import { GFXInputAssembler } from '../input-assembler';
import { GFXTexture } from '../texture';
import { WebGLGFXBuffer } from './webgl-buffer';
import { WebGLGFXCommandBuffer } from './webgl-command-buffer';
import {
    WebGLCmdFuncBeginRenderPass, WebGLCmdFuncBindStates, WebGLCmdFuncCopyBuffersToTexture,
    WebGLCmdFuncDraw, WebGLCmdFuncExecuteCmds, WebGLCmdFuncUpdateBuffer } from './webgl-commands';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGFXFramebuffer } from './webgl-framebuffer';
import { WebGLGFXTexture } from './webgl-texture';
import { GFXRenderPass } from '../render-pass';
import { WebGLGFXRenderPass } from './webgl-render-pass';

const _buffers: ArrayBufferView[] = [];

export class WebGLGFXPrimaryCommandBuffer extends WebGLGFXCommandBuffer {

    public beginRenderPass (
        renderPass: GFXRenderPass,
        framebuffer: GFXFramebuffer,
        renderArea: IGFXRect,
        clearColors: IGFXColor[],
        clearDepth: number,
        clearStencil: number) {

        WebGLCmdFuncBeginRenderPass(
            this._device as WebGLGFXDevice,
            (renderPass as WebGLGFXRenderPass).gpuRenderPass,
            (framebuffer as WebGLGFXFramebuffer).gpuFramebuffer,
            renderArea, clearColors, clearDepth, clearStencil);
        this._isInRenderPass = true;
    }

    public draw (inputAssembler: GFXInputAssembler) {
        if (this._isInRenderPass) {
            if (this._isStateInvalied) {
                this.bindStates();
            }

            WebGLCmdFuncDraw(this._device as WebGLGFXDevice, inputAssembler);

            ++this._numDrawCalls;
            this._numInstances += inputAssembler.instanceCount;
            const indexCount = inputAssembler.indexCount || inputAssembler.vertexCount;
            if (this._curGPUPipelineState) {
                const glPrimitive = this._curGPUPipelineState.glPrimitive;
                switch (glPrimitive) {
                    case 0x0004: { // WebGLRenderingContext.TRIANGLES
                        this._numTris += indexCount / 3 * Math.max(inputAssembler.instanceCount, 1);
                        break;
                    }
                    case 0x0005: // WebGLRenderingContext.TRIANGLE_STRIP
                    case 0x0006: { // WebGLRenderingContext.TRIANGLE_FAN
                        this._numTris += (indexCount - 2) * Math.max(inputAssembler.instanceCount, 1);
                        break;
                    }
                }
            }
        } else {
            console.error('Command \'draw\' must be recorded inside a render pass.');
        }
    }

    public updateBuffer (buffer: GFXBuffer, data: GFXBufferSource, offset?: number, size?: number) {
        if (!this._isInRenderPass) {
            const gpuBuffer = (buffer as WebGLGFXBuffer).gpuBuffer;
            if (gpuBuffer) {
                if (offset === undefined) { offset = 0; }

                let buffSize: number;
                if (size !== undefined ) {
                    buffSize = size;
                } else if (buffer.usage & GFXBufferUsageBit.INDIRECT) {
                    buffSize = 0;
                } else {
                    buffSize = (data as ArrayBuffer).byteLength;
                }

                WebGLCmdFuncUpdateBuffer(this._device as WebGLGFXDevice, gpuBuffer, data as ArrayBuffer, offset, buffSize);
            }
        } else {
            console.error('Command \'updateBuffer\' must be recorded outside a render pass.');
        }
    }

    public copyBufferToTexture (
        srcBuff: GFXBuffer,
        dstTex: GFXTexture,
        dstLayout: GFXTextureLayout,
        regions: GFXBufferTextureCopy[]) {

        if (!this._isInRenderPass) {
            const gpuBuffer = (srcBuff as WebGLGFXBuffer).gpuBuffer;
            const gpuTexture = (dstTex as WebGLGFXTexture).gpuTexture;
            if (gpuBuffer && gpuTexture) {
                _buffers[0] = gpuBuffer.buffer!;
                WebGLCmdFuncCopyBuffersToTexture(this._device as WebGLGFXDevice, _buffers, gpuTexture, regions);
            }
        } else {
            console.error('Command \'copyBufferToTexture\' must be recorded outside a render pass.');
        }
    }

    public execute (cmdBuffs: GFXCommandBuffer[], count: number) {
        for (let i = 0; i < count; ++i) {
            // actually they are secondary buffers, the cast here is only for type checking
            const webGLCmdBuff = cmdBuffs[i] as WebGLGFXPrimaryCommandBuffer;
            WebGLCmdFuncExecuteCmds(this._device as WebGLGFXDevice, webGLCmdBuff.cmdPackage);
            this._numDrawCalls += webGLCmdBuff._numDrawCalls;
            this._numInstances += webGLCmdBuff._numInstances;
            this._numTris += webGLCmdBuff._numTris;
        }
    }

    protected bindStates () {
        WebGLCmdFuncBindStates(this._device as WebGLGFXDevice,
            this._curGPUPipelineState, this._curGPUBindingLayout, this._curGPUInputAssembler,
            this._curViewport, this._curScissor, this._curLineWidth, this._curDepthBias, this._curBlendConstants,
            this._curDepthBounds, this._curStencilWriteMask, this._curStencilCompareMask);
        this._isStateInvalied = false;
    }
}
