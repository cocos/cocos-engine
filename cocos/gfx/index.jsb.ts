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

declare const gfx: any;

import { cclegacy } from '../core';
import * as defines from './base/define';
import * as pso from './base/pipeline-state';
import type { DescriptorSet as JsbDescriptorSet } from './base/descriptor-set';
import type { Buffer as JsbBuffer } from './base/buffer';
import type { CommandBuffer as JsbCommandBuffer } from './base/command-buffer';
import type { Device as JsbDevice } from './base/device';
import type { Swapchain as JsbSwapchain } from './base/swapchain';
import type { Framebuffer as JsbFramebuffer } from './base/framebuffer'
import type { InputAssembler as JsbInputAssembler } from './base/input-assembler';
import type { DescriptorSetLayout as JsbDescriptorSetLayout } from './base/descriptor-set-layout';
import type { PipelineLayout as JsbPipelineLayout } from './base/pipeline-layout';
import type { PipelineState as JsbPipelineState } from './base/pipeline-state';
import type { Queue as JsbQueue } from './base/queue';
import type { RenderPass as JsbRenderPass } from './base/render-pass';
import type { Shader as JsbShader } from './base/shader';
import type { Texture as JsbTexture } from './base/texture';
import type { Sampler as JsbSampler } from './base/states/sampler';
import type { GeneralBarrier as JsbGeneralBarrier } from './base/states/general-barrier';
import type { TextureBarrier as JsbTextureBarrier } from './base/states/texture-barrier';

export * from './base/pipeline-state'
export * from './base/define';
export * from './device-manager';

export const DescriptorSet: typeof JsbDescriptorSet = gfx.DescriptorSet;
export type DescriptorSet = JsbDescriptorSet;

export const Buffer: typeof JsbBuffer = gfx.Buffer;
export type Buffer = JsbBuffer;

export const CommandBuffer: typeof JsbCommandBuffer = gfx.CommandBuffer;
export type CommandBuffer = JsbCommandBuffer;

export const Device: typeof JsbDevice = gfx.Device;
export type Device = JsbDevice;

export const Swapchain: typeof JsbSwapchain = gfx.Swapchain;
export type Swapchain = JsbSwapchain;

export const Framebuffer: typeof JsbFramebuffer = gfx.Framebuffer;
export type Framebuffer = JsbFramebuffer;

export const InputAssembler: typeof JsbInputAssembler = gfx.InputAssembler;
export type InputAssembler = JsbInputAssembler;

export const DescriptorSetLayout: typeof JsbDescriptorSetLayout = gfx.DescriptorSetLayout;
export type DescriptorSetLayout = JsbDescriptorSetLayout;

export const PipelineLayout: typeof JsbPipelineLayout = gfx.PipelineLayout;
export type PipelineLayout = JsbPipelineLayout;

export const PipelineState: typeof JsbPipelineState = gfx.PipelineState;
export type PipelineState = JsbPipelineState;

export const Queue: typeof JsbQueue = gfx.Queue;
export type Queue = JsbQueue;

export const RenderPass: typeof JsbRenderPass = gfx.RenderPass;
export type RenderPass = JsbRenderPass;

export const Shader: typeof JsbShader = gfx.Shader;
export type Shader = JsbShader;

export const Texture: typeof JsbTexture = gfx.Texture;
export type Texture = JsbTexture;

export const Sampler: typeof JsbSampler = gfx.Sampler;
export type Sampler = JsbSampler;

export const GeneralBarrier: typeof JsbGeneralBarrier = gfx.GeneralBarrier;
export type GeneralBarrier = JsbGeneralBarrier;

export const TextureBarrier: typeof JsbTextureBarrier = gfx.TextureBarrier;
export type TextureBarrier = JsbTextureBarrier;


const polyfillCC: Record<string, unknown> = Object.assign({}, defines);
polyfillCC.GFXObject = gfx.GFXObject;
polyfillCC.Device = gfx.Device;
polyfillCC.Swapchain = gfx.Swapchain;
polyfillCC.Buffer = gfx.Buffer;
polyfillCC.Texture = gfx.Texture;
polyfillCC.Sampler = gfx.Sampler;
polyfillCC.Shader = gfx.Shader;
polyfillCC.InputAssembler = gfx.InputAssembler;
polyfillCC.RenderPass = gfx.RenderPass;
polyfillCC.Framebuffer = gfx.Framebuffer;
polyfillCC.DescriptorSet = gfx.DescriptorSet;
polyfillCC.DescriptorSetLayout = gfx.DescriptorSetLayout;
polyfillCC.PipelineLayout = gfx.PipelineLayout;
polyfillCC.PipelineState = gfx.PipelineState;
polyfillCC.CommandBuffer = gfx.CommandBuffer;
polyfillCC.Queue = gfx.Queue;
polyfillCC.GeneralBarrier = gfx.GeneralBarrier;
polyfillCC.TextureBarrier = gfx.TextureBarrier;

cclegacy.gfx = polyfillCC;

polyfillCC.BlendTarget = pso.BlendTarget;
polyfillCC.BlendState = pso.BlendState;
polyfillCC.RasterizerState = pso.RasterizerState;
polyfillCC.DepthStencilState = pso.DepthStencilState;
polyfillCC.PipelineStateInfo = pso.PipelineStateInfo;

import './deprecated-3.0.0';
