/*
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

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
/* eslint-disable @typescript-eslint/ban-types */

import { FiniteTimeAction } from './action';
import { Renderer } from '../../misc/renderer';

/**
 * @en Instant actions are immediate actions. They don't have a duration like the ActionInterval actions.
 * @zh 即时动作，这种动作立即就会执行，继承自 FiniteTimeAction。
 * @class ActionInstant
 * @extends FiniteTimeAction
 */
export class ActionInstant extends FiniteTimeAction {
    isDone (): boolean {
        return true;
    }

    step (dt: number): void {
        this.update(1);
    }

    update (dt: number): void {
        // nothing
    }

    /**
     * returns a reversed action. <br />
     * For example: <br />
     * - The action is x coordinates of 0 move to 100. <br />
     * - The reversed action will be x of 100 move to 0.
     * @returns {Action}
     */
    reverse (): ActionInstant {
        return this.clone();
    }

    clone (): ActionInstant {
        return new ActionInstant();
    }
}

/*
 * Show the node.
 * @class Show
 * @extends ActionInstant
 */
export class Show extends ActionInstant {
    update (_dt: number): void {
        const _renderComps = (this.target as any).getComponentsInChildren(Renderer);
        for (let i = 0; i < _renderComps.length; ++i) {
            const render = _renderComps[i];
            render.enabled = true;
        }
    }

    reverse (): Hide {
        return new Hide();
    }

    clone (): Show {
        return new Show();
    }
}

/**
 * @en Show the Node.
 * @zh 立即显示。
 * @method show
 * @return {ActionInstant}
 * @example
 * // example
 * var showAction = show();
 */
export function show (): ActionInstant {
    return new Show();
}

/*
 * Hide the node.
 * @class Hide
 * @extends ActionInstant
 */
export class Hide extends ActionInstant {
    update (_dt: number): void {
        const _renderComps = (this.target as any).getComponentsInChildren(Renderer);
        for (let i = 0; i < _renderComps.length; ++i) {
            const render = _renderComps[i];
            render.enabled = false;
        }
    }

    reverse (): Show {
        return new Show();
    }

    clone (): Hide {
        return new Hide();
    }
}

/**
 * @en Hide the node.
 * @zh 立即隐藏。
 * @method hide
 * @return {ActionInstant}
 * @example
 * // example
 * var hideAction = hide();
 */
export function hide (): ActionInstant {
    return new Hide();
}

/*
 * Toggles the visibility of a node.
 * @class ToggleVisibility
 * @extends ActionInstant
 */
export class ToggleVisibility extends ActionInstant {
    update (_dt: number): void {
        const _renderComps = (this.target as any).getComponentsInChildren(Renderer);
        for (let i = 0; i < _renderComps.length; ++i) {
            const render = _renderComps[i];
            render.enabled = !render.enabled;
        }
    }

    reverse (): ToggleVisibility {
        return new ToggleVisibility();
    }

    clone (): ToggleVisibility {
        return new ToggleVisibility();
    }
}

/**
 * @en Toggles the visibility of a node.
 * @zh 显隐状态切换。
 * @method toggleVisibility
 * @return {ActionInstant}
 * @example
 * // example
 * var toggleVisibilityAction = toggleVisibility();
 */
export function toggleVisibility (): ActionInstant {
    return new ToggleVisibility();
}

/*
 * Delete self in the next frame.
 * @class RemoveSelf
 * @extends ActionInstant
 * @param {Boolean} [isNeedCleanUp=true]
 *
 * @example
 * // example
 * var removeSelfAction = new RemoveSelf(false);
 */
export class RemoveSelf extends ActionInstant {
    protected _isNeedCleanUp = true;

    constructor (isNeedCleanUp?: boolean) {
        super();
        if (isNeedCleanUp !== undefined) this.init(isNeedCleanUp);
    }

    update (_dt: number): void {
        (this.target as any).removeFromParent();
        if (this._isNeedCleanUp) {
            (this.target as any).destroy();
        }
    }

    init (isNeedCleanUp: boolean): boolean {
        this._isNeedCleanUp = isNeedCleanUp;
        return true;
    }

    reverse (): RemoveSelf {
        return new RemoveSelf(this._isNeedCleanUp);
    }

    clone (): RemoveSelf {
        return new RemoveSelf(this._isNeedCleanUp);
    }
}

/**
 * @en Create a RemoveSelf object with a flag indicate whether the target should be cleaned up while removing.
 * @zh 从父节点移除自身。
 * @method removeSelf
 * @param {Boolean} [isNeedCleanUp = true]
 * @return {ActionInstant}
 *
 * @example
 * // example
 * var removeSelfAction = removeSelf();
 */
export function removeSelf (isNeedCleanUp: boolean): ActionInstant {
    return new RemoveSelf(isNeedCleanUp);
}

/*
 * Calls a 'callback'.
 * @class CallFunc
 * @extends ActionInstant
 * @param {function} selector
 * @param {object} [selectorTarget=null]
 * @param {*} [data=null] data for function, it accepts all data types.
 * @example
 * // example
 * // CallFunc without data
 * var finish = new CallFunc(this.removeSprite, this);
 *
 * // CallFunc with data
 * var finish = new CallFunc(this.removeFromParentAndCleanup, this,  true);
 */
export class CallFunc extends ActionInstant {
    private _selectorTarget: unknown;
    private _function: Function | undefined;
    private _data = null;

    /*
     * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
     * Creates a CallFunc action with the callback.
     * @param {function} selector
     * @param {object} [selectorTarget=null]
     * @param {*} [data=null] data for function, it accepts all data types.
     */
    constructor (selector?: Function, selectorTarget?: unknown, data?: any) {
        super();
        this.initWithFunction(selector, selectorTarget, data);
    }

    /*
     * Initializes the action with a function or function and its target
     * @param {function} selector
     * @param {object|Null} selectorTarget
     * @param {*|Null} [data] data for function, it accepts all data types.
     * @return {Boolean}
     */
    initWithFunction<T> (selector?: Function, selectorTarget?: T, data?: any): boolean {
        if (selector) {
            this._function = selector;
        }
        if (selectorTarget) {
            this._selectorTarget = selectorTarget;
        }
        if (data !== undefined) {
            this._data = data;
        }
        return true;
    }

    /*
     * execute the function.
     */
    execute (): void {
        if (this._function) {
            this._function.call(this._selectorTarget, this.target, this._data);
        }
    }

    update (_dt: number): void {
        this.execute();
    }

    /*
     * Get selectorTarget.
     * @return {object}
     */
    getTargetCallback<T> (): T | undefined {
        return this._selectorTarget as T;
    }

    /*
     * Set selectorTarget.
     * @param {object} sel
     */
    setTargetCallback<T> (sel: T): void {
        if (sel !== this._selectorTarget) {
            if (this._selectorTarget) { this._selectorTarget = undefined; }
            this._selectorTarget = sel;
        }
    }

    clone (): CallFunc {
        const action = new CallFunc();
        action.initWithFunction(this._function, this._selectorTarget, this._data);
        return action;
    }
}

/**
 * @en Creates the action with the callback.
 * @zh 执行回调函数。
 * @method callFunc
 * @param {function} selector
 * @param {object} [selectorTarget=null]
 * @param {*} [data=null] - data for function, it accepts all data types.
 * @return {ActionInstant}
 * @example
 * // example
 * // CallFunc without data
 * var finish = callFunc(this.removeSprite, this);
 *
 * // CallFunc with data
 * var finish = callFunc(this.removeFromParentAndCleanup, this._grossini,  true);
 */
export function callFunc<T> (selector: Function, selectorTarget?: T, data?: any): ActionInstant {
    return new CallFunc(selector, selectorTarget, data);
}
