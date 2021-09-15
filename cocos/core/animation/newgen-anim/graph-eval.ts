import { DEBUG } from 'internal:constants';
import { PoseGraph, Layer, PoseSubgraph, GraphNode, Transition, isPoseTransition } from './pose-graph';
import { assertIsTrue, assertIsNonNullable } from '../../data/utils/asserts';
import { PoseEval, PoseEvalContext } from './pose';
import type { Node } from '../../scene-graph/node';
import { createEval } from './create-eval';
import { Value } from './variable';
import { BindingHost, getPropertyBindingPoints } from './parametric';
import { ConditionEval, TriggerCondition } from './condition';
import { VariableNotDefinedError } from './errors';
import { PoseNode } from './pose-node';
import { SkeletonMask } from '../skeleton-mask';
import { debug, warnID } from '../../platform/debug';
import { BlendStateBuffer } from '../../../3d/skeletal-animation/skeletal-animation-blending';
import { clearWeightsStats, getWeightsStats, graphDebug, graphDebugGroup, graphDebugGroupEnd, GRAPH_DEBUG_ENABLED } from './graph-debug';
import { AnimationClip } from '../animation-clip';
import type { NewGenAnim } from './newgenanim-component';
import { StateMachineComponent } from './state-machine-component';
import { InteractiveGraphNode } from './graph-node';

export class PoseGraphEval {
    private _varRefMap: Record<string, VarRefs> = {};
    private declare _layerEvaluations: LayerEval[];
    private _blendBuffer = new BlendStateBuffer();
    private _currentTransitionCache: TransitionStatus = {
        duration: 0.0,
        time: 0.0,
    };

    constructor (graph: PoseGraph, root: Node, newGenAnim: NewGenAnim) {
        for (const [name, { value }] of graph.variables) {
            this._varRefMap[name] = {
                value,
                refs: [],
            };
        }

        const context: LayerContext = {
            newGenAnim,
            blendBuffer: this._blendBuffer,
            node: root,
            bind: this._bind.bind(this),
            triggerResetFn: (name: string) => {
                this.setValue(name, false);
            },
            getParam: (host: BindingHost, name: string) => {
                const varId = host.getPropertyBinding(name);
                if (!varId) {
                    return undefined;
                }
                const varRefs = this._varRefMap[varId];
                if (!varRefs) {
                    throw new VariableNotDefinedError(varId);
                }
                return varRefs.value;
            },
        };

        this._layerEvaluations = Array.from(graph.layers).map((layer) => {
            const layerEval = new LayerEval(layer, {
                ...context,
                mask: layer.mask ?? undefined,
            });
            return layerEval;
        });
    }

    public update (deltaTime: number) {
        graphDebugGroup(`New frame started.`);
        if (GRAPH_DEBUG_ENABLED) {
            clearWeightsStats();
        }
        for (const layerEval of this._layerEvaluations) {
            layerEval.update(deltaTime);
        }
        if (GRAPH_DEBUG_ENABLED) {
            graphDebug(`Weights: ${getWeightsStats()}`);
        }
        this._blendBuffer.apply();
        graphDebugGroupEnd();
    }

    public getCurrentPoseNodeStats (layer: number): Readonly<PoseNodeStats> | null {
        // TODO optimize object
        const stats: PoseNodeStats = { __DEBUG_ID__: '' };
        if (this._layerEvaluations[layer].getCurrentPoseNodeStats(stats)) {
            return stats;
        } else {
            return null;
        }
    }

    public getCurrentPoses (layer: number): Iterable<Readonly<PoseStatus>> {
        return this._layerEvaluations[layer].getCurrentPoses();
    }

    public getCurrentTransition (layer: number): Readonly<TransitionStatus> | null {
        const {
            _layerEvaluations: layers,
            _currentTransitionCache: currentTransition,
        } = this;
        const isInTransition = layers[layer].getCurrentTransition(currentTransition);
        return isInTransition ? currentTransition : null;
    }

    public getNextPoseNodeStats (layer: number): Readonly<PoseNodeStats> | null {
        // TODO optimize object
        const stats: PoseNodeStats = { __DEBUG_ID__: '' };
        if (this._layerEvaluations[layer].getNextPoseNodeStats(stats)) {
            return stats;
        } else {
            return null;
        }
    }

    public getNextPoses (layer: number): Iterable<Readonly<PoseStatus>> {
        assertIsNonNullable(this.getCurrentTransition(layer), '!!this.getCurrentTransition(layer)');
        return this._layerEvaluations[layer].getNextPoses();
    }

    public getValue (name: string) {
        const varRefs = this._varRefMap[name];
        if (!varRefs) {
            return undefined;
        } else {
            return varRefs.value;
        }
    }

    public setValue (name: string, value: Value) {
        const varRefs = this._varRefMap[name];
        if (!varRefs) {
            return;
        }

        varRefs.value = value;
        for (const { fn, args } of varRefs.refs) {
            fn(value, ...args);
        }
    }

    private _bind<T, ExtraArgs extends any[]> (varId: string, fn: (value: T, ...args: ExtraArgs) => void, args: ExtraArgs): T {
        const varRefs = this._varRefMap[varId];
        if (!varRefs) {
            throw new VariableNotDefinedError(varId);
        }
        varRefs.refs.push({
            fn: fn as (value: unknown, ...args: unknown[]) => T,
            args,
        });
        return varRefs.value as unknown as T;
    }
}

interface TransitionStatus {
    duration: number;
    time: number;
}

export interface PoseStatus {
    clip: AnimationClip;
    weight: number;
}

export interface PoseNodeStats {
    /**
     * For testing.
     * TODO: remove it.
     */
    __DEBUG_ID__: string | undefined;
}

type TriggerResetFn = (name: string) => void;

interface LayerContext {
    newGenAnim: NewGenAnim;

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
    mask?: SkeletonMask;

    getParam(host: BindingHost, name: string): unknown;

    bind<T, ExtraArgs extends any[]>(varId: string, fn: (value: T, ...args: ExtraArgs) => void, args: ExtraArgs): T;

    /**
     * TODO: A little hacky.
     * A function which resets specified trigger. This function can be stored.
     */
    triggerResetFn: TriggerResetFn;
}

class LayerEval {
    public declare name: string;

    constructor (layer: Layer, context: LayerContext) {
        this.name = layer.name;
        this._newGenAnim = context.newGenAnim;
        this._weight = layer.weight;
        const { entry, exit } = this._addSubgraph(layer.graph, null, {
            ...context,
        });
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

    public getCurrentPoseNodeStats (stats: PoseNodeStats): boolean {
        const { _currentNode: currentNode } = this;
        if (currentNode.kind === NodeKind.pose) {
            stats.__DEBUG_ID__ = currentNode.name;
            return true;
        } else {
            return false;
        }
    }

    public getCurrentPoses (): Iterable<PoseStatus> {
        const { _currentNode: currentNode } = this;
        if (currentNode.kind === NodeKind.pose) {
            return currentNode.getPoses(this._fromWeight);
        } else {
            return emptyPoseIterable;
        }
    }

    public getCurrentTransition (transitionStatus: TransitionStatus): boolean {
        const { _currentTransitionPath: currentTransitionPath } = this;
        if (currentTransitionPath.length !== 0) {
            const currentTransition = currentTransitionPath[0];
            transitionStatus.duration = currentTransition.duration;
            transitionStatus.time = this._transitionProgress;
            return true;
        } else {
            return false;
        }
    }

    public getNextPoseNodeStats (stats: PoseNodeStats): boolean {
        assertIsTrue(this._currentTransitionToNode, 'There is no transition currently in layer.');
        stats.__DEBUG_ID__ = this._currentTransitionToNode.name;
        return true;
    }

    public getNextPoses (): Iterable<PoseStatus> {
        const { _currentTransitionPath: currentTransitionPath } = this;
        const nCurrentTransitionPath = currentTransitionPath.length;
        assertIsTrue(nCurrentTransitionPath > 0, 'There is no transition currently in layer.');
        const to = currentTransitionPath[nCurrentTransitionPath - 1].to;
        assertIsTrue(to.kind === NodeKind.pose);
        return to.getPoses(this._toWeight) ?? emptyPoseIterable;
    }

    private declare _newGenAnim: NewGenAnim;
    private _weight: number;
    private _nodes: NodeEval[] = [];
    private _topLevelEntry: NodeEval;
    private _topLevelExit: NodeEval;
    private _currentNode: NodeEval;
    private _currentTransitionToNode: PoseNodeEval | null = null;
    private _currentTransitionPath: TransitionEval[] = [];
    private _transitionProgress = 0;
    private declare _triggerReset: TriggerResetFn;
    private _fromWeight = 0.0;
    private _toWeight = 0.0;

    private _addSubgraph (graph: PoseSubgraph, parentSubgraphInfo: SubgraphInfo | null, context: LayerContext): {
        entry: NodeEval;
        exit: NodeEval;
    } {
        const nodes = Array.from(graph.nodes());

        let entryEval: SpecialNodeEval | undefined;
        let anyNode: SpecialNodeEval | undefined;
        let exitEval: SpecialNodeEval | undefined;

        const nodeEvaluations = nodes.map((node): NodeEval | null => {
            if (node instanceof PoseNode) {
                return new PoseNodeEval(node, context);
            } else if (node === graph.entryNode) {
                return entryEval = new SpecialNodeEval(node, NodeKind.entry, node.name);
            } else if (node === graph.exitNode) {
                return exitEval = new SpecialNodeEval(node, NodeKind.exit, node.name);
            }  else if (node === graph.anyNode) {
                return anyNode = new SpecialNodeEval(node, NodeKind.any, node.name);
            } else {
                assertIsTrue(node instanceof PoseSubgraph);
                return null;
            }
        });

        assertIsNonNullable(entryEval, 'Entry node is missing');
        assertIsNonNullable(exitEval, 'Exit node is missing');
        assertIsNonNullable(anyNode, 'Any node is missing');

        const components = new InstantiatedComponents(graph);

        const subgraphInfo: SubgraphInfo = {
            components,
            parent: parentSubgraphInfo,
            entry: entryEval,
            exit: exitEval,
            any: anyNode,
        };

        for (let iNode = 0; iNode < nodes.length; ++iNode) {
            const nodeEval = nodeEvaluations[iNode];
            if (nodeEval) {
                nodeEval.subgraph = subgraphInfo;
            }
        }

        const subgraphInfos = nodes.map((node) => {
            if (node instanceof PoseSubgraph) {
                return this._addSubgraph(node, subgraphInfo, context);
            } else {
                return null;
            }
        });

        if (DEBUG) {
            for (const nodeEval of nodeEvaluations) {
                if (nodeEval) {
                    nodeEval.__DEBUG_ID__ = `${nodeEval.name}(from ${graph.name})`;
                }
            }
        }

        for (let iNode = 0; iNode < nodes.length; ++iNode) {
            const node = nodes[iNode];
            const outgoingTemplates = graph.getOutgoings(node);
            const outgoingTransitions: TransitionEval[] = [];

            let fromNode: NodeEval;
            if (node instanceof PoseSubgraph) {
                const subgraphInfo = subgraphInfos[iNode];
                assertIsNonNullable(subgraphInfo);
                fromNode = subgraphInfo.exit;
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
                if (outgoingNode instanceof PoseSubgraph) {
                    const subgraphInfo = subgraphInfos[iOutgoingNode];
                    assertIsNonNullable(subgraphInfo);
                    toNode = subgraphInfo.entry;
                } else {
                    const nodeEval = nodeEvaluations[iOutgoingNode];
                    assertIsNonNullable(nodeEval);
                    toNode = nodeEval;
                }

                const transitionEval: TransitionEval = {
                    pose: isPoseTransition(outgoing),
                    to: toNode,
                    conditions: outgoing.conditions.map((condition) => condition[createEval](context)),
                    duration: isPoseTransition(outgoing) ? outgoing.duration : 0.0,
                    targetStretch: 1.0,
                    exitConditionEnabled: isPoseTransition(outgoing) ? outgoing.exitConditionEnabled : false,
                    exitCondition: isPoseTransition(outgoing) ? outgoing.exitCondition : 0.0,
                    triggers: undefined,
                };
                if (toNode.kind === NodeKind.pose) {
                    const toScaling = 1.0;
                    // if (transitionEval.duration !== 0.0 && nodeEval.kind === NodeKind.pose && nodeEval.pose && toEval.pose) {
                    //     // toScaling = toEval.pose.duration / transitionEval.duration;
                    // }
                    transitionEval.targetStretch = toScaling;
                }
                transitionEval.conditions.forEach((conditionEval, iCondition) => {
                    const condition = outgoing.conditions[iCondition];
                    bindEvalProperties(context, condition, conditionEval);
                    if (condition instanceof TriggerCondition && condition.hasPropertyBinding('trigger')) {
                        const trigger = condition.getPropertyBinding('trigger');
                        (transitionEval.triggers ??= []).push(trigger);
                    }
                });
                outgoingTransitions.push(transitionEval);
            }

            fromNode.outgoingTransitions = outgoingTransitions;
        }

        return {
            entry: entryEval,
            exit: exitEval,
        };
    }

    /**
     * Updates this layer, return when the time piece exhausted or the graph reached exit state.
     * @param deltaTime The time piece to update.
     * @returns Remain time piece.
     */
    private _eval (deltaTime: Readonly<number>) {
        assertIsTrue(!this.exited);
        graphDebugGroup(`[Layer ${this.name}]: UpdateStart ${deltaTime}s`);

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

                graphDebug(`[Subgraph ${this.name}]: CurrentNodeUpdate: ${currentNode.name}`);
                if (currentNode.kind === NodeKind.pose) {
                    currentNode.updateFromPort(updateRequires);
                }
                if (GRAPH_DEBUG_ENABLED) {
                    passConsumed = remainTimePiece;
                }

                remainTimePiece -= updateRequires;
                this._switchTo(transition);

                continueNextIterationForce = true;
            } else { // If no transition matched, we update current node.
                graphDebug(`[Subgraph ${this.name}]: CurrentNodeUpdate: ${currentNode.name}`);
                if (currentNode.kind === NodeKind.pose) {
                    currentNode.updateFromPort(remainTimePiece);
                    // Poses eat all times.
                    remainTimePiece = 0.0;
                }
                if (GRAPH_DEBUG_ENABLED) {
                    passConsumed = remainTimePiece;
                }
                continue;
            }
        }

        graphDebug(`[Subgraph ${this.name}]: UpdateEnd`);
        graphDebugGroupEnd();

        return remainTimePiece;
    }

    private _sample () {
        const {
            _currentNode: currentNode,
            _currentTransitionToNode: currentTransitionToNode,
            _fromWeight: fromWeight,
        } = this;
        if (currentNode.kind === NodeKind.pose) {
            currentNode.sampleFromPort(fromWeight);
        }
        if (currentTransitionToNode) {
            if (currentTransitionToNode.kind === NodeKind.pose) {
                currentTransitionToNode.sampleToPort(this._toWeight);
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

        if (currentNode.kind === NodeKind.pose) {
            for (let ancestor: SubgraphInfo | null = currentNode.subgraph;
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

            if (realNode.kind === NodeKind.pose && transition.exitConditionEnabled) {
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

    private _switchTo (transition: TransitionEval) {
        const { _currentNode: currentNode } = this;

        graphDebugGroup(`[Subgraph ${this.name}]: STARTED ${currentNode.name} -> ${transition.to.name}.`);

        // TODO: what if the first is entry(ie. not pose)?
        // TODO: what if two of the path use same trigger?
        let currentTransition = transition;
        const { _currentTransitionPath: currentTransitionPath } = this;
        for (; ;) {
            // Reset triggers
            this._resetTriggersOnTransition(currentTransition);

            currentTransitionPath.push(currentTransition);
            const { to } = currentTransition;
            if (to.kind === NodeKind.pose) {
                break;
            }

            const transitionMatch = this._matchTransition(
                to,
                to,
                0.0,
                transitionMatchCache,
            );
            if (!transitionMatch) {
                break;
            }
            currentTransition = transitionMatch.transition;
        }

        const realTargetNode = currentTransition.to;
        if (realTargetNode.kind !== NodeKind.pose) {
            // We ran into a exit/entry node.
            // Current: ignore the transition, but triggers are consumed
            // TODO: what should we done here?
            currentTransitionPath.length = 0;
            return;
        }

        // Apply transitions
        this._transitionProgress = 0.0;
        this._currentTransitionToNode = realTargetNode;

        realTargetNode.resetToPort();
        this._callEnterMethods(realTargetNode);

        graphDebugGroupEnd();
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
        } = currentTransition;

        assertIsTrue(transitionDuration >= this._transitionProgress);
        let contrib = 0.0;
        let ratio = 0.0;
        if (transitionDuration <= 0) {
            contrib = 0.0;
            ratio = 1.0;
        } else {
            const remain = transitionDuration - this._transitionProgress;
            contrib = Math.min(remain, deltaTime);
            this._transitionProgress += contrib;
            const progress = this._transitionProgress;
            ratio = Math.min(progress / transitionDuration, 1.0);
        }

        const fromNode = this._currentNode;
        const toNode = currentTransitionToNode;

        const toNodeName = toNode?.name ?? '<Empty>';

        const weight = this._weight;
        graphDebugGroup(
            `[Subgraph ${this.name}]: TransitionUpdate: ${fromNode.name} -> ${toNodeName}`
            + `with ratio ${ratio} in base weight ${this._weight}.`,
        );

        this._fromWeight = weight * (1.0 - ratio);
        this._toWeight = weight * ratio;

        if (fromNode.kind === NodeKind.pose) {
            graphDebugGroup(`Update ${fromNode.name}`);
            fromNode.updateFromPort(contrib);
            graphDebugGroupEnd();
        }

        if (toNode) {
            graphDebugGroup(`Update ${toNode.name}`);
            const stretchedTime = contrib * currentTransition.targetStretch;
            toNode.updateToPort(stretchedTime);
            graphDebugGroupEnd();
        }

        graphDebugGroupEnd();

        if (ratio === 1.0) {
            // Transition done.
            graphDebug(`[Subgraph ${this.name}]: Transition finished:  ${fromNode.name} -> ${toNodeName}.`);

            this._callExitMethods(fromNode);
            const { _currentTransitionPath: transitions } = this;
            const nTransition = transitions.length;
            for (let iTransition = 0; iTransition < nTransition; ++iTransition) {
                const { to } = transitions[iTransition];
                if (to.kind === NodeKind.exit) {
                    this._callExitMethods(to);
                } else if (to.kind === NodeKind.entry) {
                    this._callEnterMethods(to);
                }
            }
            toNode.finishTransition();
            this._currentNode = toNode;
            this._currentTransitionToNode = null;
            this._currentTransitionPath.length = 0;
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
        const { _newGenAnim: newGenAnim } = this;
        switch (node.kind) {
        default:
            break;
        case NodeKind.pose:
            node.components.callEnterMethods(newGenAnim);
            break;
        case NodeKind.entry:
            node.subgraph.components.callEnterMethods(newGenAnim);
            break;
        }
    }

    private _callExitMethods (node: NodeEval) {
        const { _newGenAnim: newGenAnim } = this;
        switch (node.kind) {
        default:
            break;
        case NodeKind.pose:
            node.components.callExitMethods(newGenAnim);
            break;
        case NodeKind.exit:
            node.subgraph.components.callExitMethods(newGenAnim);
            break;
        }
    }

    /**
     * A subgraph may have a current node, or haven't due to:
     * - the subgraph is empty;
     * - the subgraph isn't empty, but no transitions emitted from entry;
     * - there are transitions emitted from entry, but non of them are satisfied.
     */
    // public enter () {
    //     assertIsTrue(this._currentNode.kind === NodeKind.entry);
    //     const transitionMatch = this._matchCurrentNodeTransition(0.0);
    //     if (!transitionMatch) {
    //         return;
    //     }
    //     const { transition } = transitionMatch;
    //     assertIsTrue(transitionMatch.requires === 0.0);
    //     assertIsTrue(transition.to !== this._currentNode);
    //     this._switchTo(transition);
    //     this._updateCurrentTransition(0.0);
    // }

    // /**
    //  * Resets this sub graph to its initial state.
    //  */
    // public reset () {
    //     this._currentNode = this._enterNode;
    //     this._currentTransition = null;
    // }

    // /**
    //  * Sets weight of this sub graph.
    //  * @param weight The weight.
    //  */
    // public setWeight (weight: number) {
    //     this._weight = weight;
    //     if (isPoseOrSubgraphNodeEval(this._currentNode)) {
    //         this._currentNode.setWeight(weight);
    //     }
    // }

    // public transitionUpdate (deltaTime: Readonly<number>) {
    //     assertIsTrue(!this.exited);
    //     const { _currentNode: currentNode } = this;
    //     if (currentNode.kind === NodeKind.pose) {
    //         currentNode.update(deltaTime);
    //     } else if (currentNode.kind === NodeKind.subgraph) {
    //         currentNode.transitionUpdate(deltaTime);
    //     }
    // }
}

const emptyPoseIterator: Iterator<PoseStatus> = Object.freeze({
    next () {
        return {
            done: true,
            value: undefined,
        };
    },
});

const emptyPoseIterable: Iterable<PoseStatus> = Object.freeze({
    [Symbol.iterator] () {
        return emptyPoseIterator;
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

function bindEvalProperties<T extends BindingHost, EvalT> (context: LayerContext, source: T, evalObject: EvalT) {
    const propertyBindingPoints = getPropertyBindingPoints(source);
    if (!propertyBindingPoints) {
        return;
    }
    for (const [bindingPointId, bindingPoint] of Object.entries(propertyBindingPoints)) {
        const varName = source.getPropertyBinding(bindingPointId);
        if (varName) {
            context.bind(varName, bindingPoint.notify, [evalObject]);
        }
    }
}

enum NodeKind {
    entry, exit, any, pose,
}

export class NodeBaseEval {
    public declare __DEBUG_ID__?: string;

    public declare subgraph: SubgraphInfo;

    constructor (node: GraphNode) {
        this.name = node.name;
    }

    public readonly name: string;

    public outgoingTransitions: readonly TransitionEval[] = [];
}

const DEFAULT_ENTER_METHOD = StateMachineComponent.prototype.onEnter;

const DEFAULT_EXIT_METHOD = StateMachineComponent.prototype.onExit;

class InstantiatedComponents {
    constructor (node: InteractiveGraphNode) {
        this._components = node.instantiateComponents();
    }

    public callEnterMethods (newGenAnim: NewGenAnim) {
        const { _components: components } = this;
        const nComponents = components.length;
        for (let iComponent = 0; iComponent < nComponents; ++iComponent) {
            const component = components[iComponent];
            if (component.onEnter !== DEFAULT_ENTER_METHOD) {
                component.onEnter(newGenAnim);
            }
        }
    }

    public callExitMethods (newGenAnim: NewGenAnim) {
        const { _components: components } = this;
        const nComponents = components.length;
        for (let iComponent = 0; iComponent < nComponents; ++iComponent) {
            const component = components[iComponent];
            if (component.onExit !== DEFAULT_EXIT_METHOD) {
                component.onExit(newGenAnim);
            }
        }
    }

    private declare _components: StateMachineComponent[];
}

interface SubgraphInfo {
    parent: SubgraphInfo | null;
    entry: NodeEval;
    exit: NodeEval;
    any: NodeEval;
    components: InstantiatedComponents;
}

export class PoseNodeEval extends NodeBaseEval {
    constructor (node: PoseNode, context: LayerContext) {
        super(node);
        this.speed = node.speed;
        this.startRatio = node.startRatio;
        bindEvalProperties(context, node, this);
        const poseEvalContext: PoseEvalContext = {
            ...context,
            speed: node.speed,
            startRatio: node.startRatio,
        };
        const poseEval = node.pose?.[createEval](poseEvalContext) ?? null;
        if (poseEval && node.pose instanceof BindingHost) {
            bindEvalProperties(context, node.pose, poseEval);
        }
        if (poseEval) {
            Object.defineProperty(poseEval, '__DEBUG_ID__', { value: this.name });
        }
        this._pose = poseEval;
        this.components = new InstantiatedComponents(node);
    }

    public readonly kind = NodeKind.pose;

    public speed: number;

    public startRatio: number;

    public declare components: InstantiatedComponents;

    get duration () {
        return this._pose?.duration ?? 0.0;
    }

    get fromPortTime () {
        return this._fromPort.time;
    }

    public updateFromPort (deltaTime: number) {
        this._fromPort.time += deltaTime;
    }

    public updateToPort (deltaTime: number) {
        this._toPort.time += deltaTime;
    }

    public resetToPort () {
        this._toPort.time = 0.0;
    }

    public finishTransition () {
        this._fromPort.time = this._toPort.time;
    }

    public sampleFromPort (weight: number) {
        this._pose?.sample(this._fromPort.time, weight);
    }

    public sampleToPort (weight: number) {
        this._pose?.sample(this._toPort.time, weight);
    }

    public getPoses (baseWeight: number): Iterable<PoseStatus> {
        const { _pose: pose } = this;
        if (!pose) {
            return emptyPoseIterable;
        } else {
            return {
                [Symbol.iterator]: () => pose.poses(baseWeight),
            };
        }
    }

    private _pose: PoseEval | null = null;
    private _fromPort: PoseEvalPort = {
        time: 0.0,
    };
    private _toPort: PoseEvalPort = {
        time: 0.0,
    };
}

interface PoseEvalPort {
    time: number;
}

export class SpecialNodeEval extends NodeBaseEval {
    constructor (node: GraphNode, kind: SpecialNodeEval['kind'], name: string) {
        super(node);
        this.kind = kind;
    }

    public readonly kind: NodeKind.entry | NodeKind.exit | NodeKind.any;
}

export type NodeEval = PoseNodeEval | SpecialNodeEval;

interface TransitionEval {
    pose: boolean;
    to: NodeEval;
    duration: number;
    conditions: ConditionEval[];
    targetStretch: number;
    exitConditionEnabled: boolean;
    exitCondition: number;
    /**
     * Bound triggers, once this transition satisfied. All triggers would be reset.
     */
    triggers: string[] | undefined;
}

interface VarRefs {
    value: Value;

    refs: VarRef[];
}

interface VarRef {
    fn: (value: unknown, ...args: unknown[]) => void;

    args: unknown[];
}
