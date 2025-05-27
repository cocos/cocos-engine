import * as _window from './window';
import document from './document';
import { isIDE } from './utils/util';

function inject () {
    _window.document = document;

    _window.addEventListener = (type, listener) => {
        _window.document.addEventListener(type, listener);
    };
    _window.removeEventListener = (type, listener) => {
        _window.document.removeEventListener(type, listener);
    };
    _window.dispatchEvent = function (event = {}) {
        console.log('window.dispatchEvent', event.type, event);
    };

    if (isIDE) {
        for (const key in _window) {
            const descriptor = Object.getOwnPropertyDescriptor(window, key);

            if (!descriptor || descriptor.configurable === true) {
                Object.defineProperty(window, key, {
                    value: _window[key],
                });
            }
        }

        for (const key in _window.document) {
            const descriptor = Object.getOwnPropertyDescriptor(window.document, key);

            if (!descriptor || descriptor.configurable === true) {
                Object.defineProperty(window.document, key, {
                    value: _window.document[key],
                });
            }
        }
        window.parent = window;
        window.my = my;
    } else {
        _window.my = my;
        for (const key in _window) {
            window[key] = _window[key];
        }
    }
}

inject();

require('../../../../common/xmldom/dom-parser');
require('../unify');
