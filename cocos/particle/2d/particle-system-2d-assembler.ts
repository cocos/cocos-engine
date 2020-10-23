/****************************************************************************
 Copyright (c) 2017-2018 Chukong Technologies Inc.

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
 ****************************************************************************/

import { IAssembler, IAssemblerManager } from '../../core/renderer/ui/base';
import { PositionType, ParticleSystem2D } from './particle-system-2d';
import { MeshRenderData } from '../../core/renderer/ui/render-data';
import { UI } from '../../core/renderer/ui/ui';

export const ParticleAssembler: IAssembler = {
    renderData: MeshRenderData,
    createData (comp: ParticleSystem2D) {
        this.renderData = MeshRenderData.add();
    },
    requestData (vertexCount: number, indicesCount: number) {
        let offset = this.renderData.indicesCount;
        this.renderData.request(vertexCount, indicesCount);
        const count = this.renderData.indicesCount / 6;
        const buffer = this.renderData.iData;
        for (let i = offset; i < count; i++) {
            const vId = i * 4;
            buffer[offset++] = vId;
            buffer[offset++] = vId + 1;
            buffer[offset++] = vId + 2;
            buffer[offset++] = vId + 1;
            buffer[offset++] = vId + 3;
            buffer[offset++] = vId + 2;
        }
    },
    reset () {
        this.renderData.reset();
    },
    updateRenderData () {
    },

    // getBuffer (comp: ParticleSystem2D) {
    //     if (!this._buffer) {
    //         // Create quad buffer for vertex and index
    //         this._buffer = new QuadBuffer(renderer._handle, vfmtPosUvColor);
    //         this._ia = comp.model.subModels[0].inputAssembler;
    //         this._ia._vertexBuffer = this._buffer._vb;
    //         this._ia._indexBuffer = this._buffer._ib;
    //         this._ia._start = 0;
    //         this._ia._count = 0;
    //     }
    //     return this._buffer;
    // },

    fillBuffers (comp: ParticleSystem2D, renderer: UI) {
        if (comp === null) {
            return;
        }

        let node;
        if (comp.positionType === PositionType.RELATIVE) {
            node = comp.node.parent;
        } else {
            node = comp.node;
        }

    }
}

export const ParticleSystem2DAssembler: IAssemblerManager = {
    getAssembler (comp: ParticleSystem2D) {
        return ParticleAssembler;
    },
};

ParticleSystem2D.Assembler = ParticleSystem2DAssembler;