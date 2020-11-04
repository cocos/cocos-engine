import { DescriptorSet } from '../descriptor-set';
import { Buffer, BufferSource } from '../buffer';
import { CommandBuffer, CommandBufferInfo } from '../command-buffer';
import {
    BufferUsageBit,
    CommandBufferType,
    StencilFace,
} from '../define';
import { BufferTextureCopy, Color, Rect, Viewport } from '../define-class';
import { Framebuffer } from '../framebuffer';
import { InputAssembler } from '../input-assembler';
import { PipelineState } from '../pipeline-state';
import { Texture } from '../texture';
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
import { WebGL2Device } from './webgl2-device';
import { WebGL2Framebuffer } from './webgl2-framebuffer';
import { IWebGL2GPUInputAssembler, IWebGL2GPUDescriptorSet, IWebGL2GPUPipelineState } from './webgl2-gpu-objects';
import { WebGL2InputAssembler } from './webgl2-input-assembler';
import { WebGL2PipelineState } from './webgl2-pipeline-state';
import { WebGL2Texture } from './webgl2-texture';
import { RenderPass } from '../render-pass';
import { WebGL2RenderPass } from './webgl2-render-pass';

export interface IWebGL2DepthBias {
    constantFactor: number;
    clamp: number;
    slopeFactor: number;
}

export interface IWebGL2DepthBounds {
    minBounds: number;
    maxBounds: number;
}

export interface IWebGL2StencilWriteMask {
    face: StencilFace;
    writeMask: number;
}

export interface IWebGL2StencilCompareMask {
    face: StencilFace;
    reference: number;
    compareMask: number;
}

export class WebGL2CommandBuffer extends CommandBuffer {

    public cmdPackage: WebGL2CmdPackage = new WebGL2CmdPackage();
    protected _webGLAllocator: WebGL2CommandAllocator | null = null;
    protected _isInRenderPass: boolean = false;
    protected _curGPUPipelineState: IWebGL2GPUPipelineState | null = null;
    protected _curGPUDescriptorSets: IWebGL2GPUDescriptorSet[] = [];
    protected _curGPUInputAssembler: IWebGL2GPUInputAssembler | null = null;
    protected _curDynamicOffsets: number[][] = [];
    protected _curViewport: Viewport | null = null;
    protected _curScissor: Rect | null = null;
    protected _curLineWidth: number | null = null;
    protected _curDepthBias: IWebGL2DepthBias | null = null;
    protected _curBlendConstants: number[] = [];
    protected _curDepthBounds: IWebGL2DepthBounds | null = null;
    protected _curStencilWriteMask: IWebGL2StencilWriteMask | null = null;
    protected _curStencilCompareMask: IWebGL2StencilCompareMask | null = null;
    protected _isStateInvalied: boolean = false;


    public initialize (info: CommandBufferInfo): boolean {

        this._type = info.type;
        this._queue = info.queue;

        this._webGLAllocator = (this._device as WebGL2Device).cmdAllocator;

        const setCount = (this._device as WebGL2Device).bindingMappingInfo.bufferOffsets.length;
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

    public begin (renderPass?: RenderPass, subpass = 0, frameBuffer?: Framebuffer) {
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
        renderPass: RenderPass,
        framebuffer: Framebuffer,
        renderArea: Rect,
        clearColors: Color[],
        clearDepth: number,
        clearStencil: number) {
        const cmd = this._webGLAllocator!.beginRenderPassCmdPool.alloc(WebGL2CmdBeginRenderPass);
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
            const offsets = this._curDynamicOffsets[set];
            for (let i = 0; i < dynamicOffsets.length; i++) offsets[i] = dynamicOffsets[i];
            offsets.length = dynamicOffsets.length;
            this._isStateInvalied = true;
        }
    }

    public bindInputAssembler (inputAssembler: InputAssembler) {
        const gpuInputAssembler = (inputAssembler as WebGL2InputAssembler).gpuInputAssembler;
        this._curGPUInputAssembler = gpuInputAssembler;
        this._isStateInvalied = true;
    }

    public setViewport (viewport: Viewport) {
        if (!this._curViewport) {
            this._curViewport = new Viewport(viewport.left, viewport.top, viewport.width, viewport.height, viewport.minDepth, viewport.maxDepth);
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

    public setScissor (scissor: Rect) {
        if (!this._curScissor) {
            this._curScissor = new Rect(scissor.x, scissor.y, scissor.width, scissor.height);
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

    public setStencilWriteMask (face: StencilFace, writeMask: number) {
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

    public setStencilCompareMask (face: StencilFace, reference: number, compareMask: number) {
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

    public draw (inputAssembler: InputAssembler) {
        if (this._type === CommandBufferType.PRIMARY && this._isInRenderPass ||
            this._type === CommandBufferType.SECONDARY) {
            if (this._isStateInvalied) {
                this.bindStates();
            }

            const cmd = this._webGLAllocator!.drawCmdPool.alloc(WebGL2CmdDraw);
            // cmd.drawInfo = inputAssembler;
            cmd.drawInfo.vertexCount = inputAssembler.vertexCount;
            cmd.drawInfo.firstVertex = inputAssembler.firstVertex;
            cmd.drawInfo.indexCount = inputAssembler.indexCount;
            cmd.drawInfo.firstIndex = inputAssembler.firstIndex;
            cmd.drawInfo.vertexOffset = inputAssembler.vertexOffset;
            cmd.drawInfo.instanceCount = inputAssembler.instanceCount;
            cmd.drawInfo.firstInstance = inputAssembler.firstInstance;
            this.cmdPackage.drawCmds.push(cmd);

            this.cmdPackage.cmds.push(WebGL2Cmd.DRAW);

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

    public updateBuffer (buffer: Buffer, data: BufferSource, offset?: number, size?: number) {
        if (this._type === CommandBufferType.PRIMARY && !this._isInRenderPass ||
            this._type === CommandBufferType.SECONDARY) {
            const gpuBuffer = (buffer as WebGL2Buffer).gpuBuffer;
            if (gpuBuffer) {
                const cmd = this._webGLAllocator!.updateBufferCmdPool.alloc(WebGL2CmdUpdateBuffer);
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
                cmd.offset = (offset !== undefined ? offset : 0);
                cmd.size = buffSize;
                this.cmdPackage.updateBufferCmds.push(cmd);

                this.cmdPackage.cmds.push(WebGL2Cmd.UPDATE_BUFFER);
            }
        } else {
            console.error('Command \'updateBuffer\' must be recorded outside a render pass.');
        }
    }

    public copyBuffersToTexture (buffers: ArrayBufferView[], texture: Texture, regions: BufferTextureCopy[]) {
        if (this._type === CommandBufferType.PRIMARY && !this._isInRenderPass ||
            this._type === CommandBufferType.SECONDARY) {
            const gpuTexture = (texture as WebGL2Texture).gpuTexture;
            if (gpuTexture) {
                const cmd = this._webGLAllocator!.copyBufferToTextureCmdPool.alloc(WebGL2CmdCopyBufferToTexture);
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

    public get webGLDevice (): WebGL2Device {
        return this._device as WebGL2Device;
    }

    protected bindStates () {
        const bindStatesCmd = this._webGLAllocator!.bindStatesCmdPool.alloc(WebGL2CmdBindStates);
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
        this.cmdPackage.cmds.push(WebGL2Cmd.BIND_STATES);

        this._isStateInvalied = false;
    }
}
