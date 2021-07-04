/*
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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
*/
/**
 * @packageDocumentation
 * @module core
 */

import { JSB, RUNTIME_BASED } from 'internal:constants';

export interface TickByTimer {
    tick: (deltaTime: number) => void;
}

export class Timer {
    /**
     * @en Expected frame rate of the timer.
     * @zh 计时器的设定帧率。
     */
    public get frameRate () {
        return this._frameRate;
    }
    public set frameRate (frameRate: number | string) {
        if (typeof frameRate !== 'number') {
            frameRate = parseInt(frameRate, 10);
            if (Number.isNaN(frameRate)) {
                frameRate = 60;
            }
        }
        this._frameRate = frameRate;
        this.frameTime = 1000 / frameRate;
        this._setAnimFrame();
    }

    /**
     * @en The delta time since last frame, unit: s.
     * @zh 获取上一帧的增量时间，以秒为单位。
     */
    public get deltaTime () {
        return this._deltaTime;
    }

    /**
     * @en The total passed time since game start, unit: ms
     * @zh 获取从游戏开始到现在总共经过的时间，以毫秒为单位
     */
    public get totalTime () {
        return performance.now() - this._initTime;
    }

    /**
     * @en The start time of the current frame.
     * @zh 获取当前帧开始的时间。
     */
    public get frameStartTime () {
        return this._startTime;
    }

    /**
     * @en Check whether the timer is paused.
     * @zh 判断计时器是否暂停。
     */
    public get paused () {
        return this._paused;
    }

    public declare frameTime: number;

    private declare _sys: TickByTimer;
    private _paused = true;
    private _frameRate = 60;
    private _intervalId = 0; // interval target of main
    private declare _initTime: number;
    private declare _startTime: number;
    private _deltaTime = 0.0;
    private declare _callback: (time: number) => void;

    /**
     * @en Start the timer with a system that have tick function
     * @zh 针对一个支持 tick 的系统启动计时器
     */
    public start (sys: TickByTimer) {
        this._sys = sys;
        this.resume();
    }

    /**
     * @en Pause the timer
     * @zh 暂停计时器
     */
    public pause () {
        if (this._paused) { return; }
        this._paused = true;
        if (this._intervalId) {
            window.cAF(this._intervalId);
            this._intervalId = 0;
        }
    }

    /**
     * @en Resume the timer
     * @zh 恢复计时器
     */
    public resume () {
        if (!this._paused) { return; }
        if (this._intervalId) {
            window.cAF(this._intervalId);
            this._intervalId = 0;
        }
        this._paused = false;
        this._updateCallback();
        this._intervalId = window.rAF(this._callback);
    }

    private _setAnimFrame () {
        const frameRate = this._frameRate;
        if (JSB) {
            // @ts-expect-error JSB Call
            jsb.setPreferredFramesPerSecond(frameRate);
            window.rAF = window.requestAnimationFrame;
            window.cAF = window.cancelAnimationFrame;
        } else {
            const rAF = window.requestAnimationFrame = window.requestAnimationFrame
                     || window.webkitRequestAnimationFrame
                     || window.mozRequestAnimationFrame
                     || window.oRequestAnimationFrame
                     || window.msRequestAnimationFrame;
            if (frameRate !== 60 && frameRate !== 30) {
                window.rAF = this._stTime.bind(this);
                window.cAF = this._ctTime;
            } else {
                window.rAF = rAF || this._stTime.bind(this);
                window.cAF = window.cancelAnimationFrame
                    || window.cancelRequestAnimationFrame
                    || window.msCancelRequestAnimationFrame
                    || window.mozCancelRequestAnimationFrame
                    || window.oCancelRequestAnimationFrame
                    || window.webkitCancelRequestAnimationFrame
                    || window.msCancelAnimationFrame
                    || window.mozCancelAnimationFrame
                    || window.webkitCancelAnimationFrame
                    || window.ocancelAnimationFrame
                    || this._ctTime;

                // update callback function for 30 fps version
                this._updateCallback();
            }
        }
    }
    private _stTime (callback: () => void) {
        const currTime = performance.now();
        const elapseTime = Math.max(0, (currTime - this._startTime));
        const timeToCall = Math.max(0, this.frameTime - elapseTime);
        const id = window.setTimeout(callback, timeToCall);
        return id;
    }
    private _ctTime (id: number | undefined) {
        window.clearTimeout(id);
    }
    private _calculateDT (now?: number) {
        if (!now) now = performance.now();
        this._deltaTime = now > this._startTime ? (now - this._startTime) / 1000 : 0;
        this._startTime = now;
        return this._deltaTime;
    }

    private _updateCallback () {
        const sys = this._sys;
        let callback;
        if (!JSB && !RUNTIME_BASED && this._frameRate === 30) {
            let skip = true;
            callback = (time: number) => {
                this._intervalId = window.rAF(this._callback);
                skip = !skip;
                if (skip) {
                    return;
                }
                sys.tick(this._calculateDT(time));
            };
        } else {
            callback = (time: number) => {
                sys.tick(this._calculateDT(time));
                this._intervalId = window.rAF(this._callback);
            };
        }
        this._callback = callback;
    }
}
