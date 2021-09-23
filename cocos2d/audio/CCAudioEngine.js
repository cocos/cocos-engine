/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

const Audio = require('./CCAudio');
const AudioClip = require('../core/assets/CCAudioClip');
const js = cc.js;

let _instanceId = 0;
let _id2audio = js.createMap(true);
let _url2id = {};
let _audioPool = [];

let recycleAudio = function (audio) {
    // In case repeatly recycle audio when users call audio.stop when audio finish playing
    if (!audio._shouldRecycleOnEnded) {
        return;
    }
    audio._finishCallback = null;
    audio.off('ended');
    audio.off('stop');
    audio.src = null;
    // In case repeatly recycle audio
    if (!_audioPool.includes(audio)) {
        if (_audioPool.length < 32) {
            _audioPool.push(audio);
        }
        else {
            audio.destroy();
        }
    }
    audio._shouldRecycleOnEnded = false;
};

let getAudioFromPath = function (path) {
    var id = _instanceId++;
    var list = _url2id[path];
    if (!list) {
        list = _url2id[path] = [];
    }
    if (audioEngine._maxAudioInstance <= list.length) {
        var oldId = list.shift();
        var oldAudio = getAudioFromId(oldId);
        // Stop will recycle audio automatically by event callback
        oldAudio.stop();
    }

    var audio = _audioPool.pop() || new Audio();
    var callback = function () {
        var audioInList = getAudioFromId(this.id);
        if (audioInList) {
            delete _id2audio[this.id];
            var index = list.indexOf(this.id);
            cc.js.array.fastRemoveAt(list, index);
        }
        recycleAudio(this);
    };

    audio.on('ended', function () {
        if (this._finishCallback) {
            this._finishCallback();
        }
        if(!this.getLoop()){
            callback.call(this);
        }
    }, audio);

    audio.on('stop', callback, audio);
    audio.id = id;
    _id2audio[id] = audio;
    list.push(id);

    return audio;
};

let getAudioFromId = function (id) {
    return _id2audio[id];
};

let handleVolume  = function (volume) {
    if (volume === undefined) {
        // set default volume as 1
        volume = 1;
    }
    else if (typeof volume === 'string') {
        volume = Number.parseFloat(volume);
    }
    return volume;
};

/**
 * !#en `cc.audioEngine` is the singleton object, it provide simple audio APIs.
 * !#zh
 * cc.audioengine是单例对象。<br/>
 * 主要用来播放音频，播放的时候会返回一个 audioID，之后都可以通过这个 audioID 来操作这个音频对象。<br/>
 * 不使用的时候，请使用 `cc.audioEngine.uncache(filePath);` 进行资源释放 <br/>
 * 注意：<br/>
 * 在 Android 系统浏览器上，不同浏览器，不同版本的效果不尽相同。<br/>
 * 比如说：大多数浏览器都需要用户物理交互才可以开始播放音效，有一些不支持 WebAudio，有一些不支持多音轨播放。总之如果对音乐依赖比较强，请做尽可能多的测试。
 * @class audioEngine
 * @static
 */
var audioEngine = {

    AudioState: Audio.State,

    _maxAudioInstance: 24,

    _id2audio: _id2audio,

    /**
     * !#en Play audio.
     * !#zh 播放音频
     * @method play
     * @param {AudioClip} clip - The audio clip to play.
     * @param {Boolean} loop - Whether the music loop or not.
     * @param {Number} volume - Volume size.
     * @return {Number} audioId
     * @example
     * cc.resources.load(path, cc.AudioClip, null, function (err, clip) {
     *     var audioID = cc.audioEngine.play(clip, false, 0.5);
     * });
     */
    play: function (clip, loop, volume) {
        if (CC_EDITOR) {
            return;
        }
        if (!(clip instanceof AudioClip)) {
            return cc.error('Wrong type of AudioClip.');
        }
        let path = clip.nativeUrl;
        let audio = getAudioFromPath(path);
        audio.src = clip;
        clip._ensureLoaded();
        audio._shouldRecycleOnEnded = true;
        audio.setLoop(loop || false);
        volume = handleVolume(volume);
        audio.setVolume(volume);
        audio.play();
        return audio.id;
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
        if (!audio || !audio.getLoop)
            return false;
        return audio.getLoop();
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
        if (audio) {
            audio.setVolume(volume);
        }
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
        return audio ? audio.getVolume() : 1;
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
        if (audio) {
            audio.setCurrentTime(sec);
            return true;
        }
        else {
            return false;
        }
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
        return audio ? audio.getCurrentTime() : 0;
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
        return audio ? audio.getDuration() : 0;
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
        return audio ? audio.getState() : this.AudioState.ERROR;
    },

    /**
     * !#en Whether the audio is playing
     * !#zh 音乐是否正在播放
     * @method isPlaying
     * @return {Boolean}
     * @example
     * cc.audioEngine.isPlaying(audioID);
     */
    isPlaying: function(audioID) {
        return this.getState(audioID) === this.AudioState.PLAYING
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
        audio._finishCallback = callback;
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
        if (audio) {
            audio.pause();
            return true;
        }
        else {
            return false;
        }
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
        for (var id in _id2audio) {
            var audio = _id2audio[id];
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
        if (audio) {
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
        for (var i = 0; i < this._pauseIDCache.length; ++i) {
            var id = this._pauseIDCache[i];
            var audio = getAudioFromId(id);
            if (audio)
                audio.resume();
        }
        this._pauseIDCache.length = 0;
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
        if (audio) {
            // Stop will recycle audio automatically by event callback
            audio.stop();
            return true;
        }
        else {
            return false;
        }
    },

    /**
     * !#en Stop all playing audio.
     * !#zh 停止正在播放的所有音频。
     * @method stopAll
     * @example
     * cc.audioEngine.stopAll();
     */
    stopAll: function () {
        for (var id in _id2audio) {
            var audio = _id2audio[id];
            if (audio) {
                // Stop will recycle audio automatically by event callback
                audio.stop();
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
     * @deprecated since v2.4.0
     */
    setMaxAudioInstance: function (num) {
        if (CC_DEBUG) {
            cc.warn('Since v2.4.0, maxAudioInstance has become a read only property.\n'
            + 'audioEngine.setMaxAudioInstance() method will be removed in the future');
        }
    },

    /**
     * !#en Getting audio can produce several examples.
     * !#zh 获取一个音频可以设置几个实例
     * @method getMaxAudioInstance
     * @return {Number} max number of instances to be created from within an audio
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
     * @param {AudioClip} clip
     * @example
     * cc.audioEngine.uncache(filePath);
     */
    uncache: function (clip) {
        var filePath = clip;
        if (typeof clip === 'string') {
            // backward compatibility since 1.10
            cc.warnID(8401, 'cc.audioEngine', 'cc.AudioClip', 'AudioClip', 'cc.AudioClip', 'audio');
            filePath = clip;
        }
        else {
            if (!clip) {
                return;
            }
            filePath = clip.nativeUrl;
        }

        var list = _url2id[filePath];
        if (!list) return;
        while (list.length > 0) {
            var id = list.pop();
            var audio = _id2audio[id];
            if (audio) {
                // Stop will recycle audio automatically by event callback
                audio.stop();
                delete _id2audio[id];
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
        let audio;
        for (let id in _id2audio) {
            audio = _id2audio[id];
            if (audio) {
                audio.destroy();
            }
        }
        while (audio = _audioPool.pop()) {
            audio.destroy();
        }
        _id2audio = js.createMap(true);
        _url2id = {};
    },

    _breakCache: null,
    _break: function () {
        this._breakCache = [];
        for (var id in _id2audio) {
            var audio = _id2audio[id];
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
     * @param {AudioClip} clip - The audio clip to play.
     * @param {Boolean} loop - Whether the music loop or not.
     * @return {Number} audioId
     * @example
     * cc.resources.load(path, cc.AudioClip, null, function (err, clip) {
     *     var audioID = cc.audioEngine.playMusic(clip, false);
     * });
     */
    playMusic: function (clip, loop) {
        var music = this._music;
        this.stop(music.id);
        music.id = this.play(clip, loop, music.volume);
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
     * @example
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
        volume = handleVolume(volume);
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
     * @param {AudioClip} clip - The audio clip to play.
     * @param {Boolean} loop - Whether the music loop or not.
     * @return {Number} audioId
     * @example
     * cc.resources.load(path, cc.AudioClip, null, function (err, clip) {
     *     var audioID = cc.audioEngine.playEffect(clip, false);
     * });
     */
    playEffect: function (clip, loop) {
        return this.play(clip, loop || false, this._effect.volume);
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
        volume = handleVolume(volume);
        var musicId = this._music.id;
        this._effect.volume = volume;
        for (var id in _id2audio) {
            var audio = _id2audio[id];
            if (!audio || audio.id === musicId) continue;
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
        effect.pauseCache.length = 0;

        for (var id in _id2audio) {
            var audio = _id2audio[id];
            if (!audio || audio.id === musicId) continue;
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
     * @example
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
        for (var i = 0; i < pauseIDCache.length; ++i) {
            var id = pauseIDCache[i];
            var audio = _id2audio[id];
            if (audio)
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
        for (var id in _id2audio) {
            var audio = _id2audio[id];
            if (!audio || audio.id === musicId) continue;
            var state = audio.getState();
            if (state === audioEngine.AudioState.PLAYING) {
                audio.stop();
            }
        }
    }
};

module.exports = cc.audioEngine = audioEngine;
