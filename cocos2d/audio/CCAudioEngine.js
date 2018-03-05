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
    var callback = function () {
        var id = this.instanceId;
        delete id2audio[id];
        var index = list.indexOf(id);
        cc.js.array.fastRemoveAt(list, index);
    };
    audio.on('ended', callback);
    audio.on('stop', callback);
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
     * var audioID = cc.audioEngine.play(path, false, 0.5);
     */
    play: function (filePath, loop, volume/*, profile*/) {
        if (CC_DEBUG && (typeof filePath !== 'string')) {
            cc.errorID(8400);
            return;
        }

        var audio = getAudioFromPath(filePath);
        var callback = function () {
            audio.setLoop(loop || false);
            if (typeof volume != 'number' || isNaN(volume)) {
                volume = 1;
            }
            audio.setVolume(volume);
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
     * @param {Number} audioID - audio id.
     * @param {Number} volume - Volume must be in 0.0~1.0 .
     * @example
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
     * @param {Number} audioID - audio id.
     * @return {Number}
     * @example
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
     * @param {Number} audioID - audio id.
     * @param {Number} sec - current time.
     * @return {Boolean}
     * @example
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
     * @param {Number} audioID - audio id.
     * @return {Number} audio current time.
     * @example
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
     * @param {Number} audioID - audio id.
     * @return {Number} audio duration.
     * @example
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
     * @param {Number} audioID - audio id.
     * @return {audioEngine.AudioState} audio duration.
     * @example
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
     * @param {Number} audioID - audio id.
     * @param {Function} callback - loaded callback.
     * @example
     * cc.audioEngine.setFinishCallback(id, function () {});
     */
    setFinishCallback: function (audioID, callback) {
        var audio = getAudioFromId(audioID);
        if (!audio)
            return;
        audio.off('ended', audio._finishCallback);

        audio._finishCallback = callback;
        audio.on('ended', audio._finishCallback);
    },

    /**
     * !#en Pause playing audio.
     * !#zh 暂停正在播放音频。
     * @method pause
     * @param {Number} audioID - The return value of function play.
     * @example
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
     * @example
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
     * cc.audioEngine.stop(audioID);
     */
    stop: function (audioID) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.stop)
            return false;
        audio.off('load', audio.__callback);
        audio.stop();
        return true;
    },

    /**
     * !#en Stop all playing audio.
     * !#zh 停止正在播放的所有音频。
     * @method stopAll
     * @example
     * cc.audioEngine.stopAll();
     */
    stopAll: function () {
        for (var id in id2audio) {
            var audio = id2audio[id];
            if (audio && audio.stop) {
                audio.stop();
                audio.off('load', audio.__callback);
            }
        }
    },

    /**
     * !#en Set up an audio can generate a few examples.
     * !#zh 设置一个音频可以设置几个实例
     * @method setMaxAudioInstance
     * @param {Number} num - a number of instances to be created from within an audio
     * @example
     * cc.audioEngine.setMaxAudioInstance(20);
     */
    setMaxAudioInstance: function (num) {
        return this._maxAudioInstance = num;
    },

    /**
     * !#en Getting audio can produce several examples.
     * !#zh 获取一个音频可以设置几个实例
     * @method getMaxAudioInstance
     * @return {Number} a - number of instances to be created from within an audio
     * @example
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
     * @method preload
     * @param {String} filePath - The file path of an audio.
     * @param {Function} [callback] - The callback of an audio.
     * @example
     * cc.audioEngine.preload(path);
     */
    preload: function (filePath, callback) {
        cc.loader.load(filePath, callback && function (error) {
            if (!error) {
                callback();
            }
        });
    },

    /**
     * !#en Set a size, the unit is KB. Over this size is directly resolved into DOM nodes.
     * !#zh 设置一个以 KB 为单位的尺寸，大于这个尺寸的音频在加载的时候会强制使用 dom 方式加载
     * @method setMaxWebAudioSize
     * @param {Number} kb - The file path of an audio.
     * @example
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
    },

    ///////////////////////////////
    // Classification of interface

    _music: {
        id: -1,
        loop: false,
        volume: 1,
    },

    _effect: {
        volume: 1,
        pauseCache: [],
    },

    /**
     * !#en Play background music
     * !#zh 播放背景音乐
     * @method playMusic
     * @param {String} filePath - The path of the audio file without filename extension.
     * @param {Boolean} loop - Whether the music loop or not.
     * @return {Number} audioId
     * @example
     * var audioID = cc.audioEngine.playMusic(path, false);
     */
    playMusic: function (filePath, loop) {
        var music = this._music;
        this.stop(music.id);
        music.id = this.play(filePath, loop, music.volume);
        music.loop = loop;
        return music.id;
    },

    /**
     * !#en Stop background music.
     * !#zh 停止播放背景音乐。
     * @method stopMusic
     * @example
     * cc.audioEngine.stopMusic();
     */
    stopMusic: function () {
        this.stop(this._music.id);
    },

    /**
     * !#en Pause the background music.
     * !#zh 暂停播放背景音乐。
     * @method pauseMusic
     * @example
     * cc.audioEngine.pauseMusic();
     */
    pauseMusic: function () {
        this.pause(this._music.id);
        return this._music.id;
    },

    /**
     * !#en Resume playing background music.
     * !#zh 恢复播放背景音乐。
     * @method resumeMusic
     * //example
     * cc.audioEngine.resumeMusic();
     */
    resumeMusic: function () {
        this.resume(this._music.id);
        return this._music.id;
    },

    /**
     * !#en Get the volume(0.0 ~ 1.0).
     * !#zh 获取音量（0.0 ~ 1.0）。
     * @method getMusicVolume
     * @return {Number}
     * @example
     * var volume = cc.audioEngine.getMusicVolume();
     */
    getMusicVolume: function () {
        return this._music.volume;
    },

    /**
     * !#en Set the background music volume.
     * !#zh 设置背景音乐音量（0.0 ~ 1.0）。
     * @method setMusicVolume
     * @param {Number} volume - Volume must be in 0.0~1.0.
     * @example
     * cc.audioEngine.setMusicVolume(0.5);
     */
    setMusicVolume: function (volume) {
        var music = this._music;
        music.volume = volume;
        this.setVolume(music.id, music.volume);
        return music.volume;
    },

    /**
     * !#en Background music playing state
     * !#zh 背景音乐是否正在播放
     * @method isMusicPlaying
     * @return {Boolean}
     * @example
     * cc.audioEngine.isMusicPlaying();
     */
    isMusicPlaying: function () {
        return this.getState(this._music.id) === this.AudioState.PLAYING;
    },

    /**
     * !#en Play effect audio.
     * !#zh 播放音效
     * @method playEffect
     * @param {String} filePath - The path of the audio file without filename extension.
     * @param {Boolean} loop - Whether the music loop or not.
     * @return {Number} audioId
     * @example
     * var audioID = cc.audioEngine.playEffect(path, false);
     */
    playEffect: function (filePath, loop) {
        var effect = this._effect;
        return this.play(filePath, loop || false, effect.volume);
    },

    /**
     * !#en Set the volume of effect audio.
     * !#zh 设置音效音量（0.0 ~ 1.0）。
     * @method setEffectsVolume
     * @param {Number} volume - Volume must be in 0.0~1.0.
     * @example
     * cc.audioEngine.setEffectsVolume(0.5);
     */
    setEffectsVolume: function (volume) {
        this._effect.volume = volume;
        var id2audio = audioEngine._id2audio;
        for (var id in id2audio) {
            if (id === musicId) continue;
            audioEngine.setVolume(id, volume);
        }
    },

    /**
     * !#en The volume of the effect audio max value is 1.0,the min value is 0.0 .
     * !#zh 获取音效音量（0.0 ~ 1.0）。
     * @method getEffectsVolume
     * @return {Number}
     * @example
     * var volume = cc.audioEngine.getEffectsVolume();
     */
    getEffectsVolume: function () {
        return this._effect.volume;
    },

    /**
     * !#en Pause effect audio.
     * !#zh 暂停播放音效。
     * @method pauseEffect
     * @param {Number} audioID - audio id.
     * @example
     * cc.audioEngine.pauseEffect(audioID);
     */
    pauseEffect: function (audioID) {
        return this.pause(audioID);
    },

    /**
     * !#en Stop playing all the sound effects.
     * !#zh 暂停播放所有音效。
     * @method pauseAllEffects
     * @example
     * cc.audioEngine.pauseAllEffects();
     */
    pauseAllEffects: function () {
        var musicId = this._music.id;
        var effect = this._effect;
        var id2audio = this._id2audio;
        effect.pauseCache.length = 0;

        for (var id in id2audio) {
            if (id === musicId) continue;
            var audio = id2audio[id];
            var state = audio.getState();
            if (state === this.AudioState.PLAYING) {
                effect.pauseCache.push(id);
                audio.pause();
            }
        }
    },

    /**
     * !#en Resume effect audio.
     * !#zh 恢复播放音效音频。
     * @method resumeEffect
     * @param {Number} audioID - The return value of function play.
     * //example
     * cc.audioEngine.resumeEffect(audioID);
     */
    resumeEffect: function (id) {
        this.resume(id);
    },

    /**
     * !#en Resume all effect audio.
     * !#zh 恢复播放所有之前暂停的音效。
     * @method resumeAllEffects
     * @example
     * cc.audioEngine.resumeAllEffects();
     */
    resumeAllEffects: function () {
        var pauseIDCache = this._effect.pauseCache;
        var id2audio = this._id2audio;
        while (pauseIDCache.length > 0) {
            var id = pauseIDCache.pop();
            var audio = id2audio[id];
            if (audio && audio.resume)
                audio.resume();
        }
    },

    /**
     * !#en Stop playing the effect audio.
     * !#zh 停止播放音效。
     * @method stopEffect
     * @param {Number} audioID - audio id.
     * @example
     * cc.audioEngine.stopEffect(id);
     */
    stopEffect: function (audioID) {
        return this.stop(audioID);
    },

    /**
     * !#en Stop playing all the effects.
     * !#zh 停止播放所有音效。
     * @method stopAllEffects
     * @example
     * cc.audioEngine.stopAllEffects();
     */
    stopAllEffects: function () {
        var musicId = this._music.id;
        var id2audio = this._id2audio;
        for (var id in id2audio) {
            if (id === musicId) continue;
            var audio = id2audio[id];
            var state = audio.getState();
            if (state === audioEngine.AudioState.PLAYING) {
                audio.stop();
            }
        }
    }
};

module.exports = cc.audioEngine = audioEngine;

// deprecated
var Module = require('./deprecated');
Module.removed(audioEngine);
Module.deprecated(audioEngine);
