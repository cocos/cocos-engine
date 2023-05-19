import { PoseGraphNode } from "../../../cocos/animation/marionette/pose-graph/foundation/pose-graph-node";
import {
    getPoseGraphNodeEditorMetadata, PoseGraphCreateNodeContext, PoseGraphNodeAppearanceOptions,
} from "../../../cocos/animation/marionette/pose-graph/foundation/authoring/node-authoring";
import { js } from "../../../cocos/core/utils";
import { PoseNode } from "../../../cocos/animation/marionette/pose-graph/pose-node";
import { PureValueNode } from "../../../cocos/animation/marionette/pose-graph/pure-value-node";
import { poseGraphOp } from '../../../cocos/animation/marionette/pose-graph/op';

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

    if ((classConstructor as AbstractedConstructor) === PoseNode || (classConstructor as AbstractedConstructor) === PureValueNode) {
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
        yield* nodeClassMetadata.factory.listEntries(createNodeContext);
        return;
    }
    yield { arg: undefined, category: nodeClassMetadata.category };
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
