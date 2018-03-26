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

cc.Audio = function (src) {
    this.src = src;
    this.volume = 1;
    this.loop = false;

    this.id = -1;
    this._eventList = {};

    this.type = cc.Audio.Type.NATIVE;
};

cc.Audio.Type = {
    DOM: 'AUDIO',
    WEBAUDIO: 'WEBAUDIO',
    NATIVE: 'NATIVE',
    UNKNOWN: 'UNKNOWN'
};

(function (proto, audioEngine) {

    // Using the new audioEngine
    cc.audioEngine = audioEngine;
    audioEngine.play = audioEngine.play2d;
    audioEngine.setMaxWebAudioSize = function () {};
    // deprecated
    // var Module = require('../cocos2d/audio/deprecated');
    // Module.removed(audioEngine);
    // Module.deprecated(audioEngine);

    proto.State = audioEngine.AudioState;

    proto.play = function () {
        audioEngine.stop(this.id);
        this.id = audioEngine.play2d(this.src, this.loop, this.volume);
    };

    proto.pause = function () {
        audioEngine.pause(this.id);
    };

    proto.resume = function () {
        audioEngine.resume(this.id);
    };

    proto.stop = function () {
        audioEngine.stop(this.id);
    };

    proto.setLoop = function (loop) {
        this.loop = loop;
        audioEngine.setLoop(this.id, loop)
    };

    proto.getLoop = function () {
        return audioEngine.getLoop(this.id)
    };

    proto.setVolume = function (volume) {
        this.volume = volume;
        return audioEngine.setVolume(this.id, volume)
    };

    proto.getVolume = function () {
        return audioEngine.getVolume(this.id)
    };

    proto.setCurrentTime = function (time) {
        audioEngine.setCurrentTime(this.id, time);
    };

    proto.getCurrentTime = function () {
        return audioEngine.getCurrentTime(this.id)
    };

    proto.getDuration = function () {
        return audioEngine.getDuration(this.id)
    };

    proto.getState = function () {
        return audioEngine.getState(this.id)
    };

    proto.preload = function () {
        this._loaded = true;
        this.emit('load');
    };

    proto.on = function (event, callback) {
        var list = this._eventList[event];
        if (!list) {
            list = this._eventList[event] = [];
        }
        list.push(callback);
    };
    proto.once = function (event, callback) {
        var onceCallback = function (elem) {
            callback.call(this, elem);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    };
    proto.emit = function (event) {
        var list = this._eventList[event];
        if (!list) return;
        for (var i=0; i<list.length; i++) {
            list[i].call(this, this);
        }
    };
    proto.off = function (event, callback) {
        var list = this._eventList[event];
        if (!list) return false;
        if (!callback) {
            this._eventList[event] = [];
            return true;
        }

        for (var i=0; i<list.length; i++) {
            if (list[i] === callback) {
                list.splice(i, 1);
                break;
            }
        }
        return true;
    };

})(cc.Audio.prototype, jsb.AudioEngine);