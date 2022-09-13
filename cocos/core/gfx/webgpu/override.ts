/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable import/no-mutable-exports */
import { WEBGPU } from 'internal:constants';
import { gfx, promiseForWebGPUInstantiation } from '../../../webgpu/instantiated';

export let Device: any;
export let WebGPUDevice: any;
export let Queue: any;
export let Swapchain: any;
export let Buffer: any;
export let Texture: any;
export let Shader: any;
export let Sampler: any;
export let InputAssembler: any;
export let RenderPass: any;
export let Framebuffer: any;
export let DescriptorSet: any;
export let DescriptorSetLayout: any;
export let PipelineLayout: any;
export let PipelineState: any;
export let CommandBuffer: any;
export let GeneralBarrier: any;
export let TextureBarrier: any;
export let BufferBarrier: any;

WEBGPU && promiseForWebGPUInstantiation.then(() => {
    Device = gfx.CCWGPUDevice;
    WebGPUDevice = gfx.CCWGPUDevice;
    Queue = gfx.CCWGPUQueue;
    Swapchain = gfx.CCWGPUSwapchain;
    Buffer = gfx.CCWGPUBuffer;
    Texture = gfx.CCWGPUTexture;
    Shader = gfx.CCWGPUShader;
    Sampler = gfx.CCWGPUSampler;
    InputAssembler = gfx.CCWGPUInputAssembler;
    RenderPass = gfx.CCWGPURenderPass;
    Framebuffer = gfx.CCWGPUFramebuffer;
    DescriptorSet = gfx.CCWGPUDescriptorSet;
    DescriptorSetLayout = gfx.CCWGPUDescriptorSetLayout;
    PipelineLayout = gfx.CCWGPUPipelineLayout;
    PipelineState = gfx.CCWGPUPipelineState;
    CommandBuffer = gfx.CCWGPUCommandBuffer;
    GeneralBarrier = gfx.WGPUGeneralBarrier;
    TextureBarrier = gfx.WGPUTextureBarrier;
    BufferBarrier = gfx.WGPUBufferBarrier;

    // immutable excluded
    [Device, Queue, Swapchain, Buffer, Texture, Shader, InputAssembler, RenderPass, Framebuffer, DescriptorSet,
        DescriptorSetLayout, PipelineState, CommandBuffer].forEach((ele) => {
            const oldDestroy = ele.prototype.destroy;
            ele.prototype.destroy = function () {
                oldDestroy.call(this);
                this.delete();
            };
        });
});
