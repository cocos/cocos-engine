/*
 * Copyright (c) 2013-2016 Chukong Technologies Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

//
// cocos2d ui constants
//
// This helper file should be required after jsb_cocos2d.js
//

var ccui = ccui || {};

cc.EditBox = ccui.EditBox;

cc.Scale9Sprite = ccui.Scale9Sprite;

// // GUI
// /**
//  * @type {Object}
//  * UI Helper
//  */
// ccui.helper = ccui.Helper;

// // =====================Constants=====================
/*
 * UIWidget
 */
//bright style
ccui.Widget.BRIGHT_STYLE_NONE = -1;
ccui.Widget.BRIGHT_STYLE_NORMAL = 0;
ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT = 1;

//widget type
ccui.Widget.TYPE_WIDGET = 0;
ccui.Widget.TYPE_CONTAINER = 1;

//texture resource type
ccui.Widget.LOCAL_TEXTURE = 0;
ccui.Widget.PLIST_TEXTURE = 1;

//touch event type
ccui.Widget.TOUCH_BEGAN = 0;
ccui.Widget.TOUCH_MOVED = 1;
ccui.Widget.TOUCH_ENDED = 2;
ccui.Widget.TOUCH_CANCELED = 3;

//size type
ccui.Widget.SIZE_ABSOLUTE = 0;
ccui.Widget.SIZE_PERCENT = 1;

//position type
ccui.Widget.POSITION_ABSOLUTE = 0;
ccui.Widget.POSITION_PERCENT = 1;

//focus direction
ccui.Widget.LEFT = 0;
ccui.Widget.RIGHT = 1;
ccui.Widget.UP = 2;
ccui.Widget.DOWN = 3;

ccui.Scale9Sprite.POSITIONS_CENTRE = 0;                //CCScale9Sprite.js
ccui.Scale9Sprite.POSITIONS_TOP = 1;
ccui.Scale9Sprite.POSITIONS_LEFT = 2;
ccui.Scale9Sprite.POSITIONS_RIGHT = 3;
ccui.Scale9Sprite.POSITIONS_BOTTOM = 4;
ccui.Scale9Sprite.POSITIONS_TOPRIGHT = 5;
ccui.Scale9Sprite.POSITIONS_TOPLEFT = 6;
ccui.Scale9Sprite.POSITIONS_BOTTOMRIGHT = 7;
ccui.Scale9Sprite.POSITIONS_BOTTOMLEFT = 8;

/*
 * UIMargin
 */
ccui.Margin = cc.Class.extend({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    ctor: function (marginOrLeft, top, right, bottom) {
        if (top === undefined) {
            var uiMargin = marginOrLeft;
            this.left = uiMargin.left;
            this.top = uiMargin.top;
            this.right = uiMargin.right;
            this.bottom = uiMargin.bottom;
        }
        if (bottom !== undefined) {
            this.left = marginOrLeft;
            this.top = top;
            this.right = right;
            this.bottom = bottom;
        }
    },
    setMargin: function (l, t, r, b) {
        this.left = l;
        this.top = t;
        this.right = r;
        this.bottom = b;
    },
    equals: function (target) {
        return (this.left == target.left && this.top == target.top && this.right == target.right && this.bottom == target.bottom);
    }
});

ccui.MarginZero = function(){
    return new ccui.Margin(0,0,0,0);
};

// updateWithBatchNode deprecated in JSB
ccui.Scale9Sprite.prototype.updateWithBatchNode = function (batchNode, originalRect, rotated, capInsets) {
    var sprite = new cc.Sprite(batchNode.getTexture());
    this.updateWithSprite(sprite, originalRect, rotated, cc.p(0, 0), cc.size(originalRect.width, originalRect.height), capInsets);
};


if (ccui.WebView)
{
    ccui.WebView.EventType = {
        LOADING: 0,
        LOADED: 1,
        ERROR: 2,
        JS_EVALUATED: 3
    };

    ccui.WebView.prototype._loadURL = ccui.WebView.prototype.loadURL;
    ccui.WebView.prototype.loadURL = function (url) {
        if (url.indexOf("http://") >= 0 || url.indexOf("https://") >= 0)
        {
            this._loadURL(url);
        }
        else
        {
            this.loadFile(url);
        }
    };

    ccui.WebView.prototype.setEventListener = function(event, callback){
        switch(event)
        {
            case ccui.WebView.EventType.LOADING:
                this.setOnShouldStartLoading(callback);
                break;
            case ccui.WebView.EventType.LOADED:
                this.setOnDidFinishLoading(callback);
                break;
            case ccui.WebView.EventType.ERROR:
                this.setOnDidFailLoading(callback);
                break;
            case ccui.WebView.EventType.JS_EVALUATED:
                //this.setOnJSCallback(callback);
                cc.log("unsupport web event:" + event);
                break;
            default:
                cc.log("unsupport web event:" + event);
                break;
        }
    };
}
if (ccui.VideoPlayer)
{
    /**
     * The VideoPlayer support list of events
     * @type {{PLAYING: string, PAUSED: string, STOPPED: string, COMPLETED: string}}
     */
    ccui.VideoPlayer.EventType = {
        PLAYING: 0,
        PAUSED: 1,
        STOPPED: 2,
        COMPLETED: 3,
        META_LOADED: 4,
        CLICKED: 5,
        READY_TO_PLAY: 6
    };

    ccui.VideoPlayer.prototype._setURL = ccui.VideoPlayer.prototype.setURL;
    ccui.VideoPlayer.prototype.setURL = function (url) {
        if (url.indexOf("http://") >= 0 || url.indexOf("https://") >=0)
        {
            this._setURL(url);
        }
        else
        {
            this.setFileName(url);
        }
    };

    ccui.VideoPlayer.prototype.setEventListener = function(event, callback){
        if (!this.videoPlayerCallback)
        {
            this.videoPlayerCallback = function(sender, eventType){
                cc.log("videoEventCallback eventType:" + eventType);
                switch (eventType) {
                  case 0:
                      this["VideoPlayer_"+ccui.VideoPlayer.EventType.PLAYING] && this["VideoPlayer_"+ccui.VideoPlayer.EventType.PLAYING](sender);
                      break;
                  case 1:
                      this["VideoPlayer_"+ccui.VideoPlayer.EventType.PAUSED] && this["VideoPlayer_"+ccui.VideoPlayer.EventType.PAUSED](sender);
                      break;
                  case 2:
                      this["VideoPlayer_"+ccui.VideoPlayer.EventType.STOPPED] && this["VideoPlayer_"+ccui.VideoPlayer.EventType.STOPPED](sender);
                      break;
                  case 3:
                      this["VideoPlayer_"+ccui.VideoPlayer.EventType.COMPLETED] && this["VideoPlayer_"+ccui.VideoPlayer.EventType.COMPLETED](sender);
                      break;
                  case 4:
                      this["VideoPlayer_"+ccui.VideoPlayer.EventType.META_LOADED] && this["VideoPlayer_"+ccui.VideoPlayer.EventType.META_LOADED](sender);
                      break;
                  case 5:
                      this["VideoPlayer_"+ccui.VideoPlayer.EventType.CLICKED] && this["VideoPlayer_"+ccui.VideoPlayer.EventType.CLICKED](sender);
                      break;
                  case 6:
                      this["VideoPlayer_"+ccui.VideoPlayer.EventType.READY_TO_PLAY] && this["VideoPlayer_"+ccui.VideoPlayer.EventType.READY_TO_PLAY](sender);
                      break;
                  default:
                      break;
                }
            };
            this.addEventListener(this.videoPlayerCallback);
        }
        this["VideoPlayer_"+event] = callback;
    };
}

/*
 * UIWidget temporary solution to addChild
 * addNode and addChild function should be merged in ccui.Widget
 */
ccui.Widget.prototype.addNode = ccui.Widget.prototype.addChild;
ccui.Widget.prototype.getSize = ccui.Widget.prototype.getContentSize;
ccui.Widget.prototype.setSize = ccui.Widget.prototype.setContentSize;

/*
 * UIWidget's event listeners wrapper
 */
ccui.Widget.prototype._addTouchEventListener = ccui.Widget.prototype.addTouchEventListener;
ccui.Widget.prototype.addTouchEventListener = function (selector, target)
{
    var realCallback;
    var realTarget;

    if (target && (typeof target === "function")) {
        realCallback = target;
        realTarget = selector;
    }
    else if (selector && (typeof selector === "function")) {
        realCallback = selector;
        realTarget = target;
    }

    if (realCallback) {
        if (realTarget)
            this._addTouchEventListener( realCallback.bind(realTarget) );
        else
            this._addTouchEventListener(realCallback);
    }
    else {
        cc.log("ccui.Widget.addTouchEventListener error: callback is null");
    }
};
