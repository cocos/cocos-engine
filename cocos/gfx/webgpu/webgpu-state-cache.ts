/*
 Copyright (c) 2024 Xiamen Yaji Software Co., Ltd.

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

import { Rect, Viewport } from '../base/define';
import { BlendState, DepthStencilState, RasterizerState } from '../base/pipeline-state';
import { WebGPUBuffer } from './webgpu-buffer';
import { WebGPUFramebuffer } from './webgpu-framebuffer';
import { WebGPUInputAssembler } from './webgpu-input-assembler';
import { WebGPUSampler } from './webgpu-sampler';
import { WebGPUTexture } from './webgpu-texture';

export interface IWebGPUTexUnit {
    glTexture: WebGPUTexture | null;
}

export class WebGPUStateCache {
    public gpuArrayBuffer: WebGPUBuffer | null = null;
    public gpuElementArrayBuffer: WebGPUBuffer | null = null;
    public gpuUniformBuffer: WebGPUBuffer | null = null;
    public gpuBindUBOs: (WebGPUBuffer | null)[] = [];
    public gpuBindUBOOffsets: number[] = [];
    public texUnit: number = 0;
    public gpuTexUnits: IWebGPUTexUnit[] = [];
    public gpuSamplerUnits: (WebGPUSampler | null)[] = [];
    public gpuFramebuffer: WebGPUFramebuffer | null = null;
    public gpuReadFramebuffer: WebGPUFramebuffer | null = null;
    public gpuInputAssembler: WebGPUInputAssembler | null = null;
    public viewport = new Viewport();
    public scissorRect = new Rect(0, 0, 0, 0);
    public rs = new RasterizerState();
    public dss = new DepthStencilState();
    public bs = new BlendState();
    public gpuEnabledAttribLocs: boolean[] = [];
    public gpuCurrentAttribLocs: boolean[] = [];
    public texUnitCacheMap: Record<string, number> = {};

    initialize(texUnit: number, bufferBindings: number, vertexAttributes: number) {
        for (let i = 0; i < texUnit; ++i) this.gpuTexUnits.push({ glTexture: null });

        this.gpuSamplerUnits.length = texUnit;
        this.gpuSamplerUnits.fill(null);

        this.gpuBindUBOs.length = bufferBindings;
        this.gpuBindUBOs.fill(null);

        this.gpuBindUBOOffsets.length = bufferBindings;
        this.gpuBindUBOOffsets.fill(0);

        this.gpuEnabledAttribLocs.length = vertexAttributes;
        this.gpuEnabledAttribLocs.fill(false);

        this.gpuCurrentAttribLocs.length = vertexAttributes;
        this.gpuCurrentAttribLocs.fill(false);
    }
}
