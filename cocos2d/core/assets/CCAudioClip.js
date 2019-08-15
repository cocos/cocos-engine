/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

const Asset = require('./CCAsset');
const EventTarget = require('../event/event-target');

var LoadMode = cc.Enum({
    WEB_AUDIO: 0,
    DOM_AUDIO: 1,
});

/**
 * !#en Class for audio data handling.
 * !#zh 音频资源类。
 * @class AudioClip
 * @extends Asset
 * @uses EventTarget
 */
var AudioClip = cc.Class({
    name: 'cc.AudioClip',
    extends: Asset,
    mixins: [EventTarget],

    ctor () {
        this.loaded = false;

        // the web audio buffer or <audio> element
        this._audio = null;
    },

    properties: {
        loadMode: {
            default: LoadMode.WEB_AUDIO,
            type: LoadMode
        },
        _nativeAsset: {
            get () {
                return this._audio;
            },
            set (value) {
                // HACK: fix load mp3 as audioClip, _nativeAsset is set as audioClip.
                // Should load mp3 as audioBuffer indeed.
                if (value instanceof cc.AudioClip) {
                    this._audio = value._nativeAsset;
                }
                else {
                    this._audio = value;
                }
                if (this._audio) {
                    this.loaded = true;
                    this.emit('load');
                }
            },
            override: true
        },

        _nativeDep: {
            get () {
                return { uuid: this._uuid, loadMode: this.loadMode, ext: cc.path.extname(this._native), isNative: true };
            },
            override: true
        }
    },

    statics: {
        LoadMode: LoadMode,
        _loadByUrl: function (url, callback) {
            var audioClip = cc.assetManager._assets.get(url);
            if (!audioClip) {
                cc.assetManager.loadRemoteAudio(url, function (error, data) {
                    if (error) {
                        return callback(error);
                    }
                    callback(null, data);
                });
            }
            else {
                callback(null, audioClip);
            }
        },

        _parseDepsFromJson () {
            return [];
        },

        _parseNativeDepFromJson (json) {
            return { loadMode: json.loadMode,  ext: cc.path.extname(json._native), isNative: true };
        }
    },

    destroy () {
        cc.audioEngine.uncache(this);
        this._super();
    }
});

/**
 * !#zh
 * 当该资源加载成功后触发该事件
 * !#en
 * This event is emitted when the asset is loaded
 *
 * @event load
 */

cc.AudioClip = AudioClip;
module.exports = AudioClip;
