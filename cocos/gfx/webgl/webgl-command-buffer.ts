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
import { WebGLCmd, WebGLCmdBeginRenderPass, WebGLCmdBindBindingLayout, WebGLCmdBindInputAssembler, WebGLCmdBindPipelineState, WebGLCmdCopyBufferToTexture, WebGLCmdDraw, WebGLCmdPackage, WebGLCmdUpdateBuffer, WebGLGFXBufferTextureCopy } from './webgl-commands';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGFXFramebuffer } from './webgl-framebuffer';
import { WebGLGFXInputAssembler } from './webgl-input-assembler';
import { WebGLGFXPipelineState } from './webgl-pipeline-state';
import { WebGLGFXTexture } from './webgl-texture';

export class WebGLGFXCommandBuffer extends GFXCommandBuffer {

    public cmdPackage: WebGLCmdPackage = new WebGLCmdPackage();

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
    }

    public beginRenderPass (framebuffer: GFXFramebuffer, renderArea: IGFXRect, clearColors: IGFXColor[], clearDepth: number, clearStencil: number) {
        const cmd = ( this._allocator as WebGLGFXCommandAllocator).beginRenderPassCmdPool.alloc(WebGLCmdBeginRenderPass);
        if (cmd) {
            cmd.gpuFramebuffer = ( framebuffer as WebGLGFXFramebuffer).gpuFramebuffer;
            cmd.renderArea = renderArea;
            cmd.clearColors = clearColors.slice();
            cmd.clearStencil = clearStencil;
            this.cmdPackage.beginRenderPassCmds.push(cmd);

            this.cmdPackage.cmds.push(WebGLCmd.BEGIN_RENDER_PASS);
        }
    }

    public endRenderPass () {
    }

    public bindPipelineState (pipelineState: GFXPipelineState) {
        const cmd = ( this._allocator as WebGLGFXCommandAllocator).bindPipelineStateCmdPool.alloc(WebGLCmdBindPipelineState);
        if (cmd) {
            cmd.gpuPipelineState = ( pipelineState as WebGLGFXPipelineState).gpuPipelineState;
            this.cmdPackage.bindPipelineStateCmds.push(cmd);

            this.cmdPackage.cmds.push(WebGLCmd.BIND_PIPELINE_STATE);
        }
    }

    public bindBindingLayout (bindingLayout: GFXBindingLayout) {
        const cmd = ( this._allocator as WebGLGFXCommandAllocator).bindBindingLayoutCmdPool.alloc(WebGLCmdBindBindingLayout);
        if (cmd) {
            cmd.gpuBindingLayout = ( bindingLayout as WebGLGFXBindingLayout).gpuBindingLayout;
            this.cmdPackage.bindBindingLayoutCmds.push(cmd);

            this.cmdPackage.cmds.push(WebGLCmd.BIND_BINDING_LAYOUT);
        }
    }

    public bindInputAssembler (inputAssembler: GFXInputAssembler) {

        const cmd = ( this._allocator as WebGLGFXCommandAllocator).bindInputAssemblerCmdPool.alloc(WebGLCmdBindInputAssembler);
        if (cmd) {
            cmd.gpuInputAssembler = ( inputAssembler as WebGLGFXInputAssembler).gpuInputAssembler;
            this.cmdPackage.bindInputAssemblerCmds.push(cmd);

            this.cmdPackage.cmds.push(WebGLCmd.BIND_INPUT_ASSEMBLER);
        }
    }

    public draw (inputAssembler: GFXInputAssembler) {
        const cmd = ( this._allocator as WebGLGFXCommandAllocator).drawCmdPool.alloc(WebGLCmdDraw);
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
        const gpuBuffer = ( buffer as WebGLGFXBuffer).gpuBuffer;
        if (gpuBuffer) {
            const cmd = ( this._allocator as WebGLGFXCommandAllocator).updateBufferCmdPool.alloc(WebGLCmdUpdateBuffer);
            if (cmd) {
                cmd.gpuBuffer = gpuBuffer;
                cmd.buffer = data.slice(0);
                cmd.offset = (offset !== undefined ? offset : 0);
                this.cmdPackage.updateBufferCmds.push(cmd);

                this.cmdPackage.cmds.push(WebGLCmd.UPDATE_BUFFER);
            }
        }
    }

    public copyBufferToTexture (srcBuff: GFXBuffer, dstTex: GFXTexture, dstLayout: GFXTextureLayout, regions: GFXBufferTextureCopy[]) {
        const gpuBuffer = ( srcBuff as WebGLGFXBuffer).gpuBuffer;
        const gpuTexture = ( dstTex as WebGLGFXTexture).gpuTexture;
        if (gpuBuffer && gpuTexture) {
            const cmd = ( this._allocator as WebGLGFXCommandAllocator).copyBufferToTextureCmdPool.alloc(WebGLCmdCopyBufferToTexture);
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

    public execute (cmdBuffs: GFXCommandBuffer[]) {

        for (const cmdBuff of cmdBuffs) {
            const webGLCmdBuff = cmdBuff as WebGLGFXCommandBuffer;

            this.cmdPackage.beginRenderPassCmds = this.cmdPackage.beginRenderPassCmds.concat(webGLCmdBuff.cmdPackage.beginRenderPassCmds);
            this.cmdPackage.bindPipelineStateCmds = this.cmdPackage.bindPipelineStateCmds.concat(webGLCmdBuff.cmdPackage.bindPipelineStateCmds);
            this.cmdPackage.bindBindingLayoutCmds = this.cmdPackage.bindBindingLayoutCmds.concat(webGLCmdBuff.cmdPackage.bindBindingLayoutCmds);
            this.cmdPackage.bindInputAssemblerCmds = this.cmdPackage.bindInputAssemblerCmds.concat(webGLCmdBuff.cmdPackage.bindInputAssemblerCmds);
            this.cmdPackage.drawCmds = this.cmdPackage.drawCmds.concat(webGLCmdBuff.cmdPackage.drawCmds);
            this.cmdPackage.updateBufferCmds = this.cmdPackage.updateBufferCmds.concat(webGLCmdBuff.cmdPackage.updateBufferCmds);
            this.cmdPackage.copyBufferToTextureCmds = this.cmdPackage.copyBufferToTextureCmds.concat(webGLCmdBuff.cmdPackage.copyBufferToTextureCmds);
            this.cmdPackage.cmds = this.cmdPackage.cmds.concat(webGLCmdBuff.cmdPackage.cmds);
        }
    }

    public get webGLDevice (): WebGLGFXDevice {
        return  this._device as WebGLGFXDevice;
    }
}
