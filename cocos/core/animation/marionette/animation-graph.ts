import { ccclass, serializable } from 'cc.decorator';
import { DEBUG } from 'internal:constants';
import { remove, removeAt, removeIf } from '../../utils/array';
import { assertIsNonNullable, assertIsTrue } from '../../data/utils/asserts';
import { Motion, MotionEval, MotionEvalContext } from './motion';
import type { Condition } from './condition';
import { Asset } from '../../assets';
import { OwnedBy, assertsOwnedBy, own, markAsDangling, ownerSymbol } from './ownership';
import { TriggerResetMode, Value, VariableType } from './variable';
import { InvalidTransitionError } from './errors';
import { createEval } from './create-eval';
import { MotionState } from './motion-state';
import { State, outgoingsSymbol, incomingsSymbol, InteractiveState } from './state';
import { AnimationMask } from './animation-mask';
import { EditorExtendable } from '../../data/editor-extendable';
import { array } from '../../utils/js';
import { move } from '../../algorithm/move';
import { onAfterDeserializedTag } from '../../data/deserialize-symbols';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { StateMachineComponent } from './state-machine-component';
import { clamp } from '../../math';

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

    [ownerSymbol]: StateMachine | undefined;
}

type TransitionView = Omit<Transition, 'from' | 'to'> & {
    readonly from: Transition['from'];
    readonly to: Transition['to'];
};

export type { TransitionView as Transition };

export type TransitionInternal = Transition;

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationTransition`)
class AnimationTransition extends Transition {
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

    /**
     * @en The start time of (final) destination motion state when this transition starts.
     * Its unit is the duration of destination motion state.
     * @zh 此过渡开始时，（最终）目标动作状态的起始时间。其单位是目标动作状态的周期。
     */
    @serializable
    public destinationStart = 0.0;

    get exitCondition () {
        return this._exitCondition;
    }

    set exitCondition (value) {
        assertIsTrue(value >= 0.0);
        this._exitCondition = value;
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
export class EmptyStateTransition extends Transition {
    /**
     * The transition duration, in seconds.
     */
    @serializable
    public duration = 0.3;
}

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
     * // TODO: HACK
     * @internal
     */
    public __callOnAfterDeserializeRecursive () {
        this[onAfterDeserializedTag]();
        const nStates = this._states.length;
        for (let iState = 0; iState < nStates; ++iState) {
            const state = this._states[iState];
            if (state instanceof SubStateMachine) {
                state.stateMachine.__callOnAfterDeserializeRecursive();
            }
        }
    }

    constructor () {
        super();
        this._entryState = this._addState(new State());
        this._entryState.name = 'Entry';
        this._exitState = this._addState(new State());
        this._exitState.name = 'Exit';
        this._anyState = this._addState(new State());
        this._anyState.name = 'Any';
    }

    public [onAfterDeserializedTag] () {
        this._states.forEach((state) => own(state, this));
        this._transitions.forEach((transition) => {
            transition.from[outgoingsSymbol].push(transition);
            transition.to[incomingsSymbol].push(transition);
        });
    }

    [createEval] (context: MotionEvalContext): MotionEval | null {
        throw new Error('Method not implemented.');
    }

    /**
     * The entry state.
     */
    get entryState () {
        return this._entryState;
    }

    /**
     * The exit state.
     */
    get exitState () {
        return this._exitState;
    }

    /**
     * The any state.
     */
    get anyState () {
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
        return this._addState(new SubStateMachine());
    }

    /**
     * Adds an empty state into this state machine.
     * @returns The newly created empty state.
     */
    public addEmpty () {
        return this._addState(new EmptyState());
    }

    /**
     * Removes specified state from this state machine.
     * @param state The state to remove.
     */
    public remove (state: State) {
        assertsOwnedBy(state, this);

        if (state === this.entryState
            || state === this.exitState
            || state === this.anyState) {
            return;
        }

        this.eraseTransitionsIncludes(state);
        remove(this._states, state);

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
                : new Transition(from, to, conditions);

        own(transition, this);
        this._transitions.push(transition);
        from[outgoingsSymbol].push(transition);
        to[incomingsSymbol].push(transition);

        return transition;
    }

    public disconnect (from: State, to: State) {
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
            remove(oTransitions, oTransition);
            assertIsTrue(
                remove(transitions, oTransition),
            );
            assertIsNonNullable(
                removeIf(iTransitions, (transition) => transition === oTransition),
            );
            markAsDangling(oTransition);
        }
    }

    public removeTransition (removal: Transition) {
        assertIsTrue(
            remove(this._transitions, removal),
        );
        assertIsNonNullable(
            removeIf(removal.from[outgoingsSymbol], (transition) => transition === removal),
        );
        assertIsNonNullable(
            removeIf(removal.to[incomingsSymbol], (transition) => transition === removal),
        );
        markAsDangling(removal);
    }

    public eraseOutgoings (from: State) {
        assertsOwnedBy(from, this);

        const oTransitions = from[outgoingsSymbol];
        for (let iOTransition = 0; iOTransition < oTransitions.length; ++iOTransition) {
            const oTransition = oTransitions[iOTransition];
            const to = oTransition.to;
            assertIsTrue(
                remove(this._transitions, oTransition),
            );
            assertIsNonNullable(
                removeIf(to[incomingsSymbol], (transition) => transition === oTransition),
            );
            markAsDangling(oTransition);
        }
        oTransitions.length = 0;
    }

    public eraseIncomings (to: State) {
        assertsOwnedBy(to, this);

        const iTransitions = to[incomingsSymbol];
        for (let iITransition = 0; iITransition < iTransitions.length; ++iITransition) {
            const iTransition = iTransitions[iITransition];
            const from = iTransition.from;
            assertIsTrue(
                remove(this._transitions, iTransition),
            );
            assertIsNonNullable(
                removeIf(from[outgoingsSymbol], (transition) => transition === iTransition),
            );
            markAsDangling(iTransition);
        }
        iTransitions.length = 0;
    }

    public eraseTransitionsIncludes (state: State) {
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
    public adjustTransitionPriority (adjusting: Transition, diff: number) {
        const { from } = adjusting;
        if (diff === 0) {
            return;
        }
        const outgoings = from[outgoingsSymbol];
        const iAdjusting = outgoings.indexOf(adjusting);
        assertIsTrue(iAdjusting >= 0);
        const iOver = clamp(iAdjusting + diff, 0, outgoings.length - 1);
        move(outgoings, iAdjusting, iOver);
    }

    public clone () {
        const that = new StateMachine();
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
                if (state instanceof MotionState || state instanceof SubStateMachine) {
                    const thatState = state.clone();
                    that._addState(thatState);
                    stateMap.set(state, thatState);
                } else {
                    assertIsTrue(false);
                }
                break;
            }
        }
        for (const transition of this._transitions) {
            const thatFrom = stateMap.get(transition.from);
            const thatTo = stateMap.get(transition.to);
            assertIsTrue(thatFrom && thatTo);
            const thatTransition = that.connect(thatFrom, thatTo) as Transition;
            thatTransition.conditions = transition.conditions.map((condition) => condition.clone());
            if (thatTransition instanceof AnimationTransition) {
                assertIsTrue(transition instanceof AnimationTransition);
                thatTransition.duration = transition.duration;
                thatTransition.exitConditionEnabled = transition.exitConditionEnabled;
                thatTransition.exitCondition = transition.exitCondition;
            }
        }
        return that;
    }

    private _addState<T extends State> (state: T) {
        own(state, this);
        this._states.push(state);
        return state;
    }
}

@ccclass('cc.animation.SubStateMachine')
export class SubStateMachine extends InteractiveState {
    get stateMachine () {
        return this._stateMachine;
    }

    public clone () {
        const that = new SubStateMachine();
        that._stateMachine = this._stateMachine.clone();
        return that;
    }

    @serializable
    private _stateMachine: StateMachine = new StateMachine();
}

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

    /**
     * @marked_as_engine_private
     */
    constructor () {
        this._stateMachine = new StateMachine();
    }

    get stateMachine () {
        return this._stateMachine;
    }
}

export enum LayerBlending {
    override,
    additive,
}

const TRIGGER_VARIABLE_FLAG_VALUE_START = 0;
const TRIGGER_VARIABLE_FLAG_VALUE_MASK = 1;
const TRIGGER_VARIABLE_FLAG_RESET_MODE_START = 1;
const TRIGGER_VARIABLE_FLAG_RESET_MODE_MASK = 6; // 0b110

// DO NOT CHANGE TO THIS VALUE. This is related to V3.5 migration.
const TRIGGER_VARIABLE_DEFAULT_FLAGS = 0;

// Let's ensure `0`'s meaning: `value: false, resetMode: TriggerSwitchMode: TriggerResetMode.AFTER_CONSUMED`
assertIsTrue((
    (0 << TRIGGER_VARIABLE_FLAG_VALUE_START)
    | (TriggerResetMode.AFTER_CONSUMED << TRIGGER_VARIABLE_FLAG_RESET_MODE_START)
) === TRIGGER_VARIABLE_DEFAULT_FLAGS);

type PlainVariableType = VariableType.FLOAT | VariableType.INTEGER | VariableType.BOOLEAN;

@ccclass('cc.animation.PlainVariable')
class PlainVariable {
    // TODO: we should not specify type here but due to de-serialization limitation
    // See: https://github.com/cocos-creator/3d-tasks/issues/7909
    @serializable
    private _type: PlainVariableType = VariableType.FLOAT;

    // Same as `_type`
    @serializable
    private _value: Value = 0.0;

    constructor (type?: PlainVariableType) {
        if (typeof type === 'undefined') {
            return;
        }

        this._type = type;
        switch (type) {
        default:
            break;
        case VariableType.FLOAT:
            this._value = 0;
            break;
        case VariableType.INTEGER:
            this._value = 0.0;
            break;
        case VariableType.BOOLEAN:
            this._value = false;
            break;
        }
    }

    get type () {
        return this._type;
    }

    get value () {
        return this._value;
    }

    set value (value) {
        if (DEBUG) {
            switch (this._type) {
            default:
                break;
            case VariableType.FLOAT:
                assertIsTrue(typeof value === 'number');
                break;
            case VariableType.INTEGER:
                assertIsTrue(Number.isInteger(value));
                break;
            case VariableType.BOOLEAN:
                assertIsTrue(typeof value === 'boolean');
                break;
            }
        }
        this._value = value;
    }
}

@ccclass('cc.animation.TriggerVariable')
class TriggerVariable implements BasicVariableDescription<VariableType.TRIGGER> {
    get type () {
        return VariableType.TRIGGER as const;
    }

    get value () {
        return !!((this._flags & TRIGGER_VARIABLE_FLAG_VALUE_MASK) >> TRIGGER_VARIABLE_FLAG_VALUE_START);
    }

    set value (value) {
        if (value) {
            this._flags |= (1 << TRIGGER_VARIABLE_FLAG_VALUE_START);
        } else {
            this._flags &= ~(1 << TRIGGER_VARIABLE_FLAG_VALUE_START);
        }
    }

    get resetMode () {
        return ((this._flags & TRIGGER_VARIABLE_FLAG_RESET_MODE_MASK) >> TRIGGER_VARIABLE_FLAG_RESET_MODE_START);
    }

    set resetMode (value: TriggerResetMode) {
        // Clear
        this._flags &= ~TRIGGER_VARIABLE_FLAG_RESET_MODE_MASK;
        // Set
        this._flags |= (value << TRIGGER_VARIABLE_FLAG_RESET_MODE_START);
    }

    // l -> h
    // value(1 bits) | reset_mode(2 bits)
    @serializable
    private _flags = TRIGGER_VARIABLE_DEFAULT_FLAGS;
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

interface BasicVariableDescription<TType> {
    readonly type: TType;

    value: TType extends VariableType.FLOAT ? number :
        TType extends VariableType.INTEGER ? number :
            TType extends VariableType.BOOLEAN ? boolean :
                TType extends VariableType.TRIGGER ? boolean :
                    never;
}

export type VariableDescription =
    | BasicVariableDescription<VariableType.FLOAT>
    | BasicVariableDescription<VariableType.INTEGER>
    | BasicVariableDescription<VariableType.BOOLEAN>
    | TriggerVariable;

@ccclass('cc.animation.AnimationGraph')
export class AnimationGraph extends Asset implements AnimationGraphRunTime {
    public declare readonly __brand: 'AnimationGraph';

    @serializable
    private _layers: Layer[] = [];

    @serializable
    private _variables: Record<string, VariableDescription> = {};

    constructor () {
        super();
    }

    onLoaded () {
        const { _layers: layers } = this;
        const nLayers = layers.length;
        for (let iLayer = 0; iLayer < nLayers; ++iLayer) {
            const layer = layers[iLayer];
            layer.stateMachine.__callOnAfterDeserializeRecursive();
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
    public addLayer () {
        const layer = new Layer();
        this._layers.push(layer);
        return layer;
    }

    /**
     * Removes a layer.
     * @param index Index to the layer to remove.
     */
    public removeLayer (index: number) {
        array.removeAt(this._layers, index);
    }

    /**
     * Adjusts the layer's order.
     * @param index
     * @param newIndex
     */
    public moveLayer (index: number, newIndex: number) {
        move(this._layers, index, newIndex);
    }

    /**
     * Adds a boolean variable.
     * @param name The variable's name.
     * @param value The variable's default value.
     */
    public addBoolean (name: string, value = false) {
        const variable = new PlainVariable(VariableType.BOOLEAN);
        variable.value = value;
        this._variables[name] = variable as unknown as BasicVariableDescription<VariableType.BOOLEAN>;
    }

    /**
     * Adds a floating variable.
     * @param name The variable's name.
     * @param value The variable's default value.
     */
    public addFloat (name: string, value = 0.0) {
        const variable = new PlainVariable(VariableType.FLOAT);
        variable.value = value;
        this._variables[name] = variable as unknown as BasicVariableDescription<VariableType.FLOAT>;
    }

    /**
     * Adds an integer variable.
     * @param name The variable's name.
     * @param value The variable's default value.
     */
    public addInteger (name: string, value = 0) {
        const variable = new PlainVariable(VariableType.INTEGER);
        variable.value = value;
        this._variables[name] = variable as unknown as BasicVariableDescription<VariableType.INTEGER>;
    }

    /**
     * Adds a trigger variable.
     * @param name The variable's name.
     * @param value The variable's default value.
     * @param resetMode The trigger's reset mode.
     */
    public addTrigger (name: string, value = false, resetMode = TriggerResetMode.AFTER_CONSUMED) {
        const variable = new TriggerVariable();
        variable.resetMode = resetMode;
        variable.value = value;
        this._variables[name] = variable;
    }

    public removeVariable (name: string) {
        delete this._variables[name];
    }

    public getVariable (name: string): VariableDescription | undefined {
        return this._variables[name] as VariableDescription | undefined;
    }
}
