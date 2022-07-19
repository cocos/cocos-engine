/* eslint-disable */
import * as _$window from './window'
import document from './document'
import isDevtool from './util/isDevtool';
import HTMLElement from './HTMLElement'

// Avoid being static analyzed in webpack
const _window = _$window

const global = GameGlobal

GameGlobal.global = GameGlobal.global || global

function inject() {
    _window.document = document;

    _window.addEventListener = (type, listener) => {
        _window.document.addEventListener(type, listener)
    }
    _window.removeEventListener = (type, listener) => {
        _window.document.removeEventListener(type, listener)
    }
    _window.dispatchEvent = function(event = {}) {
        console.log('window.dispatchEvent', event.type, event);
        // nothing to do
    }

    if (isDevtool()) {
        for (const key in _window) {
            const descriptor = Object.getOwnPropertyDescriptor(global, key)

            if (!descriptor || descriptor.configurable === true) {
                Object.defineProperty(window, key, {
                    value: _window[key]
                })
            }
        }

        for (const key in _window.document) {
            const descriptor = Object.getOwnPropertyDescriptor(global.document, key)

            if (!descriptor || descriptor.configurable === true) {
                Object.defineProperty(global.document, key, {
                    value: _window.document[key]
                })
            }
        }
        window.parent = window
    } else {
        for (const key in _window) {
            global[key] = _window[key]
        }
        global.window = global
        global.top = global.parent = global
    }
}

if (swan.getSharedCanvas) {
    const sharedCanvas = swan.getSharedCanvas();
    //     sharedCanvas.__proto__.__proto__ = new HTMLCanvasElement;
    if (!_window.sharedCanvas) {
        // 兼容微信
        _window.sharedCanvas = sharedCanvas;
    }
    sharedCanvas.addEventListener = _window.addEventListener;
    sharedCanvas.removeEventListener = _window.removeEventListener;
}

if (!GameGlobal.__isAdapterInjected) {
    GameGlobal.__isAdapterInjected = true
    inject()
}

require('../../../../common/xmldom/dom-parser');
require('../unify');