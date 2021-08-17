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
import { Framebuffer } from '../base/framebuffer';
import { InputAssembler } from '../base/input-assembler';
import { PipelineState } from '../base/pipeline-state';
import { Texture } from '../base/texture';
import { WebGLDescriptorSet } from './webgl-descriptor-set';
import { WebGLBuffer } from './webgl-buffer';
import { WebGLCommandAllocator } from './webgl-command-allocator';
import { WebGLFramebuffer } from './webgl-framebuffer';
import { IWebGLGPUInputAssembler, IWebGLGPUDescriptorSet, IWebGLGPUPipelineState } from './webgl-gpu-objects';
import { WebGLInputAssembler } from './webgl-input-assembler';
import { WebGLPipelineState } from './webgl-pipeline-state';
import { WebGLTexture } from './webgl-texture';
import { RenderPass } from '../base/render-pass';
import { WebGLRenderPass } from './webgl-render-pass';
import { BufferUsageBit, CommandBufferType, StencilFace, BufferSource,
    CommandBufferInfo, BufferTextureCopy, Color, Rect, Viewport, DrawInfo, DynamicStates } from '../base/define';
import { WebGLCmd, WebGLCmdBeginRenderPass, WebGLCmdBindStates, WebGLCmdCopyBufferToTexture,
    WebGLCmdDraw, WebGLCmdPackage, WebGLCmdUpdateBuffer } from './webgl-commands';
import { GlobalBarrier } from '../base/states/global-barrier';
import { TextureBarrier } from '../base/states/texture-barrier';
import { WebGLDeviceManager } from './webgl-define';

export class WebGLCommandBuffer extends CommandBuffer {
    public cmdPackage: WebGLCmdPackage = new WebGLCmdPackage();

    protected _cmdAllocator: WebGLCommandAllocator = new WebGLCommandAllocator();
    protected _isInRenderPass = false;
    protected _curGPUPipelineState: IWebGLGPUPipelineState | null = null;
    protected _curGPUInputAssembler: IWebGLGPUInputAssembler | null = null;
    protected _curGPUDescriptorSets: IWebGLGPUDescriptorSet[] = [];
    protected _curDynamicOffsets: number[] = Array(8).fill(0);
    protected _curDynamicStates: DynamicStates = new DynamicStates();
    protected _isStateInvalied = false;

    public initialize (info: CommandBufferInfo) {
        this._type = info.type;
        this._queue = info.queue;

        const setCount = WebGLDeviceManager.instance.bindingMappingInfo.bufferOffsets.length;
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
        const cmd = this._cmdAllocator.beginRenderPassCmdPool.alloc(WebGLCmdBeginRenderPass);
        cmd.gpuRenderPass = (renderPass as WebGLRenderPass).gpuRenderPass;
        cmd.gpuFramebuffer = (framebuffer as WebGLFramebuffer).gpuFramebuffer;
        cmd.renderArea = renderArea;
        cmd.clearColors.length = clearColors.length;
        for (let i = 0; i < clearColors.length; ++i) {
            cmd.clearColors[i] = clearColors[i];
        }
        cmd.clearDepth = clearDepth;
        cmd.clearStencil = clearStencil;
        this.cmdPackage.beginRenderPassCmds.push(cmd);

        this.cmdPackage.cmds.push(WebGLCmd.BEGIN_RENDER_PASS);

        this._isInRenderPass = true;
    }

    public endRenderPass () {
        this._isInRenderPass = false;
    }

    public bindPipelineState (pipelineState: PipelineState) {
        const gpuPipelineState = (pipelineState as WebGLPipelineState).gpuPipelineState;
        if (gpuPipelineState !== this._curGPUPipelineState) {
            this._curGPUPipelineState = gpuPipelineState;
            this._isStateInvalied = true;
        }
    }

    public bindDescriptorSet (set: number, descriptorSet: DescriptorSet, dynamicOffsets?: number[]) {
        const gpuDescriptorSet = (descriptorSet as WebGLDescriptorSet).gpuDescriptorSet;
        if (gpuDescriptorSet !== this._curGPUDescriptorSets[set]) {
            this._curGPUDescriptorSets[set] = gpuDescriptorSet;
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
        const gpuInputAssembler = (inputAssembler as WebGLInputAssembler).gpuInputAssembler;
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

            const cmd = this._cmdAllocator.drawCmdPool.alloc(WebGLCmdDraw);
            cmd.drawInfo.copy(info);
            this.cmdPackage.drawCmds.push(cmd);

            this.cmdPackage.cmds.push(WebGLCmd.DRAW);

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
            const gpuBuffer = (buffer as WebGLBuffer).gpuBuffer;
            if (gpuBuffer) {
                const cmd = this._cmdAllocator.updateBufferCmdPool.alloc(WebGLCmdUpdateBuffer);

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

                this.cmdPackage.cmds.push(WebGLCmd.UPDATE_BUFFER);
            }
        } else {
            console.error('Command \'updateBuffer\' must be recorded outside a render pass.');
        }
    }

    public copyBuffersToTexture (buffers: ArrayBufferView[], texture: Texture, regions: BufferTextureCopy[]) {
        if (this._type === CommandBufferType.PRIMARY && !this._isInRenderPass
            || this._type === CommandBufferType.SECONDARY) {
            const gpuTexture = (texture as WebGLTexture).gpuTexture;
            if (gpuTexture) {
                const cmd = this._cmdAllocator.copyBufferToTextureCmdPool.alloc(WebGLCmdCopyBufferToTexture);
                if (cmd) {
                    cmd.gpuTexture = gpuTexture;
                    cmd.regions = regions;
                    // TODO: Have to copy to staging buffer first to make this work for the execution is deferred.
                    // But since we are using specialized primary command buffers in WebGL backends, we leave it as is for now
                    cmd.buffers = buffers;

                    this.cmdPackage.copyBufferToTextureCmds.push(cmd);
                    this.cmdPackage.cmds.push(WebGLCmd.COPY_BUFFER_TO_TEXTURE);
                }
            }
        } else {
            console.error('Command \'copyBufferToTexture\' must be recorded outside a render pass.');
        }
    }

    public execute (cmdBuffs: CommandBuffer[], count: number) {
        for (let i = 0; i < count; ++i) {
            const webGLCmdBuff = cmdBuffs[i] as WebGLCommandBuffer;

            for (let c = 0; c < webGLCmdBuff.cmdPackage.beginRenderPassCmds.length; ++c) {
                const cmd = webGLCmdBuff.cmdPackage.beginRenderPassCmds.array[c];
                ++cmd.refCount;
                this.cmdPackage.beginRenderPassCmds.push(cmd);
            }

            for (let c = 0; c < webGLCmdBuff.cmdPackage.bindStatesCmds.length; ++c) {
                const cmd = webGLCmdBuff.cmdPackage.bindStatesCmds.array[c];
                ++cmd.refCount;
                this.cmdPackage.bindStatesCmds.push(cmd);
            }

            for (let c = 0; c < webGLCmdBuff.cmdPackage.drawCmds.length; ++c) {
                const cmd = webGLCmdBuff.cmdPackage.drawCmds.array[c];
                ++cmd.refCount;
                this.cmdPackage.drawCmds.push(cmd);
            }

            for (let c = 0; c < webGLCmdBuff.cmdPackage.updateBufferCmds.length; ++c) {
                const cmd = webGLCmdBuff.cmdPackage.updateBufferCmds.array[c];
                ++cmd.refCount;
                this.cmdPackage.updateBufferCmds.push(cmd);
            }

            for (let c = 0; c < webGLCmdBuff.cmdPackage.copyBufferToTextureCmds.length; ++c) {
                const cmd = webGLCmdBuff.cmdPackage.copyBufferToTextureCmds.array[c];
                ++cmd.refCount;
                this.cmdPackage.copyBufferToTextureCmds.push(cmd);
            }

            this.cmdPackage.cmds.concat(webGLCmdBuff.cmdPackage.cmds.array);

            this._numDrawCalls += webGLCmdBuff._numDrawCalls;
            this._numInstances += webGLCmdBuff._numInstances;
            this._numTris += webGLCmdBuff._numTris;
        }
    }

    public pipelineBarrier (globalBarrier: GlobalBarrier | null, textureBarriers?: TextureBarrier[], textures?: Texture[]) {}

    protected bindStates () {
        const bindStatesCmd = this._cmdAllocator.bindStatesCmdPool.alloc(WebGLCmdBindStates);

        if (bindStatesCmd) {
            bindStatesCmd.gpuPipelineState = this._curGPUPipelineState;
            Array.prototype.push.apply(bindStatesCmd.gpuDescriptorSets, this._curGPUDescriptorSets);
            Array.prototype.push.apply(bindStatesCmd.dynamicOffsets, this._curDynamicOffsets);
            bindStatesCmd.gpuInputAssembler = this._curGPUInputAssembler;
            bindStatesCmd.dynamicStates.copy(this._curDynamicStates);

            this.cmdPackage.bindStatesCmds.push(bindStatesCmd);
            this.cmdPackage.cmds.push(WebGLCmd.BIND_STATES);

            this._isStateInvalied = false;
        }
    }
}
