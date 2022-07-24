/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @module gfx
 */

import { legacyCC } from '../global-exports';
import { waitForWebGPUInstantiation, gfx, webgpuAdapter } from '../../webgpu/instantiated'

await waitForWebGPUInstantiation();

export * from './base/descriptor-set';
export * from './base/buffer';
export * from './base/command-buffer';
export * from './base/define';
export * from './base/device';
export * from './base/swapchain';
export * from './base/framebuffer';
export * from './base/input-assembler';
export * from './base/descriptor-set-layout';
export * from './base/pipeline-layout';
export * from './base/pipeline-state';
export * from './base/queue';
export * from './base/render-pass';
export * from './base/states/sampler';
export * from './base/shader';
export * from './base/texture';
export * from './base/states/general-barrier';
export * from './base/states/texture-barrier';
export * from './device-manager';

const polyfillCC: Record<string, unknown> = Object.assign({}, gfx);
polyfillCC.Device = gfx.CCWGPUDevice;
polyfillCC.Swapchain = gfx.CCWGPUSwapchain;
polyfillCC.Buffer = gfx.CCWGPUBuffer;
polyfillCC.Texture = gfx.CCWGPUTexture;
polyfillCC.Sampler = gfx.CCWGPUSampler;
polyfillCC.Shader = gfx.CCWGPUShader;
polyfillCC.InputAssembler = gfx.CCWGPUInputAssembler;
polyfillCC.RenderPass = gfx.CCWGPURenderPass;
polyfillCC.Framebuffer = gfx.CCWGPUFramebuffer;
polyfillCC.DescriptorSet = gfx.CCWGPUDescriptorSet;
polyfillCC.DescriptorSetLayout = gfx.CCWGPUDescriptorSetLayout;
polyfillCC.PipelineLayout = gfx.CCWGPUPipelineLayout;
polyfillCC.PipelineState = gfx.CCWGPUPipelineState;
polyfillCC.CommandBuffer = gfx.CCWGPUCommandBuffer;
polyfillCC.Queue = gfx.CCWGPUQueue;
legacyCC.gfx = polyfillCC;

export const Device = gfx.CCWGPUDevice;
export const WebGPUDevice = gfx.CCWGPUDevice;
export const Queue = gfx.CCWGPUQueue;
export const Swapchain = gfx.CCWGPUSwapchain;
export const Buffer = gfx.CCWGPUBuffer;
export const Texture = gfx.CCWGPUTexture;
export const Shader = gfx.CCWGPUShader;
export const Sampler = gfx.CCWGPUSampler;
export const InputAssembler = gfx.CCWGPUInputAssembler;
export const RenderPass = gfx.CCWGPURenderPass;
export const Framebuffer = gfx.CCWGPUFramebuffer;
export const DescriptorSet = gfx.CCWGPUDescriptorSet;
export const DescriptorSetLayout = gfx.CCWGPUDescriptorSetLayout;
export const PipelineLayout = gfx.CCWGPUPipelineLayout;
export const PipelineState = gfx.CCWGPUPipelineState;
export const CommandBuffer = gfx.CCWGPUCommandBuffer;
export const GeneralBarrier = gfx.WGPUGeneralBarrier;
export const TextureBarrier = gfx.WGPUTextureBarrier;
export const BufferBarrier = gfx.WGPUBufferBarrier;

const originDeviceInitializeFunc = Device.prototype.initialize;
Device.prototype.initialize = function (info: DeviceInfo) {
    const adapter = webgpuAdapter.adapter;
    const device = webgpuAdapter.device;
    gfx['preinitializedWebGPUDevice'] = device;
    device.lost.then((info) => {
        console.error('Device was lost.', info);
        throw new Error('Something bad happened');
    });
    console.log(adapter);

    originDeviceInitializeFunc.call(this, info);

    // const queueInfo = new QueueInfo(QueueType.GRAPHICS);
    // this._queue = new Queue();
    // this._queue.initialize(queueInfo);

    // const cmdBufferInfo = new CommandBufferInfo(this._queue, CommandBufferType.PRIMARY);
    // this._cmdBuff = new WebGPUCommandBuffer();
    // (this._cmdBuff as WebGPUCommandBuffer).device = this;
    // this._cmdBuff.initialize(cmdBufferInfo);

    // this._caps.uboOffsetAlignment = 256;
    // this._caps.clipSpaceMinZ = 0;
    // this._caps.screenSpaceSignY = -1;
    // this._caps.clipSpaceSignY = 1;
    // WebGPUDeviceManager.setInstance(this);

    return true;
}

Object.defineProperties(Swapchain.prototype, {
    colorTexture: {
        get: function () {
            return this.getColorTexture();
        },
        set: function (val: any) {
            this.setColorTexture(val);
        }
    },
    depthStencilTexture: {
        get: function () {
            return this.getDepthStencilTexture();
        },
        set: function (val: any) {
            this.setDepthStencilTexture(val);
        }
    },
});

Object.defineProperty(Device.prototype, 'commandBuffer', {
    get: function () {
        return this.getCommandBuffer();
    }
})

Object.defineProperty(Framebuffer.prototype, 'renderPass', {
    get: function () {
        return this.getRenderPass();
    }
})

const oldBegin = CommandBuffer.prototype.begin;
CommandBuffer.prototype.begin = function (renderpass? : typeof RenderPass, subpass ?: number, framebuffer ?: typeof Framebuffer) {
    if(renderpass === undefined) {
        if(subpass == undefined) {
            if(framebuffer === undefined) {
                return this.begin0()
            } else {
                return this.begin1(renderpass);
            }
        } else {
            return this.begin2(this, renderpass, subpass);
        }
    } else {
        return this.begin3(renderpass, subpass, framebuffer);
    }
}

const oldBindBuffer = DescriptorSet.prototype.bindBuffer;
DescriptorSet.prototype.bindBuffer = function (binding: number, buffer: typeof Buffer, index?: number) {
    if (index === undefined) {
        oldBindBuffer.call(this, binding, buffer, 0);
    } else {
        oldBindBuffer.call(this, binding, buffer, index);
    }
};

const oldBindSampler = DescriptorSet.prototype.bindSampler;
DescriptorSet.prototype.bindSampler = function (binding: number, sampler: typeof Sampler, index?: number) {
    if (index === undefined) {
        oldBindSampler.call(this, binding, sampler, 0);
    } else {
        oldBindSampler.call(this, binding, sampler, index);
    }
};

const oldBindTexture = DescriptorSet.prototype.bindTexture;
DescriptorSet.prototype.bindTexture = function (binding: number, texture: typeof Texture, index?: number) {
    if (index === undefined) {
        oldBindTexture.call(this, binding, texture, 0);
    } else {
        oldBindTexture.call(this, binding, texture, index);
    }
};

const oldUpdateBuffer = Buffer.prototype.update;
Buffer.prototype.update = function (data: BufferSource, size?: number) {
    if (size === undefined) {
        oldUpdateBuffer.call(this, data, data.byteLength);
    } else {
        oldUpdateBuffer.call(this, data, size);
    }
};

Device.prototype.copyTexImagesToTexture = function (texImages: TexImageSource[], texture: typeof Texture, regions: typeof BufferTextureCopy[]) {
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

    const bufferTextureCopyList = new gfx.BufferTextureCopyList();
    for (let i = 0; i < regions.length; i++) {
        const bufferTextureCopy = new gfx.BufferTextureCopy();
        bufferTextureCopy.buffOffset = regions[i].buffOffset;
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
        bufferTextureCopyList.push_back(regions[i]);
    }

    this.copyBuffersToTextureWithRawCopyList(buffers, texture, bufferTextureCopyList);
};

export const WGPU_WASM = true;

import './deprecated-3.0.0';
import { DeviceInfo } from './base/define';

console.log(gfx.Device);
