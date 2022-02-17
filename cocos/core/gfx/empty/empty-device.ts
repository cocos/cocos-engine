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

    public flushCommands (cmdBuffs: CommandBuffer[]) {}
    public acquire (swapchains: Swapchain[]) {}
    public present () {}

    public createCommandBuffer (info: CommandBufferInfo): CommandBuffer {
        const cmdBuff = new EmptyCommandBuffer();
        cmdBuff.initialize(info);
        return cmdBuff;
    }

    public createSwapchain (info: SwapchainInfo): Swapchain {
        const swapchain = new EmptySwapchain();
        swapchain.initialize(info);
        return swapchain;
    }

    public createBuffer (info: BufferInfo | BufferViewInfo): Buffer {
        const buffer = new EmptyBuffer();
        buffer.initialize(info);
        return buffer;
    }

    public createTexture (info: TextureInfo | TextureViewInfo): Texture {
        const texture = new EmptyTexture();
        texture.initialize(info);
        return texture;
    }

    public createDescriptorSet (info: DescriptorSetInfo): DescriptorSet {
        const descriptorSet = new EmptyDescriptorSet();
        descriptorSet.initialize(info);
        return descriptorSet;
    }

    public createShader (info: ShaderInfo): Shader {
        const shader = new EmptyShader();
        shader.initialize(info);
        return shader;
    }

    public createInputAssembler (info: InputAssemblerInfo): InputAssembler {
        const inputAssembler = new EmptyInputAssembler();
        inputAssembler.initialize(info);
        return inputAssembler;
    }

    public createRenderPass (info: RenderPassInfo): RenderPass {
        const renderPass = new EmptyRenderPass();
        renderPass.initialize(info);
        return renderPass;
    }

    public createFramebuffer (info: FramebufferInfo): Framebuffer {
        const framebuffer = new EmptyFramebuffer();
        framebuffer.initialize(info);
        return framebuffer;
    }

    public createDescriptorSetLayout (info: DescriptorSetLayoutInfo): DescriptorSetLayout {
        const descriptorSetLayout = new EmptyDescriptorSetLayout();
        descriptorSetLayout.initialize(info);
        return descriptorSetLayout;
    }

    public createPipelineLayout (info: PipelineLayoutInfo): PipelineLayout {
        const pipelineLayout = new EmptyPipelineLayout();
        pipelineLayout.initialize(info);
        return pipelineLayout;
    }

    public createPipelineState (info: PipelineStateInfo): PipelineState {
        const pipelineState = new EmptyPipelineState();
        pipelineState.initialize(info);
        return pipelineState;
    }

    public createQueue (info: QueueInfo): Queue {
        const queue = new EmptyQueue();
        queue.initialize(info);
        return queue;
    }

    public getSampler (info: SamplerInfo): Sampler {
        const hash = Sampler.computeHash(info);
        if (!this._samplers.has(hash)) {
            this._samplers.set(hash, new Sampler(info, hash));
        }
        return this._samplers.get(hash)!;
    }

    public getGeneralBarrier (info: GeneralBarrierInfo) {
        const hash = GeneralBarrier.computeHash(info);
        if (!this._generalBarrierss.has(hash)) {
            this._generalBarrierss.set(hash, new GeneralBarrier(info, hash));
        }
        return this._generalBarrierss.get(hash)!;
    }

    public getTextureBarrier (info: TextureBarrierInfo) {
        const hash = TextureBarrier.computeHash(info);
        if (!this._textureBarriers.has(hash)) {
            this._textureBarriers.set(hash, new TextureBarrier(info, hash));
        }
        return this._textureBarriers.get(hash)!;
    }

    public copyBuffersToTexture (buffers: ArrayBufferView[], texture: Texture, regions: BufferTextureCopy[]) {}
    public copyTextureToBuffers (texture: Texture, buffers: ArrayBufferView[], regions: BufferTextureCopy[]) {}
    public copyTexImagesToTexture (texImages: TexImageSource[], texture: Texture, regions: BufferTextureCopy[]) {}
}

legacyCC.EmptyDevice = EmptyDevice;
