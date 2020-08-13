/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

import Assembler2D from '../../../../assembler-2d';
import { getBuffer, getVBuffer, vfmtInstance } from '../../../instance-buffer';

export default class InstanceSpriteAssembler extends Assembler2D {
    verticesCount = 1;
    floatsPerVert = vfmtInstance._bytes / 4

    constructor () {
        super();

        getBuffer();
        this._instanceArray = new Float32Array(this.floatsPerVert);
    }

    updateColor () {

    }

    getVfmt () {
        return vfmtInstance;
    }

    getBuffer () {
        return getBuffer();
    }

    getVBuffer () {
        return getVBuffer();
    }

    fillBuffers (comp, renderer) {
        if (renderer.worldMatDirty) {
            this.updateWorldVerts(comp);
        }

        let instanceBuffer = getBuffer();
        let buffer = this.getVBuffer();
        buffer.set(this._instanceArray, instanceBuffer.instanceOffset++ * this.floatsPerVert);

        cc.renderer._handle._buffer = instanceBuffer;
    }

    updateWorldVerts (comp) {
        let buffer = this._instanceArray;

        let m = comp.node._worldMatrix.m;
        buffer[8] = m[0];
        buffer[9] = m[1];
        buffer[10] = m[4];
        buffer[11] = m[5];
        buffer[12] = m[12];
        buffer[13] = m[13];
    }

    updateRenderData (sprite) {
        this.packToDynamicAtlas(sprite, sprite._spriteFrame);

        if (sprite._vertsDirty) {
            this.updateUVs(sprite);
            this.updateVerts(sprite);
            sprite._vertsDirty = false;
        }
    }

    updateUVs (sprite) {
        let uv = sprite._spriteFrame.uv;
        let buffer = this._instanceArray;
        buffer[0] = uv[0];
        buffer[1] = uv[1];

        // if (sprite._spriteFrame.isRotated()) {
        //     buffer[2] = uv[3];
        //     buffer[3] = uv[6];
        // }
        // else {
            buffer[2] = uv[6];
            buffer[3] = uv[7];
        // }

        buffer[14] = sprite._spriteFrame.isRotated() ? 1 : 0;

        // texture id
        buffer[15] = 1;
    }

    updateVerts (sprite) {
        let node = sprite.node,
            cw = node.width, ch = node.height,
            appx = node.anchorX * cw, appy = node.anchorY * ch,
            l, b, r, t;
        if (sprite.trim) {
            l = -appx;
            b = -appy;
            r = cw - appx;
            t = ch - appy;
        }
        else {
            let frame = sprite.spriteFrame,
                ow = frame._originalSize.width, oh = frame._originalSize.height,
                rw = frame._rect.width, rh = frame._rect.height,
                offset = frame._offset,
                scaleX = cw / ow, scaleY = ch / oh;
            let trimLeft = offset.x + (ow - rw) / 2;
            let trimRight = offset.x - (ow - rw) / 2;
            let trimBottom = offset.y + (oh - rh) / 2;
            let trimTop = offset.y - (oh - rh) / 2;
            l = trimLeft * scaleX - appx;
            b = trimBottom * scaleY - appy;
            r = cw + trimRight * scaleX - appx;
            t = ch + trimTop * scaleY - appy;
        }

        let buffer = this._instanceArray;
        buffer[4] = l;
        buffer[5] = b;
        buffer[6] = r;
        buffer[7] = t;
        this.updateWorldVerts(sprite);
    }
}
