import { getError } from '../core/platform/CCDebug';

export class Playable {

    /**
     * !#en Is playing or paused in play mode?
     * !#zh 当前是否正在播放。
     * @default false
     */
    get isPlaying () {
        return this._isPlaying;
    }

    /**
     * !#en Is currently paused? This can be true even if in edit mode(isPlaying == false).
     * !#zh 当前是否正在暂停
     * @default false
     */
    get isPaused () {
        return this._isPaused;
    }
    private _isPlaying = false;
    private _isPaused = false;
    private _stepOnce = false;

    /**
     * !#en Play this animation.
     * !#zh 播放动画。
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
     * !#en Stop this animation.
     * !#zh 停止动画播放。
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
     * !#en Pause this animation.
     * !#zh 暂停动画。
     */
    public pause () {
        if (this._isPlaying && !this._isPaused) {
            this._isPaused = true;
            this.onPause();
        }
    }

    /**
     * !#en Resume this animation.
     * !#zh 重新播放动画。
     */
    public resume () {
        if (this._isPlaying && this._isPaused) {
            this._isPaused = false;
            this.onResume();
        }
    }

    /**
     * !#en Perform a single frame step.
     * !#zh 执行一帧动画。
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
