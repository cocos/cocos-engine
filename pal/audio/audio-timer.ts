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

import { clamp } from '../../cocos/core/math/utils';

/**
 * Tool class to calculate audio current time.
 * For some platforms where audio.currentTime doesn't work well or isn't implemented.
 */

interface IDuration {
    duration: number;
}

export default class AudioTimer {
    private _nativeAudio: IDuration;
    private _startTime = 0;
    private _startOffset = 0;
    private _isPaused = true;

    constructor (nativeAudio: IDuration) {
        this._nativeAudio = nativeAudio;
    }

    public destroy (): void {
        // NOTE: 'undefined' is not assignable to type 'IDuration'
        this._nativeAudio = undefined as any;
    }

    get duration (): number {
        return this._nativeAudio.duration;
    }

    /**
     * Get the current time of audio timer.
     */
    get currentTime (): number {
        if (this._isPaused) {
            return this._startOffset;
        } else {
            return this._calculateCurrentTime();
        }
    }

    private _now (): number {
        return performance.now() / 1000;
    }

    private _calculateCurrentTime (): number {
        const timePassed = this._now() - this._startTime;
        const currentTime = this._startOffset + timePassed;
        if (currentTime >= this.duration) {
            // timer loop
            this._startTime = this._now();
            this._startOffset = 0;
        }
        return currentTime % this.duration;
    }

    /**
     * Start the audio timer.
     * Call this method when audio is played.
     */
    start (): void {
        this._isPaused = false;
        this._startTime = this._now();
    }

    /**
     * Pause the audio timer.
     * Call this method when audio is paused or interrupted.
     */
    pause (): void {
        if (this._isPaused) {
            return;
        }
        this._isPaused = true;
        this._startOffset = this._calculateCurrentTime();
    }

    /**
     * Stop the audio timer.
     * Call this method when audio playing ended or audio is stopped.
     */
    stop (): void {
        this._isPaused = true;
        this._startOffset = 0;
    }

    /**
     * Seek the audio timer.
     * Call this method when audio is seeked.
     */
    seek (time: number): void {
        this._startTime = this._now();
        this._startOffset = clamp(time, 0, this.duration);
    }
}
