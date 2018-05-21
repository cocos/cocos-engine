/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

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

var v2Found = false;
if (cc.Scale9SpriteV2) {
    v2Found = true;
    cc.Scale9Sprite = cc.Scale9SpriteV2;
}

cc.Scale9Sprite.state = {NORMAL: 0, GRAY: 1, DISTORTION: 2};

/**
 * Enum for sprite type
 * @enum SpriteType
 */
cc.Scale9Sprite.RenderingType = cc.Enum({
    /**
     * @property {Number} SIMPLE
     */
    SIMPLE: 0,
    /**
     * @property {Number} SLICED
     */
    SLICED: 1,
    /*
     * @property {Number} TILED
     */
    TILED: 2,
    /*
     * @property {Number} FILLED
     */
    FILLED: 3
});

cc.Scale9Sprite.FillType = cc.Enum({
    HORIZONTAL: 0,
    VERTICAL: 1,
    RADIAL:2,
});

var s9sPrototype = cc.Scale9Sprite.prototype;

if (v2Found) {
    var _jsbSetContentSize = s9sPrototype.setContentSize;
    s9sPrototype.setContentSize = function (size, height) {
        if (void 0 !== height) {
            size = new cc.Size(size, height);
        }
        _jsbSetContentSize.call(this, size);
    };
    var _jsbSetAnchorPoint = s9sPrototype.setAnchorPoint;
    s9sPrototype.setAnchorPoint = function (anchorPoint, y) {
        if (void 0 !== y) {
            anchorPoint = new cc.Vec2(anchorPoint, y);
        }
        _jsbSetAnchorPoint.call(this, anchorPoint);
    };
}
else {
    s9sPrototype.setFillType = function () {};
    s9sPrototype.setFillCenter = function () {};
    s9sPrototype.setFillStart = function () {};
    s9sPrototype.setFillRange = function () {};
    s9sPrototype.enableTrimmedContentSize = function () {};

    s9sPrototype._lazyInit = function () {
        if (this._onceInit) return;
        this._onceInit = true;
        this._insets = {left: 0, right: 0, top: 0, bottom: 0};
        this._trim = {left: 0, right: 0, top: 0, bottom: 0};
        this._contentSizeTrimmed = new cc.Size(0, 0);
        this._anchorPointTrimmed = new cc.Vec2(0, 0);
        this._sizeAfterTrimmed = new cc.Size(0, 0);
    };

    s9sPrototype._applyInsetsContentAnchor = function () {
        var renderingType = this._renderingType || (this.getRenderingType && this.getRenderingType());
        var trimScaleX = 1;
        var trimScaleY = 1;
        if (renderingType === cc.Scale9Sprite.RenderingType.SIMPLE) {
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

    s9sPrototype._setBlendFunc = s9sPrototype.setBlendFunc;
    s9sPrototype.setBlendFunc = function (blendFunc, dst) {
        if (void 0 !== dst) {
            blendFunc = {
                src: blendFunc,
                dst: dst
            };
        }
        //in v3.3 blendFunc is not present
        if(this._setBlendFunc)
            this._setBlendFunc(blendFunc);
    };
    s9sPrototype._getContentSize = s9sPrototype.getContentSize;
    s9sPrototype.getContentSize = function () {
        return new cc.Size(this._contentSizeTrimmed);
    };

    s9sPrototype._setContentSize = s9sPrototype.setContentSize;
    s9sPrototype.setContentSize = function (size, height) {
        this._lazyInit();
        if (void 0 !== height) {
            size = new cc.Size(size, height);
        }
        this._contentSizeTrimmed = new cc.Size(size);
        this._applyInsetsContentAnchor();
    };

    s9sPrototype._getAnchorPoint = s9sPrototype.getAnchorPoint;
    s9sPrototype.getAnchorPoint = function () {
        return new cc.Vec2(this._anchorPointTrimmed);
    };

    s9sPrototype._setAnchorPoint = s9sPrototype.setAnchorPoint;
    s9sPrototype.setAnchorPoint = function (anchorPoint, y) {
        this._lazyInit();
        if (void 0 !== y) {
            anchorPoint = new cc.Vec2(anchorPoint, y);
        }
        this._anchorPointTrimmed = new cc.Vec2(anchorPoint);
        this._applyInsetsContentAnchor();
    };

    s9sPrototype._getInsetLeft = s9sPrototype.getInsetLeft;
    s9sPrototype._getInsetRight = s9sPrototype.getInsetRight;
    s9sPrototype._getInsetBottom = s9sPrototype.getInsetBottom;
    s9sPrototype._getInsetTop = s9sPrototype.getInsetTop;
    s9sPrototype.getInsetLeft = function () {
        return this._insets.left;
    };
    s9sPrototype.getInsetRight = function () {
        return this._insets.right;
    };
    s9sPrototype.getInsetBottom = function () {
        return this._insets.bottom;
    };
    s9sPrototype.getInsetTop = function () {
        return this._insets.top;
    };

    s9sPrototype._setInsetLeft = s9sPrototype.setInsetLeft;
    s9sPrototype.setInsetLeft = function (insetLeft) {
        this._lazyInit();
        this._insets.left = insetLeft;
        this._applyInsetsContentAnchor();
    };

    s9sPrototype._setInsetRight = s9sPrototype.setInsetRight;
    s9sPrototype.setInsetRight = function (insetRight) {
        this._lazyInit();
        this._insets.right = insetRight;
        this._applyInsetsContentAnchor();
    };

    s9sPrototype._setInsetTop = s9sPrototype.setInsetTop;
    s9sPrototype.setInsetTop = function (insetTop) {
        this._lazyInit();
        this._insets.top = insetTop;
        this._applyInsetsContentAnchor();
    };

    s9sPrototype._setInsetBottom = s9sPrototype.setInsetBottom;
    s9sPrototype.setInsetBottom = function (insetBottom) {
        this._lazyInit();
        this._insets.bottom = insetBottom;
        this._applyInsetsContentAnchor();
    };

    s9sPrototype._setSpriteFrame = s9sPrototype.setSpriteFrame;
    s9sPrototype.setSpriteFrame = function (spriteFrame) {
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
}