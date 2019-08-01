
/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
const { urlAppendTimestamp, parseParameters } = require('./utilities');

function downloadScript (url, options, onComplete) {
    var { options, onComplete } = parseParameters(options, undefined, onComplete);

    var d = document, s = document.createElement('script');

    if (window.location.protocol !== 'file:') {
        s.crossOrigin = 'anonymous';
    }

    s.async = options.isAsync === undefined ? true : options.isAsync;
    s.src = urlAppendTimestamp(url);
    function loadHandler () {
        s.parentNode.removeChild(s);
        s.removeEventListener('load', loadHandler, false);
        s.removeEventListener('error', errorHandler, false);
        onComplete && onComplete(null);
    }

    function errorHandler() {
        s.parentNode.removeChild(s);
        s.removeEventListener('load', loadHandler, false);
        s.removeEventListener('error', errorHandler, false);
        onComplete && onComplete(new Error(cc.debug.getError(4928, url)));
    }
    
    s.addEventListener('load', loadHandler, false);
    s.addEventListener('error', errorHandler, false);
    d.body.appendChild(s);
}

module.exports = downloadScript;