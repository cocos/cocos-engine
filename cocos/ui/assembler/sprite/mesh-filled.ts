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
import { Vec3 } from '../../../core/math';
import { Sprite } from '../../components';
import { IAssembler } from '../../../core/renderer/ui/base';
import { UI } from '../../../core/renderer/ui/ui';
import { fillVerticesWithoutCalc3D } from '../utils';

const vec3_temp = new Vec3();

/**
 * mesh 组装器
 * 可通过 `UI.mesh` 获取该组装器。
 */
export const meshFilled: IAssembler = {
    useModel: false,

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

                    renderData.uvDirty = renderData.vertDirty = true;
                }
                renderData.indicesCount = vertices.triangles.length;

                if (renderData.uvDirty) {
                    this.updateUVs(sprite);
                }

                if (renderData.vertDirty) {
                    this.updateVertices(sprite);
                    this.updateWorldVertices(sprite);
                }
            }
        }
    },

    updateUVs (sprite) {
        const vertices = sprite.spriteFrame.vertices;
        const u = vertices.nu;
        const v = vertices.nv;

        const renderData = sprite._renderData;
        const data = renderData._data;
        for (let i = 0, l = u.length; i < l; i++) {
            const vertex = data[i];
            vertex.u = u[i];
            vertex.v = v[i];
        }

        renderData.uvDirty = false;
    },

    updateVertices (sprite) {
        const node = sprite.node;
        const contentWidth = Math.abs(node.width);
        const contentHeight = Math.abs(node.height);
        const appX = node.anchorX * contentWidth;
        const appY = node.anchorY * contentHeight;

        const frame = sprite.spriteFrame;
        const vertices = frame.vertices;
        const x = vertices.x;
        const y = vertices.y;
        const originalWidth = frame._originalSize.width;
        const originalHeight = frame._originalSize.height;
        const rectWidth = frame._rect.width;
        const rectHeight = frame._rect.height;
        const offsetX: number = frame._offset.x;
        const offsetY: number = frame._offset.y;
        const trimX = offsetX + (originalWidth - rectWidth) / 2;
        const trimY = offsetY + (originalHeight - rectHeight) / 2;

        const scaleX = contentWidth / (sprite.trim ? rectWidth : originalWidth);
        const scaleY = contentHeight / (sprite.trim ? rectHeight : originalHeight);

        const renderData = sprite._renderData;
        const data = renderData._data;

        if (!sprite.trim) {
            for (let i = 0, l: number = x.length; i < l; i++) {
                const vertex = data[i + l];
                vertex.x = (x[i]) * scaleX - appX;
                vertex.y = (originalHeight - y[i]) * scaleY - appY;
            }
        } else {
            for (let i = 0, l: number = x.length; i < l; i++) {
                const vertex = data[i + l];
                vertex.x = (x[i] - trimX) * scaleX - appX;
                vertex.y = (originalHeight - y[i] - trimY) * scaleY - appY;
            }
        }

        renderData.vertDirty = false;
    },

    updateWorldVertices (sprite) {
        const node = sprite.node;
        const renderData = sprite._renderData;
        const data = renderData._data;

        node._updateWorldMatrix();
        const matrix = node._worldMatrix;
        for (let i = 0, l: number = renderData.vertexCount; i < l; i++) {
            const local = data[i + l];
            const world = data[i];
            Vec3.set(vec3_temp, local.x, local.y, 0);
            Vec3.transformMat4(world, vec3_temp, matrix);
        }
    },

    fillBuffers (sprite: Sprite, renderer: UI) {
        if (sprite === null) {
            return;
        }

        const vertices = sprite.spriteFrame!.vertices;
        if (!vertices) {
            return;
        }

        // update world vertices
        this.updateWorldVertices(sprite);

        // buffer
        const buffer = renderer.acquireBufferBatch()!;
        let indicesOffset = buffer.indicesOffset;
        const vertexId: number = buffer.vertexOffset;

        const node = sprite.node;
        fillVerticesWithoutCalc3D(node, renderer, sprite.renderData!, sprite.color);

        // buffer data may be realloc, need get reference after request.
        const iBuf = buffer.iData!;
        const triangles = vertices.triangles;
        for (let i = 0, l = triangles.length; i < l; i++) {
            iBuf[indicesOffset++] = vertexId + (triangles[i] as number);
        }
    },
};
