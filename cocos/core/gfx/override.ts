import { gfx, waitForWebGPUInstantiation } from '../../webgpu/instantiated';

await waitForWebGPUInstantiation();

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
