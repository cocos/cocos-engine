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
 * @hidden
 */

import { polyfillCC } from './polyfill-legacy-cc';
import { removeProperty, replaceProperty } from '../utils/x-deprecated';
import { legacyCC } from '../global-exports';

import { DESCRIPTOR_BUFFER_TYPE, DESCRIPTOR_SAMPLER_TYPE, DescriptorSetInfo, DescriptorSet } from './descriptor-set';
import { DrawInfo, DRAW_INFO_SIZE, IndirectBuffer, BufferSource, BufferInfo, BufferViewInfo, Buffer } from './buffer';
import { CommandBufferInfo, CommandBuffer } from './command-buffer';
import { MAX_ATTACHMENTS, ObjectType, Obj, AttributeName, Type, Format, BufferUsageBit, BufferUsage, MemoryUsageBit,
    MemoryUsage, BufferFlagBit, BufferFlags, BufferAccessBit, BufferAccess, PrimitiveMode, PolygonMode, ShadeModel,
    CullMode, ComparisonFunc, StencilOp, BlendOp, BlendFactor, ColorMask, Filter, Address, TextureType, TextureUsageBit,
    TextureUsage, SampleCount, TextureFlagBit, TextureFlags, ShaderStageFlagBit, ShaderStageFlags, DescriptorType,
    CommandBufferType, LoadOp, StoreOp, TextureLayout, PipelineBindPoint, DynamicStateFlagBit, DynamicStateFlags,
    StencilFace, QueueType, ClearFlag, FormatType, API, SurfaceTransform, Feature, FormatInfo, MemoryStatus,
    FormatInfos, FormatSize, FormatSurfaceSize } from './define';
import { Rect, Viewport, Color, Offset, Extent, TextureSubres, TextureCopy, BufferTextureCopy } from './define-class';
import { BindingMappingInfo, DeviceInfo, Device } from './device';
import { FramebufferInfo, Framebuffer } from './framebuffer';
import { IAttribute, Attribute, InputAssemblerInfo, InputAssembler } from './input-assembler';
import { DescriptorSetLayoutBinding, DescriptorSetLayoutInfo, DESCRIPTOR_DYNAMIC_TYPE, DescriptorSetLayout } from './descriptor-set-layout';
import { PipelineLayoutInfo, PipelineLayout } from './pipeline-layout';
import { RasterizerState, DepthStencilState, BlendTarget, BlendState, InputState, PipelineStateInfo, PipelineState } from './pipeline-state';
import { FenceInfo, Fence } from './fence';
import { QueueInfo, Queue } from './queue';
import { ColorAttachment, DepthStencilAttachment, SubPassInfo, RenderPassInfo, RenderPass } from './render-pass';
import { SamplerInfo, Sampler } from './sampler';
import { IShaderStage, ShaderStage, IUniform, Uniform, UniformBlock, UniformSampler, ShaderInfo, Shader } from './shader';
import { TextureInfo, TextureViewInfo, Texture } from './texture';

replaceProperty(legacyCC, 'cc', [
    {
        name: 'GFXDynamicState',
        newName: 'DynamicStateFlagBit',
    },
    {
        name: 'GFXBindingType',
        newName: 'DescriptorType',
    },
    {
        name: 'GFXBindingLayout',
        newName: 'DescriptorSet',
    },
]);

removeProperty(CommandBuffer.prototype,  'CommandBuffer.prototype', [
    {
        name: 'bindBindingLayout',
        suggest: 'Use `bindDescriptorSet` instead',
    },
]);

// Deprecate GFX prefix APIs

export type GFXBufferSource = BufferSource;
export type GFXBufferUsage = BufferUsage;
export type GFXMemoryUsage = MemoryUsage;
export type GFXBufferFlags = BufferFlags;
export type GFXBufferAccess = BufferAccess;
export type GFXTextureUsage = TextureUsage;
export type GFXTextureFlags = TextureFlags;
export type GFXShaderStageFlags = ShaderStageFlags;
export type GFXDynamicStateFlags = DynamicStateFlags;
export type IGFXAttribute = IAttribute;
export type IGFXShaderStage = IShaderStage;
export type IGFXUniform = IUniform;

export { DESCRIPTOR_BUFFER_TYPE as GFX_DESCRIPTOR_BUFFER_TYPE };
export { DESCRIPTOR_SAMPLER_TYPE as GFX_DESCRIPTOR_SAMPLER_TYPE };
export { DescriptorSetInfo as GFXDescriptorSetInfo };
export { DescriptorSet as GFXDescriptorSet };
export { DrawInfo as GFXDrawInfo };
export { DRAW_INFO_SIZE as GFX_DRAW_INFO_SIZE };
export { IndirectBuffer as GFXIndirectBuffer };
export { BufferInfo as GFXBufferInfo };
export { BufferViewInfo as GFXBufferViewInfo };
export { Buffer as GFXBuffer };
export { CommandBufferInfo as GFXCommandBufferInfo };
export { CommandBuffer as GFXCommandBuffer };
export { MAX_ATTACHMENTS as GFX_MAX_ATTACHMENTS };
export { ObjectType as GFXObjectType };
export { Obj as GFXObject };
export { AttributeName as GFXAttributeName };
export { Type as GFXType };
export { Format as GFXFormat };
export { BufferUsageBit as GFXBufferUsageBit };
export { MemoryUsageBit as GFXMemoryUsageBit };
export { BufferFlagBit as GFXBufferFlagBit };
export { BufferAccessBit as GFXBufferAccessBit };
export { PrimitiveMode as GFXPrimitiveMode };
export { PolygonMode as GFXPolygonMode };
export { ShadeModel as GFXShadeModel };
export { CullMode as GFXCullMode };
export { ComparisonFunc as GFXComparisonFunc };
export { StencilOp as GFXStencilOp };
export { BlendOp as GFXBlendOp };
export { BlendFactor as GFXBlendFactor };
export { ColorMask as GFXColorMask };
export { Filter as GFXFilter };
export { Address as GFXAddress };
export { TextureType as GFXTextureType };
export { TextureUsageBit as GFXTextureUsageBit };
export { SampleCount as GFXSampleCount };
export { TextureFlagBit as GFXTextureFlagBit };
export { ShaderStageFlagBit as GFXShaderStageFlagBit };
export { DescriptorType as GFXDescriptorType };
export { CommandBufferType as GFXCommandBufferType };
export { LoadOp as GFXLoadOp };
export { StoreOp as GFXStoreOp };
export { TextureLayout as GFXTextureLayout };
export { PipelineBindPoint as GFXPipelineBindPoint };
export { DynamicStateFlagBit as GFXDynamicStateFlagBit };
export { StencilFace as GFXStencilFace };
export { QueueType as GFXQueueType };
export { ClearFlag as GFXClearFlag };
export { FormatType as GFXFormatType };
export { API as GFXAPI };
export { SurfaceTransform as GFXSurfaceTransform };
export { Feature as GFXFeature };
export { FormatInfo as GFXFormatInfo };
export { MemoryStatus as GFXMemoryStatus };
export { FormatInfos as GFXFormatInfos };
export { FormatSize as GFXFormatSize };
export { FormatSurfaceSize as GFXFormatSurfaceSize };
export { Rect as GFXRect };
export { Viewport as GFXViewport };
export { Color as GFXColor };
export { Offset as GFXOffset };
export { Extent as GFXExtent };
export { TextureSubres as GFXTextureSubres };
export { TextureCopy as GFXTextureCopy };
export { BufferTextureCopy as GFXBufferTextureCopy };
export { BindingMappingInfo as GFXBindingMappingInfo };
export { DeviceInfo as GFXDeviceInfo };
export { Device as GFXDevice };
export { FramebufferInfo as GFXFramebufferInfo };
export { Framebuffer as GFXFramebuffer };
export { Attribute as GFXAttribute };
export { InputAssemblerInfo as GFXInputAssemblerInfo };
export { InputAssembler as GFXInputAssembler };
export { DescriptorSetLayoutBinding as GFXDescriptorSetLayoutBinding };
export { DescriptorSetLayoutInfo as GFXDescriptorSetLayoutInfo };
export { DESCRIPTOR_DYNAMIC_TYPE as GFX_DESCRIPTOR_DYNAMIC_TYPE };
export { DescriptorSetLayout as GFXDescriptorSetLayout };
export { PipelineLayoutInfo as GFXPipelineLayoutInfo };
export { PipelineLayout as GFXPipelineLayout };
export { RasterizerState as GFXRasterizerState };
export { DepthStencilState as GFXDepthStencilState };
export { BlendTarget as GFXBlendTarget };
export { BlendState as GFXBlendState };
export { InputState as GFXInputState };
export { PipelineStateInfo as GFXPipelineStateInfo };
export { PipelineState as GFXPipelineState };
export { FenceInfo as GFXFenceInfo };
export { Fence as GFXFence };
export { QueueInfo as GFXQueueInfo };
export { Queue as GFXQueue };
export { ColorAttachment as GFXColorAttachment };
export { DepthStencilAttachment as GFXDepthStencilAttachment };
export { SubPassInfo as GFXSubPassInfo };
export { RenderPassInfo as GFXRenderPassInfo };
export { RenderPass as GFXRenderPass };
export { SamplerInfo as GFXSamplerInfo };
export { Sampler as GFXSampler };
export { ShaderStage as GFXShaderStage };
export { Uniform as GFXUniform };
export { UniformBlock as GFXUniformBlock };
export { UniformSampler as GFXUniformSampler };
export { ShaderInfo as GFXShaderInfo };
export { Shader as GFXShader };
export { TextureInfo as GFXTextureInfo };
export { TextureViewInfo as GFXTextureViewInfo };
export { Texture as GFXTexture };

// Deprecated CC polyfill
const special = {
    // Special replacement
    // DRAW_INFO_SIZE: 'GFX_DRAW_INFO_SIZE',
    MAX_ATTACHMENTS: 'GFX_MAX_ATTACHMENTS',
    Obj: 'GFXObject',

    // Unchanged
    // DESCRIPTOR_BUFFER_TYPE: '',
    // DESCRIPTOR_SAMPLER_TYPE: '',
    getTypedArrayConstructor: '',
    // GFXFormatToWebGLType: '',
    // GFXFormatToWebGLInternalFormat: '',
    // GFXFormatToWebGLFormat: '',
};
for (const api in polyfillCC) {
    let deprecated = special[api];
    if (deprecated === '') {
        continue;
    } else if (deprecated === undefined) {
        deprecated = `GFX${api}`;
    }
    // Deprecation
    replaceProperty(legacyCC, 'cc', [
        {
            name: deprecated,
            newName: api,
            target: legacyCC.gfx,
            targetName: 'cc.gfx',
        },
    ]);
}
