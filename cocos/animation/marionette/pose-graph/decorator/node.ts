import { error, js } from '../../../../core';
import { PoseGraphNode } from '../foundation/pose-graph-node';

import {
    PoseGraphCreateNodeFactory,
    PoseGraphNodeEditorMetadata,
    PoseGraphNodeAppearanceOptions,
    getOrCreateNodeEditorMetadata,
} from '../foundation/authoring/node-authoring';

export type {
    PoseGraphCreateNodeContext,
    PoseGraphCreateNodeEntry,
    PoseGraphCreateNodeFactory,
    PoseGraphNodeEditorMetadata,
    PoseGraphNodeAppearanceOptions,
} from '../foundation/authoring/node-authoring';

function makeNodeEditorMetadataModifier (edit: (metadata: PoseGraphNodeEditorMetadata) => void): ClassDecorator {
    return (target): void => {
        if (!checkDecoratingClass(target)) {
            return;
        }
        const metadata = getOrCreateNodeEditorMetadata(target);
        edit(metadata);
    };
}

export const poseGraphNodeCategory = (category: string): ClassDecorator => makeNodeEditorMetadataModifier((metadata): void => {
    metadata.category = category;
});

export const poseGraphCreateNodeFactory = (factory: PoseGraphCreateNodeFactory<any>): ClassDecorator => makeNodeEditorMetadataModifier((metadata): void => {
    metadata.factory = factory;
});

export const poseGraphNodeHide = (hide = true): ClassDecorator => makeNodeEditorMetadataModifier((metadata): void => {
    metadata.hide = hide;
});

export const poseGraphNodeAppearance = (
    appearance: Readonly<PoseGraphNodeAppearanceOptions>,
): ClassDecorator => makeNodeEditorMetadataModifier((metadata): void => {
    Object.assign(metadata.appearance ??= {}, appearance);
});

// eslint-disable-next-line @typescript-eslint/ban-types
function checkDecoratingClass (fn: Function): fn is Constructor<PoseGraphNode> {
    if (!js.isChildClassOf(fn, PoseGraphNode)) {
        error(`This kind of decorator should only be applied to pose graph node classes.`);
        return false;
    }
    return true;
}
