import { CCTweenAction } from './cc-tweenAction';
import { CCTweenCommand } from './cc-tweenCommand';
import { CCTweenUnion } from './cc-tweenUnion';
import { ICCTweenOption, ICCTweenProp } from './export-api';

/**
 * for Compatible cocos creator
 */
export class CCTween {

    private static _recursiveForBy (props: object) {
        let theProp: number | object;
        // tslint:disable-next-line: forin
        for (const property in props) {
            theProp = props[property];
            if (typeof theProp === 'number') {
                const symbol = theProp > 0 ? '+' : '-';
                props[property] = symbol + theProp;
            } else if (typeof theProp === 'object') {
                CCTween._recursiveForBy(theProp);
            }
        }
    }

    private _command: CCTweenCommand = new CCTweenCommand();

    private _default: CCTweenUnion;

    private _uionDirty: boolean = false;

    constructor (target: Object) {
        this._default = new CCTweenUnion(target);
    }
    /**
     * com
     * @param duration
     * @param props
     * @param opts
     */
    public to (duration: number, props: ICCTweenProp, opts?: ICCTweenOption) {
        if (this._uionDirty) {
            this._default = new CCTweenUnion(this._default.target);
            this._uionDirty = false;
        }

        const action = new CCTweenAction(this._default.target, duration * 1000, props, opts);
        if (this._default.length > 0) {
            this._default.actions[this._default.length - 1].tween.chain(action.tween);
        }
        this._default.actions.push(action);
        return this;
    }

    /**
     *
     * @param duration
     * @param props
     * @param opts
     */
    public by (duration: number, props: ICCTweenProp, opts?: ICCTweenOption) {
        if (this._uionDirty) {
            this._default = new CCTweenUnion(this._default.target);
            this._uionDirty = false;
        }

        CCTween._recursiveForBy(props);

        const action = new CCTweenAction(this._default.target, duration * 1000, props, opts);
        if (this._default.length > 0) {
            this._default.actions[this._default.length - 1].tween.chain(action.tween);
        }
        this._default.actions.push(action);
        return this;
    }

    /**
     *
     */
    public union () {
        if (!this._command.isExistUnion(this._default)) {
            this._command.union(this._default);
            this._uionDirty = true;
        }
        return this;
    }

    /**
     *
     */
    public start () {
        if (this._default.length > 0) {
            if (!this._command.isExistUnion(this._default)) {
                this._command.union(this._default);
            }
        }
        this._command.start();
        return this;
    }

    /**
     *  TODO
     */
    public stop () {
        this._command.stop();
        return this;
    }

    /**
     *
     * @param times
     */
    public repeat (times: number) {
        if (this._uionDirty) {
            this._default.repeatTimes = times;
        } else {
            if (this._default.length > 0) {
                this._default.lastAction.tween.repeat(times);
            }
        }
        return this;
    }

    /**
     *
     */
    public repeatForever () {
        if (this._uionDirty) {
            this._default.repeatTimes = -1;
        } else {
            if (this._default.length > 0) {
                this._default.lastAction.tween.repeat(Infinity);
            }
        }
        return this;
    }

    /**
     * 延迟多少时间这个缓动，单位是秒
     * @param timeInSecond 时间
     */
    public delay (timeInSecond: number) {
        if (this._uionDirty) {
            this._default.delay = timeInSecond * 1000;
        } else {
            if (this._default.length > 0) {
                this._default.lastAction.tween.delay(timeInSecond * 1000);
            }
        }
        return this;
    }

    /**
     * @zh
     * 注册缓动执行完成后的回调（注意：一个 to 或 一个 uion 仅支持注册一个）。
     * @param callback 回调
     */
    public call (callback: (object?: any) => void) {
        if (this._uionDirty) {
            this._default.onCompeleteCallback = callback;
        } else {
            if (this._default.length > 0) {
                this._default.lastAction.tween.onComplete(callback);
            }
        }
        return this;
    }

    /*

    // todo
    public clone (target: Object) {

    }

    //  TODO
    public removeSelf () {

        return this;
    }

    //  TODO
    public reverseTime () {

        return this;
    }

    //  TODO
    public sequnence () {

        return this;
    }

    //  TODO
    public target (target: Object) {

        return this;
    }

    public then (other: CCTweenAction) {

        return this;
    }

    */
}

cc.CCTween = CCTween;

export function tween (target: Object): CCTween {
    return new CCTween(target);
}

cc.tween = tween;

/**
 * creator tween 行为
 * cc.T()
 * .to
 * .to // 变成 uion ? , not
 * .repeat(1, cc.T()) // 传入后会进行 union 操作
 * .repeat(1); // 操作的是创入的一个大 union
 *
 * cc.T()
 * .to
 * .to
 * .repeat(1, cc.T())
 * .to
 * .uion
 * .repeat(1);
 *
 * 多次 repeat 为累加
 * repeat 中传入的是 union
 */
