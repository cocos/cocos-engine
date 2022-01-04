/* eslint-disable max-len */
/* eslint-disable no-empty */
/* eslint-disable new-cap */
/* eslint-disable dot-notation */
import glslang from '@webgpu/glslang/dist/web-devel/glslang';/* eslint-disable @typescript-eslint/no-floating-promises */
import { Device } from '../base/device';
import {
    DeviceInfo, RenderPassInfo, SwapchainInfo, SampleCount, FramebufferInfo, BufferTextureCopy,
    SamplerInfo, DescriptorSetInfo, DescriptorSetLayoutInfo, PipelineLayoutInfo, ShaderInfo,
    InputAssemblerInfo, CommandBufferInfo, QueueInfo, QueueType, CommandBufferType, FormatInfos,
    BufferUsageBit, MemoryUsageBit, Format, Attribute, ShaderStage, ShaderStageFlagBit, UniformSamplerTexture,
    Type, TextureFlagBit, TextureBlit, TextureSubresLayers, Filter, TextureType, TextureUsageBit,
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
import { Queue } from '../base/queue';
import { WebGPUQueue } from './webgpu-queue';
import wasmDevice from './lib/webgpu_wasm.js';
import { mipMapVert, mipmapFrag, genMipmap, MipmapPipelineCache, WebGPUDeviceManager } from './webgpu-commands';
import { quadIn } from '../../animation/easing';
import { attr } from '../../data/utils/attribute';
import { murmurhash2_32_gc } from '../..';

function getChromeVersion () {
    const raw = /Chrom(e|ium)\/([0-9]+)\./.exec(navigator.userAgent);

    return raw ? parseInt(raw[2], 10) : false;
}

// if (EDITOR || PREVIEW || HTML5) {
//     fetch('http://127.0.0.1://webgpu.wasm');
// }
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
            WebGPUDeviceManager.setInstance(this);

            return true;
        };

        function mainEntry (): Promise<boolean> {
            const poll = (resolve) => {
                if (nativeLib.wasmLoaded) {
                    wasmDevice(nativeLib).then(() => {
                        nativeLib.wasmLoaded = true;
                        console.log(nativeLib);
                        return getDevice().then(() => {
                            launch();
                            resolve();
                        });
                    });
                } else {
                    setTimeout((_) => {
                        poll(resolve);
                    }, 30);
                }
            };

            return new Promise(poll);
        }

        return mainEntry();
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
        console.log(bufferTextureCopyList.length);
        (this._nativeDevice as any).copyBuffersToTexture(bufferDataList, (texture as WebGPUTexture).nativeTexture, bufferTextureCopyList);
    }

    public copyTextureToBuffers (texture: Texture, buffers: ArrayBufferView[], regions: BufferTextureCopy[]) {
        console.log('copyTextureToBuffers not fully implemented for sync issue on native webgpu.');

        // const bufferTextureCopyList = new nativeLib.BufferTextureCopyList();
        // for (let i = 0; i < regions.length; i++) {
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

        // (this._nativeDevice as any).copyTextureToBuffers((texture as WebGPUTexture).nativeTexture, bufferTextureCopyList);
        // while (!(this._nativeDevice as any).copyProgressDone()) {

        // }
        // buffers = (this._nativeDevice as any).getResultBuffer();
        // console.log(buffers);
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

        if (texture.flags & TextureFlagBit.GEN_MIPMAP) {
            const textureInfo = new TextureInfo(
                TextureType.TEX2D, TextureUsageBit.SAMPLED | TextureUsageBit.TRANSFER_DST,
                texture.format,
                texture.width,
                texture.height,
                TextureFlagBit.NONE,
                1, 1, SampleCount.ONE, 1,
            );

            const hashStr = `${textureInfo.type}-${textureInfo.format}-${textureInfo.width}-${textureInfo.height}`;
            const hash = murmurhash2_32_gc(hashStr, 999);
            let baseTex;

            if (!MipmapPipelineCache.mipmapTexCache.has(hash)) {
                baseTex = this.createTexture(textureInfo);
                MipmapPipelineCache.mipmapTexCache.set(hash, baseTex);
            } else {
                baseTex = MipmapPipelineCache.mipmapTexCache.get(hash);
            }

            const bufferTextureCopy = new nativeLib.BufferTextureCopyInstance();
            bufferTextureCopy.buffStride = 0;
            bufferTextureCopy.buffTexHeight = 0;
            bufferTextureCopy.texOffset.x = 0;
            bufferTextureCopy.texOffset.y = 0;
            bufferTextureCopy.texOffset.z = 0;
            bufferTextureCopy.texExtent.width = texture.width;
            bufferTextureCopy.texExtent.height = texture.height;
            bufferTextureCopy.texExtent.depth = 1;
            bufferTextureCopy.texSubres.mipLevel = 0;
            bufferTextureCopy.texSubres.baseArrayLayer = 0;
            bufferTextureCopy.texSubres.layerCount = 1;

            const copyList = new nativeLib.BufferTextureCopyList();
            copyList.push_back(bufferTextureCopy);

            (this._nativeDevice as any).copyBuffersToTexture(buffers, (baseTex as unknown as WebGPUTexture).nativeTexture, copyList);

            const cmdBuff = this._cmdBuff;
            cmdBuff?.begin();
            let tmpTex = baseTex;
            for (let i = 0; i < regions.length; ++i) {
                for (let j = 0; j < texture.levelCount - 1; ++j) {
                    const lodTex = genMipmap(this, tmpTex as unknown as WebGPUTexture);

                    const regionList = new nativeLib.TextureBlitList();
                    const region = new nativeLib.TextureBlit();
                    region.srcSubres.mipLevel = 0;
                    region.srcSubres.baseArrayLayer = 0;
                    region.srcSubres.layerCount = 1;
                    region.srcOffset.x = 0;
                    region.srcOffset.y = 0;
                    region.srcOffset.z = 0;
                    region.srcExtent.width = lodTex.width;
                    region.srcExtent.height = lodTex.height;
                    region.srcExtent.depth = lodTex.depth;

                    region.dstSubres.mipLevel = 1 + j;
                    region.dstSubres.baseArrayLayer = regions[i].texSubres.baseArrayLayer;
                    region.dstSubres.layerCount = 1;
                    region.dstOffset.x = 0;
                    region.dstOffset.y = 0;
                    region.dstOffset.z = 0;
                    region.dstExtent.width = lodTex.width;
                    region.dstExtent.height = lodTex.height;
                    region.dstExtent.depth = lodTex.depth;

                    regionList.push_back(region);

                    const filterStr = Filter[Filter.LINEAR];
                    const filter = nativeLib.Filter[filterStr];

                    (cmdBuff as WebGPUCommandBuffer).nativeCommandBuffer.blitTexture2(
                        (lodTex as WebGPUTexture).nativeTexture,
                        (texture as WebGPUTexture).nativeTexture,
                        regionList,
                        filter,
                    );

                    // (this._mipmapCacheTex as unknown as WebGPUTexture).destroy();
                    tmpTex = lodTex;
                }
            }

            // (this._mipmapCacheTex as unknown as WebGPUTexture).destroy();
            cmdBuff?.end();
            this._queue?.submit([cmdBuff!]);
        }
    }

    // deprecated
    public copyFramebufferToBuffer (srcFramebuffer: Framebuffer, dstBuffer: ArrayBuffer, regions: BufferTextureCopy[]): void {
        console.log('copyFramebufferToBuffer not impled!');
        // assert('copyTexImagesToTexture not impled!');
        // this._nativeDevice?.copyTextureToBuffers(srcFramebuffer, dstBuffer, regions);
    }
}
