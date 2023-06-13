import { ClipMotion, AnimationBlend, AnimationBlend1D, AnimationBlend2D } from '../../motion';
import { Motion } from '../../motion/motion';
import { EnterNodeInfo } from '../foundation/authoring/enter-node-info';
import { PoseGraphCreateNodeEntry, PoseGraphCreateNodeFactory } from '../decorator/node';
import { PoseNode } from '../pose-node';
import type { PoseGraphNode } from '../foundation/pose-graph-node';

export {};

export function getEnterInfo (this: { motion: Motion | null }): EnterNodeInfo | undefined {
    if (!this.motion || !(this.motion instanceof AnimationBlend)) {
        return undefined;
    }
    return {
        type: 'animation-blend',
        target: this.motion,
    };
}

type CreateNodeArg = {
    type: 'clip-motion';
} | {
    type: 'animation-blend-1d' | 'animation-blend-2d';
};

export function makeCreateNodeFactory (
    create_: (motion: Motion | null) => PoseNode,
): PoseGraphCreateNodeFactory<CreateNodeArg> {
    return {
        listEntries: (context): Iterable<PoseGraphCreateNodeEntry<CreateNodeArg>> => [{
            arg: { type: 'clip-motion' },
            menu: 'i18n:ENGINE.animation_graph.pose_graph_node_sub_menus.play_or_sample_clip_motion',
        }, {
            arg: { type: 'animation-blend-1d' },
            menu: 'i18n:ENGINE.animation_graph.pose_graph_node_sub_menus.play_or_sample_animation_blend_1d',
        }, {
            arg: { type: 'animation-blend-2d' },
            menu: 'i18n:ENGINE.animation_graph.pose_graph_node_sub_menus.play_or_sample_animation_blend_2d',
        }],
        create: (arg): PoseGraphNode => {
            let motion: Motion | null = null;
            switch (arg.type) {
            case 'clip-motion': motion = new ClipMotion(); break;
            case 'animation-blend-1d': motion = new AnimationBlend1D(); break;
            case 'animation-blend-2d': motion = new AnimationBlend2D(); break;
            default: break;
            }
            return create_(motion);
        },
    };
}

export function getTileBase (titleI18nKey: string, motion: Motion | null): [string, Record<string, string>] | undefined {
    let motionName = '';
    if (motion instanceof ClipMotion) {
        if (!motion.clip) {
            return undefined;
        } else {
            motionName = motion.clip.name;
        }
    } else {
        motionName = 'Unnamed Animation Blend';
    }
    return [titleI18nKey, { motionName }] as [string, Record<string, string>];
}
