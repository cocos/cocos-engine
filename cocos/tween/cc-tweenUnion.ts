import { CCTweenAction } from './cc-tweenAction';

export class CCTweenUnion {

    public get actions () {
        return this._actions;
    }

    public get length () {
        return this._actions.length;
    }

    public get firstAction () {
        return this._actions[0];
    }

    public get lastAction () {
        return this._actions[this._actions.length - 1];
    }

    public get target () {
        return this._target;
    }

    public get runTimes () {
        return this._runTimes;
    }

    public set runTimes (times: number) {
        this._runTimes = times;
    }

    public get repeatTimes () {
        return this._repeatTimes;
    }

    public set repeatTimes (times: number) {
        this._repeatTimes = times;
    }

    public get lastCount () {
        return this._repeatTimes - this._runTimes;
    }

    public set onCompeleteCallback (callback: (object?: any) => void) {
        this._onCompeleteCallback = callback;
    }

    public get onCompeleteCallback (): ((object?: any) => void) {
        return this._onCompeleteCallback!;
    }

    public get delay () {
        return this._delay;
    }

    public set delay (v: number) {
        this._delay = v;
    }

    private static _idCounter: number = 0;

    public readonly id: number;

    private _actions: CCTweenAction[] = [];

    private _target: Object;

    private _runTimes: number = 0;

    private _repeatTimes: number = 0; // -1 mean forever, only changed before start

    private _onCompeleteCallback: ((object?: any) => void) | undefined;

    private _delay: number = 0;

    constructor (target: Object) {
        this.id = CCTweenUnion._idCounter++;
        this._target = target;
    }

    public start () {
        if (this.length > 0) {
            if (this.delay > 0) {
                const tween = this.actions[0].tween;
                setTimeout(tween.start.bind(tween), this.delay);
            } else {
                this.actions[0].tween.start();
            }
        }
    }

    public stop (): boolean {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this._actions.length; i++) {
            const tween = this._actions[i].tween;
            if (tween.isPlaying()) {
                tween.stop();
                return true;
            }
        }
        return false;
    }

}

cc.CCTweenUnion = CCTweenUnion;
