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
    return (target) => {
        if (!checkDecoratingClass(target)) {
            return;
        }
        const metadata = getOrCreateNodeEditorMetadata(target);
        edit(metadata);
    };
}

export const poseGraphNodeCategory = (category: string) => makeNodeEditorMetadataModifier((metadata) => {
    metadata.category = category;
});

export const poseGraphCreateNodeFactory = (factory: PoseGraphCreateNodeFactory<any>) => makeNodeEditorMetadataModifier((metadata) => {
    metadata.factory = factory;
});

export const poseGraphNodeHide = (hide = true) => makeNodeEditorMetadataModifier((metadata) => {
    metadata.hide = hide;
});

export const poseGraphNodeAppearance = (
    appearance: Readonly<PoseGraphNodeAppearanceOptions>,
) => makeNodeEditorMetadataModifier((metadata) => {
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
