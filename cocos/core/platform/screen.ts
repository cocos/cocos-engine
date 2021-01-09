/*
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
*/
/**
 * @packageDocumentation
 * @module core
 */

import { legacyCC } from '../global-exports';

/**
 * @en The screen API provides an easy way for web content to be presented using the user's entire screen.
 * It's designed for web platforms and some mobile browsers don't provide such behavior, e.g. Safari
 * @zh screen 单例对象提供简单的方法来尝试让 Web 内容进入全屏模式。这是 Web 平台特有的行为，在部分浏览器上并不支持这样的功能。
 */
const screen = {
    _supportsFullScreen: false,
    _onfullscreenchange: null as any,
    _onfullscreenerror: null as any,
    // the pre fullscreenchange function
    _preOnFullScreenError: null as any,
    _preOnTouch: null as any,
    _touchEvent: '',
    _fn: null as any,
    // Function mapping for cross browser support
    _fnMap: [
        [
            'requestFullscreen',
            'exitFullscreen',
            'fullscreenchange',
            'fullscreenEnabled',
            'fullscreenElement',
        ],
        [
            'requestFullScreen',
            'exitFullScreen',
            'fullScreenchange',
            'fullScreenEnabled',
            'fullScreenElement',
        ],
        [
            'webkitRequestFullScreen',
            'webkitCancelFullScreen',
            'webkitfullscreenchange',
            'webkitIsFullScreen',
            'webkitCurrentFullScreenElement',
        ],
        [
            'mozRequestFullScreen',
            'mozCancelFullScreen',
            'mozfullscreenchange',
            'mozFullScreen',
            'mozFullScreenElement',
        ],
        [
            'msRequestFullscreen',
            'msExitFullscreen',
            'MSFullscreenChange',
            'msFullscreenEnabled',
            'msFullscreenElement',
        ],
    ],

    /**
     * @en Initialization
     * @zh 初始化函数
     */
    init () {
        this._fn = {};
        let i; let l; let val; const map = this._fnMap; let valL;
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
        this._touchEvent = ('ontouchstart' in window) ? 'touchstart' : 'mousedown';
    },

    /**
     * @en Whether it supports full screen？
     * @zh 是否支持全屏？
     * @returns {Boolean}
     */
    get supportsFullScreen () {
        return this._supportsFullScreen;
    },

    /**
     * @en Return true if it's in full screen state now.
     * @zh 当前是否处在全屏状态下
     * @returns {Boolean}
     */
    fullScreen () {
        if (!this._supportsFullScreen) { return false; } else if (document[this._fn.fullscreenElement] === undefined || document[this._fn.fullscreenElement] === null) {
            return false;
        } else {
            return true;
        }
    },

    /**
     * @en Request to enter full screen mode with the given element.
     * Many browser forbid to enter full screen mode without an user intended interaction.
     * For simplify the process, you can try to use {{autoFullScreen}} which will try to enter full screen mode during the next user touch event.
     * @zh 尝试使当前节点进入全屏模式，很多浏览器不允许程序触发这样的行为，必须在一个用户交互回调中才会生效。
     * 如果希望更简单一些，可以尝试用 {{autoFullScreen}} 来自动监听用户触摸事件并在下一次触摸事件中尝试进入全屏模式。
     * @param element The element to request full screen state
     * @param onFullScreenChange callback function when full screen state changed
     * @param onFullScreenError callback function when full screen error
     * @return {Promise|undefined}
     */
    requestFullScreen (element: HTMLElement, onFullScreenChange?: (this: Document, ev: any) => any, onFullScreenError?: (this: Document, ev: any) => any): Promise<any> | undefined {
        if (!this._supportsFullScreen) {
            return;
        }

        element = element || document.documentElement;

        if (onFullScreenChange) {
            const eventName = this._fn.fullscreenchange;
            if (this._onfullscreenchange) {
                document.removeEventListener(eventName, this._onfullscreenchange);
            }
            this._onfullscreenchange = onFullScreenChange;
            document.addEventListener(eventName, onFullScreenChange, false);
        }

        if (onFullScreenError) {
            const eventName = this._fn.fullscreenerror;
            if (this._onfullscreenerror) {
                document.removeEventListener(eventName, this._onfullscreenerror);
            }
            this._onfullscreenerror = onFullScreenError;
            document.addEventListener(eventName, onFullScreenError, { once: true });
        }

        const requestPromise = element[this._fn.requestFullscreen]();
        // the requestFullscreen API can only be initiated by user gesture.
        if (window.Promise && requestPromise instanceof Promise) {
            requestPromise.catch((err) => {
                // do nothing ...
            });
        }
        return requestPromise;
    },

    /**
     * @en Exit the full mode.
     * @zh 退出全屏模式
     * @return {Promise|undefined}
     */
    exitFullScreen (): Promise<any> | undefined {
        let requestPromise;
        if (this.fullScreen()) {
            requestPromise = document[this._fn.exitFullscreen]();
            requestPromise.catch((err) => {
                // do nothing ...
            });
        }
        return requestPromise;
    },

    /**
     * @en Automatically request full screen during the next touch/click event
     * @zh 自动监听触摸、鼠标事件并在下一次事件触发时尝试进入全屏模式
     * @param element The element to request full screen state
     * @param onFullScreenChange callback function when full screen state changed
     */
    autoFullScreen (element: HTMLElement, onFullScreenChange: (this: Document, ev: any) => any) {
        element = element || document.body;

        this._ensureFullScreen(element, onFullScreenChange);
        this.requestFullScreen(element, onFullScreenChange);
    },

    disableAutoFullScreen (element) {
        if (this._preOnTouch) {
            const touchTarget = legacyCC.game.canvas || element;
            const touchEventName = this._touchEvent;
            touchTarget.removeEventListener(touchEventName, this._preOnTouch);
            this._preOnTouch = null;
        }
    },

    // Register touch event if request full screen failed
    _ensureFullScreen (element: HTMLElement, onFullScreenChange: (this: Document, ev: any) => any) {
        const touchTarget = legacyCC.game.canvas || element;
        const fullScreenErrorEventName = this._fn.fullscreenerror;
        const touchEventName = this._touchEvent;

        const onFullScreenError = () => {
            this._preOnFullScreenError = null;

            // handle touch event listener
            const onTouch = () => {
                this._preOnTouch = null;
                this.requestFullScreen(element, onFullScreenChange);
            };
            if (this._preOnTouch) {
                touchTarget.removeEventListener(touchEventName, this._preOnTouch);
            }
            this._preOnTouch = onTouch;
            touchTarget.addEventListener(touchEventName, this._preOnTouch, { once: true });
        };

        // handle full screen error
        if (this._preOnFullScreenError) {
            element.removeEventListener(fullScreenErrorEventName, this._preOnFullScreenError);
        }
        this._preOnFullScreenError = onFullScreenError;
        element.addEventListener(fullScreenErrorEventName, onFullScreenError, { once: true });
    },
};
screen.init();

legacyCC.screen = screen;

export { screen };
