/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

/**
 * @packageDocumentation
 * @module ui-assembler
 */

import { IUV, SpriteFrame } from '../../../core/assets';
import { Color, Mat4, Vec3 } from '../../../core/math';
import { IRenderData, RenderData } from '../../../core/renderer/ui/render-data';
import { UI } from '../../../core/renderer/ui/ui';
import { Sprite } from '../../components';
import { IAssembler } from '../../../core/renderer/ui/base';

const vec3_temp = new Vec3();

/**
 * mesh 组装器
 * 可通过 `UI.mesh` 获取该组装器。
 */
export const mesh: IAssembler = {
    useModel: false,
    verticesCount: 4,

    createData (sprite: Sprite) {
        return sprite.requestRenderData();
    },

    updateRenderData (sprite: Sprite) {
        const frame = sprite.spriteFrame;

        // TODO: Material API design and export from editor could affect the material activation process
        // need to update the logic here
        // if (frame) {
        //     if (!frame._original && dynamicAtlasManager) {
        //         dynamicAtlasManager.insertSpriteFrame(frame);
        //     }
        //     if (sprite._material._texture !== frame._texture) {
        //         sprite._activateMaterial();
        //     }
        // }

        const renderData = sprite.renderData;
        if (renderData && frame) {
            const vertices = frame.vertices;
            if (vertices) {
                if (renderData.vertexCount !== vertices.x.length) {
                    renderData.vertexCount = vertices.x.length;
                    // 1 for world vertices, 2 for local vertices
                    renderData.dataLength = renderData.vertexCount * 2;
    
                    renderData.indicesCount = vertices.triangles.length;

                    this.updateColor(sprite);

                    renderData.uvDirty = renderData.vertDirty = true;
                }
                
                if (renderData.uvDirty) {
                    this.updateUVs(sprite);
                }

                if(renderData.vertDirty) {
                    this.updateVertices(sprite);
                    this.updateWorldVertices(sprite);
                }
            }
        }
    },

    updateColor (sprite: Sprite) {
        const vData = sprite.renderData!.vData;

        let colorOffset = 5;
        const color = sprite.color;
        const colorR = color.r / 255;
        const colorG = color.g / 255;
        const colorB = color.b / 255;
        const colorA = color.a / 255;
        for (let i = 0; i < 4; i++) {
            vData![colorOffset] = colorR;
            vData![colorOffset + 1] = colorG;
            vData![colorOffset + 2] = colorB;
            vData![colorOffset + 3] = colorA;

            colorOffset += 9;
        }
    },

    updateUVs(sprite) {
        let vertices = sprite.spriteFrame.vertices,
            u = vertices.nu,
            v = vertices.nv;

        let renderData = sprite._renderData;
        let data = renderData._data;
        for (let i = 0, l = u.length; i < l; i++) {
            let vertice = data[i];
            vertice.u = u[i];
            vertice.v = v[i];
        }

        renderData.uvDirty = false;
    },

    updateVertices(sprite) {
        let node = sprite.node,
            contentWidth = Math.abs(node.width),
            contentHeight = Math.abs(node.height),
            appx = node.anchorX * contentWidth,
            appy = node.anchorY * contentHeight;

        let frame = sprite.spriteFrame,
            vertices = frame.vertices,
            x = vertices.x,
            y = vertices.y,
            originalWidth = frame._originalSize.width,
            originalHeight = frame._originalSize.height,
            rectWidth = frame._rect.width,
            rectHeight = frame._rect.height,
            offsetX = frame._offset.x,
            offsetY = frame._offset.y,
            trimX = offsetX + (originalWidth - rectWidth) / 2,
            trimY = offsetY + (originalHeight - rectHeight) / 2;

        let scaleX = contentWidth / (sprite.trim ? rectWidth : originalWidth),
            scaleY = contentHeight / (sprite.trim ? rectHeight : originalHeight);

        let renderData = sprite._renderData;
        let data = renderData._data;

        if (!sprite.trim) {
            for (let i = 0, l = x.length; i < l; i++) {
                let vertice = data[i + l];
                vertice.x = (x[i]) * scaleX - appx;
                vertice.y = (originalHeight - y[i]) * scaleY - appy;
            }
        }
        else {
            for (let i = 0, l = x.length; i < l; i++) {
                let vertice = data[i + l];
                vertice.x = (x[i] - trimX) * scaleX - appx;
                vertice.y = (originalHeight - y[i] - trimY) * scaleY - appy;
            }
        }

        renderData.vertDirty = false;
    },

    updateWorldVerts(sprite) {
        let node = sprite.node,
            renderData = sprite._renderData,
            data = renderData._data;

        node._updateWorldMatrix();
        let matrix = node._worldMatrix;
        for (let i = 0, l = renderData.vertexCount; i < l; i++) {
            let local = data[i + l];
            let world = data[i];
            Vec3.set(vec3_temp, local.x, local.y, 0);
            Vec3.transformMat4(world, vec3_temp, matrix);
        }
    },
};
