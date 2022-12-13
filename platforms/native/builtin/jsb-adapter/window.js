function inject () {
    window.__engineGlobal__.ontouchstart = null;
    window.__engineGlobal__.ontouchmove = null;
    window.__engineGlobal__.ontouchend = null;
    window.__engineGlobal__.ontouchcancel = null;

    window.__engineGlobal__.pageXOffset = window.__engineGlobal__.pageYOffset = window.__engineGlobal__.clientTop = window.__engineGlobal__.clientLeft = 0;
    window.__engineGlobal__.outerWidth = window.__engineGlobal__.innerWidth;
    window.__engineGlobal__.outerHeight = window.__engineGlobal__.innerHeight;
    window.__engineGlobal__.clientWidth = window.__engineGlobal__.innerWidth;
    window.__engineGlobal__.clientHeight = window.__engineGlobal__.innerHeight;
    if (!__EDITOR__) {
        window.__engineGlobal__.top = window.__engineGlobal__.parent = window;
        window.__engineGlobal__.location = require('./location');
        window.__engineGlobal__.document = require('./document');
        window.__engineGlobal__.navigator = require('./navigator');
    }

    window.__engineGlobal__.CanvasRenderingContext2D = require('./CanvasRenderingContext2D');
    window.__engineGlobal__.Element = require('./Element');
    window.__engineGlobal__.HTMLElement = require('./HTMLElement');
    window.__engineGlobal__.HTMLCanvasElement = require('./HTMLCanvasElement');
    window.__engineGlobal__.HTMLImageElement = require('./HTMLImageElement');
    window.__engineGlobal__.HTMLMediaElement = require('./HTMLMediaElement');
    window.__engineGlobal__.HTMLVideoElement = require('./HTMLVideoElement');
    window.__engineGlobal__.HTMLScriptElement = require('./HTMLScriptElement');
    window.__engineGlobal__.__canvas = new HTMLCanvasElement();
    window.__engineGlobal__.__canvas._width = window.__engineGlobal__.innerWidth;
    window.__engineGlobal__.__canvas._height = window.__engineGlobal__.innerHeight;

    window.__engineGlobal__.Image = require('./Image');
    window.__engineGlobal__.FileReader = require('./FileReader');
    window.__engineGlobal__.FontFace = require('./FontFace');
    window.__engineGlobal__.FontFaceSet = require('./FontFaceSet');
    window.EventTarget = window.__engineGlobal__.EventTarget = require('./EventTarget');
    window.Event = window.__engineGlobal__.Event = window.Event || require('./Event');
    window.TouchEvent = window.__engineGlobal__.TouchEvent = require('./TouchEvent');
    window.MouseEvent = window.__engineGlobal__.MouseEvent = require('./MouseEvent');
    window.KeyboardEvent = window.__engineGlobal__.KeyboardEvent = require('./KeyboardEvent');
    window.DeviceMotionEvent = window.__engineGlobal__.DeviceMotionEvent = require('./DeviceMotionEvent');

    // ES6
    const m_fetch = require('./fetch');
    window.__engineGlobal__.fetch = m_fetch.fetch;
    window.__engineGlobal__.Headers = m_fetch.Headers;
    window.__engineGlobal__.Request = m_fetch.Request;
    window.__engineGlobal__.Response = m_fetch.Response;

    // const PORTRAIT = 0;
    // const LANDSCAPE_LEFT = -90;
    // const PORTRAIT_UPSIDE_DOWN = 180;
    // const LANDSCAPE_RIGHT = 90;
    window.__engineGlobal__.orientation = jsb.device.getDeviceOrientation();

    // window.devicePixelRatio is readonly
    if (!__EDITOR__) {
        Object.defineProperty(window, 'devicePixelRatio', {
            get () {
                return jsb.device.getDevicePixelRatio ? jsb.device.getDevicePixelRatio() : 1;
            },
            set (_dpr) { /* ignore */ },
            enumerable: true,
            configurable: true,
        });
    }

    window.__engineGlobal__.screen = {
        availTop: 0,
        availLeft: 0,
        availHeight: window.__engineGlobal__.innerWidth,
        availWidth: window.__engineGlobal__.innerHeight,
        colorDepth: 8,
        pixelDepth: 8,
        left: 0,
        top: 0,
        width: window.__engineGlobal__.innerWidth,
        height: window.__engineGlobal__.innerHeight,
        orientation: { //FIXME:cjh
            type: 'portrait-primary', // portrait-primary, portrait-secondary, landscape-primary, landscape-secondary
        },
        onorientationchange (event) {},
    };

    window.__engineGlobal__.addEventListener = function (eventName, listener, options) {
        window.__engineGlobal__.__canvas.addEventListener(eventName, listener, options);
    };

    window.__engineGlobal__.removeEventListener = function (eventName, listener, options) {
        window.__engineGlobal__.__canvas.removeEventListener(eventName, listener, options);
    };

    window.__engineGlobal__.dispatchEvent = function (event) {
        window.__engineGlobal__.__canvas.dispatchEvent(event);
    };

    window.__engineGlobal__.getComputedStyle = function (element) {
        return {
           position: 'absolute',
           left: '0px',
           top: '0px',
           height: '0px',
        };
    };

    window.__engineGlobal__.resize = function (width, height) {
        window.__engineGlobal__.innerWidth = width;
        window.__engineGlobal__.innerHeight = height;
        window.__engineGlobal__.outerWidth = window.__engineGlobal__.innerWidth;
        window.__engineGlobal__.outerHeight = window.__engineGlobal__.innerHeight;
        window.__engineGlobal__.__canvas._width = window.__engineGlobal__.innerWidth;
        window.__engineGlobal__.__canvas._height = window.innerHeight;
        window.__engineGlobal__.screen.availWidth = window.__engineGlobal__.innerWidth;
        window.__engineGlobal__.screen.availHeight = window.__engineGlobal__.innerHeight;
        window.__engineGlobal__.screen.width = window.__engineGlobal__.innerWidth;
        window.__engineGlobal__.screen.height = window.__engineGlobal__.innerHeight;
        window.__engineGlobal__.clientWidth = window.__engineGlobal__.innerWidth;
        window.__engineGlobal__.clientHeight = window.__engineGlobal__.innerHeight;
        // emit resize consistent with web behavior
        const resizeEvent = new Event('resize');
        resizeEvent._target = window;
        window.__engineGlobal__.dispatchEvent(resizeEvent);
    };

    window.__engineGlobal__.focus = function () {};
    window.__engineGlobal__.scroll = function () {};

    window.__engineGlobal__._isInjected = true;
}

if (!window.__engineGlobal__._isInjected) {
    inject();
}
if (!__EDITOR__) {
    window.__engineGlobal__.localStorage = sys.localStorage;
}
