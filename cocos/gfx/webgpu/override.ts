/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable import/no-mutable-exports */
import { WEBGPU } from 'internal:constants';
import { gfx, promiseForWebGPUInstantiation } from '../../webgpu/instantiated';

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
