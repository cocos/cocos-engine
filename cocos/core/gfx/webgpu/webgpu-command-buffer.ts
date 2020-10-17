import { GFXDescriptorSet } from '../descriptor-set';
import { GFXBuffer, GFXBufferSource } from '../buffer';
import { GFXCommandBuffer, GFXCommandBufferInfo } from '../command-buffer';
import {
    GFXBufferUsageBit,
    GFXCommandBufferType,
    GFXStencilFace,
} from '../define';
import { GFXBufferTextureCopy, GFXColor, GFXRect, GFXViewport } from '../define-class';
import { GFXFramebuffer } from '../framebuffer';
import { GFXInputAssembler } from '../input-assembler';
import { GFXPipelineState } from '../pipeline-state';
import { GFXTexture } from '../texture';
import { WebGPUDescriptorSet } from './WebGPU-descriptor-set';
import { WebGPUBuffer } from './WebGPU-buffer';
import { WebGPUCommandAllocator } from './WebGPU-command-allocator';
import {
    WebGPUCmd,
    WebGPUCmdBeginRenderPass,
    WebGPUCmdBindStates,
    WebGPUCmdCopyBufferToTexture,
    WebGPUCmdDraw,
    WebGPUCmdPackage,
    WebGPUCmdUpdateBuffer,
} from './WebGPU-commands';
import { WebGPUDevice } from './WebGPU-device';
import { WebGPUFramebuffer } from './WebGPU-framebuffer';
import { IWebGPUGPUInputAssembler, IWebGPUGPUDescriptorSet, IWebGPUGPUPipelineState } from './WebGPU-gpu-objects';
import { WebGPUInputAssembler } from './WebGPU-input-assembler';
import { WebGPUPipelineState } from './WebGPU-pipeline-state';
import { WebGPUTexture } from './WebGPU-texture';
import { GFXRenderPass } from '../render-pass';
import { WebGPURenderPass } from './WebGPU-render-pass';

export interface IWebGPUDepthBias {
    constantFactor: number;
    clamp: number;
    slopeFactor: number;
}

export interface IWebGPUDepthBounds {
    minBounds: number;
    maxBounds: number;
}

export interface IWebGPUStencilWriteMask {
    face: GFXStencilFace;
    writeMask: number;
}

export interface IWebGPUStencilCompareMask {
    face: GFXStencilFace;
    reference: number;
    compareMask: number;
}

export class WebGPUCommandBuffer extends GFXCommandBuffer {

    public cmdPackage: WebGPUCmdPackage = new WebGPUCmdPackage();
    protected _webGLAllocator: WebGPUCommandAllocator | null = null;
    protected _isInRenderPass: boolean = false;
    protected _curGPUPipelineState: IWebGPUGPUPipelineState | null = null;
    protected _curGPUDescriptorSets: IWebGPUGPUDescriptorSet[] = [];
    protected _curGPUInputAssembler: IWebGPUGPUInputAssembler | null = null;
    protected _curDynamicOffsets: number[][] = [];
    protected _curViewport: GFXViewport | null = null;
    protected _curScissor: GFXRect | null = null;
    protected _curLineWidth: number | null = null;
    protected _curDepthBias: IWebGPUDepthBias | null = null;
    protected _curBlendConstants: number[] = [];
    protected _curDepthBounds: IWebGPUDepthBounds | null = null;
    protected _curStencilWriteMask: IWebGPUStencilWriteMask | null = null;
    protected _curStencilCompareMask: IWebGPUStencilCompareMask | null = null;
    protected _isStateInvalied: boolean = false;


    public initialize (info: GFXCommandBufferInfo): boolean {

        this._type = info.type;
        this._queue = info.queue;

        this._webGLAllocator = (this._device as WebGPUDevice).cmdAllocator;

        const setCount = (this._device as WebGPUDevice).bindingMappingInfo.bufferOffsets.length;
        for (let i = 0; i < setCount; i++) {
            this._curGPUDescriptorSets.push(null!);
            this._curDynamicOffsets.push([]);
        }

        return true;
    }

    public destroy () {
        if (this._webGLAllocator) {
            this._webGLAllocator.clearCmds(this.cmdPackage);
            this._webGLAllocator = null;
        }
    }

    public begin (renderPass?: GFXRenderPass, subpass = 0, frameBuffer?: GFXFramebuffer) {
        this._webGLAllocator!.clearCmds(this.cmdPackage);
        this._curGPUPipelineState = null;
        this._curGPUInputAssembler = null;
        this._curGPUDescriptorSets.length = 0;
        for (let i = 0; i < this._curDynamicOffsets.length; i++) {
            this._curDynamicOffsets[i].length = 0;
        }
        this._curViewport = null;
        this._curScissor = null;
        this._curLineWidth = null;
        this._curDepthBias = null;
        this._curBlendConstants.length = 0;
        this._curDepthBounds = null;
        this._curStencilWriteMask = null;
        this._curStencilCompareMask = null;
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
        renderPass: GFXRenderPass,
        framebuffer: GFXFramebuffer,
        renderArea: GFXRect,
        clearColors: GFXColor[],
        clearDepth: number,
        clearStencil: number) {
        const cmd = this._webGLAllocator!.beginRenderPassCmdPool.alloc(WebGPUCmdBeginRenderPass);
        cmd.gpuRenderPass = (renderPass as WebGPURenderPass).gpuRenderPass;
        cmd.gpuFramebuffer = (framebuffer as WebGPUFramebuffer).gpuFramebuffer;
        cmd.renderArea = renderArea;
        for (let i = 0; i < clearColors.length; ++i) {
            cmd.clearColors[i] = clearColors[i];
        }
        cmd.clearDepth = clearDepth;
        cmd.clearStencil = clearStencil;
        this.cmdPackage.beginRenderPassCmds.push(cmd);

        this.cmdPackage.cmds.push(WebGPUCmd.BEGIN_RENDER_PASS);

        this._isInRenderPass = true;
    }

    public endRenderPass () {
        this._isInRenderPass = false;
    }

    public bindPipelineState (pipelineState: GFXPipelineState) {
        const gpuPipelineState = (pipelineState as WebGPUPipelineState).gpuPipelineState;
        if (gpuPipelineState !== this._curGPUPipelineState) {
            this._curGPUPipelineState = gpuPipelineState;
            this._isStateInvalied = true;
        }
    }

    public bindDescriptorSet (set: number, descriptorSet: GFXDescriptorSet, dynamicOffsets?: number[]) {
        const gpuDescriptorSets = (descriptorSet as WebGPUDescriptorSet).gpuDescriptorSet;
        if (gpuDescriptorSets !== this._curGPUDescriptorSets[set]) {
            this._curGPUDescriptorSets[set] = gpuDescriptorSets;
            this._isStateInvalied = true;
        }
        if (dynamicOffsets) {
            const offsets = this._curDynamicOffsets[set];
            for (let i = 0; i < dynamicOffsets.length; i++) offsets[i] = dynamicOffsets[i];
            offsets.length = dynamicOffsets.length;
            this._isStateInvalied = true;
        }
    }

    public bindInputAssembler (inputAssembler: GFXInputAssembler) {
        const gpuInputAssembler = (inputAssembler as WebGPUInputAssembler).gpuInputAssembler;
        this._curGPUInputAssembler = gpuInputAssembler;
        this._isStateInvalied = true;
    }

    public setViewport (viewport: GFXViewport) {
        if (!this._curViewport) {
            this._curViewport = new GFXViewport(viewport.left, viewport.top, viewport.width, viewport.height, viewport.minDepth, viewport.maxDepth);
        } else {
            if (this._curViewport.left !== viewport.left ||
                this._curViewport.top !== viewport.top ||
                this._curViewport.width !== viewport.width ||
                this._curViewport.height !== viewport.height ||
                this._curViewport.minDepth !== viewport.minDepth ||
                this._curViewport.maxDepth !== viewport.maxDepth) {

                this._curViewport.left = viewport.left;
                this._curViewport.top = viewport.top;
                this._curViewport.width = viewport.width;
                this._curViewport.height = viewport.height;
                this._curViewport.minDepth = viewport.minDepth;
                this._curViewport.maxDepth = viewport.maxDepth;
                this._isStateInvalied = true;
            }
        }
    }

    public setScissor (scissor: GFXRect) {
        if (!this._curScissor) {
            this._curScissor = new GFXRect(scissor.x, scissor.y, scissor.width, scissor.height);
        } else {
            if (this._curScissor.x !== scissor.x ||
                this._curScissor.y !== scissor.y ||
                this._curScissor.width !== scissor.width ||
                this._curScissor.height !== scissor.height) {
                this._curScissor.x = scissor.x;
                this._curScissor.y = scissor.y;
                this._curScissor.width = scissor.width;
                this._curScissor.height = scissor.height;
                this._isStateInvalied = true;
            }
        }
    }

    public setLineWidth (lineWidth: number) {
        if (this._curLineWidth !== lineWidth) {
            this._curLineWidth = lineWidth;
            this._isStateInvalied = true;
        }
    }

    public setDepthBias (depthBiasConstantFactor: number, depthBiasClamp: number, depthBiasSlopeFactor: number) {
        if (!this._curDepthBias) {
            this._curDepthBias = {
                constantFactor: depthBiasConstantFactor,
                clamp: depthBiasClamp,
                slopeFactor: depthBiasSlopeFactor,
            };
            this._isStateInvalied = true;
        } else {
            if (this._curDepthBias.constantFactor !== depthBiasConstantFactor ||
                this._curDepthBias.clamp !== depthBiasClamp ||
                this._curDepthBias.slopeFactor !== depthBiasSlopeFactor) {

                this._curDepthBias.constantFactor = depthBiasConstantFactor;
                this._curDepthBias.clamp = depthBiasClamp;
                this._curDepthBias.slopeFactor = depthBiasSlopeFactor;
                this._isStateInvalied = true;
            }
        }
    }

    public setBlendConstants (blendConstants: number[]) {
        if (blendConstants.length === 4 && (
            this._curBlendConstants[0] !== blendConstants[0] ||
            this._curBlendConstants[1] !== blendConstants[1] ||
            this._curBlendConstants[2] !== blendConstants[2] ||
            this._curBlendConstants[3] !== blendConstants[3])) {
            this._curBlendConstants.length = 0;
            Array.prototype.push.apply(this._curBlendConstants, blendConstants);
            this._isStateInvalied = true;
        }
    }

    public setDepthBound (minDepthBounds: number, maxDepthBounds: number) {
        if (!this._curDepthBounds) {
            this._curDepthBounds = {
                minBounds: minDepthBounds,
                maxBounds: maxDepthBounds,
            };
            this._isStateInvalied = true;
        } else {
            if (this._curDepthBounds.minBounds !== minDepthBounds ||
                this._curDepthBounds.maxBounds !== maxDepthBounds) {
                this._curDepthBounds = {
                    minBounds: minDepthBounds,
                    maxBounds: maxDepthBounds,
                };
                this._isStateInvalied = true;
            }
        }
    }

    public setStencilWriteMask (face: GFXStencilFace, writeMask: number) {
        if (!this._curStencilWriteMask) {
            this._curStencilWriteMask = {
                face,
                writeMask,
            };
            this._isStateInvalied = true;
        } else {
            if (this._curStencilWriteMask.face !== face ||
                this._curStencilWriteMask.writeMask !== writeMask) {

                this._curStencilWriteMask.face = face;
                this._curStencilWriteMask.writeMask = writeMask;
                this._isStateInvalied = true;
            }
        }
    }

    public setStencilCompareMask (face: GFXStencilFace, reference: number, compareMask: number) {
        if (!this._curStencilCompareMask) {
            this._curStencilCompareMask = {
                face,
                reference,
                compareMask,
            };
            this._isStateInvalied = true;
        } else {
            if (this._curStencilCompareMask.face !== face ||
                this._curStencilCompareMask.reference !== reference ||
                this._curStencilCompareMask.compareMask !== compareMask) {

                this._curStencilCompareMask.face = face;
                this._curStencilCompareMask.reference = reference;
                this._curStencilCompareMask.compareMask = compareMask;
                this._isStateInvalied = true;
            }
        }
    }

    public draw (inputAssembler: GFXInputAssembler) {
        if (this._type === GFXCommandBufferType.PRIMARY && this._isInRenderPass ||
            this._type === GFXCommandBufferType.SECONDARY) {
            if (this._isStateInvalied) {
                this.bindStates();
            }

            const cmd = this._webGLAllocator!.drawCmdPool.alloc(WebGPUCmdDraw);
            // cmd.drawInfo = inputAssembler;
            cmd.drawInfo.vertexCount = inputAssembler.vertexCount;
            cmd.drawInfo.firstVertex = inputAssembler.firstVertex;
            cmd.drawInfo.indexCount = inputAssembler.indexCount;
            cmd.drawInfo.firstIndex = inputAssembler.firstIndex;
            cmd.drawInfo.vertexOffset = inputAssembler.vertexOffset;
            cmd.drawInfo.instanceCount = inputAssembler.instanceCount;
            cmd.drawInfo.firstInstance = inputAssembler.firstInstance;
            this.cmdPackage.drawCmds.push(cmd);

            this.cmdPackage.cmds.push(WebGPUCmd.DRAW);

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
        if (this._type === GFXCommandBufferType.PRIMARY && !this._isInRenderPass ||
            this._type === GFXCommandBufferType.SECONDARY) {
            const gpuBuffer = (buffer as WebGPUBuffer).gpuBuffer;
            if (gpuBuffer) {
                const cmd = this._webGLAllocator!.updateBufferCmdPool.alloc(WebGPUCmdUpdateBuffer);
                let buffSize = 0;
                let buff: GFXBufferSource | null = null;

                // TODO: Have to copy to staging buffer first to make this work for the execution is deferred.
                // But since we are using specialized primary command buffers in WebGL backends, we leave it as is for now
                if (buffer.usage & GFXBufferUsageBit.INDIRECT) {
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
                cmd.offset = (offset !== undefined ? offset : 0);
                cmd.size = buffSize;
                this.cmdPackage.updateBufferCmds.push(cmd);

                this.cmdPackage.cmds.push(WebGPUCmd.UPDATE_BUFFER);
            }
        } else {
            console.error('Command \'updateBuffer\' must be recorded outside a render pass.');
        }
    }

    public copyBuffersToTexture (buffers: ArrayBufferView[], texture: GFXTexture, regions: GFXBufferTextureCopy[]) {
        if (this._type === GFXCommandBufferType.PRIMARY && !this._isInRenderPass ||
            this._type === GFXCommandBufferType.SECONDARY) {
            const gpuTexture = (texture as WebGPUTexture).gpuTexture;
            if (gpuTexture) {
                const cmd = this._webGLAllocator!.copyBufferToTextureCmdPool.alloc(WebGPUCmdCopyBufferToTexture);
                cmd.gpuTexture = gpuTexture;
                cmd.regions = regions;
                // TODO: Have to copy to staging buffer first to make this work for the execution is deferred.
                // But since we are using specialized primary command buffers in WebGL backends, we leave it as is for now
                cmd.buffers = buffers;

                this.cmdPackage.copyBufferToTextureCmds.push(cmd);
                this.cmdPackage.cmds.push(WebGPUCmd.COPY_BUFFER_TO_TEXTURE);
            }
        } else {
            console.error('Command \'copyBufferToTexture\' must be recorded outside a render pass.');
        }
    }

    public execute (cmdBuffs: GFXCommandBuffer[], count: number) {
        for (let i = 0; i < count; ++i) {
            const WebGPUCmdBuff = cmdBuffs[i] as WebGPUCommandBuffer;

            for (let c = 0; c < WebGPUCmdBuff.cmdPackage.beginRenderPassCmds.length; ++c) {
                const cmd = WebGPUCmdBuff.cmdPackage.beginRenderPassCmds.array[c];
                ++cmd.refCount;
                this.cmdPackage.beginRenderPassCmds.push(cmd);
            }

            for (let c = 0; c < WebGPUCmdBuff.cmdPackage.bindStatesCmds.length; ++c) {
                const cmd = WebGPUCmdBuff.cmdPackage.bindStatesCmds.array[c];
                ++cmd.refCount;
                this.cmdPackage.bindStatesCmds.push(cmd);
            }

            for (let c = 0; c < WebGPUCmdBuff.cmdPackage.drawCmds.length; ++c) {
                const cmd = WebGPUCmdBuff.cmdPackage.drawCmds.array[c];
                ++cmd.refCount;
                this.cmdPackage.drawCmds.push(cmd);
            }

            for (let c = 0; c < WebGPUCmdBuff.cmdPackage.updateBufferCmds.length; ++c) {
                const cmd = WebGPUCmdBuff.cmdPackage.updateBufferCmds.array[c];
                ++cmd.refCount;
                this.cmdPackage.updateBufferCmds.push(cmd);
            }

            for (let c = 0; c < WebGPUCmdBuff.cmdPackage.copyBufferToTextureCmds.length; ++c) {
                const cmd = WebGPUCmdBuff.cmdPackage.copyBufferToTextureCmds.array[c];
                ++cmd.refCount;
                this.cmdPackage.copyBufferToTextureCmds.push(cmd);
            }

            this.cmdPackage.cmds.concat(WebGPUCmdBuff.cmdPackage.cmds.array);

            this._numDrawCalls += WebGPUCmdBuff._numDrawCalls;
            this._numInstances += WebGPUCmdBuff._numInstances;
            this._numTris += WebGPUCmdBuff._numTris;
        }
    }

    public get webGLDevice (): WebGPUDevice {
        return this._device as WebGPUDevice;
    }

    protected bindStates () {
        const bindStatesCmd = this._webGLAllocator!.bindStatesCmdPool.alloc(WebGPUCmdBindStates);
        bindStatesCmd.gpuPipelineState = this._curGPUPipelineState;
        Array.prototype.push.apply(bindStatesCmd.gpuDescriptorSets, this._curGPUDescriptorSets);
        for (let i = 0; i < this._curDynamicOffsets.length; i++) {
            Array.prototype.push.apply(bindStatesCmd.dynamicOffsets, this._curDynamicOffsets[i]);
        }
        bindStatesCmd.gpuInputAssembler = this._curGPUInputAssembler;
        bindStatesCmd.viewport = this._curViewport;
        bindStatesCmd.scissor = this._curScissor;
        bindStatesCmd.lineWidth = this._curLineWidth;
        bindStatesCmd.depthBias = this._curDepthBias;
        Array.prototype.push.apply(bindStatesCmd.blendConstants, this._curBlendConstants);
        bindStatesCmd.depthBounds = this._curDepthBounds;
        bindStatesCmd.stencilWriteMask = this._curStencilWriteMask;
        bindStatesCmd.stencilCompareMask = this._curStencilCompareMask;

        this.cmdPackage.bindStatesCmds.push(bindStatesCmd);
        this.cmdPackage.cmds.push(WebGPUCmd.BIND_STATES);

        this._isStateInvalied = false;
    }
}
