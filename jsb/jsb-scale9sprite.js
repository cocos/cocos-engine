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

// cc.Scale9Sprite

cc.Scale9Sprite.prototype._lazyInit = function () {
    if (this._onceInit) return;
    this._onceInit = true;
    this._insets = {left: 0, right: 0, top: 0, bottom: 0};
    this._trim = {left: 0, right: 0, top: 0, bottom: 0};
    this._contentSizeTrimmed = new cc.Size(0, 0);
    this._anchorPointTrimmed = new cc.Vec2(0, 0);
    this._sizeAfterTrimmed = new cc.Size(0, 0);
};

cc.Scale9Sprite.prototype._applyInsetsContentAnchor = function () {
    var renderingType = this._renderingType || (this.getRenderingType && this.getRenderingType());
    var trimScaleX = 1;
    var trimScaleY = 1;
    if (renderingType === cc.SpriteType.SIMPLE) {
        trimScaleX = this._contentSizeTrimmed.width / this._sizeAfterTrimmed.width;
        trimScaleY = this._contentSizeTrimmed.height / this._sizeAfterTrimmed.height;
    }
    //apply contentSize
    var contentSize = new cc.Size(0, 0);
    contentSize.width = this._contentSizeTrimmed.width + (this._trim.left + this._trim.right) * trimScaleX;
    contentSize.height = this._contentSizeTrimmed.height + (this._trim.top + this._trim.bottom) * trimScaleY;
    this._setContentSize(contentSize);

    //apply anchorpoint
    var anchorPoint = new cc.Vec2(0, 0);
    anchorPoint.x = (this._contentSizeTrimmed.width * this._anchorPointTrimmed.x) + this._trim.left * trimScaleX;
    anchorPoint.y = (this._contentSizeTrimmed.height * this._anchorPointTrimmed.y) + this._trim.bottom * trimScaleY;
    anchorPoint.x = anchorPoint.x / contentSize.width;
    anchorPoint.y = anchorPoint.y / contentSize.height;

    this._setAnchorPoint(anchorPoint);

    //apply capinsets
    var capinsets = new cc.Rect(0, 0, 0, 0);
    capinsets.x = this._trim.left + this._insets.left;
    capinsets.y = this._trim.top + this._insets.top;
    capinsets.width = this._sizeAfterTrimmed.width - this._insets.left - this._insets.right;
    capinsets.height = this._sizeAfterTrimmed.height - this._insets.top - this._insets.bottom;
    this.setCapInsets(capinsets);
};

cc.Scale9Sprite.prototype._setBlendFunc = cc.Scale9Sprite.prototype.setBlendFunc;
cc.Scale9Sprite.prototype.setBlendFunc = function (blendFunc, dst) {
    if (void 0 !== dst) {
        blendFunc = {
            src: blendFunc,
            dst: dst
        };
    }
    this._setBlendFunc(blendFunc);
};
cc.Scale9Sprite.prototype._getContentSize = cc.Scale9Sprite.prototype.getContentSize;
cc.Scale9Sprite.prototype.getContentSize = function () {
    return new cc.Size(this._contentSizeTrimmed);
};

cc.Scale9Sprite.prototype._setContentSize = cc.Scale9Sprite.prototype.setContentSize;
cc.Scale9Sprite.prototype.setContentSize = function (size, height) {
    this._lazyInit();
    if (void 0 !== height) {
        size = new cc.Size(size, height);
    }
    this._contentSizeTrimmed = new cc.Size(size);
    this._applyInsetsContentAnchor();
};

cc.Scale9Sprite.prototype._getAnchorPoint = cc.Scale9Sprite.prototype.getAnchorPoint;
cc.Scale9Sprite.prototype.getAnchorPoint = function () {
    return new cc.Vec2(this._anchorPointTrimmed);
};

cc.Scale9Sprite.prototype._setAnchorPoint = cc.Scale9Sprite.prototype.setAnchorPoint;
cc.Scale9Sprite.prototype.setAnchorPoint = function (anchorPoint, y) {
    this._lazyInit();
    if (void 0 !== y) {
        anchorPoint = new cc.Vec2(anchorPoint, y);
    }
    this._anchorPointTrimmed = new cc.Vec2(anchorPoint);
    this._applyInsetsContentAnchor();
};

cc.Scale9Sprite.prototype._getInsetLeft = cc.Scale9Sprite.prototype.getInsetLeft;
cc.Scale9Sprite.prototype._getInsetRight = cc.Scale9Sprite.prototype.getInsetRight;
cc.Scale9Sprite.prototype._getInsetBottom = cc.Scale9Sprite.prototype.getInsetBottom;
cc.Scale9Sprite.prototype._getInsetTop = cc.Scale9Sprite.prototype.getInsetTop;
cc.Scale9Sprite.prototype.getInsetLeft = function () {
    return this._insets.left;
};
cc.Scale9Sprite.prototype.getInsetRight = function () {
    return this._insets.right;
};
cc.Scale9Sprite.prototype.getInsetBottom = function () {
    return this._insets.bottom;
};
cc.Scale9Sprite.prototype.getInsetTop = function () {
    return this._insets.top;
};

cc.Scale9Sprite.prototype._setInsetLeft = cc.Scale9Sprite.prototype.setInsetLeft;
cc.Scale9Sprite.prototype.setInsetLeft = function (insetLeft) {
    this._lazyInit();
    this._insets.left = insetLeft;
    this._applyInsetsContentAnchor();
};

cc.Scale9Sprite.prototype._setInsetRight = cc.Scale9Sprite.prototype.setInsetRight;
cc.Scale9Sprite.prototype.setInsetRight = function (insetRight) {
    this._lazyInit();
    this._insets.right = insetRight;
    this._applyInsetsContentAnchor();
};

cc.Scale9Sprite.prototype._setInsetTop = cc.Scale9Sprite.prototype.setInsetTop;
cc.Scale9Sprite.prototype.setInsetTop = function (insetTop) {
    this._lazyInit();
    this._insets.top = insetTop;
    this._applyInsetsContentAnchor();
};

cc.Scale9Sprite.prototype._setInsetBottom = cc.Scale9Sprite.prototype.setInsetBottom;
cc.Scale9Sprite.prototype.setInsetBottom = function (insetBottom) {
    this._lazyInit();
    this._insets.bottom = insetBottom;
    this._applyInsetsContentAnchor();
};

cc.Scale9Sprite.prototype._setSpriteFrame = cc.Scale9Sprite.prototype.setSpriteFrame;
cc.Scale9Sprite.prototype.setSpriteFrame = function (spriteFrame) {
    this._lazyInit();
    var originalSize = spriteFrame.getOriginalSize();
    var spriteRect = spriteFrame.getRect();
    var offset = spriteFrame.getOffset();
    var leftTrim = (originalSize.width + (2 * offset.x) - spriteRect.width) / 2;
    var rightTrim = originalSize.width - leftTrim - spriteRect.width;
    var bottomTrim = (originalSize.height + (2 * offset.y) - spriteRect.height) / 2;
    var topTrim = originalSize.height - bottomTrim - spriteRect.height;
    this._trim.left = leftTrim;
    this._trim.right = rightTrim;
    this._trim.top = topTrim;
    this._trim.bottom = bottomTrim;
    this._sizeAfterTrimmed = new cc.Size(spriteRect.width, spriteRect.height);
    this._setSpriteFrame(spriteFrame);
    this._applyInsetsContentAnchor();
};