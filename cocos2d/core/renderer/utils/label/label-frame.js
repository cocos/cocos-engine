/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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

/**
 * !#en Class for Label Frame.
 * !#zh LabelFrame
 */
function LabelFrame () {
    // the location of the label on rendering texture
    this._rect = null;
    // uv data of frame
    this.uv = [];
    // texture of frame
    this._texture = null;
    // store original info before packed to dynamic atlas
    this._original = null;
}

LabelFrame.prototype = {
    constructor: LabelFrame,

     /**
     * !#en Returns the rect of the label frame in the texture.
     * !#zh 获取 LabelFrame 的纹理矩形区域
     * @method getRect
     * @return {Rect}
     */
    getRect: function () {
        return cc.rect(this._rect);
    },
    
    /**
     * !#en Sets the rect of the label frame in the texture.
     * !#zh 设置 LabelFrame 的纹理矩形区域
     * @method setRect
     * @param {Rect} rect
     */
    setRect: function (rect) {
        this._rect = rect;
        if (this._texture)
            this._calculateUV();
    },

    _setDynamicAtlasFrame (frame) {
        if (!frame) return;

        this._original = {
            _texture : this._texture,
            _x : this._rect.x,
            _y : this._rect.y
        }
        
        this._texture = frame.texture;
        this._rect.x = frame.x;
        this._rect.y = frame.y;
        this._calculateUV();
    },
    _resetDynamicAtlasFrame () {
        if (!this._original) return;
        this._rect.x = this._original._x;
        this._rect.y = this._original._y;
        this._texture = this._original._texture;
        this._original = null;
        this._calculateUV();
    },

    _refreshTexture: function (texture) {
        this._texture = texture;
        this._rect = cc.rect(0, 0, texture.width, texture.height);
        this._calculateUV();
    },

    _calculateUV() {
        let rect = this._rect,
            texture = this._texture,
            uv = this.uv,
            texw = texture.width,
            texh = texture.height;

        let l = texw === 0 ? 0 : rect.x / texw;
        let r = texw === 0 ? 0 : (rect.x + rect.width) / texw;
        let b = texh === 0 ? 0 : (rect.y + rect.height) / texh;
        let t = texh === 0 ? 0 : rect.y / texh;

        uv[0] = l;
        uv[1] = b;
        uv[2] = r;
        uv[3] = b;
        uv[4] = l;
        uv[5] = t;
        uv[6] = r;
        uv[7] = t;
    }
}

module.exports = LabelFrame;
