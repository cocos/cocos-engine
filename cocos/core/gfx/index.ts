/**
 * @packageDocumentation
 * @module gfx
 */

import { GFXBuffer } from './buffer';
import { GFXCommandBuffer } from './command-buffer';
import { GFXDevice } from './device';
import { GFXFramebuffer } from './framebuffer';
import { GFXInputAssembler } from './input-assembler';
import { GFXPipelineState } from './pipeline-state';
import { GFXQueue } from './queue';
import { GFXRenderPass } from './render-pass';
import { GFXSampler } from './sampler';
import { GFXShader } from './shader';
import { GFXTexture } from './texture';
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

legacyCC.GFXDevice = GFXDevice;
legacyCC.GFXBuffer = GFXBuffer;
legacyCC.GFXTexture = GFXTexture;
legacyCC.GFXSampler = GFXSampler;
legacyCC.GFXShader = GFXShader;
legacyCC.GFXInputAssembler = GFXInputAssembler;
legacyCC.GFXRenderPass = GFXRenderPass;
legacyCC.GFXFramebuffer = GFXFramebuffer;
legacyCC.GFXPipelineState = GFXPipelineState;
legacyCC.GFXCommandBuffer = GFXCommandBuffer;
legacyCC.GFXQueue = GFXQueue;

import { GFXFormatSize,GFXFormatSurfaceSize,GFXGetTypeSize,getTypedArrayConstructor,GFX_MAX_ATTACHMENTS,
    GFXObjectType,GFXObject,GFXAttributeName,GFXType,GFXFormat,GFXBufferUsageBit,GFXMemoryUsageBit,GFXBufferFlagBit,
    GFXBufferAccessBit,GFXPrimitiveMode,GFXPolygonMode,GFXShadeModel,GFXCullMode,GFXComparisonFunc,GFXStencilOp,GFXBlendOp,
    GFXBlendFactor,GFXColorMask,GFXFilter,GFXAddress,GFXTextureType,GFXTextureUsageBit,GFXSampleCount,GFXTextureFlagBit,GFXShaderStageFlagBit,
    GFXDescriptorType,GFXCommandBufferType,GFXLoadOp,GFXStoreOp,GFXTextureLayout,GFXPipelineBindPoint,GFXDynamicStateFlagBit,GFXStencilFace,
    GFXQueueType,GFXClearFlag,GFXFormatType,
    GFXFormatInfo,GFXMemoryStatus,GFXFormatInfos } from './define';
import { GFXRect, GFXViewport, GFXColor, GFXOffset, GFXExtent, GFXTextureSubres, GFXTextureCopy, GFXBufferTextureCopy } from './define-class';
Object.assign(legacyCC, {GFXFormatSize,GFXFormatSurfaceSize,GFXGetTypeSize,getTypedArrayConstructor,GFX_MAX_ATTACHMENTS,
    GFXObjectType,GFXObject,GFXAttributeName,GFXType,GFXFormat,GFXBufferUsageBit,GFXMemoryUsageBit,GFXBufferFlagBit,
    GFXBufferAccessBit,GFXPrimitiveMode,GFXPolygonMode,GFXShadeModel,GFXCullMode,GFXComparisonFunc,GFXStencilOp,GFXBlendOp,
    GFXBlendFactor,GFXColorMask,GFXFilter,GFXAddress,GFXTextureType,GFXTextureUsageBit,GFXSampleCount,GFXTextureFlagBit,GFXShaderStageFlagBit,
    GFXDescriptorType,GFXCommandBufferType,GFXLoadOp,GFXStoreOp,GFXTextureLayout,GFXPipelineBindPoint,GFXDynamicStateFlagBit,GFXStencilFace,
    GFXQueueType,GFXRect,GFXViewport,GFXColor,GFXClearFlag,GFXOffset,GFXExtent,GFXTextureSubres,GFXTextureCopy,GFXBufferTextureCopy,GFXFormatType,
    GFXFormatInfo,GFXMemoryStatus,GFXFormatInfos});
