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



/**
 * !#en cc.VideoPlayer is a component for playing videos, you can use it for showing videos in your game.
 * !#zh Video 组件，用于在游戏中播放视频
 * @class VideoPlayer
 * @extends _RendererUnderSG
 */
var WebView = cc.Class({
    name: 'cc.WebView',
    extends: cc._RendererUnderSG,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/WebView'
    },

    properties: {

        _url: '',

        url: {
            type: String,
            get: function () {
                return this._url;
            },
            set: function (url) {
                this._url = url;
                var sgNode = this._sgNode;
                if (!sgNode) return;
                sgNode.loadURL(url);
            }
        }
    },

    // statics: {
    //     EventType: EventType,
    //     ResourceType: ResourceType
    // },

    _createSgNode: function () {
        return new _ccsg.WebView();
    },

    _initSgNode: function () {
        var sgNode = this._sgNode;
        if (!sgNode) return;
        sgNode.loadURL(this._url);
    },

    onLoad: function () {

    },

    reload: function () {

    }

});

cc.WebView = module.exports = WebView;
