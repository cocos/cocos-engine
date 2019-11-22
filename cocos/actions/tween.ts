import { TweenSystem } from './tween-system';
import { warnID, warn, easing } from '../core';
import { ActionInterval, sequence, repeat, repeatForever, reverseTime, delayTime, spawn } from './CCActionInterval';
import { ActionInstant, removeSelf, show, hide, callFunc } from './CCActionInstant';
import { Action } from './CCAction';

class TweenAction extends ActionInterval {
    private _opts: any;
    private _props: any;
    private _originProps: any;

    constructor (duration: number, props: any, opts: any) {
        super();
        this._opts = opts = opts || Object.create(null);
        this._props = Object.create(null);

        // global easing or progress used for this action
        opts.progress = opts.progress || this.progress;
        if (opts.easing && typeof opts.easing === 'string') {
            let easingName = opts.easing;
            /** adapter */
            let initialChar = easingName.charAt(0);
            if (/[A-Z]/.test(initialChar)) {
                easingName = easingName.replace(initialChar, initialChar.toLowerCase());
                easingName = easingName.replace(RegExp('-'), '');
            }
            opts.easing = easing[easingName];
            !opts.easing && warnID(1031, easingName);
        }

        let relative = this._opts.relative;

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

            let isNumber = typeof value === 'number';
            if (!isNumber && (!value.lerp || (relative && !value.add && !value.mul) || !value.clone)) {
                warn(`Can not animate ${name} property, because it do not have [lerp, (add|mul), clone] function.`);
                continue;
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

        let relative = !!this._opts.relative;
        let props = this._props;
        for (let name in props) {
            let value = target[name];
            let prop = props[name];

            if (typeof value === 'number') {
                prop.start = value;
                prop.current = value;
                prop.end = relative ? value + prop.value : prop.value;
            }
            else {
                prop.start = value.clone();
                prop.current = value.clone();
                prop.end = relative ? (value.add || value.mul).call(value, prop.value) : prop.value;
            }
        }
    }

    update (t: number) {
        let opts = this._opts;
        let easingTime = t;
        if (opts.easing) easingTime = opts.easing(t);

        let target = this.target;
        if (!target) return;

        let props = this._props;
        let progress = this._opts.progress;
        for (let name in props) {
            let prop = props[name];
            let time = prop.easing ? prop.easing(t) : easingTime;
            // let current = prop.current = (prop.progress || progress)(prop.start, prop.end, prop.current, time);            
            let interpolation = prop.progress ? prop.progress : progress;
            progress2(prop, time, interpolation);
            target[name] = prop.current;
        }
    }

    progress (start: any, end: any, current: any, t: number) {
        if (typeof start === 'number') {
            current = start + (end - start) * t;
        }
        else {
            start.lerp(end, t, current);
        }
        return current;
    }
}

function progress2 (prop: any, t: number, func: Function) {
    const start = prop.start;
    const end = prop.end;
    if (typeof start === 'number') {
        prop.current = func(start, end, prop.current, t);
    } else if (typeof start === 'object') {
        for (var key in end) {
            progress2_r(start[key], end[key], t, func, prop.current, key);
        }
    }
}

function progress2_r (start: number | object, end: number | object, t: number, func: Function, target: object, key: string) {
    if (typeof end === 'number') {
        target[key] = func(start, end, target[key], t);
    } else if (typeof end === 'object') {
        for (var k in end) {
            progress2_r(start[k], end[k], t, func, target, k);
        }
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
 * !#en
 * Tween provide a simple and flexible way to create action.
 * Tween's api is more flexible than cc.Action:
 *  - Support creating an action sequence in chained api,
 *  - Support animate any objects' any properties, not limited to node's properties.
 *    By contrast, cc.Action needs to create a new action class to support new node property.
 *  - Support working with cc.Action,
 *  - Support easing and progress function.
 * !#zh
 * Tween 提供了一个简单灵活的方法来创建 action。
 * 相对于 Cocos 传统的 cc.Action，cc.Tween 在创建动画上要灵活非常多：
 *  - 支持以链式结构的方式创建一个动画序列。
 *  - 支持对任意对象的任意属性进行缓动，不再局限于节点上的属性，而 cc.Action 添加一个属性的支持时还需要添加一个新的 action 类型。
 *  - 支持与 cc.Action 混用
 *  - 支持设置 {{#crossLink "Easing"}}{{/crossLink}} 或者 progress 函数
 * @class Tween
 * @param {Object} [target]
 * @example
 * cc.tween(node)
 *   .to(1, {scale: 2, position: cc.v3(100, 100, 100)})
 *   .call(() => { console.log('This is a callback'); })
 *   .by(1, {scale: 3, position: cc.v3(200, 200, 200)}, {easing: 'sineOutIn'})
 *   .run(cc.find('Canvas/cocos'));
 */
export class Tween {

    private _actions: Action[] = [];
    private _finalAction: Action | null = null;
    private _target: object | null = null;

    constructor (target: object) {
        this._target = target;
    }

    /**
     * !#en
     * Insert an action or tween to this sequence
     * !#zh
     * 插入一个 action 或者 tween 到队列中
     * @method then 
     * @param {Action|Tween} other
     * @return {Tween}
     */
    then (other: Action | Tween): Tween {
        if (other instanceof Action) {
            this._actions.push(other.clone());
        }
        else {
            this._actions.push(other._union());
        }
        return this;
    }

    /**
     * !#en
     * Set tween target
     * !#zh
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
     * !#en
     * Start this tween
     * !#zh
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
     * !#en
     * Stop this tween
     * !#zh
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
     * !#en
     * Clone a tween
     * !#zh
     * 克隆当前 tween
     * @method clone
     * @param {Object} [target]
     * @return {Tween}
     */
    clone (target: object): Tween {
        let action = this._union();
        return tween(target).then(action.clone());
    }

    /**
     * !#en
     * Integrate all previous actions to an action.
     * !#zh
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
     * !#en
     * Add an action which calculate with absolute value
     * !#zh
     * 添加一个对属性进行绝对值计算的 action
     * @method to
     * @param {Number} duration 
     * @param {Object} props - {scale: 2, position: cc.v3(100, 100, 100)}
     * @param {Object} [opts] 
     * @param {Function} [opts.progress]
     * @param {Function|String} [opts.easing]
     * @return {Tween}
     */
    to (duration: number, props: object, opts: any): Tween {
        opts = opts || Object.create(null);
        opts.relative = false;
        const action = new TweenAction(duration, props, opts);
        this._actions.push(action);
        return this;
    }

    /**
     * !#en
     * Add an action which calculate with relative value
     * !#zh
     * 添加一个对属性进行相对值计算的 action
     * @method by
     * @param {Number} duration 
     * @param {Object} props - {scale: 2, position: cc.v3(100, 100, 100)}
     * @param {Object} [opts] 
     * @param {Function} [opts.progress]
     * @param {Function|String} [opts.easing]
     * @return {Tween}
     */
    by (duration: number, props: object, opts: any): Tween {
        opts = opts || Object.create(null);
        opts.relative = true;
        const action = new TweenAction(duration, props, opts);
        this._actions.push(action);
        return this;
    }

    /**
     * !#en
     * Directly set target properties
     * !#zh
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
     * !#en
     * Add an delay action
     * !#zh
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
     * !#en
     * Add an callback action
     * !#zh
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
     * !#en
     * Add an sequence action
     * !#zh
     * 添加一个队列 action
     * @method sequence
     * @param {Action|Tween} action
     * @param {Action|Tween} ...actions
     * @return {Tween}
     */
    sequence (...args: Tween[]): Tween {
        const action = wrappedSequence(...args);
        this._actions.push(action);
        return this;
    }

    /**
     * !#en
     * Add an parallel action
     * !#zh
     * 添加一个并行 action
     * @method parallel
     * @param {Action|Tween} action
     * @param {Action|Tween} ...actions
     * @return {Tween}
     */
    parallel (...args: Tween[]): Tween {
        const action = wrappedParallel(...args);
        this._actions.push(action);
        return this;
    }

    // /**
    //  * !#en
    //  * Add an hide action
    //  * !#zh
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
    //  * !#en
    //  * Add an show action
    //  * !#zh
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
    //  * !#en
    //  * Add an removeSelf action
    //  * !#zh
    //  * 添加一个移除自己 action
    //  * @method removeSelf
    //  * @return {Tween}
    //  */
    // removeSelf () {        
    //     let action = removeSelf();
    //     this._actions.push(action);
    //     return this;
    // }

    /**
     * !#en
     * Add an repeat action. 
     * This action will integrate before actions to a sequence action as their parameters.
     * !#zh
     * 添加一个重复 action，这个 action 会将前一个动作作为他的参数。
     * @method repeat
     * @param {number} repeatTimes
     * @param {Action | Tween} [action]
     * @return {Tween}
     */
    repeat (repeatTimes: number, embedTween?: Tween): Tween {
        const actions = this._actions;
        let action = actions[actions.length - 1];

        if (embedTween instanceof Tween) {
            action = embedTween._union();
        }

        // if (embedTween instanceof Action) {
        //     action = embedTween;
        // }

        actions.push(repeat(action, repeatTimes));
        return this;
    }

    /**
     * !#en
     * Add an repeat forever action
     * This action will integrate before actions to a sequence action as their parameters.
     * !#zh
     * 添加一个永久重复 action，这个 action 会将前一个动作作为他的参数。
     * @method repeatForever
     * @param {Action | Tween} [action]
     * @return {Tween}
     */
    repeatForever (embedTween?: Tween): Tween {
        const actions = this._actions;
        let action = actions[actions.length - 1];

        if (embedTween instanceof Tween) {
            action = embedTween._union();
        }

        // if (embedTween instanceof Action) {
        //     action = embedTween;
        // }

        actions.push(repeatForever(action as ActionInterval));
        return this;
    }

    /**
     * !#en
     * Add an reverse time action.
     * This action will integrate before actions to a sequence action as their parameters.
     * !#zh
     * 添加一个倒置时间 action，这个 action 会将前一个动作作为他的参数。
     * @method reverseTime
     * @param {Action | Tween} [action]
     * @return {Tween}
     */
    reverseTime (embedTween?: Tween): Tween {
        const actions = this._actions;
        let action = actions[actions.length - 1];

        if (embedTween instanceof Tween) {
            action = embedTween._union();
        }

        // if (embedTween instanceof Action) {
        //     action = embedTween;
        // }

        actions.push(reverseTime(action as ActionInterval));
        return this;
    }

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