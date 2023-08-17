/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

import { ccclass, editable, serializable } from 'cc.decorator';
import { DEBUG } from 'internal:constants';
import { js, clamp, assertIsNonNullable, assertIsTrue, EditorExtendable, shift, Vec3, Quat } from '../../core';
import type { Condition } from './state-machine/condition';
import { OwnedBy, assertsOwnedBy, own, markAsDangling, ownerSymbol } from './ownership';
import { createVariable, VariableDescription, VariableType, VariableTypeValueTypeMap } from './variable';
import { InvalidTransitionError } from './errors';
import { MotionState } from './state-machine/motion-state';
import { State, outgoingsSymbol, incomingsSymbol, InteractiveState } from './state-machine/state';
import { AnimationMask } from './animation-mask';
import { onAfterDeserializedTag } from '../../serialization/deserialize-symbols';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { AnimationGraphLike } from './animation-graph-like';
import { createInstanceofProxy, renameObjectProperty } from '../../core/utils/internal';
import { PoseGraph } from './pose-graph/pose-graph';
import { AnimationGraphEventBinding } from './event/event-binding';
import { instantiate } from '../../serialization';

export { State };

@ccclass(`${CLASS_NAME_PREFIX_ANIM}Transition`)
class Transition extends EditorExtendable implements OwnedBy<StateMachine>, Transition {
    declare [ownerSymbol]: StateMachine | undefined;

    /**
     * The transition source.
     */
    @serializable
    public from: State;

    /**
     * The transition target.
     */
    @serializable
    public to: State;

    /**
     * The transition condition.
     */
    @serializable
    public conditions: Condition[] = [];

    constructor (from: State, to: State, conditions?: Condition[]) {
        super();
        this.from = from;
        this.to = to;
        if (conditions) {
            this.conditions = conditions;
        }
    }

    public copyTo (that: Transition): void {
        that.conditions = this.conditions.map((condition) => condition.clone());
    }

    [ownerSymbol]: StateMachine | undefined;
}

type TransitionView = Omit<Transition, 'from' | 'to'> & {
    readonly from: Transition['from'];
    readonly to: Transition['to'];
};

export type { TransitionView as Transition };

export type TransitionInternal = Transition;

@ccclass(`${CLASS_NAME_PREFIX_ANIM}DurationalTransition`)
class DurationalTransition extends Transition {
    /**
     * @en The start time of (final) destination motion state when this transition starts.
     * Its unit is seconds if `relativeDestinationStart` is `false`,
     * Otherwise, its unit is the duration of destination motion state.
     * @zh 此过渡开始时，（最终）目标动作状态的起始时间。
     * 如果 `relativeDestinationStart`为 `false`，其单位是秒，否则其单位是目标动作状态的周期。
     */
    @serializable
    public destinationStart = 0.0;

    /**
     * @en Determines the unit of destination start time. See `destinationStart`.
     * @zh 决定了目标起始时间的单位。见 `destinationStart`。
     */
    @serializable
    public relativeDestinationStart = false;

    /**
     * @zh 过渡开始事件绑定，此处绑定的事件会在过渡开始时触发。
     * @en Transition start event binding. The event bound here will be triggered on the transition starts.
     */
    @serializable
    @editable
    public startEventBinding = new AnimationGraphEventBinding();

    /**
     * @zh 过渡结束事件绑定，此处绑定的事件会在过渡结束时触发。
     * @en Transition end event binding. The event bound here will be triggered on the transition ends.
     */
    @serializable
    @editable
    public endEventBinding = new AnimationGraphEventBinding();

    public copyTo (that: DurationalTransition): void {
        super.copyTo(that);
        that.destinationStart = this.destinationStart;
        that.relativeDestinationStart = this.relativeDestinationStart;
        this.startEventBinding.copyTo(that.startEventBinding);
        this.endEventBinding.copyTo(that.endEventBinding);
    }

    [ownerSymbol]: StateMachine | undefined;
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationTransition`)
class AnimationTransition extends DurationalTransition {
    /**
     * The transition duration.
     * The unit of the duration is the real duration of transition source
     * if `relativeDuration` is `true` or seconds otherwise.
     */
    @serializable
    public duration = 0.3;

    /**
     * Determines the unit of transition duration. See `duration`.
     */
    @serializable
    public relativeDuration = false;

    @serializable
    public exitConditionEnabled = true;

    get exitCondition (): number {
        return this._exitCondition;
    }

    set exitCondition (value) {
        assertIsTrue(value >= 0.0);
        this._exitCondition = value;
    }

    public copyTo (that: AnimationTransition): void {
        super.copyTo(that);
        that.duration = this.duration;
        that.relativeDuration = this.relativeDuration;
        that.exitConditionEnabled = this.exitConditionEnabled;
        that.exitCondition = this.exitCondition;
    }

    @serializable
    private _exitCondition = 1.0;
}

type AnimationTransitionView = Omit<AnimationTransition, 'from' | 'to'> & {
    readonly from: AnimationTransition['from'];
    readonly to: AnimationTransition['to'];
};

export type { AnimationTransitionView as AnimationTransition };

export function isAnimationTransition (transition: TransitionView): transition is AnimationTransitionView {
    return transition instanceof AnimationTransition;
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}EmptyState`)
export class EmptyState extends State {
    public declare __brand: 'EmptyState';
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}EmptyStateTransition`)
export class EmptyStateTransition extends DurationalTransition {
    /**
     * The transition duration, in seconds.
     */
    @serializable
    public duration = 0.3;

    public copyTo (that: EmptyStateTransition): void {
        super.copyTo(that);
        that.duration = this.duration;
    }
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}ProceduralPoseState`)
class ProceduralPoseState extends State {
    @serializable
    public graph = new PoseGraph();

    /**
     * @zh 状态进入事件绑定，此处绑定的事件会在状态机向该状态过渡时触发。
     * @en State entered event binding. The event bound here will be triggered
     * when the state machine starts to transition into this state.
     */
    @serializable
    @editable
    public transitionInEventBinding = new AnimationGraphEventBinding();

    /**
     * @zh 状态离开事件绑定，此处绑定的事件会在状态机从该状态离开时触发。
     * @en State left event binding. The event bound here will be triggered
     * when the state machine starts to transition out from this state.
     */
    @serializable
    @editable
    public transitionOutEventBinding = new AnimationGraphEventBinding();

    /**
     * // TODO: HACK
     * @internal
     */
    public __callOnAfterDeserializeRecursive (): void {
        this.graph.__callOnAfterDeserializeRecursive();
    }

    public copyTo (that: MotionState): ProceduralPoseState {
        super.copyTo(that);
        this.transitionInEventBinding.copyTo(that.transitionInEventBinding);
        this.transitionOutEventBinding.copyTo(that.transitionOutEventBinding);
        return this;
    }
}

type ProceduralPoseState_ = ProceduralPoseState;
const ProceduralPoseState_ = createInstanceofProxy(ProceduralPoseState);
export {
    ProceduralPoseState_ as ProceduralPoseState,
};

@ccclass(`${CLASS_NAME_PREFIX_ANIM}ProceduralPoseTransition`)
class ProceduralPoseTransition extends DurationalTransition {
    /**
     * The transition duration, in seconds.
     */
    @serializable
    public duration = 0.3;

    public copyTo (that: ProceduralPoseTransition): void {
        super.copyTo(that);
        that.duration = this.duration;
    }
}

type ProceduralPoseTransition_ = ProceduralPoseTransition;
const ProceduralPoseTransition_ = createInstanceofProxy(ProceduralPoseTransition);
export {
    ProceduralPoseTransition_ as ProceduralPoseTransition,
};

@ccclass('cc.animation.StateMachine')
export class StateMachine extends EditorExtendable {
    @serializable
    private _states: State[] = [];

    @serializable
    private _transitions: Transition[] = [];

    @serializable
    private _entryState: State;

    @serializable
    private _exitState: State;

    @serializable
    private _anyState: State;

    /**
     * @internal
     */
    public _allowEmptyStates = true;

    /**
     * // TODO: HACK
     * @internal
     */
    public __callOnAfterDeserializeRecursive (): void {
        this[onAfterDeserializedTag]();
        const nStates = this._states.length;
        for (let iState = 0; iState < nStates; ++iState) {
            const state = this._states[iState];
            if (state instanceof SubStateMachine) {
                state.stateMachine.__callOnAfterDeserializeRecursive();
            } else if (state instanceof ProceduralPoseState) {
                state.__callOnAfterDeserializeRecursive();
            } else if (state instanceof MotionState) {
                state.__callOnAfterDeserializeRecursive();
            }
        }
    }

    constructor (allowEmptyStates?: boolean) {
        super();
        this._allowEmptyStates = allowEmptyStates ?? false;
        this._entryState = this._addState(new State());
        this._entryState.name = 'Entry';
        this._exitState = this._addState(new State());
        this._exitState.name = 'Exit';
        this._anyState = this._addState(new State());
        this._anyState.name = 'Any';
    }

    public [onAfterDeserializedTag] (): void {
        this._states.forEach((state) => own(state, this));
        this._transitions.forEach((transition) => {
            transition.from[outgoingsSymbol].push(transition);
            transition.to[incomingsSymbol].push(transition);
        });
    }

    public get allowEmptyStates (): boolean {
        return this._allowEmptyStates;
    }

    /**
     * The entry state.
     */
    get entryState (): State {
        return this._entryState;
    }

    /**
     * The exit state.
     */
    get exitState (): State {
        return this._exitState;
    }

    /**
     * The any state.
     */
    get anyState (): State {
        return this._anyState;
    }

    /**
     * Gets an iterator to all states within this graph.
     * @returns The iterator.
     */
    public states (): Iterable<State> {
        return this._states;
    }

    /**
     * Gets an iterator to all transitions within this graph.
     * @returns The iterator.
     */
    public transitions (): Iterable<Transition> {
        return this._transitions;
    }

    /**
     * Gets the transitions between specified states.
     * @param from Transition source.
     * @param to Transition target.
     * @returns Iterator to the transitions
     */
    public getTransitionsBetween (from: State, to: State): Iterable<Transition> {
        assertsOwnedBy(from, this);
        assertsOwnedBy(to, this);
        return from[outgoingsSymbol].filter((transition) => transition.to === to);
    }

    /**
     * @en
     * Gets all transitions outgoing from specified state.
     * @zh
     * 获取从指定状态引出的所有过渡。
     * @param from @en The state. @zh 指定状态。
     * @returns @en Iterable to result transitions, in priority order. @zh 到结果过渡的迭代器，按优先级顺序。
     */
    public getOutgoings (from: State): Iterable<Transition> {
        assertsOwnedBy(from, this);
        return from[outgoingsSymbol];
    }

    /**
     * Gets all incoming transitions of specified state.
     * @param to The state.
     * @returns Result transitions.
     */
    public getIncomings (to: State): Iterable<Transition> {
        assertsOwnedBy(to, this);
        return to[incomingsSymbol];
    }

    /**
     * Adds a motion state into this state machine.
     * @returns The newly created motion.
     */
    public addMotion (): MotionState {
        return this._addState(new MotionState());
    }

    /**
     * Adds a sub state machine into this state machine.
     * @returns The newly created state machine.
     */
    public addSubStateMachine (): SubStateMachine {
        return this._addState(new SubStateMachine(this._allowEmptyStates));
    }

    /**
     * Adds an empty state into this state machine.
     * @returns The newly created empty state.
     */
    public addEmpty (): EmptyState {
        if (!this._allowEmptyStates) {
            throw new Error(`Empty states are now allowed in this state machine.`);
        }
        return this._addState(new EmptyState());
    }

    /**
     * @zh 向此状态机中添加一项姿势状态。
     * @en Adds an pose state into this state machine.
     * @returns @zh 新创建的姿势状态。 @en The newly created pose state.
     */
    public addProceduralPoseState (): ProceduralPoseState {
        return this._addState(new ProceduralPoseState());
    }

    /**
     * Removes specified state from this state machine.
     * @param state The state to remove.
     */
    public remove (state: State): void {
        assertsOwnedBy(state, this);

        if (state === this.entryState
            || state === this.exitState
            || state === this.anyState) {
            return;
        }

        this.eraseTransitionsIncludes(state);
        js.array.remove(this._states, state);

        markAsDangling(state);
    }

    /**
     * Connect two states.
     * @param from Source state.
     * @param to Target state.
     * @param condition The transition condition.
     */
    public connect (from: MotionState, to: State, conditions?: Condition[]): AnimationTransitionView;

    /**
     * Connect two states.
     * @param from Source state.
     * @param to Target state.
     * @param condition The transition condition.
     */
    public connect (from: EmptyState, to: State, conditions?: Condition[]): EmptyStateTransition;

    /**
     * Connect two states.
     * @param from Source state.
     * @param to Target state.
     * @param condition The transition condition.
     */
    public connect (from: ProceduralPoseState, to: State, conditions?: Condition[]): ProceduralPoseTransition;

    /**
     * Connect two states.
     * @param from Source state.
     * @param to Target state.
     * @param condition The transition condition.
     * @throws `InvalidTransitionError` if:
     * - the target state is entry or any, or
     * - the source state is exit.
     */
    public connect (from: State, to: State, conditions?: Condition[]): TransitionView;

    public connect (from: State, to: State, conditions?: Condition[]): TransitionView {
        assertsOwnedBy(from, this);
        assertsOwnedBy(to, this);

        if (to === this.entryState) {
            throw new InvalidTransitionError('to-entry');
        }
        if (to === this.anyState) {
            throw new InvalidTransitionError('to-any');
        }
        if (from === this.exitState) {
            throw new InvalidTransitionError('from-exit');
        }

        const transition = from instanceof MotionState || from === this._anyState
            ? new AnimationTransition(from, to, conditions)
            : from instanceof EmptyState
                ? new EmptyStateTransition(from, to, conditions)
                : from instanceof ProceduralPoseState
                    ? new ProceduralPoseTransition(from, to, conditions)
                    : new Transition(from, to, conditions);

        own(transition, this);
        this._transitions.push(transition);
        from[outgoingsSymbol].push(transition);
        to[incomingsSymbol].push(transition);

        return transition;
    }

    public disconnect (from: State, to: State): void {
        assertsOwnedBy(from, this);
        assertsOwnedBy(to, this);

        const oTransitions = from[outgoingsSymbol];
        const iTransitions = to[incomingsSymbol];
        const transitions = this._transitions;

        const oTransitionsToRemove = oTransitions
            .filter((oTransition) => oTransition.to === to);
        const nOTransitionToRemove = oTransitionsToRemove.length;
        for (let iOTransitionToRemove = 0;
            iOTransitionToRemove < nOTransitionToRemove;
            ++iOTransitionToRemove
        ) {
            const oTransition = oTransitionsToRemove[iOTransitionToRemove];
            js.array.remove(oTransitions, oTransition);
            assertIsTrue(
                js.array.remove(transitions, oTransition),
            );
            assertIsNonNullable(
                js.array.removeIf(iTransitions, (transition) => transition === oTransition),
            );
            markAsDangling(oTransition);
        }
    }

    public removeTransition (removal: Transition): void {
        assertIsTrue(
            js.array.remove(this._transitions, removal),
        );
        assertIsNonNullable(
            js.array.removeIf(removal.from[outgoingsSymbol], (transition) => transition === removal),
        );
        assertIsNonNullable(
            js.array.removeIf(removal.to[incomingsSymbol], (transition) => transition === removal),
        );
        markAsDangling(removal);
    }

    public eraseOutgoings (from: State): void {
        assertsOwnedBy(from, this);

        const oTransitions = from[outgoingsSymbol];
        for (let iOTransition = 0; iOTransition < oTransitions.length; ++iOTransition) {
            const oTransition = oTransitions[iOTransition];
            const to = oTransition.to;
            assertIsTrue(
                js.array.remove(this._transitions, oTransition),
            );
            assertIsNonNullable(
                js.array.removeIf(to[incomingsSymbol], (transition) => transition === oTransition),
            );
            markAsDangling(oTransition);
        }
        oTransitions.length = 0;
    }

    public eraseIncomings (to: State): void {
        assertsOwnedBy(to, this);

        const iTransitions = to[incomingsSymbol];
        for (let iITransition = 0; iITransition < iTransitions.length; ++iITransition) {
            const iTransition = iTransitions[iITransition];
            const from = iTransition.from;
            assertIsTrue(
                js.array.remove(this._transitions, iTransition),
            );
            assertIsNonNullable(
                js.array.removeIf(from[outgoingsSymbol], (transition) => transition === iTransition),
            );
            markAsDangling(iTransition);
        }
        iTransitions.length = 0;
    }

    public eraseTransitionsIncludes (state: State): void {
        this.eraseIncomings(state);
        this.eraseOutgoings(state);
    }

    /**
     * @en
     * Adjusts the priority of a transition.
     *
     * To demonstrate, one can imagine a transition array sorted by their priority.
     * - If `diff` is zero, nothing's gonna happen.
     * - Negative `diff` raises the priority:
     *   `diff` number of transitions originally having higher priority than `adjusting`
     *   will then have lower priority than `adjusting`.
     * - Positive `diff` reduce the priority:
     *   `|diff|` number of transitions originally having lower priority than `adjusting`
     *   will then have higher priority than `adjusting`.
     *
     * If the number of transitions indicated by `diff`
     * is more than the actual one, the actual number would be taken.
     * @zh
     * 调整过渡的优先级。
     *
     * 为了说明，可以想象一个由优先级排序的过渡数组。
     * - 如果 `diff` 是 0，无事发生。
     * - 负的 `diff` 会提升该过渡的优先级：原本优先于 `adjusting` 的 `diff` 条过渡的优先级会设置为低于 `adjusting`。
     * - 正的 `diff` 会降低该过渡的优先级：原本优先级低于 `adjusting` 的 `|diff|` 条过渡会设置为优先于 `adjusting`。
     *
     * 如果 `diff` 指示的过渡数量比实际多，则会使用实际数量。
     *
     * @param adjusting @en The transition to adjust the priority. @zh 需要调整优先级的过渡。
     * @param diff @en Indicates how to adjust the priority. @zh 指示如何调整优先级。
     */
    public adjustTransitionPriority (adjusting: Transition, diff: number): void {
        const { from } = adjusting;
        if (diff === 0) {
            return;
        }
        const outgoings = from[outgoingsSymbol];
        const iAdjusting = outgoings.indexOf(adjusting);
        assertIsTrue(iAdjusting >= 0);
        const iNew = clamp(iAdjusting + diff, 0, outgoings.length - 1);
        { // 1. Adjust the order in entire transition array, which is used for serialization.
            // We're doing a discrete movement: move without bother other outgoings from other motion
            const { _transitions: globalTransitions } = this;
            const adjustingIndexInGlobal = globalTransitions.indexOf(adjusting);
            assertIsTrue(adjustingIndexInGlobal >= 0);
            let lastPlaceholder = adjustingIndexInGlobal;
            if (iNew > iAdjusting) {
                // Shift right
                for (let iOutgoing = iAdjusting + 1; iOutgoing <= iNew; ++iOutgoing) {
                    const outgoing = outgoings[iOutgoing];
                    const indexInGlobal = globalTransitions.indexOf(outgoing);
                    assertIsTrue(indexInGlobal >= 0);
                    globalTransitions[lastPlaceholder] = outgoing;
                    lastPlaceholder = indexInGlobal;
                }
            } else if (iAdjusting > iNew) {
                // Shift left
                for (let iOutgoing = iAdjusting - 1; iOutgoing >= iNew; --iOutgoing) {
                    const outgoing = outgoings[iOutgoing];
                    const indexInGlobal = globalTransitions.indexOf(outgoing);
                    assertIsTrue(indexInGlobal >= 0);
                    globalTransitions[lastPlaceholder] = outgoing;
                    lastPlaceholder = indexInGlobal;
                }
            }
            globalTransitions[lastPlaceholder] = adjusting;
        }
        // eslint-disable-next-line no-lone-blocks
        { // 2. Adjust the order in outgoing array.
            shift(outgoings, iAdjusting, iNew);
        }
    }

    public copyTo (that: StateMachine): void {
        // Clear that first
        const thatStatesOld = that._states.filter((state) => {
            switch (state) {
            case that._entryState:
            case that._exitState:
            case that._anyState:
                return true;
            default:
                return false;
            }
        });
        for (const thatStateOld of thatStatesOld) {
            that.remove(thatStateOld);
        }

        const stateMap = new Map<State, State>();
        for (const state of this._states) {
            switch (state) {
            case this._entryState:
                stateMap.set(state, that._entryState);
                break;
            case this._exitState:
                stateMap.set(state, that._exitState);
                break;
            case this._anyState:
                stateMap.set(state, that._anyState);
                break;
            default:
                if (state instanceof MotionState
                    || state instanceof SubStateMachine
                    || state instanceof EmptyState
                    || state instanceof ProceduralPoseState
                ) {
                    if (state instanceof EmptyState && !that._allowEmptyStates) {
                        continue;
                    }
                    const thatState = instantiate(state);
                    that._addState(thatState);
                    stateMap.set(state, thatState);
                } else {
                    assertIsTrue(false);
                }
                break;
            }
        }
        for (const transition of this._transitions) {
            if (!that._allowEmptyStates) {
                if (transition.from instanceof EmptyState || transition.to instanceof EmptyState) {
                    continue;
                }
            }
            const thatFrom = stateMap.get(transition.from);
            const thatTo = stateMap.get(transition.to);
            assertIsTrue(thatFrom && thatTo);
            const thatTransition = that.connect(thatFrom, thatTo) as Transition;
            thatTransition.conditions = transition.conditions.map((condition) => condition.clone());
            if (thatTransition instanceof AnimationTransition) {
                assertIsTrue(transition instanceof AnimationTransition);
                transition.copyTo(thatTransition);
            } else if (thatTransition instanceof EmptyStateTransition) {
                assertIsTrue(transition instanceof EmptyStateTransition);
                transition.copyTo(thatTransition);
            } else if (thatTransition instanceof ProceduralPoseState) {
                assertIsTrue(transition instanceof ProceduralPoseState);
                transition.copyTo(thatTransition);
            } else {
                transition.copyTo(thatTransition);
            }
        }
    }

    public clone (): StateMachine {
        const that = new StateMachine(this._allowEmptyStates);
        this.copyTo(that);
        return that;
    }

    private _addState<T extends State> (state: T): T {
        own(state, this);
        this._states.push(state);
        return state;
    }
}

@ccclass('cc.animation.SubStateMachine')
export class SubStateMachine extends InteractiveState {
    constructor (allowEmptyStates?: boolean) {
        super();
        this._stateMachine = new StateMachine(allowEmptyStates);
    }

    get stateMachine (): StateMachine {
        return this._stateMachine;
    }

    public copyTo (that: SubStateMachine): void {
        super.copyTo(that);
        this._stateMachine.copyTo(that._stateMachine);
    }

    @serializable
    private _stateMachine: StateMachine;
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseGraphStash`)
class PoseGraphStash extends EditorExtendable {
    @serializable
    public graph = new PoseGraph();
}

export { PoseGraphStash };

@ccclass('cc.animation.Layer')
export class Layer implements OwnedBy<AnimationGraph> {
    [ownerSymbol]: AnimationGraph | undefined;

    @serializable
    private _stateMachine: StateMachine;

    @serializable
    public name = '';

    @serializable
    public weight = 1.0;

    @serializable
    public mask: AnimationMask | null = null;

    @serializable
    public additive = false;

    /**
     * // TODO: HACK
     * @internal
     */
    public __callOnAfterDeserializeRecursive (): void {
        this.stateMachine._allowEmptyStates = true;
        this.stateMachine.__callOnAfterDeserializeRecursive();
        for (const stashId in this._stashes) {
            const stash = this._stashes[stashId];
            stash.graph.__callOnAfterDeserializeRecursive();
        }
    }

    public stashes (): Iterable<Readonly<[string, PoseGraphStash]>> {
        return Object.entries(this._stashes);
    }

    public getStash (id: string): PoseGraphStash | undefined {
        return this._stashes[id];
    }

    public addStash (id: string): PoseGraphStash {
        return this._stashes[id] = new PoseGraphStash();
    }

    public removeStash (id: string): void {
        delete this._stashes[id];
    }

    public renameStash (id: string, newId: string): void {
        this._stashes = renameObjectProperty(this._stashes, id, newId);
    }

    /**
     * @marked_as_engine_private
     */
    constructor () {
        this._stateMachine = new StateMachine(true);
    }

    get stateMachine (): StateMachine {
        return this._stateMachine;
    }

    @serializable
    private _stashes: Record<string, PoseGraphStash> = {};
}

export enum LayerBlending {
    override,
    additive,
}

/**
 * @en
 * An opacity type which denotes what the animation graph seems like outside the engine.
 * @zh
 * 一个非透明的类型，它是动画图在引擎外部的表示。
 */
export interface AnimationGraphRunTime {
    /**
     * @internal
     */
    readonly __brand: 'AnimationGraph';
}

@ccclass('cc.animation.AnimationGraph')
export class AnimationGraph extends AnimationGraphLike implements AnimationGraphRunTime {
    public declare readonly __brand: 'AnimationGraph';

    @serializable
    private _layers: Layer[] = [];

    @serializable
    private _variables: Record<string, VariableDescription> = {};

    constructor () {
        super();
    }

    onLoaded (): void {
        const { _layers: layers } = this;
        const nLayers = layers.length;
        for (let iLayer = 0; iLayer < nLayers; ++iLayer) {
            layers[iLayer].__callOnAfterDeserializeRecursive();
        }
    }

    get layers (): readonly Layer[] {
        return this._layers;
    }

    get variables (): Iterable<[string, VariableDescription]> {
        return Object.entries(this._variables);
    }

    /**
     * Adds a layer.
     * @returns The new layer.
     */
    public addLayer (): Layer {
        const layer = new Layer();
        this._layers.push(layer);
        return layer;
    }

    /**
     * Removes a layer.
     * @param index Index to the layer to remove.
     */
    public removeLayer (index: number): void {
        js.array.removeAt(this._layers, index);
    }

    /**
     * Adjusts the layer's order.
     * @param index
     * @param newIndex
     */
    public moveLayer (index: number, newIndex: number): void {
        shift(this._layers, index, newIndex);
    }

    /**
     * Adds a variable into this graph.
     * @param name The variable's name.
     * @param type The variable's type.
     * @param initialValue Initial value.
     */
    public addVariable<TVariableType extends VariableType> (
        name: string, type: TVariableType, initialValue?: VariableTypeValueTypeMap[TVariableType],
    ): VariableDescription {
        const variable = createVariable(type, initialValue);
        this._variables[name] = variable;
        return variable;
    }

    public removeVariable (name: string): void {
        delete this._variables[name];
    }

    public getVariable (name: string): VariableDescription | undefined {
        return this._variables[name];
    }

    /**
     * @zh 重命名一个变量。注意，所有对该变量的引用都不会修改。
     * 如果变量的原始名称不存在或者新的名称已存在，此方法不会做任何事。
     * 变量在图中的顺序会保持不变。
     * @en Renames an variable. Note, this won't changes any reference to the variable.
     * If the original name of the variable doesn't exists or
     * the new name has already existed, this method won't do anything.
     * The variable's order in the graph is also retained.
     * @param name @zh 要重命名的变量的名字。 @en The name of the variable to be renamed.
     * @param newName @zh 新的名字。 @en New name.
     */
    public renameVariable (name: string, newName: string): void {
        this._variables = renameObjectProperty(this._variables, name, newName);
    }
}
