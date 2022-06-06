import { DEBUG } from 'internal:constants';
import {
    AnimationGraph, Layer, StateMachine, State, isAnimationTransition,
    SubStateMachine, EmptyState, EmptyStateTransition,
} from './animation-graph';
import { assertIsTrue, assertIsNonNullable } from '../../data/utils/asserts';
import { MotionEval, MotionEvalContext } from './motion';
import type { Node } from '../../scene-graph/node';
import { createEval } from './create-eval';
import { Value, VarInstance, TriggerResetMode } from './variable';
import { BindContext, bindOr, validateVariableExistence, validateVariableType, VariableType } from './parametric';
import { ConditionEval, TriggerCondition } from './condition';
import { VariableNotDefinedError, VariableTypeMismatchedError } from './errors';
import { MotionState } from './motion-state';
import { AnimationMask } from './animation-mask';
import { debug, warnID } from '../../platform/debug';
import { BlendStateBuffer, LayeredBlendStateBuffer } from '../../../3d/skeletal-animation/skeletal-animation-blending';
import { MAX_ANIMATION_LAYER } from '../../../3d/skeletal-animation/limits';
import { clearWeightsStats, getWeightsStats, graphDebug, graphDebugGroup, graphDebugGroupEnd, GRAPH_DEBUG_ENABLED } from './graph-debug';
import { AnimationClip } from '../animation-clip';
import type { AnimationController } from './animation-controller';
import { StateMachineComponent } from './state-machine-component';
import { InteractiveState } from './state';

export class AnimationGraphEval {
    private declare _layerEvaluations: LayerEval[];
    private _blendBuffer = new LayeredBlendStateBuffer();
    private _currentTransitionCache: TransitionStatus = {
        duration: 0.0,
        time: 0.0,
    };

    constructor (graph: AnimationGraph, root: Node, controller: AnimationController) {
        if (DEBUG) {
            if (graph.layers.length >= MAX_ANIMATION_LAYER) {
                throw new Error(
                    `Max layer count exceeds. `
                    + `Allowed: ${MAX_ANIMATION_LAYER}, actual: ${graph.layers.length}`,
                );
            }
        }

        for (const [name, variable] of graph.variables) {
            const varInstance = this._varInstances[name] = new VarInstance(variable.type, variable.value);
            if (variable.type === VariableType.TRIGGER) {
                const { resetMode } = variable;
                varInstance.resetMode = resetMode;
                if (resetMode === TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED) {
                    this._hasAutoTrigger = true;
                }
            }
        }

        const context: LayerContext = {
            controller,
            blendBuffer: this._blendBuffer,
            node: root,
            getVar: (id: string): VarInstance | undefined => this._varInstances[id],
            triggerResetFn: (name: string) => {
                this.setValue(name, false);
            },
        };

        const layerEvaluations = this._layerEvaluations = graph.layers.map((layer) => {
            const layerEval = new LayerEval(layer, {
                ...context,
                mask: layer.mask ?? undefined,
            });
            return layerEval;
        });

        // Set layer masks.
        const nLayers = layerEvaluations.length;
        for (let iLayer = 0; iLayer < nLayers; ++iLayer) {
            const mask = graph.layers[iLayer].mask;
            if (mask) {
                const excludeNodes = mask.filterDisabledNodes(context.node);
                this._blendBuffer.setMask(iLayer, excludeNodes);
            }
        }
    }

    public update (deltaTime: number) {
        const {
            _blendBuffer: blendBuffer,
            _layerEvaluations: layerEvaluations,
        } = this;
        graphDebugGroup(`New frame started.`);
        if (GRAPH_DEBUG_ENABLED) {
            clearWeightsStats();
        }
        const nLayers = layerEvaluations.length;
        for (let iLayer = 0; iLayer < nLayers; ++iLayer) {
            const layerEval = layerEvaluations[iLayer];
            layerEval.update(deltaTime);
            blendBuffer.commitLayerChanges(iLayer, layerEval.weight * layerEval.passthroughWeight);
        }
        if (this._hasAutoTrigger) {
            const { _varInstances: varInstances } = this;
            for (const varName in varInstances) {
                const varInstance = varInstances[varName];
                if (varInstance.type === VariableType.TRIGGER
                    && varInstance.resetMode === TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED) {
                    varInstance.value = false;
                }
            }
        }
        if (GRAPH_DEBUG_ENABLED) {
            graphDebug(`Weights: ${getWeightsStats()}`);
        }
        this._blendBuffer.apply();
        graphDebugGroupEnd();
    }

    public getVariables (): Iterable<Readonly<[string, Readonly<{ type: VariableType }>]>> {
        return Object.entries(this._varInstances);
    }

    public getCurrentStateStatus (layer: number): Readonly<MotionStateStatus> | null {
        return this._layerEvaluations[layer].getCurrentStateStatus();
    }

    public getCurrentClipStatuses (layer: number): Iterable<Readonly<ClipStatus>> {
        return this._layerEvaluations[layer].getCurrentClipStatuses();
    }

    public getCurrentTransition (layer: number): Readonly<TransitionStatus> | null {
        const {
            _layerEvaluations: layers,
            _currentTransitionCache: currentTransition,
        } = this;
        const isInTransition = layers[layer].getCurrentTransition(currentTransition);
        return isInTransition ? currentTransition : null;
    }

    public getNextStateStatus (layer: number): Readonly<MotionStateStatus> | null {
        return this._layerEvaluations[layer].getNextStateStatus();
    }

    public getNextClipStatuses (layer: number): Iterable<Readonly<ClipStatus>> {
        assertIsNonNullable(this.getCurrentTransition(layer), '!!this.getCurrentTransition(layer)');
        return this._layerEvaluations[layer].getNextClipStatuses();
    }

    public getValue (name: string) {
        const varInstance = this._varInstances[name];
        if (!varInstance) {
            return undefined;
        } else {
            return varInstance.value;
        }
    }

    public setValue (name: string, value: Value) {
        const varInstance = this._varInstances[name];
        if (!varInstance) {
            return;
        }
        varInstance.value = value;
    }

    public setLayerWeight (layerIndex: number, weight: number) {
        this._layerEvaluations[layerIndex].weight = weight;
    }

    private _varInstances: Record<string, VarInstance> = {};
    private _hasAutoTrigger = false;
}

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
     * @zh
     * 状态的规范化进度。
     */
    progress: number;
}

type TriggerResetFn = (name: string) => void;

interface LayerContext extends BindContext {
    controller: AnimationController;

    /**
     * The root node bind to the graph.
     */
    node: Node;

    /**
     * The blend buffer.
     */
    blendBuffer: BlendStateBuffer;

    /**
     * The mask applied to this layer.
     */
    mask?: AnimationMask;

    /**
     * TODO: A little hacky.
     * A function which resets specified trigger. This function can be stored.
     */
    triggerResetFn: TriggerResetFn;
}

class LayerEval {
    public declare name: string;

    public declare weight: number;

    public passthroughWeight = 1.0;

    constructor (layer: Layer, context: LayerContext) {
        this.name = layer.name;
        this._controller = context.controller;
        this.weight = layer.weight;
        const { entry, exit } = this._addStateMachine(layer.stateMachine, null, {
            ...context,
        }, layer.name);
        this._topLevelEntry = entry;
        this._topLevelExit = exit;
        this._currentNode = entry;
        this._resetTrigger = context.triggerResetFn;
    }

    /**
     * Indicates if this layer's top level graph reached its exit.
     */
    get exited () {
        return this._currentNode === this._topLevelExit;
    }

    public update (deltaTime: number) {
        if (!this.exited) {
            this._fromWeight = 1.0;
            this._toWeight = 0.0;
            this._eval(deltaTime);
            this._sample();
        }
    }

    public getCurrentStateStatus (): Readonly<MotionStateStatus> | null {
        const { _currentNode: currentNode } = this;
        if (currentNode.kind === NodeKind.animation) {
            return currentNode.getFromPortStatus();
        } else {
            return null;
        }
    }

    public getCurrentClipStatuses (): Iterable<ClipStatus> {
        const { _currentNode: currentNode } = this;
        if (currentNode.kind === NodeKind.animation) {
            return currentNode.getClipStatuses(this._fromWeight);
        } else {
            return emptyClipStatusesIterable;
        }
    }

    public getCurrentTransition (transitionStatus: TransitionStatus): boolean {
        const { _currentTransitionPath: currentTransitionPath } = this;
        if (currentTransitionPath.length !== 0) {
            const lastNode = currentTransitionPath[currentTransitionPath.length - 1];
            if (lastNode.to.kind !== NodeKind.animation) {
                return false;
            }
            const {
                duration,
                normalizedDuration,
            } = currentTransitionPath[0];
            const durationInSeconds = transitionStatus.duration = normalizedDuration
                ? duration * (this._currentNode.kind === NodeKind.animation ? this._currentNode.duration : 0.0)
                : duration;
            transitionStatus.time = this._transitionProgress * durationInSeconds;
            return true;
        } else {
            return false;
        }
    }

    public getNextStateStatus (): Readonly<MotionStateStatus> | null {
        assertIsTrue(
            this._currentTransitionToNode && this._currentTransitionToNode.kind !== NodeKind.empty,
            'There is no transition currently in layer.',
        );
        return this._currentTransitionToNode.getToPortStatus();
    }

    public getNextClipStatuses (): Iterable<ClipStatus> {
        const { _currentTransitionPath: currentTransitionPath } = this;
        const nCurrentTransitionPath = currentTransitionPath.length;
        assertIsTrue(nCurrentTransitionPath > 0, 'There is no transition currently in layer.');
        const to = currentTransitionPath[nCurrentTransitionPath - 1].to;
        assertIsTrue(to.kind === NodeKind.animation);
        return to.getClipStatuses(this._toWeight) ?? emptyClipStatusesIterable;
    }

    private declare _controller: AnimationController;
    private _nodes: NodeEval[] = [];
    private _topLevelEntry: NodeEval;
    private _topLevelExit: NodeEval;
    private _currentNode: NodeEval;
    private _currentTransitionToNode: EmptyStateEval | MotionStateEval | null = null;
    private _currentTransitionPath: TransitionEval[] = [];
    private _transitionProgress = 0;
    private declare _triggerReset: TriggerResetFn;
    private _fromWeight = 0.0;
    private _toWeight = 0.0;
    private _fromUpdated = false;
    private _toUpdated = false;

    private _addStateMachine (
        graph: StateMachine, parentStateMachineInfo: StateMachineInfo | null, context: LayerContext, __DEBUG_ID__: string,
    ): StateMachineInfo {
        const nodes = Array.from(graph.states());

        let entryEval: SpecialStateEval | undefined;
        let anyNode: SpecialStateEval | undefined;
        let exitEval: SpecialStateEval | undefined;

        const nodeEvaluations = nodes.map((node): NodeEval | null => {
            if (node instanceof MotionState) {
                return new MotionStateEval(node, context);
            } else if (node === graph.entryState) {
                return entryEval = new SpecialStateEval(node, NodeKind.entry, node.name);
            } else if (node === graph.exitState) {
                return exitEval = new SpecialStateEval(node, NodeKind.exit, node.name);
            } else if (node === graph.anyState) {
                return anyNode = new SpecialStateEval(node, NodeKind.any, node.name);
            } else if (node instanceof EmptyState) {
                return new EmptyStateEval(node);
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
                const subStateMachineInfo = this._addStateMachine(node.stateMachine, stateMachineInfo, context, `${__DEBUG_ID__}/${node.name}`);
                subStateMachineInfo.components = new InstantiatedComponents(node);
                return subStateMachineInfo;
            } else {
                return null;
            }
        });

        if (DEBUG) {
            for (const nodeEval of nodeEvaluations) {
                if (nodeEval) {
                    nodeEval.__DEBUG_ID__ = `${nodeEval.name}(from ${__DEBUG_ID__})`;
                }
            }
        }

        for (let iNode = 0; iNode < nodes.length; ++iNode) {
            const node = nodes[iNode];
            const outgoingTemplates = graph.getOutgoings(node);
            const outgoingTransitions: TransitionEval[] = [];

            let fromNode: NodeEval;
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

                let toNode: NodeEval;
                if (outgoingNode instanceof SubStateMachine) {
                    const subStateMachineInfo = subStateMachineInfos[iOutgoingNode];
                    assertIsNonNullable(subStateMachineInfo);
                    toNode = subStateMachineInfo.entry;
                } else {
                    const nodeEval = nodeEvaluations[iOutgoingNode];
                    assertIsNonNullable(nodeEval);
                    toNode = nodeEval;
                }

                const conditions = outgoing.conditions.map((condition) => condition[createEval](context));

                const transitionEval: TransitionEval = {
                    conditions,
                    to: toNode,
                    triggers: undefined,
                    duration: 0.0,
                    normalizedDuration: false,
                    destinationStart: 0.0,
                    exitCondition: 0.0,
                    exitConditionEnabled: false,
                };

                if (isAnimationTransition(outgoing)) {
                    transitionEval.duration = outgoing.duration;
                    transitionEval.normalizedDuration = outgoing.relativeDuration;
                    transitionEval.exitConditionEnabled = outgoing.exitConditionEnabled;
                    transitionEval.exitCondition = outgoing.exitCondition;
                    transitionEval.destinationStart = outgoing.destinationStart;
                } else if (outgoing instanceof EmptyStateTransition) {
                    transitionEval.duration = outgoing.duration;
                }

                transitionEval.conditions.forEach((conditionEval, iCondition) => {
                    const condition = outgoing.conditions[iCondition];
                    if (condition instanceof TriggerCondition && condition.trigger) {
                        // TODO: validates the existence of trigger?
                        (transitionEval.triggers ??= []).push(condition.trigger);
                    }
                });
                outgoingTransitions.push(transitionEval);
            }

            fromNode.outgoingTransitions = outgoingTransitions;
        }

        return stateMachineInfo;
    }

    /**
     * Updates this layer, return when the time piece exhausted or the graph reached exit state.
     * @param deltaTime The time piece to update.
     * @returns Remain time piece.
     */
    private _eval (deltaTime: Readonly<number>) {
        assertIsTrue(!this.exited);
        graphDebugGroup(`[Layer ${this.name}]: UpdateStart ${deltaTime}s`);

        const haltOnNonMotionState = this._continueDanglingTransition();
        if (haltOnNonMotionState) {
            return 0.0;
        }

        const MAX_ITERATIONS = 100;
        let passConsumed = 0.0;

        let remainTimePiece = deltaTime;
        for (let continueNextIterationForce = true, // Force next iteration even remain time piece is zero
            iterations = 0;
            continueNextIterationForce || remainTimePiece > 0.0;
        ) {
            continueNextIterationForce = false;

            if (iterations !== 0) {
                graphDebug(`Pass end. Consumed ${passConsumed}s, remain: ${remainTimePiece}s`);
            }

            if (iterations === MAX_ITERATIONS) {
                warnID(14000, MAX_ITERATIONS);
                break;
            }

            graphDebug(`Pass ${iterations} started.`);

            if (GRAPH_DEBUG_ENABLED) {
                passConsumed = 0.0;
            }

            ++iterations;

            // Update current transition if we're in transition.
            // If currently no transition, we simple fallthrough.
            if (this._currentTransitionPath.length > 0) {
                const currentUpdatingConsume = this._updateCurrentTransition(remainTimePiece);
                if (GRAPH_DEBUG_ENABLED) {
                    passConsumed = currentUpdatingConsume;
                }
                remainTimePiece -= currentUpdatingConsume;
                if (this._currentNode.kind === NodeKind.exit) {
                    break;
                }
                if (this._currentTransitionPath.length === 0) {
                    // If the update invocation finished the transition,
                    // We force restart the iteration
                    continueNextIterationForce = true;
                }
                continue;
            }

            const { _currentNode: currentNode } = this;

            const transitionMatch = this._matchCurrentNodeTransition(remainTimePiece);

            if (transitionMatch) {
                const {
                    transition,
                    requires: updateRequires,
                } = transitionMatch;

                graphDebug(`[SubStateMachine ${this.name}]: CurrentNodeUpdate: ${currentNode.name}`);
                if (GRAPH_DEBUG_ENABLED) {
                    passConsumed = updateRequires;
                }
                remainTimePiece -= updateRequires;

                if (currentNode.kind === NodeKind.animation) {
                    currentNode.updateFromPort(updateRequires);
                    this._fromUpdated = true;
                }

                const ranIntoNonMotionState = this._switchTo(transition);
                if (ranIntoNonMotionState) {
                    break;
                }

                continueNextIterationForce = true;
            } else { // If no transition matched, we update current node.
                graphDebug(`[SubStateMachine ${this.name}]: CurrentNodeUpdate: ${currentNode.name}`);
                if (currentNode.kind === NodeKind.animation) {
                    currentNode.updateFromPort(remainTimePiece);
                    this._fromUpdated = true;
                    // Animation play eat all times.
                    remainTimePiece = 0.0;
                } else {
                    // Happened when firstly entered the layer's top level entry
                    // and no further transition.
                    // I'm sure conscious of it's redundant with above statement, just emphasize.
                    remainTimePiece = 0.0;
                }
                if (GRAPH_DEBUG_ENABLED) {
                    passConsumed = remainTimePiece;
                }
                continue;
            }
        }

        graphDebug(`[SubStateMachine ${this.name}]: UpdateEnd`);
        graphDebugGroupEnd();

        if (this._fromUpdated && this._currentNode.kind === NodeKind.animation) {
            this._fromUpdated = false;
            this._currentNode.triggerFromPortUpdate(this._controller);
        }

        if (this._currentTransitionToNode && this._toUpdated && this._currentTransitionToNode.kind === NodeKind.animation) {
            this._toUpdated = false;
            this._currentTransitionToNode.triggerToPortUpdate(this._controller);
        }

        return remainTimePiece;
    }

    private _sample () {
        const {
            _currentNode: currentNode,
            _currentTransitionToNode: currentTransitionToNode,
            _fromWeight: fromWeight,
            _toWeight: toWeight,
        } = this;
        if (currentNode.kind === NodeKind.empty) {
            this.passthroughWeight = toWeight;
            if (currentTransitionToNode && currentTransitionToNode.kind === NodeKind.animation) {
                currentTransitionToNode.sampleToPort(1.0);
            }
        } else if (currentTransitionToNode && currentTransitionToNode.kind === NodeKind.empty) {
            this.passthroughWeight = fromWeight;
            if (currentNode.kind === NodeKind.animation) {
                currentNode.sampleFromPort(1.0);
            }
        } else {
            this.passthroughWeight = 1.0;
            if (currentNode.kind === NodeKind.animation) {
                currentNode.sampleFromPort(fromWeight);
            }
            if (currentTransitionToNode && currentTransitionToNode.kind === NodeKind.animation) {
                currentTransitionToNode.sampleToPort(toWeight);
            }
        }
    }

    /**
     * Searches for a transition which should be performed
     * if current node update for no more than `deltaTime`.
     * @param deltaTime
     * @returns
     */
    private _matchCurrentNodeTransition (deltaTime: Readonly<number>) {
        const currentNode = this._currentNode;

        let minDeltaTimeRequired = Infinity;
        let transitionRequiringMinDeltaTime: TransitionEval | null = null;

        const match0 = this._matchTransition(
            currentNode,
            currentNode,
            deltaTime,
            transitionMatchCacheRegular,
        );
        if (match0) {
            ({
                requires: minDeltaTimeRequired,
                transition: transitionRequiringMinDeltaTime,
            } = match0);
        }

        if (currentNode.kind === NodeKind.animation) {
            for (let ancestor: StateMachineInfo | null = currentNode.stateMachine;
                ancestor !== null;
                ancestor = ancestor.parent) {
                const anyMatch = this._matchTransition(
                    ancestor.any,
                    currentNode,
                    deltaTime,
                    transitionMatchCacheAny,
                );
                if (anyMatch && anyMatch.requires < minDeltaTimeRequired) {
                    ({
                        requires: minDeltaTimeRequired,
                        transition: transitionRequiringMinDeltaTime,
                    } = anyMatch);
                }
            }
        }

        const result = transitionMatchCache;

        if (transitionRequiringMinDeltaTime) {
            return result.set(transitionRequiringMinDeltaTime, minDeltaTimeRequired);
        }

        return null;
    }

    /**
     * Searches for a transition which should be performed
     * if specified node update for no more than `deltaTime`.
     * @param node
     * @param realNode
     * @param deltaTime
     * @returns
     */
    private _matchTransition (
        node: NodeEval, realNode: NodeEval, deltaTime: Readonly<number>, result: TransitionMatchCache,
    ): TransitionMatch | null {
        assertIsTrue(node === realNode || node.kind === NodeKind.any);
        const { outgoingTransitions } = node;
        const nTransitions = outgoingTransitions.length;
        let minDeltaTimeRequired = Infinity;
        let transitionRequiringMinDeltaTime: TransitionEval | null = null;
        for (let iTransition = 0; iTransition < nTransitions; ++iTransition) {
            const transition = outgoingTransitions[iTransition];
            const { conditions } = transition;
            const nConditions = conditions.length;

            // Handle empty condition case.
            if (nConditions === 0) {
                if (node.kind === NodeKind.entry || node.kind === NodeKind.exit) {
                    // These kinds of transition is definitely chosen.
                    return result.set(transition, 0.0);
                }
                if (!transition.exitConditionEnabled) {
                    // Invalid transition, ignored.
                    continue;
                }
            }

            let deltaTimeRequired = 0.0;

            if (realNode.kind === NodeKind.animation && transition.exitConditionEnabled) {
                const exitTime = realNode.duration * transition.exitCondition;
                deltaTimeRequired = Math.max(exitTime - realNode.fromPortTime, 0.0);
                if (deltaTimeRequired > deltaTime) {
                    continue;
                }
            }

            let satisfied = true;
            for (let iCondition = 0; iCondition < nConditions; ++iCondition) {
                const condition = conditions[iCondition];
                if (!condition.eval()) {
                    satisfied = false;
                    break;
                }
            }
            if (!satisfied) {
                continue;
            }

            if (deltaTimeRequired === 0.0) {
                // Exit condition is disabled or the exit condition is just 0.0.
                return result.set(transition, 0.0);
            }

            if (deltaTimeRequired < minDeltaTimeRequired) {
                minDeltaTimeRequired = deltaTimeRequired;
                transitionRequiringMinDeltaTime = transition;
            }
        }
        if (transitionRequiringMinDeltaTime) {
            return result.set(transitionRequiringMinDeltaTime, minDeltaTimeRequired);
        }
        return null;
    }

    /**
     * Try switch current node using specified transition.
     * @param transition The transition.
     * @returns If the transition finally ran into entry/exit state.
     */
    private _switchTo (transition: TransitionEval) {
        const { _currentNode: currentNode } = this;

        graphDebugGroup(`[SubStateMachine ${this.name}]: STARTED ${currentNode.name} -> ${transition.to.name}.`);

        const { _currentTransitionPath: currentTransitionPath } = this;

        this._consumeTransition(transition);
        currentTransitionPath.push(transition);

        const motionNode = this._matchTransitionPathUntilMotion();
        if (motionNode) {
            // Apply transitions
            this._doTransitionToMotion(motionNode);
            return false;
        } else {
            return true;
        }
    }

    /**
     * Called every frame(not every iteration).
     * Returns if we ran into an entry/exit node and still no satisfied transition matched this frame.
     */
    private _continueDanglingTransition () {
        const {
            _currentTransitionPath: currentTransitionPath,
        } = this;

        const lenCurrentTransitionPath = currentTransitionPath.length;

        if (lenCurrentTransitionPath === 0) {
            return false;
        }

        const lastTransition = currentTransitionPath[lenCurrentTransitionPath - 1];
        const tailNode = lastTransition.to;

        if (tailNode.kind !== NodeKind.animation && tailNode.kind !== NodeKind.empty) {
            const motionNode = this._matchTransitionPathUntilMotion();
            if (motionNode) {
                // Apply transitions
                this._doTransitionToMotion(motionNode);
                return false;
            } else {
                return true;
            }
        }

        return false;
    }

    private _matchTransitionPathUntilMotion () {
        const {
            _currentTransitionPath: currentTransitionPath,
        } = this;

        const lenCurrentTransitionPath = currentTransitionPath.length;
        assertIsTrue(lenCurrentTransitionPath !== 0);

        const lastTransition = currentTransitionPath[lenCurrentTransitionPath - 1];
        let tailNode = lastTransition.to;
        for (; tailNode.kind !== NodeKind.animation && tailNode.kind !== NodeKind.empty;) {
            const transitionMatch = this._matchTransition(
                tailNode,
                tailNode,
                0.0,
                transitionMatchCache,
            );
            if (!transitionMatch) {
                break;
            }
            const transition = transitionMatch.transition;
            this._consumeTransition(transition);
            currentTransitionPath.push(transition);
            tailNode = transition.to;
        }

        return tailNode.kind === NodeKind.animation || tailNode.kind === NodeKind.empty ? tailNode : null;
    }

    private _consumeTransition (transition: TransitionEval) {
        const { to } = transition;

        if (to.kind === NodeKind.entry) {
            // We're entering a state machine
            this._callEnterMethods(to);
        }
    }

    private _resetTriggersAlongThePath () {
        const { _currentTransitionPath: currentTransitionPath } = this;

        const nTransitions = currentTransitionPath.length;
        for (let iTransition = 0; iTransition < nTransitions; ++iTransition) {
            const transition = currentTransitionPath[iTransition];
            this._resetTriggersOnTransition(transition);
        }
    }

    private _doTransitionToMotion (targetNode: MotionStateEval | EmptyStateEval) {
        const {
            _currentTransitionPath: currentTransitionPath,
        } = this;

        assertIsTrue(currentTransitionPath.length !== 0);

        // Reset triggers
        this._resetTriggersAlongThePath();

        this._transitionProgress = 0.0;
        this._currentTransitionToNode = targetNode;
        this._toUpdated = false;

        if (targetNode.kind === NodeKind.animation) {
            const {
                destinationStart,
            } = currentTransitionPath[0];
            targetNode.resetToPort(destinationStart);
        }
        this._callEnterMethods(targetNode);
    }

    /**
     * Update current transition.
     * Asserts: `!!this._currentTransition`.
     * @param deltaTime Time piece.
     * @returns
     */
    private _updateCurrentTransition (deltaTime: number) {
        const {
            _currentTransitionPath: currentTransitionPath,
            _currentTransitionToNode: currentTransitionToNode,
        } = this;

        assertIsNonNullable(currentTransitionPath.length > 0);
        assertIsNonNullable(currentTransitionToNode);

        const currentTransition = currentTransitionPath[0];

        const {
            duration: transitionDuration,
            normalizedDuration,
        } = currentTransition;

        const fromNode = this._currentNode;
        const toNode = currentTransitionToNode;

        let contrib = 0.0;
        let ratio = 0.0;
        if (transitionDuration <= 0) {
            contrib = 0.0;
            ratio = 1.0;
        } else {
            assertIsTrue(fromNode.kind === NodeKind.animation || fromNode.kind === NodeKind.empty);
            const { _transitionProgress: transitionProgress } = this;
            const durationSeconds = fromNode.kind === NodeKind.empty
                ? transitionDuration
                : normalizedDuration ? transitionDuration * fromNode.duration : transitionDuration;
            const progressSeconds = transitionProgress * durationSeconds;
            const remain = durationSeconds - progressSeconds;
            assertIsTrue(remain >= 0.0);
            contrib = Math.min(remain, deltaTime);
            ratio = this._transitionProgress = (progressSeconds + contrib) / durationSeconds;
            assertIsTrue(ratio >= 0.0 && ratio <= 1.0);
        }

        const toNodeName = toNode?.name ?? '<Empty>';

        this._fromWeight = (1.0 - ratio);
        this._toWeight = ratio;

        const shouldUpdatePorts = contrib !== 0;
        const hasFinished = ratio === 1.0;

        if (fromNode.kind === NodeKind.animation && shouldUpdatePorts) {
            graphDebugGroup(`Update ${fromNode.name}`);
            fromNode.updateFromPort(contrib);
            this._fromUpdated = true;
            graphDebugGroupEnd();
        }

        if (toNode.kind === NodeKind.animation && shouldUpdatePorts) {
            graphDebugGroup(`Update ${toNode.name}`);
            toNode.updateToPort(contrib);
            this._toUpdated = true;
            graphDebugGroupEnd();
        }

        graphDebugGroupEnd();

        if (hasFinished) {
            // Transition done.
            graphDebug(`[SubStateMachine ${this.name}]: Transition finished:  ${fromNode.name} -> ${toNodeName}.`);

            this._callExitMethods(fromNode);
            // Exiting overrides the updating
            // Processed below.
            // this._fromUpdated = false;
            const { _currentTransitionPath: transitions } = this;
            const nTransition = transitions.length;
            for (let iTransition = 0; iTransition < nTransition; ++iTransition) {
                const { to } = transitions[iTransition];
                if (to.kind === NodeKind.exit) {
                    this._callExitMethods(to);
                }
            }
            this._fromUpdated = this._toUpdated;
            this._toUpdated = false;
            if (toNode.kind === NodeKind.animation) {
                toNode.finishTransition();
            }
            this._currentNode = toNode;
            this._currentTransitionToNode = null;
            this._currentTransitionPath.length = 0;
            // Make sure we won't suffer from precision problem
            this._fromWeight = 1.0;
            this._toWeight = 0.0;
        }

        return contrib;
    }

    private _resetTriggersOnTransition (transition: TransitionEval) {
        const { triggers } = transition;
        if (triggers) {
            const nTriggers = triggers.length;
            for (let iTrigger = 0; iTrigger < nTriggers; ++iTrigger) {
                const trigger = triggers[iTrigger];
                this._resetTrigger(trigger);
            }
        }
    }

    private _resetTrigger (name: string) {
        const { _triggerReset: triggerResetFn } = this;
        triggerResetFn(name);
    }

    private _callEnterMethods (node: NodeEval) {
        const { _controller: controller } = this;
        switch (node.kind) {
        default:
            break;
        case NodeKind.animation: {
            node.components.callMotionStateEnterMethods(controller, node.getToPortStatus());
            break;
        }
        case NodeKind.entry:
            node.stateMachine.components?.callStateMachineEnterMethods(controller);
            break;
        }
    }

    private _callExitMethods (node: NodeEval) {
        const { _controller: controller } = this;
        switch (node.kind) {
        default:
            break;
        case NodeKind.animation: {
            node.components.callMotionStateExitMethods(controller, node.getFromPortStatus());
            break;
        }
        case NodeKind.exit:
            node.stateMachine.components?.callStateMachineExitMethods(controller);
            break;
        }
    }
}

function createStateStatusCache (): MotionStateStatus {
    return {
        progress: 0.0,
    };
}

const emptyClipStatusesIterator: Iterator<ClipStatus> = Object.freeze({
    next () {
        return {
            done: true,
            value: undefined,
        };
    },
});

const emptyClipStatusesIterable: Iterable<ClipStatus> = Object.freeze({
    [Symbol.iterator] () {
        return emptyClipStatusesIterator;
    },
});

interface TransitionMatch {
    /**
     * The matched result.
     */
    transition: TransitionEval;

    /**
     * The after after which the transition can happen.
     */
    requires: number;
}

class TransitionMatchCache {
    public transition: TransitionMatch['transition'] | null = null;

    public requires = 0.0;

    public set (transition: TransitionMatch['transition'], requires: number) {
        this.transition = transition;
        this.requires = requires;
        return this as TransitionMatch;
    }
}

const transitionMatchCache = new TransitionMatchCache();

const transitionMatchCacheRegular = new TransitionMatchCache();

const transitionMatchCacheAny = new TransitionMatchCache();

enum NodeKind {
    entry, exit, any, animation,
    empty,
}

export class StateEval {
    /**
     * @internal
     */
    public declare __DEBUG_ID__?: string;

    public declare stateMachine: StateMachineInfo;

    constructor (node: State) {
        this.name = node.name;
    }

    public readonly name: string;

    public outgoingTransitions: readonly TransitionEval[] = [];
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

    public callMotionStateEnterMethods (controller: AnimationController, status: Readonly<MotionStateStatus>) {
        this._callMotionStateCallbackIfNonDefault('onMotionStateEnter', controller, status);
    }

    public callMotionStateUpdateMethods (controller: AnimationController, status: Readonly<MotionStateStatus>) {
        this._callMotionStateCallbackIfNonDefault('onMotionStateUpdate', controller, status);
    }

    public callMotionStateExitMethods (controller: AnimationController, status: Readonly<MotionStateStatus>) {
        this._callMotionStateCallbackIfNonDefault('onMotionStateExit', controller, status);
    }

    public callStateMachineEnterMethods (controller: AnimationController) {
        this._callStateMachineCallbackIfNonDefault('onStateMachineEnter', controller);
    }

    public callStateMachineExitMethods (controller: AnimationController) {
        this._callStateMachineCallbackIfNonDefault('onStateMachineExit', controller);
    }

    private declare _components: StateMachineComponent[];

    private _callMotionStateCallbackIfNonDefault<
        TMethodName extends StateMachineComponentMotionStateCallbackName
    > (
        methodName: TMethodName,
        controller: AnimationController,
        status: MotionStateStatus,
    ) {
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
    ) {
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
    entry: NodeEval;
    exit: NodeEval;
    any: NodeEval;
    components: InstantiatedComponents | null;
}

export class MotionStateEval extends StateEval {
    constructor (node: MotionState, context: LayerContext) {
        super(node);

        this._baseSpeed = node.speed;
        this._setSpeedMultiplier(1.0);

        if (node.speedMultiplierEnabled && node.speedMultiplier) {
            const speedMultiplierVarName = node.speedMultiplier;
            const varInstance = context.getVar(speedMultiplierVarName);
            if (validateVariableExistence(varInstance, speedMultiplierVarName)) {
                validateVariableType(varInstance.type, VariableType.FLOAT, speedMultiplierVarName);
                varInstance.bind(this._setSpeedMultiplier, this);
                const initialSpeedMultiplier = varInstance.value as number;
                this._setSpeedMultiplier(initialSpeedMultiplier);
            }
        }

        const sourceEvalContext: MotionEvalContext = {
            ...context,
        };
        const sourceEval = node.motion?.[createEval](sourceEvalContext) ?? null;
        if (sourceEval) {
            Object.defineProperty(sourceEval, '__DEBUG_ID__', { value: this.name });
        }
        this._source = sourceEval;
        this.components = new InstantiatedComponents(node);
    }

    public readonly kind = NodeKind.animation;

    public declare components: InstantiatedComponents;

    get duration () {
        return this._source?.duration ?? 0.0;
    }

    get fromPortTime () {
        return this._fromPort.progress * this.duration;
    }

    public updateFromPort (deltaTime: number) {
        this._fromPort.progress = calcProgressUpdate(
            this._fromPort.progress,
            this.duration,
            deltaTime * this._speed,
        );
    }

    public updateToPort (deltaTime: number) {
        this._toPort.progress = calcProgressUpdate(
            this._toPort.progress,
            this.duration,
            deltaTime * this._speed,
        );
    }

    public triggerFromPortUpdate (controller: AnimationController) {
        this.components.callMotionStateUpdateMethods(controller, this.getFromPortStatus());
    }

    public triggerToPortUpdate (controller: AnimationController) {
        this.components.callMotionStateUpdateMethods(controller, this.getToPortStatus());
    }

    public getFromPortStatus (): Readonly<MotionStateStatus> {
        const { statusCache: stateStatus } = this._fromPort;
        if (DEBUG) {
            stateStatus.__DEBUG_ID__ = this.name;
        }
        stateStatus.progress = normalizeProgress(this._fromPort.progress);
        return stateStatus;
    }

    public getToPortStatus (): Readonly<MotionStateStatus> {
        const { statusCache: stateStatus } = this._toPort;
        if (DEBUG) {
            stateStatus.__DEBUG_ID__ = this.name;
        }
        stateStatus.progress = normalizeProgress(this._toPort.progress);
        return stateStatus;
    }

    public resetToPort (at: number) {
        this._toPort.progress = at;
    }

    public finishTransition () {
        this._fromPort.progress = this._toPort.progress;
    }

    public sampleFromPort (weight: number) {
        this._source?.sample(this._fromPort.progress, weight);
    }

    public sampleToPort (weight: number) {
        this._source?.sample(this._toPort.progress, weight);
    }

    public getClipStatuses (baseWeight: number): Iterable<ClipStatus> {
        const { _source: source } = this;
        if (!source) {
            return emptyClipStatusesIterable;
        } else {
            return {
                [Symbol.iterator]: () => source.getClipStatuses(baseWeight),
            };
        }
    }

    private _source: MotionEval | null = null;
    private _baseSpeed = 1.0;
    private _speed = 1.0;
    private _fromPort: MotionEvalPort = {
        progress: 0.0,
        statusCache: createStateStatusCache(),
    };
    private _toPort: MotionEvalPort = {
        progress: 0.0,
        statusCache: createStateStatusCache(),
    };

    private _setSpeedMultiplier (value: number) {
        this._speed = this._baseSpeed * value;
    }
}

function calcProgressUpdate (currentProgress: number, duration: number, deltaTime: number) {
    if (duration === 0.0) {
        // TODO?
        return 0.0;
    }
    const progress = currentProgress + deltaTime / duration;
    return progress;
}

function normalizeProgress (progress: number) {
    return progress - Math.trunc(progress);
}

interface MotionEvalPort {
    progress: number;
    statusCache: MotionStateStatus;
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

export type NodeEval = MotionStateEval | SpecialStateEval | EmptyStateEval;

interface TransitionEval {
    to: NodeEval;
    duration: number;
    normalizedDuration: boolean;
    conditions: ConditionEval[];
    exitConditionEnabled: boolean;
    exitCondition: number;
    destinationStart: number;
    /**
     * Bound triggers, once this transition satisfied. All triggers would be reset.
     */
    triggers: string[] | undefined;
}

export type { VarInstance } from './variable';
