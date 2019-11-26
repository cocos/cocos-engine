import { TweenSystem } from './tween-system';
import { warn } from '../core';
import { ActionInterval, sequence, repeat, repeatForever, reverseTime, delayTime, spawn } from './action-interval';
import { removeSelf, show, hide, callFunc } from './action-instant';
import { Action } from './action';
import { ITweenOption } from './export-api';
import { TweenAction } from './tween-action';
import { SetAction } from './set-action';

const tmp_args: Tween[] | Action[] = [];
function wrapAction (action: Function) {
    return function (...args: Action[] | Tween[]) {
        tmp_args.length = 0;
        for (let l = args.length, i = 0; i < l; i++) {
            let arg = tmp_args[i] = args[i];
            if (arg instanceof Tween) {
                tmp_args[i] = arg._union();
            }
        }

        return action.apply(action, tmp_args);
    }
}
const wrappedSequence = wrapAction(sequence);
const wrappedParallel = wrapAction(spawn);

/**
 * @en
 * Tween provide a simple and flexible way to action。
 * @zh
 * Tween 提供了一个简单灵活的方法来缓动目标。
 * @class Tween
 * @param {Object} [target]
 * @example
 * tween(this.node)
 *   .to(1, {scale: new Vec3(2, 2, 2), position: new Vec3(5, 5, 5)})
 *   .call(() => { console.log('This is a callback'); })
 *   .by(1, {scale: new Vec3(-1, -1, -1), position: new Vec3(-5, -5, -5)}, {easing: 'sineOutIn'})
 *   .start()
 */
export class Tween {

    private _actions: Action[] = [];
    private _finalAction: Action | null = null;
    private _target: object | null = null;

    constructor (target: object) {
        this._target = target;
    }

    /**
     * @en
     * Insert an action or tween to this sequence
     * @zh
     * 插入一个 tween 到队列中
     * @method then 
     * @param {Tween} other
     * @return {Tween}
     */
    then (other: Tween): Tween {
        if (other instanceof Action) {
            this._actions.push(other.clone());
        }
        else {
            this._actions.push(other._union());
        }
        return this;
    }

    /**
     * @en
     * Set tween target
     * @zh
     * 设置 tween 的 target
     * @method target
     * @param {Object} target
     * @return {Tween}
     */
    target (target: object): Tween {
        this._target = target;
        return this;
    }

    /**
     * @en
     * Start this tween
     * @zh
     * 运行当前 tween
     * @method start
     * @return {Tween}
     */
    start (): Tween {
        if (!this._target) {
            warn('Please set target to tween first');
            return this;
        }
        if (this._finalAction) {
            TweenSystem.instance.ActionManager.removeAction(this._finalAction);
        }
        this._finalAction = this._union();
        TweenSystem.instance.ActionManager.addAction(this._finalAction, this._target as any, false);
        return this;
    }

    /**
     * @en
     * Stop this tween
     * @zh
     * 停止当前 tween
     * @method stop
     * @return {Tween}
     */
    stop (): Tween {
        if (this._finalAction) {
            TweenSystem.instance.ActionManager.removeAction(this._finalAction);
        }
        return this;
    }

    /**
     * @en
     * Clone a tween
     * @zh
     * 克隆当前 tween
     * @method clone
     * @param {Object} [target]
     * @return {Tween}
     */
    clone (target: object): Tween {
        let action = this._union();
        return tween(target).then(action.clone() as any);
    }

    /**
     * @en
     * Integrate all previous actions to an action.
     * @zh
     * 将之前所有的 action 整合为一个 action。
     * @method union
     * @return {Tween}
     */
    union (): Tween {
        let action = this._union();
        this._actions.length = 0;
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Add an action which calculate with absolute value
     * @zh
     * 添加一个对属性进行绝对值计算的 action
     * @method to
     * @param {number} duration 缓动时间，单位为秒
     * @param {Object} props 缓动的属性列表
     * @param {Object} [opts] 可选的缓动功能
     * @param {Function} [opts.progress]
     * @param {Function|String} [opts.easing]
     * @return {Tween}
     */
    to (duration: number, props: object, opts?: ITweenOption): Tween {
        opts = opts || Object.create(null);
        (opts as any).relative = false;
        const action = new TweenAction(duration, props, opts);
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Add an action which calculate with relative value
     * @zh
     * 添加一个对属性进行相对值计算的 action
     * @method by
     * @param {number} duration 缓动时间，单位为秒
     * @param {Object} props 缓动的属性列表
     * @param {Object} [opts] 可选的缓动功能
     * @param {Function} [opts.progress]
     * @param {Function|String} [opts.easing]
     * @return {Tween}
     */
    by (duration: number, props: object, opts?: ITweenOption): Tween {
        opts = opts || Object.create(null);
        (opts as any).relative = true;
        const action = new TweenAction(duration, props, opts);
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Directly set target properties
     * @zh
     * 直接设置 target 的属性
     * @method set
     * @param {Object} props
     * @return {Tween}
     */
    set (props: object): Tween {
        const action = new SetAction(props);
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Add an delay action
     * @zh
     * 添加一个延时 action
     * @method delay
     * @param {number} duration 
     * @return {Tween}
     */
    delay (duration: number): Tween {
        const action = delayTime(duration);
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Add an callback action
     * @zh
     * 添加一个回调 action
     * @method call
     * @param {Function} callback
     * @return {Tween}
     */
    call (callback: Function): Tween {
        const action = callFunc(callback);
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Add an sequence action
     * @zh
     * 添加一个队列 action
     * @method sequence
     * @param {Tween} action
     * @param {Tween} ...actions
     * @return {Tween}
     */
    sequence (...args: Tween[]): Tween {
        const action = wrappedSequence(...args);
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Add an parallel action
     * @zh
     * 添加一个并行 action
     * @method parallel
     * @param {Tween} action
     * @param {Tween} ...actions
     * @return {Tween}
     */
    parallel (...args: Tween[]): Tween {
        const action = wrappedParallel(...args);
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Add an repeat action. 
     * This action will integrate before actions to a sequence action as their parameters.
     * @zh
     * 添加一个重复 action，这个 action 会将前一个动作作为他的参数。
     * @method repeat
     * @param {number} repeatTimes
     * @param {Tween} [action]
     * @return {Tween}
     */
    repeat (repeatTimes: number, embedTween?: Tween): Tween {
        /** adapter */
        if (repeatTimes == Infinity) {
            return this.repeatForever(embedTween);
        }

        const actions = this._actions;
        let action: any;

        if (embedTween instanceof Tween) {
            action = embedTween._union();
        } else {
            action = actions.pop();
        }

        actions.push(repeat(action, repeatTimes));
        return this;
    }

    /**
     * @en
     * Add an repeat forever action
     * This action will integrate before actions to a sequence action as their parameters.
     * @zh
     * 添加一个永久重复 action，这个 action 会将前一个动作作为他的参数。
     * @method repeatForever
     * @param {Tween} [action]
     * @return {Tween}
     */
    repeatForever (embedTween?: Tween): Tween {
        const actions = this._actions;
        let action: any;

        if (embedTween instanceof Tween) {
            action = embedTween._union();
        } else {
            action = actions.pop();
        }

        actions.push(repeatForever(action as ActionInterval));
        return this;
    }

    /**
     * @en
     * Add an reverse time action.
     * This action will integrate before actions to a sequence action as their parameters.
     * @zh
     * 添加一个倒置时间 action，这个 action 会将前一个动作作为他的参数。
     * @method reverseTime
     * @param {Tween} [action]
     * @return {Tween}
     */
    reverseTime (embedTween?: Tween): Tween {
        const actions = this._actions;
        let action: any;

        if (embedTween instanceof Tween) {
            action = embedTween._union();
        } else {
            action = actions.pop();
        }

        actions.push(reverseTime(action as ActionInterval));
        return this;
    }

    // /**
    //  * @en
    //  * Add an hide action
    //  * @zh
    //  * 添加一个隐藏 action
    //  * @method hide
    //  * @return {Tween}
    //  */
    // hide (): Tween {
    //     let action = hide();
    //     this._actions.push(action);
    //     return this;
    // }

    // /**
    //  * @en
    //  * Add an show action
    //  * @zh
    //  * 添加一个显示 action
    //  * @method show
    //  * @return {Tween}
    //  */
    // show (): Tween {
    //     let action = show();
    //     this._actions.push(action);
    //     return this;
    // }

    // /**
    //  * @en
    //  * Add an removeSelf action
    //  * @zh
    //  * 添加一个移除自己 action
    //  * @method removeSelf
    //  * @return {Tween}
    //  */
    // removeSelf () {        
    //     let action = removeSelf();
    //     this._actions.push(action);
    //     return this;
    // }

    _union () {
        let actions = this._actions;
        let action: Action;
        if (actions.length === 1) {
            action = actions[0];
        }
        else {
            action = sequence(actions);
        }

        return action;
    }

}
cc.Tween = Tween;

export function tween (target: {}) {
    return new Tween(target);
}
cc.tween = tween;

export function tweenUtil (target: {}) {
    return tween(target);
}
cc.tweenUtil = tweenUtil;