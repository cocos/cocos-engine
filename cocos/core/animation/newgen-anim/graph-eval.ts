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
import { EventHandler } from '../../components/component-event-handler';
import { AnimationClip } from '..';

export class PoseGraphEval {
    private _varRefMap: Record<string, VarRefs> = {};
    private declare _layerEvaluations: LayerEval[];
    private _blendBuffer = new BlendStateBuffer();
    private _currentTransitionCache: TransitionStatus = {
        duration: 0.0,
        time: 0.0,
    };

    constructor (graph: PoseGraph, root: Node) {
        for (const [name, { value }] of graph.variables) {
            this._varRefMap[name] = {
                value,
                refs: [],
            };
        }

        const context: LayerContext = {
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

    public getCurrentPoses (layer: number): Iterable<PoseStatus> {
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

    public getNextPoses (layer: number): Iterable<PoseStatus> {
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

    public getCurrentNodeInfo (layer: number) {
        assertIsTrue(layer >= 0 && layer < this._layerEvaluations.length, 'Layer out of bound');
        return this._layerEvaluations[layer].getCurrentNodeInfo();
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

type TriggerResetFn = (name: string) => void;

interface LayerContext {
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
    private declare _graphEval: SubgraphEval;

    constructor (layer: Layer, context: LayerContext) {
        this._graphEval = new SubgraphEval(layer.graph, {
            ...context,
        });
        this._graphEval.setWeight(layer.weight);
    }

    public update (deltaTime: number) {
        if (!this._graphEval.exited) {
            this._graphEval.update(deltaTime);
            this._graphEval.sample();
        }
    }

    public getCurrentPoses (): Iterable<PoseStatus> {
        return this._graphEval.getCurrentPoses();
    }

    public getCurrentTransition (transitionStatus: TransitionStatus): boolean {
        return this._graphEval.getCurrentTransition(transitionStatus);
    }

    public getNextPoses (): Iterable<PoseStatus> {
        return this._graphEval.getNextPoses();
    }

    public getCurrentNodeInfo () {
        return this._graphEval.getCurrentNodeInfo();
    }
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

type SubGraphEvalContext = LayerContext;

class SubgraphEval {
    private _weight = 0.0;
    private declare _nodes: Set<NodeEval>;
    private declare _currentNode: NodeEval;
    private _currentTransition: TransitionEval | null = null;
    private _transitionProgress = 0;
    private declare _anyNode: NodeEval;
    private declare _enterNode: NodeEval;
    private declare _triggerReset: TriggerResetFn;

    public declare name: string;

    constructor (subgraph: PoseSubgraph, context: SubGraphEvalContext) {
        this.name = subgraph.name;

        const nodes = Array.from(subgraph.nodes());

        const nodeEvaluators = nodes.map((node) => createNodeEval(context, subgraph, node));

        for (let iNode = 0; iNode < nodes.length; ++iNode) {
            const node = nodes[iNode];
            nodeEvaluators[iNode].outgoingTransitions = createTransitionEval(context, subgraph, node, nodeEvaluators[iNode], nodeEvaluators, nodes);
        }

        this._nodes = new Set(nodeEvaluators);
        const entryNode = nodeEvaluators.find((node) => node.kind === NodeKind.entry);
        assertIsNonNullable(entryNode, 'Entry node is missing');
        this._enterNode = entryNode;

        const anyNode = nodeEvaluators.find((node) => node.kind === NodeKind.any);
        assertIsNonNullable(anyNode, 'Any node is missing');
        this._anyNode = anyNode;

        this._currentNode = entryNode;

        this._resetTrigger = context.triggerResetFn;
    }

    /**
     * Indicates if this sub graph reached its exit.
     */
    get exited () {
        return this._currentNode.kind === NodeKind.exit;
    }

    public enter () {
        assertIsTrue(this._currentNode.kind === NodeKind.entry);
        const transitionMatch = this._matchCurrentNodeTransition(0.0);
        if (!transitionMatch) {
            return;
        }
        const { transition } = transitionMatch;
        assertIsTrue(transitionMatch.requires === 0.0);
        assertIsTrue(transition.to !== this._currentNode);
        this._switchTo(transition);
        this._updateCurrentTransition(0.0);
    }

    /**
     * Resets this sub graph to its initial state.
     */
    public reset () {
        this._currentNode = this._enterNode;
        this._currentTransition = null;
    }

    /**
     * Sets weight of this sub graph.
     * @param weight The weight.
     */
    public setWeight (weight: number) {
        this._weight = weight;
        if (isPoseOrSubgraphNodeEval(this._currentNode)) {
            this._currentNode.setWeight(weight);
        }
    }

    /**
     * Updates this sub graph, return when the time piece exhausted or the graph reached exit state.
     * @param deltaTime The time piece to update.
     * @returns Remain time piece.
     */
    public update (deltaTime: Readonly<number>) {
        assertIsTrue(!this.exited);
        graphDebugGroup(`[Subgraph ${this.name}]: UpdateStart ${deltaTime}s`);
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
            if (this._currentTransition) {
                const currentUpdatingConsume = this._updateCurrentTransition(remainTimePiece);
                if (GRAPH_DEBUG_ENABLED) {
                    passConsumed = currentUpdatingConsume;
                }
                remainTimePiece -= currentUpdatingConsume;
                if (this._currentNode.kind === NodeKind.exit) {
                    break;
                }
                if (!this._currentTransition) {
                    // If the update invocation finished the transition,
                    // We force restart the iteration
                    continueNextIterationForce = true;
                }
                continue;
            }

            const { _currentNode: currentNode } = this;

            const transitionMatch = this._matchCurrentNodeTransition(remainTimePiece);

            // If no transition matched, we update current node.
            if (!transitionMatch) {
                graphDebug(`[Subgraph ${this.name}]: CurrentNodeUpdate: ${currentNode.name}`);
                if (currentNode.kind === NodeKind.pose) {
                    currentNode.update(remainTimePiece);
                    // Poses eat all times.
                    remainTimePiece = 0.0;
                } else if (currentNode.kind === NodeKind.subgraph) {
                    if (currentNode.exited) {
                        currentNode.reenter();
                    }
                    remainTimePiece = currentNode.update(remainTimePiece);
                    // If current node is subgraph and the iteration cause it reaches exit state.
                    // we should force continue next iteration to enable the transitions emitted.
                    if (currentNode.exited) {
                        continueNextIterationForce = true;
                    }
                }
                if (GRAPH_DEBUG_ENABLED) {
                    passConsumed = remainTimePiece;
                }
                continue;
            }

            // Transition happened.

            if (transitionMatch.transition.to !== currentNode) {
                const {
                    transition,
                    requires: updateRequires,
                } = transitionMatch;

                graphDebug(`[Subgraph ${this.name}]: CurrentNodeUpdate: ${currentNode.name}`);
                if (currentNode.kind === NodeKind.pose) {
                    currentNode.update(updateRequires);
                } else if (currentNode.kind === NodeKind.subgraph) {
                    assertIsTrue(currentNode.exited);
                    assertIsTrue(updateRequires === 0.0);
                }
                if (GRAPH_DEBUG_ENABLED) {
                    passConsumed = remainTimePiece;
                }

                remainTimePiece -= updateRequires;
                this._switchTo(transition);
            } else if (currentNode.kind === NodeKind.subgraph) {
                // Self transition
                assertIsTrue(currentNode.exited);
                graphDebug(`[Subgraph ${this.name}]: REINTERRED ${currentNode.name} -> ${transitionMatch.transition.to.name}.`);
                currentNode.reenter();
            }

            continueNextIterationForce = true;
        }

        graphDebug(`[Subgraph ${this.name}]: UpdateEnd`);
        graphDebugGroupEnd();

        return remainTimePiece;
    }

    public transitionUpdate (deltaTime: Readonly<number>) {
        assertIsTrue(!this.exited);
        const { _currentNode: currentNode } = this;
        if (currentNode.kind === NodeKind.pose) {
            currentNode.update(deltaTime);
        } else if (currentNode.kind === NodeKind.subgraph) {
            currentNode.transitionUpdate(deltaTime);
        }
    }

    public sample () {
        const { _currentNode: currentNode } = this;
        if (isPoseOrSubgraphNodeEval(currentNode)) {
            currentNode.sample();
        }
        if (this._currentTransition) {
            const { to } = this._currentTransition;
            if (isPoseOrSubgraphNodeEval(to)) {
                to.sample();
            }
        }
    }

    public getCurrentNodeInfo () {
        return {
            name: this._currentNode.name,
        };
    }

    public getCurrentPoses (): Iterable<PoseStatus> {
        if (this._currentNode.kind === NodeKind.subgraph) {
            return this._currentNode.subgraphEval.getCurrentPoses();
        } else if (this._currentNode.kind === NodeKind.pose) {
            const iterator = this._currentNode.getPoses();
            return {
                [Symbol.iterator]: () => iterator,
            };
        } else {
            return emptyPoseIterable;
        }
    }

    public getCurrentTransition (transitionStatus: TransitionStatus): boolean {
        const { _currentTransition: currentTransition } = this;
        if (currentTransition) {
            transitionStatus.duration = currentTransition.duration;
            transitionStatus.time = this._transitionProgress;
            return true;
        } else if (this._currentNode.kind === NodeKind.subgraph) {
            return this._currentNode.subgraphEval.getCurrentTransition(transitionStatus);
        } else {
            return false;
        }
    }

    public getNextPoses (): Iterable<PoseStatus> {
        const { _currentTransition: currentTransition } = this;
        if (currentTransition) {
            const { to } = currentTransition;
            if (to.kind === NodeKind.pose) {
                const iterator = to.getPoses();
                return {
                    [Symbol.iterator]: () => iterator,
                };
            } else if (to.kind === NodeKind.subgraph) {
                return to.subgraphEval.getCurrentPoses();
            } else {
                return emptyPoseIterable;
            }
        } else {
            const { _currentNode: currentNode } = this;
            assertIsTrue(currentNode.kind === NodeKind.subgraph, 'Current graph has not transition');
            return currentNode.subgraphEval.getNextPoses();
        }
    }

    /**
     * Update current transition.
     * Asserts: `!!this._currentTransition`.
     * @param deltaTime Time piece.
     * @returns
     */
    private _updateCurrentTransition (deltaTime: number) {
        const { _currentTransition: currentTransition } = this;
        assertIsNonNullable(currentTransition);

        const {
            duration: transitionDuration,
            to: toNode,
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
        assertIsTrue(fromNode !== toNode);

        const weight = this._weight;
        graphDebugGroup(
            `[Subgraph ${this.name}]: TransitionUpdate: ${fromNode.name} -> ${toNode.name}`
            + `with ratio ${ratio} in base weight ${this._weight}.`,
        );
        if (fromNode.kind === NodeKind.pose) {
            graphDebugGroup(`Update ${fromNode.name}`);
            fromNode.setWeight(weight * (1.0 - ratio));
            fromNode.update(contrib);
            graphDebugGroupEnd();
        }
        if (isPoseOrSubgraphNodeEval(toNode)) {
            graphDebugGroup(`Update ${toNode.name}`);
            toNode.setWeight(weight * ratio);
            const stretchedTime = contrib * currentTransition.targetStretch;
            if (toNode.kind === NodeKind.pose) {
                toNode.update(stretchedTime);
            } else {
                assertIsTrue(toNode.kind === NodeKind.subgraph);
                toNode.transitionUpdate(stretchedTime);
            }
            graphDebugGroupEnd();
        }
        graphDebugGroupEnd();

        if (ratio === 1.0) {
            graphDebug(`[Subgraph ${this.name}]: Transition finished:  ${fromNode.name} -> ${toNode.name}.`);

            fromNode.exit();
            this._currentNode = toNode;
            this._currentTransition = null;
        }

        return contrib;
    }

    /**
     * Searches for a transition which should be performed
     * if current node update for no more than `deltaTime`.
     * @param deltaTime
     * @returns
     */
    private _matchCurrentNodeTransition (deltaTime: Readonly<number>) {
        const currentNode = this._currentNode;

        // If current node is subgraph, transitions are happened after it exited.
        if (currentNode.kind === NodeKind.subgraph && !currentNode.exited) {
            return null;
        }

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
            const anyMatch = this._matchTransition(
                this._anyNode,
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
                if (node.kind === NodeKind.entry) {
                    // This kind of transition is definitely chosen.
                    return result.set(transition, 0.0);
                }
                if (!transition.exitConditionEnabled) {
                    // Invalid transition, ignored.
                    continue;
                }
            }

            let deltaTimeRequired = 0.0;

            if (node.kind === NodeKind.pose && transition.exitConditionEnabled) {
                deltaTimeRequired = node.duration * (transition.exitCondition - node.progress);
                assertIsTrue(deltaTimeRequired >= 0.0);
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

            // Decides if it's valid self-transition.
            if (transition.to === realNode) {
                assertIsTrue(isPoseOrSubgraphNodeEval(realNode));
                if (realNode.kind === NodeKind.pose) {
                    continue;
                } else if (!realNode.exited) {
                    continue;
                }
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

        const { triggers } = transition;
        if (triggers) {
            const nTriggers = triggers.length;
            for (let iTrigger = 0; iTrigger < nTriggers; ++iTrigger) {
                const trigger = triggers[iTrigger];
                this._resetTrigger(trigger);
            }
        }

        // Apply transitions
        this._currentTransition = transition;
        this._transitionProgress = 0.0;
        const targetNode = transition.to;
        if (targetNode.name === 'MovementPoseNode') {
            // debugger;
        }
        if (isPoseOrSubgraphNodeEval(targetNode)) {
            targetNode.setWeight(this._weight);
        }
        targetNode.enter();
        // if (currentNode.kind === NodeKind.pose && currentNode.pose) {
        //     currentNode.pose.inactive();
        // }
        // this._currentNode = targetNode;

        graphDebugGroupEnd();
    }

    private _resetTrigger (name: string) {
        const { _triggerReset: triggerResetFn } = this;
        triggerResetFn(name);
    }
}

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

function createNodeEval (context: SubGraphEvalContext, graph: PoseSubgraph, node: GraphNode): NodeEval {
    if (node instanceof PoseNode) {
        return new PoseNodeEval(node, context);
    } else if (node instanceof PoseSubgraph) {
        return new SubgraphNodeEval(node, context);
    } else {
        const kind = node === graph.entryNode
            ? NodeKind.entry
            : node === graph.exitNode
                ? NodeKind.exit
                : node === graph.anyNode
                    ? NodeKind.any
                    : NodeKind.exit;
        return new SpecialNodeEval(node, kind, node.name);
    }
}

function createTransitionEval (
    context: SubGraphEvalContext,
    graph: PoseSubgraph,
    node: GraphNode,
    nodeEval: NodeEval,
    nodeEvaluators: NodeEval[],
    mappings: GraphNode[],
) {
    const outgoingTemplates = graph.getOutgoings(node);
    const outgoingTransitions: TransitionEval[] = [];
    for (const outgoing of outgoingTemplates) {
        const iOutgoingNode = mappings.findIndex((nodeTemplate) => nodeTemplate === outgoing.to);
        if (iOutgoingNode < 0) {
            assertIsTrue(false, 'Bad animation data');
        }
        const toEval = nodeEvaluators[iOutgoingNode];
        const transitionEval: TransitionEval = {
            pose: isPoseTransition(outgoing),
            to: toEval,
            conditions: outgoing.conditions.map((condition) => condition[createEval](context)),
            duration: isPoseTransition(outgoing) ? outgoing.duration : 0.0,
            targetStretch: 1.0,
            exitConditionEnabled: isPoseTransition(outgoing) ? outgoing.exitConditionEnabled : false,
            exitCondition: isPoseTransition(outgoing) ? outgoing.exitCondition : 0.0,
            triggers: undefined,
        };
        if (toEval.kind === NodeKind.pose) {
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
    return outgoingTransitions;
}

function bindEvalProperties<T extends BindingHost, EvalT> (context: SubGraphEvalContext, source: T, evalObject: EvalT) {
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
    entry, exit, any, pose, subgraph,
}

export class NodeBaseEval {
    constructor (node: GraphNode) {
        this.name = node.name;
        this._onEnter = node.onEnter;
        this._onExit = node.onExit;
    }

    public readonly name: string;

    public outgoingTransitions: readonly TransitionEval[] = [];

    private _onEnter: EventHandler | null;

    private _onExit: EventHandler | null;

    public enter () {
        this._onEnter?.emit([]);
    }

    public exit () {
        this._onExit?.emit([]);
    }
}

export class PoseNodeEval extends NodeBaseEval {
    constructor (node: PoseNode, context: SubGraphEvalContext) {
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
        this._pose = poseEval;
    }

    public readonly kind = NodeKind.pose;

    public speed: number;

    public startRatio: number;

    get progress () {
        return this._pose?.progress ?? 0.0;
    }

    get duration () {
        return this._pose?.duration ?? 0.0;
    }

    public setWeight (weight: number) {
        this._pose?.setBaseWeight(weight);
    }

    public enter () {
        super.enter();
        this._pose?.active();
    }

    public exit () {
        super.exit();
        this._pose?.inactive();
    }

    public update (deltaTime: number) {
        this._pose?.update(deltaTime);
    }

    public sample () {
        this._pose?.sample();
    }

    public getPoses (): Iterator<PoseStatus> {
        return this._pose?.poses() ?? emptyPoseIterator;
    }

    private _pose: PoseEval | null = null;
}

export class SubgraphNodeEval extends NodeBaseEval {
    constructor (node: PoseSubgraph, context: SubGraphEvalContext) {
        super(node);
        const subgraphEval = new SubgraphEval(node, context);
        this.subgraphEval = subgraphEval;
    }

    public readonly kind = NodeKind.subgraph;

    public subgraphEval: SubgraphEval;

    get exited () {
        return this.subgraphEval.exited;
    }

    public enter () {
        super.enter();
        this.subgraphEval.enter();
    }

    public exit () {
        super.exit();
        this.subgraphEval.reset();
    }

    public reenter () {
        super.exit();
        super.enter();
        this.subgraphEval.reset();
    }

    public setWeight (weight: number) {
        this.subgraphEval.setWeight(weight);
    }

    public update (deltaTime: number) {
        return this.subgraphEval.update(deltaTime);
    }

    public transitionUpdate (deltaTime: number) {
        this.subgraphEval.transitionUpdate(deltaTime);
    }

    public sample () {
        this.subgraphEval.sample();
    }
}

export class SpecialNodeEval extends NodeBaseEval {
    constructor (node: GraphNode, kind: SpecialNodeEval['kind'], name: string) {
        super(node);
        this.kind = kind;
    }

    public readonly kind: NodeKind.entry | NodeKind.exit | NodeKind.any;
}

export type NodeEval = PoseNodeEval | SubgraphNodeEval | SpecialNodeEval;

function isPoseOrSubgraphNodeEval (nodeEval: NodeEval): nodeEval is (PoseNodeEval | SubgraphNodeEval) {
    return nodeEval.kind === NodeKind.pose || nodeEval.kind === NodeKind.subgraph;
}

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
