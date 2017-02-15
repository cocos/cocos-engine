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

dragonBones.CCSlot = cc.Class({
    name: 'dragonBones.CCSlot',
    extends: dragonBones.Slot,
    _renderDisplay : null,

    statics : {
        toString: function () {
            return "[class dragonBones.CCSlot]";
        }
    },

    _onClear : function () {
        dragonBones.Slot.prototype._onClear.call(this);
        this._renderDisplay = null;
    },

    _onUpdateDisplay : function () {
        if (!this._rawDisplay) {
            this._rawDisplay = new cc.Scale9Sprite();
        }

        this._renderDisplay = this._display || this._rawDisplay;
    },

    _initDisplay : function (value) {

    },

    _addDisplay : function () {
        var container = this._armature._display;
        container.addChild(this._renderDisplay);
    },

    _replaceDisplay : function (value) {
        var container = this._armature._display;
        var prevDisplay = value;
        container.addChild(this._renderDisplay, prevDisplay.getLocalZOrder());
        container.removeChild(prevDisplay);
    },

    _removeDisplay : function () {
        this._renderDisplay.removeFromParent();
    },

    _disposeDisplay : function (object) {

    },

    _updateVisible : function () {
        this._renderDisplay.setVisible(this._parent.visible);
    },

    _updateZOrder: function() {
        if (!this._renderDisplay._parent) {
            var container = this._armature._display;
            container.addChild(this._renderDisplay, this._zOrder);
        } else {
            this._renderDisplay.setLocalZOrder(this._zOrder);
        }
    },

    _updateBlendMode : function () {
        if (this._renderDisplay instanceof cc.Scale9Sprite) {
            switch (this._blendMode) {
            case 0: // BlendMode Normal
                break;
            case 1: // BlendMode Add
                var texture = this._renderDisplay._spriteFrame.getTexture();
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
            var childSlots = this._childArmature.getSlots();
            for (var i = 0, l = childSlots.length; i < l; i++) {
                var slot = childSlots[i];
                slot._blendMode = this._blendMode;
                slot._updateBlendMode();
            }
        }
    },

    _updateColor : function() {
        this._renderDisplay.setOpacity(this._colorTransform.alphaMultiplier * 255);
        var r = this._colorTransform.redMultiplier * 255;
        var g = this._colorTransform.greenMultiplier * 255;
        var b = this._colorTransform.blueMultiplier * 255;
        this._renderDisplay.setColor(cc.color(r, g, b));
    },

    _updateFilters : function () {

    },

    _updateFrame : function () {
        // update the frame
        if (this._display && this._displayIndex >= 0) {
            var rawDisplayData = this._displayIndex < this._displayDataSet.displays.length ? this._displayDataSet.displays[this._displayIndex] : null;
            var replacedDisplayData = this._displayIndex < this._replacedDisplayDataSet.length ? this._replacedDisplayDataSet[this._displayIndex] : null;
            var currentDisplayData = replacedDisplayData || rawDisplayData;
            var currentTextureData = currentDisplayData.texture;

            if (currentTextureData) {
                var textureAtlasTexture = currentTextureData.parent.texture;
                if (textureAtlasTexture && (!currentTextureData.texture || currentTextureData.texture.getTexture() !== textureAtlasTexture)) {
                    // Create and cache texture
                    var rect = cc.rect(currentTextureData.region.x, currentTextureData.region.y,
                                       currentTextureData.region.width, currentTextureData.region.height);
                    var offset = cc.p(0, 0);
                    var size = cc.size(currentTextureData.region.width, currentTextureData.region.height);

                    currentTextureData.texture = new cc.SpriteFrame();
                    currentTextureData.texture.setTexture(textureAtlasTexture, rect, false, offset, size);
                }

                var texture = this._armature._replacedTexture || (currentTextureData.texture ? currentTextureData.texture.getTexture() : null);
                if (this._meshData && this._display === this._meshDisplay) {
                    var region = currentTextureData.region;
                    var textureAtlasSize = currentTextureData.texture.getTexture().getContentSize();
                    var displayVertices = [], vertexIndices = [];
                    var boundsRect = cc.rect(999999, 999999, -999999, -999999);

                    if (this._meshData !== rawDisplayData.mesh && rawDisplayData && rawDisplayData !== currentDisplayData)
                    {
                        this._pivotX = rawDisplayData.transform.x - currentDisplayData.transform.x;
                        this._pivotY = rawDisplayData.transform.y - currentDisplayData.transform.y;
                    }
                    else
                    {
                        this._pivotX = 0;
                        this._pivotY = 0;
                    }

                    var i, n;
                    for (i = 0, n = this._meshData.uvs.length; i < n; i +=2) {
                        var x = this._meshData.vertices[i];
                        var y = this._meshData.vertices[i + 1];
                        var u = (region.x + this._meshData.uvs[i] * region.width) / textureAtlasSize.width;
                        var v = (region.y + this._meshData.uvs[i + 1] * region.height) / textureAtlasSize.height;
                        displayVertices.push({ x: x, y: -y, u: u, v: v });

                        if (boundsRect.x > x)
                        {
                            boundsRect.x = x;
                        }

                        if (boundsRect.width < x)
                        {
                            boundsRect.width = x;
                        }

                        if (boundsRect.y > -y)
                        {
                            boundsRect.y = -y;
                        }

                        if (boundsRect.height < -y)
                        {
                            boundsRect.height = -y;
                        }
                    }

                    boundsRect.width -= boundsRect.x;
                    boundsRect.height -= boundsRect.y;

                    for (i = 0, n = this._meshData.vertexIndices.length; i < n; ++i)
                    {
                        vertexIndices.push(this._meshData.vertexIndices[i]);
                    }
                    var polygonInfo = {
                        triangles: {
                            verts: displayVertices,
                            indices: vertexIndices
                        },
                        rect: boundsRect
                    };
                    this._meshDisplay.setSpriteFrame(currentTextureData.texture);
                    if (texture != currentTextureData.texture.getTexture())
                    {
                        this._meshDisplay.setTexture(texture);
                    }
                    this._meshDisplay.setMeshPolygonInfo(polygonInfo);
                    this._meshDisplay.setContentSize(cc.size(boundsRect.width, boundsRect.height));

                    if (this._meshData.skinned) {
                        this._meshDisplay.setScale(1, 1);
                        this._meshDisplay.setRotationX(0);
                        this._meshDisplay.setRotationY(0);
                        this._meshDisplay.setPosition(0, 0);
                    }
                    this._meshDisplay.setAnchorPoint(cc.p(0, 0));
                }
                else {
                    var scale = this._armature.armatureData.scale;
                    this._pivotX = currentDisplayData.pivot.x;
                    this._pivotY = currentDisplayData.pivot.y;

                    if (currentDisplayData.isRelativePivot) {
                        var rectData = currentTextureData.frame || currentTextureData.region;
                        var width = rectData.width * scale;
                        var height = rectData.height * scale;
                        if (!currentTextureData.frame && currentTextureData.rotated) {
                            width = rectData.height;
                            height = rectData.width;
                        }

                        this._pivotX *= width;
                        this._pivotY *= height;
                    }

                    if (currentTextureData.frame) {
                        this._pivotX += currentTextureData.frame.x * scale;
                        this._pivotY += currentTextureData.frame.y * scale;
                    }

                    if (rawDisplayData && rawDisplayData !== currentDisplayData) {
                        this._pivotX += rawDisplayData.transform.x - currentDisplayData.transform.x;
                        this._pivotY += rawDisplayData.transform.y - currentDisplayData.transform.y;
                    }
                    this._pivotY -= currentTextureData.region.height * scale;

                    this._rawDisplay.setSpriteFrame(currentTextureData.texture);
                    this._rawDisplay.setContentSize(currentTextureData.texture.getOriginalSize());
                    if (texture !== currentTextureData.texture.getTexture()) {
                        this._rawDisplay.setTexture(texture);
                    }
                    this._blendModeDirty = true;
                }

                this._updateVisible();
                return;
            }
        }

        this._pivotX = 0;
        this._pivotY = 0;
        this._rawDisplay.setTexture(null);
        this._rawDisplay.setVisible(false);
        this._rawDisplay.setPosition(this.origin.x, this.origin.y);
    },

    _updateMesh : function() {
        var meshDisplay = this._meshDisplay;
        var polygonInfo = meshDisplay.getMeshPolygonInfo();
        if (!meshDisplay || !polygonInfo)
        {
            return;
        }

        var hasFFD = this._ffdVertices.length > 0;
        var displayVertices = polygonInfo.triangles.verts;
        var boundsRect = cc.rect(999999, 999999, -999999, -999999);

        var iH = 0, xG = 0, yG = 0, i, l;
        if (this._meshData.skinned)
        {
            var iF = 0;
            for (i = 0, l = this._meshData.vertices.length; i < l; i += 2)
            {
                iH = Math.floor(i / 2);
                var boneIndices = this._meshData.boneIndices[iH];
                var boneVertices = this._meshData.boneVertices[iH];
                var weights = this._meshData.weights[iH];

                xG = 0; yG = 0;
                for (var iB = 0, lB = boneIndices.length; iB < lB; ++iB)
                {
                    var bone = this._meshBones[boneIndices[iB]];
                    var matrix = bone.globalTransformMatrix;
                    var weight = weights[iB];

                    var xL = 0, yL = 0;
                    if (hasFFD)
                    {
                        xL = boneVertices[iB * 2] + this._ffdVertices[iF];
                        yL = boneVertices[iB * 2 + 1] + this._ffdVertices[iF + 1];
                    }
                    else
                    {
                        xL = boneVertices[iB * 2];
                        yL = boneVertices[iB * 2 + 1];
                    }

                    xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
                    yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;

                    iF += 2;
                }

                displayVertices[iH].x = xG;
                displayVertices[iH].y = -yG;
                if (boundsRect.x > xG)
                {
                    boundsRect.x = xG;
                }

                if (boundsRect.width < xG)
                {
                    boundsRect.width = xG;
                }

                if (boundsRect.y > -yG)
                {
                    boundsRect.y = -yG;
                }

                if (boundsRect.height < -yG)
                {
                    boundsRect.height = -yG;
                }
            }
        }
        else if (hasFFD)
        {
            var vertices = this._meshData.vertices;
            for (i = 0, l = this._meshData.vertices.length; i < l; i += 2)
            {
                iH = Math.floor(i / 2);
                xG = vertices[i] + this._ffdVertices[i];
                yG = vertices[i + 1] + this._ffdVertices[i + 1];

                displayVertices[iH].x = xG;
                displayVertices[iH].y = -yG;
                if (boundsRect.x > xG)
                {
                    boundsRect.x = xG;
                }

                if (boundsRect.width < xG)
                {
                    boundsRect.width = xG;
                }

                if (boundsRect.y > -yG)
                {
                    boundsRect.y = -yG;
                }

                if (boundsRect.height < -yG)
                {
                    boundsRect.height = -yG;
                }
            }
        }

        boundsRect.width -= boundsRect.x;
        boundsRect.height -= boundsRect.y;

        polygonInfo.rect = boundsRect;
        var transform = meshDisplay.getNodeToParentTransform();
        meshDisplay.setContentSize(cc.size(boundsRect.width, boundsRect.height));
        meshDisplay.setMeshPolygonInfo(polygonInfo);
        this._renderDisplay._renderCmd.setNodeToParentTransform(transform);
    },

    _updateTransform : function () {
        // update the transform
        var transform = {
            a: this.globalTransformMatrix.a,
            b: -this.globalTransformMatrix.b,
            c: -this.globalTransformMatrix.c,
            d: this.globalTransformMatrix.d,
            tx: this.globalTransformMatrix.tx - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY),
            ty: -(this.globalTransformMatrix.ty - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY))
        };
        this._renderDisplay._renderCmd.setNodeToParentTransform(transform);
    }
});
