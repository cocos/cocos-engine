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
var audioEngine = require('../../audio/CCAudioEngine');

var __audioSupport = Sys.__audioSupport;
var formatSupport = __audioSupport.format;
var context = __audioSupport.context;

function loadDomAudio (item, callback) {
    var dom = document.createElement('audio');
    dom.src = item.url;
    var clearEvent = function () {
        clearTimeout(timer);
        dom.removeEventListener("canplaythrough", success, false);
        dom.removeEventListener("error", failure, false);
        if(__audioSupport.USE_LOADER_EVENT)
            dom.removeEventListener(__audioSupport.USE_LOADER_EVENT, success, false);
    };
    var timer = setTimeout(function () {
        if (dom.readyState === 0)
            failure();
        else
            success();
    }, 8000);
    var success = function () {
        clearEvent();
        item.element = dom;
        callback(null, item.url);
    };
    var failure = function () {
        clearEvent();
        var message = 'load audio failure - ' + item.url;
        cc.log(message);
        callback(message, item.url);
    };
    dom.addEventListener("canplaythrough", success, false);
    dom.addEventListener("error", failure, false);
    if(__audioSupport.USE_LOADER_EVENT)
        dom.addEventListener(__audioSupport.USE_LOADER_EVENT, success, false);
}

function loadWebAudio (item, callback) {
    if (!context) callback(new Error('Audio Downloader: no web audio context.'));

    var request = cc.loader.getXMLHttpRequest();
    request.open("GET", item.url, true);
    request.responseType = "arraybuffer";

    // Our asynchronous callback
    request.onload = function () {
        context["decodeAudioData"](request.response, function(buffer){
            //success
            item.buffer = buffer;
            callback(null, item.url);
        }, function(){
            //error
            callback('decode error - ' + item.url, null);
        });
    };

    request.onerror = function(){
        callback('request error - ' + item.url, null);
    };

    request.send();
}

function downloadAudio (item, callback) {
    if (formatSupport.length === 0) {
        return new Error('Audio Downloader: audio not supported on this browser!');
    }

    item.content = item.url;

    // If WebAudio is not supported, load using DOM mode
    if (!__audioSupport.WEB_AUDIO || (item.urlParam && item.urlParam['useDom'])) {
        loadDomAudio(item, callback);
    }
    else {
        loadWebAudio(item, callback);
    }
}

module.exports = downloadAudio;
