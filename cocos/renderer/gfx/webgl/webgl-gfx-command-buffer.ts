import { GFXDevice } from '../gfx-device';
import { GFXCommandBuffer, GFXCommandBufferInfo, GFXBufferTextureCopy } from '../gfx-command-buffer';
import { GFXBuffer } from '../gfx-buffer';
import { WebGLCmdUpdateBuffer, WebGLCmd, WebGLCmdBeginRenderPass, WebGLCmdPackage, WebGLCmdBindInputAssembler, WebGLCmdBindPipelineState, WebGLCmdDraw, WebGLCmdBindBindingLayout, WebGLCmdCopyBufferToTexture } from './webgl-commands';
import { WebGLGFXCommandAllocator } from './webgl-gfx-command-allocator';
import { WebGLGFXDevice } from './webgl-gfx-device';
import { WebGLGFXBuffer } from './webgl-gfx-buffer';
import { GFXFramebuffer } from '../gfx-framebuffer';
import { WebGLGFXFramebuffer } from './webgl-gfx-framebuffer';
import { GFXInputAssembler } from '../gfx-input-assembler';
import { WebGLGFXInputAssembler } from './webgl-gfx-input-assembler';
import { GFXPipelineState } from '../gfx-pipeline-state';
import { WebGLGFXPipelineState } from './webgl-gfx-pipeline-state';
import { GFXBindingLayout } from '../gfx-binding-layout';
import { WebGLGFXBindingLayout } from './webgl-gfx-binding-layout';
import { GFXTexture } from '../gfx-texture';
import { GFXTextureLayout } from '../gfx-render-pass';
import { WebGLGFXTexture } from './webgl-gfx-texture';

export class WebGLGFXCommandBuffer extends GFXCommandBuffer {

    cmdPackage : WebGLCmdPackage = new WebGLCmdPackage;

    constructor(device : GFXDevice) {
        super(device);
    }

    public initialize(info : GFXCommandBufferInfo) : boolean {

        if(!info.allocator) {
            return false;
        }

        this._allocator = info.allocator;
        this._type = info.type;

        return true;
    }

    public destroy() {
        if(this._allocator) {
            this.cmdPackage.clearCmds(<WebGLGFXCommandAllocator>this._allocator);
        }
    }

    public begin() {
        if(this._allocator) {
            this.cmdPackage.clearCmds(<WebGLGFXCommandAllocator>this._allocator);
        }
    }

    public end() {
    }

    public beginRenderPass(framebuffer : GFXFramebuffer, viewport : number[], numClearColors : number, clearColors : number[], clearStencil : number) {
        let cmd = (<WebGLGFXCommandAllocator>this._allocator).beginRenderPassCmdPool.alloc(WebGLCmdBeginRenderPass);
        if (cmd) {
            cmd.gpuFramebuffer = (<WebGLGFXFramebuffer>framebuffer).gpuFramebuffer;
            cmd.viewport = viewport.slice();
            cmd.numClearColors = numClearColors;
            cmd.clearColors = clearColors.slice();
            cmd.clearStencil = clearStencil;
            this.cmdPackage.beginRenderPassCmds.push(cmd);

            this.cmdPackage.cmds.push(WebGLCmd.BEGIN_RENDER_PASS);
        }
    }

    public endRenderPass() {
    }

    public bindPipelineState(pipelineState : GFXPipelineState) {
        let cmd = (<WebGLGFXCommandAllocator>this._allocator).bindPipelineStateCmdPool.alloc(WebGLCmdBindPipelineState);
        if (cmd) {
            cmd.gpuPipelineState = (<WebGLGFXPipelineState>pipelineState).gpuPipelineState;
            this.cmdPackage.bindPipelineStateCmds.push(cmd);

            this.cmdPackage.cmds.push(WebGLCmd.BIND_PIPELINE_STATE);
        }
    }

    public bindBindingLayout(bindingLayout : GFXBindingLayout) {
        let cmd = (<WebGLGFXCommandAllocator>this._allocator).bindBindingLayoutCmdPool.alloc(WebGLCmdBindBindingLayout);
        if (cmd) {
            cmd.gpuBindingLayout= (<WebGLGFXBindingLayout>bindingLayout).gpuBindingLayout;
            this.cmdPackage.bindBindingLayoutCmds.push(cmd);

            this.cmdPackage.cmds.push(WebGLCmd.BIND_BINDING_LAYOUT);
        }
    }

    public bindInputAssembler(inputAssembler : GFXInputAssembler) {

        let cmd = (<WebGLGFXCommandAllocator>this._allocator).bindInputAssemblerCmdPool.alloc(WebGLCmdBindInputAssembler);
        if (cmd) {
            cmd.gpuInputAssembler = (<WebGLGFXInputAssembler>inputAssembler).gpuInputAssembler;
            this.cmdPackage.bindInputAssemblerCmds.push(cmd);

            this.cmdPackage.cmds.push(WebGLCmd.BIND_INPUT_ASSEMBLER);
        }
    }

    public draw(inputAssembler : GFXInputAssembler) {
        let cmd = (<WebGLGFXCommandAllocator>this._allocator).drawCmdPool.alloc(WebGLCmdDraw);
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
    
    public updateBuffer(buffer : GFXBuffer, data : Buffer, offset : number) {
        let gpuBuffer = (<WebGLGFXBuffer>buffer).gpuBuffer;
        if(gpuBuffer) {
            let cmd = (<WebGLGFXCommandAllocator>this._allocator).updateBufferCmdPool.alloc(WebGLCmdUpdateBuffer);
            if (cmd) {
                cmd.gpuBuffer = gpuBuffer;
                cmd.buffer = data.slice(0);
                cmd.offset = offset;
                this.cmdPackage.updateBufferCmds.push(cmd);
    
                this.cmdPackage.cmds.push(WebGLCmd.UPDATE_BUFFER);
            }
        }
    }

    public copyBufferToTexture(srcBuff : GFXBuffer, dstTex : GFXTexture, dstLayout: GFXTextureLayout, regions : GFXBufferTextureCopy[]) {
        let gpuBuffer = (<WebGLGFXBuffer>srcBuff).gpuBuffer;
        let gpuTexture = (<WebGLGFXTexture>dstTex).gpuTexture;
        if(gpuBuffer && gpuTexture) {
            let cmd = (<WebGLGFXCommandAllocator>this._allocator).copyBufferToTextureCmdPool.alloc(WebGLCmdCopyBufferToTexture);
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

    public execute(cmdBuffs : GFXCommandBuffer[]) {

        for(let i = 0; i < cmdBuffs.length; ++i) {
            let webGLCmdBuff = <WebGLGFXCommandBuffer>cmdBuffs[i];

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

    public get webGLDevice() : WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }
};
