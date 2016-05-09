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

var Path = require('../utils/CCPath');
var Sys = require('../platform/CCSys');
var Pipeline = require('./pipeline');
require('../../audio/CCAudio');

var __audioSupport = Sys.__audioSupport;
var formatSupport = __audioSupport.format;
var context = __audioSupport.context;

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

    if (__audioSupport.WEB_AUDIO && cc.Audio.useWebAudio) {
        loadWebAudio(url, typeList, audio, cb);
    } else {
        loadDomAudio(url, typeList, audio, cb);
    }
}

function loadDomAudio (url, typeList, audio, cb) {

    var num = __audioSupport.ONE_SOURCE ? 1 : typeList.length;

    // 加载统一使用dom
    var dom = document.createElement('audio');
    for (var i=0; i<num; i++) {
        var source = document.createElement('source');
        source.src = cc.path.changeExtname(url, typeList[i]);
        dom.appendChild(source);
    }

    audio.setElement(dom);

    var timer = setTimeout(function(){
        if (dom.readyState === 0) {
            failure();
        } else {
            success();
        }
    }, 8000);

    var success = function () {
        dom.removeEventListener("canplaythrough", success, false);
        dom.removeEventListener("error", failure, false);
        dom.removeEventListener("emptied", success, false);
        if (__audioSupport.USE_LOADER_EVENT)
            dom.removeEventListener(__audioSupport.USE_LOADER_EVENT, success, false);
        clearTimeout(timer);
        cb(null, url);
    };
    var failure = function () {
        cc.log('load audio failure - ' + url);
        success();
    };
    dom.addEventListener("canplaythrough", success, false);
    dom.addEventListener("error", failure, false);
    if(__audioSupport.USE_LOADER_EVENT)
        dom.addEventListener(__audioSupport.USE_LOADER_EVENT, success, false);
}

function loadWebAudio (url, typeList, audio, cb) {
    if (!context) return;

    var request = Pipeline.getXMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    // Our asynchronous callback
    request.onload = function () {
        context["decodeAudioData"](request.response, function(buffer){
            //success
            audio.setBuffer(buffer);
            cb(null, url);
        }, function(){
            //error
            cb('decode error - ' + url, url);
        });
    };

    request.onerror = function(){
        cb('request error - ' + url, url);
    };

    request.send();
}

function downloadAudio (item, callback) {
    if (formatSupport.length === 0) {
        return callback( new Error('Audio Downloader: audio not supported on this browser!') );
    }

    var url = item.url,
        extname = Path.extname(url),
        typeList = [extname],
        i, audio;

    // Generate all types
    for (i = 0; i < formatSupport.length; i++) {
        if (extname !== formatSupport[i]) {
            typeList.push(formatSupport[i]);
        }
    }

    audio = new cc.Audio(url);

    // hack for audio to be found before loaded
    item.content = url;
    item.audio = audio;
    loadAudioFromExtList(url, typeList, audio, callback);
}


module.exports = downloadAudio;