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
 * @hidden
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
import { legacyCC } from '../global-exports';
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

    RasterizerState,
    BlendState,
    BlendTarget,
    DepthStencilState,
    PipelineStateInfo,
};

Object.assign(polyfills, defines);
legacyCC.gfx = polyfills;
