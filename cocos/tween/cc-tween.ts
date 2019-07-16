/**
 * @category tween
 */

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
     * @zh
     * 将以上的缓动联合成一个 union
     */
    public union () {
        if (!this._command.isExistUnion(this._default)) {
            this._command.union(this._default);
            this._uionDirty = true;
        }
        return this;
    }

    /**
     * @zh
     * 开始执行缓动，注：调用此方法后，请勿再增加缓动行为
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
     * @zh
     * 停止缓动，注：此方法尚不稳定
     */
    public stop () {
        this._command.stop();
        return this;
    }

    /**
     * @zh
     * 重复几次。
     *
     * 注：目前多次调用为重写次数，不是累加次数。
     *
     * 注：repeat(1) 代表重复一次，即执行两次。
     *
     * 注：暂不支持传入 CCTween
     *
     * @param times 次数
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
     * @zh
     * 一直重复。
     *
     * 注：此方法可能会被废弃
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
     * @zh
     * 延迟多少时间这个缓动，单位是秒。
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
     * 注册缓动执行完成后的回调。
     *
     * 注：一个 to 或 一个 union 仅支持注册一个。
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

/**
 * @zh
 * 增加一个 tween 缓动，与 creator 2D 中的 cc.tween 功能类似
 * @param target 缓动目标
 *
 * 注：请勿对 node 矩阵相关数据直接进行缓动，例如传入 this.node.position
 * @example
 * ```typescript
 * let position = new Vec3();
 * tween(position)
 *    .to(2000, new Vec3(0, 2, 0) }, { easing: TWEEN.Easing.Cubic.In })
 *    .start();
 * ```
 */
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
