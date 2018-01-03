/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const renderEngine = require('../../cocos2d/core/renderer/render-engine');
const math = renderEngine.math;

const BinaryOffset = dragonBones.BinaryOffset;
const BoneType  = dragonBones.BoneType;

let _matrix = math.mat4.create();

dragonBones.CCSlot = cc.Class({
    name: 'dragonBones.CCSlot',
    extends: dragonBones.Slot,

    ctor () {
        this._vertices = [];
        this._localVertices = [];
        this._indices = [];
        this._matrix = math.mat4.create();
        this._worldMatrix = math.mat4.create();
        this._visible = false;
    },

    statics : {
        toString: function () {
            return "[class dragonBones.CCSlot]";
        }
    },

    _onUpdateDisplay () {
        if (this._childArmature) {
            this._childArmature._isChildArmature = true;
        }
    },

    _initDisplay (value) {
    },

    _addDisplay () {
        this._visible = true;

        if (!CC_EDITOR) {
            this._rawDisplay.parent = this._armature.display.node;
        }
    },

    _replaceDisplay (value) {
        if (value instanceof dragonBones.ArmatureDisplay) {
            value.node.parent = null;
        }
        
        if (this._display instanceof dragonBones.ArmatureDisplay) {
            this._display.node.parent = this._armature.display.node;
        }
    },

    _removeDisplay () {
        this._visible = false;

        if (!CC_EDITOR) {
            this._rawDisplay.parent = null;
        }
    },

    _disposeDisplay (object) {

    },

    _updateVisible () {
    },

    _updateZOrder: function() {
    },

    _updateBlendMode () {
        return;
        if (this._renderDisplay instanceof cc.Scale9Sprite) {
            switch (this._blendMode) {
            case 0: // BlendMode Normal
                break;
            case 1: // BlendMode Add
                let texture = this._renderDisplay._spriteFrame.getTexture();
                if (texture && texture.hasPremultipliedAlpha()) {
                    this._renderDisplay.setBlendFunc(cc.BlendFunc.BlendFactor.ONE, cc.BlendFunc.BlendFactor.ONE);
                }
                else {
                    this._renderDisplay.setBlendFunc(cc.BlendFunc.BlendFactor.SRC_ALPHA, cc.BlendFunc.BlendFactor.ONE);
                }
                break;
            default:
                break;
            }
        }
        else if (this._childArmature) {
            let childSlots = this._childArmature.getSlots();
            for (let i = 0, l = childSlots.length; i < l; i++) {
                let slot = childSlots[i];
                slot._blendMode = this._blendMode;
                slot._updateBlendMode();
            }
        }
    },

    _updateColor () {
        let r = this._colorTransform.redMultiplier * 255;
        let g = this._colorTransform.greenMultiplier * 255;
        let b = this._colorTransform.blueMultiplier * 255;
        let a = this._colorTransform.alphaMultiplier * 255;
        this._color = ((a<<24) >>> 0) + (b<<16) + (g<<8) + r;
    },

    _updateFrame () {
        this._vertices.length = 0;
        this._indices.length = 0;
        let vertices = this._vertices,
            indices = this._indices,
            localVertices = this._localVertices;

        vertices.length = 0;
        indices.length = 0;
        localVertices.length = 0;

        let currentTextureData = this._textureData;

        // update the frame
        if (!this._display || this._displayIndex < 0 || !currentTextureData) return;
        let currentDisplayData = this._displayIndex < this.rawDisplayDatas.length ? this.rawDisplayDatas[this._displayIndex] : null;;

        let textureAtlas = this._armature._replacedTexture || currentTextureData.parent.renderTexture;
        if (textureAtlas && (!currentTextureData.spriteFrame || currentTextureData.spriteFrame.getTexture() !== textureAtlas)) {
            // Create and cache texture
            let rect = cc.rect(currentTextureData.region.x, currentTextureData.region.y,
                                currentTextureData.region.width, currentTextureData.region.height);
            let offset = cc.p(0, 0);
            let size = cc.size(currentTextureData.region.width, currentTextureData.region.height);

            currentTextureData.spriteFrame = new cc.SpriteFrame();
            currentTextureData.spriteFrame.setTexture(textureAtlas, rect, false, offset, size);
        }

        let textureAtlasWidth = textureAtlas.width;
        let textureAtlasHeight = textureAtlas.height;
        let region = currentTextureData.region;

        let meshData = this._meshData;
        if (meshData) {
            const scale = this._armature._armatureData.scale;
            const data = meshData.parent.parent.parent;
            const intArray = data.intArray;
            const floatArray = data.floatArray;
            const vertexCount = intArray[meshData.offset + BinaryOffset.MeshVertexCount];
            const triangleCount = intArray[meshData.offset + BinaryOffset.MeshTriangleCount];
            let vertexOffset = intArray[meshData.offset + BinaryOffset.MeshFloatOffset];

            if (vertexOffset < 0) {
                vertexOffset += 65536; // Fixed out of bouds bug. 
            }

            const uvOffset = vertexOffset + vertexCount * 2;

            for (let i = 0, l = vertexCount; i < l; i++) {
                let x = floatArray[vertexOffset + i*2];
                let y = -floatArray[vertexOffset + i*2 + 1]; 

                let u = (region.x + floatArray[uvOffset + i*2] * region.width) / textureAtlasWidth;
                let v = (region.y + floatArray[uvOffset + i*2 + 1] * region.height) / textureAtlasHeight;

                vertices.push({ x, y, u, v});
                localVertices.push({ x, y});
            }

            for (let i = 0; i < triangleCount * 3; ++i) {
                indices.push(intArray[meshData.offset + BinaryOffset.MeshVertexIndices + i]);
            }

            this._pivotX = 0;
            this._pivotY = 0;
        }
        else {
            let scale = this._armature.armatureData.scale;
            this._pivotX = currentDisplayData.pivot.x;
            this._pivotY = currentDisplayData.pivot.y;

            let rectData = currentTextureData.frame || currentTextureData.region;
            let width = rectData.width * scale;
            let height = rectData.height * scale;
            if (!currentTextureData.frame && currentTextureData.rotated) {
                width = rectData.height;
                height = rectData.width;
            }

            this._pivotX *= width;
            this._pivotY *= height;

            if (currentTextureData.frame) {
                this._pivotX += currentTextureData.frame.x * scale;
                this._pivotY += currentTextureData.frame.y * scale;
            }

            this._pivotY -= region.height * scale;
            
            for (let i = 0; i < 4; i++) {
                vertices.push({});
                localVertices.push({});
            }

            let l = region.x / textureAtlasWidth;
            let b = (region.y + region.height) / textureAtlasHeight;
            let r = (region.x + region.width) / textureAtlasWidth;
            let t = region.y / textureAtlasHeight;
            vertices[0].u = l; vertices[0].v = b;
            vertices[1].u = r; vertices[1].v = b;
            vertices[2].u = l; vertices[2].v = t;
            vertices[3].u = r; vertices[3].v = t;

            localVertices[0].x = localVertices[2].x = vertices[0].x = vertices[2].x = 0;
            localVertices[1].x = localVertices[3].x = vertices[1].x = vertices[3].x = region.width;
            localVertices[0].y = localVertices[1].y = vertices[0].y = vertices[1].y = 0;
            localVertices[2].y = localVertices[3].y = vertices[2].y = vertices[3].y = region.height;

            indices[0] = 0;
            indices[1] = 1;
            indices[2] = 2;
            indices[3] = 1;
            indices[4] = 3;
            indices[5] = 2;

            this._blendModeDirty = true;
        }
    },

    _updateMesh : function() {
        const scale = this._armature._armatureData.scale;
        const meshData = this._meshData;
        const hasDeform = this._deformVertices.length > 0 && meshData.inheritDeform;
        const weight = meshData.weight;

        let localVertices = this._localVertices;
        if (weight !== null) {
            const data = meshData.parent.parent.parent;
            const intArray = data.intArray;
            const floatArray = data.floatArray;
            const vertexCount = intArray[meshData.offset + BinaryOffset.MeshVertexCount];
            let weightFloatOffset = intArray[weight.offset + BinaryOffset.WeigthFloatOffset];

            if (weightFloatOffset < 0) {
                weightFloatOffset += 65536; // Fixed out of bouds bug. 
            }

            for (
                let i = 0, iB = weight.offset + BinaryOffset.WeigthBoneIndices + weight.bones.length, iV = weightFloatOffset, iF = 0;
                i < vertexCount;
                ++i
            ) {
                const boneCount = intArray[iB++];
                let xG = 0.0, yG = 0.0;

                for (let j = 0; j < boneCount; ++j) {
                    const boneIndex = intArray[iB++];
                    const bone = this._meshBones[boneIndex];

                    if (bone !== null) {
                        const matrix = bone.globalTransformMatrix;
                        const weight = floatArray[iV++];
                        let xL = floatArray[iV++] * scale;
                        let yL = floatArray[iV++] * scale;

                        if (hasDeform) {
                            xL += this._deformVertices[iF++];
                            yL += this._deformVertices[iF++];
                        }

                        xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
                        yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;
                    }
                }

                localVertices[i].x = xG;
                localVertices[i].y = -yG;
            }
        }
        else if (hasDeform) {
            const isSurface = this._parent._boneData.type !== BoneType.Bone;
            // const isGlue = meshData.glue !== null; TODO
            const data = meshData.parent.parent.parent;
            const intArray = data.intArray;
            const floatArray = data.floatArray;
            const vertexCount = intArray[meshData.offset + BinaryOffset.MeshVertexCount];
            let vertexOffset = intArray[meshData.offset + BinaryOffset.MeshFloatOffset];

            if (vertexOffset < 0) {
                vertexOffset += 65536; // Fixed out of bouds bug. 
            }

            for (let i = 0, l = vertexCount; i < l; i ++) {
                const x = floatArray[vertexOffset + i*2] * scale + this._deformVertices[i*2];
                const y = floatArray[vertexOffset + i*2 + 1] * scale + this._deformVertices[i*2 + 1];

                if (isSurface) {
                    const matrix = this._parent._getGlobalTransformMatrix(x, y);
                    localVertices[i].x = matrix.a * x + matrix.c * y + matrix.tx;
                    localVertices[i].y = -matrix.b * x + matrix.d * y + matrix.ty;
                }
                else {
                    localVertices[i].x = x;
                    localVertices[i].y = -y;
                }
            }
        }

        this._updateVertices();
    },

    _updateTransform () {
        let t = this._matrix;
        t.m00 = this.globalTransformMatrix.a;
        t.m01 = -this.globalTransformMatrix.b;
        t.m04 = -this.globalTransformMatrix.c;
        t.m05 = this.globalTransformMatrix.d;
        t.m12 = this.globalTransformMatrix.tx - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
        t.m13 = -(this.globalTransformMatrix.ty - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY));

        if (this._display instanceof dragonBones.ArmatureDisplay) {
            let node = this._display.node;
            math.mat4.copy(node._matrix, t);
            node._localMatDirty = false;
            node._worldMatDirty = true;
        }

        this._updateVertices();
    },

    _updateVertices () {
        let t = this._matrix;
        let a = t.m00, b = t.m01, c = t.m04, d = t.m05, tx = t.m12, ty = t.m13;

        let vertices = this._vertices;
        let localVertices = this._localVertices;
        for (let i = 0, l = vertices.length; i < l; i++) {
            let x = localVertices[i].x;
            let y = localVertices[i].y;

            vertices[i].x = a * x + c * y + tx;
            vertices[i].y = b * x + d * y + ty;
        }
    }
});
