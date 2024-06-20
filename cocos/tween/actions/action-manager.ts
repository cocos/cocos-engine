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

import { errorID, logID } from '../../core/platform/debug';
import { Action } from './action';
import { isCCObject } from '../../core/data/object';
import { Node, NodeEventType } from '../../scene-graph';

/*
 * @class HashElement
 * @constructor
 * @private
 */
class HashElement {
    actions: Action[] = [];
    target: unknown = null;
    actionIndex = 0;
    currentAction: Action | null = null;
    paused = false;
    lock = false;
}

/**
 * @en
 * `ActionManager` is a class that can manage actions.<br/>
 * Normally you won't need to use this class directly. 99% of the cases you will use the `Tween` interface,
 * which uses this class's singleton object.
 * - When you want to pause / resume the actions<br/>
 * @zh
 * `ActionManager` 是可以管理动作的单例类。<br/>
 * 通常你并不需要直接使用这个类，99%的情况您将使用 `Tween` 的接口。<br/>
 * 但也有一些情况下，您可能需要使用这个类。 <br/>
 * 例如：
 *  - 当你想要暂停/恢复动作时。 <br/>
 * @class ActionManager
 */
export class ActionManager {
    private _hashTargets = new Map<unknown, HashElement>();
    private _arrayTargets: HashElement[] = [];
    private _currentTarget!: HashElement;
    private _elementPool: HashElement[] = [];

    private _getElement<T> (target: T, paused: boolean): HashElement {
        let element = this._elementPool.pop();
        if (!element) {
            element = new HashElement();
        }
        element.target = target;
        element.paused = !!paused;
        return element;
    }

    private _putElement<T> (element: HashElement): void {
        element.actions.length = 0;
        element.actionIndex = 0;
        element.currentAction = null;
        element.paused = false;
        element.target = null;
        element.lock = false;
        this._elementPool.push(element);
    }

    private _onNodeActiveChanged (target: Node, active: boolean): void {
        if (active) {
            this.resumeTarget(target);
        } else {
            this.pauseTarget(target);
        }
    }

    private _onNodeDestroy (target: Node): void {
        // Doesn't need to off node event since it will be done automatically after this event is fired.
        this._removeAllActionsFromTarget(target, false);
    }

    private _registerNodeEvent (target: Node): void {
        if (target.isValid) {
            target.on(NodeEventType.ACTIVE_CHANGED, this._onNodeActiveChanged, this);
            target.on(NodeEventType.NODE_DESTROYED, this._onNodeDestroy, this);
        }
    }

    private _unregisterNodeEvent (target: Node): void {
        if (target.isValid) {
            target.off(NodeEventType.ACTIVE_CHANGED, this._onNodeActiveChanged, this);
            target.off(NodeEventType.NODE_DESTROYED, this._onNodeDestroy, this);
        }
    }

    /**
     * @en
     * Adds an action with a target.<br/>
     * If the target is already present, then the action will be added to the existing target.
     * If the target is not present, a new instance of this target will be created either paused or not,
     * and the action will be added to the newly created target.
     * When the target is paused, the queued actions won't be 'ticked'.
     * @zh
     * 增加一个动作，同时还需要提供动作的目标对象，目标对象是否暂停作为参数。<br/>
     * 如果目标已存在，动作将会被直接添加到现有的节点中。<br/>
     * 如果目标不存在，将为这一目标创建一个新的实例，并将动作添加进去。<br/>
     * 当目标状态的 paused 为 true，动作将不会被执行
     *
     * @method addAction
     * @param {Action} action
     * @param {object} target
     * @param {Boolean} paused
     */
    addAction<T> (action: Action | null, target: T, paused: boolean): void {
        if (!action || !target) {
            errorID(1000);
            return;
        }

        // check if the action target already exists
        let element = this._hashTargets.get(target);
        // if doesn't exists, create a hashelement and push in mpTargets
        if (!element) {
            element = this._getElement(target, paused);
            this._hashTargets.set(target, element);
            this._arrayTargets.push(element);
        } else if (!element.actions) {
            element.actions = [];
        }

        if (element.actions.length === 0 && target instanceof Node) {
            this._registerNodeEvent(target);
        }

        // update target due to the same UUID is allowed for different scenarios
        element.target = target;
        element.actions.push(action);
        action.startWithTarget(target);
    }

    /**
     * @en Removes all actions from all the targets.
     * @zh 移除所有对象的所有动作。
     * @method removeAllActions
     */
    removeAllActions (): void {
        const locTargets = this._arrayTargets;
        for (let i = 0; i < locTargets.length; i++) {
            const element = locTargets[i];
            if (element) {
                if (element.target instanceof Node) {
                    this._unregisterNodeEvent(element.target);
                }

                this._putElement(element);
            }
        }
        this._arrayTargets.length = 0;
        this._hashTargets = new Map<unknown, HashElement>();
    }
    /**
     * @en
     * Removes all actions from a certain target. <br/>
     * All the actions that belongs to the target will be removed.
     * @zh
     * 移除指定对象上的所有动作。<br/>
     * 属于该目标的所有的动作将被删除。
     * @method removeAllActionsFromTarget
     * @param {T} target
     */
    removeAllActionsFromTarget<T> (target: T): void {
        this._removeAllActionsFromTarget(target, true);
    }

    private _removeAllActionsFromTarget<T> (target: T, offNodeEvent: boolean): void {
        // explicit null handling
        if (target == null) return;
        const element = this._hashTargets.get(target);
        if (element) {
            if (offNodeEvent && target instanceof Node) {
                this._unregisterNodeEvent(target);
            }

            element.actions.length = 0;
            this._deleteHashElement(element);
        }
    }

    /**
     * @en Removes an action given an action reference.
     * @zh 移除指定的动作。
     * @method removeAction
     * @param {Action} action
     */
    removeAction (action: Action | null): void {
        // explicit null handling
        if (action == null) return;
        const target = action.getOriginalTarget()!;
        const element = this._hashTargets.get(target);

        if (element) {
            for (let i = 0; i < element.actions.length; i++) {
                if (element.actions[i] === action) {
                    element.actions.splice(i, 1);
                    // update actionIndex in case we are in tick. looping over the actions
                    if (element.actionIndex >= i) element.actionIndex--;
                    break;
                }
            }
        }
    }

    /**
     * @internal
     */
    _removeActionByTag<T> (tag: number, element: HashElement, target?: T): void {
        for (let i = 0, l = element.actions.length; i < l; ++i) {
            const action = element.actions[i];
            if (action && action.getTag() === tag) {
                if (target && action.getOriginalTarget() !== target) {
                    continue;
                }
                this._removeActionAtIndex(i, element);
                break;
            }
        }
    }

    /**
     * @internal
     */
    _removeAllActionsByTag<T> (tag: number, element: HashElement, target?: T): void {
        for (let i = element.actions.length - 1; i >= 0; --i) {
            const action = element.actions[i];
            if (action && action.getTag() === tag) {
                if (target && action.getOriginalTarget() !== target) {
                    continue;
                }
                this._removeActionAtIndex(i, element);
            }
        }
    }

    /**
     * @en Removes an action given its tag and the target.
     * @zh 删除指定对象下特定标签的一个动作，将删除首个匹配到的动作。
     * @method removeActionByTag
     * @param {Number} tag
     * @param {T} target
     */
    removeActionByTag<T> (tag: number, target?: T): void {
        if (tag === Action.TAG_INVALID) logID(1002);

        const hashTargets = this._hashTargets;
        if (target) {
            const element = hashTargets.get(target);
            if (element) {
                this._removeActionByTag(tag, element, target);
            }
        } else {
            hashTargets.forEach((element) => {
                this._removeActionByTag(tag, element);
            });
        }
    }

    /**
     * @en Removes all actions given the tag and the target.
     * @zh 删除指定对象下特定标签的所有动作。
     * @method removeAllActionsByTag
     * @param {Number} tag
     * @param {T} target
     */
    removeAllActionsByTag<T> (tag: number, target?: T): void {
        if (tag === Action.TAG_INVALID) logID(1002);

        const hashTargets = this._hashTargets;
        if (target) {
            const element = hashTargets.get(target);
            if (element) {
                this._removeAllActionsByTag(tag, element, target);
            }
        } else {
            hashTargets.forEach((element) => {
                this._removeAllActionsByTag(tag, element);
            });
        }
    }

    /**
     * @en Gets an action given its tag an a target.
     * @zh 通过目标对象和标签获取一个动作。
     * @method getActionByTag
     * @param {Number} tag
     * @param {T} target
     * @return {Action|null}  return the Action with the given tag on success
     */
    getActionByTag<T> (tag: number, target: T): Action | null {
        if (tag === Action.TAG_INVALID) logID(1004);

        const element = this._hashTargets.get(target);
        if (element) {
            if (element.actions != null) {
                for (let i = 0; i < element.actions.length; ++i) {
                    const action = element.actions[i];
                    if (action && action.getTag() === tag) {
                        return action;
                    }
                }
            }
            logID(1005, tag);
        }
        return null;
    }

    /**
     * @en
     * Returns the numbers of actions that are running in a certain target. <br/>
     * Composable actions are counted as 1 action. <br/>
     * Example: <br/>
     * - If you are running 1 Sequence of 7 actions, it will return 1. <br/>
     * - If you are running 7 Sequences of 2 actions, it will return 7.
     * @zh
     * 返回指定对象下所有正在运行的动作数量。 <br/>
     * 组合动作被算作一个动作。<br/>
     * 例如：<br/>
     *  - 如果您正在运行 7 个动作组成的序列动作（Sequence），这个函数将返回 1。<br/>
     *  - 如果你正在运行 2 个序列动作（Sequence）和 5 个普通动作，这个函数将返回 7。<br/>
     *
     * @method getNumberOfRunningActionsInTarget
     * @param {T} target
     * @return {Number}
     */
    getNumberOfRunningActionsInTarget<T> (target: T): number {
        const element = this._hashTargets.get(target);
        if (element) {
            return (element.actions) ? element.actions.length  : 0;
        }

        return 0;
    }
    /**
     * @en Pauses the target: all running actions and newly added actions will be paused.
     * @zh 暂停指定对象：所有正在运行的动作和新添加的动作都将会暂停。
     * @method pauseTarget
     * @param {T} target
     */
    pauseTarget<T> (target: T): void {
        const element = this._hashTargets.get(target);
        if (element) element.paused = true;
    }

    /**
     * @en Resumes the target. All queued actions will be resumed.
     * @zh 让指定目标恢复运行。在执行序列中所有被暂停的动作将重新恢复运行。
     * @method resumeTarget
     * @param {T} target
     */
    resumeTarget<T> (target: T): void {
        const element = this._hashTargets.get(target);
        if (element) element.paused = false;
    }

    /**
     * @en Pauses all running actions, returning a list of targets whose actions were paused.
     * @zh 暂停所有正在运行的动作，返回一个包含了那些动作被暂停了的目标对象的列表。
     * @method pauseAllRunningActions
     * @return {Array}  a list of targets whose actions were paused.
     */
    pauseAllRunningActions (): unknown[] {
        const idsWithActions: unknown[] = [];
        const locTargets = this._arrayTargets;
        for (let i = 0; i < locTargets.length; i++) {
            const element = locTargets[i];
            if (element && !element.paused) {
                element.paused = true;
                if (element.target) {
                    idsWithActions.push(element.target);
                }
            }
        }
        return idsWithActions;
    }

    /**
     * @en Resume a set of targets (convenience function to reverse a pauseAllRunningActions or pauseTargets call).
     * @zh 让一组指定对象恢复运行（用来逆转 pauseAllRunningActions 效果的便捷函数）。
     * @method resumeTargets
     * @param {Array} targetsToResume
     */
    resumeTargets<T> (targetsToResume: Array<T>): void {
        if (!targetsToResume) return;

        for (let i = 0; i < targetsToResume.length; i++) {
            if (targetsToResume[i]) this.resumeTarget(targetsToResume[i]);
        }
    }

    /**
     * @en Pause a set of targets.
     * @zh 暂停一组指定对象。
     * @method pauseTargets
     * @param {Array} targetsToPause
     */
    pauseTargets<T> (targetsToPause: Array<T>): void {
        if (!targetsToPause) return;

        for (let i = 0; i < targetsToPause.length; i++) {
            if (targetsToPause[i]) this.pauseTarget(targetsToPause[i]);
        }
    }

    isActionRunning (action: Action): boolean {
        const elements = this._hashTargets.get(action.getOriginalTarget());
        let index = -1;
        if (elements) index = elements.actions.indexOf(action);
        return index !== -1;
    }

    // protected
    private _removeActionAtIndex (index: number, element: HashElement): void {
        element.actions.splice(index, 1);

        // update actionIndex in case we are in tick. looping over the actions
        if (element.actionIndex >= index) element.actionIndex--;

        if (element.actions.length === 0) {
            if (element.target instanceof Node) {
                this._unregisterNodeEvent(element.target);
            }
            this._deleteHashElement(element);
        }
    }

    private _deleteHashElement (element: HashElement): boolean {
        let ret = false;
        if (element && !element.lock) {
            if (this._hashTargets.get(element.target)) {
                this._hashTargets.delete(element.target);
                const targets = this._arrayTargets;
                for (let i = 0, l = targets.length; i < l; i++) {
                    if (targets[i] === element) {
                        targets.splice(i, 1);
                        break;
                    }
                }
                this._putElement(element);
                ret = true;
            }
        }
        return ret;
    }

    /**
     * @en The ActionManager update。
     * @zh ActionManager 主循环。
     * @method update
     * @param {Number} dt delta time in seconds
     */
    update (dt: number): void {
        const locTargets = this._arrayTargets;
        let locCurrTarget: HashElement;
        for (let elt = 0; elt < locTargets.length; elt++) {
            this._currentTarget = locTargets[elt];
            locCurrTarget = this._currentTarget;

            const target = locCurrTarget.target;
            if (isCCObject(target) && !target.isValid) {
                this.removeAllActionsFromTarget(target);
                elt--;
                continue;
            }

            if (!locCurrTarget.paused && locCurrTarget.actions) {
                locCurrTarget.lock = true;
                // The 'actions' CCMutableArray may change while inside this loop.
                for (locCurrTarget.actionIndex = 0; locCurrTarget.actionIndex < locCurrTarget.actions.length; locCurrTarget.actionIndex++) {
                    locCurrTarget.currentAction = locCurrTarget.actions[locCurrTarget.actionIndex];
                    if (!locCurrTarget.currentAction) continue;

                    locCurrTarget.currentAction.step(dt);

                    if (locCurrTarget.currentAction && locCurrTarget.currentAction.isDone()) {
                        locCurrTarget.currentAction.stop();
                        const action = locCurrTarget.currentAction;
                        // Make currentAction nil to prevent removeAction from salvaging it.
                        locCurrTarget.currentAction = null;
                        this.removeAction(action);
                    }

                    locCurrTarget.currentAction = null;
                }
                locCurrTarget.lock = false;
            }
            // only delete currentTarget if no actions were scheduled during the cycle (issue #481)
            if (locCurrTarget.actions.length === 0) {
                if (target instanceof Node) {
                    this._unregisterNodeEvent(target);
                }

                if (this._deleteHashElement(locCurrTarget)) {
                    elt--;
                }
            }
        }
    }
}
