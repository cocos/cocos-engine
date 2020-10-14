declare const gfx: any;

import { GFXCommandBuffer } from './command-buffer';
import * as GFXDefines from './define';
import { GFXFramebuffer } from './framebuffer';
import { legacyCC } from '../global-exports';

export * from './descriptor-set';
export * from './command-buffer';
export * from './define';
export * from './framebuffer';
export * from './descriptor-set-layout';
export * from './pipeline-layout';

export const GFXRasterizerState = gfx.RasterizerState;
export const GFXDepthStencilState = gfx.DepthStencilState;
export const GFXBlendTarget = gfx.BlendTarget;
export const GFXBlendState = gfx.BlendState;
export const GFXPipelineState = gfx.PipelineState;
export const GFXPipelineStateInfo = gfx.PipelineStateInfo;
export const GFXInputState = gfx.InputState;
export const GFXTextureInfo = gfx.TextureInfo;
export const GFXTextureViewInfo = gfx.TextureViewInfo;
export const GFXTexture = gfx.Texture;

export const GFXDevice = gfx.Device;
export const GFXBindingMappingInfo = gfx.BindingMappingInfo;
// GFXDeviceInfo is different from native defination, so use JS defination instead.
export { GFXDeviceInfo } from './device';

export const GFXShader = gfx.Shader;
export const GFXShaderStage = gfx.ShaderStage;
export const GFXUniform = gfx.Uniform;
export const GFXUniformBlock = gfx.UniformBlock;
export const GFXUniformSampler = gfx.UniformSampler;
export const GFXShaderInfo = gfx.ShaderInfo;

export const GFXAttribute = gfx.Attribute;
export const GFXInputAssemblerInfo = gfx.InputAssemblerInfo;
export const GFXInputAssembler = gfx.InputAssembler;

export const GFXDrawInfo = gfx.DrawInfo;
export const GFXIndirectBuffer = gfx.IndirectBuffer;
export const GFXBufferInfo = gfx.BufferInfo;
export const GFXBufferViewInfo = gfx.BufferViewInfo;
export const GFXBuffer = gfx.Buffer;
export { GFX_DRAW_INFO_SIZE } from './buffer';

export const GFXSamplerInfo = gfx.SamplerInfo;
export const GFXSampler = gfx.Sampler;

export const GFXRect = gfx.Rect;
export const GFXViewport = gfx.Viewport
export const GFXColor = gfx.Color;
export const GFXOffset = gfx.Offset;
export const GFXExtent = gfx.Extent;
export const GFXTextureSubres = gfx.TextureSubres;
export const GFXTextureCopy = gfx.TextureCopy;
export const GFXBufferTextureCopy = gfx.BufferTextureCopy;

export const GFXFenceInfo = gfx.FenceInfo;
export const GFXFence = gfx.Fence;

export const GFXColorAttachment = gfx.ColorAttachment;
export const GFXDepthStencilAttachment = gfx.DepthStencilAttachment;
export const GFXSubPassInfo = gfx.SubPassInfo;
export const GFXRenderPassInfo = gfx.RenderPassInfo;
export const GFXRenderPass = gfx.RenderPass;

export const GFXQueueInfo = gfx.QueueInfo;
export const GFXQueue = gfx.Queue;

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

Object.assign(legacyCC, GFXDefines);
