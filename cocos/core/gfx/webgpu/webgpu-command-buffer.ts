import { DescriptorSet } from '../base/descriptor-set';
import { Buffer } from '../base/buffer';
import { CommandBuffer } from '../base/command-buffer';
import {
    BufferUsageBit,
    CommandBufferType,
    LoadOp,
    StencilFace,
    StoreOp,
    BufferSource,
    DrawInfo,
    CommandBufferInfo,
    BufferTextureCopy,
    Color,
    Rect,
    Viewport,
    IndirectBuffer,
} from '../base/define';
import { Framebuffer } from '../base/framebuffer';
import { InputAssembler } from '../base/input-assembler';
import { PipelineState } from '../base/pipeline-state';
import { Texture } from '../base/texture';
import { WebGPUDescriptorSet } from './webgpu-descriptor-set';
import { WebGPUBuffer } from './webgpu-buffer';
import { WebGPUDevice } from './webgpu-device';
import { WebGPUFramebuffer } from './webgpu-framebuffer';
import { WebGPUInputAssembler } from './webgpu-input-assembler';
import { WebGPUPipelineState } from './webgpu-pipeline-state';
import { WebGPUTexture } from './webgpu-texture';
import { RenderPass } from '../base/render-pass';
import { WebGPURenderPass } from './webgpu-render-pass';
import { wgpuWasmModule } from './webgpu-utils';
import { WebGPUQueue } from './webgpu-queue';
import { checkCircleReference } from '../../asset-manager/utilities';

export class WebGPUCommandBuffer extends CommandBuffer {
    private _nativeCommandBuffer;

    private _device;

    set device (device) {
        this._device = device;
    }

    get nativeCommandBuffer () {
        return this._nativeCommandBuffer;
    }

    public initialize (info: CommandBufferInfo): boolean {
        this._queue = info.queue;
        this._type = info.type;

        const nativeDevice = wgpuWasmModule.nativeDevice;
        if (this._device) {
            this._nativeCommandBuffer = nativeDevice.getCommandBuffer();
        } else {
            const commandBufferInfo = new wgpuWasmModule.CommandBufferInfoInstance();
            commandBufferInfo.setQueue((info.queue as WebGPUQueue).nativeQueue);
            const cmdBuffStr = CommandBufferType[info.type];
            commandBufferInfo.setType(wgpuWasmModule.CommandBufferType[cmdBuffStr]);
            this._nativeCommandBuffer = nativeDevice.createCommandBuffer(commandBufferInfo);
        }

        return true;
    }

    public destroy () {
        this._nativeCommandBuffer.destroy();
        this._nativeCommandBuffer.delete();
    }

    public begin (renderPass?: RenderPass, subpass = 0, frameBuffer?: Framebuffer) {
        //.function("begin4", select_overload<void(void)>(&CommandBuffer::begin))
        //.function("begin3", select_overload<void(RenderPass *)>(&CommandBuffer::begin), allow_raw_pointers())
        //.function("begin2", select_overload<void(RenderPass *, uint)>(&CommandBuffer::begin), allow_raw_pointers())
        //.function("begin", select_overload<void(RenderPass *, uint, Framebuffer *)>(&CommandBuffer::begin), allow_raw_pointers())
        if (renderPass) {
            if (subpass) {
                if (frameBuffer) {
                    this._nativeCommandBuffer.begin((renderPass as WebGPURenderPass).nativeRenderPass, subpass, (frameBuffer as WebGPUFramebuffer).nativeFrameBuffer);
                } else {
                    this._nativeCommandBuffer.begin2((renderPass as WebGPURenderPass).nativeRenderPass, subpass);
                }
            } else {
                this._nativeCommandBuffer.begin3((renderPass as WebGPURenderPass).nativeRenderPass);
            }
        } else {
            this._nativeCommandBuffer.begin4();
        }
    }

    public end () {
        this._nativeCommandBuffer.end();
    }

    public beginRenderPass (
        renderPass: RenderPass,
        framebuffer: Framebuffer,
        renderArea: Rect,
        clearColors: Color[],
        clearDepth: number,
        clearStencil: number,
    ) {
        const rect = wgpuWasmModule.Rect();
        rect.x = renderArea.x;
        rect.y = renderArea.y;
        rect.width = renderArea.width;
        rect.height = renderArea.height;

        const colors = new wgpuWasmModule.ColorList();
        for (let i = 0; i < clearColors.length; i++) {
            const color = new wgpuWasmModule.Color();
            color.x = clearColors[i].x;
            color.y = clearColors[i].y;
            color.z = clearColors[i].z;
            color.w = clearColors[i].w;
            colors.push_back(color);
        }

        this._nativeCommandBuffer.beginRenderPass((renderPass as WebGPURenderPass).nativeRenderPass,
            (framebuffer as WebGPUFramebuffer).nativeFrameBuffer,
            rect,
            colors,
            clearDepth,
            clearStencil);
    }

    public endRenderPass () {
        this._nativeCommandBuffer.endRenderPass();
    }

    public bindPipelineState (pipelineState: PipelineState) {
        this._nativeCommandBuffer.bindPipelineState((pipelineState as WebGPUPipelineState).nativePipelineState);
    }

    public bindDescriptorSet (set: number, descriptorSet: DescriptorSet, dynamicOffsets?: number[]) {
        if (dynamicOffsets) {
            const dynOffsets = new wgpuWasmModule.vector_uint32();
            for (let i = 0; i < dynamicOffsets.length; i++) {
                dynOffsets.push_back(dynamicOffsets[i]);
            }
            this._nativeCommandBuffer.bindDescriptorSet(set, (descriptorSet as WebGPUDescriptorSet).nativeDescriptorSet, dynOffsets);
        } else {
            this._nativeCommandBuffer.bindDescriptorSet2(set, (descriptorSet as WebGPUDescriptorSet).nativeDescriptorSet);
        }
    }

    public bindInputAssembler (inputAssembler: InputAssembler) {
        this._nativeCommandBuffer.bindInputAssembler((inputAssembler as WebGPUInputAssembler).nativeInputAssembler);
    }

    public setViewport (viewport: Viewport) {
        const viewPort = new wgpuWasmModule.ViewportInstance();
        viewPort.left = viewport.left;
        viewPort.top = viewport.top;
        viewPort.width = viewport.width;
        viewPort.height = viewport.height;
        viewPort.minDepth = viewport.minDepth;
        viewPort.maxDepth = viewport.maxDepth;
        this._nativeCommandBuffer.setViewport(viewPort);
    }

    public setScissor (scissor: Rect) {
        const rect = new wgpuWasmModule.RectInstance();
        rect.x = scissor.x;
        rect.y = scissor.y;
        rect.width = scissor.width;
        rect.height = scissor.height;
        this._nativeCommandBuffer.setScissor(scissor);
    }

    public setLineWidth (lineWidth: number) {
        console.log('line width not support in webgpu');
    }

    public setDepthBias (depthBiasConstantFactor: number, depthBiasClamp: number, depthBiasSlopeFactor: number) {
        this._nativeCommandBuffer.setDepthBias(depthBiasConstantFactor, depthBiasClamp, depthBiasSlopeFactor);
    }

    public setBlendConstants (blendConstants: Color) {
        const color = new wgpuWasmModule.ColorInstance();
        color.x = blendConstants.x;
        color.y = blendConstants.y;
        color.z = blendConstants.z;
        color.w = blendConstants.w;
        this._nativeCommandBuffer.setBlendConstants(color);
    }

    public setDepthBound (minDepthBounds: number, maxDepthBounds: number) {
        this._nativeCommandBuffer.setDepthBound(minDepthBounds, maxDepthBounds);
    }

    public setStencilWriteMask (face: StencilFace, writeMask: number) {
        const stencilFaceStr = StencilFace[face];
        this._nativeCommandBuffer.setStencilWriteMask(wgpuWasmModule.StencilFace[stencilFaceStr], writeMask);
    }

    public setStencilCompareMask (face: StencilFace, reference: number, compareMask: number) {
        const stencilFaceStr = StencilFace[face];
        this._nativeCommandBuffer.setStencilCompareMask(wgpuWasmModule.StencilFace[stencilFaceStr], reference, compareMask);
    }

    public draw (inputAssembler: InputAssembler) {
        const ia = inputAssembler as WebGPUInputAssembler;
        ia.check();
        this._nativeCommandBuffer.drawIA(ia.nativeInputAssembler);
    }

    public updateBuffer (buffer: Buffer, data: BufferSource, offset?: number, size?: number) {
        const buff = buffer as WebGPUBuffer;
        if (data instanceof IndirectBuffer) {
            const drawInfos = new wgpuWasmModule.DrawInfoList();
            for (let i = 0; i < data.drawInfos.length; i++) {
                const drawInfo = new wgpuWasmModule.DrawInfo();
                drawInfo.vertexCount = data.drawInfos[i].vertexCount;
                drawInfo.firstVertex = data.drawInfos[i].firstVertex;
                drawInfo.indexCount = data.drawInfos[i].indexCount;
                drawInfo.firstIndex = data.drawInfos[i].firstIndex;
                drawInfo.vertexOffset = data.drawInfos[i].vertexOffset;
                drawInfo.instanceCount = data.drawInfos[i].instanceCount;
                drawInfo.firstInstance = data.drawInfos[i].firstInstance;
                drawInfos.push_back(buff.nativeBuffer, drawInfo);
            }
            this._nativeCommandBuffer.updateBuffer(drawInfos);
        } else {
            const buffSize = size || buff.size;
            let u8buff;
            if ('buffer' in data) {
            // es-lint as any
                u8buff = new Uint8Array((data as any).buffer, (data as any).byteOffset, (data as any).byteLength);
            } else {
                u8buff = new Uint8Array(data);
            }
            //const u8buff = new Uint8Array(rawBuffer);
            this._nativeCommandBuffer.updateBuffer(buff.nativeBuffer, u8buff, buffSize);
        }
    }

    public copyBuffersToTexture (buffers: ArrayBufferView[], texture: Texture, regions: BufferTextureCopy[]) {
        // const stringList = new wgpuWasmModule.StringList();
        // for (let i = 0; i < buffers.length; i++) {
        //     //const rawData = buffers[i]
        //     const utf8decoder = new TextDecoder('ascii'); // default 'utf-8' or 'utf8'
        //     const str = utf8decoder.decode(buffers[i]);
        //     stringList.push_back(str);
        // }

        // const bufferTextureCopyList = new wgpuWasmModule.BufferTextureCopyList();
        // for (let i = 0; i < regions.length; i++) {
        //     const bufferTextureCopy = new wgpuWasmModule.BufferTextureCopyInstance();
        //     bufferTextureCopy.buffStride = regions[i].buffStride;
        //     bufferTextureCopy.buffTexHeight = regions[i].buffTexHeight;
        //     bufferTextureCopy.texOffset.x = regions[i].texOffset.x;
        //     bufferTextureCopy.texOffset.y = regions[i].texOffset.y;
        //     bufferTextureCopy.texOffset.z = regions[i].texOffset.z;
        //     bufferTextureCopy.texExtent.width = regions[i].texExtent.width;
        //     bufferTextureCopy.texExtent.height = regions[i].texExtent.height;
        //     bufferTextureCopy.texExtent.depth = regions[i].texExtent.depth;
        //     bufferTextureCopy.texSubres.mipLevel = regions[i].texSubres.mipLevel;
        //     bufferTextureCopy.texSubres.baseArrayLayer = regions[i].texSubres.baseArrayLayer;
        //     bufferTextureCopy.texSubres.layerCount = regions[i].texSubres.layerCount;
        //     bufferTextureCopyList.push_back(bufferTextureCopy);
        // }
        // const nativeDevice = wgpuWasmModule.nativeDevice;
        // nativeDevice.copyBuffersToTexture(stringList, (texture as WebGPUTexture).nativeTexture, bufferTextureCopyList);
    }

    public execute (cmdBuffs: CommandBuffer[], count: number) {
        console.log('execute...');
    }

    public pipelineBarrier (globalBarrier: GlobalBarrier | null, textureBarriers?: TextureBarrier[], textures?: Texture[]) {
        console.log('pipelineBarrier...');
    }
}
