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

import { TweenSystem } from './tween-system';
import { warn } from '../core';
import { ActionInterval, sequence, repeat, repeatForever, reverseTime, delayTime, spawn } from './actions/action-interval';
import { removeSelf, show, hide, callFunc } from './actions/action-instant';
import { Action } from './actions/action';
import { ITweenOption } from './export-api';
import { TweenAction } from './tween-action';
import { SetAction } from './set-action';
import { legacyCC } from '../core/global-exports';

// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
type FlagExcludedType<Base, Type> = { [Key in keyof Base]: Base[Key] extends Type ? never : Key };
type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base];
type KeyPartial<T, K extends keyof T> = { [P in K]?: T[P] };
type OmitType<Base, Type> = KeyPartial<Base, AllowedNames<Base, Type>>;
// eslint-disable-next-line @typescript-eslint/ban-types
type ConstructorType<T> = OmitType<T, Function>;

/**
 * @en
 * Tween provide a simple and flexible way to action, It's transplanted from cocos creator。
 * @zh
 * Tween 提供了一个简单灵活的方法来缓动目标，从 creator 移植而来。
 * @class Tween
 * @param [target]
 * @example
 * tween(this.node)
 *   .to(1, {scale: new Vec3(2, 2, 2), position: new Vec3(5, 5, 5)})
 *   .call(() => { console.log('This is a callback'); })
 *   .by(1, {scale: new Vec3(-1, -1, -1), position: new Vec3(-5, -5, -5)}, {easing: 'sineOutIn'})
 *   .start()
 */
export class Tween<T> {
    private _actions: Action[] = [];
    private _finalAction: Action | null = null;
    private _target: T | null = null;
    private _tag = Action.TAG_INVALID;

    constructor (target?: T | null) {
        this._target = target === undefined ? null : target;
    }

    /**
     * @en Sets tween tag
     * @zh 设置缓动的标签
     * @method tag
     * @param tag @en The tag set for this tween @zh 为当前缓动设置的标签
     */
    tag (tag: number) {
        this._tag = tag;
        return this;
    }

    /**
     * @en
     * Insert an action or tween to this sequence.
     * @zh
     * 插入一个 tween 到队列中。
     * @method then
     * @param other @en The rear tween of this tween @zh 当前缓动的后置缓动
     */
    then (other: Tween<T>): Tween<T> {
        if (other instanceof Action) {
            this._actions.push(other.clone());
        } else {
            this._actions.push(other._union());
        }
        return this;
    }

    /**
     * @en
     * Sets tween target.
     * @zh
     * 设置 tween 的 target。
     * @method target
     * @param target @en The target of this tween @zh 当前缓动的目标对象
     */
    target (target: T): Tween<T | undefined> {
        this._target = target;
        return this;
    }

    /**
     * @en
     * Start this tween.
     * @zh
     * 运行当前 tween。
     */
    start (): Tween<T> {
        if (!this._target) {
            warn('Please set target to tween first');
            return this;
        }
        if (this._finalAction) {
            TweenSystem.instance.ActionManager.removeAction(this._finalAction);
        }
        this._finalAction = this._union();
        this._finalAction.setTag(this._tag);
        TweenSystem.instance.ActionManager.addAction(this._finalAction, this._target as any, false);
        return this;
    }

    /**
     * @en
     * Stop this tween.
     * @zh
     * 停止当前 tween。
     */
    stop (): Tween<T> {
        if (this._finalAction) {
            TweenSystem.instance.ActionManager.removeAction(this._finalAction);
        }
        return this;
    }

    /**
     * @en
     * Clone a tween.
     * @zh
     * 克隆当前 tween。
     * @method clone
     * @param target @en The target of clone tween @zh 克隆缓动的目标对象
     */
    clone (target: T): Tween<T> {
        const action = this._union();
        return tween(target).then(action.clone() as any);
    }

    /**
     * @en
     * Integrate all previous actions to an action.
     * @zh
     * 将之前所有的 action 整合为一个 action。
     */
    union (): Tween<T> {
        const action = this._union();
        this._actions.length = 0;
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Add an action which calculates with absolute value.
     * @zh
     * 添加一个对属性进行绝对值计算的 action。
     * @method to
     * @param duration @en Tween time, in seconds @zh 缓动时间，单位为秒
     * @param props @en List of properties of tween @zh 缓动的属性列表
     * @param opts @en Optional functions of tween @zh 可选的缓动功能
     * @param opts.progress @en Interpolation function @zh 缓动的速度插值函数
     * @param opts.easing @en Tween function or a lambda @zh 缓动的曲线函数或lambda表达式
     */
    to (duration: number, props: ConstructorType<T>, opts?: ITweenOption): Tween<T> {
        opts = opts || Object.create(null);
        (opts as any).relative = false;
        const action = new TweenAction(duration, props, opts);
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Add an action which calculates with relative value.
     * @zh
     * 添加一个对属性进行相对值计算的 action。
     * @method by
     * @param duration @en Tween time, in seconds @zh 缓动时间，单位为秒
     * @param props @en List of properties of tween @zh 缓动的属性列表
     * @param opts @en Optional functions of tween @zh 可选的缓动功能
     * @param [opts.progress]
     * @param [opts.easing]
     * @return {Tween}
     */
    by (duration: number, props: ConstructorType<T>, opts?: ITweenOption): Tween<T> {
        opts = opts || Object.create(null);
        (opts as any).relative = true;
        const action = new TweenAction(duration, props, opts);
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Directly set target properties.
     * @zh
     * 直接设置 target 的属性。
     * @method set
     * @param props @en List of properties of tween @zh 缓动的属性列表
     * @return {Tween}
     */
    set (props: ConstructorType<T>): Tween<T> {
        const action = new SetAction(props);
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Add a delay action.
     * @zh
     * 添加一个延时 action。
     * @method delay
     * @param duration @en Delay time of this tween @zh 当前缓动的延迟时间
     * @return {Tween}
     */
    delay (duration: number): Tween<T> {
        const action = delayTime(duration);
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Add a callback action.
     * @zh
     * 添加一个回调 action。
     * @method call
     * @param callback @en Callback function at the end of this tween @zh 当前缓动结束时的回调函数
     * @return {Tween}
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    call (callback: Function): Tween<T> {
        const action = callFunc(callback);
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Add a sequence action.
     * @zh
     * 添加一个队列 action。
     * @method sequence
     * @param args @en All tween that make up the sequence @zh 组成队列的所有缓动
     */
    sequence (...args: Tween<T>[]): Tween<T> {
        const action = Tween._wrappedSequence(...args);
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Add a parallel action.
     * @zh
     * 添加一个并行 action。
     * @method parallel
     * @param args @en The tween parallel to this tween @zh 与当前缓动并行的缓动
     */
    parallel (...args: Tween<T>[]): Tween<T> {
        const action = Tween._wrappedParallel(...args);
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Add a repeat action.
     * This action will integrate before actions to a sequence action as their parameters.
     * @zh
     * 添加一个重复 action，这个 action 会将前一个动作作为他的参数。
     * @param repeatTimes @en The repeat times of this tween @zh 重复次数
     * @param embedTween @en Optional, embedded tween of this tween @zh 可选，嵌入缓动
     */
    repeat (repeatTimes: number, embedTween?: Tween<T>): Tween<T> {
        /** adapter */
        if (repeatTimes === Infinity) {
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
     * Add a repeat forever action.
     * This action will integrate before actions to a sequence action as their parameters.
     * @zh
     * 添加一个永久重复 action，这个 action 会将前一个动作作为他的参数。
     * @method repeatForever
     * @param embedTween @en Optional, embedded tween of this tween @zh 可选，嵌入缓动
     */
    repeatForever (embedTween?: Tween<T>): Tween<T> {
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
     * Add a reverse time action.
     * This action will integrate before actions to a sequence action as their parameters.
     * @zh
     * 添加一个倒置时间 action，这个 action 会将前一个动作作为他的参数。
     * @method reverseTime
     * @param embedTween @en Optional, embedded tween of this tween @zh 可选，嵌入缓动
     */
    reverseTime (embedTween?: Tween<T>): Tween<T> {
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

    /**
     * @en
     * Add a hide action, only for node target.
     * @zh
     * 添加一个隐藏 action，只适用于 target 是节点类型的。
     */
    hide (): Tween<T> {
        const action = hide();
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Add a show action, only for node target.
     * @zh
     * 添加一个显示 action，只适用于 target 是节点类型的。
     */
    show (): Tween<T> {
        const action = show();
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Add a removeSelf action, only for node target.
     * @zh
     * 添加一个移除自己 action，只适用于 target 是节点类型的。
     */
    removeSelf (): Tween<T> {
        const action = removeSelf(false);
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Add a destroySelf action, only for node target.
     * @zh
     * 添加一个移除并销毁自己 action，只适用于 target 是节点类型的。
     */
    destroySelf (): Tween<T> {
        const action = removeSelf(true);
        this._actions.push(action);
        return this;
    }

    /**
     * @en
     * Stop all tweens
     * @zh
     * 停止所有缓动
     */
    static stopAll () {
        TweenSystem.instance.ActionManager.removeAllActions();
    }
    /**
     * @en
     * Stop all tweens by tag
     * @zh
     * 停止所有指定标签的缓动
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    static stopAllByTag (tag: number, target?: object) {
        TweenSystem.instance.ActionManager.removeAllActionsByTag(tag, target as any);
    }
    /**
     * @en
     * Stop all tweens by target
     * @zh
     * 停止所有指定对象的缓动
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    static stopAllByTarget (target?: object) {
        TweenSystem.instance.ActionManager.removeAllActionsFromTarget(target as any);
    }

    private _union () {
        const actions = this._actions;
        let action: Action;
        if (actions.length === 1) {
            action = actions[0];
        } else {
            action = sequence(actions);
        }

        return action;
    }

    private _destroy () {
        this.stop();
    }

    private static readonly _tmp_args: Tween<any>[] | Action[] = [];

    private static _wrappedSequence (...args: Action[] | Tween<any>[]) {
        const tmp_args = Tween._tmp_args;
        tmp_args.length = 0;
        for (let l = args.length, i = 0; i < l; i++) {
            const arg = tmp_args[i] = args[i];
            if (arg instanceof Tween) {
                tmp_args[i] = arg._union();
            }
        }

        return sequence.apply(sequence, tmp_args as any);
    }

    private static _wrappedParallel (...args: Action[] | Tween<any>[]) {
        const tmp_args = Tween._tmp_args;
        tmp_args.length = 0;
        for (let l = args.length, i = 0; i < l; i++) {
            const arg = tmp_args[i] = args[i];
            if (arg instanceof Tween) {
                tmp_args[i] = arg._union();
            }
        }

        return spawn.apply(spawn, tmp_args as any);
    }
}
legacyCC.Tween = Tween;

/**
 * @en
 * tween is a utility function that helps instantiate Tween instances.
 * @zh
 * tween 是一个工具函数，帮助实例化 Tween 实例。
 * @param target @en The target of the result tween @zh 缓动的目标
 * @returns Tween 实例
 * @example
 * tween(this.node)
 *   .to(1, {scale: new Vec3(2, 2, 2), position: new Vec3(5, 5, 5)})
 *   .call(() => { console.log('This is a callback'); })
 *   .by(1, {scale: new Vec3(-1, -1, -1)}, {easing: 'sineOutIn'})
 *   .start()
 */
export function tween<T> (target?: T) {
    return new Tween<T>(target);
}
legacyCC.tween = tween;

/**
 * @en
 * tweenUtil is a utility function that helps instantiate Tween instances.
 * @zh
 * tweenUtil 是一个工具函数，帮助实例化 Tween 实例。
 * @deprecated please use `tween` instead.
 */
export function tweenUtil<T> (target?: T) {
    warn('tweenUtil\' is deprecated, please use \'tween\' instead ');
    return new Tween<T>(target);
}
legacyCC.tweenUtil = tweenUtil;
