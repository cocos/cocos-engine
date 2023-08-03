import { PoseGraphNode } from "../../../cocos/animation/marionette/pose-graph/foundation/pose-graph-node";
import {
    getPoseGraphNodeEditorMetadata, PoseGraphCreateNodeContext, PoseGraphNodeAppearanceOptions,
} from "../../../cocos/animation/marionette/pose-graph/foundation/authoring/node-authoring";
import { Layer, poseGraphOp } from "../../exports/new-gen-anim";
import { instantiate } from "../../../cocos/serialization";
import { PoseGraphOutputNode } from "../../../cocos/animation/marionette/pose-graph/graph-output-node";
import { PoseNode } from "../../../cocos/animation/marionette/pose-graph/pose-node";
import { PureValueNode } from "../../../cocos/animation/marionette/pose-graph/pure-value-node";
import { assertIsTrue, editorExtrasTag } from "../../../exports/base";
import { PoseNodeUseStashedPose } from '../../../cocos/animation/marionette/pose-graph/pose-nodes/use-stashed-pose';
import { PoseGraphStash, StateMachine } from "../../../cocos/animation/marionette/animation-graph";
import { PoseNodeLocation, visitPoseNodeInLayer } from "./visit/visit-pose-node";
import { PoseGraph } from '../../../cocos/animation/marionette/pose-graph/pose-graph';
import { PoseNodeStateMachine } from "../../../cocos/animation/marionette/pose-graph/pose-nodes/state-machine";
import { attr } from "../../../cocos/core/data/utils/attribute";

type Constructor<T = unknown> = new (...args: any[]) => T;

export interface PoseGraphCreateNodeEntry {
    category?: string;

    subMenu?: string;

    arg: unknown;
}

export function* getCreatePoseGraphNodeEntries(
    classConstructor: Constructor<PoseGraphNode>,
    createNodeContext: PoseGraphCreateNodeContext,
): Iterable<PoseGraphCreateNodeEntry> {
    type AbstractedConstructor<T = unknown> = abstract new (...args: any[]) => T;

    if ((classConstructor as AbstractedConstructor) === PoseNode || (classConstructor as AbstractedConstructor) === PureValueNode ||
        classConstructor === PoseGraphOutputNode) {
        return;
    }
    const nodeClassMetadata = getPoseGraphNodeEditorMetadata(classConstructor as Constructor<PoseNode | PureValueNode>);
    if (!nodeClassMetadata) {
        yield { arg: undefined };
        return;
    }
    if (nodeClassMetadata.hide) {
        return;
    }
    if (nodeClassMetadata.factory) {
        for (const entry of nodeClassMetadata.factory.listEntries(createNodeContext)) {
            yield {
                category: nodeClassMetadata.category,
                subMenu: entry.menu,
                arg: entry.arg,
            };
        }
    } else {
        yield { arg: undefined, category: nodeClassMetadata.category };
    }
}

export function createPoseGraphNode(
    classConstructor: Constructor<PoseGraphNode>,
    arg: unknown,
): PoseGraphNode {
    const nodeClassMetadata = getPoseGraphNodeEditorMetadata(classConstructor as Constructor<PoseNode | PureValueNode>);
    if (nodeClassMetadata?.factory) {
        return nodeClassMetadata.factory.create(arg) as PoseNode | PureValueNode;
    }
    return new classConstructor();
}

export type { PoseGraphCreateNodeContext };

export type { PoseGraphNodeAppearanceOptions };

export function getNodeAppearanceOptions(node: PoseGraphNode) {
    const classConstructor = node.constructor as Constructor<PoseGraphNode>;
    const metadata = getPoseGraphNodeEditorMetadata(classConstructor);
    return metadata?.appearance;
}

export function getInputConventionalI18nInfo(inputKey: poseGraphOp.InputKey): [string, Record<string, string | number>?] {
    if (inputKey.length !== 1) {
        return [`inputs.${inputKey[0]}`, { elementIndex: inputKey[1] }];
    } else {
        return [`inputs.${inputKey}`];
    }
}

export function getInputDefaultDisplayName(inputKey: poseGraphOp.InputKey) {
    if (inputKey.length === 1) {
        return inputKey[0];
    } else {
        return `${inputKey[0]}[${inputKey[1]}]`;
    }
}

export function getPoseGraphNodeInputAttrs(node: PoseGraphNode, inputKey: poseGraphOp.InputKey) {
    const [propertyName] = inputKey;
    const attrs = attr(node.constructor, propertyName);
    delete attrs.type;
    delete attrs.ctor;
    if (Array.isArray(node[propertyName])) {
        delete attrs['default'];
    }
    return attrs;
}

function clonePoseGraphNode(node: PoseGraphNode) {
    return instantiate(node);
}

interface PoseGraphOutputNodeCopyInfo {
    editorExtras: PoseGraphOutputNode[typeof editorExtrasTag];
}

function copyPoseGraphOutputNode(node: PoseGraphOutputNode): PoseGraphOutputNodeCopyInfo {
    return {
        editorExtras: instantiate(node[editorExtrasTag]),
    };
}

function pastPoseGraphOutputNode(node: PoseGraphOutputNode, copyInfo: PoseGraphOutputNodeCopyInfo) {
    node[editorExtrasTag] = copyInfo.editorExtras;
}

interface PoseGraphNodesCopyInfo {
    nodes: (PoseGraphNode | PoseGraphOutputNodeCopyInfo)[];

    bindings: Array<{
        consumer: number;
        inputKey: poseGraphOp.InputKey;
        producer: number;
        outputKey: poseGraphOp.OutputKey;
    }>;
}

function cloneInputKey(inputKey: poseGraphOp.InputKey) {
    assertIsTrue(Array.isArray(inputKey) && inputKey.every((v) => typeof v === 'number' || typeof v === 'string'));
    return inputKey.slice() as unknown as poseGraphOp.InputKey;
}

export interface CopyPoseGraphNodesOptions {
    copyOutputNodeEditorExtras?: boolean;
}

export function copyPoseGraphNodes(poseGraph: PoseGraph, nodes: PoseGraphNode[], options: CopyPoseGraphNodesOptions = {
    copyOutputNodeEditorExtras: true,
}): PoseGraphNodesCopyInfo {
    const nodesDeduplicated = [...new Set(nodes)];

    // Copy nodes.
    const nodeCopyInfos = nodesDeduplicated.map((node) => {
        if (node === poseGraph.outputNode) {
            return options.copyOutputNodeEditorExtras ? copyPoseGraphOutputNode(poseGraph.outputNode) : {} as PoseGraphOutputNodeCopyInfo;
        } else {
            return clonePoseGraphNode(node);
        }
    });

    // Copy bindings.
    const bindingCopyInfos: PoseGraphNodesCopyInfo['bindings'] = [];
    nodesDeduplicated.forEach((node, consumerNodeIndex) => {
        for (const inputKey of poseGraphOp.getInputKeys(node)) {
            const binding = poseGraphOp.getInputBinding(poseGraph, node, inputKey);
            if (!binding) {
                continue;
            }
            const producerNode = binding.producer;
            const producerNodeIndex = nodesDeduplicated.indexOf(producerNode);
            if (producerNodeIndex < 0) {
                continue;
            }
            bindingCopyInfos.push({
                consumer: consumerNodeIndex,
                inputKey: cloneInputKey(inputKey),
                producer: producerNodeIndex,
                outputKey: binding.outputIndex,
            });
        }
    });

    return {
        nodes: nodeCopyInfos,
        bindings: bindingCopyInfos,
    };
}

export function copyStateMachineAsPoseGraphNode(stateMachine: StateMachine) {
    const poseGraph = new PoseGraph();
    const stateMachineNode = poseGraph.addNode(new PoseNodeStateMachine());
    stateMachine.copyTo(stateMachineNode.stateMachine);
    return copyPoseGraphNodes(poseGraph, [stateMachineNode]);
}

export interface pastePoseGraphNodesResult {
    addedNodes: PoseGraphNode[];
}

export interface PastePoseGraphNodesOptions {
    outputNodeBindingRedirect?: {
        consumerNode: PoseNode;
        inputKey: poseGraphOp.InputKey;
    };
}

export function pastePoseGraphNodes(
    poseGraph: PoseGraph, copyInfo: PoseGraphNodesCopyInfo,
    options: PastePoseGraphNodesOptions = { },
) {
    const { nodes: nodeCopyInfos, bindings: bindingCopyInfos } = copyInfo;

    const addedNodes: PoseGraphNode[] = [];

    // Past nodes.
    for (const nodeCopyInfo of nodeCopyInfos) {
        if (nodeCopyInfo instanceof PoseGraphNode) {
            nodeCopyInfo.__callOnAfterDeserializeRecursive?.();
            poseGraph.addNode(nodeCopyInfo);
            addedNodes.push(nodeCopyInfo);
        } else {
            pastPoseGraphOutputNode(poseGraph.outputNode, nodeCopyInfo);
        }
    }

    // Paste bindings.
    for (const { consumer, inputKey, producer, outputKey } of bindingCopyInfos) {
        assertIsTrue(consumer >= 0 && consumer < nodeCopyInfos.length);
        assertIsTrue(producer >= 0 && producer < nodeCopyInfos.length);
        const consumerCopyInfo = nodeCopyInfos[consumer];
        const producerNode = nodeCopyInfos[producer];
        assertIsTrue(producerNode instanceof PoseGraphNode);
        if (!(consumerCopyInfo instanceof PoseGraphNode) && options.outputNodeBindingRedirect) {
            poseGraphOp.connectNode(
                poseGraph,
                options.outputNodeBindingRedirect.consumerNode,
                options.outputNodeBindingRedirect.inputKey,
                producerNode,
                outputKey,
            );
            continue;
        }
        const consumerNode = consumerCopyInfo instanceof PoseGraphNode
            ? consumerCopyInfo
            : poseGraph.outputNode;
        poseGraphOp.connectNode(
            poseGraph,
            consumerNode,
            inputKey,
            producerNode,
            outputKey,
        );
    }

    // We're doing a cut.
    nodeCopyInfos.length = 0;
    bindingCopyInfos.length = 0;

    return {
        addedNodes,
    };
}

export interface StashPoseGraphResult {
    /**
     * Newly created stash.
     */
    stash: PoseGraphStash;

    /**
     * The `PoseNodeUseStashedPose` node added into the graph.
     */
    useStashNode: PoseGraphNode; // Don't expose the node type.
}

/**
 * Stash specified pose graph.
 * 
 * Creates a stash, then move all contents in the pose graph into the stash.
 * Then, create a "PoseNodeUseStashedPose" node to reference the newly created stash.
 * 
 * @param layer The layer that the pose graph belongs to.
 * @param poseGraph The pose graph to stash.
 * @param newStashId Id of the newStash.
 * @returns The stash operation result, or undefined if error occurred.
 */
export function stashPoseGraph(
    layer: Layer,
    poseGraph: PoseGraph,
    newStashId: string,
): StashPoseGraphResult | undefined {
    // Stash already exists.
    if (layer.getStash(newStashId)) {
        return undefined;
    }

    const stash = layer.addStash(newStashId);

    // Copy nodes into stash graph.
    const copyInfo = copyPoseGraphNodes(poseGraph, [...poseGraph.nodes()]);
    pastePoseGraphNodes(stash.graph, copyInfo);

    // Clear original graph.
    for (const node of [...poseGraph.nodes()]) {
        if (node !== poseGraph.outputNode) {
            poseGraph.removeNode(node);
        }
    }

    // Add a `Use stash node into original graph.`
    const useStashNode = new PoseNodeUseStashedPose();
    useStashNode.stashName = newStashId;
    poseGraph.addNode(useStashNode);

    return {
        stash,
        useStashNode: useStashNode as PoseGraphNode, // Don't expose the node type.
    };
}

export interface StashReference {
    location: PoseNodeLocation;

    alterReference(newStashName: string): void;
}

export function* visitStashReferences(layer: Layer, stashId: string): Generator<StashReference> {
    for (const poseNodeLocation of visitPoseNodeInLayer(layer)) {
        const [poseNode] = poseNodeLocation;
        if (poseNode instanceof PoseNodeUseStashedPose && poseNode.stashName === stashId) {
            yield {
                location: poseNodeLocation,
                alterReference(newStashName: string) {
                    poseNode.stashName = newStashName;
                },
            };
        }
    }
}

export * from './pose-graph/drag';
