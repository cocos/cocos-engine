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

import { DescriptorSet } from '../base/descriptor-set';
import { Buffer } from '../base/buffer';
import { CommandBuffer } from '../base/command-buffer';
import {
    BufferUsageBit,
    CommandBufferType,
    StencilFace,
    BufferSource, CommandBufferInfo,
    BufferTextureCopy, Color, Rect, Viewport, DrawInfo, DynamicStates,
} from '../base/define';
import { Framebuffer } from '../base/framebuffer';
import { InputAssembler } from '../base/input-assembler';
import { PipelineState } from '../base/pipeline-state';
import { Texture } from '../base/texture';
import { WebGL2DescriptorSet } from './webgl2-descriptor-set';
import { WebGL2Buffer } from './webgl2-buffer';
import { WebGL2CommandAllocator } from './webgl2-command-allocator';
import {
    WebGL2Cmd,
    WebGL2CmdBeginRenderPass,
    WebGL2CmdBindStates,
    WebGL2CmdCopyBufferToTexture,
    WebGL2CmdDraw,
    WebGL2CmdPackage,
    WebGL2CmdUpdateBuffer,
} from './webgl2-commands';
import { WebGL2Framebuffer } from './webgl2-framebuffer';
import { IWebGL2GPUInputAssembler, IWebGL2GPUDescriptorSet, IWebGL2GPUPipelineState } from './webgl2-gpu-objects';
import { WebGL2InputAssembler } from './webgl2-input-assembler';
import { WebGL2PipelineState } from './webgl2-pipeline-state';
import { WebGL2Texture } from './webgl2-texture';
import { RenderPass } from '../base/render-pass';
import { WebGL2RenderPass } from './webgl2-render-pass';
import { GlobalBarrier } from '../base/states/global-barrier';
import { TextureBarrier } from '../base/states/texture-barrier';
import { WebGL2DeviceManager } from './webgl2-define';

export class WebGL2CommandBuffer extends CommandBuffer {
    public cmdPackage: WebGL2CmdPackage = new WebGL2CmdPackage();

    protected _cmdAllocator: WebGL2CommandAllocator = new WebGL2CommandAllocator();
    protected _isInRenderPass = false;
    protected _curGPUPipelineState: IWebGL2GPUPipelineState | null = null;
    protected _curGPUDescriptorSets: IWebGL2GPUDescriptorSet[] = [];
    protected _curGPUInputAssembler: IWebGL2GPUInputAssembler | null = null;
    protected _curDynamicOffsets: number[] = Array(8).fill(0);
    protected _curDynamicStates: DynamicStates = new DynamicStates();
    protected _isStateInvalied = false;

    public initialize (info: CommandBufferInfo) {
        this._type = info.type;
        this._queue = info.queue;

        const setCount = WebGL2DeviceManager.instance.bindingMappings.blockOffsets.length;
        for (let i = 0; i < setCount; i++) {
            this._curGPUDescriptorSets.push(null!);
        }
    }

    public destroy () {
        this._cmdAllocator.clearCmds(this.cmdPackage);
    }

    public begin (renderPass?: RenderPass, subpass = 0, frameBuffer?: Framebuffer) {
        this._cmdAllocator.clearCmds(this.cmdPackage);
        this._curGPUPipelineState = null;
        this._curGPUInputAssembler = null;
        this._curGPUDescriptorSets.length = 0;
        this._numDrawCalls = 0;
        this._numInstances = 0;
        this._numTris = 0;
    }

    public end () {
        if (this._isStateInvalied) {
            this.bindStates();
        }

        this._isInRenderPass = false;
    }

    public beginRenderPass (
        renderPass: RenderPass,
        framebuffer: Framebuffer,
        renderArea: Rect,
        clearColors: Color[],
        clearDepth: number,
        clearStencil: number,
    ) {
        const cmd = this._cmdAllocator.beginRenderPassCmdPool.alloc(WebGL2CmdBeginRenderPass);
        cmd.gpuRenderPass = (renderPass as WebGL2RenderPass).gpuRenderPass;
        cmd.gpuFramebuffer = (framebuffer as WebGL2Framebuffer).gpuFramebuffer;
        cmd.renderArea = renderArea;
        for (let i = 0; i < clearColors.length; ++i) {
            cmd.clearColors[i] = clearColors[i];
        }
        cmd.clearDepth = clearDepth;
        cmd.clearStencil = clearStencil;
        this.cmdPackage.beginRenderPassCmds.push(cmd);

        this.cmdPackage.cmds.push(WebGL2Cmd.BEGIN_RENDER_PASS);

        this._isInRenderPass = true;
    }

    public endRenderPass () {
        this._isInRenderPass = false;
    }

    public bindPipelineState (pipelineState: PipelineState) {
        const gpuPipelineState = (pipelineState as WebGL2PipelineState).gpuPipelineState;
        if (gpuPipelineState !== this._curGPUPipelineState) {
            this._curGPUPipelineState = gpuPipelineState;
            this._isStateInvalied = true;
        }
    }

    public bindDescriptorSet (set: number, descriptorSet: DescriptorSet, dynamicOffsets?: number[]) {
        const gpuDescriptorSets = (descriptorSet as WebGL2DescriptorSet).gpuDescriptorSet;
        if (gpuDescriptorSets !== this._curGPUDescriptorSets[set]) {
            this._curGPUDescriptorSets[set] = gpuDescriptorSets;
            this._isStateInvalied = true;
        }
        if (dynamicOffsets) {
            const gpuPipelineLayout = this._curGPUPipelineState?.gpuPipelineLayout;
            if (gpuPipelineLayout) {
                const offsets = this._curDynamicOffsets;
                const idx = gpuPipelineLayout.dynamicOffsetOffsets[set];
                for (let i = 0; i < dynamicOffsets.length; i++) offsets[idx + i] = dynamicOffsets[i];
                this._isStateInvalied = true;
            }
        }
    }

    public bindInputAssembler (inputAssembler: InputAssembler) {
        const gpuInputAssembler = (inputAssembler as WebGL2InputAssembler).gpuInputAssembler;
        this._curGPUInputAssembler = gpuInputAssembler;
        this._isStateInvalied = true;
    }

    public setViewport (viewport: Viewport) {
        const cache = this._curDynamicStates.viewport;
        if (cache.left !== viewport.left
            || cache.top !== viewport.top
            || cache.width !== viewport.width
            || cache.height !== viewport.height
            || cache.minDepth !== viewport.minDepth
            || cache.maxDepth !== viewport.maxDepth) {
            cache.left = viewport.left;
            cache.top = viewport.top;
            cache.width = viewport.width;
            cache.height = viewport.height;
            cache.minDepth = viewport.minDepth;
            cache.maxDepth = viewport.maxDepth;
            this._isStateInvalied = true;
        }
    }

    public setScissor (scissor: Rect) {
        const cache = this._curDynamicStates.scissor;
        if (cache.x !== scissor.x
            || cache.y !== scissor.y
            || cache.width !== scissor.width
            || cache.height !== scissor.height) {
            cache.x = scissor.x;
            cache.y = scissor.y;
            cache.width = scissor.width;
            cache.height = scissor.height;
            this._isStateInvalied = true;
        }
    }

    public setLineWidth (lineWidth: number) {
        if (this._curDynamicStates.lineWidth !== lineWidth) {
            this._curDynamicStates.lineWidth = lineWidth;
            this._isStateInvalied = true;
        }
    }

    public setDepthBias (depthBiasConstantFactor: number, depthBiasClamp: number, depthBiasSlopeFactor: number) {
        const cache = this._curDynamicStates;
        if (cache.depthBiasConstant !== depthBiasConstantFactor
            || cache.depthBiasClamp !== depthBiasClamp
            || cache.depthBiasSlope !== depthBiasSlopeFactor) {
            cache.depthBiasConstant = depthBiasConstantFactor;
            cache.depthBiasClamp = depthBiasClamp;
            cache.depthBiasSlope = depthBiasSlopeFactor;
            this._isStateInvalied = true;
        }
    }

    public setBlendConstants (blendConstants: Color) {
        const cache = this._curDynamicStates.blendConstant;
        if (cache.x !== blendConstants.x
            || cache.y !== blendConstants.y
            || cache.z !== blendConstants.z
            || cache.w !== blendConstants.w) {
            cache.copy(blendConstants);
            this._isStateInvalied = true;
        }
    }

    public setDepthBound (minDepthBounds: number, maxDepthBounds: number) {
        const cache = this._curDynamicStates;
        if (cache.depthMinBounds !== minDepthBounds
            || cache.depthMaxBounds !== maxDepthBounds) {
            cache.depthMinBounds = minDepthBounds;
            cache.depthMaxBounds = maxDepthBounds;
            this._isStateInvalied = true;
        }
    }

    public setStencilWriteMask (face: StencilFace, writeMask: number) {
        const front = this._curDynamicStates.stencilStatesFront;
        const back = this._curDynamicStates.stencilStatesBack;
        if (face & StencilFace.FRONT) {
            if (front.writeMask !== writeMask) {
                front.writeMask = writeMask;
                this._isStateInvalied = true;
            }
        }
        if (face & StencilFace.BACK) {
            if (back.writeMask !== writeMask) {
                back.writeMask = writeMask;
                this._isStateInvalied = true;
            }
        }
    }

    public setStencilCompareMask (face: StencilFace, reference: number, compareMask: number) {
        const front = this._curDynamicStates.stencilStatesFront;
        const back = this._curDynamicStates.stencilStatesBack;
        if (face & StencilFace.FRONT) {
            if (front.compareMask !== compareMask
                || front.reference !== reference) {
                front.reference = reference;
                front.compareMask = compareMask;
                this._isStateInvalied = true;
            }
        }
        if (face & StencilFace.BACK) {
            if (back.compareMask !== compareMask
                || back.reference !== reference) {
                back.reference = reference;
                back.compareMask = compareMask;
                this._isStateInvalied = true;
            }
        }
    }

    public draw (infoOrAssembler: DrawInfo | InputAssembler) {
        if (this._type === CommandBufferType.PRIMARY && this._isInRenderPass
            || this._type === CommandBufferType.SECONDARY) {
            if (this._isStateInvalied) {
                this.bindStates();
            }
            const info = 'drawInfo' in infoOrAssembler ? infoOrAssembler.drawInfo : infoOrAssembler;

            const cmd = this._cmdAllocator.drawCmdPool.alloc(WebGL2CmdDraw);
            cmd.drawInfo.copy(info);
            this.cmdPackage.drawCmds.push(cmd);

            this.cmdPackage.cmds.push(WebGL2Cmd.DRAW);

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

    public updateBuffer (buffer: Buffer, data: BufferSource, size?: number) {
        if (this._type === CommandBufferType.PRIMARY && !this._isInRenderPass
            || this._type === CommandBufferType.SECONDARY) {
            const gpuBuffer = (buffer as WebGL2Buffer).gpuBuffer;
            if (gpuBuffer) {
                const cmd = this._cmdAllocator.updateBufferCmdPool.alloc(WebGL2CmdUpdateBuffer);
                let buffSize = 0;
                let buff: BufferSource | null = null;

                // TODO: Have to copy to staging buffer first to make this work for the execution is deferred.
                // But since we are using specialized primary command buffers in WebGL backends, we leave it as is for now
                if (buffer.usage & BufferUsageBit.INDIRECT) {
                    buff = data;
                } else {
                    if (size !== undefined) {
                        buffSize = size;
                    } else {
                        buffSize = (data as ArrayBuffer).byteLength;
                    }
                    buff = data;
                }

                cmd.gpuBuffer = gpuBuffer;
                cmd.buffer = buff;
                cmd.offset = 0;
                cmd.size = buffSize;
                this.cmdPackage.updateBufferCmds.push(cmd);

                this.cmdPackage.cmds.push(WebGL2Cmd.UPDATE_BUFFER);
            }
        } else {
            console.error('Command \'updateBuffer\' must be recorded outside a render pass.');
        }
    }

    public copyBuffersToTexture (buffers: ArrayBufferView[], texture: Texture, regions: BufferTextureCopy[]) {
        if (this._type === CommandBufferType.PRIMARY && !this._isInRenderPass
            || this._type === CommandBufferType.SECONDARY) {
            const gpuTexture = (texture as WebGL2Texture).gpuTexture;
            if (gpuTexture) {
                const cmd = this._cmdAllocator.copyBufferToTextureCmdPool.alloc(WebGL2CmdCopyBufferToTexture);
                cmd.gpuTexture = gpuTexture;
                cmd.regions = regions;
                // TODO: Have to copy to staging buffer first to make this work for the execution is deferred.
                // But since we are using specialized primary command buffers in WebGL backends, we leave it as is for now
                cmd.buffers = buffers;

                this.cmdPackage.copyBufferToTextureCmds.push(cmd);
                this.cmdPackage.cmds.push(WebGL2Cmd.COPY_BUFFER_TO_TEXTURE);
            }
        } else {
            console.error('Command \'copyBufferToTexture\' must be recorded outside a render pass.');
        }
    }

    public execute (cmdBuffs: CommandBuffer[], count: number) {
        for (let i = 0; i < count; ++i) {
            const webGL2CmdBuff = cmdBuffs[i] as WebGL2CommandBuffer;

            for (let c = 0; c < webGL2CmdBuff.cmdPackage.beginRenderPassCmds.length; ++c) {
                const cmd = webGL2CmdBuff.cmdPackage.beginRenderPassCmds.array[c];
                ++cmd.refCount;
                this.cmdPackage.beginRenderPassCmds.push(cmd);
            }

            for (let c = 0; c < webGL2CmdBuff.cmdPackage.bindStatesCmds.length; ++c) {
                const cmd = webGL2CmdBuff.cmdPackage.bindStatesCmds.array[c];
                ++cmd.refCount;
                this.cmdPackage.bindStatesCmds.push(cmd);
            }

            for (let c = 0; c < webGL2CmdBuff.cmdPackage.drawCmds.length; ++c) {
                const cmd = webGL2CmdBuff.cmdPackage.drawCmds.array[c];
                ++cmd.refCount;
                this.cmdPackage.drawCmds.push(cmd);
            }

            for (let c = 0; c < webGL2CmdBuff.cmdPackage.updateBufferCmds.length; ++c) {
                const cmd = webGL2CmdBuff.cmdPackage.updateBufferCmds.array[c];
                ++cmd.refCount;
                this.cmdPackage.updateBufferCmds.push(cmd);
            }

            for (let c = 0; c < webGL2CmdBuff.cmdPackage.copyBufferToTextureCmds.length; ++c) {
                const cmd = webGL2CmdBuff.cmdPackage.copyBufferToTextureCmds.array[c];
                ++cmd.refCount;
                this.cmdPackage.copyBufferToTextureCmds.push(cmd);
            }

            this.cmdPackage.cmds.concat(webGL2CmdBuff.cmdPackage.cmds.array);

            this._numDrawCalls += webGL2CmdBuff._numDrawCalls;
            this._numInstances += webGL2CmdBuff._numInstances;
            this._numTris += webGL2CmdBuff._numTris;
        }
    }

    public pipelineBarrier (globalBarrier: GlobalBarrier | null, textureBarriers?: TextureBarrier[], textures?: Texture[]) {}

    protected bindStates () {
        const bindStatesCmd = this._cmdAllocator.bindStatesCmdPool.alloc(WebGL2CmdBindStates);
        bindStatesCmd.gpuPipelineState = this._curGPUPipelineState;
        Array.prototype.push.apply(bindStatesCmd.gpuDescriptorSets, this._curGPUDescriptorSets);
        Array.prototype.push.apply(bindStatesCmd.dynamicOffsets, this._curDynamicOffsets);
        bindStatesCmd.gpuInputAssembler = this._curGPUInputAssembler;
        bindStatesCmd.dynamicStates = this._curDynamicStates;

        this.cmdPackage.bindStatesCmds.push(bindStatesCmd);
        this.cmdPackage.cmds.push(WebGL2Cmd.BIND_STATES);

        this._isStateInvalied = false;
    }
}
