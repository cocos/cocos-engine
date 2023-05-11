import { PoseGraphNode } from "../../../cocos/animation/marionette/pose-graph/foundation/pose-graph-node";
import {
    getPoseGraphNodeEditorMetadata, PoseGraphCreateNodeContext, PoseGraphNodeAppearanceOptions,
} from "../../../cocos/animation/marionette/pose-graph/foundation/authoring/node-authoring";
import { js } from "../../../cocos/core/utils";
import { PoseNode } from "../../../cocos/animation/marionette/pose-graph/pose-node";
import { PureValueNode } from "../../../cocos/animation/marionette/pose-graph/pure-value-node";

type Constructor<T = unknown> = new (...args: any[]) => T;

export interface PoseGraphCreateNodeEntry {
    menu: string;

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
    if (nodeClassMetadata) {
        if (nodeClassMetadata.factory) {
            yield* nodeClassMetadata.factory.listEntries(createNodeContext);
            return;
        } else if (nodeClassMetadata.menu) {
            yield { arg: undefined, menu: nodeClassMetadata.menu };
            return;
        } else if (nodeClassMetadata.hide) {
            return;
        }
    }
    const displayName = js.getClassName(classConstructor) || classConstructor.name;
    yield { arg: undefined, menu: displayName };
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

export function getNodeTitle(node: PoseGraphNode) {
    if (node.getTitle) {
        return node.getTitle();
    }
    const classConstructor = node.constructor as Constructor<PoseNode | PureValueNode>;
    const metadata = getPoseGraphNodeEditorMetadata(classConstructor);
    if (metadata?.menu) {
        return metadata.menu.split('/').pop() ?? '';
    }
    const className = js.getClassName(node);
    if (className) {
        return className;
    }
    return classConstructor.name;
}

export type { PoseGraphNodeAppearanceOptions };

export function getNodeAppearanceOptions(node: PoseGraphNode) {
    const classConstructor = node.constructor as Constructor<PoseGraphNode>;
    const metadata = getPoseGraphNodeEditorMetadata(classConstructor);
    return metadata?.appearance;
}
