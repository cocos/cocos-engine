/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

import { EDITOR } from 'internal:constants';
import { assertIsTrue } from '../../cocos/core/data/utils/asserts';
import { checkPalIntegrity, withImpl } from '../integrity-check';

const FRAME_RESET_TIME = 2000;

export class Pacer {
    private _stHandle = 0;
    private _onTick: (() => void) | null = null;
    private _targetFrameRate = 60;
    private _frameTime = 0;
    private _startTime = 0;
    private _isPlaying = false;
    private _frameCount = 0;
    private _callback: (() => void) | null = null;
    private _rAF: typeof requestAnimationFrame;
    private _cAF: typeof cancelAnimationFrame;

    constructor () {
        this._frameTime = 1000 / this._targetFrameRate;
        this._rAF = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame;
        this._cAF = window.cancelAnimationFrame
        || window.cancelRequestAnimationFrame
        || window.msCancelRequestAnimationFrame
        || window.mozCancelRequestAnimationFrame
        || window.oCancelRequestAnimationFrame
        || window.webkitCancelRequestAnimationFrame
        || window.msCancelAnimationFrame
        || window.mozCancelAnimationFrame
        || window.webkitCancelAnimationFrame
        || window.ocancelAnimationFrame;
    }

    get targetFrameRate (): number {
        return this._targetFrameRate;
    }

    set targetFrameRate (val: number) {
        if (this._targetFrameRate !== val) {
            assertIsTrue(val > 0);
            this._targetFrameRate = val;
            this._frameTime = 1000 / this._targetFrameRate;
            if (this._isPlaying) {
                this.stop();
                this.start();
            }
        }
    }

    set onTick (val: (() => void) | null) {
        this._onTick = val;
    }

    get onTick (): (() => void) | null {
        return this._onTick;
    }

    start (): void {
        if (this._isPlaying) return;
        const recordStartTime = EDITOR || this._rAF === undefined || globalThis.__globalXR?.isWebXR;
        const updateCallback = (): void => {
            if (recordStartTime) this._startTime = performance.now();
            if (this._isPlaying) {
                this._stHandle = this._stTime(updateCallback);
            }
            if (this._onTick) {
                this._onTick();
            }
        };
        this._startTime = performance.now();
        this._stHandle = this._stTime(updateCallback);

        this._isPlaying = true;
        this._frameCount = 0;
    }

    stop (): void {
        if (!this._isPlaying) return;
        this._ctTime(this._stHandle);
        this._stHandle = 0;
        this._isPlaying = false;
        this._frameCount = 0;
    }

    _handleRAF = (stamp: number): void => {
        const currTime = performance.now();
        const elapseTime = currTime - this._startTime;
        const elapseFrame = Math.floor(elapseTime / this._frameTime);
        if (elapseFrame < 0) {
            this._startTime = currTime;
            this._frameCount = 0;
        }
        if (elapseFrame < this._frameCount) {
            this._stHandle = this._rAF.call(window, this._handleRAF);
        } else {
            this._frameCount = elapseFrame + 1;
            if (this._callback) {
                this._callback();
            }
        }
    };

    private _stTime (callback: () => void): number {
        if (EDITOR || this._rAF === undefined || globalThis.__globalXR?.isWebXR) {
            const currTime = performance.now();
            const elapseTime = Math.max(0, currTime - this._startTime);
            const timeToCall = Math.max(0, this._frameTime - elapseTime);
            return setTimeout(callback, timeToCall);
        }
        this._callback = callback;
        return this._rAF.call(window, this._handleRAF);
    }

    private _ctTime (id: number | undefined): void {
        if (EDITOR || this._cAF === undefined || globalThis.__globalXR?.isWebXR) {
            clearTimeout(id);
        } else if (id) {
            this._cAF.call(window, id);
        }
    }
}

checkPalIntegrity<typeof import('pal/pacer')>(withImpl<typeof import('./pacer-web')>());
