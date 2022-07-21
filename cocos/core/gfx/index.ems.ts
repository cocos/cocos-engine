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

console.log("INDEX REDIRECT");

export * from './base/define';
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
export const Framebuffer = gfx.CCWGPUFrameBuffer;
export const DescriptorSet = gfx.CCWGPUDescriptorSet;
export const DescriptorSetLayout = gfx.CCWGPUDescriptorSetLayout;
export const PipelineLayout = gfx.CCWGPUPipelineLayout;
export const PipelineState = gfx.CCWGPUPipelineState;
export const CommandBuffer = gfx.CCWGPUCommandBuffer;
export const GlobalBarrier = gfx.CCWGPUGlobalBarrier;
export const TextureBarrier = gfx.CCWGPUTextureBarrier;

// TODO: remove these after state info refactor
export const BlendTarget = gfx.BlendTarget;
export const BlendState = gfx.BlendState;
export const RasterizerState = gfx.RasterizerState;
export const DepthStencilState = gfx.DepthStencilState;
export const PipelineStateInfo = gfx.PipelineStateInfo;
// export const Format = gfx.Format;
// export const BufferUsageBit = gfx.BufferUsageBit;
// export const BufferFlagBit = gfx.BufferFlagBit;
// export const MemoryAccessBit = gfx.MemoryAccessBit;
// export const MemoryUsageBit = gfx.MemoryUsageBit;
// export const TextureUsageBit = gfx.TextureUsageBit;
// export const TextureFlagBit = gfx.TextureFlagBit;
// export const SampleCount = gfx.SampleCount;
// export const VsyncMode = gfx.VsyncMode;
// export const Filter = gfx.Filter;
// export const Address = gfx.Address;
// export const ComparisonFunc = gfx.ComparisonFunc;
// export const StencilOp = gfx.StencilOp;
// export const BlendFactor = gfx.BlendFactor;
// export const BlendOp = gfx.BlendOp;
// export const ColorMask = gfx.ColorMask;
// export const ShaderStageFlagBit = gfx.ShaderStageFlagBit;
// export const LoadOp = gfx.LoadOp;
// export const StoreOp = gfx.StoreOp;
// export const ResolveMode = gfx.ResolveMode;
// export const PipelineBindPoint = gfx.PipelineBindPoint;
// export const PrimitiveMode = gfx.PrimitiveMode;
// export const PolygonMode = gfx.PolygonMode;
// export const ShadeModel = gfx.ShadeModel;
// export const CullMode = gfx.CullMode;
// export const DynamicStateFlag = gfx.DynamicStateFlag;
// export const StencilFace = gfx.StencilFace;
// export const DescriptorType = gfx.DescriptorType;
// export const QueueType = gfx.QueueType;
// export const QueryType = gfx.QueryType;
// export const CommandBufferType = gfx.CommandBufferType;
// export const ClearFlagBit = gfx.ClearFlagBit;
// export const TextureType = gfx.TextureType;
// export const Type = gfx.Type;
// export const FormatFeatureBit = gfx.FormatFeatureBit;
// export const GetTypeSize = gfx.GetTypeSize;
// export const API = gfx.API;
// export const Feature = gfx.Feature;
// export const SurfaceTransform = gfx.SurfaceTransform;
export const GeneralBarrierInfo = gfx.GeneralBarrierInfo;
// export const AccessFlagBit = gfx.AccessFlags;
// export const FormatType = gfx.FormatType;
// export const AttributeName = gfx.AttributeName;
export const DRAW_INFO_SIZE = 28;
// export const getTypedArrayConstructor = gfx.getTypedArrayConstructor;

export const Offset = gfx.Offset;
export const Rect = gfx.Rect;
export const Extent = gfx.Extent;
export const TextureSubresLayers = gfx.TextureSubresLayers;
export const TextureSubresRange = gfx.TextureSubresRange;
export const TextureCopy = gfx.TextureCopy;
export const TextureBlit = gfx.TextureBlit;
export const BufferTextureCopy = gfx.BufferTextureCopy;
export const Viewport = gfx.Viewport;
export const Color = gfx.Color;
export const BindingMappingInfo = gfx.BindingMappingInfo;
export const SwapchainInfo = gfx.SwapchainInfo;
export const DeviceInfo = gfx.DeviceInfo;
export const BufferInfo = gfx.BufferInfo;
export const BufferViewInfo = gfx.BufferViewInfo;
export const DrawInfo = gfx.DrawInfo;
export const DispatchInfo = gfx.DispatchInfo;
export const IndirectBuffer = gfx.IndirectBuffer;
export const TextureInfo = gfx.TextureInfo;
export const TextureViewInfo = gfx.TextureViewInfo;
export const SamplerInfo = gfx.SamplerInfo;
export const Uniform = gfx.Uniform;
export const UniformList = gfx.UniformList;
export const UniformBlock = gfx.UniformBlock;
export const UniformSamplerTexture = gfx.UniformSamplerTexture;
export const UniformSampler = gfx.UniformSampler;
export const UniformTexture = gfx.UniformTexture;
export const UniformStorageImage = gfx.UniformStorageImage;
export const UniformStorageBuffer = gfx.UniformStorageBuffer;
export const UniformInputAttachment = gfx.UniformInputAttachment;
// export const ShaderStage = gfx.ShaderStage;
export const Attribute = gfx.Attribute;
export const ShaderInfo = gfx.ShaderInfo;
export const InputAssemblerInfo = gfx.InputAssemblerInfo;
export const ColorAttachment = gfx.ColorAttachment;
export const DepthStencilAttachment = gfx.DepthStencilAttachment;
export const SubpassInfo = gfx.SubpassInfo;
export const SubpassDependency = gfx.SubpassDependency;
export const RenderPassInfo = gfx.RenderPassInfo;
export const GlobalBarrierInfo = gfx.GlobalBarrierInfo;
export const TextureBarrierInfo = gfx.TextureBarrierInfo;
export const FramebufferInfo = gfx.FramebufferInfo;
export const DescriptorSetLayoutBinding = gfx.DescriptorSetLayoutBinding;
export const DescriptorSetLayoutInfo = gfx.DescriptorSetLayoutInfo;
export const DescriptorSetInfo = gfx.DescriptorSetInfo;
export const PipelineLayoutInfo = gfx.PipelineLayoutInfo;
export const InputState = gfx.InputState;
export const CommandBufferInfo = gfx.CommandBufferInfo;
export const QueueInfo = gfx.QueueInfo;
export const QueryPoolInfo = gfx.QueryPoolInfo;
export const MemoryStatus = gfx.MemoryStatus;
export const DynamicStencilStates = gfx.DynamicStencilStates;
export const DynamicStates = gfx.DynamicStates;
// export const DynamicStateFlagBit = gfx.DynamicStateFlagBit;
export const FormatInfo = gfx.FormatInfo;
export const FormatInfos = gfx.getFormatInfos();

// const ub = new UniformBlock();
// ub.members.push(new Uniform());

const originDeviceInitializeFunc = Device.prototype.initialize;
Device.prototype.initialize = function (info: typeof DeviceInfo) {
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

Object.defineProperties(DescriptorSetInfo.prototype, {
    layout: {
        get: function () {
            return this.getDescriptorSetLayout();
        },
        set: function (val: any) {
            this.setDescriptorSetLayout(val);
        }
    },
});

Object.defineProperties(BufferViewInfo.prototype, {
    buffer: {
        get: function () {
            return this.getBuffer();
        },
        set: function (val: any) {
            this.setBuffer(val);
        }
    },
});

Object.defineProperties(TextureViewInfo.prototype, {
    texture: {
        get: function () {
            return this.getTexture();
        },
        set: function (val: any) {
            this.setTexture(val);
        }
    },
});

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
        // const bufferTextureCopy = new gfx.BufferTextureCopy();
        // bufferTextureCopy.buffOffset = regions[i].buffOffset;
        // bufferTextureCopy.buffStride = regions[i].buffStride;
        // bufferTextureCopy.buffTexHeight = regions[i].buffTexHeight;
        // bufferTextureCopy.texOffset.x = regions[i].texOffset.x;
        // bufferTextureCopy.texOffset.y = regions[i].texOffset.y;
        // bufferTextureCopy.texOffset.z = regions[i].texOffset.z;
        // bufferTextureCopy.texExtent.width = regions[i].texExtent.width;
        // bufferTextureCopy.texExtent.height = regions[i].texExtent.height;
        // bufferTextureCopy.texExtent.depth = regions[i].texExtent.depth;
        // bufferTextureCopy.texSubres.mipLevel = regions[i].texSubres.mipLevel;
        // bufferTextureCopy.texSubres.baseArrayLayer = regions[i].texSubres.baseArrayLayer;
        // bufferTextureCopy.texSubres.layerCount = regions[i].texSubres.layerCount;
        bufferTextureCopyList.push_back(regions[i]);
    }

    this.copyBuffersToTextureWithRawCopyList(buffers, texture, bufferTextureCopyList);
};

const oldCreateBuffer = Device.prototype.createBuffer;
Device.prototype.createBuffer = function (info: typeof BufferInfo | typeof BufferViewInfo) {
    if ('buffer' in info) {
        return this.createBufferView(info);
    } else {
        return oldCreateBuffer.call(this, info);
    }
};

const oldCreateTexture = Device.prototype.createTexture;
Device.prototype.createTexture = function (info: typeof TextureInfo | typeof TextureViewInfo) {
    if ('setTexture' in info) {
        return this.createTextureView(info);
    } else {
        return oldCreateTexture.call(this, info);
    }
};

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

// export const DRAW_INFO_SIZE = commonDef.DRAW_INFO_SIZE;

// export const Type = commonDef.Type;
// export const Feature = commonDef.Feature;
// export const Status = commonDef.Status;
// export const API = commonDef.API;
// export const SurfaceTransform = commonDef.SurfaceTransform;
// export const AttributeName = commonDef.AttributeName;
// export const AccessType = commonDef.AccessType;
// export const FormatType = commonDef.FormatType;

// export const GetTypeSize = commonDef.GetTypeSize;
// export const getTypedArrayConstructor = commonDef.getTypedArrayConstructor;

export const WGPU_WASM = true;

polyfillCC.BlendTarget = gfx.BlendTarget;
polyfillCC.BlendState = gfx.BlendState;
polyfillCC.RasterizerState = gfx.RasterizerState;
polyfillCC.DepthStencilState = gfx.DepthStencilState;
polyfillCC.PipelineStateInfo = gfx.PipelineStateInfo;

import './deprecated-3.0.0';

console.log(gfx.Device);
