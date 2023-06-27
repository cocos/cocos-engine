// cSpell:words Evaluatable

import { DEBUG } from 'internal:constants';
import { assertIsTrue, warn } from '../../../core';
import { instantiate } from '../../../serialization';
import { PoseNode, PoseTransformSpaceRequirement } from './pose-node';
import { PoseGraph } from './pose-graph';
import { PureValueNode, PureValueNodeLinkContext } from './pure-value-node';
import { NodeInputPath } from './foundation/node-shell';
import { PoseGraphNode } from './foundation/pose-graph-node';
import { PoseNodePlayMotion } from './pose-nodes/play-motion';
import {
    AnimationGraphBindingContext, AnimationGraphSettleContext,
    AnimationGraphUpdateContext, AnimationGraphEvaluationContext,
} from '../animation-graph-context';
import type { Pose } from '../../core/pose';

type EvaluatableNode = PoseNode | PureValueNode;

function isEvaluatableNode (node: PoseGraphNode): node is EvaluatableNode {
    return (node instanceof PoseNode || node instanceof PureValueNode);
}

class InstantiatedPoseGraph {
    constructor (
        private _rootPoseNode: PoseNode | undefined,
        private _countingPlayMotionNodes: readonly PoseNodePlayMotion[] | undefined,
    ) {

    }

    public bind (context: AnimationGraphBindingContext): void {
        this._rootPoseNode?.bind(context);
    }

    public settle (context: AnimationGraphSettleContext): void {
        this._rootPoseNode?.settle(context);
    }

    public reenter (): void {
        this._rootPoseNode?.reenter();
    }

    public update (context: AnimationGraphUpdateContext): void {
        this._rootPoseNode?.update(context);
    }

    public evaluate (context: AnimationGraphEvaluationContext): Pose | null {
        return this._rootPoseNode?.evaluate(context, PoseTransformSpaceRequirement.LOCAL) ?? null;
    }

    public countMotionTime (): number {
        const { _countingPlayMotionNodes: playMotionNodes } = this;
        if (!playMotionNodes) {
            if (DEBUG) {
                assertIsTrue(
                    false,
                    `Should not call countMotionTime() on this pose graph `
                    + `since "mayCountMotionTime" was not passed to instantiatePoseGraph()`,
                );
            }
            return 0.0;
        }
        let maxWeightedTime = 0.0;
        let maxWeight = Number.NEGATIVE_INFINITY;
        for (let iPlayMotionNode = 0; iPlayMotionNode < playMotionNodes.length; ++iPlayMotionNode) {
            const {
                elapsedMotionTime,
                lastIndicativeWeight,
            } = playMotionNodes[iPlayMotionNode];
            if (lastIndicativeWeight > maxWeight) {
                maxWeight = lastIndicativeWeight;
                maxWeightedTime = elapsedMotionTime;
            }
        }
        return maxWeightedTime;
    }
}

export type { InstantiatedPoseGraph };

export function instantiatePoseGraph (
    graph: PoseGraph,
    linkContext: PureValueNodeLinkContext,
    mayCountMotionTime = false,
): InstantiatedPoseGraph {
    const {
        outputNode,
    } = graph;

    const outputNodeShell = graph.getShell(outputNode);
    assertIsTrue(outputNodeShell);
    const bindings = outputNodeShell.getBindings();
    // Output node can only has 1 or has no binding.
    assertIsTrue(bindings.length < 2);
    if (bindings.length === 0) {
        return new InstantiatedPoseGraph(
            undefined,
            mayCountMotionTime ? [] : undefined,
        );
    }
    // If the output node has a binding, it must be pose node.
    const binding = bindings[0];
    assertIsTrue(binding.outputIndex === 0);
    assertIsTrue(binding.producer instanceof PoseNode);

    const instantiationMap = new Map<PoseGraphNode, RuntimeNodeEvaluation>();
    const mainRecord = instantiateNode(
        graph,
        binding.producer,
        instantiationMap,
        linkContext,
    );
    assertIsTrue(mainRecord instanceof PoseNode);

    return new InstantiatedPoseGraph(
        mainRecord,
        mayCountMotionTime
            ? Array.from(instantiationMap.values()).filter((node): node is PoseNodePlayMotion => node instanceof PoseNodePlayMotion)
            : undefined,
    );
}

export interface PoseNodeDependencyEvaluation {
    evaluate(): void;
}

function instantiateNode (
    graph: PoseGraph,
    node: EvaluatableNode,
    instantiationMap: Map<PoseGraphNode, RuntimeNodeEvaluation>,
    linkContext: PureValueNodeLinkContext,
): RuntimeNodeEvaluation {
    const shell = graph.getShell(node);
    assertIsTrue(shell, `Want to instantiate an unbound graph?`);

    const existing = instantiationMap.get(node);
    if (existing) {
        return existing;
    }

    const instantiated = instantiate(node);

    // Invoke serialization callback.
    if ('__callOnAfterDeserializeRecursive' in instantiated) {
        (instantiated as unknown as {
            __callOnAfterDeserializeRecursive(): void;
        }).__callOnAfterDeserializeRecursive();
    }

    /** Link. */
    if (instantiated instanceof PureValueNode) {
        instantiated.link(linkContext);
    }

    /** Alias. */
    const consumerNode = instantiated;

    /**
     * Create the pv-node property binding records.
     */
    const runtimePVNodePropertyBindings: RuntimePVNodePropertyBinding[] = [];
    for (const {
        producer: producerNode,
        outputIndex: producerOutputIndex,
        inputPath: consumerInputPath,
    } of shell.getBindings()) {
        if (!isEvaluatableNode(producerNode)) {
            warn(`There's a input bound to a node with unrecognized type.`);
            continue;
        }
        const producer = instantiateNode(graph, producerNode, instantiationMap, linkContext);
        if (producer instanceof PoseNode) {
            // Rule: pose nodes can only be used to feed pose nodes.
            assertIsTrue(consumerNode instanceof PoseNode);
            // Core code: link pose nodes.
            linkPoseNode(
                consumerNode,
                consumerInputPath,
                producer,
                producerOutputIndex,
            );
        } else {
            const runtimePVNodePropertyBinding = linkPVNode(
                consumerNode,
                consumerInputPath,
                producer,
                producerOutputIndex,
            );
            if (runtimePVNodePropertyBinding) {
                runtimePVNodePropertyBindings.push(runtimePVNodePropertyBinding);
            }
        }
    }

    // Create the dependency evaluation.
    const dependencyEvaluation = new DependencyEvaluation(runtimePVNodePropertyBindings);

    // Create the evaluation record.
    let evaluation: PoseNode | RuntimeNodeEvaluation;
    if (consumerNode instanceof PoseNode) {
        // If this is pose node. Injects the dependency.
        consumerNode._setDependencyEvaluation(dependencyEvaluation);
        evaluation = consumerNode;
    } else {
        // Otherwise, create the evaluation record.
        const pureValueNodeEvaluation = new RuntimePVNodeEvaluation(consumerNode, dependencyEvaluation);
        evaluation = pureValueNodeEvaluation;
    }

    instantiationMap.set(node, evaluation);
    return evaluation;
}

class DependencyEvaluation implements PoseNodeDependencyEvaluation {
    constructor (
        bindingEvaluations: readonly RuntimePVNodePropertyBinding[],
    ) {
        this._bindingEvaluations = bindingEvaluations;
    }

    public evaluate (): void {
        const {
            _bindingEvaluations: bindingEvaluations,
        } = this;

        for (const binding of bindingEvaluations) {
            binding.evaluate();
        }
    }

    private _bindingEvaluations: readonly RuntimePVNodePropertyBinding[];
}

class RuntimePVNodeEvaluation {
    constructor (
        private _node: PureValueNode,
        private _dependency: DependencyEvaluation,
    ) {
        this._outputs = new Array(_node.outputCount);
    }

    get node (): PureValueNode {
        return this._node;
    }

    public get outputCount (): number {
        return this._outputs.length;
    }

    public getDefaultOutput (): unknown {
        return this.getOutput(0);
    }

    public getOutput (outputIndex: number): unknown {
        return this._outputs[outputIndex];
    }

    public evaluate (): void {
        const {
            _node: node,
            _dependency: dependency,
        } = this;
        // Evaluate the dependency.
        dependency.evaluate();
        // Evaluate the node.
        node.selfEvaluate(this._outputs);
    }

    protected _outputs: unknown[];
}

type RuntimeNodeEvaluation = PoseNode | RuntimePVNodeEvaluation;

function linkPoseNode (
    consumerNode: PoseNode,
    consumerInputPath: NodeInputPath,
    producerNode: PoseNode,
    producerOutputIndex: number,
): void {
    const [consumerPropertyKey, consumerElementIndex = -1] = consumerInputPath;
    if (!(consumerPropertyKey in consumerNode)) {
        // Invalid binding.
        warn(`Invalid binding: consumer node has no property ${consumerPropertyKey}`);
        return;
    }

    if (producerOutputIndex !== 0) {
        // Rule: pose nodes have and only have one output.
        warn(`Node ${producerNode.toString()} does not have specified output ${producerOutputIndex}.`);
        return;
    }

    const consumerProperty = consumerNode[consumerPropertyKey];

    // Plain property binding.

    if (consumerElementIndex < 0) {
        if (consumerProperty !== null) {
            // Invalid binding.
            warn(`Invalid binding: consumer node's input ${consumerPropertyKey} should be leaved as evaluation before evaluation.`);
            return;
        }

        consumerNode[consumerPropertyKey] = producerNode;
        return;
    }

    // The following is dedicated to array element bindings.

    if (!Array.isArray(consumerProperty)) {
        // Invalid binding.
        warn(`Invalid binding: consumer node's input ${consumerPropertyKey} should be an array.`);
        return;
    }

    if (consumerElementIndex >= consumerProperty.length) {
        // Invalid binding.
        warn(`Invalid binding: consumer node's input ${consumerPropertyKey} `
            + `have length ${consumerProperty.length} but the binding specified ${consumerElementIndex}`);
        return;
    }
    if (consumerProperty[consumerElementIndex] !== null) {
        // Invalid binding.
        warn(`Invalid binding: consumer node's input ${consumerPropertyKey}[${consumerElementIndex}] should be leaved as null before evaluation`);
        return;
    }

    consumerProperty[consumerElementIndex] = producerNode;
}

interface RuntimePVNodePropertyBinding {
    evaluate(): void;
}

class RuntimePVNodePlainPropertyBinding implements RuntimePVNodePropertyBinding {
    constructor (
        private _consumerNode: EvaluatableNode,
        private _consumerPropertyKey: string,
        private _producerRecord: RuntimePVNodeEvaluation,
        private _producerOutputIndex: number,
    ) {
    }

    public evaluate (): void {
        this._producerRecord.evaluate();
        this._consumerNode[this._consumerPropertyKey] = this._producerRecord.getOutput(this._producerOutputIndex);
    }
}

class RuntimePVNodeArrayElementPropertyBinding implements RuntimePVNodePropertyBinding {
    constructor (
        private _consumerNode: EvaluatableNode,
        private _consumerPropertyKey: string,
        private _consumerElementIndex: number,
        private _producerRecord: RuntimePVNodeEvaluation,
        private _producerOutputIndex: number,
    ) {
    }

    public evaluate (): void {
        this._producerRecord.evaluate();
        this._consumerNode[this._consumerPropertyKey][this._consumerElementIndex] = this._producerRecord.getOutput(this._producerOutputIndex);
    }
}

function linkPVNode (
    consumerNode: EvaluatableNode,
    consumerInputPath: NodeInputPath,
    producerRecord: RuntimePVNodeEvaluation,
    producerOutputIndex: number,
): RuntimePVNodePropertyBinding | undefined {
    const [consumerPropertyKey, consumerElementIndex = -1] = consumerInputPath;
    if (!(consumerPropertyKey in consumerNode)) {
        // Invalid binding.
        warn(`Invalid binding: consumer node has no property ${consumerPropertyKey}`);
        return undefined;
    }

    const consumerProperty = consumerNode[consumerPropertyKey];

    // Plain property binding.

    if (consumerElementIndex < 0) {
        return new RuntimePVNodePlainPropertyBinding(
            consumerNode,
            consumerPropertyKey,
            producerRecord,
            producerOutputIndex,
        );
    }

    // The following is dedicated to array element bindings.

    if (!Array.isArray(consumerProperty)) {
        // Invalid binding.
        warn(`Invalid binding: consumer node's input ${consumerPropertyKey} should be an array.`);
        return undefined;
    }

    if (consumerElementIndex >= consumerProperty.length) {
        // Invalid binding.
        warn(`Invalid binding: consumer node's input ${consumerPropertyKey} `
            + `have length ${consumerProperty.length} but the binding specified ${consumerElementIndex}`);
        return undefined;
    }

    return new RuntimePVNodeArrayElementPropertyBinding(
        consumerNode,
        consumerPropertyKey,
        consumerElementIndex,
        producerRecord,
        producerOutputIndex,
    );
}
