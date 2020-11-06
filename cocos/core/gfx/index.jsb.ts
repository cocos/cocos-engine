declare const gfx: any;

import * as Defines from './define';
import { legacyCC } from '../global-exports';
import { PipelineState } from './pipeline-state.jsb';

export * from './define';
export * from './define-class';
export * from './pipeline-state.jsb';

export {TextureInfo } from './texture';
export const TextureViewInfo = gfx.TextureViewInfo;
export const Texture = gfx.Texture;

export const Device = gfx.Device;
export const BindingMappingInfo = gfx.BindingMappingInfo;
// DeviceInfo is different from native defination, so use JS defination instead.
export { DeviceInfo } from './device';

export const Shader = gfx.Shader;
export const ShaderStage = gfx.ShaderStage;
export const Uniform = gfx.Uniform;
export const UniformBlock = gfx.UniformBlock;
export const UniformSampler = gfx.UniformSampler;
export const ShaderInfo = gfx.ShaderInfo;

export const Attribute = gfx.Attribute;
export const InputAssemblerInfo = gfx.InputAssemblerInfo;
export const InputAssembler = gfx.InputAssembler;

export const DrawInfo = gfx.DrawInfo;
export const IndirectBuffer = gfx.IndirectBuffer;
export const Buffer = gfx.Buffer;
export { DRAW_INFO_SIZE, BufferInfo, BufferViewInfo } from './buffer';

export const SamplerInfo = gfx.SamplerInfo;
export const Sampler = gfx.Sampler;

export const FenceInfo = gfx.FenceInfo;
export const Fence = gfx.Fence;

export const ColorAttachment = gfx.ColorAttachment;
export const DepthStencilAttachment = gfx.DepthStencilAttachment;
export const SubPassInfo = gfx.SubPassInfo;
export const RenderPassInfo = gfx.RenderPassInfo;
export const RenderPass = gfx.RenderPass;

export const QueueInfo = gfx.QueueInfo;
export const Queue = gfx.Queue;

export const PipelineLayoutInfo = gfx.PipelineLayoutInfo;
export const PipelineLayout = gfx.PipelineLayout;

export const DescriptorSetLayoutBinding = gfx.DescriptorSetLayoutBinding;
export const DescriptorSetLayoutInfo = gfx.DescriptorSetLayoutInfo;
export const DescriptorSetLayout = gfx.DescriptorSetLayout;
export const DescriptorSetInfo = gfx.DescriptorSetInfo;
export { DESCRIPTOR_BUFFER_TYPE, DESCRIPTOR_SAMPLER_TYPE } from './descriptor-set';

export const FramebufferInfo = gfx.FramebufferInfo;
export const Framebuffer = gfx.Framebuffer;

export const CommandBufferInfo = gfx.CommandBufferInfo;
export const CommandBuffer = gfx.CommandBuffer;

legacyCC.Device = Device;
legacyCC.Buffer = Buffer;
legacyCC.Texture = Texture;
legacyCC.Sampler = Sampler;
legacyCC.Shader = Shader;
legacyCC.InputAssembler = InputAssembler;
legacyCC.RenderPass = RenderPass;
legacyCC.Framebuffer = Framebuffer;
legacyCC.PipelineState = PipelineState;
legacyCC.CommandBuffer = CommandBuffer;
legacyCC.Queue = Queue;

Object.assign(legacyCC, Defines);

export * from './deprecated-3.0.0';
