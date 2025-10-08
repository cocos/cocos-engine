/*
 Copyright (c) 2017-2018 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

import { EDITOR_NOT_IN_PREVIEW } from 'internal:constants';
import type { IAssembler, IAssemblerManager } from '../2d/renderer/base';
import { ParticleSystem2D } from './particle-system-2d';
import { MeshRenderData } from '../2d/renderer/render-data';
import { cclegacy } from '../core';
import { Material } from '../asset/assets';
import { SpriteFrame } from '../2d';
import { Director, director } from '../game/director';

class P2DCommitInfo {
    public p2d: ParticleSystem2D | null = null;
    public renderData: MeshRenderData | null = null;
    public material: Material | null = null;
    public renderFrame: SpriteFrame | null = null;
    public assembler: IAssembler | null = null;
    public layer = 0;
    public render: any;
    public stencilStage: number = 0;
}

class MeshBatcher {
    private static _currentInfo: P2DCommitInfo = new P2DCommitInfo();
    private static _start = false;

    static init (): void {
        this._start = true;
        this._currentInfo.p2d = null;
        this._currentInfo.renderData = null;
    }

    static batchProcess (p2d: ParticleSystem2D, vertexCount: number, indexCount: number): void {
        if (!this._start) {
            this.init();
            //? reset MeshBatcher when new frame
            director.on(Director.EVENT_BEGIN_FRAME, () => {
                MeshBatcher.init();
            });
        }

        const commitInfo = this._currentInfo;
        p2d.batchData.reset();

        if (!p2d.meshRenderData || vertexCount <= 0) { return; }

        let renderData = commitInfo.renderData;

        let breakBatch = true;
        let oldVC = 0;
        let oldIC = 0;
        const frame = p2d._renderSpriteFrame;
        const layer = p2d.node.layer;
        const mat: Material | null = p2d.getSharedMaterial(0);

        //? breakBatch when in EDITOR_NOT_IN_PREVIEW to save preview feature
        if (!(window.cc.director.root.batcher2D._currComponent instanceof ParticleSystem2D) || EDITOR_NOT_IN_PREVIEW) {
            breakBatch = true;
        } else if (renderData) {
            // mat = renderData.material;

            oldVC = renderData.vertexCount;
            oldIC = renderData.indexCount;

            breakBatch = !commitInfo.p2d
                            || commitInfo.material !== mat
                            || commitInfo.layer !== layer
                            || (commitInfo.renderFrame && frame && commitInfo.renderFrame.texture !== frame.texture)
                            || commitInfo.stencilStage !== p2d.stencilStage;

            if (!breakBatch) {
                if (!renderData.request(vertexCount, indexCount)) {
                    breakBatch = true;
                }
            }
        }

        if (breakBatch) {
            p2d.swapBuffer();

            renderData = p2d.meshRenderData;
            commitInfo.p2d = p2d;
            commitInfo.renderFrame = frame;
            commitInfo.material = mat; //?
            commitInfo.layer = layer;
            commitInfo.renderFrame = p2d._renderSpriteFrame;
            commitInfo.assembler = p2d.assembler;
            commitInfo.stencilStage = p2d.stencilStage;
            commitInfo.renderData = renderData;

            if (renderData.vertexCount < vertexCount) {
                renderData.reset();
                renderData.request(vertexCount, indexCount);
            } else {
                renderData.resize(vertexCount, indexCount);
            }

            oldVC = 0;
            oldIC = 0;
        }

        p2d.batchData.request(renderData!, oldVC, oldIC);
    }
}

export class Particle2DAssembler implements IAssembler {
    maxParticleDeltaTime = 0;

    requestData (p2d: ParticleSystem2D): boolean {
        const paritcleCount = p2d.particleCount;
        this._requestData(p2d, paritcleCount * 4, paritcleCount * 6);
        return true;
    }

    createData (comp: ParticleSystem2D): MeshRenderData {
        return MeshRenderData.add();
    }

    removeData (data: MeshRenderData): void {
        MeshRenderData.remove(data);
    }

    _requestData (comp: ParticleSystem2D, vertexCount: number, indexCount: number): void {
        MeshBatcher.batchProcess(comp, vertexCount, indexCount);

        const batchData = comp.batchData;
        const renderData = batchData.renderData!;
        if (!renderData) {
            return;
        }

        let offset = batchData.startIndexIndex;
        const startIndex = batchData.startVertexIndex;

        const count = vertexCount / 4;
        const buffer = renderData.iData;
        for (let i = 0; i < count; i++) {
            const vId = i * 4 + startIndex;
            buffer[offset++] = vId;
            buffer[offset++] = vId + 1;
            buffer[offset++] = vId + 2;
            buffer[offset++] = vId + 1;
            buffer[offset++] = vId + 3;
            buffer[offset++] = vId + 2;
        }

        renderData.setRenderDrawInfoAttributes();
    }
}

export const particle2DAssembler = new Particle2DAssembler();

export const ParticleSystem2DAssembler: IAssemblerManager = {
    getAssembler (comp: ParticleSystem2D): IAssembler {
        if (!particle2DAssembler.maxParticleDeltaTime) {
            particle2DAssembler.maxParticleDeltaTime = cclegacy.game.frameTime / 1000 * 2;
        }
        return particle2DAssembler;
    },
};

ParticleSystem2D.Assembler = ParticleSystem2DAssembler;
