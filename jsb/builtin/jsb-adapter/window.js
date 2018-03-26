
function inject () {
    window.top = window.parent = window

    window.document = require('./document');
    window.HTMLElement = require('./HTMLElement');
    window.HTMLCanvasElement = require('./HTMLCanvasElement');
    window.HTMLImageElement = require('./HTMLImageElement');
    window.HTMLMediaElement = require('./HTMLMediaElement');
    window.HTMLAudioElement = require('./HTMLAudioElement');
    window.canvas = new HTMLCanvasElement();
    window.gl.canvas = window.canvas;
    window.WebGLRenderingContext = window.gl;
    window.navigator = require('./navigator');
    window.Image = require('./Image');
    window.Audio = require('./Audio');
    window.FileReader = require('./FileReader');
    window.location = require('./location');
    window.FontFace = require('./FontFace');
    window.FontFaceSet = require('./FontFaceSet');
    window.EventTarget = require('./EventTarget');
    window.Event = require('./Event');
    window.TouchEvent = require('./TouchEvent');

    window.ontouchstart = null;
    window.ontouchmove = null;
    window.ontouchend = null;
    window.ontouchcancel = null;

    window.addEventListener = function(eventName, listener, options) {
        window.canvas.addEventListener(eventName, listener, options);
    }

    window.removeEventListener = function(eventName, listener, options) {
        window.canvas.removeEventListener(eventName, listener, options);
    }

    window.dispatchEvent = function(event) {
        window.canvas.dispatchEvent(event);
    }

    window._isInjected = true;
}

if (!window._isInjected) {
    inject();
}

window.canvas.getContext = function(name) {
    if (name === 'webgl' || name === 'experimental-webgl') {
        return window.gl;
    }
    return null;
};

window.localStorage = sys.localStorage;
