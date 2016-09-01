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
    if (audioEngine._maxAudioInstance > list.length) {
        audio = new Audio();
        id2audio[id] = audio;
    } else {
        var oldId = list.shift();
        audio = id2audio[id] = id2audio[oldId];
        delete id2audio[oldId];
    }
    audio.instanceId = id;
    list.push(id);

    return audio;
};

var getAudioFromId = function (id) {
    return id2audio[id];
};

// Wait for playing queue
var waitQueue = [];
var addWaitQueue = function (id) {
    var index = waitQueue.indexOf(id);
    if (index !== -1) return false;
    waitQueue.push(id);
    return true;
};
var removeWaitQueue = function (id) {
    var index = waitQueue.indexOf(id);
    if (index === -1) return false;
    waitQueue.splice(index, 1);
    return true;
};

var audioEngine = {

    AudioState: Audio.State,

    _maxWebAudioSize: 307200, // 300kb * 1024
    _maxAudioInstance: 24,

    play: function () {
        return this.play2d.apply(this, arguments);
    },

    play2d: function (filePath, loop, volume/*, profile*/) {
        var item = cc.loader.getItem(filePath);

        var audio = getAudioFromPath(filePath);

        // If the resource does not exist
        if (!item) {
            addWaitQueue(audio.instanceId);
            cc.loader.load(filePath, function (error) {
                if (!error) {
                    var item = cc.loader.getItem(filePath);
                    audio.mount(item.element || item.buffer);
                    audio.setLoop(loop || false);
                    audio.setVolume(volume || 1);
                    if (removeWaitQueue(audio.instanceId)) {
                        audio.play();
                    }
                }
            });
            return audio.instanceId;
        }

        audio.mount(item.element || item.buffer);
        audio.setLoop(loop || false);
        audio.setVolume(volume || 1);
        audio.play();
        return audio.instanceId;
    },
    setLoop: function (audioID, loop) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.setLoop)
            return loop;
        audio.setLoop(loop);
        return loop;
    },
    isLoop: function (audioID) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.isLoop)
            return false;
        return audio.isLoop();
    },
    setVolume: function (audioID, volume) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.setVolume)
            return volume;
        audio.setVolume(volume);
        return volume;
    },
    getVolume: function (audioID) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.getVolume)
            return 1;
        return audio.getVolume();
    },
    setCurrentTime: function (audioID, sec) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.setCurrentTime)
            return sec;
        audio.setCurrentTime(sec);
        return sec;
    },
    getCurrentTime: function (audioID) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.getCurrentTime)
            return 0;
        return audio.getCurrentTime();
    },

    getDuration: function (audioID) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.getDuration)
            return 0;
        return audio.getDuration();
    },
    getState: function (audioID) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.getState)
            return 0;
        return audio.getState();
    },

    setFinishCallback: function (audioID, callback) {
        var audio = getAudioFromId(audioID);
        if (!audio)
            return false;

        audio.off('ended');
        audio.on('ended', callback);
    },

    pause: function (audioID) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.pause)
            return false;
        audio.pause();
        removeWaitQueue(audioID);
        return true;
    },
    _pauseIDCache: [],
    pauseAll: function () {
        for (var id in id2audio) {
            var audio = id2audio[id];
            var state = audio.getState();
            if (state === Audio.State.PLAYING) {
                this._pauseIDCache.push(id);
                audio.pause();
            }
        }
        while (waitQueue.length > 0) {
            this._pauseIDCache.push(waitQueue.pop());
        }
    },
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
    resumeAll: function () {
        while (this._pauseIDCache.length > 0) {
            var id = this._pauseIDCache.pop();
            var audio = getAudioFromId(id);
            if (audio && audio.resume)
                audio.resume();
        }
    },
    stop: function (audioID) {
        var audio = getAudioFromId(audioID);
        if (!audio || !audio.stop)
            return false;
        audio.stop();
        removeWaitQueue(audioID);
        return true;
    },
    stopAll: function () {
        for (var id in id2audio) {
            var audio = id2audio[id];
            if (audio && audio.stop) {
                audio.stop();
            }
        }
        waitQueue = [];
    },

    setMaxAudioInstance: function (num) {
        return this._maxAudioInstance = num;
    },
    getMaxAudioInstance: function () {
        return this._maxAudioInstance;
    },
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
    uncacheAll: function () {
        this.stopAll();
        id2audio = {};
        url2id = {};
    },

    // getProfile
    getProfile: function () {},
    // preload
    preload: function () {},

    // web 独占接口
    // 设置一个大小，单位为kb，超过这个大小则直接解析成 dom 节点
    // 因为 webAudio 占用内存过多，所以让用户自己手动取舍
    setMaxWebAudioSize: function (kb) {
        this._maxWebAudioSize = kb * 1024;
    },

    // deprecated
    _musicId: -1,
    _backgroundVolume: 1,
    _effectsVolume: 1,
    willPlayMusic: function () { return false; },
    playMusic: function (url, loop) {
        cc.log('audioEngine.playMusic is deprecated, please call audioEngine.play');
        this._musicId = this.play(url, loop, this._backgroundVolume);
        return this._musicId;
    },
    stopMusic: function () {
        cc.log('audioEngine.stopMusic is deprecated, please call audioEngine.stop');
        this.stop(this._musicId);
        return this._musicId;
    },
    pauseMusic: function () {
        cc.log('audioEngine.pauseMusic is deprecated, please call audioEngine.pause');
        this.pause(this._musicId);
        return this._musicId;
    },
    resumeMusic: function () {
        cc.log('audioEngine.resumeMusic is deprecated, please call audioEngine.resume');
        this.resume(this._musicId);
        return this._musicId;
    },
    rewindMusic: function () {
        cc.log('audioEngine.rewindMusic is deprecated, please call audioEngine.setCurrentTime');
        this.setCurrentTime(this._musicId, 0);
        return this._musicId;
    },
    getMusicVolume: function () {
        cc.log('audioEngine.getMusicVolume is deprecated, please call audioEngine.getVolume');
        return this._backgroundVolume;
    },
    setMusicVolume: function (volume) {
        cc.log('audioEngine.setMusicVolume is deprecated, please call audioEngine.setVolume');
        this._backgroundVolume = volume;
        this.setVolume(this._musicId, volume);
        return this._backgroundVolume;
    },
    isMusicPlaying: function () {
        cc.log('audioEngine.isMusicPlaying is deprecated, please call audioEngine.getState');
        return this.getState(this._musicId) === Audio.State.PLAYING;
    },
    playEffect: function (url, loop, volume) {
        cc.log('audioEngine.playEffect is deprecated, please call audioEngine.play');
        return this.play(url, loop, volume === undefined ? this._effectsVolume : volume);
    },
    setEffectsVolume: function (volume) {
        cc.log('audioEngine.setEffectsVolume is deprecated, please call audioEngine.setVolume');
        this._effectsVolume = volume;
        for (var id in id2audio) {
            if (id === this._musicId) continue;
            this.setVolume(id, volume);
        }
    },
    getEffectsVolume: function () {
        cc.log('audioEngine.getEffectsVolume is deprecated, please call audioEngine.getVolume');
        return this._effectsVolume;
    },
    pauseEffect: function (id) {
        cc.log('audioEngine.pauseEffect is deprecated, please call audioEngine.pause');
        return this.pause(id);
    },
    pauseAllEffects: function () {
        cc.log('audioEngine.pauseAllEffects is deprecated, please call audioEngine.pause');
        for (var id in id2audio) {
            if (id === this._musicId) continue;
            var audio = id2audio[id];
            var state = audio.getState();
            if (state === Audio.State.PLAYING) {
                this._pauseIDCache.push(id);
                audio.pause();
            }
        }
        while (waitQueue.length > 0) {
            this._pauseIDCache.push(waitQueue.pop());
        }
    },
    resumeEffect: function (id) {
        cc.log('audioEngine.resumeEffect is deprecated, please call audioEngine.resume');
        this.resume(id);
    },
    resumeAllEffects: function () {
        cc.log('audioEngine.resumeAllEffects is deprecated, please call audioEngine.resumeAll');
        while (this._pauseIDCache.length > 0) {
            var id = this._pauseIDCache.pop();
            var audio = getAudioFromId(id);
            if (audio && audio.resume)
                audio.resume();
        }
    },
    stopEffect: function (id) {
        cc.log('audioEngine.stopEffect is deprecated, please call audioEngine.stop');
        return this.stop(id);
    },
    stopAllEffects: function (id) {
        cc.log('audioEngine.stopEffect is deprecated, please call audioEngine.stop');
        return this.stop(id);
    },
    unloadEffect: function () {
        cc.log('audioEngine.stopEffect is deprecated, please call audioEngine.stop');
        return this.stop(id);
    },
    end: function () {
        cc.log('audioEngine.end is deprecated, please call audioEngine.stopAll');
        return this.stopAll();
    }
};

module.exports = audioEngine;