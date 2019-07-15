/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * The fullscreen API provides an easy way for web content to be presented using the user's entire screen.
 * It's invalid on safari, QQbrowser and android browser
 * @class screen
 */
cc.screen = /** @lends cc.screen# */{
    _supportsFullScreen: false,
    _onfullscreenchange: null,
    _onfullscreenerror: null,
    // the pre fullscreenchange function
    _preOnFullScreenChange: null,
    _preOnFullScreenError: null,
    _preOnTouch: null,
    _touchEvent: "",
    _fn: null,
    // Function mapping for cross browser support
    _fnMap: [
        [
            'requestFullscreen',
            'exitFullscreen',
            'fullscreenchange',
            'fullscreenEnabled',
            'fullscreenElement',
            'fullscreenerror',
        ],
        [
            'requestFullScreen',
            'exitFullScreen',
            'fullScreenchange',
            'fullScreenEnabled',
            'fullScreenElement',
            'fullscreenerror',
        ],
        [
            'webkitRequestFullScreen',
            'webkitCancelFullScreen',
            'webkitfullscreenchange',
            'webkitIsFullScreen',
            'webkitCurrentFullScreenElement',
            'webkitfullscreenerror',
        ],
        [
            'mozRequestFullScreen',
            'mozCancelFullScreen',
            'mozfullscreenchange',
            'mozFullScreen',
            'mozFullScreenElement',
            'mozfullscreenerror',
        ],
        [
            'msRequestFullscreen',
            'msExitFullscreen',
            'MSFullscreenChange',
            'msFullscreenEnabled',
            'msFullscreenElement',
            'msfullscreenerror',
        ]
    ],
    
    /**
     * initialize
     * @method init
     */
    init: function () {
        this._fn = {};
        var i, l, val, map = this._fnMap, valL;
        for (i = 0, l = map.length; i < l; i++) {
            val = map[i];
            if (val && (typeof document[val[1]] !== 'undefined')) {
                for (i = 0, valL = val.length; i < valL; i++) {
                    this._fn[map[0][i]] = val[i];
                }
                break;
            }
        }

        this._supportsFullScreen = (this._fn.requestFullscreen !== undefined);

        // Bug fix only for v2.1, don't merge into v2.0
        // In v2.0, screen touchend events conflict with editBox touchend events if it's not stayOnTop.
        // While in v2.1, editBox always keep stayOnTop and it doesn't support touchend events.
        this._touchEvent = ('ontouchend' in window) ? 'touchend' : 'mousedown';
    },
    
    /**
     * return true if it's full now.
     * @method fullScreen
     * @returns {Boolean}
     */
    fullScreen: function () {
        if (!this._supportsFullScreen) return false;
        else if (!document[this._fn.fullscreenElement] && !document[this._fn.webkitFullscreenElement] && !document[this._fn.mozFullScreenElement]) {
            return false;
        }
        else {
            return true;
        }
    },
    
    /**
     * change the screen to full mode.
     * @method requestFullScreen
     * @param {Element} element
     * @param {Function} onFullScreenChange
     * @param {Function} onFullScreenError
     */
    requestFullScreen: function (element, onFullScreenChange, onFullScreenError) {
        if (element && element.tagName.toLowerCase() === "video") {
            if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isBrowser && element.readyState > 0) {
                element.webkitEnterFullscreen && element.webkitEnterFullscreen();
                return;
            }
            else {
                element.setAttribute("x5-video-player-fullscreen", "true");
            }
        }

        if (!this._supportsFullScreen) {
            return;
        }

        element = element || document.documentElement;

        if (onFullScreenChange) {
            let eventName = this._fn.fullscreenchange;
            if (this._onfullscreenchange) {
                document.removeEventListener(eventName, this._onfullscreenchange);
            }
            this._onfullscreenchange = onFullScreenChange;
            document.addEventListener(eventName, onFullScreenChange, false);
        }
        if (onFullScreenError) {
            let eventName = this._fn.fullscreenerror;
            if (this._onfullscreenerror) {
                document.removeEventListener(eventName, this._onfullscreenerror);
            }
            this._onfullscreenerror = onFullScreenError;
            document.addEventListener(eventName, onFullScreenError, { once: true });
        }

        element[this._fn.requestFullscreen]();
    },
    
    /**
     * exit the full mode.
     * @method exitFullScreen
     * @return {Boolean}
     */
    exitFullScreen: function (element) {
        if (element && element.tagName.toLowerCase() === "video") {
            if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isBrowser) {
                element.webkitExitFullscreen && element.webkitExitFullscreen();
                return;
            }
            else {
                element.setAttribute("x5-video-player-fullscreen", "false");
            }
        }
        return this._supportsFullScreen ? document[this._fn.exitFullscreen]() : true;
    },
    
    /**
     * Automatically request full screen with a touch/click event
     * @method autoFullScreen
     * @param {Element} element
     * @param {Function} onFullScreenChange
     */
    autoFullScreen: function (element, onFullScreenChange) {
        element = element || document.body;

        this._ensureFullScreen(element, onFullScreenChange);
        this.requestFullScreen(element, onFullScreenChange);
    },

    disableAutoFullScreen (element) {
        let touchTarget = cc.game.canvas || element;
        let touchEventName = this._touchEvent;
        if (this._preOnTouch) {
            touchTarget.removeEventListener(touchEventName, this._preOnTouch);
            this._preOnTouch = null;
        }
    },

    // Register touch event if request full screen failed
    _ensureFullScreen (element, onFullScreenChange) {
        let self = this;
        let touchTarget = cc.game.canvas || element;
        let fullScreenErrorEventName = this._fn.fullscreenerror;
        let touchEventName = this._touchEvent;
        
        function onFullScreenError () {
            self._preOnFullScreenError = null;

            // handle touch event listener
            function onTouch() {
                self._preOnTouch = null;
                self.requestFullScreen(element, onFullScreenChange);
            }
            if (self._preOnTouch) {
                touchTarget.removeEventListener(touchEventName, self._preOnTouch);
            }
            self._preOnTouch = onTouch;
            touchTarget.addEventListener(touchEventName, self._preOnTouch, { once: true });
        }

        // handle full screen error
        if (this._preOnFullScreenError) {
            element.removeEventListener(fullScreenErrorEventName, this._preOnFullScreenError);
        }
        this._preOnFullScreenError = onFullScreenError;
        element.addEventListener(fullScreenErrorEventName, onFullScreenError, { once: true });
    },
};
cc.screen.init();
