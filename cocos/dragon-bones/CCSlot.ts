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

import { BoneType, BinaryOffset, Slot } from '@cocos/dragonbones-js';
import { Texture2D } from '../asset/assets';
import { Color, Mat4, _decorator } from '../core';
import { CCTextureData } from './CCTextureData';

const { ccclass } = _decorator;

// @skipLibCheck
/**
 * @en Slots attach on bones，to control the display status and attributes of the display object.
 * @zh 插槽附着在骨骼上，控制显示对象的显示状态和属性。
*/
@ccclass('dragonBones.CCSlot')
export class CCSlot extends Slot {
    static toString (): string {
        return '[class dragonBones.CCSlot]';
    }

    /**
     * @en Vertices in local coordinate system.
     * @zh 局部坐标顶点数据。
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _localVertices: number[];

    /**
     * @en Indices array of vertex data.
     * @zh 顶点数组索引。
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _indices: number[];

    /**
     * @en Local transformation matrix
     * @zh 局部坐标系变换矩阵
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _matrix: Mat4;

    /**
     * @en World transformation matrix
     * @zh 世界坐标系变换矩阵
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _worldMatrix: Mat4;

    protected _worldMatrixDirty: boolean;

    /**
     * @en Color setting on a slot
     * @zh 设置在 Slot 上的颜色
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _color: Color;

    constructor () {
        super();
        this._localVertices = [];
        this._indices = [];
        this._matrix = new Mat4();
        this._worldMatrix = new Mat4();
        this._worldMatrixDirty = true;
        this._visible = false;
        this._color = new Color();
    }

    /**
     * @en Get a Texture2D object from _textureData.
     * @zh 获取2D纹理对象。
     * @returns @en A texture instance if _textureData is not null, otherwise returns null.
     *          @zh 若 _textureData 为 null，将返回 null。
     */
    getTexture (): Texture2D | null {
        if (this._textureData) {
            const sp = (this._textureData as any).spriteFrame;
            const tex = sp.texture as Texture2D;
            return tex;
        }
        return null;
    }
    /**
     * @en Calculates world matrix of slot.
     * @zh 计算插槽世界矩阵。
     */
    calculWorldMatrix (): void {
        const parent = this._armature._parent as CCSlot;
        if (parent) {
            this._mulMat(this._worldMatrix, parent._worldMatrix, this._matrix);
            // Mat4.multiply(this._worldMatrix, parent._worldMatrix, this._matrix);
        } else {
            Mat4.copy(this._worldMatrix, this._matrix);
        }
        this._worldMatrixDirty = false;
    }
    /**
     * @en Resets slot data and state.
     * @zh 重置插槽数据和状态。
     */
    _onClear (): void {
        super._onClear();
        this._localVertices.length = 0;
        this._indices.length = 0;
        Mat4.identity(this._matrix);
        Mat4.identity(this._worldMatrix);
        this._worldMatrixDirty = true;
        this._color = new Color();
        this._visible = false;
    }
    /**
     * just for adapt to dragonbones api,no need to do any thing
     * @deprecated Since v3.7.2, this interface that will be removed in the future.
     */
    _onUpdateDisplay (): void {
    }
    /**
     * just for adapt to dragonbones api,no need to do any thing
     * @deprecated Since v3.7.2, this interface that will be removed in the future.
     */
    _initDisplay (value): void {
    }
    /**
     * just for adapt to dragonbones api,no need to do any thing
     * @deprecated Since v3.7.2, this interface that will be removed in the future.
     */
    _addDisplay (): void {
        this._visible = true;
    }
    /**
     * just for adapt to dragonbones api,no need to do any thing
     * @deprecated Since v3.7.2, this interface that will be removed in the future.
     */
    _replaceDisplay (value): void {
    }
    /**
     * just for adapt to dragonbones api,no need to do any thing
     * @deprecated Since v3.7.2, this interface that will be removed in the future.
     */
    _removeDisplay (): void {
        this._visible = false;
    }

    /**
     * just for adapt to dragonbones api,no need to do any thing
     * @deprecated Since v3.7.2, this interface that will be removed in the future.
     */
    _disposeDisplay (object): void {
    }
    /**
     * just for adapt to dragonbones api,no need to do any thing
     * @deprecated Since v3.7.2, this interface that will be removed in the future.
     */
    _updateVisible (): void {
        this._visible = this.parent.visible;
    }
    /**
     * just for adapt to dragonbones api,no need to do any thing
     * @deprecated Since v3.7.2, this interface that will be removed in the future.
     */
    _updateGlueMesh (): void {

    }

    /**
     * just for adapt to dragonbones api,no need to do any thing
     * @deprecated Since v3.7.2, this interface that will be removed in the future.
     */
    _updateZOrder (): void {
    }
    /**
     * @en Update the color blending mode of the slot.
     * @zh 更新插槽的颜色混合模式。
     */
    _updateBlendMode (): void {
        if (this._childArmature) {
            const childSlots = this._childArmature.getSlots();
            for (let i = 0, l = childSlots.length; i < l; i++) {
                const slot = childSlots[i] as CCSlot;
                slot._blendMode = this._blendMode;
                slot._updateBlendMode();
            }
        }
    }
    /**
     * @en Update the color of the slot.
     * @zh 更新插槽的颜色。
     */
    _updateColor (): void {
        const c = this._color;
        c.r = this._colorTransform.redMultiplier * 255;
        c.g = this._colorTransform.greenMultiplier * 255;
        c.b = this._colorTransform.blueMultiplier * 255;
        c.a = this._colorTransform.alphaMultiplier * 255;
    }
    /**
     * @en Update one frame of slot vertex data.
     * @zh 更新一帧插槽顶点数据。
     */
    _updateFrame (): void {
        this._indices.length = 0;
        const indices = this._indices;
        const localVertices = this._localVertices;
        let indexOffset = 0;
        let vfOffset = 0;

        const currentTextureData = this._textureData as CCTextureData;
        if (!this._display || this._displayIndex < 0 || !currentTextureData || !currentTextureData.spriteFrame) return;

        const texture = currentTextureData.spriteFrame.texture;
        const textureAtlasWidth = texture.width;
        const textureAtlasHeight = texture.height;
        const region = currentTextureData.region;

        if (textureAtlasWidth === 0 || textureAtlasHeight === 0) {
            console.error(`SpriteFrame ${currentTextureData.spriteFrame.name} incorrect size ${textureAtlasWidth} x ${textureAtlasHeight}`);
            return;
        }

        const currentVerticesData = (this._deformVertices !== null && this._display === this._meshDisplay) ? this._deformVertices.verticesData : null;

        if (currentVerticesData) {
            const data = currentVerticesData.data;
            const intArray = data.intArray;
            const floatArray = data.floatArray;
            const vertexCount = intArray[currentVerticesData.offset + BinaryOffset.MeshVertexCount];
            const triangleCount = intArray[currentVerticesData.offset + BinaryOffset.MeshTriangleCount];
            let vertexOffset: number = intArray[currentVerticesData.offset + BinaryOffset.MeshFloatOffset];

            if (vertexOffset < 0) {
                vertexOffset += 65536; // Fixed out of bouds bug.
            }

            const uvOffset = vertexOffset + vertexCount * 2;
            const scale = this._armature._armatureData.scale;

            for (let i = 0, l = vertexCount * 2; i < l; i += 2) {
                localVertices[vfOffset++] = floatArray[vertexOffset + i] * scale;
                localVertices[vfOffset++] = -floatArray[vertexOffset + i + 1] * scale;

                if (currentVerticesData.rotated) {
                    localVertices[vfOffset++] = (region.x + (1.0 - floatArray[uvOffset + i]) * region.width) / textureAtlasWidth;
                    localVertices[vfOffset++] = (region.y + floatArray[uvOffset + i + 1] * region.height) / textureAtlasHeight;
                } else {
                    localVertices[vfOffset++] = (region.x + floatArray[uvOffset + i] * region.width) / textureAtlasWidth;
                    localVertices[vfOffset++] = (region.y + floatArray[uvOffset + i + 1] * region.height) / textureAtlasHeight;
                }
            }

            for (let i = 0; i < triangleCount * 3; ++i) {
                indices[indexOffset++] = intArray[currentVerticesData.offset + BinaryOffset.MeshVertexIndices + i];
            }

            localVertices.length = vfOffset;
            indices.length = indexOffset;

            const isSkinned = !!currentVerticesData.weight;
            if (isSkinned) {
                this._identityTransform();
            }
        } else {
            const l = region.x / textureAtlasWidth;
            const b = (region.y + region.height) / textureAtlasHeight;
            const r = (region.x + region.width) / textureAtlasWidth;
            const t = region.y / textureAtlasHeight;

            localVertices[vfOffset++] = 0; // 0x
            localVertices[vfOffset++] = 0; // 0y
            localVertices[vfOffset++] = l; // 0u
            localVertices[vfOffset++] = b; // 0v

            localVertices[vfOffset++] = region.width; // 1x
            localVertices[vfOffset++] = 0; // 1y
            localVertices[vfOffset++] = r; // 1u
            localVertices[vfOffset++] = b; // 1v

            localVertices[vfOffset++] = 0; // 2x
            localVertices[vfOffset++] = region.height; // 2y
            localVertices[vfOffset++] = l; // 2u
            localVertices[vfOffset++] = t; // 2v

            localVertices[vfOffset++] = region.width; // 3x
            localVertices[vfOffset++] = region.height; // 3y
            localVertices[vfOffset++] = r; // 3u
            localVertices[vfOffset++] = t; // 3v

            indices[0] = 0;
            indices[1] = 1;
            indices[2] = 2;
            indices[3] = 1;
            indices[4] = 3;
            indices[5] = 2;

            localVertices.length = vfOffset;
            indices.length = 6;
        }

        this._visibleDirty = true;
        this._blendModeDirty = true;
        this._colorDirty = true;
    }
    /**
     * @en Update mesh data of slot.
     * @zh 更新槽点的网格数据。
     */
    _updateMesh (): void {
        const scale = this._armature._armatureData.scale;
        const deformVertices = this._deformVertices.vertices;
        const bones = this._deformVertices.bones;
        const verticesData = this._deformVertices.verticesData;
        const weightData = verticesData.weight;
        const hasDeform = deformVertices.length > 0 && verticesData.inheritDeform;

        const localVertices = this._localVertices;
        if (weightData) {
            const data = verticesData.data;
            const intArray = data.intArray;
            const floatArray = data.floatArray;
            const vertexCount = intArray[verticesData.offset + BinaryOffset.MeshVertexCount];
            let weightFloatOffset = intArray[weightData.offset + BinaryOffset.WeigthFloatOffset];

            if (weightFloatOffset < 0) {
                weightFloatOffset += 65536; // Fixed out of bouds bug
            }

            for (
                let i = 0, iB = weightData.offset + BinaryOffset.WeigthBoneIndices + bones.length, iV = weightFloatOffset, iF = 0, lvi = 0;
                i < vertexCount;
                i++, lvi += 4
            ) {
                const boneCount = intArray[iB++];
                let xG = 0.0;
                let yG = 0.0;

                for (let j = 0; j < boneCount; ++j) {
                    const boneIndex = intArray[iB++];
                    const bone = bones[boneIndex];

                    if (bone !== null) {
                        const matrix = bone.globalTransformMatrix;
                        const weight = floatArray[iV++];
                        let xL = floatArray[iV++] * scale;
                        let yL = floatArray[iV++] * scale;

                        if (hasDeform) {
                            xL += deformVertices[iF++];
                            yL += deformVertices[iF++];
                        }

                        xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
                        yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;
                    }
                }

                localVertices[lvi] = xG;
                localVertices[lvi + 1] = -yG;
            }
        } else if (hasDeform) {
            const isSurface = this._parent._boneData.type !== BoneType.Bone;
            const data = verticesData.data;
            const intArray = data.intArray;
            const floatArray = data.floatArray;
            const vertexCount = intArray[verticesData.offset + BinaryOffset.MeshVertexCount];
            let vertexOffset = intArray[verticesData.offset + BinaryOffset.MeshFloatOffset];

            if (vertexOffset < 0) {
                vertexOffset += 65536; // Fixed out of bouds bug.
            }

            for (let i = 0, l = vertexCount, lvi = 0; i < l; i++, lvi += 4) {
                const x: number = floatArray[vertexOffset + i * 2] * scale + deformVertices[i * 2];
                const y: number = floatArray[vertexOffset + i * 2 + 1] * scale + deformVertices[i * 2 + 1];

                if (isSurface) {
                    const matrix = this._parent._getGlobalTransformMatrix(x, y);
                    localVertices[lvi] = matrix.a * x + matrix.c * y + matrix.tx;
                    localVertices[lvi + 1] = -matrix.b * x + matrix.d * y + matrix.ty;
                } else {
                    localVertices[lvi] = x;
                    localVertices[lvi + 1] = -y;
                }
            }
        }

        if (weightData) {
            this._identityTransform();
        }
    }
    /**
     * @en Reset current matrix to identity matrix.
     * @zh 重置当前矩阵为单位矩阵。
     */
    _identityTransform (): void {
        const m = this._matrix;
        m.m00 = 1.0;
        m.m01 = 0.0;
        m.m04 = -0.0;
        m.m05 = -1.0;
        m.m12 = 0.0;
        m.m13 = 0.0;
        this._worldMatrixDirty = true;
    }
    /**
     * @en Update transform of slot.
     * @zh 更新插槽的变换。
     */
    _updateTransform (): void {
        const m = this._matrix;
        m.m00 = this.globalTransformMatrix.a;
        m.m01 = this.globalTransformMatrix.b;
        m.m04 = -this.globalTransformMatrix.c;
        m.m05 = -this.globalTransformMatrix.d;

        if (this._childArmature) {
            m.m12 = this.globalTransformMatrix.tx;
            m.m13 = this.globalTransformMatrix.ty;
        } else {
            m.m12 = this.globalTransformMatrix.tx - (this.globalTransformMatrix.a * this._pivotX - this.globalTransformMatrix.c * this._pivotY);
            m.m13 = this.globalTransformMatrix.ty - (this.globalTransformMatrix.b * this._pivotX - this.globalTransformMatrix.d * this._pivotY);
        }
        this._worldMatrixDirty = true;
    }
    /**
     * @en Update world matrix of slot.
     * @zh 更新插槽的世界矩阵。
     */
    updateWorldMatrix (): void {
        if (!this._armature) return;

        const parentSlot = this._armature._parent as CCSlot;
        if (parentSlot) {
            parentSlot.updateWorldMatrix();
        }

        if (this._worldMatrixDirty) {
            this.calculWorldMatrix();
            const childArmature = this.childArmature;
            if (!childArmature) return;
            const slots = childArmature.getSlots();
            for (let i = 0, n = slots.length; i < n; i++) {
                const slot = slots[i] as CCSlot;
                if (slot) {
                    slot._worldMatrixDirty = true;
                }
            }
        }
    }
    /**
     * @engineInternal Since v3.7.2 this is an engine private function.
     */
    /* protected */ _mulMat (out: Mat4, a: Readonly<Mat4>, b: Readonly<Mat4>): void {
        const aa = a.m00; const ab = a.m01; const ac = a.m04; const ad = a.m05; const atx = a.m12; const aty = a.m13;
        const ba = b.m00; const bb = b.m01; const bc = b.m04; const bd = b.m05; const btx = b.m12; const bty = b.m13;
        if (ab !== 0 || ac !== 0) {
            out.m00 = ba * aa + bb * ac;
            out.m01 = ba * ab + bb * ad;
            out.m04 = bc * aa + bd * ac;
            out.m05 = bc * ab + bd * ad;
            out.m12 = aa * btx + ac * bty + atx;
            out.m13 = ab * btx + ad * bty + aty;
        } else {
            out.m00 = ba * aa;
            out.m01 = bb * ad;
            out.m04 = bc * aa;
            out.m05 = bd * ad;
            out.m12 = aa * btx + atx;
            out.m13 = ad * bty + aty;
        }
    }
}
