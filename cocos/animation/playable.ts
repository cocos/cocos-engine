/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import { getError } from '../core';

export class Playable {
    /**
     * @en Whether if this `Playable` is in playing.
     * @zh 该 `Playable` 是否正在播放状态。
     * @default false
     */
    get isPlaying (): boolean {
        return this._isPlaying;
    }

    /**
     * @en Whether if this `Playable` has been paused. This can be true even if in edit mode(isPlaying == false).
     * @zh 该 `Playable` 是否已被暂停。
     * @default false
     */
    get isPaused (): boolean {
        return this._isPaused;
    }

    /**
     * @en Whether if this `Playable` has been paused or stopped.
     * @zh 该 `Playable` 是否已被暂停或停止。
     */
    get isMotionless (): boolean {
        return !this.isPlaying || this.isPaused;
    }

    private _isPlaying = false;
    private _isPaused = false;
    private _stepOnce = false;

    /**
     * @en Play this animation.
     * @zh 播放动画。
     */
    public play (): void {
        if (this._isPlaying) {
            if (this._isPaused) {
                this._isPaused = false;
                this.onResume();
            } else {
                this.onError(getError(3912));
            }
        } else {
            this._isPlaying = true;
            this.onPlay();
        }
    }

    /**
     * @en Stop this animation.
     * @zh 停止动画播放。
     */
    public stop (): void {
        if (this._isPlaying) {
            this._isPlaying = false;
            this.onStop();

            // need reset pause flag after onStop
            this._isPaused = false;
        }
    }

    /**
     * @en Pause this animation.
     * @zh 暂停动画。
     */
    public pause (): void {
        if (this._isPlaying && !this._isPaused) {
            this._isPaused = true;
            this.onPause();
        }
    }

    /**
     * @en Resume this animation.
     * @zh 重新播放动画。
     */
    public resume (): void {
        if (this._isPlaying && this._isPaused) {
            this._isPaused = false;
            this.onResume();
        }
    }

    /**
     * @en Perform a single frame step.
     * @zh 执行一帧动画。
     */
    public step (): void {
        this.pause();
        this._stepOnce = true;
        if (!this._isPlaying) {
            this.play();
        }
    }

    public update (deltaTime: number): void {

    }

    protected onPlay (): void {

    }

    protected onPause (): void {

    }

    protected onResume (): void {

    }

    protected onStop (): void {

    }

    protected onError (message: string): void {

    }
}
