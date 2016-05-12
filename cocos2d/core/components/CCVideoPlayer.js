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
        inspector: 'app://editor/page/inspector/videoPlayer.html',
    },

    properties: {

        _resourceType: 0,
        resourceType: {
            type: cc.Integer, // 0: remote | 1: local
            set: function ( value ) {
                value = value - 0;
                this._resourceType = value;
                this._updateSgNode();
            },
            get: function () {
                return this._resourceType
            }
        },

        _url: '',
        url: {
            type: cc.String,
            set: function ( url ) {
                this._url = url;
                this._updateSgNode();
            },
            get: function () {
                return this._url;
            }
        },

        _video: {
            default: null,
            url: cc.RawAsset
        },
        video: {
            get: function () {
                return this._video;
            },
            set: function ( value ) {
                if (typeof value !== 'string')
                    value = '';
                this._video = value;
                this._updateSgNode();
            },
            url: cc.RawAsset
        },

        _time: 0,

        currentTime: {
            type: cc.Float,
            set: function ( time ) {
                this._time = time;
                this._sgNode.seekTo(time);
            },
            get: function () {
                return this._time;
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

    _updateSgNode: function () {
        var sgNode = this._sgNode;
        if (this.resourceType === 0) {
            sgNode.setURL(this.url);
        } else {
            sgNode.setURL(this._video || '');
        }
        sgNode.seekTo(this.currentTime);
        sgNode.setKeepAspectRatioEnabled(this.keepAspectRatio);
    },

    _initSgNode: function () {
        var sgNode = this._sgNode;
        this._updateSgNode();
        sgNode.setContentSize(this.node.getContentSize());
    },
});

cc.VideoPlayer = module.exports = VideoPlayer;