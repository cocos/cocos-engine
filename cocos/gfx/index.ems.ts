/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

/**
 * @packageDocumentation
 * @module gfx
 */

import { cclegacy } from '../core';
import { gfx, webgpuAdapter } from '../webgpu/instantiated';

import './deprecated-3.0.0';

export { BlendState, PipelineStateInfo, RasterizerState, DepthStencilState, BlendTarget } from './base/pipeline-state'
export * from './base/define';
export * from './device-manager';


const polyfillCC: Record<string, unknown> = { ...gfx };
polyfillCC.Device = gfx.CCWGPUDevice;
polyfillCC.Swapchain = gfx.CCWGPUSwapchain;
polyfillCC.Buffer = gfx.CCWGPUBuffer;
polyfillCC.Texture = gfx.CCWGPUTexture;
polyfillCC.Sampler = gfx.CCWGPUSampler;
polyfillCC.Shader = gfx.CCWGPUShader;
polyfillCC.InputAssembler = gfx.CCWGPUInputAssembler;
polyfillCC.RenderPass = gfx.CCWGPURenderPass;
polyfillCC.Framebuffer = gfx.CCWGPUFramebuffer;
polyfillCC.DescriptorSet = gfx.CCWGPUDescriptorSet;
polyfillCC.DescriptorSetLayout = gfx.CCWGPUDescriptorSetLayout;
polyfillCC.PipelineLayout = gfx.CCWGPUPipelineLayout;
polyfillCC.PipelineState = gfx.CCWGPUPipelineState;
polyfillCC.CommandBuffer = gfx.CCWGPUCommandBuffer;
polyfillCC.Queue = gfx.CCWGPUQueue;
cclegacy.gfx = polyfillCC;

export * from './webgpu/override';
export * from './webgpu/webgpu-define'

export const WGPU_WASM = true;

console.log(gfx.Device);
