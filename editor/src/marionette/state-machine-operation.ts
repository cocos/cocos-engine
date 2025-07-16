import {
    EmptyStateTransition,
    State,
    StateMachine,
    Transition,
    isAnimationTransition,
    EmptyState,
    SubStateMachine,
    ProceduralPoseState,
} from "../../../cocos/animation/marionette/animation-graph";
import { cloneAnimationGraphEditorExtrasFrom } from "../../../cocos/animation/marionette/animation-graph-editor-extras-clone-helper";
import { MotionState } from "../../../cocos/animation/marionette/state-machine/motion-state";
import { assertIsTrue } from "../../../cocos/core/data/utils/asserts";
import { editorExtrasTag } from "../../../exports/base";
import { copyPoseGraphNodes, pastePoseGraphNodes } from "../../exports/new-gen-anim";

function copyTransitionConditions(lhs: Transition, rhs: Transition) {
    lhs.conditions = rhs.conditions.map((condition) => condition.clone());
}

function copyTransition<T extends Transition>(lhs: T, rhs: T) {
    if (isAnimationTransition(lhs)) {
        assertIsTrue(isAnimationTransition(rhs));
        rhs.copyTo(lhs);
    } else if (lhs instanceof EmptyStateTransition) {
        assertIsTrue(rhs instanceof EmptyStateTransition);
        rhs.copyTo(lhs);
    } else {
        rhs.copyTo(lhs);
    }
}

/**
 * Clones a state into same state machine.
 * @param stateMachine The state machine within which the motion state locates.
 * @param state The state.
 * @param includeTransitions If true, transitions are also cloned.
 * @returns The newly created state.
 * 
 * For each editor extras object attached on animation-graph-specific objects,
 * if the editor extras object has a method called `clone`,
 * that method would be called to perform a clone operation on that editor extras object.
 * The return value would be used as the clone result.
 * The method `clone` has the signature: `(host: EditorExtendableObject) => unknown`.
 * Otherwise, if no `clone` method provide, the new editor extras would be set to undefined.
 */
export function cloneState<TState extends MotionState | EmptyState | SubStateMachine | ProceduralPoseState>(
    stateMachine: StateMachine,
    state: TState,
    includeTransitions: boolean,
): TState;

/**
 * Clones a state into maybe another state machine.
 * @param stateMachine The state machine within which the motion state locates.
 * @param state The state.
 * @param targetStateMachine Target state machine
 * @returns The newly created state.
 * 
 * For each editor extras object attached on animation-graph-specific objects,
 * if the editor extras object has a method called `clone`,
 * that method would be called to perform a clone operation on that editor extras object.
 * The return value would be used as the clone result.
 * The method `clone` has the signature: `(host: EditorExtendableObject) => unknown`.
 * Otherwise, if no `clone` method provide, the new editor extras would be set to undefined.
 */
export function cloneState(
    stateMachine: StateMachine,
    state: MotionState | EmptyState | SubStateMachine | ProceduralPoseState,
    targetStateMachine: StateMachine,
): SubStateMachine;

export function cloneState(stateMachine: StateMachine, state: MotionState | EmptyState | SubStateMachine | ProceduralPoseState, includeTransitions: boolean | StateMachine) {
    const newStateOwner = typeof includeTransitions === 'boolean' ? stateMachine : includeTransitions;
    let newState: State;
    if (state instanceof MotionState) {
        const newMotionState = newState = newStateOwner.addMotion();
        state.copyTo(newMotionState);
    } else if (state instanceof EmptyState) {
        const newEmptyState = newState = newStateOwner.addEmpty();
        state.copyTo(newEmptyState);
    } else if (state instanceof ProceduralPoseState) {
        const newProceduralPoseState = newState = newStateOwner.addProceduralPoseState();
        newProceduralPoseState[editorExtrasTag] = cloneAnimationGraphEditorExtrasFrom(state);
        const copyInfo = copyPoseGraphNodes(state.graph, [...state.graph.nodes()]);
        pastePoseGraphNodes(newProceduralPoseState.graph, copyInfo);
    } else /* if (state instanceof SubStateMachine) */ {
        const newSubStateMachine = newState = newStateOwner.addSubStateMachine();
        state.copyTo(newSubStateMachine);
    }
    if (includeTransitions && stateMachine === newStateOwner) {
        const incomings = stateMachine.getIncomings(state);
        for (const incoming of incomings) {
            const newIncoming = stateMachine.connect(incoming.from, newState);
            copyTransition(newIncoming, incoming);
        }
        const outgoings = stateMachine.getOutgoings(state);
        for (const outgoing of outgoings) {
            const newOutgoing = stateMachine.connect(newState, outgoing.to);
            copyTransition(newOutgoing, outgoing);
        }
    }
    return newState;
}

/**
 * Turns a motion state into a new sub state machine.
 * @param stateMachine The state machine within which the motion state locates.
 * @param state The motion state.
 * @returns The newly created sub state machine.
 */
export function turnMotionStateIntoSubStateMachine(stateMachine: StateMachine, state: MotionState) {
    // Create new state.
    const subStateMachine = stateMachine.addSubStateMachine();
    subStateMachine.name = state.name;

    const newMotionState = subStateMachine.stateMachine.addMotion();
    state.copyTo(newMotionState);
    subStateMachine.stateMachine.connect(subStateMachine.stateMachine.entryState, newMotionState);

    // Connect.
    const incomings = stateMachine.getIncomings(state);
    for (const incoming of incomings) {
        const newIncoming = stateMachine.connect(incoming.from, subStateMachine);
        copyTransition(newIncoming, incoming);
    }
    const outgoings = stateMachine.getOutgoings(state);
    for (const outgoing of outgoings) {
        const newOutgoingInternal = subStateMachine.stateMachine.connect(
            newMotionState, subStateMachine.stateMachine.exitState);
        copyTransition(newOutgoingInternal, outgoing);
        const newOutgoingExternal = stateMachine.connect(
            subStateMachine, outgoing.to);
        copyTransitionConditions(newOutgoingExternal, outgoing);
    }

    // Remove old one.
    stateMachine.remove(state);

    return subStateMachine;
}
