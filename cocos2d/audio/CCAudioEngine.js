/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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

var Audio = require('./CCAudio');

var instanceId = 0;
var id2audio = {};
var url2id = {};

var getAudioFromPath = function (path) {
    var id = instanceId++;
    var list = url2id[path];
    if (!list) {
        list = url2id[path] = [];
    }
    var audio;
    if (audioEngine._maxAudioInstance <= list.length) {
        var oldId = list.shift();
        var oldAudio = id2audio[oldId];
        oldAudio.stop();
    }

    audio = new Audio(path);
    audio.on('ended', function () {
        var id = this.instanceId;
        delete id2audio[id];
        var index = list.indexOf(id);
        cc.js.array.fastRemoveAt(list, index);
    });
    id2audio[id] = audio;

    audio.instanceId = id;
    list.push(id);

    return audio;
};

var getAudioFromId = function (id) {
    return id2audio[id];
};

/**
 * !#en cc.audioEngine is the singleton object, it provide simple audio APIs.
 * !#zh
 * cc.audioengine是单例对象。<br/>
 * 主要用来播放音频，播放的时候会返回一个 audioID，之后都可以通过这个 audioID 来操作这个音频对象。<br/>
 * 不使用的时候，请使用 cc.audioEngine.uncache(filePath); 进行资源释放 <br/>
 * 注意：<br/>
 * 在 Android 系统浏览器上，不同浏览器，不同版本的效果不尽相同。<br/>
 * 比如说：大多数浏览器都需要用户物理交互才可以开始播放音效，有一些不支持 WebAudio，<br/>
 * 有一些不支持多音轨播放。总之如果对音乐依赖比较强，请做尽可能多的测试。
 * @class audioEngine
 * @static
 */
var audioEngine = {

    AudioState: Audio.State,

    _maxWebAudioSize: 2097152, // 2048kb * 1024
    _maxAudioInstance: 24,

    _id2audio: id2audio,

    /**
     * !#en Play audio.
     * !#zh 播放音频
     * @method play
     * @param {String} filePath - The path of the audio file without filename extension.
     * @param {Boolean} loop - Whether the music loop or not.
     * @param {Number} volume - Volume size.
     * @return {Number} audioId
     * @example
     * //example
     * var audioID = cc.audioEngine.play(path, false, 0.5);
     */
    play: function (filePath, loop, volume/*, profile*/) {
        var audio = getAudioFromPath(filePath);
        var callback = function () {
            audio.setLoop(loop || false);
            audio.setVolume(volume || 1);
            audio.play();
        };
        audio.__callback = callback;
        audio.on('load', callback);
        audio.preload();

        return audio.instanceId;
    },

    /**
     * !#en Set audio loop.
     * !#zh 设置音频是否循环。
     * @method setLoop
     * @param {Number} audioID - audio id.
     * @param {Boolean} loop - Whether cycle.
     * @example
     * //example
     * cc.audioEngine.setLoop(id, true);
     */
    setLoop: function (audioID, loop) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.setLoop)
            return;
        audio.setLoop(loop);
    },

    /**
     * !#en Get audio cycle state.
     * !#zh 获取音频的循环状态。
     * @method isLoop
     * @param {Number} audioID - audio id.
     * @return {Boolean} Whether cycle.
     * @example
     * //example
     * cc.audioEngine.isLoop(id);
     */
    isLoop: function (audioID) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.isLoop)
            return false;
        return audio.isLoop();
    },

    /**
     * !#en Set the volume of audio.
     * !#zh 设置音量（0.0 ~ 1.0）。
     * @method setVolume
     * @param {Number} audioID audio id.
     * @param {Number} volume Volume must be in 0.0~1.0 .
     * @example
     * //example
     * cc.audioEngine.setVolume(id, 0.5);
     */
    setVolume: function (audioID, volume) {
        var audio = getAudioFromId(audioID);
        if (!audio) return;
        if (!audio._loaded) {
            audio.once('load', function () {
                if (audio.setVolume)
                    audio.setVolume(volume);
            });
        }
        if (audio.setVolume)
            audio.setVolume(volume);
    },

    /**
     * !#en The volume of the music max value is 1.0,the min value is 0.0 .
     * !#zh 获取音量（0.0 ~ 1.0）。
     * @method getVolume
     * @param {Number} audioID audio id.
     * @return {Boolean}
     * @example
     * //example
     * var volume = cc.audioEngine.getVolume(id);
     */
    getVolume: function (audioID) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.getVolume)
            return 1;
        return audio.getVolume();
    },

    /**
     * !#en Set current time
     * !#zh 设置当前的音频时间。
     * @method setCurrentTime
     * @param {Number} audioID audio id.
     * @param {Number} sec current time.
     * @return {Boolean}
     * @example
     * //example
     * cc.audioEngine.setCurrentTime(id, 2);
     */
    setCurrentTime: function (audioID, sec) {
        var audio = getAudioFromId(audioID);
        if (!audio) return false;
        if (!audio._loaded) {
            audio.once('load', function () {
                if (audio.setCurrentTime)
                    audio.setCurrentTime(sec);
            });
            return true;
        }
        if (audio.setCurrentTime)
            audio.setCurrentTime(sec);
        return true;
    },

    /**
     * !#en Get current time
     * !#zh 获取当前的音频播放时间。
     * @method getCurrentTime
     * @param {Number} audioID audio id.
     * @return {Number} audio current time.
     * @example
     * //example
     * var time = cc.audioEngine.getCurrentTime(id);
     */
    getCurrentTime: function (audioID) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.getCurrentTime)
            return 0;
        return audio.getCurrentTime();
    },

    /**
     * !#en Get audio duration
     * !#zh 获取音频总时长。
     * @method getDuration
     * @param {Number} audioID audio id.
     * @return {Number} audio duration.
     * @example
     * //example
     * var time = cc.audioEngine.getDuration(id);
     */
    getDuration: function (audioID) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.getDuration)
            return 0;
        return audio.getDuration();
    },

    /**
     * !#en Get audio state
     * !#zh 获取音频状态。
     * @method getState
     * @param {Number} audioID audio id.
     * @return {audioEngine.AudioState} audio duration.
     * @example
     * //example
     * var state = cc.audioEngine.getState(id);
     */
    getState: function (audioID) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.getState)
            return this.AudioState.ERROR;
        return audio.getState();
    },

    /**
     * !#en Set Audio finish callback
     * !#zh 设置一个音频结束后的回调
     * @method setFinishCallback
     * @param {Number} audioID audio id.
     * @param {Function} callback loaded callback.
     * @example
     * //example
     * cc.audioEngine.setFinishCallback(id, function () {});
     */
    setFinishCallback: function (audioID, callback) {
        var audio = getAudioFromId(audioID);
        if (!audio)
            return;

        audio.off('ended');
        audio.on('ended', callback);
    },

    /**
     * !#en Pause playing audio.
     * !#zh 暂停正在播放音频。
     * @method pause
     * @param {Number} audioID - The return value of function play.
     * @example
     * //example
     * cc.audioEngine.pause(audioID);
     */
    pause: function (audioID) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.pause)
            return false;
        audio.pause();
        return true;
    },

    _pauseIDCache: [],
    /**
     * !#en Pause all playing audio
     * !#zh 暂停现在正在播放的所有音频。
     * @method pauseAll
     * @example
     * //example
     * cc.audioEngine.pauseAll();
     */
    pauseAll: function () {
        for (var id in id2audio) {
            var audio = id2audio[id];
            var state = audio.getState();
            if (state === Audio.State.PLAYING) {
                this._pauseIDCache.push(id);
                audio.pause();
            }
        }
    },

    /**
     * !#en Resume playing audio.
     * !#zh 恢复播放指定的音频。
     * @method resume
     * @param {Number} audioID - The return value of function play.
     * //example
     * cc.audioEngine.resume(audioID);
     */
    resume: function (audioID) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.resume)
            return false;
        if (audio.getCurrentTime() === 0) {
            audio.play();
        } else {
            audio.resume();
        }
    },

    /**
     * !#en Resume all playing audio.
     * !#zh 恢复播放所有之前暂停的所有音频。
     * @method resumeAll
     * @example
     * //example
     * cc.audioEngine.resumeAll();
     */
    resumeAll: function () {
        while (this._pauseIDCache.length > 0) {
            var id = this._pauseIDCache.pop();
            var audio = getAudioFromId(id);
            if (audio && audio.resume)
                audio.resume();
        }
    },

    /**
     * !#en Stop playing audio.
     * !#zh 停止播放指定音频。
     * @method stop
     * @param {Number} audioID - The return value of function play.
     * @example
     * //example
     * cc.audioEngine.stop(audioID);
     */
    stop: function (audioID) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.stop)
            return false;
        audio.off('load', audio.__callback);
        audio.stop();
        audio.emit('ended');
        return true;
    },

    /**
     * !#en Stop all playing audio.
     * !#zh 停止正在播放的所有音频。
     * @method stopAll
     * @example
     * //example
     * cc.audioEngine.stopAll();
     */
    stopAll: function () {
        for (var id in id2audio) {
            var audio = id2audio[id];
            if (audio && audio.stop) {
                audio.stop();
                audio.off('load', audio.__callback);
                audio.emit('ended');
            }
        }
    },

    /**
     * !#en Set up an audio can generate a few examples.
     * !#zh 设置一个音频可以设置几个实例
     * @method setMaxAudioInstance
     * @param {Number} num a number of instances to be created from within an audio
     * @example
     * //example
     * cc.audioEngine.setMaxAudioInstance(20);
     */
    setMaxAudioInstance: function (num) {
        return this._maxAudioInstance = num;
    },

    /**
     * !#en Getting audio can produce several examples.
     * !#zh 获取一个音频可以设置几个实例
     * @method getMaxAudioInstance
     * @return {Number} a number of instances to be created from within an audio
     * @example
     * //example
     * cc.audioEngine.getMaxAudioInstance();
     */
    getMaxAudioInstance: function () {
        return this._maxAudioInstance;
    },

    /**
     * !#en Unload the preloaded audio from internal buffer.
     * !#zh 卸载预加载的音频。
     * @method uncache
     * @param {String} filePath
     * @example
     * //example
     * cc.audioEngine.uncache(filePath);
     */
    uncache: function (filePath) {
        var list = url2id[filePath];
        if (!list) return;
        while (list.length > 0) {
            var id = list.pop();
            var audio = id2audio[id];
            if (audio) {
                audio.stop();
                delete id2audio[id];
            }
        }
    },

    /**
     * !#en Unload all audio from internal buffer.
     * !#zh 卸载所有音频。
     * @method uncacheAll
     * @example
     * //example
     * cc.audioEngine.uncacheAll();
     */
    uncacheAll: function () {
        this.stopAll();
        id2audio = {};
        url2id = {};
    },

    /**
     * !#en Gets an audio profile by name.
     *
     * @param profileName A name of audio profile.
     * @return The audio profile.
     */
    getProfile: function (profileName) {},

    /**
     * !#en Preload audio file.
     * !#zh 预加载一个音频
     * @param filePath The file path of an audio.
     * @param callback The callback of an audio.
     * @method preload
     * @example
     * //example
     * cc.audioEngine.preload(path);
     */
    preload: function (filePath, callback) {
        cc.loader.load(filePath, function (error) {
            if (!error) {
                callback();
            }
        });
    },

    /**
     * !#en Set a size, the unit is KB，Over this size is directly resolved into DOM nodes
     * !#zh 设置一个以kb为单位的尺寸，大于这个尺寸的音频在加载的时候会强制使用 dom 方式加载
     * @param kb The file path of an audio.
     * @method setMaxWebAudioSize
     * @example
     * //example
     * cc.audioEngine.setMaxWebAudioSize(300);
     */
    // Because webAudio takes up too much memory，So allow users to manually choose
    setMaxWebAudioSize: function (kb) {
        this._maxWebAudioSize = kb * 1024;
    },

    _breakCache: null,
    _break: function () {
        this._breakCache = [];
        for (var id in id2audio) {
            var audio = id2audio[id];
            var state = audio.getState();
            if (state === Audio.State.PLAYING) {
                this._breakCache.push(id);
                audio.pause();
            }
        }
    },

    _restore: function () {
        if (!this._breakCache) return;

        while (this._breakCache.length > 0) {
            var id = this._breakCache.pop();
            var audio = getAudioFromId(id);
            if (audio && audio.resume)
                audio.resume();
        }
        this._breakCache = null;
    }
};

module.exports = cc.audioEngine = audioEngine;

// deprecated
var Module = require('./deprecated');
Module.removed(audioEngine);
Module.deprecated(audioEngine);
