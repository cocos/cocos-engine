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

import { DescriptorSet } from '../base/descriptor-set';
import { Buffer } from '../base/buffer';
import { CommandBuffer } from '../base/command-buffer';
import { Framebuffer } from '../base/framebuffer';
import { InputAssembler } from '../base/input-assembler';
import { PipelineState } from '../base/pipeline-state';
import { Texture } from '../base/texture';
import { RenderPass } from '../base/render-pass';
import { GeneralBarrier } from '../base/states/general-barrier';
import { TextureBarrier } from '../base/states/texture-barrier';
import { BufferBarrier } from '../base/states/buffer-barrier';
import { StencilFace, BufferSource, CommandBufferInfo, BufferTextureCopy, Color,
    Rect, Viewport, DrawInfo, TextureBlit, Filter,
} from '../base/define';

export class EmptyCommandBuffer extends CommandBuffer {
    public initialize (info: Readonly<CommandBufferInfo>) {
        this._type = info.type;
        this._queue = info.queue;
    }
    public destroy () {}
    public begin (renderPass?: RenderPass, subpass = 0, frameBuffer?: Framebuffer) {}
    public end () {}
    public beginRenderPass (renderPass: RenderPass, framebuffer: Framebuffer, renderArea: Readonly<Rect>,
        clearColors: Readonly<Color[]>, clearDepth: number, clearStencil: number) {}
    public endRenderPass () {}
    public bindPipelineState (pipelineState: PipelineState) {}
    public bindDescriptorSet (set: number, descriptorSet: DescriptorSet, dynamicOffsets?: Readonly<number[]>) {}
    public bindInputAssembler (inputAssembler: InputAssembler) {}
    public setViewport (viewport: Readonly<Viewport>) {}
    public setScissor (scissor: Readonly<Rect>) {}
    public setLineWidth (lineWidth: number) {}
    public setDepthBias (depthBiasConstantFactor: number, depthBiasClamp: number, depthBiasSlopeFactor: number) {}
    public setBlendConstants (blendConstants: Readonly<Color>) {}
    public setDepthBound (minDepthBounds: number, maxDepthBounds: number) {}
    public setStencilWriteMask (face: StencilFace, writeMask: number) {}
    public setStencilCompareMask (face: StencilFace, reference: number, compareMask: number) {}
    public draw (infoOrAssembler: Readonly<DrawInfo> | Readonly<InputAssembler>) {}
    public updateBuffer (buffer: Buffer, data: Readonly<BufferSource>, size?: number) {}
    public copyBuffersToTexture (buffers: Readonly<ArrayBufferView[]>, texture: Texture, regions: Readonly<BufferTextureCopy[]>) {}
    public execute (cmdBuffs: Readonly<CommandBuffer[]>, count: number) {}
    public pipelineBarrier (GeneralBarrier: Readonly<GeneralBarrier>, bufferBarriers?: Readonly<BufferBarrier[]>,
        buffers?: Readonly<Buffer[]>,
        textureBarriers?: Readonly<TextureBarrier[]>,
        textures?: Readonly<Texture[]>) {}
    public blitTexture (srcTexture: Readonly<Texture>, dstTexture: Texture, regions: Readonly<TextureBlit []>, filter: Filter): void {}
}
