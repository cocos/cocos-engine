const { glob } = require('fs');

const nodeWindow = globalThis.window;

function inject () {
    nodeWindow.ontouchstart = null;
    nodeWindow.ontouchmove = null;
    nodeWindow.ontouchend = null;
    nodeWindow.ontouchcancel = null;

    nodeWindow.pageXOffset = nodeWindow.pageYOffset = nodeWindow.clientTop = nodeWindow.clientLeft = 0;
    nodeWindow.outerWidth = nodeWindow.innerWidth;
    nodeWindow.outerHeight = nodeWindow.innerHeight;
    nodeWindow.clientWidth = nodeWindow.innerWidth;
    nodeWindow.clientHeight = nodeWindow.innerHeight;
    // if (!__EDITOR__) {
        nodeWindow.top = nodeWindow.parent = nodeWindow;
        nodeWindow.location = require('./location');
        nodeWindow.document = require('./document');
    // }

    nodeWindow.CanvasRenderingContext2D = require('./CanvasRenderingContext2D');
    nodeWindow.Element = require('./Element');
    nodeWindow.HTMLElement = require('./HTMLElement');
    nodeWindow.HTMLCanvasElement = require('./HTMLCanvasElement');
    nodeWindow.HTMLImageElement = require('./HTMLImageElement');
    nodeWindow.HTMLMediaElement = require('./HTMLMediaElement');
    nodeWindow.HTMLVideoElement = require('./HTMLVideoElement');
    nodeWindow.HTMLScriptElement = require('./HTMLScriptElement');
    nodeWindow.__canvas = new nodeWindow.HTMLCanvasElement();
    nodeWindow.__canvas._width = nodeWindow.innerWidth;
    nodeWindow.__canvas._height = nodeWindow.innerHeight;

    nodeWindow.Image = require('./Image');
    nodeWindow.FileReader = require('./FileReader');
    nodeWindow.FontFace = require('./FontFace');
    nodeWindow.FontFaceSet = require('./FontFaceSet');
    nodeWindow.EventTarget = require('./EventTarget');
    nodeWindow.Event = nodeWindow.Event || require('./Event');
    nodeWindow.TouchEvent = require('./TouchEvent');
    nodeWindow.MouseEvent = require('./MouseEvent');
    nodeWindow.KeyboardEvent = require('./KeyboardEvent');
    nodeWindow.DeviceMotionEvent = require('./DeviceMotionEvent');

    nodeWindow.fetch = globalThis.nodeEnv.fetch;
    nodeWindow.Headers = globalThis.nodeEnv.Headers;
    nodeWindow.Request = globalThis.nodeEnv.Request;
    nodeWindow.Response = globalThis.nodeEnv.Response;

    // const PORTRAIT = 0;
    // const LANDSCAPE_LEFT = -90;
    // const PORTRAIT_UPSIDE_DOWN = 180;
    // const LANDSCAPE_RIGHT = 90;
    nodeWindow.orientation = 0;
    Object.defineProperty(nodeWindow, 'devicePixelRatio', {
        get () {
            return  1;
        },
        set (_dpr) { /* ignore */ },
        enumerable: true,
        configurable: true,
    });

    nodeWindow.screen = {
        availTop: 0,
        availLeft: 0,
        availHeight: nodeWindow.innerWidth,
        availWidth: nodeWindow.innerHeight,
        colorDepth: 8,
        pixelDepth: 8,
        left: 0,
        top: 0,
        width: nodeWindow.innerWidth,
        height: nodeWindow.innerHeight,
        orientation: { //FIXME:cjh
            type: 'portrait-primary', // portrait-primary, portrait-secondary, landscape-primary, landscape-secondary
        },
        onorientationchange (event) {},
    };

    nodeWindow.addEventListener = function (eventName, listener, options) {
        nodeWindow.__canvas.addEventListener(eventName, listener, options);
    };

    nodeWindow.removeEventListener = function (eventName, listener, options) {
        nodeWindow.__canvas.removeEventListener(eventName, listener, options);
    };

    nodeWindow.dispatchEvent = function (event) {
        nodeWindow.__canvas.dispatchEvent(event);
    };

    nodeWindow.getComputedStyle = function (element) {
        return {
           position: 'absolute',
           left: '0px',
           top: '0px',
           height: '0px',
        };
    };

    nodeWindow.resize = function (width, height) {
        nodeWindow.innerWidth = width;
        nodeWindow.innerHeight = height;
        nodeWindow.outerWidth = nodeWindow.innerWidth;
        nodeWindow.outerHeight = nodeWindow.innerHeight;
        nodeWindow.__canvas._width = nodeWindow.innerWidth;
        nodeWindow.__canvas._height = nodeWindow.innerHeight;
        nodeWindow.screen.availWidth = nodeWindow.innerWidth;
        nodeWindow.screen.availHeight = nodeWindow.innerHeight;
        nodeWindow.screen.width = nodeWindow.innerWidth;
        nodeWindow.screen.height = nodeWindow.innerHeight;
        nodeWindow.clientWidth = nodeWindow.innerWidth;
        nodeWindow.clientHeight = nodeWindow.innerHeight;
        // emit resize consistent with web behavior
        const resizeEvent = new nodeWindow.Event('resize');
        resizeEvent._target = nodeWindow;
        nodeWindow.dispatchEvent(resizeEvent);
    };

    nodeWindow.focus = function () {};
    nodeWindow.scroll = function () {};

    nodeWindow._isInjected = true;
}

if (!nodeWindow._isInjected) {
    inject();
}

nodeWindow.localStorage = globalThis.nodeEnv.localStorage;
