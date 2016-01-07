/****************************************************************************
 Copyright (c) 2015 Chukong Technologies Inc.

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

'use strict';

if (!cc.Scheduler.prototype.unscheduleAllForTarget) {
    cc.Scheduler.prototype.unscheduleAllForTarget = function (target) {
        this.unscheduleAllCallbacksForTarget(target);
    };
}

cc.SpriteFrame.prototype.initWithTexture = function (texture, rect, rotated, offset, originalSize, _uuid) {
    function check(texture) {
        if (texture && texture.isLoaded()) {
            var _x, _y;
            if (rotated) {
                _x = rect.x + rect.height;
                _y = rect.y + rect.width;
            }
            else {
                _x = rect.x + rect.width;
                _y = rect.y + rect.height;
            }
            if (_x > texture.getPixelWidth()) {
                cc.error(cc._LogInfos.RectWidth, _uuid);
            }
            if (_y > texture.getPixelHeight()) {
                cc.error(cc._LogInfos.RectHeight, _uuid);
            }
        }
    }

    if(arguments.length === 2)
        rect = cc.rectPointsToPixels(rect);

    offset = cc.p(0, 0);
    originalSize = originalSize || rect;
    rotated = rotated || false;

    if (this.insetTop === undefined) {
        this.insetTop = 0;
        this.insetBottom = 0;
        this.insetLeft = 0;
        this.insetRight = 0;
    }

    var locTexture;
    if (!texture && _uuid) {
        // deserialize texture from uuid
        var info = cc.AssetLibrary._getAssetInfoInRuntime(_uuid);
        if (!info) {
            cc.error('SpriteFrame: Failed to load sprite texture "%s"', _uuid);
            return;
        }

        this._textureFilename = info.url;

        locTexture = cc.textureCache.addImage(info.url);
        this._initWithTexture(locTexture, rect, rotated, offset, originalSize);
    }
    else {
        if (cc.js.isString(texture)){
            this._textureFilename = texture;
            locTexture = cc.textureCache.addImage(this._textureFilename);
            this._initWithTexture(locTexture, rect, rotated, offset, originalSize);
        } else if (texture instanceof cc.Texture2D) {
            this._textureFilename = '';
            this._initWithTexture(texture, rect, rotated, offset, originalSize);
        }
    }
    this.emit('load');
    check(this.getTexture());
    return true;
};