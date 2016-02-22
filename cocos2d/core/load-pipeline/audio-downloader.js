/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the 'Software'), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var Path = require('../utils/CCPath');
var Sys = require('../platform/CCSys');
var Pipeline = require('./pipeline');
if (!CC_EDITOR || !Editor.isCoreLevel) {
    require('../../audio/CCAudio');
}

var __audioSupport;

/**
 * Audio support in the browser
 *
 * MULTI_CHANNEL        : Multiple audio while playing - If it doesn't, you can only play background music
 * WEB_AUDIO            : Support for WebAudio - Support W3C WebAudio standards, all of the audio can be played
 * AUTOPLAY             : Supports auto-play audio - if Don‘t support it, On a touch detecting background music canvas, and then replay
 * REPLAY_AFTER_TOUCH   : The first music will fail, must be replay after touchstart
 * USE_EMPTIED_EVENT    : Whether to use the emptied event to replace load callback
 * DELAY_CREATE_CTX     : delay created the context object - only webAudio
 * NEED_MANUAL_LOOP     : WebAudio loop attribute failure, need to manually perform loop
 *
 * May be modifications for a few browser version
 */
(function(){

    var DEBUG = false;

    var version = Sys.browserVersion;

    var supportTable = {
        'common' : {MULTI_CHANNEL: true , WEB_AUDIO: supportWebAudio , AUTOPLAY: true }
    };

    // check if browser supports Web Audio
    // check Web Audio's context
    var supportWebAudio = !!(window.AudioContext || window.webkitAudioContext || window.mozAudioContext);

    supportTable[Sys.BROWSER_TYPE_IE]  = {MULTI_CHANNEL: true , WEB_AUDIO: supportWebAudio , AUTOPLAY: true, USE_EMPTIED_EVENT: true};
    //  ANDROID  //
    supportTable[Sys.BROWSER_TYPE_ANDROID]  = {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: false};
    supportTable[Sys.BROWSER_TYPE_CHROME]   = {MULTI_CHANNEL: true , WEB_AUDIO: true , AUTOPLAY: false};
    supportTable[Sys.BROWSER_TYPE_FIREFOX]  = {MULTI_CHANNEL: true , WEB_AUDIO: true , AUTOPLAY: true , DELAY_CREATE_CTX: true};
    supportTable[Sys.BROWSER_TYPE_UC]       = {MULTI_CHANNEL: true , WEB_AUDIO: false, AUTOPLAY: false};
    supportTable[Sys.BROWSER_TYPE_QQ]       = {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: true };
    supportTable[Sys.BROWSER_TYPE_OUPENG]   = {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: false, REPLAY_AFTER_TOUCH: true , USE_EMPTIED_EVENT: true };
    supportTable[Sys.BROWSER_TYPE_WECHAT]   = {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: false, REPLAY_AFTER_TOUCH: true , USE_EMPTIED_EVENT: true };
    supportTable[Sys.BROWSER_TYPE_360]      = {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: true };
    supportTable[Sys.BROWSER_TYPE_MIUI]     = {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: true };
    supportTable[Sys.BROWSER_TYPE_LIEBAO]   = {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: false, REPLAY_AFTER_TOUCH: true , USE_EMPTIED_EVENT: true };
    supportTable[Sys.BROWSER_TYPE_SOUGOU]   = {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: false, REPLAY_AFTER_TOUCH: true , USE_EMPTIED_EVENT: true };
    //'Baidu' browser can automatically play
    //But because it may be play failed, so need to replay and auto
    supportTable[Sys.BROWSER_TYPE_BAIDU]    = {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: false, REPLAY_AFTER_TOUCH: true , USE_EMPTIED_EVENT: true };
    supportTable[Sys.BROWSER_TYPE_BAIDU_APP]= {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: false, REPLAY_AFTER_TOUCH: true , USE_EMPTIED_EVENT: true };

    //  APPLE  //
    supportTable[Sys.BROWSER_TYPE_SAFARI]  = {MULTI_CHANNEL: true , WEB_AUDIO: true , AUTOPLAY: false, webAudioCallback: function(realUrl){
        document.createElement('audio').src = realUrl;
    }};

    if(Sys.isMobile){
        if(Sys.os !== Sys.OS_IOS)
            __audioSupport = supportTable[Sys.browserType] || supportTable['common'];
        else
            __audioSupport = supportTable[Sys.BROWSER_TYPE_SAFARI];
    }else{
        switch(Sys.browserType){
            case Sys.BROWSER_TYPE_IE:
                __audioSupport = supportTable[Sys.BROWSER_TYPE_IE];
                break;
            case Sys.BROWSER_TYPE_FIREFOX:
                __audioSupport = supportTable[Sys.BROWSER_TYPE_FIREFOX];
                break;
            default:
                __audioSupport = supportTable['common'];
        }
    }

    ///////////////////////////
    //  Browser compatibility//
    ///////////////////////////
    if(version){
        switch(Sys.browserType){
            case Sys.BROWSER_TYPE_CHROME:
                version = parseInt(version);
                if(version < 30){
                    __audioSupport  = {MULTI_CHANNEL: false , WEB_AUDIO: true , AUTOPLAY: false};
                }else if(version === 42){
                    __audioSupport.NEED_MANUAL_LOOP = true;
                }
                break;
            case Sys.BROWSER_TYPE_MIUI:
                if(Sys.isMobile){
                    version = version.match(/\d+/g);
                    if(version[0] < 2 || (version[0] === 2 && version[1] === 0 && version[2] <= 1)){
                        __audioSupport.AUTOPLAY = false;
                    }
                }
                break;
        }
    }

    if(DEBUG){
        setTimeout(function(){
            cc.log('browse type: ' + Sys.browserType);
            cc.log('browse version: ' + version);
            cc.log('MULTI_CHANNEL: ' + __audioSupport.MULTI_CHANNEL);
            cc.log('WEB_AUDIO: ' + __audioSupport.WEB_AUDIO);
            cc.log('AUTOPLAY: ' + __audioSupport.AUTOPLAY);
        }, 0);
    }

    window.__audioSupport = __audioSupport;
})();

var context;
try {
    if (__audioSupport.WEB_AUDIO) {
        context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
        if(__audioSupport.DELAY_CREATE_CTX) {
            setTimeout(function(){ context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)(); }, 0);
        }
    }
} catch(error) {
    __audioSupport.WEB_AUDIO = false;
    cc.log("browser don't support web audio");
}

var formatSupport = [];

(function(){
    var audio = document.createElement('audio');
    if(audio.canPlayType) {
        var ogg = audio.canPlayType('audio/ogg; codecs="vorbis"');
        if (ogg && ogg !== '') formatSupport.push('.ogg');
        var mp3 = audio.canPlayType('audio/mpeg');
        if (mp3 && mp3 !== '') formatSupport.push('.mp3');
        var wav = audio.canPlayType('audio/wav; codecs="1"');
        if (wav && wav !== '') formatSupport.push('.wav');
        var mp4 = audio.canPlayType('audio/mp4');
        if (mp4 && mp4 !== '') formatSupport.push('.mp4');
        var m4a = audio.canPlayType('audio/x-m4a');
        if (m4a && m4a !== '') formatSupport.push('.m4a');
    }
})();

function loadAudioFromExtList (url, typeList, audio, cb){
    if(typeList.length === 0){
        var ERRSTR = 'can not found the resource of audio! Last match url is : ';
        ERRSTR += url.replace(/\.(.*)?$/, '(');
        formatSupport.forEach(function(ext){
            ERRSTR += ext + '|';
        });
        ERRSTR = ERRSTR.replace(/\|$/, ')');
        return cb({status: 520, errorMessage: ERRSTR}, null);
    }

    url = Path.changeExtname(url, typeList.splice(0, 1));

    if (__audioSupport.WEB_AUDIO) {//Buffer
        if (__audioSupport.webAudioCallback) {
            __audioSupport.webAudioCallback(url);
        }
        var request = Pipeline.getXMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onload = function () {
            context['decodeAudioData'](request.response, function (buffer) {
                //success
                audio.setBuffer(buffer);
                cb(null, audio);
            }, function() {
                //error
                loadAudioFromExtList(url, typeList, audio, cb);
            });
        };

        request.onerror = function () {
            cb({status: 520, errorMessage: ERRSTR}, null);
        };

        request.send();
    } else {//DOM
        var element = document.createElement('audio');
        var cbCheck = false;
        var termination = false;

        var timer = setTimeout(function () {
            if (element.readyState === 0) {
                emptied();
            } else {
                termination = true;
                element.pause();
                document.body.removeChild(element);
                cb('Audio load timeout : ' + url, audio);
            }
        }, 8000);

        var success = function () {
            if (!cbCheck) {
                //element.pause();
                try { 
                    element.currentTime = 0;
                    element.volume = 1; 
                } catch (e) {}
                document.body.removeChild(element);
                audio.setElement(element);
                element.removeEventListener('canplaythrough', success, false);
                element.removeEventListener('error', failure, false);
                element.removeEventListener('emptied', emptied, false);
                !termination && cb(null, audio);
                cbCheck = true;
                clearTimeout(timer);
            }
        };

        var failure = function(){
            if (!cbCheck) return;
            //element.pause();
            document.body.removeChild(element);
            element.removeEventListener('canplaythrough', success, false);
            element.removeEventListener('error', failure, false);
            element.removeEventListener('emptied', emptied, false);
            !termination && loadAudioFromExtList(url, typeList, audio, cb);
            cbCheck = true;
            clearTimeout(timer);
        };

        var emptied = function(){
            termination = true;
            success();
            cb(null, audio);
        };

        element.addEventListener('canplaythrough', success, false);
        element.addEventListener('error', failure, false);
        if(__audioSupport.USE_EMPTIED_EVENT)
            element.addEventListener('emptied', emptied, false);

        element.src = url;
        document.body.appendChild(element);
        element.volume = 0;
        //some browsers cannot pause(qq 6.1)
        //element.play();
    }
}

function downloadAudio (item, callback) {
    if (formatSupport.length === 0) {
        return callback( new Error('Audio Downloader: audio not supported on this browser!') );
    }

    var url = item.src,
        extname = Path.extname(url),
        typeList = [extname],
        i, audio;

    // Generate all types
    for (i = 0; i < formatSupport.length; i++) {
        if (extname !== formatSupport[i]) {
            typeList.push(formatSupport[i]);
        }
    }

    if (__audioSupport.WEB_AUDIO) {
        try {
            var volume = context['createGain']();
            volume['gain'].value = 1;
            volume['connect'](context['destination']);
            audio = new cc.Audio(context, volume, url);
            if (__audioSupport.NEED_MANUAL_LOOP) {
                audio._manualLoop = true;
            }
        } catch(err) {
            __audioSupport.WEB_AUDIO = false;
            cc.warn('The current browser don\'t support web audio');
            audio = new cc.Audio(null, null, url);
        }
    } else {
        audio = new cc.Audio(null, null, url);
    }

    loadAudioFromExtList(url, typeList, audio, callback);
}


module.exports = downloadAudio;