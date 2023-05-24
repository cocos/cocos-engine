const jsbWindow = require('../../jsbWindow');

function inject () {
    jsbWindow.ontouchstart = null;
    jsbWindow.ontouchmove = null;
    jsbWindow.ontouchend = null;
    jsbWindow.ontouchcancel = null;

    jsbWindow.pageXOffset = jsbWindow.pageYOffset = jsbWindow.clientTop = jsbWindow.clientLeft = 0;
    jsbWindow.outerWidth = jsbWindow.innerWidth;
    jsbWindow.outerHeight = jsbWindow.innerHeight;
    jsbWindow.clientWidth = jsbWindow.innerWidth;
    jsbWindow.clientHeight = jsbWindow.innerHeight;
    // if (!__EDITOR__) {
        jsbWindow.top = jsbWindow.parent = jsbWindow;
        jsbWindow.location = require('./location');
        jsbWindow.document = require('./document');
        jsbWindow.navigator = require('./navigator');
    // }

    jsbWindow.CanvasRenderingContext2D = require('./CanvasRenderingContext2D');
    jsbWindow.Element = require('./Element');
    jsbWindow.HTMLElement = require('./HTMLElement');
    jsbWindow.HTMLCanvasElement = require('./HTMLCanvasElement');
    jsbWindow.HTMLImageElement = require('./HTMLImageElement');
    jsbWindow.HTMLMediaElement = require('./HTMLMediaElement');
    jsbWindow.HTMLVideoElement = require('./HTMLVideoElement');
    jsbWindow.HTMLScriptElement = require('./HTMLScriptElement');
    jsbWindow.__canvas = new jsbWindow.HTMLCanvasElement();
    jsbWindow.__canvas._width = jsbWindow.innerWidth;
    jsbWindow.__canvas._height = jsbWindow.innerHeight;

    jsbWindow.Image = require('./Image');
    jsbWindow.FileReader = require('./FileReader');
    jsbWindow.FontFace = require('./FontFace');
    jsbWindow.FontFaceSet = require('./FontFaceSet');
    jsbWindow.EventTarget = require('./EventTarget');
    jsbWindow.Event = jsbWindow.Event || require('./Event');
    jsbWindow.TouchEvent = require('./TouchEvent');
    jsbWindow.MouseEvent = require('./MouseEvent');
    jsbWindow.KeyboardEvent = require('./KeyboardEvent');
    jsbWindow.DeviceMotionEvent = require('./DeviceMotionEvent');

    // ES6
    const m_fetch = require('./fetch');
    jsbWindow.fetch = m_fetch.fetch;
    jsbWindow.Headers = m_fetch.Headers;
    jsbWindow.Request = m_fetch.Request;
    jsbWindow.Response = m_fetch.Response;

    // const PORTRAIT = 0;
    // const LANDSCAPE_LEFT = -90;
    // const PORTRAIT_UPSIDE_DOWN = 180;
    // const LANDSCAPE_RIGHT = 90;
    jsbWindow.orientation = jsb.device.getDeviceOrientation();

    // jsb.window.devicePixelRatio is readonly
    if (!__EDITOR__) {
        Object.defineProperty(jsbWindow, 'devicePixelRatio', {
            get () {
                return jsb.device.getDevicePixelRatio ? jsb.device.getDevicePixelRatio() : 1;
            },
            set (_dpr) { /* ignore */ },
            enumerable: true,
            configurable: true,
        });
    }

    jsbWindow.screen = {
        availTop: 0,
        availLeft: 0,
        availHeight: jsbWindow.innerWidth,
        availWidth: jsbWindow.innerHeight,
        colorDepth: 8,
        pixelDepth: 8,
        left: 0,
        top: 0,
        width: jsbWindow.innerWidth,
        height: jsbWindow.innerHeight,
        orientation: { //FIXME:cjh
            type: 'portrait-primary', // portrait-primary, portrait-secondary, landscape-primary, landscape-secondary
        },
        onorientationchange (event) {},
    };

    jsbWindow.addEventListener = function (eventName, listener, options) {
        jsbWindow.__canvas.addEventListener(eventName, listener, options);
    };

    jsbWindow.removeEventListener = function (eventName, listener, options) {
        jsbWindow.__canvas.removeEventListener(eventName, listener, options);
    };

    jsbWindow.dispatchEvent = function (event) {
        jsbWindow.__canvas.dispatchEvent(event);
    };

    jsbWindow.getComputedStyle = function (element) {
        return {
           position: 'absolute',
           left: '0px',
           top: '0px',
           height: '0px',
        };
    };

    jsbWindow.resize = function (width, height) {
        jsbWindow.innerWidth = width;
        jsbWindow.innerHeight = height;
        jsbWindow.outerWidth = jsbWindow.innerWidth;
        jsbWindow.outerHeight = jsbWindow.innerHeight;
        jsbWindow.__canvas._width = jsbWindow.innerWidth;
        jsbWindow.__canvas._height = jsbWindow.innerHeight;
        jsbWindow.screen.availWidth = jsbWindow.innerWidth;
        jsbWindow.screen.availHeight = jsbWindow.innerHeight;
        jsbWindow.screen.width = jsbWindow.innerWidth;
        jsbWindow.screen.height = jsbWindow.innerHeight;
        jsbWindow.clientWidth = jsbWindow.innerWidth;
        jsbWindow.clientHeight = jsbWindow.innerHeight;
        // emit resize consistent with web behavior
        const resizeEvent = new jsbWindow.Event('resize');
        resizeEvent._target = jsbWindow;
        jsbWindow.dispatchEvent(resizeEvent);
    };

    jsbWindow.focus = function () {};
    jsbWindow.scroll = function () {};

    jsbWindow._isInjected = true;
}

if (!jsbWindow._isInjected) {
    inject();
}
if (!__EDITOR__) {
    jsbWindow.localStorage = sys.localStorage;
}
