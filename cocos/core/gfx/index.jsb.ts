/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

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

declare const gfx: any;

import * as Defines from './define';
import { legacyCC } from '../global-exports';
import { PipelineState } from './pipeline-state.jsb';

export * from './define';
export * from './define-class';
export * from './pipeline-state.jsb';
export { DeviceInfo, BindingMappingInfo } from './device';
export {TextureInfo } from './texture';
export { ShaderStage, UniformSampler, UniformBlock, Uniform, ShaderInfo } from './shader';
export { DRAW_INFO_SIZE, BufferInfo, BufferViewInfo, DrawInfo, IndirectBuffer } from './buffer';
export { ColorAttachment, DepthStencilAttachment, SubPassInfo, RenderPassInfo } from './render-pass';
export { SamplerInfo } from './sampler';
export { DESCRIPTOR_BUFFER_TYPE, DESCRIPTOR_SAMPLER_TYPE, DescriptorSetInfo } from './descriptor-set';
export { DescriptorSetLayoutInfo, DescriptorSetLayoutBinding } from './descriptor-set-layout';
export { CommandBufferInfo } from './command-buffer';
export { FramebufferInfo } from './framebuffer';
export { PipelineLayoutInfo } from './pipeline-layout';
export { FenceInfo } from './fence';
export { QueueInfo } from './queue';
export { InputAssemblerInfo } from './input-assembler';

export const TextureViewInfo = gfx.TextureViewInfo;
export const Texture = gfx.Texture;
export const Device = gfx.Device;
export const Shader = gfx.Shader;
export const Attribute = gfx.Attribute;
export const InputAssembler = gfx.InputAssembler;
export const Buffer = gfx.Buffer;
export const Sampler = gfx.Sampler;
export const Fence = gfx.Fence
export const RenderPass = gfx.RenderPass
export const Queue = gfx.Queue;
export const PipelineLayout = gfx.PipelineLayout;
export const DescriptorSetLayout = gfx.DescriptorSetLayout;
export const Framebuffer = gfx.Framebuffer;
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
