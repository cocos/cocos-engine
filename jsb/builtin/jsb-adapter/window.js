/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/
 
function inject () {
    window.top = window.parent = window

    window.ontouchstart = null;
    window.ontouchmove = null;
    window.ontouchend = null;
    window.ontouchcancel = null;

    window.pageXOffset = window.pageYOffset = window.clientTop = window.clientLeft = 0;
    window.outerWidth = window.innerWidth;
    window.outerHeight = window.innerHeight;

    window.location = require('./location');
    window.document = require('./document');
    window.Element = require('./Element');
    window.HTMLElement = require('./HTMLElement');
    window.HTMLCanvasElement = require('./HTMLCanvasElement');
    window.HTMLImageElement = require('./HTMLImageElement');
    window.HTMLMediaElement = require('./HTMLMediaElement');
    window.HTMLAudioElement = require('./HTMLAudioElement');
    window.HTMLVideoElement = require('./HTMLVideoElement');
    window.__cccanvas = new HTMLCanvasElement();
    window.__ccgl.canvas = window.__cccanvas;
    window.navigator = require('./navigator');
    window.Image = require('./Image');
    window.Audio = require('./Audio');
    window.FileReader = require('./FileReader');
    window.FontFace = require('./FontFace');
    window.FontFaceSet = require('./FontFaceSet');
    window.EventTarget = require('./EventTarget');
    window.Event = require('./Event');
    window.TouchEvent = require('./TouchEvent');

    window.devicePixelRatio = 1.0;
    window.screen = {
        availTop: 0,
        availLeft: 0,
        availHeight: window.innerWidth,
        availWidth: window.innerHeight,
        colorDepth: 8,
        pixelDepth: 8,
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        orientation: { //FIXME:cjh
            type: 'portrait-primary' // portrait-primary, portrait-secondary, landscape-primary, landscape-secondary
        }, 
        onorientationchange: function(event) {}
    };

    window.addEventListener = function(eventName, listener, options) {
        window.__cccanvas.addEventListener(eventName, listener, options);
    };

    window.removeEventListener = function(eventName, listener, options) {
        window.__cccanvas.removeEventListener(eventName, listener, options);
    };

    window.dispatchEvent = function(event) {
        window.__cccanvas.dispatchEvent(event);
    };

    window.getComputedStyle = function(element) {
        return {
           position: 'absolute',
           left:     '0px',
           top:      '0px',
           height:   '0px'
        };
    };

    window.focus = function() {};

    window._isInjected = true;
}

if (!window._isInjected) {
    inject();
}


window.localStorage = sys.localStorage;
