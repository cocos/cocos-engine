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

var JS = require('../core/platform/js');

/**
 * Encapsulate DOM and webAudio
 */
cc.Audio = function (url) {
    this.src = url;
    this._element = null;
    this._AUDIO_TYPE = 'AUDIO';
};

cc.Audio.touchPlayList = [
    //{ offset: 0, audio: audio }
];

cc.Audio.bindTouch = false;
cc.Audio.touchStart = function () {
    var list = cc.Audio.touchPlayList;
    var item = null;
    while (item = list.pop()) {
        item.audio.loop = !!item.loop;
        item.audio.play(item.offset);
    }
};

cc.Audio.WebAudio = function (buffer) {
    this.buffer = buffer;
    this.context = cc.sys.__audioSupport.context;

    var volume = this.context['createGain']();
    volume['gain'].value = 1;
    volume['connect'](this.context['destination']);
    this._volume = volume;

    this._loop = false;

    // The time stamp on the audio time axis when the recording begins to play.
    this._startTime = -1;
    // Record the currently playing 'Source'
    this._currentSource = null;
    // Record the time has been played
    this.playedLength = 0;

    this._currextTimer = null;
};

cc.Audio.WebAudio.prototype = {
    constructor: cc.Audio.WebAudio,

    get paused () {
        // If the current audio is a loop, paused is false
        if (this._currentSource && this._currentSource.loop)
            return false;

        // startTime default is -1
        if (this._startTime === -1)
            return true;

        // Current time -  Start playing time > Audio duration
        return this.context.currentTime - this._startTime > this.buffer.duration;
    },

    get loop () { return this._loop; },
    set loop (bool) { return this._loop = bool; },

    get volume () { return this._volume['gain'].value; },
    set volume (num) { return this._volume['gain'].value = num; },

    get currentTime () { return this.playedLength; },
    set currentTime (num) { return this.playedLength = num; },

    play: function (offset) {

        // If repeat play, you need to stop before an audio
        if (this._currentSource && !this.paused) {
            this._currentSource.stop(0);
            this.playedLength = 0;
        }

        var audio = this.context["createBufferSource"]();
        audio.buffer = this.buffer;
        audio["connect"](this._volume);
        audio.loop = this._loop;

        this._startTime = this.context.currentTime;
        offset = offset || this.playedLength;

        var duration = this.buffer.duration;
        if (!this._loop) {
            if (audio.start)
                audio.start(0, offset, duration - offset);
            else if (audio["notoGrainOn"])
                audio["noteGrainOn"](0, offset, duration - offset);
            else
                audio["noteOn"](0, offset, duration - offset);
        } else {
            if (audio.start)
                audio.start(0);
            else if (audio["notoGrainOn"])
                audio["noteGrainOn"](0);
            else
                audio["noteOn"](0);
        }

        this._currentSource = audio;

        // If the current audio context time stamp is 0
        // There may be a need to touch events before you can actually start playing audio
        if (this.context.currentTime === 0) {
            var self = this;
            clearTimeout(this._currextTimer);
            this._currextTimer = setTimeout(function () {
                if (self.context.currentTime === 0) {
                    cc.Audio.touchPlayList.push({
                        offset: offset,
                        audio: self
                    });
                }
            }, 10);
        }
    },
    pause: function () {
        // Record the time the current has been played
        this.playedLength = this.context.currentTime - this._startTime;
        // If more than the duration of the audio, Need to take the remainder
        this.playedLength %= this.buffer.duration;
        var audio = this._currentSource;
        this._currentSource = null;
        this._startTime = -1;
        if (audio)
            audio.stop(0);
    }
};

JS.mixin(cc.Audio.prototype, {
    setBuffer: function (buffer) {
        this._AUDIO_TYPE = "WEBAUDIO";
        this._element = new cc.Audio.WebAudio(buffer);
    },

    setElement: function (element) {
        this._AUDIO_TYPE = "AUDIO";
        this._element = element;

        // Prevent partial browser from playing after the end does not reset the paused tag
        element.addEventListener('ended', function () {
            if (!element.loop) {
                element.paused = true;
            }
        });
    },

    play: function (offset, loop) {
        if (!this._element) return;
        this._element.loop = loop;
        this._element.play();

        if (this._AUDIO_TYPE === 'AUDIO' && this._element.paused) {
            this.stop();
            cc.Audio.touchPlayList.push({ loop: loop, offset: offset, audio: this._element });
        }

        if (cc.Audio.bindTouch === false) {
            cc.Audio.bindTouch = true;
            // Listen to the touchstart body event and play the audio when necessary.
            cc.game.canvas.addEventListener('touchstart', cc.Audio.touchStart);
        }
    },

    getPlaying: function () {
        if (!this._element) return true;
        return !this._element.paused;
    },

    stop: function () {
        if (!this._element) return;
        this._element.pause();
        try{
            this._element.currentTime = 0;
        } catch (err) {}
    },

    pause: function () {
        if (!this._element) return;
        this._element.pause();
    },

    resume: function () {
        if (!this._element) return;
        this._element.play();
    },

    setVolume: function (volume) {
        if (!this._element) return;
        this._element.volume = volume;
    },

    getVolume: function () {
        if (!this._element) return;
        return this._element.volume;
    },

    cloneNode: function () {
        var audio = new cc.Audio(this.src);
        if (this._AUDIO_TYPE === "AUDIO") {
            var elem = document.createElement("audio");
            var sources = elem.getElementsByTagName('source');
            for (var i=0; i<sources.length; i++) {
                elem.appendChild(sources[i]);
            }
            elem.src = this.src;
            audio.setElement(elem);
        } else {
            audio.setBuffer(this._element.buffer);
        }
        return audio;
    }
});

(function(polyfill){

    var SWA = polyfill.WEB_AUDIO, SWB = polyfill.ONLY_ONE;

    /**
     * !#en cc.audioEngine is the singleton object, it provide simple audio APIs.
     * !#zh
     * cc.audioengine是单例对象。<br/>
     * 主要用来播放背景音乐和音效，背景音乐同一时间只能播放一个，而音效则可以同时播放多个。<br/>
     * 注意：<br/>
     * 在 Android 系统浏览器上，不同浏览器，不同版本的效果不尽相同。<br/>
     * 比如说：大多数浏览器都需要用户物理交互才可以开始播放音效，有一些不支持 WebAudio，<br/>
     * 有一些不支持多音轨播放。总之如果对音乐依赖比较强，请做尽可能多的测试。
     * @class audioEngine
     * @static
     */
    cc.audioEngine = {
        _currMusic: null,
        _musicVolume: 1,

        features: polyfill,

        /**
         * !#en Play music.
         * !#zh
         * 播放指定音乐，并可以设置是否循环播放。<br/>
         * 注意：音乐播放接口不支持多音轨，同一时间只能播放一个音乐。
         * @method playMusic
         * @param {String} url - The path of the music file without filename extension.
         * @param {Boolean} loop - Whether the music loop or not.
         * @example
         * //example
         * cc.audioEngine.playMusic(path, false);
         */
        playMusic: function(url, loop){
            var bgMusic = this._currMusic;
            if (bgMusic && bgMusic.getPlaying()) {
                bgMusic.stop();
            }
            var item = cc.loader.getItem(url);
            var audio = item && item.audio ? item.audio : null;
            if (!audio) {
                var self = this;
                cc.loader.load(url, function (error) {
                    if (!error) {
                        var item = cc.loader.getItem(url);
                        var audio = item && item.audio ? item.audio : null;
                        audio.play(0, loop || false);
                        audio.setVolume(self._musicVolume);
                        self._currMusic = audio;
                    }
                });
                item = cc.loader.getItem(url);
                return item && item.audio ? item.audio : null;
            }
            audio.play(0, loop);
            audio.setVolume(this._musicVolume);

            this._currMusic = audio;
            return audio;
        },

        /**
         * !#en Stop playing music.
         * !#zh 停止当前音乐。
         * @method stopMusic
         * @param {Boolean} [releaseData] - If release the music data or not.As default value is false.
         * @example
         * //example
         * cc.audioEngine.stopMusic();
         */
        stopMusic: function(releaseData){
            var audio = this._currMusic;
            if (audio) {
                audio.stop();
                if (releaseData)
                    cc.loader.release(audio.src);
            }
        },

        /**
         * !#en Pause playing music.
         * !#zh 暂停正在播放音乐。
         * @method pauseMusic
         * @example
         * //example
         * cc.audioEngine.pauseMusic();
         */
        pauseMusic: function(){
            var audio = this._currMusic;
            if (audio)
                audio.pause();
        },

        /**
         * !#en Resume playing music.
         * !#zh 恢复音乐播放。
         * @method resumeMusic
         * @example
         * //example
         * cc.audioEngine.resumeMusic();
         */
        resumeMusic: function(){
            var audio = this._currMusic;
            if (audio)
                audio.resume();
        },

        /**
         * !#en Rewind playing music.
         * !#zh 从头开始重新播放当前音乐。
         * @method rewindMusic
         * @example
         * //example
         * cc.audioEngine.rewindMusic();
         */
        rewindMusic: function(){
            var audio = this._currMusic;
            if (audio) {
                audio.stop();
                audio.play();
            }
        },

        /**
         * !#en The volume of the music max value is 1.0,the min value is 0.0 .
         * !#zh 获取音量（0.0 ~ 1.0）。
         * @method getMusicVolume
         * @return {Number}
         * @example
         * //example
         * var volume = cc.audioEngine.getMusicVolume();
         */
        getMusicVolume: function(){
            return this._musicVolume;
        },

        /**
         * !#en Set the volume of music.
         * !#zh 设置音量（0.0 ~ 1.0）。
         * @method setMusicVolume
         * @param {Number} volume Volume must be in 0.0~1.0 .
         * @example
         * //example
         * cc.audioEngine.setMusicVolume(0.5);
         */
        setMusicVolume: function(volume){
            volume = volume - 0;
            if (isNaN(volume)) volume = 1;
            if (volume > 1) volume = 1;
            if (volume < 0) volume = 0;

            this._musicVolume = volume;
            var audio = this._currMusic;
            if (audio) {
                audio.setVolume(volume);
            }
        },

        /**
         * !#en Whether the music is playing.
         * !#zh 音乐是否正在播放。
         * @method isMusicPlaying
         * @return {Boolean} If is playing return true,or return false.
         * @example
         * //example
         *  if (cc.audioEngine.isMusicPlaying()) {
         *      cc.log("music is playing");
         *  }
         *  else {
         *      cc.log("music is not playing");
         *  }
         */
        isMusicPlaying: function(){
            var audio = this._currMusic;
            if (audio) {
                return audio.getPlaying();
            } else {
                return false;
            }
        },

        _audioPool: {},
        _maxAudioInstance: 10,
        _effectVolume: 1,
        /**
         * !#en Play sound effect.
         * !#zh
         * 播放指定音效，并可以设置是否循环播放。<br/>
         * 注意：在部分不支持多音轨的浏览器上，这个接口会失效，请使用 playMusic
         * @method playEffect
         * @param {String} url The path of the sound effect with filename extension.
         * @param {Boolean} loop Whether to loop the effect playing, default value is false
         * @param {Boolean} volume
         * @return {Number|null} the audio id
         * @example
         * //example
         * var soundId = cc.audioEngine.playEffect(path);
         */
        playEffect: function(url, loop, volume){
            volume = volume === undefined ? this._effectVolume : volume;

            // 如果只能够播放一个音频，则优先保证背景音乐
            if (SWB && this._currMusic && this._currMusic.getPlaying()) {
                cc.log('Browser is only allowed to play one audio');
                return null;
            }

            var effectList = this._audioPool[url];
            if (!effectList) {
                effectList = this._audioPool[url] = [];
            }

            var i;
            for(i = 0; i < effectList.length; i++){
                if (!effectList[i].getPlaying()) {
                    break;
                }
            }

            if (!SWA && i > this._maxAudioInstance) {
                var first = effectList.shift();
                first.stop();
                effectList.push(first);
                i = effectList.length - 1;
                // cc.log("Error: %s greater than %d", url, this._maxAudioInstance);
            }

            var audio;
            if (effectList[i]) {
                audio = effectList[i];
                audio.setVolume(volume);
                audio.play(0, loop || false);
                return audio;
            }

            var item = cc.loader.getItem(url);
            audio = item && item.audio ? item.audio : null;
            if (SWA && audio && audio._AUDIO_TYPE != "WEBAUDIO") {
                //delete cc.loader.getRes(url);
                cc.loader.release(url);
                audio = null;
            }

            if (!audio) {
                // Force using webaudio for effects
                cc.Audio.useWebAudio = true;
                audio = new cc.Audio(url);
                cc.loader.load(url, function (error, url) {
                    if (error) return;
                    var item = cc.loader.getItem(url);
                    var loadAudio = item && item.audio ? item.audio : null;

                    if (loadAudio._AUDIO_TYPE === 'WEBAUDIO')
                        audio.setBuffer(loadAudio._element.buffer);
                    else
                        audio.setElement(loadAudio._element);

                    audio.setVolume(volume);
                    audio.play(0, loop || false);
                    effectList.push(audio);
                });
                cc.Audio.useWebAudio = false;
                return audio;
            }

            audio = audio.cloneNode();
            audio.setVolume(volume);
            audio.play(0, loop || false);
            effectList.push(audio);

            return audio;
        },

        /**
         * !#en Set the volume of sound effects.
         * !#zh 设置音效音量（0.0 ~ 1.0）。
         * @method setEffectsVolume
         * @param {Number} volume Volume must be in 0.0~1.0 .
         * @example
         * //example
         * cc.audioEngine.setEffectsVolume(0.5);
         */
        setEffectsVolume: function(volume){
            volume = volume - 0;
            if(isNaN(volume)) volume = 1;
            if(volume > 1) volume = 1;
            if(volume < 0) volume = 0;

            this._effectVolume = volume;
            var audioPool = this._audioPool;
            for(var p in audioPool){
                var audioList = audioPool[p];
                if(Array.isArray(audioList))
                    for(var i=0; i<audioList.length; i++){
                        audioList[i].setVolume(volume);
                    }
            }
        },

        /**
         * !#en The volume of the effects max value is 1.0,the min value is 0.0 .
         * !#zh 获取音效音量（0.0 ~ 1.0）。
         * @method getEffectsVolume
         * @return {Number}
         * @example
         * //example
         * var effectVolume = cc.audioEngine.getEffectsVolume();
         */
        getEffectsVolume: function(){
            return this._effectVolume;
        },

        /**
         * !#en Pause playing sound effect.
         * !#zh 暂停指定的音效。
         * @method pauseEffect
         * @param {Number} audio - The return value of function playEffect.
         * @example
         * //example
         * cc.audioEngine.pauseEffect(audioID);
         */
        pauseEffect: function(audio){
            if(audio){
                audio.pause();
            }
        },

        /**
         * !#en Pause all playing sound effect.
         * !#zh 暂停现在正在播放的所有音效。
         * @method pauseAllEffects
         * @example
         * //example
         * cc.audioEngine.pauseAllEffects();
         */
        pauseAllEffects: function(){
            var ap = this._audioPool;
            for(var p in ap){
                var list = ap[p];
                for(var i=0; i<ap[p].length; i++){
                    if(list[i].getPlaying()){
                        list[i].pause();
                    }
                }
            }
        },

        /**
         * !#en Resume playing sound effect.
         * !#zh 恢复播放指定的音效。
         * @method resumeEffect
         * @param {Number} audioID - The return value of function playEffect.
         * @audioID
         * //example
         * cc.audioEngine.resumeEffect(audioID);
         */
        resumeEffect: function(audio){
            if(audio)
                audio.resume();
        },

        /**
         * !#en Resume all playing sound effect.
         * !#zh 恢复播放所有之前暂停的所有音效。
         * @method resumeAllEffects
         * @example
         * //example
         * cc.audioEngine.resumeAllEffects();
         */
        resumeAllEffects: function(){
            var ap = this._audioPool;
            for(var p in ap){
                var list = ap[p];
                for(var i=0; i<ap[p].length; i++){
                    list[i].resume();
                }
            }
        },

        /**
         * !#en Stop playing sound effect.
         * !#zh 停止播放指定音效。
         * @method stopEffect
         * @param {Number} audioID - The return value of function playEffect.
         * @example
         * //example
         * cc.audioEngine.stopEffect(audioID);
         */
        stopEffect: function(audio){
            if(audio)
                audio.stop();
        },

        /**
         * !#en Stop all playing sound effects.
         * !#zh 停止正在播放的所有音效。
         * @method stopAllEffects
         * @example
         * //example
         * cc.audioEngine.stopAllEffects();
         */
        stopAllEffects: function(){
            var ap = this._audioPool;
            for(var p in ap){
                var list = ap[p];
                for(var i=0; i<ap[p].length; i++){
                    list[i].stop();
                }
            }
        },

        /**
         * !#en Unload the preloaded effect from internal buffer.
         * !#zh 卸载预加载的音效。
         * @method unloadEffect
         * @param {String} url
         * @example
         * //example
         * cc.audioEngine.unloadEffect(EFFECT_FILE);
         */
        unloadEffect: function(url){
            if(!url){
                return;
            }

            cc.loader.release(url);
            var pool = this._audioPool[url];
            if(pool) pool.length = 0;
            delete this._audioPool[url];
        },

        /**
         * !#en End music and effects.
         * !#zh 停止所有音乐和音效的播放。
         * @method end
         */
        end: function(){
            this.stopMusic();
            this.stopAllEffects();
        },

        _pauseCache: [],
        _pausePlaying: function(){
            var bgMusic = this._currMusic;
            if(bgMusic && bgMusic.getPlaying()){
                bgMusic.pause();
                this._pauseCache.push(bgMusic);
            }
            var ap = this._audioPool;
            for(var p in ap){
                var list = ap[p];
                for(var i=0; i<ap[p].length; i++){
                    if(list[i].getPlaying()){
                        list[i].pause();
                        this._pauseCache.push(list[i]);
                    }
                }
            }
        },

        _resumePlaying: function(){
            var list = this._pauseCache;
            for(var i=0; i<list.length; i++){
                list[i].resume();
            }
            list.length = 0;
        }
    };

})(cc.sys.__audioSupport);
