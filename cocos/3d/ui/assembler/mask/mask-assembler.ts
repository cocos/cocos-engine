/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
 ****************************************************************************/

import { Color, Mat4, Vec3 } from '../../../../core/value-types';
import { color4, vec3 } from '../../../../core/vmath';
import { IRenderData, RenderData } from '../../../../renderer/ui/renderData';
import { UI } from '../../../../renderer/ui/ui';
import { Node } from '../../../../scene-graph/node';
// import { IGeometry } from '../../../primitive/define';
import { MaskComponent } from '../../components/mask-component';
import { IAssembler, IAssemblerManager } from '../assembler';
import { StencilManager } from './stencil-manager';

const _stencilManager = StencilManager.sharedManager!;
const _worldMatrix = new Mat4();
const WHITE = Color.WHITE;

function getScreen (comp: MaskComponent){
    let parent: Node | null = comp.node;
    while (parent){
        if (parent.getComponent(cc.CanvasComponent)){
            return parent;
        }

        parent = parent.parent;
    }

    return parent;
}

export const maskAssembler: IAssembler = {
    createData (mask: MaskComponent) {
        const renderData = mask.requestRenderData();
        renderData!.dataLength = 4;
        renderData!.vertexCount = 4;
        renderData!.indiceCount = 6;
        return renderData as RenderData;
    },

    updateRenderData (mask: MaskComponent){
        const renderData = mask.renderData;
        if (renderData) {
            if (renderData.vertDirty) {
                if (this.updateVerts) {
                    this.updateVerts(mask);
                }
            }
        }
    },

    updateVerts (mask: MaskComponent) {
        const renderData: RenderData | null = mask.renderData;
        if (!renderData) {
            return;
        }

        const node: Node = mask.node;
        const datas: IRenderData[] = renderData.datas;
        const cw: number = node.width;
        const ch: number = node.height;
        const appx: number = node.anchorX * cw;
        const appy: number = node.anchorY * ch;
        let l: number = 0;
        let b: number = 0;
        let r: number = 0;
        let t: number = 0;
        // if (sprite.trim) {
        l = -appx;
        b = -appy;
        r = cw - appx;
        t = ch - appy;
        datas[0].x = l;
        datas[0].y = b;
        datas[3].x = r;
        datas[3].y = t;

        renderData.vertDirty = false;
    },

    fillBuffers (mask: MaskComponent, renderer: UI) {
        let cw = 0;
        let ch = 0;
        let appx = 0;
        let appy = 0;
        const data0 = new Vec3();
        const data3 = new Vec3();
        const vec3_temps: Vec3[] = [new Vec3(), new Vec3(), new Vec3(), new Vec3()];
        const v = new vec3();
        let screen: Node | null = null;
        if (CC_EDITOR){
            screen = getScreen(mask);
        }else{
            const comp = renderer.getScreen(mask.visibility);
            screen = comp ? comp.node : null;
        }
        if (!screen) {
            return;
        }
        _stencilManager.pushMask(mask);
        // commit last data
        renderer.autoMergeBatches();

        const clearMaterial = mask.getClearMaterial()!;
        cw = screen.width;
        ch = screen.height;
        appx = screen.anchorX * cw;
        appy = screen.anchorY * ch;
        data0.x = -appx;
        data0.y = -appy;
        data3.x = cw - appx;
        data3.y = ch - appy;
        vec3.set(vec3_temps[0], data0.x, data0.y, 0);
        vec3.set(vec3_temps[1], data3.x, data0.y, 0);
        vec3.set(vec3_temps[2], data0.x, data3.y, 0);
        vec3.set(vec3_temps[3], data3.x, data3.y, 0);
        screen.getWorldMatrix(_worldMatrix);

        let buffer = renderer.currBufferBatch!;
        let vertexOffset = buffer.byteOffset >> 2;
        let indiceOffset = buffer.indiceOffset;
        let vertexId = buffer.vertexOffset;
        const isRecreate = buffer.request(4, 6);
        if (!isRecreate) {
            buffer = renderer.currBufferBatch!;
            vertexOffset = 0;
            indiceOffset = 0;
            vertexId = 0;
        }

        let vbuf = buffer.vData;
        let iData = buffer.iData!;
        for (let i = 0; i < 4; ++i) {
            vec3.copy(v, vec3_temps[i]);
            vec3.transformMat4(v, v, _worldMatrix);
            vbuf![vertexOffset++] = v.x;
            vbuf![vertexOffset++] = v.y;
            vbuf![vertexOffset++] = v.z;
            vbuf![vertexOffset++] = 1;
            vbuf![vertexOffset++] = 1;
            color4.array(vbuf!, WHITE, vertexOffset);
            vertexOffset += 4;
        }

        iData[indiceOffset++] = vertexId;
        iData[indiceOffset++] = vertexId + 1;
        iData[indiceOffset++] = vertexId + 2;
        iData[indiceOffset++] = vertexId + 1;
        iData[indiceOffset++] = vertexId + 3;
        iData[indiceOffset++] = vertexId + 2;

        _stencilManager.clear();
        renderer.forceMergeBatches(clearMaterial, null);

        const maskMaterial = mask.getMaskMaterial()!;
        const datas = mask.renderData!.datas;
        vec3.set(vec3_temps[0], datas[0].x, datas[0].y, 0);
        vec3.set(vec3_temps[1], datas[3].x, datas[0].y, 0);
        vec3.set(vec3_temps[2], datas[0].x, datas[3].y, 0);
        vec3.set(vec3_temps[3], datas[3].x, datas[3].y, 0);

        vertexOffset = buffer.byteOffset >> 2;
        indiceOffset = buffer.indiceOffset;
        vertexId = buffer.vertexOffset;
        buffer.request(mask.renderData!.vertexCount, mask.renderData!.indiceCount);

        vbuf = buffer.vData;
        iData = buffer.iData!;
        mask.node.getWorldMatrix(_worldMatrix);
        for (let i = 0; i < 4; ++i) {
            vec3.copy(v, vec3_temps[i]);
            vec3.transformMat4(v, v, _worldMatrix);
            vbuf![vertexOffset++] = v.x;
            vbuf![vertexOffset++] = v.y;
            vbuf![vertexOffset++] = v.z;
            vbuf![vertexOffset++] = 1;
            vbuf![vertexOffset++] = 1;
            color4.array(vbuf!, mask.color, vertexOffset);
            vertexOffset += 4;
        }

        iData[indiceOffset++] = vertexId;
        iData[indiceOffset++] = vertexId + 1;
        iData[indiceOffset++] = vertexId + 2;
        iData[indiceOffset++] = vertexId + 1;
        iData[indiceOffset++] = vertexId + 3;
        iData[indiceOffset++] = vertexId + 2;

        _stencilManager.enterLevel();
        renderer.forceMergeBatches(maskMaterial, null);

        _stencilManager.enableMask();
    },
};

export const maskEndAssembler: IAssembler = {
    fillBuffers (mask: MaskComponent, ui: UI) {
        _stencilManager.exitMask();
    },
};

const StartAssembler: IAssemblerManager = {
    getAssembler () {
        return maskAssembler;
    },
};

const PostAssembler: IAssemblerManager = {
    getAssembler () {
        return maskEndAssembler;
    },
};

MaskComponent.Assembler = StartAssembler;
MaskComponent.PostAssembler = PostAssembler;
