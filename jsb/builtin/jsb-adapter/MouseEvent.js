/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
const Event = require('./Event')

class MouseEvent extends Event {
    constructor(type, initArgs) {
        super(type)
        this._button = initArgs.button;
        this._which = initArgs.which;
        this._wheelDelta = initArgs.wheelDelta;
        this._clientX = initArgs.clientX;
        this._clientY = initArgs.clientY;
        this._screenX = initArgs.screenX;
        this._screenY = initArgs.screenY;
        this._pageX = initArgs.pageX;
        this._pageY = initArgs.pageY;
    }

    get button() {
        return this._button;
    }

    get which() {
        return this._which;
    }

    get wheelDelta() {
        return this._wheelDelta;
    }

    get clientX() {
        return this._clientX;
    }

    get clientY() {
        return this._clientY;
    }

    get screenX() {
        return this._screenX;
    }

    get screenY() {
        return this._screenY;
    }

    get pageX() {
        return this._pageX;
    }

    get pageY() {
        return this._pageY;
    }
}

module.exports = MouseEvent
