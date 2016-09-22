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
            this._rawDisplay = new _ccsg.Sprite;
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

    _disposeDisplay : function () {

    },

    _updateVisible : function () {
        this._renderDisplay.setVisible(this._parent.visible);
    },

    _updateBlendMode : function () {
        if (this._renderDisplay instanceof _ccsg.Sprite) {
            switch (this._blendMode) {
            case 0: // BlendMode Normal
                break;
            case 1: // BlendMode Add
                var texture = this._renderDisplay.getTexture();
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
                if (!currentTextureData.texture && textureAtlasTexture) {
                    // Create and cache texture
                    var rect = cc.rect(currentTextureData.region.x, currentTextureData.region.y,
                                       currentTextureData.region.width, currentTextureData.region.height);
                    var offset = cc.p(0, 0);
                    var size = cc.size(currentTextureData.region.width, currentTextureData.region.height);

                    currentTextureData.texture = new cc.SpriteFrame();
                    currentTextureData.texture.setTexture(textureAtlasTexture, rect, false, offset, size);
                }

                var currentTexture = this._armature._replacedTexture || (currentTextureData.texture ? currentTextureData.texture.getTexture() : null);
                if (currentTexture) {
                    if (this._meshData && this._display === this._meshDisplay) {
                        // TODO update the frame for mesh type
                        //var region = currentTextureData.region;
                        //var textureAtlasSize = currentTextureData.texture.getTexture().getContentSize();
                        //var displayVertices = new cc.V3F_C4B_T2F()
                    }
                    else {
                        var pivot = cc.p(currentDisplayData.pivot.x, currentDisplayData.pivot.y);
                        var rectData = currentTextureData.frame || currentTextureData.region;
                        var width = rectData.width;
                        var height = rectData.height;
                        if (!currentTextureData.frame && currentTextureData.rotated) {
                            width = rectData.height;
                            height = rectData.width;
                        }

                        if (currentDisplayData.isRelativePivot) {
                            pivot.x *= width;
                            pivot.y *= height;
                        }

                        if (currentTextureData.frame) {
                            pivot.x += currentTextureData.frame.x;
                            pivot.y += currentTextureData.frame.y;
                        }

                        if (rawDisplayData && rawDisplayData !== currentDisplayData) {
                            pivot.x += rawDisplayData.transform.x - currentDisplayData.transform.x;
                            pivot.y += rawDisplayData.transform.y - currentDisplayData.transform.y;
                        }

                        pivot.x = pivot.x / currentTextureData.region.width;
                        pivot.y = 1 - pivot.y / currentTextureData.region.height;

                        this._rawDisplay.setSpriteFrame(currentTextureData.texture);
                        if (currentTexture !== currentTextureData.texture.getTexture()) {
                            this._rawDisplay.setTexture(currentTexture);
                        }
                        this._rawDisplay.setAnchorPoint(pivot);
                    }

                    this._updateVisible();
                    return;
                }
            }
        }

        this._rawDisplay.setTexture(null);
        this._rawDisplay.setTextureRect(cc.rect(0, 0, 0, 0));
        this._rawDisplay.setAnchorPoint(cc.p(0, 0));
        this._rawDisplay.setVisible(false);
    },

    _updateMesh : function() {
        // TODO update the mesh
    },

    _updateTransform : function () {
        // update the transform
        if (this._renderDisplay) {
            this.global.fromMatrix(this.globalTransformMatrix);
            this._renderDisplay.setScale(this.global.scaleX, this.global.scaleY);
            this._renderDisplay.setRotationX(this.global.skewX * dragonBones.DragonBones.RADIAN_TO_ANGLE);
            this._renderDisplay.setRotationY(this.global.skewY * dragonBones.DragonBones.RADIAN_TO_ANGLE);
            this._renderDisplay.setPosition(this.global.x, -this.global.y);
        }
    }
});
