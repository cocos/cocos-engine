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

const EventTarget = require("../event/event-target");

/**
 * !#en Class for Texture Frame.
 * !#zh 碎图资源类。
 * @class Frame
 * @extends Asset
 */
var Frame = cc.Class({
    name: 'cc.Frame',
    mixins: [EventTarget],
    ctor() {
        // the location of the sprite on rendering texture
        this._rect = null;
        // uv data of frame
        this.uv = [];
        // texture of frame
        this._texture = null;
        // store original info before packed to dynamic atlas
        this._original = null;
    },
    /**
     * !#en Returns the rect of the sprite frame in the texture.
     * !#zh 获取 SpriteFrame 的纹理矩形区域
     * @method getRect
     * @return {Rect}
     */
    getRect: function () {
        return cc.rect(this._rect);
    },
    /**
     * !#en Sets the rect of the sprite frame in the texture.
     * !#zh 设置 SpriteFrame 的纹理矩形区域
     * @method setRect
     * @param {Rect} rect
     */
    setRect: function (rect) {
        this._rect = rect;
        if (this._texture)
            this._calculateUV();
    },
    _checkRect: function (texture) {
        let rect = this._rect;
        let maxX = rect.x, maxY = rect.y;
        if (this._rotated) {
            maxX += rect.height;
            maxY += rect.width;
        }
        else {
            maxX += rect.width;
            maxY += rect.height;
        }
        if (maxX > texture.width) {
            cc.errorID(3300, texture.url + '/' + this.name, maxX, texture.width);
        }
        if (maxY > texture.height) {
            cc.errorID(3400, texture.url + '/' + this.name, maxY, texture.height);
        }
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
        this._rect.x = this._original._x;
        this._rect.y = this._original._y;
        this._texture = this._original._texture;
        this._original = null;
        this._calculateUV();
    },
    _textureLoadedCallback() {
        let self = this;
        let texture = this._texture;
        if (!texture) {
            // clearTexture called while loading texture...
            return;
        }
        let w = texture.width,
            h = texture.height;

        if (self._rotated && cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            // TODO: rotate texture for canvas
            // self._texture = _ccsg.Sprite.CanvasRenderCmd._createRotatedTexture(texture, self.getRect());
            self._rotated = false;
            w = self._texture.width;
            h = self._texture.height;
            self._rect = cc.rect(0, 0, w, h);
        }

        if (self._rect) {
            self._checkRect(self._texture);
        } else {
            self._rect = cc.rect(0, 0, w, h);
        }

        self._calculateUV();

        // dispatch 'load' event of cc.SpriteFrame
        self.emit("load");
    },
    /*
     * !#en Sets the texture of the frame.
     * !#zh 设置使用的纹理实例。
     * @method _refreshTexture
     * @param {Texture2D} texture
     */
    _refreshTexture: function (texture) {
        this._texture = texture;
        if (texture.loaded) {
            this._textureLoadedCallback();
        } else {
            texture.once('load', this._textureLoadedCallback, this);
        }
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
});

cc.Frame = module.exports = Frame;
