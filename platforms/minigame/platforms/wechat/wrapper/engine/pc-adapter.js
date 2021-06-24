const env = wx.getSystemInfoSync();
const inputMgr = cc.internal.inputManager;
const eventMgr = cc.eventManager;
const EventKeyboard = cc.Event.EventKeyboard;
const EventMouse = cc.Event.EventMouse;

// map from CCMacro
const key2keyCode = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    control: 17,
    alt: 18,
    pause: 19,
    capslock: 20,
    escape: 27,
    ' ': 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    arrowleft: 37,
    arrowup: 38,
    arrowright: 39,
    arrowdown: 40,
    insert: 45,
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,
    '*': 106,
    '+': 107,
    '-': 109,
    '/': 111,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    numlock: 144,
    scrolllock: 145,
    ';': 186,
    '=': 187,
    ',': 188,
    '.': 190,
    '`': 192,
    '[': 219,
    '\\': 220,
    ']': 221,
    '\'': 222,
};

const code2KeyCode = {
    Delete: 46,
    Digit0: 48,
    Digit1: 49,
    Digit2: 50,
    Digit3: 51,
    Digit4: 52,
    Digit5: 53,
    Digit6: 54,
    Digit7: 55,
    Digit8: 56,
    Digit9: 57,
    Numpad0: 96,
    Numpad1: 97,
    Numpad2: 98,
    Numpad3: 99,
    Numpad4: 100,
    Numpad5: 101,
    Numpad6: 102,
    Numpad7: 103,
    Numpad8: 104,
    Numpad9: 105,
    NumpadDecimal: 110,
};

function getKeyCode (res) {
    let key = res.key.toLowerCase(), code = res.code;
    // distinguish different numLock states
    if (/^\d$/.test(key) || key === 'delete') {
        return code2KeyCode[code];
    }
    return key2keyCode[key] || 0;
}

function adaptKeyboadEvent () {
    wx.onKeyDown(res => eventMgr.dispatchEvent(new EventKeyboard(getKeyCode(res), true)));
    wx.onKeyUp(res => eventMgr.dispatchEvent(new EventKeyboard(getKeyCode(res), false)));
}

function adaptMouseEvent () {
    let canvasRect = {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
    };
    function registerMouseEvent (funcName, engineEventType, handler) {
        wx[funcName](res => {
            let mouseEvent = inputMgr.getMouseEvent(res, canvasRect, engineEventType);
            mouseEvent.setButton(res.button || 0);
            handler(res, mouseEvent);
            eventMgr.dispatchEvent(mouseEvent);
        });
    }
    registerMouseEvent('onMouseDown', EventMouse.DOWN, function (res, mouseEvent) {
        inputMgr._mousePressed = true;
        inputMgr.handleTouchesBegin([inputMgr.getTouchByXY(mouseEvent, res.x, res.y, canvasRect)]);
    });
    registerMouseEvent('onMouseUp', EventMouse.UP, function (res, mouseEvent) {
        inputMgr._mousePressed = false;
        inputMgr.handleTouchesEnd([inputMgr.getTouchByXY(mouseEvent, res.x, res.y, canvasRect)]);
    });
    registerMouseEvent('onMouseMove', EventMouse.MOVE, function (res, mouseEvent) {
        inputMgr.handleTouchesMove([inputMgr.getTouchByXY(mouseEvent, res.x, res.y, canvasRect)]);
        if (!inputMgr._mousePressed) {
            mouseEvent.setButton(null);
        }
    });
    registerMouseEvent('onWheel', EventMouse.SCROLL, function (res, mouseEvent) {
        mouseEvent.setScrollData(0, -res.deltaY);
    });
}


function versionCompare (versionA, versionB) {
    const versionRegExp = /\d+\.\d+\.\d+/;
    if (!(versionRegExp.test(versionA) && versionRegExp.test(versionB))) {
        console.warn('wrong format of version when compare version');
        return 0;
    }
    const versionNumbersA = versionA.split('.').map((num) => Number.parseInt(num));
    const versionNumbersB = versionB.split('.').map((num) => Number.parseInt(num));
    for (let i = 0; i < 3; ++i) {
        const numberA = versionNumbersA[i];
        const numberB = versionNumbersB[i];
        if (numberA !== numberB) {
            return numberA - numberB;
        }
    }
    return 0;
}

function adaptGL () {
    if (canvas) {
        let webglRC = canvas.getContext('webgl');
        let originalUseProgram = webglRC.useProgram.bind(webglRC);
        webglRC.useProgram = function (program) {
            if (program) {
                originalUseProgram(program);
            }
        }
    }
}

(function () {
    // TODO: add mac
    if (env.platform !== 'windows') {
        return;
    }

    if (versionCompare(env.SDKVersion, '2.16.0') < 0) {
        // use program not supported to unbind program on pc end
        adaptGL();
    }

    inputMgr.registerSystemEvent = function () {
        if (this._isRegisterEvent) {
            return;
        }
        this._glView = cc.view;
        adaptKeyboadEvent();
        adaptMouseEvent();
        this._isRegisterEvent = true;
    };
})();