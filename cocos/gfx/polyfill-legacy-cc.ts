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

import { Buffer } from './base/buffer';
import { CommandBuffer } from './base/command-buffer';
import { Device } from './base/device';
import { Swapchain } from './base/swapchain';
import { Framebuffer } from './base/framebuffer';
import { InputAssembler } from './base/input-assembler';
import { DescriptorSet } from './base/descriptor-set';
import { DescriptorSetLayout } from './base/descriptor-set-layout';
import { PipelineLayout } from './base/pipeline-layout';
import { PipelineState, PipelineStateInfo, RasterizerState, BlendState, BlendTarget, DepthStencilState } from './base/pipeline-state';
import { Queue } from './base/queue';
import { RenderPass } from './base/render-pass';
import { Sampler } from './base/states/sampler';
import { Shader } from './base/shader';
import { Texture } from './base/texture';
import { GeneralBarrier } from './base/states/general-barrier';
import { TextureBarrier } from './base/states/texture-barrier';
import { BufferBarrier } from './base/states/buffer-barrier';
import { cclegacy } from '../core';
import * as defines from './base/define';

const polyfills: Record<string, unknown> = {
    Device,
    Swapchain,
    Buffer,
    Texture,
    Sampler,
    Shader,
    InputAssembler,
    RenderPass,
    Framebuffer,
    DescriptorSet,
    DescriptorSetLayout,
    PipelineLayout,
    PipelineState,
    CommandBuffer,
    Queue,
    GeneralBarrier,
    TextureBarrier,
    BufferBarrier,

    RasterizerState,
    BlendState,
    BlendTarget,
    DepthStencilState,
    PipelineStateInfo,
};

Object.assign(polyfills, defines);
cclegacy.gfx = polyfills;
