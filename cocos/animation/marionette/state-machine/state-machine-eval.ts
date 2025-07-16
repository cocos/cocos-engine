import { DEBUG } from 'internal:constants';
import {
    StateMachine, State, isAnimationTransition,
    SubStateMachine, EmptyState, EmptyStateTransition,
    ProceduralPoseState, ProceduralPoseTransition,
} from '../animation-graph';
import { MotionEval, MotionPort } from '../motion';
import { createEval } from '../create-eval';
import { BindContext, validateVariableExistence, validateVariableType, VariableType } from '../parametric';
import { ConditionEval, TriggerCondition } from './condition';
import { MotionState } from './motion-state';
import { warnID, assertIsTrue, assertIsNonNullable, Pool, approx, clamp01 } from '../../../core';
import { AnimationClip } from '../../animation-clip';
import type { AnimationController } from '../animation-controller';
import { StateMachineComponent } from './state-machine-component';
import { InteractiveState } from './state';
import {
    AnimationGraphBindingContext, AnimationGraphEvaluationContext,
    AnimationGraphUpdateContext, AnimationGraphUpdateContextGenerator,
    AnimationGraphSettleContext,
    TriggerResetter,
} from '../animation-graph-context';
import { blendPoseInto, Pose } from '../../core/pose';
import { PoseNode } from '../pose-graph/pose-node';
import { instantiatePoseGraph, InstantiatedPoseGraph } from '../pose-graph/instantiation';
import { ConditionEvaluationContext } from './condition/condition-base';
import { ReadonlyClipOverrideMap } from '../clip-overriding';
import { AnimationGraphEventBinding } from '../event/event-binding';

/**
 * The max transitions can be matched in single frame.
 *
 * @internal Only exported for test usage.
 */
export const MAX_TRANSITIONS_PER_FRAME = 16;

/**
 * @en
 * Runtime status of a transition.
 * @zh
 * 过渡的运行状态。
 */
export interface TransitionStatus {
    /**
     * @en
     * The duration of the transition.
     * @zh
     * 过渡的周期。
     */
    duration: number;

    /**
     * @en
     * The progress of the transition.
     * @zh
     * 过渡的进度。
     */
    time: number;
}

/**
 * @en
 * Runtime clip status of a motion state.
 * @zh
 * 动作状态中包含的剪辑的运行状态。
 */
export interface ClipStatus {
    /**
     * @en
     * The clip object.
     * @zh
     * 剪辑对象。
     */
    clip: AnimationClip;

    /**
     * @en
     * The clip's weight.
     * @zh
     * 剪辑的权重。
     */
    weight: number;
}

/**
 * @en
 * Runtime status of a motion state.
 * @zh
 * 动作状态的运行状态。
 */
export interface MotionStateStatus {
    /**
     * For testing.
     * TODO: remove it.
     * @internal
     */
    __DEBUG_ID__?: string;

    /**
     * @en
     * The normalized time of the state.
     * It would be the fraction part of `elapsed-time / duration` if elapsed time is non-negative,
     * and would be 1 plus the fraction part of `(elapsed-time / duration)` otherwise.
     * This is **NOT** the clip's progress if the state is not a clip motion or its wrap mode isn't loop.
     * @zh
     * 状态的规范化时间。
     * 如果流逝的时间是非负的，它就是 `流逝时间 / 周期` 的小数部分；否则，它是 `(流逝时间 / 周期)` 的小数部分加 1。
     * 它并不一定代表剪辑的进度，因为该状态可能并不是一个剪辑动作，或者它的循环模式并非循环。
     */
    progress: number;
}

class TopLevelStateMachineEvaluation {
    public declare name: string;

    public passthroughWeight = 1.0;

    constructor (
        stateMachine: StateMachine,
        name: string,
        context: AnimationGraphBindingContext,
    ) {
        this._additive = context.additive;
        this.name = name;
        this._controller = context.controller;
        const { entry, exit } = this._addStateMachine(
            stateMachine,
            null,
            context,
            name,
        );
        this._topLevelEntry = entry;
        this._topLevelExit = exit;
        this._currentNode = entry;
        entry.increaseActiveReference();
        this._resetTrigger = context.triggerResetter;
    }

    /**
     * Indicates if this layer's top level graph reached its exit.
     */
    get exited (): boolean {
        return this._currentNode === this._topLevelExit;
    }

    public settle (context: AnimationGraphSettleContext): void {
        const { _proceduralPoseStates: proceduralPoseStates } = this;
        const nProceduralPoseStates = proceduralPoseStates.length;
        for (let iState = 0; iState < nProceduralPoseStates; ++iState) {
            const state = proceduralPoseStates[iState];
            state.settle(context);
        }
    }

    public reenter (): void {
        // Known problem: no callbacks are triggered.

        for (const transition of this._activatedTransitions) {
            transition.destination.decreaseActiveReference();
            this._activatedTransitionPool.free(transition);
        }
        this._activatedTransitions.length = 0;

        this._topLevelEntry.increaseActiveReference();
        this._currentNode.decreaseActiveReference();
        this._currentNode = this._topLevelEntry;
    }

    public update (context: AnimationGraphUpdateContext): void {
        assertIsTrue(!this.exited);

        this._loopMatchTransitions();
        this._resetStateTickFlagsAndWeights();
        this._updateActivatedTransitions(context.deltaTime);
        this._commitStateUpdates(context);
    }

    public evaluate (context: AnimationGraphEvaluationContext): Pose {
        const sampled = this._sample(context);
        if (sampled) {
            return sampled;
        }
        return this._pushNullishPose(context);
    }

    public getCurrentStateStatus (): Readonly<MotionStateStatus> | null {
        const { _currentNode: currentNode } = this;
        if (currentNode.kind === NodeKind.animation) {
            return currentNode.getStatus();
        } else if (currentNode.kind === NodeKind.procedural) {
            return currentNode.getStatus();
        } else {
            return null;
        }
    }

    public getCurrentClipStatuses (): Iterable<Readonly<ClipStatus>> {
        const { _currentNode: currentNode } = this;
        if (currentNode.kind === NodeKind.animation) {
            return currentNode.getClipStatuses(currentNode.absoluteWeight);
        } else {
            return emptyClipStatusesIterable;
        }
    }

    public getCurrentTransition (transitionStatus: TransitionStatus): boolean {
        const { _activatedTransitions: activatedTransitions } = this;
        if (activatedTransitions.length === 0) {
            return false;
        }
        const lastActivatedTransition = activatedTransitions[activatedTransitions.length - 1];
        const baseDurationState = activatedTransitions.length === 1
            ? this._currentNode
            : activatedTransitions[activatedTransitions.length - 2].destination; // Else, the previous transition's destination state.
        const absoluteDuration = lastActivatedTransition.getAbsoluteDuration(baseDurationState);
        transitionStatus.duration = absoluteDuration;
        transitionStatus.time = lastActivatedTransition.normalizedElapsedTime * absoluteDuration;
        return true;
    }

    public getNextStateStatus (): Readonly<MotionStateStatus> | null {
        const { _activatedTransitions: activatedTransitions } = this;
        if (activatedTransitions.length === 0) {
            return null;
        }
        const lastState = activatedTransitions[activatedTransitions.length - 1].destination;
        switch (lastState.kind) {
        default:
            break;
        case NodeKind.procedural:
            return lastState.getStatus();
        case NodeKind.animation:
            return lastState.getStatus();
        }
        return null;
    }

    public getNextClipStatuses (): Iterable<Readonly<ClipStatus>> {
        const { _activatedTransitions: activatedTransitions } = this;
        if (activatedTransitions.length === 0) {
            return emptyClipStatusesIterable;
        }
        const lastActivatedTransition = activatedTransitions[activatedTransitions.length - 1];
        const lastState = lastActivatedTransition.destination;
        switch (lastState.kind) {
        default:
            return emptyClipStatusesIterable;
        case NodeKind.animation:
            return lastState.getClipStatuses(lastActivatedTransition.destination.absoluteWeight) ?? emptyClipStatusesIterable;
        }
    }

    public overrideClips (context: AnimationGraphBindingContext): void {
        const { _motionStates: motionStates } = this;
        const nMotionStates = motionStates.length;
        for (let iMotionState = 0; iMotionState < nMotionStates; ++iMotionState) {
            const node = motionStates[iMotionState];
            node.overrideClips(context);
        }
    }

    private declare _controller: AnimationController;
    /**
     * Preserved here for clip overriding.
     */
    private _motionStates: VMSMEval[] = [];
    /**
     * Preserved here for settle stage.
     */
    private readonly _proceduralPoseStates: ProceduralPoseStateEval[] = [];
    private _topLevelEntry: NodeEval;
    private _topLevelExit: NodeEval;
    private _currentNode: NodeEval;
    private _pendingTransitionPath: TransitionEval[] = [];
    private _activatedTransitions: ActivatedTransition[] = [];
    private _activatedTransitionPool = ActivatedTransition.createPool(4);
    private declare _triggerReset: TriggerResetter;
    private _updateContextGenerator = new AnimationGraphUpdateContextGenerator();
    private _conditionEvaluationContext = new ConditionEvaluationContextImpl();
    private _additive = false;

    private _addStateMachine (
        graph: StateMachine,
        parentStateMachineInfo: StateMachineInfo | null,
        context: AnimationGraphBindingContext,
        __DEBUG_ID__: string,
    ): StateMachineInfo {
        const nodes = Array.from(graph.states());

        let entryEval: SpecialStateEval | undefined;
        let anyNode: SpecialStateEval | undefined;
        let exitEval: SpecialStateEval | undefined;

        const nodeEvaluations = nodes.map((node): NodeEval | VMSMEval | null => {
            if (node instanceof MotionState) {
                const motionStateEval = new VMSMEval(node, context);
                this._motionStates.push(motionStateEval);
                return motionStateEval;
            } else if (node === graph.entryState) {
                return entryEval = new SpecialStateEval(node, NodeKind.entry, node.name);
            } else if (node === graph.exitState) {
                return exitEval = new SpecialStateEval(node, NodeKind.exit, node.name);
            } else if (node === graph.anyState) {
                return anyNode = new SpecialStateEval(node, NodeKind.any, node.name);
            } else if (node instanceof EmptyState) {
                return new EmptyStateEval(node);
            } else if (node instanceof ProceduralPoseState) {
                const stateEval = new ProceduralPoseStateEval(node, context);
                this._proceduralPoseStates.push(stateEval);
                return stateEval;
            } else {
                assertIsTrue(node instanceof SubStateMachine);
                return null;
            }
        });

        assertIsNonNullable(entryEval, 'Entry node is missing');
        assertIsNonNullable(exitEval, 'Exit node is missing');
        assertIsNonNullable(anyNode, 'Any node is missing');

        const stateMachineInfo: StateMachineInfo = {
            components: null,
            parent: parentStateMachineInfo,
            entry: entryEval,
            exit: exitEval,
            any: anyNode,
        };

        for (let iNode = 0; iNode < nodes.length; ++iNode) {
            const nodeEval = nodeEvaluations[iNode];
            if (nodeEval) {
                nodeEval.stateMachine = stateMachineInfo;
            }
        }

        const subStateMachineInfos = nodes.map((node) => {
            if (node instanceof SubStateMachine) {
                const subStateMachineInfo = this._addStateMachine(
                    node.stateMachine,
                    stateMachineInfo,
                    context,
                    `${__DEBUG_ID__}/${node.name}`,
                );
                subStateMachineInfo.components = new InstantiatedComponents(node);
                return subStateMachineInfo;
            } else {
                return null;
            }
        });

        if (DEBUG) {
            for (const nodeEval of nodeEvaluations) {
                if (nodeEval) {
                    nodeEval.setPrefix_debug(`${__DEBUG_ID__}/`);
                }
            }
        }

        for (let iNode = 0; iNode < nodes.length; ++iNode) {
            const node = nodes[iNode];
            const outgoingTemplates = graph.getOutgoings(node);

            let fromNode: NodeEval | VMSMEval;
            if (node instanceof SubStateMachine) {
                const subStateMachineInfo = subStateMachineInfos[iNode];
                assertIsNonNullable(subStateMachineInfo);
                fromNode = subStateMachineInfo.exit;
            } else {
                const nodeEval = nodeEvaluations[iNode];
                assertIsNonNullable(nodeEval);
                fromNode = nodeEval;
            }

            for (const outgoing of outgoingTemplates) {
                const outgoingNode = outgoing.to;
                const iOutgoingNode = nodes.findIndex((nodeTemplate) => nodeTemplate === outgoing.to);
                if (iOutgoingNode < 0) {
                    assertIsTrue(false, 'Bad animation data');
                }

                let toNode: NodeEval | VMSMEval;
                if (outgoingNode instanceof SubStateMachine) {
                    const subStateMachineInfo = subStateMachineInfos[iOutgoingNode];
                    assertIsNonNullable(subStateMachineInfo);
                    toNode = subStateMachineInfo.entry;
                } else {
                    const nodeEval = nodeEvaluations[iOutgoingNode];
                    assertIsNonNullable(nodeEval);
                    if (nodeEval instanceof VMSMEval) {
                        toNode = nodeEval.entry;
                    } else {
                        toNode = nodeEval;
                    }
                }

                const conditions = outgoing.conditions.map((condition) => condition[createEval](context));

                const transitionEval: TransitionEval = {
                    conditions,
                    to: toNode,
                    triggers: undefined,
                    duration: 0.0,
                    normalizedDuration: false,
                    destinationStart: 0.0,
                    relativeDestinationStart: false,
                    exitCondition: 0.0,
                    exitConditionEnabled: false,
                    activated: false,
                    startEventBinding: undefined,
                    endEventBinding: undefined,
                };

                if (isAnimationTransition(outgoing)
                    || outgoing instanceof EmptyStateTransition
                    || outgoing instanceof ProceduralPoseTransition
                ) {
                    transitionEval.duration = outgoing.duration;
                    transitionEval.destinationStart = outgoing.destinationStart;
                    transitionEval.relativeDestinationStart = outgoing.relativeDestinationStart;
                    if (outgoing.startEventBinding.isBound) {
                        transitionEval.startEventBinding = outgoing.startEventBinding;
                    }
                    if (outgoing.endEventBinding.isBound) {
                        transitionEval.endEventBinding = outgoing.endEventBinding;
                    }
                    if (isAnimationTransition(outgoing)) {
                        transitionEval.normalizedDuration = outgoing.relativeDuration;
                        transitionEval.exitConditionEnabled = outgoing.exitConditionEnabled;
                        transitionEval.exitCondition = outgoing.exitCondition;
                    }
                }

                transitionEval.conditions.forEach((conditionEval, iCondition) => {
                    const condition = outgoing.conditions[iCondition];
                    if (condition instanceof TriggerCondition && condition.trigger) {
                        // TODO: validates the existence of trigger?
                        (transitionEval.triggers ??= []).push(condition.trigger);
                    }
                });

                fromNode.addTransition(transitionEval);
            }
        }

        return stateMachineInfo;
    }

    /**
     * Loop match transitions util no match,
     * or util `MAX_TRANSITIONS_PER_FRAME` is reached(in case of circular transition formed or too long transition path).
     */
    private _loopMatchTransitions (): void {
        const {
            _pendingTransitionPath: pendingTransitionPath,
            _activatedTransitions: activatedTransitions,
        } = this;
        assertIsTrue(pendingTransitionPath.length === 0);

        let matchingSource = activatedTransitions.length === 0
            ? this._currentNode
            : activatedTransitions[activatedTransitions.length - 1].destination;
        for (let iterations = 0;
            /* The terminal condition is handled in loop body */;
            ++iterations
        ) {
            if (iterations >= MAX_TRANSITIONS_PER_FRAME) {
                let prettyPath = '';
                if (DEBUG) {
                    const lastDestination = activatedTransitions[activatedTransitions.length - 1].destination;
                    let loopFormPosition = -1;
                    for (let i = activatedTransitions.length - 2; i >= 0; --i) {
                        if (activatedTransitions[i].destination === lastDestination) {
                            loopFormPosition = i;
                            break;
                        }
                    }
                    prettyPath = `${this._currentNode.name} --> ... --> `;
                    const pathToPrint = loopFormPosition < 0
                        ? activatedTransitions.slice(-MAX_TRANSITIONS_PER_FRAME) // We didn't find a loop.
                        : activatedTransitions.slice(loopFormPosition); // Find a loop, print from last loop position.
                    prettyPath += `${pathToPrint.map((t) => t.destination.name).join(' --> ')}`;
                }
                warnID(14000, MAX_TRANSITIONS_PER_FRAME, prettyPath);
                break;
            }

            const transition = this._matchNextTransition(matchingSource);
            if (!transition) {
                break;
            }

            const destinationState = transition.to;
            const currentMatchingSource = matchingSource;
            matchingSource = destinationState;

            if (!isRealState(destinationState)) {
                pendingTransitionPath.push(transition);
                continue;
            }

            // We found a self transition A->A, the transition is meaningless and not allowed.
            if (destinationState === currentMatchingSource) {
                break;
            }

            this._activateTransition(pendingTransitionPath, transition);
            pendingTransitionPath.length = 0;
        }

        pendingTransitionPath.length = 0;
    }

    private _resetStateTickFlagsAndWeights (): void {
        const {
            _currentNode: currentNode,
            _activatedTransitions: activatedTransitions,
        } = this;

        currentNode.resetTickFlagsAndWeight();
        for (let iTransition = 0; iTransition < activatedTransitions.length; ++iTransition) {
            const { destination } = activatedTransitions[iTransition];
            destination.resetTickFlagsAndWeight();
        }
    }

    private _commitStateUpdates (parentContext: AnimationGraphUpdateContext): void {
        const {
            _currentNode: currentNode,
            _activatedTransitions: activatedTransitions,
            _updateContextGenerator: updateContextGenerator,
        } = this;

        // Update head state.
        this._commitStateUpdate(currentNode, parentContext);

        // Update states in transitions.
        for (let iTransition = 0; iTransition < activatedTransitions.length; ++iTransition) {
            const transition = activatedTransitions[iTransition];
            const { destination } = transition;
            this._commitStateUpdate(destination, parentContext);
        }
    }

    private _commitStateUpdate (state: NodeEval, parentContext: AnimationGraphUpdateContext): void {
        const {
            _updateContextGenerator: updateContextGenerator,
        } = this;
        if (state.testTickFlag(StateTickFlag.UPDATED)) { // Don't evaluate a pose more than once.
            return;
        }
        state.setTickFlag(StateTickFlag.UPDATED);
        if (state.kind === NodeKind.animation) {
            state.update(parentContext.deltaTime, this._controller);
        } else if (state.kind === NodeKind.procedural) {
            const updateContext = updateContextGenerator.generate(
                parentContext.deltaTime,
                parentContext.indicativeWeight * state.absoluteWeight,
            );
            state.update(updateContext);
        }
    }

    private _sample (context: AnimationGraphEvaluationContext): Pose | null {
        const {
            _currentNode: currentNode,
            _activatedTransitions: activatedTransitions,
        } = this;

        let passthroughWeight = 1.0;

        // Evaluate head state.
        let finalPose: Pose | null = null;
        let sumActualBlendedWeight = 0.0;
        if (currentNode.kind === NodeKind.animation) {
            finalPose = currentNode.evaluate(context) ?? this._pushNullishPose(context);
        } else if (currentNode.kind === NodeKind.procedural) {
            finalPose = currentNode.evaluate(context) ?? this._pushNullishPose(context);
        } else {
            passthroughWeight -= currentNode.absoluteWeight;
            finalPose = null;
        }
        if (finalPose) {
            sumActualBlendedWeight = currentNode.absoluteWeight;
        }
        currentNode.setTickFlag(StateTickFlag.EVALUATED);

        for (let iTransition = 0; iTransition < activatedTransitions.length; ++iTransition) {
            const transition = activatedTransitions[iTransition];
            const { destination } = transition;
            if (destination.testTickFlag(StateTickFlag.EVALUATED)) { // Don't evaluate a pose more than once.
                continue;
            }
            destination.setTickFlag(StateTickFlag.EVALUATED);
            const destAbsoluteWeight = destination.absoluteWeight;
            let destPose: Pose | null;
            if (destination.kind === NodeKind.empty) {
                passthroughWeight -= destAbsoluteWeight;
                destPose = null;
            } else {
                destPose = destination.evaluate(context) ?? this._pushNullishPose(context);
            }
            if (!destPose) { // We can't get a pose from transition destination.
                continue;
            }
            if (!finalPose) { // All previous states can't get a pose.
                finalPose = destPose;
            } else {
                sumActualBlendedWeight += destAbsoluteWeight;
                if (sumActualBlendedWeight) {
                    const t = destAbsoluteWeight / sumActualBlendedWeight;
                    blendPoseInto(finalPose, destPose, t);
                    context.popPose();
                } else {
                    finalPose = destPose;
                }
            }
        }

        this.passthroughWeight = passthroughWeight;

        return finalPose;
    }

    private _pushNullishPose (context: AnimationGraphEvaluationContext): Pose {
        return this._additive
            ? context.pushZeroDeltaPose()
            : context.pushDefaultedPose();
    }

    /**
     * Searches for a transition which should be performed.
     * @param sourceState The transition source state.
     * @returns
     */
    private _matchNextTransition (sourceState: NodeEval): TransitionEval | null {
        const transition = this._matchTransition(
            sourceState,
            sourceState,
        );
        if (transition) {
            return transition;
        }

        if (sourceState.kind === NodeKind.animation || sourceState.kind === NodeKind.procedural) {
            const transition = this._matchAnyScoped(sourceState);
            if (transition) {
                return transition;
            }
        }

        return null;
    }

    /**
     * @param realNode Is used:
     * - to determinate the starting state machine from where the any states are matched;
     * - so we can solve transitions' relative durations.
     */
    private _matchAnyScoped (realNode: VMSMInternalState | ProceduralPoseStateEval): TransitionEval | null {
        for (let ancestor: StateMachineInfo | null = realNode.stateMachine;
            ancestor !== null;
            ancestor = ancestor.parent) {
            const transition = this._matchTransition(
                ancestor.any,
                realNode,
            );
            if (transition) {
                return transition;
            }
        }
        return null;
    }

    /**
     * Searches for a transition which should be performed
     * if specified node updates for no more than `deltaTime` and less than `result.requires`.
     * We solve the relative durations of transitions based on duration of `realNode`.
     *
     * @returns The transition matched, or null if there's no matched transition.
     */
    private _matchTransition (node: NodeEval, realNode: NodeEval): TransitionEval | null {
        assertIsTrue(node === realNode || node.kind === NodeKind.any);

        const { _conditionEvaluationContext: conditionEvaluationContext } = this;
        conditionEvaluationContext.set(realNode);

        const { outgoingTransitions } = node;
        const nTransitions = outgoingTransitions.length;
        for (let iTransition = 0; iTransition < nTransitions; ++iTransition) {
            const transition = outgoingTransitions[iTransition];
            if (transition.activated) {
                continue;
            }

            const { conditions } = transition;
            const nConditions = conditions.length;

            // Handle empty condition case.
            if (nConditions === 0) {
                if (node.kind === NodeKind.entry || node.kind === NodeKind.exit) {
                    // These kinds of transition is definitely chosen.
                    if (DEBUG) {
                        conditionEvaluationContext.unset();
                    }
                    return transition;
                }
                if (!transition.exitConditionEnabled) {
                    // Invalid transition, ignored.
                    continue;
                }
            }

            if (realNode.kind === NodeKind.animation && transition.exitConditionEnabled) {
                const exitTime = realNode.duration * transition.exitCondition;
                const currentStateTime = realNode.time;
                if (currentStateTime < exitTime) {
                    break;
                }
            }

            let satisfied = true;
            for (let iCondition = 0; iCondition < nConditions; ++iCondition) {
                const condition = conditions[iCondition];
                if (!condition.eval(this._conditionEvaluationContext)) {
                    satisfied = false;
                    break;
                }
            }
            if (!satisfied) {
                continue;
            }

            // Arrive here means all conditions are satisfied,
            // and either the exit condition is disabled or the exit condition is just 0.0.
            if (DEBUG) {
                conditionEvaluationContext.unset();
            }
            return transition;
        }
        if (DEBUG) {
            conditionEvaluationContext.unset();
        }
        return null;
    }

    private _activateTransition (
        prefix: readonly TransitionEval[],
        lastTransition: TransitionEval,
    ): void {
        const destinationState = lastTransition.to;
        assertIsTrue(isRealState(destinationState));

        const activatedTransition = this._activatedTransitionPool.alloc();
        activatedTransition.reset(prefix, lastTransition);
        this._activatedTransitions.push(activatedTransition);

        // Reset triggers along the path.
        const nTransitions = activatedTransition.path.length;
        for (let iTransition = 0; iTransition < nTransitions; ++iTransition) {
            const transition = activatedTransition.path[iTransition];
            this._resetTriggersOnTransition(transition);
        }

        // Call enter hooks on detailed transitions.
        for (let iDetailedTransition = 0; iDetailedTransition < activatedTransition.path.length; ++iDetailedTransition) {
            const detailedTransition = activatedTransition.path[iDetailedTransition];
            // We're entering a state machine
            this._callEnterMethods(detailedTransition.to);
        }

        // Fire transition out event on source real state.
        assertIsTrue(this._activatedTransitions.length > 0);
        const previousState = this._activatedTransitions.length === 1 // this activating transition
            ? this._currentNode
            : this._activatedTransitions[this._activatedTransitions.length - 2].destination;
        if (previousState instanceof EventifiedStateEval) {
            if (previousState.transitionOutEventBinding) {
                this._emit(previousState.transitionOutEventBinding);
            }
        }

        // Fire start event on the transition.
        if (lastTransition.startEventBinding) {
            this._emit(lastTransition.startEventBinding);
        }

        // Fire transition in event on destination real target.
        if (destinationState instanceof EventifiedStateEval) {
            if (destinationState.transitionInEventBinding) {
                this._emit(destinationState.transitionInEventBinding);
            }
        }
    }

    /**
     * Update transitions, also update states within(includes the case of no transition).
     * @param deltaTime Time piece.
     * @returns
     */
    private _updateActivatedTransitions (deltaTime: number): void {
        const {
            _activatedTransitions: activatedTransitions,
        } = this;

        let iTransition = activatedTransitions.length - 1;

        // Asserts: while updating transition sequences,
        // the "update consume time" of the last transition, let's say _t_,
        // always not less than those of preceding transitions.
        // The reason is, if it's less than, means the last transition does not consume all the `deltaTime`,
        // which further means the last transition was done and
        // once the last transition was done, all preceding transitions are dropped.
        //
        // All states involved after updating shall also update _t_ times.

        let remainingWeight = 1.0;

        let lastTransitionIndex = iTransition;
        for (; iTransition >= 0; --iTransition) {
            const transition = activatedTransitions[iTransition];
            const sourceState = iTransition === 0
                ? this._currentNode
                : activatedTransitions[iTransition - 1].destination;
            transition.update(deltaTime, sourceState);

            // Once the transition is done, all previous transitions should be dropped
            // and we could break loop directly.
            if (transition.done) {
                this._dropActivatedTransitions(lastTransitionIndex);
                break;
            }

            // Allocate weight for the destination state.
            const destinationWeight = transition.normalizedElapsedTime * remainingWeight;
            transition.destination.increaseAbsoluteWeight(destinationWeight);
            remainingWeight *= (1.0 - transition.normalizedElapsedTime);

            lastTransitionIndex = iTransition - 1;
        }

        // Allocate remain weight to the latest current state.
        this._currentNode.increaseAbsoluteWeight(remainingWeight);
    }

    /**
     * Drops the transitions from `0` to `lastTransitionIndex` in `this._activatedTransitions`.
     * @note This methods may modifies the length of `this._activatedTransitions`.
     */
    private _dropActivatedTransitions (lastTransitionIndex: number): void {
        const {
            _activatedTransitions: activatedTransition,
            _activatedTransitionPool: activatedTransitionPool,
        } = this;
        assertIsTrue(lastTransitionIndex >= 0 && lastTransitionIndex < activatedTransition.length);

        const lenSubpath = lastTransitionIndex + 1;

        const lastTransition = activatedTransition[lastTransitionIndex];
        const newCurrentState = lastTransition.destination;

        // Call exist hooks, then destroy the transition instance.
        // Call end event binding on last transition.
        {
            assertIsTrue(lastTransition.path.length !== 0);
            const lastRealTransition = lastTransition.path[lastTransition.path.length - 1];
            if (lastRealTransition.endEventBinding) {
                this._emit(lastRealTransition.endEventBinding);
            }
        }
        this._callExitMethods(this._currentNode);
        for (let iTransition = 0; iTransition <= lastTransitionIndex; ++iTransition) {
            const transition = activatedTransition[iTransition];

            // Except last transition,
            // all transitions' should have their destination state decreasing active reference.
            // The last transition don't need to decrease
            // since it will become current node.
            if (iTransition !== lastTransitionIndex) {
                transition.destination.decreaseActiveReference();
            }

            // Call exit hooks on detailed transitions.
            // If this is NOT the last transition, all detailed transitions would be exit.
            // Otherwise, the last detailed transition is not included.
            const iLastExitingDetailedTransition = iTransition === lastTransitionIndex
                ? transition.path.length - 1
                : transition.path.length;
            for (let iDetailedTransition = 0; iDetailedTransition < iLastExitingDetailedTransition; ++iDetailedTransition) {
                const detailedTransition = transition.path[iDetailedTransition];
                this._callExitMethods(detailedTransition.to);
            }

            activatedTransitionPool.free(transition);
        }

        // Splice the subpath.
        if (lastTransitionIndex === activatedTransition.length - 1) {
            // Optimize for the usual case: there's only one transition.
            activatedTransition.length = 0;
        } else {
            // General case: this should be same with `activatedTransition.splice(firstTransitionIndex, lenSubpath)`.
            for (let iTransition = lastTransitionIndex + 1; iTransition < activatedTransition.length; ++iTransition) {
                activatedTransition[iTransition - lenSubpath] = activatedTransition[iTransition];
            }
            activatedTransition.length -= lenSubpath;
        }

        // Redefine the very first state.
        this._currentNode.decreaseActiveReference();
        this._currentNode = newCurrentState;
    }

    private _resetTriggersOnTransition (transition: TransitionEval): void {
        const { triggers } = transition;
        if (triggers) {
            const nTriggers = triggers.length;
            for (let iTrigger = 0; iTrigger < nTriggers; ++iTrigger) {
                const trigger = triggers[iTrigger];
                this._resetTrigger(trigger);
            }
        }
    }

    private _resetTrigger (name: string): void {
        const { _triggerReset: triggerResetFn } = this;
        triggerResetFn(name);
    }

    private _callEnterMethods (node: NodeEval): void {
        const { _controller: controller } = this;
        switch (node.kind) {
        default:
            break;
        case NodeKind.animation: {
            node.components.callMotionStateEnterMethods(controller, node.getStatus());
            break;
        }
        case NodeKind.entry:
            node.stateMachine.components?.callStateMachineEnterMethods(controller);
            break;
        }
    }

    private _callExitMethods (node: NodeEval): void {
        const { _controller: controller } = this;
        switch (node.kind) {
        default:
            break;
        case NodeKind.animation: {
            node.components.callMotionStateExitMethods(controller, node.getStatus());
            break;
        }
        case NodeKind.exit:
            node.stateMachine.components?.callStateMachineExitMethods(controller);
            break;
        }
    }

    private _emit (eventBinding: AnimationGraphEventBinding): void {
        eventBinding.emit(this._controller.node);
    }
}

export { TopLevelStateMachineEvaluation };

/**
 * A real state is a state on which the state machine can really reside.
 */
type RealState = VMSMInternalState | ProceduralPoseStateEval | EmptyStateEval;

function isRealState (stateEval: NodeEval): stateEval is RealState  {
    return stateEval.kind === NodeKind.animation
        || stateEval.kind === NodeKind.empty
        || stateEval.kind === NodeKind.procedural;
}

function createStateStatusCache (): MotionStateStatus {
    return {
        progress: 0.0,
    };
}

type ReadonlyClipStatus = Readonly<ClipStatus>;
const emptyClipStatusesIterator: Iterator<ReadonlyClipStatus> = {
    next (..._args: [] | [undefined]): IteratorResult<ReadonlyClipStatus> {
        return {
            done: true,
            value: undefined,
        };
    },
};

const emptyClipStatusesIterable: Iterable<ReadonlyClipStatus> = {
    [Symbol.iterator] () {
        return emptyClipStatusesIterator;
    },
};

enum NodeKind {
    entry, exit, any, animation,
    empty,
    procedural,
}

export class StateEval {
    /**
     * @internal
     */
    public declare __DEBUG_ID__?: string;

    public declare stateMachine: StateMachineInfo;

    constructor (node: { name: string }) {
        this.name = node.name;
    }

    public readonly name: string;

    public outgoingTransitions: TransitionEval[] = [];

    /**
     * The absolute weight of this state.
     */
    get absoluteWeight (): number {
        return this._absoluteWeight;
    }

    /**
     * The count which counts how many places referencing this state:
     * - If the state is activated as current state, the count increased.
     * - If the state is activated as a transition destination, the count increased.
     */
    get activeReferenceCount (): number {
        return this._activeReferenceCount;
    }

    public setPrefix_debug (prefix: string): void {
        this.__DEBUG_ID__ = `${prefix}${this.name}`;
    }

    public addTransition (transition: TransitionEval): void {
        this.outgoingTransitions.push(transition);
    }

    /**
     * Increases an active reference.
     */
    public increaseActiveReference (): void {
        if (this._activeReferenceCount === 0) {
            this._absoluteWeight = 0.0;
            this._tickFlags = 0;
        }
        ++this._activeReferenceCount;
    }

    /**
     * Decrease an active reference.
     */
    public decreaseActiveReference (): void {
        if (DEBUG) {
            this._checkActivated();
        }
        --this._activeReferenceCount;
    }

    public resetTickFlagsAndWeight (): void {
        this._checkActivated();
        this._absoluteWeight = 0.0;
        this._tickFlags = 0;
    }

    public increaseAbsoluteWeight (weight: number): void {
        this._absoluteWeight += weight;
    }

    public testTickFlag (flag: StateTickFlag): boolean {
        if (DEBUG) {
            this._checkActivated();
        }
        return !!(this._tickFlags & flag);
    }

    public setTickFlag (flag: StateTickFlag): void {
        if (DEBUG) {
            this._checkActivated();
        }
        assertIsTrue(!this.testTickFlag(flag), `Can not set ${StateTickFlag[flag]} since it has been set!`);
        this._tickFlags |= flag;
    }

    private _activeReferenceCount = 0;
    private _tickFlags = 0;
    private _absoluteWeight = 0.0;

    private _checkActivated (): void {
        assertIsTrue(this._activeReferenceCount > 0, `The state has not been activated`);
    }
}

class EventifiedStateEval extends StateEval {
    constructor (state: MotionState | ProceduralPoseState) {
        super(state);
        if (state.transitionInEventBinding.isBound) {
            this.transitionInEventBinding = state.transitionInEventBinding;
        }
        if (state.transitionOutEventBinding.isBound) {
            this.transitionOutEventBinding = state.transitionOutEventBinding;
        }
    }

    public transitionInEventBinding: AnimationGraphEventBinding | undefined = undefined;

    public transitionOutEventBinding: AnimationGraphEventBinding | undefined = undefined;
}

enum StateTickFlag {
    /**
     * The state has been updated in this tick?
     */
    UPDATED = 1,

    /**
     * The state has been evaluated in this tick?
     */
    EVALUATED = 2,
}

type StateMachineComponentMotionStateCallbackName = keyof Pick<
StateMachineComponent,
'onMotionStateEnter' | 'onMotionStateExit' | 'onMotionStateUpdate'
>;

type StateMachineComponentStateMachineCallbackName = keyof Pick<
StateMachineComponent,
'onStateMachineEnter' | 'onStateMachineExit'
>;

class InstantiatedComponents {
    constructor (node: InteractiveState) {
        this._components = node.instantiateComponents();
    }

    public callMotionStateEnterMethods (controller: AnimationController, status: Readonly<MotionStateStatus>): void {
        this._callMotionStateCallbackIfNonDefault('onMotionStateEnter', controller, status);
    }

    public callMotionStateUpdateMethods (controller: AnimationController, status: Readonly<MotionStateStatus>): void {
        this._callMotionStateCallbackIfNonDefault('onMotionStateUpdate', controller, status);
    }

    public callMotionStateExitMethods (controller: AnimationController, status: Readonly<MotionStateStatus>): void {
        this._callMotionStateCallbackIfNonDefault('onMotionStateExit', controller, status);
    }

    public callStateMachineEnterMethods (controller: AnimationController): void {
        this._callStateMachineCallbackIfNonDefault('onStateMachineEnter', controller);
    }

    public callStateMachineExitMethods (controller: AnimationController): void {
        this._callStateMachineCallbackIfNonDefault('onStateMachineExit', controller);
    }

    private declare _components: StateMachineComponent[];

    private _callMotionStateCallbackIfNonDefault<
        TMethodName extends StateMachineComponentMotionStateCallbackName
    > (
        methodName: TMethodName,
        controller: AnimationController,
        status: MotionStateStatus,
    ): void {
        const { _components: components } = this;
        const nComponents = components.length;
        for (let iComponent = 0; iComponent < nComponents; ++iComponent) {
            const component = components[iComponent];
            if (component[methodName] !== StateMachineComponent.prototype[methodName]) {
                component[methodName](controller, status);
            }
        }
    }

    private _callStateMachineCallbackIfNonDefault<
        TMethodName extends StateMachineComponentStateMachineCallbackName
    > (
        methodName: TMethodName,
        controller: AnimationController,
    ): void {
        const { _components: components } = this;
        const nComponents = components.length;
        for (let iComponent = 0; iComponent < nComponents; ++iComponent) {
            const component = components[iComponent];
            if (component[methodName] !== StateMachineComponent.prototype[methodName]) {
                component[methodName](controller);
            }
        }
    }
}

interface StateMachineInfo {
    parent: StateMachineInfo | null;
    entry: SpecialStateEval;
    exit: SpecialStateEval;
    any: SpecialStateEval;
    components: InstantiatedComponents | null;
}

/**
 * Track the evaluation of a virtual motion state-machine.
 */
class VMSMEval {
    constructor (state: MotionState, context: AnimationGraphBindingContext) {
        const name = state.name;

        this._baseSpeed = state.speed;
        this._setSpeedMultiplier(1.0);

        if (state.speedMultiplierEnabled && state.speedMultiplier) {
            const speedMultiplierVarName = state.speedMultiplier;
            const varInstance = context.getVar(speedMultiplierVarName);
            if (validateVariableExistence(varInstance, speedMultiplierVarName)) {
                validateVariableType(varInstance.type, VariableType.FLOAT, speedMultiplierVarName);
                varInstance.bind(this._setSpeedMultiplier, this);
                const initialSpeedMultiplier = varInstance.value as number;
                this._setSpeedMultiplier(initialSpeedMultiplier);
            }
        }

        const sourceEval = state.motion?.[createEval](context, false) ?? null;
        if (sourceEval) {
            Object.defineProperty(sourceEval, '__DEBUG_ID__', { value: name });
        }

        this._source = sourceEval;

        this._publicState = new VMSMInternalState(this, state, sourceEval?.createPort());
        this._privateState = new VMSMInternalState(this, state, sourceEval?.createPort());

        this.components = new InstantiatedComponents(state);
    }

    public declare components: InstantiatedComponents;

    get duration (): number {
        return this._source?.duration ?? 0.0;
    }

    get speed (): number {
        return this._speed;
    }

    get entry (): VMSMInternalState {
        return this._publicState;
    }

    get stateMachine (): StateMachineInfo {
        return this._stateMachine;
    }

    set stateMachine (value) {
        this._stateMachine = value;
        this._publicState.stateMachine = value;
        this._privateState.stateMachine = value;
    }

    public setPrefix_debug (prefix: string): void {
        this._publicState.setPrefix_debug(prefix);
        this._privateState.setPrefix_debug(prefix);
    }

    public addTransition (transition: Readonly<TransitionEval>): void {
        // If the transition is a self transition,
        // copy the transition but modify it so that it point to the private state.
        if (transition.to === this._publicState) {
            this._publicState.addTransition({
                ...transition,
                to: this._privateState,
            });
        } else {
            this._publicState.addTransition(transition);
        }
        this._privateState.addTransition(transition);
    }

    public getClipStatuses (baseWeight: number): Iterable<Readonly<ClipStatus>> {
        const { _source: source } = this;
        if (!source) {
            return emptyClipStatusesIterable;
        } else {
            return {
                [Symbol.iterator]: (): Iterator<ClipStatus, any, undefined> => source.getClipStatuses(baseWeight),
            };
        }
    }

    public overrideClips (context: AnimationGraphBindingContext): void {
        this._source?.overrideClips(context);
    }

    private _source: MotionEval | null = null;
    private _baseSpeed = 1.0;
    private _speed = 1.0;
    private _publicState: VMSMInternalState;
    private _privateState: VMSMInternalState;
    private declare _stateMachine: StateMachineInfo;
    private declare _debugId: string;

    private _setSpeedMultiplier (value: number): void {
        this._speed = this._baseSpeed * value;
    }
}

class VMSMInternalState extends EventifiedStateEval {
    public readonly kind = NodeKind.animation;

    constructor (
        container: VMSMEval,
        containerState: MotionState,
        port: MotionPort | undefined,
    ) {
        super(containerState);
        this._container = container;
        this._port = port;
    }

    get duration (): number {
        return this._container.duration;
    }

    get components (): InstantiatedComponents {
        return this._container.components;
    }

    get normalizedTime (): number {
        return this._progress;
    }

    get time (): number {
        return this._progress * this._container.duration;
    }

    public reenter (initialTimeNormalized: number): void {
        this._progress = initialTimeNormalized;
        this._port?.reenter();
    }

    public getStatus (): MotionStateStatus {
        const { _statusCache: stateStatus } = this;
        if (DEBUG) {
            stateStatus.__DEBUG_ID__ = this.name;
        }
        stateStatus.progress = normalizeProgress(this._progress);
        return stateStatus;
    }

    public getClipStatuses (baseWeight: number): Iterable<Readonly<ClipStatus>> {
        return this._container.getClipStatuses(baseWeight);
    }

    public update (deltaTime: number, controller: AnimationController): void {
        this._progress = calcProgressUpdate(
            this._progress,
            this.duration,
            deltaTime * this._container.speed,
        );
        this._container.components.callMotionStateUpdateMethods(controller, this.getStatus());
    }

    public evaluate (context: AnimationGraphEvaluationContext): Pose | null {
        return this._port?.evaluate(this._progress, context) ?? null;
    }

    private _container: VMSMEval;
    private _progress = 0.0;
    private _port: MotionPort | undefined;
    private readonly _statusCache: MotionStateStatus = createStateStatusCache();
}

function calcProgressUpdate (currentProgress: number, duration: number, deltaTime: number): number {
    if (duration === 0.0) {
        // TODO?
        return 0.0;
    }
    const progress = currentProgress + deltaTime / duration;
    return progress;
}

function normalizeProgress (progress: number): number {
    const signedFrac = progress - Math.trunc(progress);
    return signedFrac >= 0.0 ? signedFrac : (1.0 + signedFrac);
}

export class SpecialStateEval extends StateEval {
    constructor (node: State, kind: SpecialStateEval['kind'], name: string) {
        super(node);
        this.kind = kind;
    }

    public readonly kind: NodeKind.entry | NodeKind.exit | NodeKind.any;
}

export class EmptyStateEval extends StateEval {
    public readonly kind = NodeKind.empty;

    constructor (node: State) {
        super(node);
    }
}

class ProceduralPoseStateEval extends EventifiedStateEval {
    public readonly kind = NodeKind.procedural;

    public elapsedTime = 0.0;

    public readonly statusCache: MotionStateStatus = createStateStatusCache();

    public constructor (state: ProceduralPoseState, context: AnimationGraphBindingContext) {
        super(state);
        const instantiatedPoseGraph = instantiatePoseGraph(state.graph, context, true);
        instantiatedPoseGraph.bind(context);
        this._instantiatedPoseGraph = instantiatedPoseGraph;
        if (DEBUG) {
            this._statusCache.__DEBUG_ID__ = state.name;
        }
        this._statusCache.progress = 0.0;
    }

    public settle (context: AnimationGraphSettleContext): void {
        this._instantiatedPoseGraph.settle(context);
    }

    public reenter (): void {
        this._statusCache.progress = 0.0;
        this._instantiatedPoseGraph.reenter();
    }

    public update (context: AnimationGraphUpdateContext): void {
        this._elapsedTime += context.deltaTime;
        this._instantiatedPoseGraph.update(context);
    }

    public evaluate (context: AnimationGraphEvaluationContext): Pose | null {
        return this._instantiatedPoseGraph.evaluate(context) ?? null;
    }

    public getStatus (): MotionStateStatus {
        this._statusCache.progress = normalizeProgress(this._elapsedTime);
        return this._statusCache;
    }

    public countMotionTime (): number {
        return this._instantiatedPoseGraph.countMotionTime();
    }

    private _instantiatedPoseGraph: InstantiatedPoseGraph;

    private readonly _statusCache: MotionStateStatus = createStateStatusCache();

    private _elapsedTime = 0.0;
}

export type NodeEval = VMSMInternalState | SpecialStateEval | EmptyStateEval | ProceduralPoseStateEval;

interface TransitionEval {
    to: NodeEval;
    duration: number;
    normalizedDuration: boolean;
    conditions: ConditionEval[];
    exitConditionEnabled: boolean;
    exitCondition: number;
    destinationStart: number;
    relativeDestinationStart: boolean;
    /**
     * Bound triggers, once this transition satisfied. All triggers would be reset.
     */
    triggers: string[] | undefined;

    /**
     * Whether the transition is activated, if it has already been activated, it can not be activated(matched) again.
     */
    activated: boolean;

    startEventBinding: AnimationGraphEventBinding | undefined;
    endEventBinding: AnimationGraphEventBinding | undefined;
}

class ConditionEvaluationContextImpl implements ConditionEvaluationContext {
    public set (sourceState: NodeEval): void {
        this._sourceState = sourceState;
        if (isRealState(sourceState)) {
            assertIsTrue(sourceState.activeReferenceCount);
            // Cache the weight since it's cheap.
            this.sourceStateWeight = sourceState.absoluteWeight;
        } else {
            this.sourceStateWeight = 0.0;
        }
    }

    public unset (): void {
        this._sourceState = undefined;
        this.sourceStateWeight = 0.0;
    }

    public sourceStateWeight = 0.0;

    public get sourceStateMotionTimeNormalized (): number {
        const { _sourceState: sourceState } = this;
        assertIsTrue(
            sourceState
            && (sourceState.kind === NodeKind.animation || sourceState.kind === NodeKind.procedural)
            && sourceState.activeReferenceCount,
            `State motion time is only defined on activated motion states and procedural pose states.`,
        );
        switch (sourceState.kind) {
        case NodeKind.animation:
            return sourceState.normalizedTime;
        case NodeKind.procedural:
            return sourceState.countMotionTime();
        default:
            return 0.0;
        }
    }

    private _sourceState: NodeEval | undefined = undefined;
}

/**
 * Describes an activated transition to a **real state**.
 */
class ActivatedTransition {
    /**
     * The normalized time elapsed.
     */
    public normalizedElapsedTime = 0.0;

    /**
     * The detailed transitions along which the transition is activated.
     * At least has one.
     */
    public path: TransitionEval[] = [];

    public declare destination: RealState;

    get done (): boolean {
        return approx(this.normalizedElapsedTime, 1.0, 1e-6);
    }

    public getAbsoluteDuration (baseDurationState: NodeEval): number {
        return this._getAbsoluteDurationUnscaled(baseDurationState) * this._durationMultiplier;
    }

    public update (deltaTime: number, fromState: NodeEval): void {
        // If the transitions is not starting with a concrete state.
        // We can directly finish the transition.
        if (!isRealState(fromState)) {
            this.normalizedElapsedTime = 1.0;
            return;
        }
        const transitionDurationAbsolute = this.getAbsoluteDuration(fromState);
        let contrib = 0.0;
        if (transitionDurationAbsolute <= 0.0) {
            contrib = 0.0;
            this.normalizedElapsedTime = 1.0;
        } else {
            const elapsedTransitionTime = this.normalizedElapsedTime * transitionDurationAbsolute;
            const remainTransitionTime = transitionDurationAbsolute - elapsedTransitionTime;
            assertIsTrue(remainTransitionTime >= 0.0);
            contrib = Math.min(remainTransitionTime, deltaTime);
            const newTransitionProgress = clamp01((elapsedTransitionTime + contrib) / transitionDurationAbsolute);
            this.normalizedElapsedTime = newTransitionProgress;
            assertIsTrue(newTransitionProgress >= 0.0 && newTransitionProgress <= 1.0);
        }
    }

    public static createPool (initialCapacity: number): Pool<ActivatedTransition> {
        const destructor = !DEBUG
            ? undefined
            : (transitionInstance: ActivatedTransition): void => {
                transitionInstance.normalizedElapsedTime = Number.NaN;
            };

        const pool = new Pool<ActivatedTransition>(
            () => new ActivatedTransition(),
            initialCapacity,
            destructor,
        );

        return pool;
    }

    public reset (
        prefix: readonly TransitionEval[],
        lastTransition: TransitionEval,
    ): void {
        const destinationState = lastTransition.to;
        assertIsTrue(isRealState(destinationState));

        this.normalizedElapsedTime = 0.0;
        this.destination = destinationState;
        this.path = [...prefix, lastTransition];

        // Increase active reference on the state.
        const previousActiveReferenceCount = destinationState.activeReferenceCount;
        destinationState.increaseActiveReference();

        // If this is the initial activation, reenter the state.
        if (previousActiveReferenceCount === 0) {
            if (destinationState.kind === NodeKind.animation) {
                const {
                    destinationStart,
                    relativeDestinationStart: isRelativeDestinationStart,
                } = this.path[0];
                const destinationStartRatio = isRelativeDestinationStart
                    ? destinationStart
                    : destinationState.duration === 0
                        ? 0.0
                        : destinationStart / destinationState.duration;
                destinationState.reenter(destinationStartRatio);
            } else if (destinationState.kind === NodeKind.procedural) {
                destinationState.reenter();
            }
        }

        // More the existing destination weight, less the transition duration.
        assertIsTrue(destinationState.activeReferenceCount > 0);
        this._durationMultiplier = 1.0 - destinationState.absoluteWeight;
    }

    private _durationMultiplier = 1.0;

    private _getAbsoluteDurationUnscaled (baseDurationState: NodeEval): number {
        assertIsTrue(this.path.length !== 0);
        const {
            duration,
            normalizedDuration,
        } = this.path[0];
        if (!normalizedDuration) {
            return duration;
        }
        const baseDuration = baseDurationState.kind === NodeKind.animation
            ? baseDurationState.duration
            : 1.0;
        return baseDuration * duration;
    }
}
