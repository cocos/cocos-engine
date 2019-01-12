import { GFXBindingLayout } from '../binding-layout';
import { GFXBuffer } from '../buffer';
import { GFXCommandBuffer, IGFXCommandBufferInfo } from '../command-buffer';
import { GFXBufferTextureCopy, GFXStatus, GFXTextureLayout, IGFXColor, IGFXRect } from '../define';
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
import { WebGLGPUBindingLayout, WebGLGPUInputAssembler, WebGLGPUPipelineState } from './webgl-gpu-objects';
import { WebGLGFXInputAssembler } from './webgl-input-assembler';
import { WebGLGFXPipelineState } from './webgl-pipeline-state';
import { WebGLGFXTexture } from './webgl-texture';

export class WebGLGFXCommandBuffer extends GFXCommandBuffer {

    public cmdPackage: WebGLCmdPackage = new WebGLCmdPackage();
    private _curGPUPipelineState: WebGLGPUPipelineState | null = null;
    private _curGPUBindingLayout: WebGLGPUBindingLayout | null = null;
    private _curGPUInputAssembler: WebGLGPUInputAssembler | null = null;
    private _isStateInvalied: boolean = false;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXCommandBufferInfo): boolean {

        if (!info.allocator) {
            return false;
        }

        this._allocator = info.allocator;
        this._type = info.type;
        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._allocator) {
            this.cmdPackage.clearCmds( this._allocator as WebGLGFXCommandAllocator);
        }
        this._status = GFXStatus.UNREADY;
    }

    public begin () {
        if (this._allocator) {
            this.cmdPackage.clearCmds( this._allocator as WebGLGFXCommandAllocator);
        }
    }

    public end () {
        if (this._isStateInvalied) {
            this.bindStates();
        }
    }

    public beginRenderPass (
        framebuffer: GFXFramebuffer,
        renderArea: IGFXRect,
        clearColors: IGFXColor[],
        clearDepth: number,
        clearStencil: number) {
        const cmd = ( this._allocator as WebGLGFXCommandAllocator).
                    beginRenderPassCmdPool.alloc(WebGLCmdBeginRenderPass);
        if (cmd) {
            cmd.gpuFramebuffer = ( framebuffer as WebGLGFXFramebuffer).gpuFramebuffer;
            cmd.renderArea = renderArea;
            cmd.clearColors = clearColors.slice();
            cmd.clearDepth = clearDepth;
            cmd.clearStencil = clearStencil;
            this.cmdPackage.beginRenderPassCmds.push(cmd);

            this.cmdPackage.cmds.push(WebGLCmd.BEGIN_RENDER_PASS);
        }
    }

    public endRenderPass () {
    }

    public bindPipelineState (pipelineState: GFXPipelineState) {
        this._curGPUPipelineState = (pipelineState as WebGLGFXPipelineState).gpuPipelineState;
        this._isStateInvalied = true;
    }

    public bindBindingLayout (bindingLayout: GFXBindingLayout) {
        this._curGPUBindingLayout = (bindingLayout as WebGLGFXBindingLayout).gpuBindingLayout;
        this._isStateInvalied = true;
    }

    public bindInputAssembler (inputAssembler: GFXInputAssembler) {
        this._curGPUInputAssembler = (inputAssembler as WebGLGFXInputAssembler).gpuInputAssembler;
        this._isStateInvalied = true;
    }

    public draw (inputAssembler: GFXInputAssembler) {

        if (this._isStateInvalied) {
            this.bindStates();
        }

        const cmd = ( this._allocator as WebGLGFXCommandAllocator).
                    drawCmdPool.alloc(WebGLCmdDraw);
        if (cmd) {
            cmd.vertexCount = inputAssembler.vertexCount;
            cmd.firstVertex = inputAssembler.firstVertex;
            cmd.indexCount = inputAssembler.indexCount;
            cmd.firstIndex = inputAssembler.firstIndex;
            cmd.vertexOffset = inputAssembler.vertexOffset;
            cmd.instanceCount = inputAssembler.instanceCount;
            cmd.firstInstance = inputAssembler.firstInstance;

            this.cmdPackage.drawCmds.push(cmd);

            this.cmdPackage.cmds.push(WebGLCmd.DRAW);
        }
    }

    public updateBuffer (buffer: GFXBuffer, data: ArrayBuffer, offset?: number) {
        const gpuBuffer = (buffer as WebGLGFXBuffer).gpuBuffer;
        if (gpuBuffer) {
            const cmd = (this._allocator as WebGLGFXCommandAllocator).
                        updateBufferCmdPool.alloc(WebGLCmdUpdateBuffer);
            if (cmd) {
                cmd.gpuBuffer = gpuBuffer;
                cmd.buffer = data.slice(0);
                cmd.offset = (offset !== undefined ? offset : 0);
                this.cmdPackage.updateBufferCmds.push(cmd);

                this.cmdPackage.cmds.push(WebGLCmd.UPDATE_BUFFER);
            }
        }
    }

    public copyBufferToTexture (
        srcBuff: GFXBuffer,
        dstTex: GFXTexture,
        dstLayout: GFXTextureLayout,
        regions: GFXBufferTextureCopy[]) {
        const gpuBuffer = ( srcBuff as WebGLGFXBuffer).gpuBuffer;
        const gpuTexture = ( dstTex as WebGLGFXTexture).gpuTexture;
        if (gpuBuffer && gpuTexture) {
            const cmd = (this._allocator as WebGLGFXCommandAllocator).
                        copyBufferToTextureCmdPool.alloc(WebGLCmdCopyBufferToTexture);
            if (cmd) {
                cmd.gpuBuffer = gpuBuffer;
                cmd.gpuTexture = gpuTexture;
                cmd.dstLayout = dstLayout;
                cmd.regions = regions;
                this.cmdPackage.copyBufferToTextureCmds.push(cmd);

                this.cmdPackage.cmds.push(WebGLCmd.COPY_BUFFER_TO_TEXTURE);
            }
        }
    }

    // tslint:disable: max-line-length
    public execute (cmdBuffs: GFXCommandBuffer[]) {

        for (const cmdBuff of cmdBuffs) {
            const webGLCmdBuff = cmdBuff as WebGLGFXCommandBuffer;

            this.cmdPackage.beginRenderPassCmds = this.cmdPackage.beginRenderPassCmds.concat(webGLCmdBuff.cmdPackage.beginRenderPassCmds);
            this.cmdPackage.bindStatesCmds = this.cmdPackage.bindStatesCmds.concat(webGLCmdBuff.cmdPackage.bindStatesCmds);
            this.cmdPackage.drawCmds = this.cmdPackage.drawCmds.concat(webGLCmdBuff.cmdPackage.drawCmds);
            this.cmdPackage.updateBufferCmds = this.cmdPackage.updateBufferCmds.concat(webGLCmdBuff.cmdPackage.updateBufferCmds);
            this.cmdPackage.copyBufferToTextureCmds = this.cmdPackage.copyBufferToTextureCmds.concat(webGLCmdBuff.cmdPackage.copyBufferToTextureCmds);
            this.cmdPackage.cmds = this.cmdPackage.cmds.concat(webGLCmdBuff.cmdPackage.cmds);
        }
    }

    public get webGLDevice (): WebGLGFXDevice {
        return  this._device as WebGLGFXDevice;
    }

    private bindStates () {
        const bindStatesCmd = ( this._allocator as WebGLGFXCommandAllocator).
        bindStatesCmdPool.alloc(WebGLCmdBindStates);

        if (bindStatesCmd) {
            bindStatesCmd.gpuPipelineState = this._curGPUPipelineState;
            bindStatesCmd.gpuBindingLayout = this._curGPUBindingLayout;
            bindStatesCmd.gpuInputAssembler = this._curGPUInputAssembler;

            this.cmdPackage.bindStatesCmds.push(bindStatesCmd);
            this.cmdPackage.cmds.push(WebGLCmd.BIND_STATES);

            this._isStateInvalied = false;
        }
    }
}
