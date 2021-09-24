import glslang, { Glslang } from '@webgpu/glslang/dist/web-devel/glslang';/* eslint-disable @typescript-eslint/no-floating-promises */
import { ALIPAY, RUNTIME_BASED, BYTEDANCE, WECHAT, LINKSURE, QTT, COCOSPLAY, HUAWEI } from 'internal:constants';
// import wasmDevice from '@cocos/webgpu/lib/webgpu_wasm';
// import fs from 'fs';
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
import { Shader } from '../base/shader';
import { InputAssembler, DescriptorSet, DescriptorSetLayout, PipelineLayout } from '..';

import { wgpuWasmModule, glslalgWasmModule } from './webgpu-utils';
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
            const adapter = await navigator.gpu.requestAdapter();
            const device = await adapter.requestDevice();
            glslalgWasmModule.glslang = await glslang();
            wgpuWasmModule.preinitializedWebGPUDevice = device;
            device.lost.then((info) => {
                console.error('Device was lost.', info);
                throw new Error('Something bad happened');
            });
            console.log(adapter);
        }
        const launch = (): boolean => {
            this._nativeDevice = wgpuWasmModule.CCWGPUDevice.getInstance();
            wgpuWasmModule.nativeDevice = this._nativeDevice;
            const deviceInfo = {};
            deviceInfo.isAntiAlias = info.isAntialias;
            deviceInfo.windowHandle = 0;
            deviceInfo.width = info.width;
            deviceInfo.height = info.height;
            deviceInfo.pixelRatio = info.devicePixelRatio;

            const bufferOffsets = new wgpuWasmModule.vector_int();
            for (let i = 0; i < info.bindingMappingInfo.bufferOffsets.length; i++) {
                bufferOffsets.push_back(info.bindingMappingInfo.bufferOffsets[i]);
            }

            const samplerOffsets = new wgpuWasmModule.vector_int();
            for (let i = 0; i < info.bindingMappingInfo.samplerOffsets.length; i++) {
                samplerOffsets.push_back(info.bindingMappingInfo.samplerOffsets[i]);
            }

            deviceInfo.bindingMappingInfo = {
                bufferOffsets,
                samplerOffsets,
                flexibleSet: info.bindingMappingInfo.flexibleSet,
            };

            this._nativeDevice?.initialize(deviceInfo);

            const queueInfo = new QueueInfo(QueueType.GRAPHICS);
            this._queue = new WebGPUQueue();
            (this._queue as WebGPUQueue).device = this;
            this._queue.initialize(queueInfo);

            const cmdBufferInfo = new CommandBufferInfo(this._queue, CommandBufferType.PRIMARY);
            this._cmdBuff = new WebGPUCommandBuffer();
            (this._cmdBuff as WebGPUCommandBuffer).device = this;
            this._cmdBuff.initialize(cmdBufferInfo);

            this._caps.uboOffsetAlignment = 4;
            return true;
        };

        const mainEntry:Promise<boolean> = wasmDevice(wgpuWasmModule).then(() => {
            wgpuWasmModule.wasmLoaded = true;
            console.log(wgpuWasmModule);
            return Promise.resolve(getDevice().then(() => launch()));
        });

        return Promise.resolve(mainEntry);
    }

    public destroy (): void {
        this._nativeDevice?.destroy();
        this._nativeDevice?.delete();
    }

    public acquire (swapchains: Swapchain[]): void {
        const swapchainList = new wgpuWasmModule.SwapchainList();
        for (let i = 0; i < swapchains.length; i++) {
            swapchainList.push_back((swapchains[i] as WebGPUSwapchain).nativeSwapchain);
        }
        this._nativeDevice.acquire(swapchainList);
    }

    public present (): void {
        this._nativeDevice?.present();
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
            this._samplers.set(hash, new WebGPUSampler(info));
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
        const framebuffer = new WebGPUFramebuffer(this);
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

    public createGlobalBarrier (info: GlobalBarrierInfo): GlobalBarrier {
        //assert(false, 'createGlobalBarrier not impl!');
    }

    public createTextureBarrier (info: TextureBarrierInfo): TextureBarrier {
        //assert(false, 'createTextureBarrier not impl!');
    }

    public copyBuffersToTexture (buffers: ArrayBufferView[], texture: Texture, regions: BufferTextureCopy[]): void {
        const bufferDataList = new wgpuWasmModule.BufferDataList();
        const bufferTextureCopyList = new wgpuWasmModule.BufferTextureCopyList();
        for (let i = 0; i < buffers.length; i++) {
            bufferDataList.push_back(buffers[i].buffer);

            const bufferTextureCopy = new wgpuWasmModule.BufferTextureCopyInstance();
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
        this._nativeDevice?.copyBuffersToTexture(bufferDataList, (texture as WebGPUTexture).nativeTexture, bufferTextureCopyList);
    }

    public copyTextureToBuffers (texture: Texture, buffers: ArrayBufferView[], regions: BufferTextureCopy[]): void {
        const bufferDataList = new wgpuWasmModule.BufferDataList();
        const bufferTextureCopyList = new wgpuWasmModule.BufferTextureCopyList();
        for (let i = 0; i < buffers.length; i++) {
            bufferDataList.push_back(buffers[i].buffer);

            const bufferTextureCopy = new wgpuWasmModule.BufferTextureCopyInstance();
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
        this._nativeDevice?.copyTextureToBuffers((texture as WebGPUTexture).nativeTexture, bufferDataList, bufferTextureCopyList);
    }

    public copyTexImagesToTexture (texImages: TexImageSource[], texture: Texture, regions: BufferTextureCopy[]): void {
        //assert('copyTexImagesToTexture not impled!');
        console.log('copyTexImagesToTexture not impled!');
    }

    // deprecated
    public copyFramebufferToBuffer (srcFramebuffer: Framebuffer, dstBuffer: ArrayBuffer, regions: BufferTextureCopy[]): void {
        console.log('copyFramebufferToBuffer not impled!');
        // assert('copyTexImagesToTexture not impled!');
        // this._nativeDevice?.copyTextureToBuffers(srcFramebuffer, dstBuffer, regions);
    }
}
