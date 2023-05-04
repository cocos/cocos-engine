import { PoseNode } from '../pose-node';
import { PoseGraphNodeInputInsertId, PoseGraphInputKey, globalNodeInputManager } from '../foundation/authoring/input-authoring';
import { XNode } from '../x-node';
import { assertIsTrue, error } from '../../../../core';
import { PoseGraphType } from '../foundation/type-system';
import { PoseGraphNode, shellTag } from '../foundation/pose-graph-node';
import { PoseGraphOutputNode } from '../graph-output-node';

export type {
    PoseGraphInputKey as InputKey,
    PoseGraphNodeInputMetadata as InputMetadata,
    PoseGraphNodeInputInsertId as InputInsertId,
} from '../foundation/authoring/input-authoring';

export type OutputKey = number;

export { PoseGraphNode as Node };

export { PoseGraphType };

const POSE_NODE_OUTPUT_BINDING_KEY = 0;

export function getInputKeys (node: PoseGraphNode) {
    return globalNodeInputManager.getInputKeys(node);
}

export function isValidInputKey (node: PoseGraphNode, key: PoseGraphInputKey) {
    return globalNodeInputManager.hasInput(node, key);
}

export function getInputMetadata (node: PoseGraphNode, key: PoseGraphInputKey) {
    return globalNodeInputManager.getInputMetadata(node, key);
}

export function getInputConstantValue (node: PoseGraphNode, key: PoseGraphInputKey): unknown {
    if (!globalNodeInputManager.hasInput(node, key)) {
        return undefined;
    }
    if (globalNodeInputManager.isPoseInput(node, key)) {
        // Pose input's "constant value" is defined as `null`.
        return null;
    }
    return getXNodeInputConstantValue(node, key);
}

export function getInputBinding (node: PoseGraphNode, key: PoseGraphInputKey): Readonly<{
    producer: PoseGraphNode;
    outputIndex: number;
}> | undefined {
    return node[shellTag]?.findBinding(key);
}

export function getInputInsertInfos (node: PoseGraphNode) {
    return globalNodeInputManager.getInputInsertInfos(node);
}

export function insertInput (node: PoseGraphNode, insertId: PoseGraphNodeInputInsertId) {
    return globalNodeInputManager.insertInput(node, insertId);
}

export function deleteInput (node: PoseGraphNode, key: PoseGraphInputKey) {
    globalNodeInputManager.deleteInput(node, key);
}

export const getOutputKeys = (() => {
    const poseNodeOutputKeys = Object.freeze([POSE_NODE_OUTPUT_BINDING_KEY]);

    return (node: PoseGraphNode): readonly OutputKey[] => {
        if (node instanceof PoseNode) {
            return poseNodeOutputKeys;
        } else if (node instanceof XNode) {
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
    } else if (node instanceof XNode) {
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

export function connectNode (node: PoseGraphNode, key: PoseGraphInputKey, producer: PoseGraphNode, outputKey?: OutputKey) {
    const consumerNode = node;
    const consumerShell = node[shellTag];
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
    if (producer instanceof XNode) {
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

export function disconnectNode (node: PoseGraphNode, key: PoseGraphInputKey) {
    node[shellTag]?.deleteBinding(key);
}

export function connectOutputNode(outputNode: PoseGraphOutputNode, producer: PoseNode) {
    const outputNodeInputKeys = getInputKeys(outputNode);
    assertIsTrue(outputNodeInputKeys.length === 1);
    connectNode(outputNode, outputNodeInputKeys[0], producer);
}

export function hasInputBinding (
    node: PoseGraphNode,
    key: PoseGraphInputKey,
    producerNode: PoseGraphNode,
    producerOutputKey: OutputKey,
) {
    const binding = getInputBinding(node, key);
    if (!binding) {
        return false;
    }
    return binding.producer === producerNode && binding.outputIndex === producerOutputKey;
}

function getXNodeInputConstantValue (node: PoseGraphNode, inputKey: PoseGraphInputKey): unknown {
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