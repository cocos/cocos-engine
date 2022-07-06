import { assertIsTrue } from '../../cocos/core/data/utils/asserts';

declare const jsb: any;
export class Pacer {
    private _rafHandle = 0;
    private _onTick: (() => void) | null = null;
    private _targetFrameRate = 60;
    private _isPlaying = false;
    private _updateCallback: () => void;
    constructor () {
        this._updateCallback = () => {
            if (this._onTick) {
                this._onTick();
            }
            if (this._isPlaying) {
                this._rafHandle = requestAnimationFrame(this._updateCallback);
            }
        };
    }

    get targetFrameRate (): number {
        return this._targetFrameRate;
    }

    set targetFrameRate (val: number) {
        if (this._targetFrameRate !== val) {
            assertIsTrue(val > 0);
            this._targetFrameRate = val;
            jsb.setPreferredFramesPerSecond(this._targetFrameRate);
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
        this._rafHandle = requestAnimationFrame(this._updateCallback);
        this._isPlaying = true;
    }

    stop (): void {
        if (!this._isPlaying) return;
        cancelAnimationFrame(this._rafHandle);
        this._rafHandle = 0;
        this._isPlaying = false;
    }
}
