/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

dragonBones.CCTextureAtlasData = cc.Class({
    extends: dragonBones.TextureAtlasData,
    name: "dragonBones.CCTextureAtlasData",

    properties: {
        _renderTexture: {
            default: null,
            serializable: false
        },

        renderTexture: {
            get () {
                return this._renderTexture;
            },
            set (value) {
                this._renderTexture = value;
                if (value) {
                    for (let k in this.textures) {
                        let textureData = this.textures[k];
                        if (!textureData.spriteFrame) {
                            let rect = null;
                            if (textureData.rotated) {
                                rect = cc.rect(textureData.region.x, textureData.region.y,
                                    textureData.region.height, textureData.region.width);
                            } else {
                                rect = cc.rect(textureData.region.x, textureData.region.y,
                                    textureData.region.width, textureData.region.height);
                            }
                            let offset = cc.v2(0, 0);
                            let size = cc.size(rect.width, rect.height);
                            textureData.spriteFrame = new cc.SpriteFrame();
                            textureData.spriteFrame.setTexture(value, rect, false, offset, size);
                        }
                    }
                } else {
                    for (let k in this.textures) {
                        let textureData = this.textures[k];
                        textureData.spriteFrame = null;
                    }
                }
                
            },
        }
    },

    statics: {
        toString: function () {
            return "[class dragonBones.CCTextureAtlasData]";
        }
    },

    _onClear: function () {
        dragonBones.TextureAtlasData.prototype._onClear.call(this);
        this.renderTexture = null;
    },

    createTexture : function() {
        return dragonBones.BaseObject.borrowObject(dragonBones.CCTextureData);
    }


});

dragonBones.CCTextureData = cc.Class({
    extends: dragonBones.TextureData,
    name: "dragonBones.CCTextureData",

    properties: {
        spriteFrame: {
            default: null,
            serializable: false
        },
    },

    statics: {
        toString: function () {
            return "[class dragonBones.CCTextureData]";
        }
    },

    _onClear: function () {
        dragonBones.TextureData.prototype._onClear.call(this);
        this.spriteFrame = null;
    }
});
