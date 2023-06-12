import { PoseNode } from '../pose-node';
import { PoseGraphNodeInputInsertId, PoseGraphInputKey, globalPoseGraphNodeInputManager } from '../foundation/authoring/input-authoring';
import { PureValueNode } from '../pure-value-node';
import { assertIsTrue, error } from '../../../../core';
import { PoseGraphType } from '../foundation/type-system';
import { PoseGraphNode } from '../foundation/pose-graph-node';
import { PoseGraphOutputNode } from '../graph-output-node';
import type { PoseGraph } from '../pose-graph';

export type {
    PoseGraphInputKey as InputKey,
    PoseGraphNodeInputDisplayName as InputDisplayName,
    PoseGraphNodeInputMetadata as InputMetadata,
    PoseGraphNodeInputInsertId as InputInsertId,
} from '../foundation/authoring/input-authoring';

export type OutputKey = number;

export { PoseGraphNode as Node };

export { PoseGraphType };

const POSE_NODE_OUTPUT_BINDING_KEY = 0;

export function getInputKeys (node: PoseGraphNode) {
    return globalPoseGraphNodeInputManager.getInputKeys(node);
}

export function isValidInputKey (node: PoseGraphNode, key: PoseGraphInputKey) {
    return globalPoseGraphNodeInputManager.hasInput(node, key);
}

export function getInputMetadata (node: PoseGraphNode, key: PoseGraphInputKey) {
    return globalPoseGraphNodeInputManager.getInputMetadata(node, key);
}

export function getInputConstantValue (node: PoseGraphNode, key: PoseGraphInputKey): unknown {
    if (!globalPoseGraphNodeInputManager.hasInput(node, key)) {
        return undefined;
    }
    if (globalPoseGraphNodeInputManager.isPoseInput(node, key)) {
        // Pose input's "constant value" is defined as `null`.
        return null;
    }
    return getPureValueInputConstantValue(node, key);
}

export function getInputBinding (graph: PoseGraph, node: PoseGraphNode, key: PoseGraphInputKey): Readonly<{
    producer: PoseGraphNode;
    outputIndex: number;
}> | undefined {
    return graph.getShell(node)?.findBinding(key);
}

export function getInputInsertInfos (node: PoseGraphNode) {
    return globalPoseGraphNodeInputManager.getInputInsertInfos(node);
}

export function insertInput (graph: PoseGraph, node: PoseGraphNode, insertId: PoseGraphNodeInputInsertId) {
    return globalPoseGraphNodeInputManager.insertInput(graph, node, insertId);
}

export function deleteInput (graph: PoseGraph, node: PoseGraphNode, key: PoseGraphInputKey) {
    globalPoseGraphNodeInputManager.deleteInput(graph, node, key);
}

export const getOutputKeys = (() => {
    const poseNodeOutputKeys = Object.freeze([POSE_NODE_OUTPUT_BINDING_KEY]);

    return (node: PoseGraphNode): readonly OutputKey[] => {
        if (node instanceof PoseNode) {
            return poseNodeOutputKeys;
        } else if (node instanceof PureValueNode) {
            // TODO: optimize me
            const outputCount = node.outputCount;
            return Array.from({ length: outputCount }, (_, i) => i);
        } else {
            return [];
        }
    };
})();

export function getOutputType(node: PoseGraphNode, outputId: OutputKey) {
    if (node instanceof PoseNode) {
        return PoseGraphType.POSE;
    } else if (node instanceof PureValueNode) {
        const outputIndex = Number(outputId);
        if (outputIndex < 0 || outputIndex >= node.outputCount) {
            throw new Error(`${node} does not have specified output key ${outputId}`);
        } else {
            return node.getOutputType(outputIndex);
        }
    } else {
        throw new Error(`${node} does not have specified output key.`);
    }
}

export function connectNode (graph: PoseGraph, node: PoseGraphNode, key: PoseGraphInputKey, producer: PoseGraphNode, outputKey?: OutputKey) {
    const consumerNode = node;
    const consumerShell = graph.getShell(node);
    if (!consumerShell) {
        error(`Consumer node is not with in graph!`);
        return;
    }

    const inputMetadata = getInputMetadata(consumerNode, key);
    if (!inputMetadata) {
        error(`Consumer node does not have such specified input key ${key}`);
        return;
    }

    let outputIndex = 0;
    let outputType: PoseGraphType;
    if (producer instanceof PureValueNode) {
        if (typeof outputKey !== 'number') {
            error(`Output key is not specified.`);
            return;
        }
        const outputIndex = Number(outputKey);
        if (outputIndex < 0 || outputIndex >= producer.outputCount) {
            error(`Producer node does not have such specified output key ${key}`);
            return;
        }
        outputType = producer.getOutputType(outputIndex);
    } else {
        if ((outputKey ?? POSE_NODE_OUTPUT_BINDING_KEY) !== POSE_NODE_OUTPUT_BINDING_KEY) {
            error(`Pose nodes have and only have single output.`);
            return;
        }
        outputType = PoseGraphType.POSE;
    }
    
    const inputType = inputMetadata.type;
    if (inputType !== outputType) {
        error(`Type mismatch: input has type ${PoseGraphType[inputType]}, output has type ${PoseGraphType[outputType]}.`);
        return;
    }

    // We currently do not allow a pose producer to be connected to multiple consumers.
    if (outputType === PoseGraphType.POSE) {
        for (const node of graph.nodes()) {
            const shell = graph.getShell(node);
            assertIsTrue(shell);
            shell.deleteBindingTo(producer);
        }
    }

    const [
        propertyKey,
        elementIndex = -1,
    ] = key;
    const property = consumerNode[propertyKey];
    if (elementIndex >= 0) {
        if (!Array.isArray(property)) {
            return;
        }
        if (elementIndex >= property.length) {
            return;
        }
        consumerShell.addBinding([propertyKey, elementIndex], producer, outputIndex);
    } else {
        consumerShell.addBinding([propertyKey], producer, outputIndex);
    }
}

export function disconnectNode (graph: PoseGraph, node: PoseGraphNode, key: PoseGraphInputKey) {
    graph.getShell(node)?.deleteBinding(key);
}

export function connectOutputNode(graph: PoseGraph, producer: PoseNode) {
    const { outputNode } = graph;
    const outputNodeInputKeys = getInputKeys(outputNode);
    assertIsTrue(outputNodeInputKeys.length === 1);
    connectNode(graph, outputNode, outputNodeInputKeys[0], producer);
}

export function hasInputBinding (
    graph: PoseGraph,
    node: PoseGraphNode,
    key: PoseGraphInputKey,
    producerNode: PoseGraphNode,
    producerOutputKey: OutputKey,
) {
    const binding = getInputBinding(graph, node, key);
    if (!binding) {
        return false;
    }
    return binding.producer === producerNode && binding.outputIndex === producerOutputKey;
}

function getPureValueInputConstantValue (node: PoseGraphNode, inputKey: PoseGraphInputKey): unknown {
    const [
        propertyKey,
        elementIndex = -1,
     ] = inputKey;
    const property = node[propertyKey];
    if (!Array.isArray(property)) {
        return property;
    }
    if (elementIndex < 0 || elementIndex >= property.length) {
        return undefined;
    }
    return property[elementIndex];
}

export function isWellFormedInputKey(test: unknown): test is PoseGraphInputKey {
    if (!Array.isArray(test)) {
        return false;
    }
    if (test.length > 2) {
        return false;
    }
    if (typeof test[0] !== 'string') {
        return false;
    }
    if (test.length > 1) {
        const e1 = test[1];
        if (typeof e1 !== 'number' || e1 < 0 || !Number.isFinite(e1)) {
            return false;
        }
    }
    return true;
}
