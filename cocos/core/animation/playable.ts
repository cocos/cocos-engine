/**
 * @category animation
 */

import { getError } from '../platform/debug';

export class Playable {

    /**
     * @en Whether if this `Playable` is in playing.
     * @zh 该 `Playable` 是否正在播放状态。
     * @default false
     */
    get isPlaying () {
        return this._isPlaying;
    }

    /**
     * @en Whether if this `Playable` has been paused. This can be true even if in edit mode(isPlaying == false).
     * @zh 该 `Playable` 是否已被暂停。
     * @default false
     */
    get isPaused () {
        return this._isPaused;
    }

    /**
     * @en Whether if this `Playable` has been paused or stopped.
     * @zh 该 `Playable` 是否已被暂停或停止。
     */
    get isMotionless () {
        return !this.isPlaying || this.isPaused;
    }

    private _isPlaying = false;
    private _isPaused = false;
    private _stepOnce = false;

    /**
     * @en Play this animation.
     * @zh 播放动画。
     */
    public play () {
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
    public stop () {
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
    public pause () {
        if (this._isPlaying && !this._isPaused) {
            this._isPaused = true;
            this.onPause();
        }
    }

    /**
     * @en Resume this animation.
     * @zh 重新播放动画。
     */
    public resume () {
        if (this._isPlaying && this._isPaused) {
            this._isPaused = false;
            this.onResume();
        }
    }

    /**
     * @en Perform a single frame step.
     * @zh 执行一帧动画。
     */
    public step () {
        this.pause();
        this._stepOnce = true;
        if (!this._isPlaying) {
            this.play();
        }
    }

    public update (deltaTime: number) {

    }

    protected onPlay () {

    }

    protected onPause () {

    }

    protected onResume () {

    }

    protected onStop () {

    }

    protected onError (message: string) {

    }
}
