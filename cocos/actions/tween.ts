import { TweenSystem } from './tween-system';
import { warnID, warn, easing } from '../core';
import { ActionInterval, sequence, repeat, repeatForever, reverseTime, delayTime, spawn } from './CCActionInterval';
import { ActionInstant, removeSelf, show, hide, callFunc } from './CCActionInstant';
import { Action } from './CCAction';
import { ITweenOption } from './export-api';

/** adapter */
function TweenEasinAdapter (easingName: string) {
    let initialChar = easingName.charAt(0);
    if (/[A-Z]/.test(initialChar)) {
        easingName = easingName.replace(initialChar, initialChar.toLowerCase());
        const arr = easingName.split('-');
        if (arr.length == 2) {
            const str0 = arr[0];
            if (str0 == 'linear') {
                easingName = 'linear';
            } else {
                const str1 = arr[1];
                switch (str0) {
                    case 'quadratic':
                        easingName = 'quad' + str1;
                        break;
                    case 'quartic':
                        easingName = 'quart' + str1;
                        break;
                    case 'quintic':
                        easingName = 'quint' + str1;
                        break;
                    case 'sinusoidal':
                        easingName = 'sine' + str1;
                        break;
                    case 'exponential':
                        easingName = 'expo' + str1;
                        break;
                    case 'circular':
                        easingName = 'circ' + str1;
                        break;
                    default:
                        easingName = str0 + str1;
                        break;
                }
            }
        }
    }
    return easingName;
}

/** checker */
function TweenOptionChecker (opts: ITweenOption) {
    const header = ' [Tween:] ';
    const message = ' option is not support in v1.1 ';
    if (opts['delay']) {
        warn(header + 'delay' + message);
    }
    if (opts['repeat']) {
        warn(header + 'repeat' + message);
    }
    if (opts['repeatDelay']) {
        warn(header + 'repeatDelay' + message);
    }
    if (opts['interpolation']) {
        warn(header + 'interpolation' + message);
    }
    if (opts['onStart']) {
        warn(header + 'onStart' + message);
    }
    if (opts['onStop']) {
        warn(header + 'onStop' + message);
    }
    if (opts['onUpdate']) {
        warn(header + 'onUpdate' + message);
    }
    if (opts['onComplete']) {
        warn(header + 'onComplete' + message);
    }
}

class TweenAction extends ActionInterval {
    private _opts: any;
    private _props: any;
    private _originProps: any;

    constructor (duration: number, props: any, opts?: ITweenOption) {
        super();
        if (opts == null) {
            opts = Object.create(null);
        } else {
            /** checker */
            TweenOptionChecker(opts);

            /** adapter */
            if (opts.easing && typeof opts.easing === 'string') {
                opts.easing = TweenEasinAdapter(opts.easing) as any;
            }

            // global easing or progress used for this action
            if (!opts.progress) {
                opts.progress = this.progress;
            }
            if (opts.easing && typeof opts.easing === 'string') {
                let easingName = opts.easing as string;
                opts.easing = easing[easingName];

                if (!opts.easing) { warnID(1031, easingName); }
            }
        }
        this._opts = opts;

        this._props = Object.create(null);
        for (let name in props) {
            let value = props[name];

            // property may have custom easing or progress function
            let easing, progress;
            if (value.value !== undefined && (value.easing || value.progress)) {
                if (typeof value.easing === 'string') {
                    easing = easing[value.easing];
                    !easing && warnID(1031, value.easing);
                }
                else {
                    easing = value.easing;
                }
                progress = value.progress;
                value = value.value;
            }

            let prop = Object.create(null);
            prop.value = value;
            prop.easing = easing;
            prop.progress = progress;
            this._props[name] = prop;
        }

        this._originProps = props;
        this.initWithDuration(duration);
    }

    clone () {
        var action = new TweenAction(this._duration, this._originProps, this._opts);
        this._cloneDecoration(action);
        return action;
    }

    startWithTarget (target: {}) {
        ActionInterval.prototype.startWithTarget.call(this, target);

        const relative = !!this._opts.relative;
        const props = this._props;
        for (var property in props) {
            const _t: any = target[property];
            if (_t === undefined) { continue; }

            const prop: any = props[property];
            const value = prop.value;
            if (typeof _t === "number") {
                prop.start[property] = _t;
                prop.current[property] = _t;
                prop.end[property] = relative ? _t + value : value;
            } else if (typeof _t === "object") {
                if (prop.start == undefined) {
                    prop.start = {}; prop.current = {}; prop.end = {};
                }
                for (var k in value) {
                    prop.start[k] = _t[k];
                    prop.current[k] = _t[k];
                    prop.end[k] = relative ? _t[k] + value[k] : value[k];
                }
            }
        }
    }

    update (t: number) {
        const target = this.target;
        if (!target) return;

        const props = this._props;
        const opts = this._opts;

        let easingTime = t;
        if (opts.easing) easingTime = opts.easing(t);

        let progress = this._opts.progress;
        for (const name in props) {
            let prop = props[name];
            let time = prop.easing ? prop.easing(t) : easingTime;
            let interpolation = prop.progress ? prop.progress : progress;

            const start = prop.start;
            const end = prop.end;
            if (typeof start === 'number') {
                prop.current = interpolation(start, end, prop.current, time);
            } else if (typeof start === 'object') {

                const value = prop.value;
                for (const k in start) {
                    // if (value[k].easing) {
                    //     time = value[k].easing(t);
                    // }
                    // if (value[k].progress) {
                    //     interpolation = value[k].easing(t);
                    // }
                    prop.current[k] = interpolation(start[k], end[k], prop.current[k], time);
                }
            }

            target[name] = prop.current;
        }
    }

    progress (start: any, end: any, current: any, t: number) {
        return current = start + (end - start) * t;
    }
}

class SetAction extends ActionInstant {

    private _props: any;

    constructor (props?: any) {
        super();
        this._props = {};
        props !== undefined && this.init(props);
    }

    init (props) {
        for (let name in props) {
            this._props[name] = props[name];
        }
        return true;
    }

    update () {
        let props = this._props;
        let target = this.target;
        for (let name in props) {
            target![name] = props[name];
        }
    }

    clone () {
        var action = new SetAction();
        action.init(this._props);
        return action;
    }
}

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