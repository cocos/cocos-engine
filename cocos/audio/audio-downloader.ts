/*
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
 */
/**
 * @category loader
 */

import sys from '../core/platform/CCSys';
import { log, getError } from '../core/platform/CCDebug';
import { AudioClip, AudioType } from './assets/clip';
import { loader } from '../core/load-pipeline';

const __audioSupport = sys.__audioSupport;
const formatSupport = __audioSupport.format;

function loadWXAudio (item, callback) {
    var clip = wx.createInnerAudioContext();
    clip.src = item.url;
    clip.onCanplay(() => callback(null, clip));
}

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
        callback(null, dom);
    };
    var failure = function () {
        clearEvent();
        var message = 'load audio failure - ' + item.url;
        log(message);
        callback(message);
    };
    dom.addEventListener("canplaythrough", success, false);
    dom.addEventListener("error", failure, false);
    if(__audioSupport.USE_LOADER_EVENT)
        dom.addEventListener(__audioSupport.USE_LOADER_EVENT, success, false);
}

function loadWebAudio (item, callback) {
    const context = __audioSupport.context;
    if (!context)
        callback(new Error(getError(4926)));

    var request = loader.getXMLHttpRequest();
    request.open("GET", item.url, true);
    request.responseType = "arraybuffer";

    // Our asynchronous callback
    request.onload = function () {
        context["decodeAudioData"](request.response, function(buffer){
            //success
            callback(null, buffer);
        }, function(){
            //error
            callback('decode error - ' + item.id, null);
        });
    };

    request.onerror = function(){
        callback('request error - ' + item.id, null);
    };

    request.send();
}

function downloadAudio (item, callback) {
    if (formatSupport.length === 0) {
        return new Error(getError(4927));
    }

    let audioLoader;
    if (CC_WECHATGAME) {
        audioLoader = loadWXAudio;
    } else if (!__audioSupport.WEB_AUDIO) {
        audioLoader = loadDomAudio; // If WebAudio is not supported, load using DOM mode
    } else {
        let loadByDeserializedAudio = item._owner instanceof AudioClip;
        if (loadByDeserializedAudio) {
            audioLoader = (item._owner.loadMode === AudioType.WEB_AUDIO) ? loadWebAudio : loadDomAudio;
        } else {
            audioLoader = (item.urlParam && item.urlParam['useDom']) ? loadDomAudio : loadWebAudio;
        }
    }
    audioLoader(item, callback);
}

loader.downloader.addHandlers({
    // Audio
    'mp3' : downloadAudio,
    'ogg' : downloadAudio,
    'wav' : downloadAudio,
    'm4a' : downloadAudio,
});