/*
 Copyright (c) 2017-2018 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

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
 * @module particle2d
 */

import { IAssembler, IAssemblerManager } from '../2d/renderer/base';
import { ParticleSystem2D } from './particle-system-2d';
import { MeshRenderData } from '../2d/renderer/render-data';
import { IBatcher } from '../2d/renderer/i-batcher';
import { PositionType } from './define';
import { legacyCC } from '../core/global-exports';

export const ParticleAssembler: IAssembler = {
    maxParticleDeltaTime: 0,
    createData (comp: ParticleSystem2D) {
        return MeshRenderData.add();
    },
    removeData (data) {
        MeshRenderData.remove(data);
    },
    updateRenderData () {
    },
    fillBuffers (comp: ParticleSystem2D, renderer: IBatcher) {
        if (comp === null) {
            return;
        }

        const renderData = comp._simulator.renderData;
        if (renderData.vertexCount === 0 || renderData.indexCount === 0) {
            return;
        }
        const accessor = renderer.getBufferAccessor();

        const vertexCount = renderData.vertexCount;
        const indexCount = renderData.indexCount;

        accessor.request(vertexCount, indexCount);
        let vertexOffset = (accessor.byteOffset - vertexCount * accessor.vertexFormatBytes) >> 2;
        let indexOffset = accessor.indexOffset - indexCount;
        const vertexId = accessor.vertexOffset - vertexCount;
        const buffer = accessor.currentBuffer;

        // buffer data may be realloc, need get reference after request.
        const vBuf = buffer.vData!;
        const iBuf = buffer.iData!;

        const vData = renderData.vData;
        const iData = renderData.iData as number[];

        const vLen = renderData.vertexCount * 9;
        for (let i = 0; i < vLen; i++) {
            vBuf[vertexOffset++] = vData[i];
        }

        const iLen = renderData.indexCount;
        for (let i = 0; i < iLen; i++) {
            iBuf[indexOffset++] = iData[i] + vertexId;
        }
    },
};

export const ParticleSystem2DAssembler: IAssemblerManager = {
    getAssembler (comp: ParticleSystem2D) {
        if (!ParticleAssembler.maxParticleDeltaTime) {
            ParticleAssembler.maxParticleDeltaTime = legacyCC.game.frameTime / 1000 * 2;
        }
        return ParticleAssembler;
    },
};

ParticleSystem2D.Assembler = ParticleSystem2DAssembler;
