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

import { DescriptorSet } from '../base/descriptor-set';
import { Buffer } from '../base/buffer';
import { CommandBuffer } from '../base/command-buffer';
import { Framebuffer } from '../base/framebuffer';
import { InputAssembler } from '../base/input-assembler';
import { PipelineState } from '../base/pipeline-state';
import { Texture } from '../base/texture';
import { RenderPass } from '../base/render-pass';
import { GlobalBarrier } from '../base/states/global-barrier';
import { TextureBarrier } from '../base/states/texture-barrier';
import { StencilFace, BufferSource, CommandBufferInfo, BufferTextureCopy, Color, Rect, Viewport, DrawInfo } from '../base/define';

export class EmptyCommandBuffer extends CommandBuffer {
    public initialize (info: Readonly<CommandBufferInfo>) {
        this._type = info.type;
        this._queue = info.queue;
    }
    public destroy () {}
    public begin (renderPass?: RenderPass, subpass = 0, frameBuffer?: Framebuffer) {}
    public end () {}
    public beginRenderPass (renderPass: RenderPass, framebuffer: Framebuffer, renderArea: Rect,
        clearColors: Color[], clearDepth: number, clearStencil: number) {}
    public endRenderPass () {}
    public bindPipelineState (pipelineState: PipelineState) {}
    public bindDescriptorSet (set: number, descriptorSet: DescriptorSet, dynamicOffsets?: number[]) {}
    public bindInputAssembler (inputAssembler: InputAssembler) {}
    public setViewport (viewport: Viewport) {}
    public setScissor (scissor: Rect) {}
    public setLineWidth (lineWidth: number) {}
    public setDepthBias (depthBiasConstantFactor: number, depthBiasClamp: number, depthBiasSlopeFactor: number) {}
    public setBlendConstants (blendConstants: Color) {}
    public setDepthBound (minDepthBounds: number, maxDepthBounds: number) {}
    public setStencilWriteMask (face: StencilFace, writeMask: number) {}
    public setStencilCompareMask (face: StencilFace, reference: number, compareMask: number) {}
    public draw (infoOrAssembler: DrawInfo | InputAssembler) {}
    public updateBuffer (buffer: Buffer, data: BufferSource, size?: number) {}
    public copyBuffersToTexture (buffers: ArrayBufferView[], texture: Texture, regions: BufferTextureCopy[]) {}
    public execute (cmdBuffs: CommandBuffer[], count: number) {}
    public pipelineBarrier (globalBarrier: GlobalBarrier, textureBarriers: TextureBarrier[]) {}
}
