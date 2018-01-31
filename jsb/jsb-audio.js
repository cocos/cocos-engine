/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

    var _music = {
        id: -1,
        url: '',
        volume: 1
    };
    var _effect = {
        volume: 1
    };
    audioEngine.playMusic = function (filePath, loop) {
        audioEngine.stop(_music.id);
        _music.id = audioEngine.play(filePath, loop, _music.volume);
        _music.loop = loop;
        _music.url = filePath;
        return _music.id;
    };
    audioEngine.stopMusic = function () {
        audioEngine.stop(_music.id);
    };
    audioEngine.pauseMusic = function () {
        audioEngine.pause(_music.id);
        return _music.id;
    };
    audioEngine.resumeMusic = function () {
        audioEngine.resume(_music.id);
        return _music.id;
    };
    audioEngine.getMusicVolume = function () {
        return _music.volume;
    };
    audioEngine.setMusicVolume = function (volume) {
        _music.volume = volume;
        audioEngine.setVolume(_music.id, _music.volume);
        return _music.volume;
    };
    audioEngine.isMusicPlaying = function () {
        return audioEngine.getState(_music.id) === audioEngine.AudioState.PLAYING;
    };
    audioEngine.playEffect = function (filePath, loop) {
        return audioEngine.play(filePath, loop || false, _effect.volume);
    };
    audioEngine.setEffectsVolume = function (volume) {
        _effect.volume = volume;
    };
    audioEngine.getEffectsVolume = function () {
        return _effect.volume;
    };
    audioEngine.pauseEffect = function (audioID) {
        return audioEngine.pause(audioID);
    };
    audioEngine.pauseAllEffects = function () {
        var musicPlay = audioEngine.getState(_music.id) === audioEngine.AudioState.PLAYING;
        audioEngine.pauseAll();
        if (musicPlay) {
            audioEngine.resume(_music.id);
        }
    };
    audioEngine.resumeEffect = function (id) {
        audioEngine.resume(id);
    };
    audioEngine.resumeAllEffects = function () {
        var musicPaused = audioEngine.getState(_music.id) === audioEngine.AudioState.PAUSED;
        audioEngine.resumeAll();
        if (musicPaused && audioEngine.getState(_music.id) === audioEngine.AudioState.PLAYING) {
            audioEngine.pause(_music.id);
        }
    };
    audioEngine.stopEffect = function (id) {
        return audioEngine.stop(id);
    };
    audioEngine.stopAllEffects = function () {
        var musicPlay = audioEngine.getState(_music.id) === audioEngine.AudioState.PLAYING;
        var currentTime = audioEngine.getCurrentTime(_music.id);
        audioEngine.stopAll();
        if (musicPlay) {
            _music.id = audioEngine.play(_music.url, _music.loop);
            audioEngine.setCurrentTime(_music.id, currentTime);
        }
    };

    // deprecated
    var Module = require('../cocos2d/audio/deprecated');
    Module.removed(audioEngine);
    Module.deprecated(audioEngine);

})(cc.Audio.prototype, jsb.AudioEngine);