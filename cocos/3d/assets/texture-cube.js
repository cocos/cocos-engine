/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
// @ts-check
import Texture2D from '../../assets/CCTexture2D';
import gfx from '../../renderer/gfx';

let isComplete = function(elements) {
    return elements.reduce((acc, t) => acc = acc && t.complete, false);
};

export default class TextureCube extends Texture2D {

    constructor() {
        super();
        this._ctor = gfx.TextureCube;
    }

    handleLoadedTexture () {
        let image = this._image[0];
        if (!image || !image.width || !image.height)
            return;

        this.width = image.width;
        this.height = image.height;

        this._updateTexture([this._image]);

        //dispatch load event to listener.
        this.loaded = true;
        this.emit("load");

        this._image.forEach(img => {
            if (cc.macro.CLEANUP_IMAGE_CACHE && image instanceof HTMLImageElement) {
                // wechat game platform will cache image parsed data,
                // so image will consume much more memory than web, releasing it
                img.src = "";
                // Release image in loader cache
                cc.loader.removeItem(img.id);
            }
        });
    }

    initWithElement (element) {
        if (!element) return;
        this._image = element;
        if (CC_WECHATGAME || CC_QQPLAY || isComplete(element)
            || element[0] instanceof HTMLCanvasElement) {
            this.handleLoadedTexture();
            return;
        }
        element.forEach(() => addEventListener('load', () => {
            if (isComplete(element)) this.handleLoadedTexture();
        }));
        element.forEach(() => addEventListener('error', err => {
            cc.warnID(3119, err.message);
        }));
    }
}
