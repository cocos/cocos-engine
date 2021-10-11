/* eslint-disable @typescript-eslint/no-floating-promises */
import { ALIPAY, RUNTIME_BASED, BYTEDANCE, WECHAT, LINKSURE, QTT, COCOSPLAY, HUAWEI } from 'internal:constants';
// import wasmDevice from '@cocos/webgpu/lib/webgpu_wasm';
// import fs from 'fs';
import { resolve } from 'path/posix';
import { Device } from '../base/device';
import {
    DeviceInfo, RenderPassInfo, SwapchainInfo, SampleCount, FramebufferInfo, BufferTextureCopy,
    SamplerInfo, DescriptorSetInfo, DescriptorSetLayoutInfo,
} from '../base/define';
import { RenderPass } from '../base/render-pass';
import { Sampler } from '../base/states/sampler';
import { Swapchain } from '../base/swapchain';
import { Buffer } from '../base/buffer';
import { DescriptorSet, DescriptorSetLayout } from '..';

import { wgpuWasmModule } from './webgpu-utils';
import { WebGPURenderPass } from './webgpu-render-pass';
import { WebGPUFramebuffer } from './webgpu-framebuffer';
import { WebGPUSwapchain } from './webgpu-swapchain';
import { WebGPUSampler } from './webgpu-sampler';
import { WebGPUTexture } from './webgpu-texture';
import { WebGPUBuffer } from './webgpu-buffer';
import { WebGPUDescriptorSet } from './webgpu-descriptor-set';
import { WebGPUDescriptorSetLayout } from './webgpu-descriptor-set-layout';

export class WebGPUDevice extends Device {
    private _nativeDevice = undefined;

    get nativeDevice () {
        return this._nativeDevice;
    }

    public initialize (info: DeviceInfo): Promise<boolean> {
        async function getDevice () {
            const adapter = await navigator.gpu.requestAdapter();
            const device = await adapter.requestDevice();
            wgpuWasmModule.preinitializedWebGPUDevice = device;
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
            return true;
        };

        function init (): Promise<boolean> {
            const poll = (resolve) => {
                if (wgpuWasmModule.wasmLoaded) {
                    return resolve(getDevice().then(() => launch()));
                } else {
                    setTimeout((_) => {
                        poll(resolve);
                    }, 30);
                }
            };

            return new Promise(poll);
        }

        return init().then(() => true);
    }

    public destroy (): void {
        this._nativeDevice?.destroy();
        this._nativeDevice?.delete();
    }

    public resize (width: number, height: number): void {
        this._nativeDevice?.resize(width, height);
    }

    public acquire (swapchains: Swapchain[]): void {

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
        this._nativeDevice?.flushCommands(cmdBuffs);
    }

    public createCommandBuffer (info: CommandBufferInfo): CommandBuffer {
        this._nativeDevice?.createCommandBuffer(info);
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
        this._nativeDevice?.createShader(info);
    }

    public createInputAssembler (info: InputAssemblerInfo): InputAssembler {
        this._nativeDevice?.createInputAssembler(info);
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
        this._nativeDevice?.createPipelineLayout(info);
    }

    public createPipelineState (info: PipelineStateInfo): PipelineState {
        this._nativeDevice?.createPipelineState(info);
    }

    public createQueue (info: QueueInfo): Queue {
        this._nativeDevice?.createQueue(info);
    }

    public createGlobalBarrier (info: GlobalBarrierInfo): GlobalBarrier {
        this._nativeDevice?.createGlobalBarrier(info);
    }

    public createTextureBarrier (info: TextureBarrierInfo): TextureBarrier {
        this._nativeDevice?.createTextureBarrier(info);
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

    }

    // deprecated
    public copyFramebufferToBuffer (srcFramebuffer: Framebuffer, dstBuffer: ArrayBuffer, regions: BufferTextureCopy[]): void {
        // this._nativeDevice?.copyTextureToBuffers(srcFramebuffer, dstBuffer, regions);
    }
}
