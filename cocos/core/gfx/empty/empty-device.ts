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

import { debug } from '../../platform/debug';
import { DescriptorSet } from '../base/descriptor-set';
import { DescriptorSetLayout } from '../base/descriptor-set-layout';
import { PipelineLayout } from '../base/pipeline-layout';
import { Buffer } from '../base/buffer';
import { CommandBuffer } from '../base/command-buffer';
import { Device } from '../base/device';
import { Framebuffer } from '../base/framebuffer';
import { InputAssembler } from '../base/input-assembler';
import { PipelineState, PipelineStateInfo } from '../base/pipeline-state';
import { Queue } from '../base/queue';
import { RenderPass } from '../base/render-pass';
import { Sampler } from '../base/states/sampler';
import { Shader } from '../base/shader';
import { Texture } from '../base/texture';
import {
    ShaderInfo,
    QueueInfo, CommandBufferInfo, DescriptorSetInfo, DescriptorSetLayoutInfo, FramebufferInfo, InputAssemblerInfo, PipelineLayoutInfo,
    RenderPassInfo, SamplerInfo, TextureInfo, TextureViewInfo, BufferInfo, BufferViewInfo, DeviceInfo, TextureBarrierInfo, GeneralBarrierInfo,
    QueueType, API, BufferTextureCopy, SwapchainInfo,
} from '../base/define';
import { GeneralBarrier } from '../base/states/general-barrier';
import { TextureBarrier } from '../base/states/texture-barrier';
import { Swapchain } from '../base/swapchain';
import { EmptyDescriptorSet } from './empty-descriptor-set';
import { EmptyBuffer } from './empty-buffer';
import { EmptyCommandBuffer } from './empty-command-buffer';
import { EmptyFramebuffer } from './empty-framebuffer';
import { EmptyInputAssembler } from './empty-input-assembler';
import { EmptyDescriptorSetLayout } from './empty-descriptor-set-layout';
import { EmptyPipelineLayout } from './empty-pipeline-layout';
import { EmptyPipelineState } from './empty-pipeline-state';
import { EmptyQueue } from './empty-queue';
import { EmptyRenderPass } from './empty-render-pass';
import { EmptyShader } from './empty-shader';
import { EmptySwapchain } from './empty-swapchain';
import { EmptyTexture } from './empty-texture';
import { legacyCC } from '../../global-exports';

export class EmptyDevice extends Device {
    public initialize (info: DeviceInfo): boolean {
        this._gfxAPI = API.UNKNOWN;

        this._bindingMappingInfo = info.bindingMappingInfo;

        this._queue = this.createQueue(new QueueInfo(QueueType.GRAPHICS));
        this._cmdBuff = this.createCommandBuffer(new CommandBufferInfo(this._queue));

        debug('Empty device initialized.');

        return true;
    }

    public destroy (): void {
        if (this._queue) {
            this._queue.destroy();
            this._queue = null;
        }

        if (this._cmdBuff) {
            this._cmdBuff.destroy();
            this._cmdBuff = null;
        }
    }

    public flushCommands (cmdBuffs: Readonly<CommandBuffer[]>) {}
    public acquire (swapchains: Readonly<Swapchain[]>) {}
    public present () {}

    public createCommandBuffer (info: Readonly<CommandBufferInfo>): CommandBuffer {
        const cmdBuff = new EmptyCommandBuffer();
        cmdBuff.initialize(info);
        return cmdBuff;
    }

    public createSwapchain (info: Readonly<SwapchainInfo>): Swapchain {
        const swapchain = new EmptySwapchain();
        swapchain.initialize(info);
        return swapchain;
    }

    public createBuffer (info: Readonly<BufferInfo> | Readonly<BufferViewInfo>): Buffer {
        const buffer = new EmptyBuffer();
        buffer.initialize(info);
        return buffer;
    }

    public createTexture (info: Readonly<TextureInfo> | Readonly<TextureViewInfo>): Texture {
        const texture = new EmptyTexture();
        texture.initialize(info);
        return texture;
    }

    public createDescriptorSet (info: Readonly<DescriptorSetInfo>): DescriptorSet {
        const descriptorSet = new EmptyDescriptorSet();
        descriptorSet.initialize(info);
        return descriptorSet;
    }

    public createShader (info: Readonly<ShaderInfo>): Shader {
        const shader = new EmptyShader();
        shader.initialize(info);
        return shader;
    }

    public createInputAssembler (info: Readonly<InputAssemblerInfo>): InputAssembler {
        const inputAssembler = new EmptyInputAssembler();
        inputAssembler.initialize(info);
        return inputAssembler;
    }

    public createRenderPass (info: Readonly<RenderPassInfo>): RenderPass {
        const renderPass = new EmptyRenderPass();
        renderPass.initialize(info);
        return renderPass;
    }

    public createFramebuffer (info: Readonly<FramebufferInfo>): Framebuffer {
        const framebuffer = new EmptyFramebuffer();
        framebuffer.initialize(info);
        return framebuffer;
    }

    public createDescriptorSetLayout (info: Readonly<DescriptorSetLayoutInfo>): DescriptorSetLayout {
        const descriptorSetLayout = new EmptyDescriptorSetLayout();
        descriptorSetLayout.initialize(info);
        return descriptorSetLayout;
    }

    public createPipelineLayout (info: Readonly<PipelineLayoutInfo>): PipelineLayout {
        const pipelineLayout = new EmptyPipelineLayout();
        pipelineLayout.initialize(info);
        return pipelineLayout;
    }

    public createPipelineState (info: Readonly<PipelineStateInfo>): PipelineState {
        const pipelineState = new EmptyPipelineState();
        pipelineState.initialize(info);
        return pipelineState;
    }

    public createQueue (info: Readonly<QueueInfo>): Queue {
        const queue = new EmptyQueue();
        queue.initialize(info);
        return queue;
    }

    public getSampler (info: Readonly<SamplerInfo>): Sampler {
        const hash = Sampler.computeHash(info);
        if (!this._samplers.has(hash)) {
            this._samplers.set(hash, new Sampler(info, hash));
        }
        return this._samplers.get(hash)!;
    }

    public getGeneralBarrier (info: Readonly<GeneralBarrierInfo>) {
        const hash = GeneralBarrier.computeHash(info);
        if (!this._generalBarrierss.has(hash)) {
            this._generalBarrierss.set(hash, new GeneralBarrier(info, hash));
        }
        return this._generalBarrierss.get(hash)!;
    }

    public getTextureBarrier (info: Readonly<TextureBarrierInfo>) {
        const hash = TextureBarrier.computeHash(info);
        if (!this._textureBarriers.has(hash)) {
            this._textureBarriers.set(hash, new TextureBarrier(info, hash));
        }
        return this._textureBarriers.get(hash)!;
    }

    public copyBuffersToTexture (buffers: Readonly<ArrayBufferView[]>, texture: Texture, regions: Readonly<BufferTextureCopy[]>) {}
    public copyTextureToBuffers (texture: Readonly<Texture>, buffers: ArrayBufferView[], regions: Readonly<BufferTextureCopy[]>) {}
    public copyTexImagesToTexture (texImages: Readonly<TexImageSource[]>, texture: Texture, regions: Readonly<BufferTextureCopy[]>) {}
}

legacyCC.EmptyDevice = EmptyDevice;
