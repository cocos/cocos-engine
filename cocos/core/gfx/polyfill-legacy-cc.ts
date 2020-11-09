/**
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

export const polyfillCC = { Device, Buffer, Texture, Sampler, Shader, InputAssembler, RenderPass, Framebuffer, PipelineState, CommandBuffer, Queue,
    FormatSize, FormatSurfaceSize, GetTypeSize, getTypedArrayConstructor, MAX_ATTACHMENTS,
    ObjectType, Obj, AttributeName, Type, Format, BufferUsageBit, MemoryUsageBit, BufferFlagBit,
    BufferAccessBit, PrimitiveMode, PolygonMode, ShadeModel, CullMode, ComparisonFunc, StencilOp, BlendOp,
    BlendFactor, ColorMask, Filter, Address, TextureType, TextureUsageBit, SampleCount, TextureFlagBit, ShaderStageFlagBit,
    DescriptorType, CommandBufferType, LoadOp, StoreOp, TextureLayout, PipelineBindPoint, DynamicStateFlagBit, StencilFace,
    QueueType, Rect, Viewport, Color, ClearFlag, Offset, Extent, TextureSubres, TextureCopy, BufferTextureCopy, FormatType,
    FormatInfo, MemoryStatus, FormatInfos };
