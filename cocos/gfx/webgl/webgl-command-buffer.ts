import { GFXBindingLayout } from '../binding-layout';
import { GFXBuffer, GFXBufferSource } from '../buffer';
import { GFXCommandBuffer, IGFXCommandBufferInfo } from '../command-buffer';
import {
    GFXBufferTextureCopy,
    GFXBufferUsageBit,
    GFXClearFlag,
    GFXCommandBufferType,
    GFXStatus,
    GFXStencilFace,
    GFXTextureLayout,
    IGFXColor,
    IGFXRect,
    IGFXViewport,
} from '../define';
import { GFXDevice } from '../device';
import { GFXFramebuffer } from '../framebuffer';
import { GFXInputAssembler } from '../input-assembler';
import { GFXPipelineState } from '../pipeline-state';
import { GFXTexture } from '../texture';
import { WebGLGFXBindingLayout } from './webgl-binding-layout';
import { WebGLGFXBuffer } from './webgl-buffer';
import { WebGLGFXCommandAllocator } from './webgl-command-allocator';
import {
    WebGLCmd,
    WebGLCmdBeginRenderPass,
    WebGLCmdBindStates,
    WebGLCmdCopyBufferToTexture,
    WebGLCmdDraw,
    WebGLCmdPackage,
    WebGLCmdUpdateBuffer,
} from './webgl-commands';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGFXFramebuffer } from './webgl-framebuffer';
import { IWebGLGPUInputAssembler, WebGLGPUBindingLayout, WebGLGPUPipelineState } from './webgl-gpu-objects';
import { WebGLGFXInputAssembler } from './webgl-input-assembler';
import { WebGLGFXPipelineState } from './webgl-pipeline-state';
import { WebGLGFXTexture } from './webgl-texture';

export interface IWebGLDepthBias {
    constantFactor: number;
    clamp: number;
    slopeFactor: number;
}

export interface IWebGLDepthBounds {
    minBounds: number;
    maxBounds: number;
}

export interface IWebGLStencilWriteMask {
    face: GFXStencilFace;
    writeMask: number;
}

export interface IWebGLStencilCompareMask {
    face: GFXStencilFace;
    reference: number;
    compareMask: number;
}

export class WebGLGFXCommandBuffer extends GFXCommandBuffer {

    public cmdPackage: WebGLCmdPackage = new WebGLCmdPackage();
    private _webGLAllocator: WebGLGFXCommandAllocator | null = null;
    private _isInRenderPass: boolean = false;
    private _curGPUPipelineState: WebGLGPUPipelineState | null = null;
    private _curGPUBindingLayout: WebGLGPUBindingLayout | null = null;
    private _curGPUInputAssembler: IWebGLGPUInputAssembler | null = null;
    private _curViewport: IGFXViewport | null = null;
    private _curScissor: IGFXRect | null = null;
    private _curLineWidth: number | null = null;
    private _curDepthBias: IWebGLDepthBias | null = null;
    private _curBlendConstants: number[] = [];
    private _curDepthBounds: IWebGLDepthBounds | null = null;
    private _curStencilWriteMask: IWebGLStencilWriteMask | null = null;
    private _curStencilCompareMask: IWebGLStencilCompareMask | null = null;
    private _isStateInvalied: boolean = false;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXCommandBufferInfo): boolean {

        if (!info.allocator) {
            return false;
        }

        this._allocator = info.allocator;
        this._webGLAllocator = this._allocator as WebGLGFXCommandAllocator;
        this._type = info.type;
        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._webGLAllocator) {
            this._webGLAllocator.clearCmds(this.cmdPackage);
            this._allocator = null;
            this._webGLAllocator = null;
        }
        this._status = GFXStatus.UNREADY;
    }

    public begin () {
        this._webGLAllocator!.clearCmds(this.cmdPackage);
        this._curGPUPipelineState = null;
        this._curGPUBindingLayout = null;
        this._curGPUInputAssembler = null;
        this._curViewport = null;
        this._curScissor = null;
        this._curLineWidth = null;
        this._curDepthBias = null;
        this._curBlendConstants = [];
        this._curDepthBounds = null;
        this._curStencilWriteMask = null;
        this._curStencilCompareMask = null;
        this._numDrawCalls = 0;
        this._numTris = 0;
    }

    public end () {
        if (this._isStateInvalied) {
            this.bindStates();
        }

        this._isInRenderPass = false;
    }

    public beginRenderPass (
        framebuffer: GFXFramebuffer,
        renderArea: IGFXRect,
        clearFlag: GFXClearFlag,
        clearColors: IGFXColor[],
        clearDepth: number,
        clearStencil: number) {
        const cmd = this._webGLAllocator!.beginRenderPassCmdPool.alloc(WebGLCmdBeginRenderPass);
        cmd.gpuFramebuffer = ( framebuffer as WebGLGFXFramebuffer).gpuFramebuffer;
        cmd.renderArea = renderArea;
        cmd.clearFlag = clearFlag;
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

    public bindPipelineState (pipelineState: GFXPipelineState) {
        const gpuPipelineState = (pipelineState as WebGLGFXPipelineState).gpuPipelineState;
        this._curGPUPipelineState = gpuPipelineState;
        this._isStateInvalied = true;
    }

    public bindBindingLayout (bindingLayout: GFXBindingLayout) {
        const gpuBindingLayout = (bindingLayout as WebGLGFXBindingLayout).gpuBindingLayout;
        this._curGPUBindingLayout = gpuBindingLayout;
        this._isStateInvalied = true;
    }

    public bindInputAssembler (inputAssembler: GFXInputAssembler) {
        const gpuInputAssembler = (inputAssembler as WebGLGFXInputAssembler).gpuInputAssembler;
        this._curGPUInputAssembler = gpuInputAssembler;
        this._isStateInvalied = true;
    }

    public setViewport (viewport: IGFXViewport) {
        if (!this._curViewport) {
            this._curViewport = {
                left: viewport.left,
                top: viewport.top,
                width: viewport.width,
                height: viewport.height,
                minDepth: viewport.minDepth,
                maxDepth: viewport.maxDepth,
            };
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

        if (this._curViewport !== viewport) {
            this._curViewport = viewport;
            this._isStateInvalied = true;
        }
    }

    public setScissor (scissor: IGFXRect) {
        if (!this._curScissor) {
            this._curScissor = {
                x: scissor.x,
                y: scissor.y,
                width: scissor.width,
                height: scissor.height,
            };
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

    public setDepthBias (depthBiasConstantFacotr: number, depthBiasClamp: number, depthBiasSlopeFactor: number) {
        if (!this._curDepthBias) {
            this._curDepthBias = {
                constantFactor: depthBiasConstantFacotr,
                clamp: depthBiasClamp,
                slopeFactor: depthBiasSlopeFactor,
            };
            this._isStateInvalied = true;
        } else {
            if (this._curDepthBias.constantFactor !== depthBiasConstantFacotr ||
                this._curDepthBias.clamp !== depthBiasClamp ||
                this._curDepthBias.slopeFactor !== depthBiasSlopeFactor) {

                this._curDepthBias.constantFactor = depthBiasConstantFacotr;
                this._curDepthBias.clamp = depthBiasClamp;
                this._curDepthBias.slopeFactor = depthBiasSlopeFactor;
                this._isStateInvalied = true;
            }
        }
    }

    public setBlendConstants (blendConstants: number[]) {
        if (!this._curBlendConstants &&
            blendConstants.length === 4) {
            this._curBlendConstants = [blendConstants[0], blendConstants[1], blendConstants[2], blendConstants[3]];
            this._isStateInvalied = true;
        } else {
            if (blendConstants.length === 4 && (
                this._curBlendConstants[0] !== blendConstants[0] ||
                this._curBlendConstants[1] !== blendConstants[1] ||
                this._curBlendConstants[2] !== blendConstants[2] ||
                this._curBlendConstants[3] !== blendConstants[3])) {
                this._curBlendConstants = [blendConstants[0], blendConstants[1], blendConstants[2], blendConstants[3]];
                this._isStateInvalied = true;
            }
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

            const cmd = ( this._allocator as WebGLGFXCommandAllocator).
                        drawCmdPool.alloc(WebGLCmdDraw);
            (inputAssembler as WebGLGFXInputAssembler).extractCmdDraw(cmd);
            this.cmdPackage.drawCmds.push(cmd);

            this.cmdPackage.cmds.push(WebGLCmd.DRAW);

            ++this._numDrawCalls;
            if (this._curGPUPipelineState) {
                const glPrimitive = this._curGPUPipelineState.glPrimitive;
                switch (glPrimitive) {
                    case WebGL2RenderingContext.TRIANGLES: {
                        this._numTris += inputAssembler.indexCount / 3 * inputAssembler.instanceCount;
                        break;
                    }
                    case WebGL2RenderingContext.TRIANGLE_STRIP:
                    case WebGL2RenderingContext.TRIANGLE_FAN: {
                        this._numTris += (inputAssembler.indexCount - 2) * inputAssembler.instanceCount;
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
            const gpuBuffer = (buffer as WebGLGFXBuffer).gpuBuffer;
            if (gpuBuffer) {
                const cmd = this._webGLAllocator!.updateBufferCmdPool.alloc(WebGLCmdUpdateBuffer);
                if (cmd) {

                    let buffSize;
                    if (size !== undefined ) {
                        buffSize = size;
                    } else if (buffer.usage & GFXBufferUsageBit.INDIRECT) {
                        buffSize = 0;
                    } else {
                        buffSize = (data as ArrayBuffer).byteLength;
                    }

                    const buff = data as ArrayBuffer;

                    cmd.gpuBuffer = gpuBuffer;
                    cmd.buffer = buff;
                    cmd.offset = (offset !== undefined ? offset : 0);
                    cmd.size = buffSize;
                    this.cmdPackage.updateBufferCmds.push(cmd);

                    this.cmdPackage.cmds.push(WebGLCmd.UPDATE_BUFFER);
                }
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

        if (this._type === GFXCommandBufferType.PRIMARY && !this._isInRenderPass ||
            this._type === GFXCommandBufferType.SECONDARY) {
            const gpuBuffer = ( srcBuff as WebGLGFXBuffer).gpuBuffer;
            const gpuTexture = ( dstTex as WebGLGFXTexture).gpuTexture;
            if (gpuBuffer && gpuTexture) {
                const cmd = this._webGLAllocator!.copyBufferToTextureCmdPool.alloc(WebGLCmdCopyBufferToTexture);
                if (cmd) {
                    cmd.gpuBuffer = gpuBuffer;
                    cmd.gpuTexture = gpuTexture;
                    cmd.dstLayout = dstLayout;
                    cmd.regions = regions;
                    this.cmdPackage.copyBufferToTextureCmds.push(cmd);

                    this.cmdPackage.cmds.push(WebGLCmd.COPY_BUFFER_TO_TEXTURE);
                }
            }
        } else {
            console.error('Command \'copyBufferToTexture\' must be recorded outside a render pass.');
        }
    }

    // tslint:disable: max-line-length
    public execute (cmdBuffs: GFXCommandBuffer[], count: number) {

        for (let i = 0; i < count; ++i) {
            const webGLCmdBuff = cmdBuffs[i] as WebGLGFXCommandBuffer;

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

            this.cmdPackage.cmds.concat(webGLCmdBuff.cmdPackage.cmds);

            this._numDrawCalls += webGLCmdBuff._numDrawCalls;
            this._numTris += webGLCmdBuff._numTris;
        }
    }

    public get webGLDevice (): WebGLGFXDevice {
        return this._device as WebGLGFXDevice;
    }

    private bindStates () {
        const bindStatesCmd = this._webGLAllocator!.bindStatesCmdPool.alloc(WebGLCmdBindStates);

        if (bindStatesCmd) {
            bindStatesCmd.gpuPipelineState = this._curGPUPipelineState;
            bindStatesCmd.gpuBindingLayout = this._curGPUBindingLayout;
            bindStatesCmd.gpuInputAssembler = this._curGPUInputAssembler;
            bindStatesCmd.viewport = this._curViewport;
            bindStatesCmd.scissor = this._curScissor;
            bindStatesCmd.lineWidth = this._curLineWidth;
            bindStatesCmd.depthBias = this._curDepthBias;
            bindStatesCmd.blendConstants = this._curBlendConstants;
            bindStatesCmd.depthBounds = this._curDepthBounds;
            bindStatesCmd.stencilWriteMask = this._curStencilWriteMask;
            bindStatesCmd.stencilCompareMask = this._curStencilCompareMask;

            this.cmdPackage.bindStatesCmds.push(bindStatesCmd);
            this.cmdPackage.cmds.push(WebGLCmd.BIND_STATES);

            this._isStateInvalied = false;
        }
    }
}
