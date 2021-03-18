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

import { Buffer } from './buffer';
import { CommandBuffer } from './command-buffer';
import { Device } from './device';
import { Framebuffer } from './framebuffer';
import { InputAssembler } from './input-assembler';
import { PipelineState } from './pipeline-state';
import { Queue } from './queue';
import { RenderPass } from './render-pass';
import { Sampler } from './sampler';
import { Shader } from './shader';
import { Texture } from './texture';
import { Address, AttributeName, BlendFactor, BlendOp, BufferAccessBit,
    BufferFlagBit, BufferUsageBit, ClearFlag, ColorMask, CommandBufferType, ComparisonFunc, CullMode, DescriptorType,
    DynamicStateFlagBit, Filter, Format, FormatInfo, FormatInfos, FormatSize, FormatSurfaceSize, FormatType,
    GetTypeSize, LoadOp, MAX_ATTACHMENTS, MemoryStatus, MemoryUsageBit, Obj, ObjectType, PipelineBindPoint, PolygonMode,
    PrimitiveMode, QueueType, SampleCount, ShadeModel, ShaderStageFlagBit, StencilFace, StencilOp, StoreOp,
    TextureFlagBit, TextureLayout, TextureType,
    TextureUsageBit, Type, getTypedArrayConstructor } from './define';
import { BufferTextureCopy, Color, Extent, Offset, Rect, TextureCopy, TextureSubres, Viewport } from './define-class';

export const polyfillCC = { Device,
    Buffer,
    Texture,
    Sampler,
    Shader,
    InputAssembler,
    RenderPass,
    Framebuffer,
    PipelineState,
    CommandBuffer,
    Queue,
    FormatSize,
    FormatSurfaceSize,
    GetTypeSize,
    getTypedArrayConstructor,
    MAX_ATTACHMENTS,
    ObjectType,
    Obj,
    AttributeName,
    Type,
    Format,
    BufferUsageBit,
    MemoryUsageBit,
    BufferFlagBit,
    BufferAccessBit,
    PrimitiveMode,
    PolygonMode,
    ShadeModel,
    CullMode,
    ComparisonFunc,
    StencilOp,
    BlendOp,
    BlendFactor,
    ColorMask,
    Filter,
    Address,
    TextureType,
    TextureUsageBit,
    SampleCount,
    TextureFlagBit,
    ShaderStageFlagBit,
    DescriptorType,
    CommandBufferType,
    LoadOp,
    StoreOp,
    TextureLayout,
    PipelineBindPoint,
    DynamicStateFlagBit,
    StencilFace,
    QueueType,
    Rect,
    Viewport,
    Color,
    ClearFlag,
    Offset,
    Extent,
    TextureSubres,
    TextureCopy,
    BufferTextureCopy,
    FormatType,
    FormatInfo,
    MemoryStatus,
    FormatInfos };
