/**
 * @packageDocumentation
 * @module gfx
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
import { FormatSize,FormatSurfaceSize,GetTypeSize,getTypedArrayConstructor,MAX_ATTACHMENTS,
    ObjectType,Obj,AttributeName,Type,Format,BufferUsageBit,MemoryUsageBit,BufferFlagBit,
    BufferAccessBit,PrimitiveMode,PolygonMode,ShadeModel,CullMode,ComparisonFunc,StencilOp,BlendOp,
    BlendFactor,ColorMask,Filter,Address,TextureType,TextureUsageBit,SampleCount,TextureFlagBit,ShaderStageFlagBit,
    DescriptorType,CommandBufferType,LoadOp,StoreOp,TextureLayout,PipelineBindPoint,DynamicStateFlagBit,StencilFace,
    QueueType,ClearFlag,FormatType,
    FormatInfo,MemoryStatus,FormatInfos } from './define';
import { Rect, Viewport, Color, Offset, Extent, TextureSubres, TextureCopy, BufferTextureCopy } from './define-class';
import { legacyCC } from '../global-exports';

export * from './descriptor-set';
export * from './buffer';
export * from './command-buffer';
export * from './define';
export * from './define-class';
export * from './device';
export * from './framebuffer';
export * from './input-assembler';
export * from './descriptor-set-layout';
export * from './pipeline-layout';
export * from './pipeline-state';
export * from './fence';
export * from './queue';
export * from './render-pass';
export * from './sampler';
export * from './shader';
export * from './texture';

export const polyfillCC = {Device,Buffer,Texture,Sampler,Shader,InputAssembler,RenderPass,Framebuffer,PipelineState,CommandBuffer,Queue,
    FormatSize,FormatSurfaceSize,GetTypeSize,getTypedArrayConstructor,MAX_ATTACHMENTS,
    ObjectType,Obj,AttributeName,Type,Format,BufferUsageBit,MemoryUsageBit,BufferFlagBit,
    BufferAccessBit,PrimitiveMode,PolygonMode,ShadeModel,CullMode,ComparisonFunc,StencilOp,BlendOp,
    BlendFactor,ColorMask,Filter,Address,TextureType,TextureUsageBit,SampleCount,TextureFlagBit,ShaderStageFlagBit,
    DescriptorType,CommandBufferType,LoadOp,StoreOp,TextureLayout,PipelineBindPoint,DynamicStateFlagBit,StencilFace,
    QueueType,Rect,Viewport,Color,ClearFlag,Offset,Extent,TextureSubres,TextureCopy,BufferTextureCopy,FormatType,
    FormatInfo,MemoryStatus,FormatInfos};
legacyCC.gfx = polyfillCC;

export * from './deprecated-3.0.0';
