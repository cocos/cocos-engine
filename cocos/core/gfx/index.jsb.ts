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

declare const gfx: any;

import { legacyCC } from '../global-exports';
import * as defines from './define';
import * as pso from './pipeline-state.jsb';

export * from './descriptor-set';
export * from './buffer';
export * from './command-buffer';
export * from './define';
export * from './device';
export * from './framebuffer';
export * from './input-assembler';
export * from './descriptor-set-layout';
export * from './pipeline-layout';
export * from './queue';
export * from './render-pass';
export * from './sampler';
export * from './shader';
export * from './texture';

const polyfillCC: Record<string, unknown> = Object.assign({}, defines);
polyfillCC.Device = gfx.Device;
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
legacyCC.gfx = polyfillCC;

// TODO: remove these after state info refactor
export const BlendTarget = pso.BlendTarget;
export const BlendState = pso.BlendState;
export const RasterizerState = pso.RasterizerState;
export const DepthStencilState = pso.DepthStencilState;
export const PipelineState = pso.PipelineState;
export const PipelineStateInfo = pso.PipelineStateInfo;

polyfillCC.BlendTarget = pso.BlendTarget;
polyfillCC.BlendState = pso.BlendState;
polyfillCC.RasterizerState = pso.RasterizerState;
polyfillCC.DepthStencilState = pso.DepthStencilState;
polyfillCC.PipelineStateInfo = pso.PipelineStateInfo;
