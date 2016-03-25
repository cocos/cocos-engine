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
cc.Audio = function (context, volume, url) {
    //TODO Maybe loader shift in will be better
    this.volume = 1;
    this.loop = false;
    this._touch = false;

    this._playing = false;
    this._AUDIO_TYPE = "AUDIO";
    this._pause = false;

    //Web Audio
    this._buffer = null;
    this._currentSource = null;
    this._startTime = null;
    this._currentTime = null;
    this._context = null;
    this._volume = null;

    this._ignoreEnded = false;
    this._manualLoop = false;

    //DOM Audio
    this._element = null;

    context && (this._context = context);
    volume && (this._volume = volume);
    if (context && volume) {
        this._AUDIO_TYPE = "WEBAUDIO";
    }
    this.src = url;
};

JS.mixin(cc.Audio.prototype, {
    _setBufferCallback: null,
    setBuffer: function(buffer){
        if(!buffer) return;
        var playing = this._playing;
        this._AUDIO_TYPE = "WEBAUDIO";

        if(this._buffer && this._buffer !== buffer && this.getPlaying())
            this.stop();

        this._buffer = buffer;
        if(playing)
            this.play();

        this._volume["gain"].value = this.volume;
        this._setBufferCallback && this._setBufferCallback(buffer);
    },

    _setElementCallback: null,
    setElement: function(element){
        if(!element) return;
        var playing = this._playing;
        this._AUDIO_TYPE = "AUDIO";

        if(this._element && this._element !== element && this.getPlaying())
            this.stop();

        this._element = element;
        if(playing)
            this.play();

        element.volume = this.volume;
        element.loop = this.loop;
        this._setElementCallback && this._setElementCallback(element);
    },

    play: function(offset, loop){
        this._playing = true;
        this.loop = loop === undefined ? this.loop : loop;
        if(this._AUDIO_TYPE === "AUDIO"){
            this._playOfAudio(offset);
        }else{
            this._playOfWebAudio(offset);
        }
    },

    getPlaying: function(){
        // if(!this._playing){
        //     return false;
        // }
        if(this._AUDIO_TYPE === "AUDIO"){
            var audio = this._element;
            if(!audio || this._pause || audio.ended){
                return this._playing = false;
            }
            return true;
        }
        var sourceNode = this._currentSource;
        if(!sourceNode || !sourceNode["playbackState"])
            return true;
        return this._currentTime + this._context.currentTime - this._startTime < sourceNode.buffer.duration;
    },

    _playOfWebAudio: function(offset){
        var cs = this._currentSource;
        if(!this._buffer){
            return;
        }
        if(!this._pause && cs){
            if(this._context.currentTime === 0 || this._currentTime + this._context.currentTime - this._startTime > cs.buffer.duration)
                this._stopOfWebAudio();
            else
                return;
        }
        var audio = this._context["createBufferSource"]();
        audio.buffer = this._buffer;
        audio["connect"](this._volume);
        if(this._manualLoop)
            audio.loop = false;
        else
            audio.loop = this.loop;
        this._startTime = this._context.currentTime;
        this._currentTime = offset || 0;
        this._ignoreEnded = false;

        /*
         * Safari on iOS 6 only supports noteOn(), noteGrainOn(), and noteOff() now.(iOS 6.1.3)
         * The latest version of chrome has supported start() and stop()
         * start() & stop() are specified in the latest specification (written on 04/26/2013)
         *      Reference: https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html
         * noteOn(), noteGrainOn(), and noteOff() are specified in Draft 13 version (03/13/2012)
         *      Reference: http://www.w3.org/2011/audio/drafts/2WD/Overview.html
         */
        if(audio.start){
            audio.start(0, offset || 0);
        }else if(audio["noteGrainOn"]){
            var duration = audio.buffer.duration;
            if (this.loop) {
                /*
                 * On Safari on iOS 6, if loop == true, the passed in @param duration will be the duration from now on.
                 * In other words, the sound will keep playing the rest of the music all the time.
                 * On latest chrome desktop version, the passed in duration will only be the duration in this cycle.
                 * Now that latest chrome would have start() method, it is prepared for iOS here.
                 */
                audio["noteGrainOn"](0, offset, duration);
            } else {
                audio["noteGrainOn"](0, offset, duration - offset);
            }
        }else {
            // if only noteOn() is supported, resuming sound will NOT work
            audio["noteOn"](0);
        }
        this._currentSource = audio;
        var self = this;
        audio["onended"] = function(){
            if(self._manualLoop && self._playing && self.loop){
                self.stop();
                self.play();
                return;
            }
            if(self._ignoreEnded){
                self._ignoreEnded = false;
            }else{
                if(!self._pause)
                    self.stop();
                else
                    self._playing = false;
            }
        };
    },

    _playOfAudio: function(){
        var audio = this._element;
        if(audio){
            audio.loop = this.loop;
            audio.play();
        }
    },

    stop: function(){
        this._playing = false;
        if(this._AUDIO_TYPE === "AUDIO"){
            this._stopOfAudio();
        }else{
            this._stopOfWebAudio();
        }
    },

    _stopOfWebAudio: function(){
        var audio = this._currentSource;
        this._ignoreEnded = true;
        if(audio){
            audio.stop(0);
            this._currentSource = null;
        }
    },

    _stopOfAudio: function(){
        var audio = this._element;
        if(audio){
            audio.pause();
            if (audio.duration && audio.duration !== Infinity)
                audio.currentTime = 0;
        }
    },

    pause: function(){
        if(this.getPlaying() === false)
            return;
        this._playing = false;
        this._pause = true;
        if(this._AUDIO_TYPE === "AUDIO"){
            this._pauseOfAudio();
        }else{
            this._pauseOfWebAudio();
        }
    },

    _pauseOfWebAudio: function(){
        this._currentTime += this._context.currentTime - this._startTime;
        var audio = this._currentSource;
        if(audio){
            audio.stop(0);
        }
    },

    _pauseOfAudio: function(){
        var audio = this._element;
        if(audio){
            audio.pause();
        }
    },

    resume: function(){
        if(this._pause){
            if(this._AUDIO_TYPE === "AUDIO"){
                this._resumeOfAudio();
            }else{
                this._resumeOfWebAudio();
            }
            this._pause = false;
            this._playing = true;
        }
    },

    _resumeOfWebAudio: function(){
        var audio = this._currentSource;
        if(audio){
            this._startTime = this._context.currentTime;
            var offset = this._currentTime % audio.buffer.duration;
            this._playOfWebAudio(offset);
        }
    },

    _resumeOfAudio: function(){
        var audio = this._element;
        if(audio){
            audio.play();
        }
    },

    setVolume: function(volume){
        if(volume > 1) volume = 1;
        if(volume < 0) volume = 0;
        this.volume = volume;
        if(this._AUDIO_TYPE === "AUDIO"){
            if(this._element){
                this._element.volume = volume;
            }
        }else{
            if(this._volume){
                this._volume["gain"].value = volume;
            }
        }
    },

    getVolume: function(){
        return this.volume;
    },

    cloneNode: function(){
        var audio, self;
        if(this._AUDIO_TYPE === "AUDIO"){
            audio = new cc.Audio();

            var elem = document.createElement("audio");
            elem.src = this.src;
            audio.setElement(elem);
        }else{
            var volume = this._context["createGain"]();
            volume["gain"].value = 1;
            volume["connect"](this._context["destination"]);
            audio = new cc.Audio(this._context, volume, this.src);
            if(this._buffer){
                audio.setBuffer(this._buffer);
            }else{
                self = this;
                this._setBufferCallback = function(buffer){
                    audio.setBuffer(buffer);
                    self._setBufferCallback = null;
                };
            }
            audio._manualLoop = this._manualLoop;
        }
        audio._AUDIO_TYPE = this._AUDIO_TYPE;
        return audio;
    }

});

(function(polyfill){

    var SWA = polyfill.WEB_AUDIO,
        SWC = polyfill.AUTOPLAY;

    /**
     * !#en cc.audioEngine is the singleton object, it provide simple audio APIs.
     * !#zn
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
            if(bgMusic && bgMusic.src !== url && bgMusic.getPlaying()){
                bgMusic.stop();
            }
            var item = cc.loader.getItem(url);
            var audio = item && item.audio ? item.audio : null;
            if(!audio){
                var self = this;
                cc.loader.load(url, function (error) {
                    if (!error) {
                        var item = cc.loader.getItem(url);
                        var audio = item && item.audio ? item.audio : null;
                        audio.play(0, loop);
                        audio.setVolume(self._musicVolume);
                        self._currMusic = audio;
                    }
                });
                return;
            }
            audio.play(0, loop);
            audio.setVolume(this._musicVolume);

            this._currMusic = audio;
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
            if(audio){
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
            if(audio)
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
            if(audio)
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
            if(audio){
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
            if(isNaN(volume)) volume = 1;
            if(volume > 1) volume = 1;
            if(volume < 0) volume = 0;

            this._musicVolume = volume;
            var audio = this._currMusic;
            if(audio){
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
            if(audio){
                return audio.getPlaying();
            }else{
                return false;
            }
        },

        _audioPool: {},
        _maxAudioInstance: 5,
        _effectVolume: 1,
        /**
         * !#en Play sound effect.
         * !#zh
         * 播放指定音效，并可以设置是否循环播放。<br/>
         * 注意：在部分不支持多音轨的浏览器上，这个接口会失效，请使用 playMusic
         * @method playEffect
         * @param {String} url The path of the sound effect with filename extension.
         * @param {Boolean} loop Whether to loop the effect playing, default value is false
         * @return {Number|null} the audio id
         * @example
         * //example
         * var soundId = cc.audioEngine.playEffect(path);
         */
        playEffect: function(url, loop){
            //If the browser just support playing single audio
            if(!polyfill.MULTI_CHANNEL){
                //Must be forced to shut down
                //Because playing MULTI_CHANNEL audio will be stuck in chrome 28 (android)
                return null;
            }

            var effectList = this._audioPool[url];
            if(!effectList){
                effectList = this._audioPool[url] = [];
            }

            for(var i=0; i<effectList.length; i++){
                if(!effectList[i].getPlaying()){
                    break;
                }
            }

            var audio;
            if(effectList[i]){
                audio = effectList[i];
                audio.setVolume(this._effectVolume);
                audio.play(0, loop);
            }else if(!SWA && i > this._maxAudioInstance){
                cc.log("Error: %s greater than %d", url, this._maxAudioInstance);
            }else{
                var item = cc.loader.getItem(url);
                audio = item && item.audio ? item.audio : null;
                if(!audio){
                    cc.loader.load(url);
                    item = cc.loader.getItem(url);
                    audio = item && item.audio ? item.audio : null;
                    if (!audio) {
                        return;
                    }
                }
                audio = audio.cloneNode();
                audio.setVolume(this._effectVolume);
                audio.loop = loop || false;
                audio.play();
                effectList.push(audio);
            }

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

    /**
     * ome browsers must click on the page
     */
    if(!SWC){

        //TODO Did not complete loading
        var reBGM = function(){
            var bg = cc.audioEngine._currMusic;
            if(
                bg &&
                bg._touch === false &&
                bg._playing &&
                bg.getPlaying()
            ){
                bg._touch = true;
                bg.play(0, bg.loop);
                !polyfill.REPLAY_AFTER_TOUCH && cc._canvas.removeEventListener("touchstart", reBGM);
            }

        };

        setTimeout(function(){
            if(cc._canvas){
                cc._canvas.addEventListener("touchstart", reBGM, false);
            }
        }, 150);
    }

})(cc.sys.__audioSupport);
