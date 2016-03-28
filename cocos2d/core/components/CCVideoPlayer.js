/*global _ccsg */

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

var VideoPlayer = cc.Class({
    name: 'cc.VideoPlayer',
    extends: cc._RendererUnderSG,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/VideoPlayer',
    },

    properties: {
        url: {
            default: '',
            type: cc.String,
            notify: function(url) {
                this._sgNode.setURL(url);
            }
        },

        currentTime: {
            default: 0,
            type: cc.Number,
            notify: function (time) {
                this._sgNode.seekTo(time);
            }
        },

        keepAspectRatio: {
            default: true,
            type: cc.Boolean,
            notify: function (enable) {
                this._sgNode.setKeepAspectRatioEnabled(enable);
            }
        }
    },

    _createSgNode: function () {
        return new _ccsg.VideoPlayer();
    },

    _initSgNode: function () {
        var sgNode = this._sgNode;
        sgNode.setURL(this.url);
        sgNode.seekTo(this.currentTime);
        sgNode.setKeepAspectRatioEnabled(this.keepAspectRatio);
        sgNode.setContentSize(this.node.getContentSize());
    },
});

cc.VideoPlayer = module.exports = VideoPlayer;