/* eslint-disable new-cap */
/* eslint-disable dot-notation */
import glslang from '@webgpu/glslang/dist/web-devel/glslang';/* eslint-disable @typescript-eslint/no-floating-promises */
import { Device } from '../base/device';
import {
    DeviceInfo, RenderPassInfo, SwapchainInfo, SampleCount, FramebufferInfo, BufferTextureCopy,
    SamplerInfo, DescriptorSetInfo, DescriptorSetLayoutInfo, PipelineLayoutInfo, ShaderInfo,
    InputAssemblerInfo, CommandBufferInfo, QueueInfo, QueueType, CommandBufferType,
} from '../base/define';
import { PipelineState, PipelineStateInfo } from '../base/pipeline-state';
import { RenderPass } from '../base/render-pass';
import { Sampler } from '../base/states/sampler';
import { Swapchain } from '../base/swapchain';
import { Buffer } from '../base/buffer';
import { Texture } from '../base/texture';
import { Shader } from '../base/shader';
import {
    CommandBuffer, InputAssembler, DescriptorSet, DescriptorSetLayout, PipelineLayout, BufferInfo, BufferViewInfo,
    TextureInfo, TextureViewInfo, Framebuffer, GlobalBarrier, GlobalBarrierInfo, TextureBarrier, TextureBarrierInfo,
} from '..';

import { nativeLib, glslalgWasmModule } from './webgpu-utils';
import { WebGPURenderPass } from './webgpu-render-pass';
import { WebGPUFramebuffer } from './webgpu-framebuffer';
import { WebGPUSwapchain } from './webgpu-swapchain';
import { WebGPUSampler } from './webgpu-sampler';
import { WebGPUTexture } from './webgpu-texture';
import { WebGPUBuffer } from './webgpu-buffer';
import { WebGPUDescriptorSet } from './webgpu-descriptor-set';
import { WebGPUDescriptorSetLayout } from './webgpu-descriptor-set-layout';
import { WebGPUPipelineLayout } from './webgpu-pipeline-layout';
import { WebGPUShader } from './webgpu-shader';
import { WebGPUPipelineState } from './webgpu-pipeline-state';
import { WebGPUInputAssembler } from './webgpu-input-assembler';
import { WebGPUCommandBuffer } from './webgpu-command-buffer';
import { assert } from '../../platform';
import { Queue } from '../base/queue';
import { Graphics } from '../../../2d';
import { WebGPUQueue } from './webgpu-queue';
import wasmDevice from './lib/webgpu_wasm.js';

function getChromeVersion () {
    const raw = /Chrom(e|ium)\/([0-9]+)\./.exec(navigator.userAgent);

    return raw ? parseInt(raw[2], 10) : false;
}

export class WebGPUDevice extends Device {
    private _nativeDevice = undefined;

    get nativeDevice () {
        return this._nativeDevice;
    }

    public initialize (info: DeviceInfo): Promise<boolean> {
        async function getDevice () {
            const chromeVersion = getChromeVersion();
            const adapter = await (navigator as any).gpu.requestAdapter();
            const device = await adapter.requestDevice();
            glslalgWasmModule['glslang'] = await glslang();
            nativeLib['preinitializedWebGPUDevice'] = device;
            device.lost.then((info) => {
                console.error('Device was lost.', info);
                throw new Error('Something bad happened');
            });
            console.log(adapter);
        }
        const launch = (): boolean => {
            this._nativeDevice = nativeLib.CCWGPUDevice.getInstance();
            nativeLib.nativeDevice = this._nativeDevice;
            const deviceInfo = {};
            const bufferOffsets = new nativeLib['vector_int']();
            for (let i = 0; i < info.bindingMappingInfo.bufferOffsets.length; i++) {
                bufferOffsets.push_back(info.bindingMappingInfo.bufferOffsets[i]);
            }

            const samplerOffsets = new nativeLib['vector_int']();
            for (let i = 0; i < info.bindingMappingInfo.samplerOffsets.length; i++) {
                samplerOffsets.push_back(info.bindingMappingInfo.samplerOffsets[i]);
            }

            deviceInfo['bindingMappingInfo'] = {
                bufferOffsets,
                samplerOffsets,
                flexibleSet: info.bindingMappingInfo.flexibleSet,
            };

            (this._nativeDevice as any).initialize(deviceInfo);

            const queueInfo = new QueueInfo(QueueType.GRAPHICS);
            this._queue = new WebGPUQueue();
            (this._queue as WebGPUQueue).device = this;
            this._queue.initialize(queueInfo);

            const cmdBufferInfo = new CommandBufferInfo(this._queue, CommandBufferType.PRIMARY);
            this._cmdBuff = new WebGPUCommandBuffer();
            (this._cmdBuff as WebGPUCommandBuffer).device = this;
            this._cmdBuff.initialize(cmdBufferInfo);

            this._caps.uboOffsetAlignment = 256;
            this._caps.clipSpaceMinZ = 0;
            this._caps.screenSpaceSignY = -1;
            this._caps.clipSpaceSignY = 1;
            return true;
        };

        const mainEntry: Promise<boolean> = wasmDevice(nativeLib).then(() => {
            nativeLib.wasmLoaded = true;
            console.log(nativeLib);
            return Promise.resolve(getDevice().then(() => launch()));
        });

        return Promise.resolve(mainEntry);
    }

    public destroy (): void {
        (this._nativeDevice as any).destroy();
        (this._nativeDevice as any).delete();
    }

    public acquire (swapchains: Swapchain[]): void {
        const swapchainList = new nativeLib.SwapchainList();
        for (let i = 0; i < swapchains.length; i++) {
            swapchainList.push_back((swapchains[i] as WebGPUSwapchain).nativeSwapchain);
        }
        (this._nativeDevice as any).acquire(swapchainList);
    }

    public present (): void {
        (this._nativeDevice as any).present();
    }

    public createSwapchain (info: Readonly<SwapchainInfo>): Swapchain {
        const swapchain = new WebGPUSwapchain();
        swapchain.initialize(info);
        return swapchain;
    }

    public flushCommands (cmdBuffs: CommandBuffer[]): void {
        //assert(false, 'flushCommands not impl!');
    }

    public createCommandBuffer (info: CommandBufferInfo): CommandBuffer {
        const buffer = new WebGPUCommandBuffer();
        if (buffer.initialize(info)) {
            return buffer;
        }
        return null!;
    }

    public createBuffer (info: BufferInfo | BufferViewInfo): Buffer {
        const buffer = new WebGPUBuffer();
        if (buffer.initialize(info)) {
            return buffer;
        }
        return null!;
    }

    public createTexture (info: TextureInfo | TextureViewInfo): Texture {
        const texture = new WebGPUTexture();
        if (texture.initialize(info)) {
            return texture;
        }
        return null!;
    }

    public getSampler (info: SamplerInfo): Sampler {
        const hash = Sampler.computeHash(info);
        if (!this._samplers.has(hash)) {
            this._samplers.set(hash, new WebGPUSampler(info, hash));
        }
        return this._samplers.get(hash)!;
    }

    public createDescriptorSet (info: DescriptorSetInfo): DescriptorSet {
        const descriptorSet = new WebGPUDescriptorSet();
        descriptorSet.initialize(info);
        return descriptorSet;
    }

    public createShader (info: ShaderInfo): Shader {
        const shader = new WebGPUShader();
        if (shader.initialize(info)) {
            return shader;
        }
        return null!;
    }

    public createInputAssembler (info: InputAssemblerInfo): InputAssembler {
        const ia = new WebGPUInputAssembler();
        if (ia.initialize(info)) {
            return ia;
        }
        return null!;
    }

    public createRenderPass (info: RenderPassInfo): RenderPass {
        const renderPass = new WebGPURenderPass();
        if (renderPass.initialize(info)) {
            return renderPass;
        }
        return null!;
    }

    public createFramebuffer (info: FramebufferInfo): Framebuffer {
        const framebuffer = new WebGPUFramebuffer();
        if (framebuffer.initialize(info)) {
            return framebuffer;
        }
        return null!;
    }

    public createDescriptorSetLayout (info: DescriptorSetLayoutInfo): DescriptorSetLayout {
        const descriptorSetLayout = new WebGPUDescriptorSetLayout();
        descriptorSetLayout.initialize(info);
        return descriptorSetLayout;
    }

    public createPipelineLayout (info: PipelineLayoutInfo): PipelineLayout {
        const pipelineLayout = new WebGPUPipelineLayout();
        if (pipelineLayout.initialize(info)) {
            return pipelineLayout;
        }
        return null!;
    }

    public createPipelineState (info: PipelineStateInfo): PipelineState {
        const pipelineState = new WebGPUPipelineState();
        if (pipelineState.initialize(info)) {
            return pipelineState;
        }
        return null!;
    }

    public createQueue (info: QueueInfo): Queue {
        const queue = new WebGPUQueue();
        if (queue.initialize(info)) {
            return queue;
        }
        return null!;
    }

    public getGlobalBarrier (info: GlobalBarrierInfo): GlobalBarrier {
        const hash = GlobalBarrier.computeHash(info);
        if (!this._globalBarriers.has(hash)) {
            this._globalBarriers.set(hash, new GlobalBarrier(info, hash));
        }
        return this._globalBarriers.get(hash)!;
    }

    public getTextureBarrier (info: TextureBarrierInfo): TextureBarrier {
        const hash = TextureBarrier.computeHash(info);
        if (!this._textureBarriers.has(hash)) {
            this._textureBarriers.set(hash, new TextureBarrier(info, hash));
        }
        return this._textureBarriers.get(hash)!;
    }

    public copyBuffersToTexture (buffers: ArrayBufferView[], texture: Texture, regions: BufferTextureCopy[]): void {
        const bufferDataList: Uint8Array[] = [];
        const bufferTextureCopyList = new nativeLib.BufferTextureCopyList();
        for (let i = 0; i < buffers.length; i++) {
            let data;
            let rawBuffer;
            if ('buffer' in buffers[i]) {
                // es-lint as any
                data = new Uint8Array((buffers[i] as any).buffer, (buffers[i] as any).byteOffset, (buffers[i] as any).byteLength);
            } else {
                rawBuffer = buffers[i];
                data = new Uint8Array(rawBuffer);
            }
            bufferDataList[i] = data;

            const bufferTextureCopy = new nativeLib.BufferTextureCopyInstance();
            bufferTextureCopy.buffStride = regions[i].buffStride;
            bufferTextureCopy.buffTexHeight = regions[i].buffTexHeight;
            bufferTextureCopy.texOffset.x = regions[i].texOffset.x;
            bufferTextureCopy.texOffset.y = regions[i].texOffset.y;
            bufferTextureCopy.texOffset.z = regions[i].texOffset.z;
            bufferTextureCopy.texExtent.width = regions[i].texExtent.width;
            bufferTextureCopy.texExtent.height = regions[i].texExtent.height;
            bufferTextureCopy.texExtent.depth = regions[i].texExtent.depth;
            bufferTextureCopy.texSubres.mipLevel = regions[i].texSubres.mipLevel;
            bufferTextureCopy.texSubres.baseArrayLayer = regions[i].texSubres.baseArrayLayer;
            bufferTextureCopy.texSubres.layerCount = regions[i].texSubres.layerCount;
            bufferTextureCopyList.push_back(bufferTextureCopy);
        }
        (this._nativeDevice as any).copyBuffersToTexture(bufferDataList, (texture as WebGPUTexture).nativeTexture, bufferTextureCopyList);
    }

    public copyTextureToBuffers (texture: Texture, buffers: ArrayBufferView[], regions: BufferTextureCopy[]): void {
        // const bufferDataList: Uint8Array[] = [];
        // const bufferTextureCopyList = new nativeLib.BufferTextureCopyList();
        // for (let i = 0; i < buffers.length; i++) {
        //     let data;
        //     let rawBuffer;
        //     if ('buffer' in buffers[i]) {
        //         // es-lint as any
        //         data = new Uint8Array((buffers[i] as any).buffer, (buffers[i] as any).byteOffset, (buffers[i] as any).byteLength);
        //     } else {
        //         rawBuffer = buffers[i];
        //         data = new Uint8Array(rawBuffer);
        //     }
        //     bufferDataList[i] = data;

        //     const bufferTextureCopy = new nativeLib.BufferTextureCopyInstance();
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
        // (this._nativeDevice as any).copyTextureToBuffers((texture as WebGPUTexture).nativeTexture, bufferDataList, bufferTextureCopyList);
        console.log('copy tex to buff not impled!');
    }

    public copyTexImagesToTexture (texImages: TexImageSource[], texture: Texture, regions: BufferTextureCopy[]): void {
        //assert('copyTexImagesToTexture not impled!');
        const buffers: Uint8Array[] = [];
        for (let i = 0; i < regions.length; i++) {
            if ('getContext' in texImages[i]) {
                const canvasElem = texImages[i] as HTMLCanvasElement;
                const imageData = canvasElem.getContext('2d')?.getImageData(0, 0, texImages[i].width, texImages[i].height);
                const buff = imageData!.data.buffer;
                let data;
                let rawBuffer;
                if ('buffer' in buff) {
                    // es-lint as any
                    data = new Uint8Array((buff as any).buffer, (buff as any).byteOffset, (buff as any).byteLength);
                } else {
                    rawBuffer = buff;
                    data = new Uint8Array(rawBuffer);
                }
                buffers[i] = data;
            } else if (texImages[i] instanceof HTMLImageElement) {
                const img = texImages[i] as HTMLImageElement;
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0);
                const imageData = ctx?.getImageData(0, 0, img.width, img.height);
                const buff = imageData!.data.buffer;
                let data;
                let rawBuffer;
                if ('buffer' in buff) {
                    // es-lint as any
                    data = new Uint8Array((buff as any).buffer, (buff as any).byteOffset, (buff as any).byteLength);
                } else {
                    rawBuffer = buff;
                    data = new Uint8Array(rawBuffer);
                }
                buffers[i] = data;
            } else {
                console.log('imageBmp copy not impled!');
            }
        }

        const bufferTextureCopyList = new nativeLib.BufferTextureCopyList();
        for (let i = 0; i < regions.length; i++) {
            const bufferTextureCopy = new nativeLib.BufferTextureCopyInstance();
            bufferTextureCopy.buffStride = regions[i].buffStride;
            bufferTextureCopy.buffTexHeight = regions[i].buffTexHeight;
            bufferTextureCopy.texOffset.x = regions[i].texOffset.x;
            bufferTextureCopy.texOffset.y = regions[i].texOffset.y;
            bufferTextureCopy.texOffset.z = regions[i].texOffset.z;
            bufferTextureCopy.texExtent.width = regions[i].texExtent.width;
            bufferTextureCopy.texExtent.height = regions[i].texExtent.height;
            bufferTextureCopy.texExtent.depth = regions[i].texExtent.depth;
            bufferTextureCopy.texSubres.mipLevel = regions[i].texSubres.mipLevel;
            bufferTextureCopy.texSubres.baseArrayLayer = regions[i].texSubres.baseArrayLayer;
            bufferTextureCopy.texSubres.layerCount = regions[i].texSubres.layerCount;
            bufferTextureCopyList.push_back(bufferTextureCopy);
        }

        (this._nativeDevice as any).copyBuffersToTexture(buffers, (texture as WebGPUTexture).nativeTexture, bufferTextureCopyList);
    }

    // deprecated
    public copyFramebufferToBuffer (srcFramebuffer: Framebuffer, dstBuffer: ArrayBuffer, regions: BufferTextureCopy[]): void {
        console.log('copyFramebufferToBuffer not impled!');
        // assert('copyTexImagesToTexture not impled!');
        // this._nativeDevice?.copyTextureToBuffers(srcFramebuffer, dstBuffer, regions);
    }
}
