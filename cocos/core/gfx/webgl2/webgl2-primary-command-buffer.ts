import { GFXBuffer, GFXBufferSource } from '../buffer';
import { GFXCommandBuffer } from '../command-buffer';
import { GFXBufferTextureCopy, GFXBufferUsageBit, GFXClearFlag, GFXTextureLayout, IGFXColor, IGFXRect } from '../define';
import { GFXFramebuffer } from '../framebuffer';
import { GFXInputAssembler } from '../input-assembler';
import { GFXTexture } from '../texture';
import { WebGL2GFXBuffer } from './webgl2-buffer';
import { WebGL2GFXCommandBuffer } from './webgl2-command-buffer';
import {
    WebGL2CmdFuncBeginRenderPass, WebGL2CmdFuncBindStates, WebGL2CmdFuncCopyBuffersToTexture,
    WebGL2CmdFuncDraw, WebGL2CmdFuncExecuteCmds, WebGL2CmdFuncUpdateBuffer } from './webgl2-commands';
import { WebGL2GFXDevice } from './webgl2-device';
import { WebGL2GFXFramebuffer } from './webgl2-framebuffer';
import { WebGL2GFXTexture } from './webgl2-texture';
import { GFXRenderPass } from '../render-pass';
import { WebGL2GFXRenderPass } from './webgl2-render-pass';

export class WebGL2GFXPrimaryCommandBuffer extends WebGL2GFXCommandBuffer {

    public beginRenderPass (
        renderPass: GFXRenderPass,
        framebuffer: GFXFramebuffer,
        renderArea: IGFXRect,
        clearColors: IGFXColor[],
        clearDepth: number,
        clearStencil: number) {

        WebGL2CmdFuncBeginRenderPass(
            this._device as WebGL2GFXDevice,
            (renderPass as WebGL2GFXRenderPass).gpuRenderPass,
            (framebuffer as WebGL2GFXFramebuffer).gpuFramebuffer,
            renderArea, clearColors, clearDepth, clearStencil);
        this._isInRenderPass = true;
    }

    public draw (inputAssembler: GFXInputAssembler) {
        if (this._isInRenderPass) {
            if (this._isStateInvalied) {
                this.bindStates();
            }

            WebGL2CmdFuncDraw(this._device as WebGL2GFXDevice, inputAssembler);

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
            const gpuBuffer = (buffer as WebGL2GFXBuffer).gpuBuffer;
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

                WebGL2CmdFuncUpdateBuffer(this._device as WebGL2GFXDevice, gpuBuffer, data as ArrayBuffer, offset, buffSize);
            }
        } else {
            console.error('Command \'updateBuffer\' must be recorded outside a render pass.');
        }
    }

    public copyBuffersToTexture (buffers: ArrayBufferView[], texture: GFXTexture, regions: GFXBufferTextureCopy[]) {
        if (!this._isInRenderPass) {
            const gpuTexture = (texture as WebGL2GFXTexture).gpuTexture;
            if (gpuTexture) {
                WebGL2CmdFuncCopyBuffersToTexture(this._device as WebGL2GFXDevice, buffers, gpuTexture, regions);
            }
        } else {
            console.error('Command \'copyBufferToTexture\' must be recorded outside a render pass.');
        }
    }

    public execute (cmdBuffs: GFXCommandBuffer[], count: number) {
        for (let i = 0; i < count; ++i) {
            // actually they are secondary buffers, the cast here is only for type checking
            const webGL2CmdBuff = cmdBuffs[i] as WebGL2GFXPrimaryCommandBuffer;
            WebGL2CmdFuncExecuteCmds(this._device as WebGL2GFXDevice, webGL2CmdBuff.cmdPackage);
            this._numDrawCalls += webGL2CmdBuff._numDrawCalls;
            this._numInstances += webGL2CmdBuff._numInstances;
            this._numTris += webGL2CmdBuff._numTris;
        }
    }

    protected bindStates () {
        WebGL2CmdFuncBindStates(this._device as WebGL2GFXDevice,
            this._curGPUPipelineState, this._curGPUBindingLayout, this._curGPUInputAssembler,
            this._curViewport, this._curScissor, this._curLineWidth, this._curDepthBias, this._curBlendConstants,
            this._curDepthBounds, this._curStencilWriteMask, this._curStencilCompareMask);
        this._isStateInvalied = false;
    }
}
