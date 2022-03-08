import { ccclass, serializable } from 'cc.decorator';
import { DEBUG } from 'internal:constants';
import { remove, removeAt, removeIf } from '../../utils/array';
import { assertIsNonNullable, assertIsTrue } from '../../data/utils/asserts';
import { Motion, MotionEval, MotionEvalContext } from './motion';
import type { Condition } from './condition';
import { Asset } from '../../assets';
import { OwnedBy, assertsOwnedBy, own, markAsDangling, ownerSymbol } from './ownership';
import { Value } from './variable';
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
import { VariableType } from './parametric';

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
     * @legacyPublic
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
     * Gets all outgoing transitions of specified state.
     * @param to The state.
     * @returns Result transitions.
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

/**
 * @zh 布尔类型变量的重置模式，指示在哪些情况下将变量重置为 `false`。
 */
export enum TriggerResetMode {
    /**
     * @zh 在该变量被动画过渡消耗后自动重置。
     */
    AFTER_CONSUMED,

    /**
     * @zh 下一帧自动重置；在该变量被动画过渡消耗后也会自动重置。
     */
    NEXT_FRAME_OR_AFTER_CONSUMED,
}

const BOOLEAN_VARIABLE_FLAG_VALUE_START = 0;
const BOOLEAN_VARIABLE_FLAG_VALUE_MASK = 1;

const BOOLEAN_VARIABLE_FLAG_RESET_MODE_START = 1;
const BOOLEAN_VARIABLE_FLAG_RESET_MODE_MASK = 6; // 0b110

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
        return !!((this._flags & BOOLEAN_VARIABLE_FLAG_VALUE_MASK) >> BOOLEAN_VARIABLE_FLAG_VALUE_START);
    }

    set value (value) {
        if (value) {
            this._flags |= (1 << BOOLEAN_VARIABLE_FLAG_VALUE_START);
        } else {
            this._flags &= ~(1 << BOOLEAN_VARIABLE_FLAG_VALUE_START);
        }
    }

    get resetMode () {
        return ((this._flags & BOOLEAN_VARIABLE_FLAG_RESET_MODE_MASK) >> BOOLEAN_VARIABLE_FLAG_RESET_MODE_START);
    }

    set resetMode (value: TriggerResetMode) {
        this._flags &= ~(BOOLEAN_VARIABLE_FLAG_RESET_MODE_MASK << BOOLEAN_VARIABLE_FLAG_RESET_MODE_START);
        this._flags |= (value << BOOLEAN_VARIABLE_FLAG_RESET_MODE_START);
    }

    // l -> h
    // value(1 bits) | reset_mode(2 bits)
    @serializable
    private _flags =
    0 // value: false
        | TriggerResetMode.AFTER_CONSUMED << BOOLEAN_VARIABLE_FLAG_RESET_MODE_START
    ;
}

export interface AnimationGraphRunTime {
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
